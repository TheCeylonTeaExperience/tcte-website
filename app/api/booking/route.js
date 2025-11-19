import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Generate a unique reference code
function generateReferenceCode() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TT-${year}-${randomNum}`;
}

// Send confirmation email
async function sendConfirmationEmail(bookingData, referenceCode) {
  // Configure your email service here
  // For production, use environment variables for credentials
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = `
    <h1>Booking Confirmation - THE CEYLON TEA</h1>
    <p>Dear ${bookingData.name},</p>
    <p>Thank you for booking your tea experience with us!</p>
    
    <h2>Booking Details:</h2>
    <ul>
      <li><strong>Reference Code:</strong> ${referenceCode}</li>
      <li><strong>Date:</strong> ${bookingData.date}</li>
      <li><strong>Session:</strong> ${bookingData.session}</li>
      <li><strong>Location:</strong> ${bookingData.location}</li>
      <li><strong>Programs:</strong> ${bookingData.programs.join(", ")}</li>
      <li><strong>Number of People:</strong> ${bookingData.packs}</li>
      <li><strong>Payment Option:</strong> ${bookingData.payment}</li>
    </ul>
    
    ${bookingData.notes ? `<p><strong>Your Notes:</strong> ${bookingData.notes}</p>` : ""}
    
    <h3>Important Information:</h3>
    <ul>
      <li>Please arrive 15 minutes before your scheduled session</li>
      <li>Wear comfortable clothing and walking shoes</li>
      <li>Bring sun protection (hat, sunscreen)</li>
      ${bookingData.payment === "partial" ? "<li>Remember to bring at least 25% of the total payment</li>" : ""}
    </ul>
    
    <p>We look forward to welcoming you!</p>
    <p>For any queries, please contact us at:</p>
    <p>Phone: +1 (234) 567-890<br>
    Email: info@ceylontea.com</p>
    
    <p>Best regards,<br>
    THE CEYLON TEA Team</p>
  `;

  // Send to customer
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "info@ceylontea.com",
    to: bookingData.email,
    subject: `Booking Confirmation - ${referenceCode}`,
    html: emailContent,
  });

  // Send copy to owner
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "info@ceylontea.com",
    to: process.env.OWNER_EMAIL || "owner@ceylontea.com",
    subject: `New Booking - ${referenceCode}`,
    html: `
      <h1>New Booking Received</h1>
      ${emailContent}
      <hr>
      <p><strong>Contact Details:</strong></p>
      <p>Phone: ${bookingData.countryCode} ${bookingData.phone}</p>
    `,
  });
}

// Save to Google Sheets
async function saveToGoogleSheets(bookingData, referenceCode) {
  // Google Sheets webhook/Apps Script endpoint
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;

  if (!webhookUrl) {
    console.warn("Google Sheets webhook not configured");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        referenceCode,
        ...bookingData,
        programs: bookingData.programs.join(", "),
      }),
    });

    if (!response.ok) {
      console.error("Failed to save to Google Sheets");
    }
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
  }
}

export async function POST(request) {
  try {
    const bookingData = await request.json();

    // Validate required fields
    if (
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.location ||
      !bookingData.date ||
      !bookingData.session ||
      !bookingData.programs ||
      bookingData.programs.length === 0 ||
      !bookingData.payment
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate reference code
    const referenceCode = generateReferenceCode();

    // Send confirmation emails
    try {
      await sendConfirmationEmail(bookingData, referenceCode);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue even if email fails
    }

    // Save to Google Sheets
    try {
      await saveToGoogleSheets(bookingData, referenceCode);
    } catch (sheetsError) {
      console.error("Google Sheets save failed:", sheetsError);
      // Continue even if sheets save fails
    }

    return NextResponse.json({
      success: true,
      referenceCode,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
