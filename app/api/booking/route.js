import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PAYMENT_TYPES = new Set(["Full", "Installment"]);

class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const {
      leaderId,
      bookedDate,
      selections,
      payment: { paymentType, method, transactionId },
    } = payload;

    const bookingDate = new Date(bookedDate);
    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid bookedDate provided" },
        { status: 400 }
      );
    }

    const sessionIds = [...new Set(selections.map((selection) => selection.sessionId))];
    const sessions = await prisma.session.findMany({
      where: { id: { in: sessionIds } },
      select: {
        id: true,
        programId: true,
        startTime: true,
        endTime: true,
        price: true,
        sessionTypes: {
          select: { id: true, price: true },
        },
      },
    });

    if (sessions.length !== sessionIds.length) {
      return NextResponse.json(
        { success: false, error: "One or more sessions do not exist" },
        { status: 400 }
      );
    }

    const programIds = [...new Set(sessions.map((session) => session.programId))];
    const programs = await prisma.program.findMany({
      where: { id: { in: programIds } },
      select: {
        id: true,
        seats: true,
      },
    });

    const programMap = new Map(programs.map((program) => [program.id, program]));
    const sessionMap = new Map(sessions.map((session) => [session.id, session]));

    try {
      validateSessionConflicts(selections, sessionMap);
    } catch (conflictError) {
      return NextResponse.json(
        { success: false, error: conflictError.message },
        { status: 400 }
      );
    }

    let pricing;

    try {
      pricing = calculatePrice(selections, sessionMap);
    } catch (pricingError) {
      return NextResponse.json(
        { success: false, error: pricingError.message },
        { status: 400 }
      );
    }

    const totalAmount = pricing.reduce((sum, item) => sum + item.total, 0);

    const booking = await prisma.$transaction(async (tx) => {
      const availabilityRecords = await validateAvailability(
        tx,
        bookingDate,
        selections,
        sessionMap,
        programMap
      );

      const paymentRecord = await tx.payment.upsert({
        where: { transactionId },
        update: {
          amount: totalAmount,
          method,
        },
        create: {
          amount: totalAmount,
          method,
          transactionId,
        },
      });

      const bookingRecord = await tx.booking.create({
        data: {
          leaderId,
          bookedDate: bookingDate,
          paymentType,
          amount: totalAmount,
          balance: paymentType === "Full" ? 0 : totalAmount,
          paymentId: paymentRecord.id,
          status: "PENDING",
        },
      });

      const selectionCustomerIds = await createCustomerRecords(
        tx,
        leaderId,
        selections
      );

      await createBookingItems(
        tx,
        bookingRecord.id,
        bookingDate,
        selections,
        selectionCustomerIds
      );

      // Group decrements by sessionId
      const decrementMap = new Map();
      for (const selection of selections) {
        const current = decrementMap.get(selection.sessionId) || 0;
        decrementMap.set(selection.sessionId, current + selection.seatsRequested);
      }

      // Update availability for each unique session
      for (const [sessionId, totalDecrement] of decrementMap) {
        const availability = availabilityRecords.find(
          (record) => record.sessionId === sessionId
        );

        if (!availability) {
          throw new HttpError(`Availability record not found for session ${sessionId}`);
        }

        const updateResult = await tx.availability.updateMany({
          where: {
            id: availability.id,
            availableSeats: {
              gte: totalDecrement,
            },
          },
          data: {
            availableSeats: {
              decrement: totalDecrement,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new HttpError(
            `Insufficient seats remaining for session ${sessionId}`,
            409
          );
        }
      }

      return bookingRecord;
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Booking creation failed", error);
    const status = error instanceof HttpError ? error.status : 500;
    const message =
      error?.message || "An unexpected error occurred while creating the booking";

    return NextResponse.json({ success: false, error: message }, { status });
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Invalid request payload";
  }

  const { leaderId, bookedDate, selections, payment } = payload;

  if (!leaderId) {
    return "leaderId is required";
  }

  if (!bookedDate) {
    return "bookedDate is required";
  }

  if (!Array.isArray(selections) || selections.length === 0) {
    return "At least one selection is required";
  }

  for (const selection of selections) {
    if (!selection.sessionId) {
      return "Each selection must include sessionId";
    }

    if (!selection.seatsRequested || selection.seatsRequested <= 0) {
      return "seatsRequested must be greater than 0";
    }
  }

  if (!payment) {
    return "Payment details are required";
  }

  if (!PAYMENT_TYPES.has(payment.paymentType)) {
    return "Unsupported payment type";
  }

  if (!payment.method) {
    return "Payment method is required";
  }

  if (!payment.transactionId) {
    return "Payment transactionId is required";
  }

  return null;
}

function validateSessionConflicts(selections, sessionMap) {
  if (selections.length <= 1) {
    return;
  }

  const intervals = selections.map((selection) => {
    const session = sessionMap.get(selection.sessionId);

    if (!session) {
      throw new HttpError(`Session ${selection.sessionId} not found`);
    }

    const startTime = session.startTime?.getTime?.();
    const endTime = session.endTime?.getTime?.();

    if (typeof startTime !== "number" || typeof endTime !== "number") {
      throw new HttpError("Session times are missing or invalid");
    }

    if (endTime <= startTime) {
      throw new HttpError(
        `Session ${selection.sessionId} has an invalid time range`
      );
    }

    return {
      sessionId: selection.sessionId,
      start: startTime,
      end: endTime,
    };
  });

  intervals.sort((a, b) => a.start - b.start);

  for (let index = 1; index < intervals.length; index += 1) {
    const previous = intervals[index - 1];
    const current = intervals[index];

    if (previous.start < current.end && previous.end > current.start) {
      throw new HttpError(
        `Session ${previous.sessionId} overlaps with session ${current.sessionId}`
      );
    }
  }
}

async function validateAvailability(tx, bookedDate, selections, sessionMap, programMap) {
  const availabilityRecords = [];
  const sessionTotals = new Map();

  // Aggregate seats requested per session
  for (const selection of selections) {
    const current = sessionTotals.get(selection.sessionId) || 0;
    sessionTotals.set(selection.sessionId, current + selection.seatsRequested);
  }

  // For each unique session, find or create availability
  for (const [sessionId, totalSeatsRequested] of sessionTotals) {
    const session = sessionMap.get(sessionId);
    if (!session) {
      throw new HttpError(`Session ${sessionId} not found`);
    }

    const program = programMap.get(session.programId);
    if (!program) {
      throw new HttpError(`Program ${session.programId} not found`);
    }

    let availability = await tx.availability.findFirst({
      where: {
        sessionId,
        date: bookedDate,
      },
    });

    if (!availability) {
      // Create availability with full capacity
      const fullCapacity = program.seats;
      if (fullCapacity === null || fullCapacity === undefined) {
        throw new HttpError(`Seats not configured for program ${session.programId}`);
      }

      availability = await tx.availability.create({
        data: {
          sessionId,
          date: bookedDate,
          availableSeats: fullCapacity,
        },
      });
    }

    if (availability.availableSeats < totalSeatsRequested) {
      throw new HttpError(
        `Not enough seats available for session ${sessionId}`,
        409
      );
    }
  }

  // Now build the records array in selection order
  for (const selection of selections) {
    const availability = await tx.availability.findFirst({
      where: {
        sessionId: selection.sessionId,
        date: bookedDate,
      },
    });

    // Should always exist now
    availabilityRecords.push(availability);
  }

  return availabilityRecords;
}

function calculatePrice(selections, sessionMap) {
  return selections.map((selection) => {
    const session = sessionMap.get(selection.sessionId);

    if (!session) {
      throw new HttpError(`Session ${selection.sessionId} not found`);
    }

    let unitPrice = session.price ?? null;

    if (selection.sessionTypeId) {
      const sessionType = session.sessionTypes.find(
        (type) => type.id === selection.sessionTypeId
      );

      if (!sessionType) {
        throw new HttpError(
          `Session type ${selection.sessionTypeId} does not belong to session ${selection.sessionId}`
        );
      }

      unitPrice = sessionType.price;
    }

    if (unitPrice === null || unitPrice === undefined) {
      throw new HttpError(`Price not configured for session ${selection.sessionId}`);
    }

    const total = unitPrice * selection.seatsRequested;

    return {
      sessionId: selection.sessionId,
      unitPrice,
      seatsRequested: selection.seatsRequested,
      total,
    };
  });
}

async function createCustomerRecords(tx, leaderId, selections) {
  const selectionCustomerIds = [];

  for (const selection of selections) {
    const { seatsRequested, customers } = selection;

    if (seatsRequested > 1) {
      if (!Array.isArray(customers) || customers.length !== seatsRequested) {
        throw new HttpError(
          `Expected ${seatsRequested} customers for session ${selection.sessionId}`
        );
      }

      const customerIds = [];

      for (const customerData of customers) {
        if (!customerData?.name || !customerData?.email) {
          throw new HttpError("Customer name and email are required");
        }

        const existingCustomer = await tx.customer.findUnique({
          where: { email: customerData.email },
        });

        if (existingCustomer) {
          if (existingCustomer.leaderId !== leaderId) {
            throw new HttpError(
              `Customer ${customerData.email} is already registered with another leader`
            );
          }

          const updatedCustomer = await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              name: customerData.name,
              phone: customerData.phone ?? existingCustomer.phone,
              nic: customerData.nic ?? existingCustomer.nic,
            },
          });

          customerIds.push(updatedCustomer.id);
        } else {
          const createdCustomer = await tx.customer.create({
            data: {
              leaderId,
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone ?? null,
              nic: customerData.nic ?? null,
            },
          });

          customerIds.push(createdCustomer.id);
        }
      }

      selectionCustomerIds.push(customerIds);
    } else if (
      seatsRequested === 1 &&
      Array.isArray(customers) &&
      customers.length === 1
    ) {
      const customerData = customers[0];

      if (!customerData?.name || !customerData?.email) {
        throw new HttpError("Customer name and email are required");
      }

      const existingCustomer = await tx.customer.findUnique({
        where: { email: customerData.email },
      });

      if (existingCustomer) {
        if (existingCustomer.leaderId !== leaderId) {
          throw new HttpError(
            `Customer ${customerData.email} is already registered with another leader`
          );
        }

        const updatedCustomer = await tx.customer.update({
          where: { id: existingCustomer.id },
          data: {
            name: customerData.name,
            phone: customerData.phone ?? existingCustomer.phone,
            nic: customerData.nic ?? existingCustomer.nic,
          },
        });

        selectionCustomerIds.push([updatedCustomer.id]);
      } else {
        const createdCustomer = await tx.customer.create({
          data: {
            leaderId,
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone ?? null,
            nic: customerData.nic ?? null,
          },
        });

        selectionCustomerIds.push([createdCustomer.id]);
      }
    } else {
      selectionCustomerIds.push([]);
    }
  }

  return selectionCustomerIds;
}

async function createBookingItems(
  tx,
  bookingId,
  bookedDate,
  selections,
  selectionCustomerIds
) {
  for (let index = 0; index < selections.length; index += 1) {
    const selection = selections[index];
    const customerIds = selectionCustomerIds[index];

    if (selection.seatsRequested === 1 && customerIds.length === 0) {
      await tx.bookingItem.create({
        data: {
          bookingId,
          sessionId: selection.sessionId,
          sessionTypeId: selection.sessionTypeId ?? null,
          quantity: 1,
          customerId: null,
          date: bookedDate,
        },
      });

      continue;
    }

    if (selection.seatsRequested > 1) {
      if (customerIds.length !== selection.seatsRequested) {
        throw new HttpError(
          `Customer records mismatch for session ${selection.sessionId}`
        );
      }

      for (const customerId of customerIds) {
        await tx.bookingItem.create({
          data: {
            bookingId,
            sessionId: selection.sessionId,
            sessionTypeId: selection.sessionTypeId ?? null,
            quantity: 1,
            customerId,
            date: bookedDate,
          },
        });
      }

      continue;
    }

    if (selection.seatsRequested === 1 && customerIds.length === 1) {
      await tx.bookingItem.create({
        data: {
          bookingId,
          sessionId: selection.sessionId,
          sessionTypeId: selection.sessionTypeId ?? null,
          quantity: 1,
          customerId: customerIds[0],
          date: bookedDate,
        },
      });
    }
  }
}
