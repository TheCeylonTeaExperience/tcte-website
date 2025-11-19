"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";

// Dummy availability data until the API layer is ready
const SEASON_AVAILABILITY = {
  "2025-11-20": [
    {
      id: "N1",
      window: "08:00 - 10:00",
      activities: [
        { name: "Plucking", available: 2, capacity: 8 },
        { name: "Making", available: 4, capacity: 10 },
        { name: "Tasting", available: 1, capacity: 6 },
      ],
    },
    {
      id: "N2",
      window: "10:30 - 12:30",
      activities: [
        { name: "Plucking", available: 3, capacity: 8 },
        { name: "Making", available: 2, capacity: 10 },
        { name: "Tasting", available: 2, capacity: 6 },
      ],
    },
    {
      id: "N3",
      window: "14:00 - 16:00",
      activities: [
        { name: "Plucking", available: 4, capacity: 8 },
        { name: "Making", available: 1, capacity: 10 },
        { name: "Tasting", available: 3, capacity: 6 },
      ],
    },
    {
      id: "N4",
      window: "16:30 - 18:30",
      activities: [
        { name: "Plucking", available: 1, capacity: 8 },
        { name: "Making", available: 5, capacity: 10 },
        { name: "Tasting", available: 2, capacity: 6 },
      ],
    },
  ],
  fallback: [
    {
      id: "N1",
      window: "08:00 - 10:00",
      activities: [
        { name: "Plucking", available: 5, capacity: 8 },
        { name: "Making", available: 6, capacity: 10 },
        { name: "Tasting", available: 4, capacity: 6 },
      ],
    },
    {
      id: "N2",
      window: "10:30 - 12:30",
      activities: [
        { name: "Plucking", available: 4, capacity: 8 },
        { name: "Making", available: 5, capacity: 10 },
        { name: "Tasting", available: 3, capacity: 6 },
      ],
    },
    {
      id: "N3",
      window: "14:00 - 16:00",
      activities: [
        { name: "Plucking", available: 6, capacity: 8 },
        { name: "Making", available: 4, capacity: 10 },
        { name: "Tasting", available: 5, capacity: 6 },
      ],
    },
    {
      id: "N4",
      window: "16:30 - 18:30",
      activities: [
        { name: "Plucking", available: 3, capacity: 8 },
        { name: "Making", available: 7, capacity: 10 },
        { name: "Tasting", available: 4, capacity: 6 },
      ],
    },
  ],
};

const FALLBACK_LOCATIONS = [
  "Hill Country Estate",
  "Mountain View Plantation",
  "Valley Gardens",
  "Sunrise Estate",
];

export default function BookNow() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    location: "",
    programIds: [],
    packs: 1,
    payment: "",
    notes: "",
  });
  const [seasonSelections, setSeasonSelections] = useState({});
  const [useGlobalSeatCount, setUseGlobalSeatCount] = useState(false);
  const [globalSeatCount, setGlobalSeatCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [programOptions, setProgramOptions] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [programsError, setProgramsError] = useState("");

  const formatTimeRange = useCallback((startIso, endIso) => {
    try {
      const startLabel = format(new Date(startIso), "HH:mm");
      const endLabel = format(new Date(endIso), "HH:mm");
      return `${startLabel} - ${endLabel}`;
    } catch (error) {
      return "";
    }
  }, []);

  const availabilityForDate = useMemo(() => {
    if (!selectedDate || programOptions.length === 0) return null;

    return programOptions.map((program) => ({
      id: program.title,
      window: formatTimeRange(program.startTime, program.endTime),
      activities: program.sessions.map((session) => ({
        name: session.name,
        available: program.seats,
        capacity: program.seats,
        sessionTypes: session.sessionTypes.map((st) => ({
          id: st.id,
          name: st.name,
          price: st.price,
        })),
      })),
    }));
  }, [selectedDate, programOptions, formatTimeRange]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      setProgramsLoading(true);
      setProgramsError("");
      try {
        const response = await fetch("/api/public/programs", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load programs at this time");
        }

        const data = await response.json();
        if (isMounted) {
          setProgramOptions(Array.isArray(data.programs) ? data.programs : []);
        }
      } catch (error) {
        console.error("Public programs fetch error:", error);
        if (isMounted) {
          setProgramsError(
            error instanceof Error ? error.message : "Failed to load programs"
          );
        }
      } finally {
        if (isMounted) {
          setProgramsLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProgramTitles = useMemo(
    () =>
      formData.programIds
        .map(
          (id) =>
            programOptions.find((program) => program.id === id)?.title ?? null
        )
        .filter(Boolean),
    [formData.programIds, programOptions]
  );

  const locationOptions = useMemo(() => {
    const names = new Set();
    programOptions.forEach((program) => {
      if (program?.location?.name) {
        names.add(program.location.name);
      }
    });
    return Array.from(names);
  }, [programOptions]);

  const locationChoices =
    locationOptions.length > 0 ? locationOptions : FALLBACK_LOCATIONS;

  const formatPrice = (value) => {
    if (value === null || value === undefined) {
      return "Included";
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return String(value);
    }
    return `LKR ${numeric.toLocaleString()}`;
  };

  const getSeasonAvailabilityTotal = (seasonId) => {
    if (!availabilityForDate) {
      return 0;
    }

    const season = availabilityForDate.find((entry) => entry.id === seasonId);
    return season
      ? season.activities.reduce((acc, activity) => acc + activity.available, 0)
      : 0;
  };

  const clampSeatRequest = (requested, seasonId) => {
    const totalAvailable = getSeasonAvailabilityTotal(seasonId);
    if (totalAvailable <= 0) {
      return 0;
    }
    return Math.max(0, Math.min(requested, totalAvailable));
  };

  const handleSeasonToggle = (seasonId) => {
    setSeasonSelections((prev) => {
      if (prev[seasonId]) {
        const { [seasonId]: _removed, ...rest } = prev;
        return rest;
      }

      const totalAvailable = getSeasonAvailabilityTotal(seasonId);
      const initialSeats = useGlobalSeatCount
        ? clampSeatRequest(globalSeatCount, seasonId)
        : clampSeatRequest(totalAvailable > 0 ? 1 : 0, seasonId);

      return {
        ...prev,
        [seasonId]: {
          seatsRequested: initialSeats,
          activities: {},
        },
      };
    });
  };

  const handleActivityToggle = (seasonId, activityName) => {
    setSeasonSelections((prev) => {
      const existing = prev[seasonId] ?? {
        seatsRequested: useGlobalSeatCount
          ? clampSeatRequest(globalSeatCount, seasonId)
          : clampSeatRequest(1, seasonId),
        activities: {},
      };

      const activities = { ...existing.activities };
      if (activities[activityName]?.selected) {
        delete activities[activityName];
      } else {
        activities[activityName] = {
          selected: true,
          sessionTypes: {},
        };
      }

      return {
        ...prev,
        [seasonId]: {
          ...existing,
          activities,
        },
      };
    });
  };

  const handleSessionTypeToggle = (seasonId, activityName, sessionTypeId) => {
    setSeasonSelections((prev) => {
      const existing = prev[seasonId];
      if (!existing) return prev;

      const activities = { ...existing.activities };
      const activity = activities[activityName];
      if (!activity) return prev;

      const sessionTypes = { ...activity.sessionTypes };
      if (sessionTypes[sessionTypeId]) {
        delete sessionTypes[sessionTypeId];
      } else {
        sessionTypes[sessionTypeId] = true;
      }

      activities[activityName] = {
        ...activity,
        sessionTypes,
      };

      return {
        ...prev,
        [seasonId]: {
          ...existing,
          activities,
        },
      };
    });
  };

  const handleSeatsChange = (seasonId, nextValue) => {
    setSeasonSelections((prev) => {
      if (!prev[seasonId]) {
        return prev;
      }

      const sanitized = clampSeatRequest(nextValue, seasonId);
      return {
        ...prev,
        [seasonId]: {
          ...prev[seasonId],
          seatsRequested: sanitized,
        },
      };
    });
  };

  const handleGlobalSeatToggle = (checked) => {
    setUseGlobalSeatCount(Boolean(checked));
    if (checked) {
      setSeasonSelections((prev) => {
        const next = {};
        Object.entries(prev).forEach(([seasonId, payload]) => {
          next[seasonId] = {
            ...payload,
            seatsRequested: clampSeatRequest(globalSeatCount, seasonId),
          };
        });
        return next;
      });
    }
  };

  const handleGlobalSeatCountChange = (value) => {
    const numericValue = Number.parseInt(value, 10);
    const sanitized = Number.isNaN(numericValue)
      ? 0
      : Math.max(0, numericValue);
    setGlobalSeatCount(sanitized);
    if (useGlobalSeatCount) {
      setSeasonSelections((prev) => {
        const next = {};
        Object.entries(prev).forEach(([seasonId, payload]) => {
          next[seasonId] = {
            ...payload,
            seatsRequested: clampSeatRequest(sanitized, seasonId),
          };
        });
        return next;
      });
    }
  };

  const hasValidSeasonSelection =
    Object.keys(seasonSelections).length > 0 &&
    Object.values(seasonSelections).every(
      (entry) =>
        entry.seatsRequested > 0 &&
        Object.values(entry.activities).some(
          (act) => act.selected && Object.keys(act.sessionTypes).length > 0
        )
    );

  const seasonSelectionSummary = Object.entries(seasonSelections).map(
    ([seasonId, details]) => {
      const selectedActivities = Object.entries(details.activities).filter(
        ([_, act]) => act.selected
      );
      const activityList = selectedActivities.length
        ? selectedActivities
            .map(([name, act]) => {
              const sessionTypeNames = Object.keys(act.sessionTypes);
              const sessionTypeList = sessionTypeNames.length
                ? ` (${sessionTypeNames.join(", ")})`
                : "";
              return `${name}${sessionTypeList}`;
            })
            .join(", ")
        : "No activities selected";
      return `${seasonId}: ${details.seatsRequested} seats (${activityList})`;
    }
  );

  const countryCodes = [
    { code: "+1", country: "US/CA" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+94", country: "LK" },
    { code: "+61", country: "AU" },
    { code: "+86", country: "CN" },
  ];

  const handleProgramToggle = (programId) => {
    setFormData((prev) => {
      const nextProgramIds = prev.programIds.includes(programId)
        ? prev.programIds.filter((id) => id !== programId)
        : [...prev.programIds, programId];

      return {
        ...prev,
        programIds: nextProgramIds,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.programIds.length === 0) {
        alert("Select at least one program before booking.");
        setIsSubmitting(false);
        return;
      }

      if (!hasValidSeasonSelection) {
        alert(
          "Select at least one season, choose activities, and set the seats needed before booking."
        );
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        ...formData,
        programs: selectedProgramTitles,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        seasonSelections,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setReferenceCode(result.referenceCode);
        setBookingConfirmed(true);
      } else {
        alert(result.error || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    const whatsappMessage = encodeURIComponent(
      `Hi! I've just booked a tea tour.\n\nReference Code: ${referenceCode}\nName: ${
        formData.name
      }\nDate: ${format(
        selectedDate,
        "PPP"
      )}\nSeasons: ${seasonSelectionSummary.join(
        " | "
      )}\nPrograms: ${selectedProgramTitles.join(", ")}`
    );
    const whatsappLink = `https://wa.me/1234567890?text=${whatsappMessage}`;

    return (
      <>
        <Header />
        <main className="min-h-screen py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-8 text-center">
                <FaCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-serif font-bold mb-4 text-primary">
                  Booking Confirmed!
                </h1>
                <p className="text-lg mb-6">
                  Your reference code is:{" "}
                  <span className="font-bold text-primary text-xl">
                    {referenceCode}
                  </span>
                </p>
                <div className="bg-secondary/20 p-6 rounded-lg mb-6 text-left">
                  <h3 className="font-bold mb-3">Booking Details:</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Date:</strong> {format(selectedDate, "PPP")}
                    </p>
                    <p>
                      <strong>Seasons:</strong>{" "}
                      {seasonSelectionSummary.join(" | ")}
                    </p>
                    <p>
                      <strong>Programs:</strong>{" "}
                      {selectedProgramTitles.join(", ")}
                    </p>
                    <p>
                      <strong>Location:</strong> {formData.location}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  A confirmation email has been sent to{" "}
                  <strong>{formData.email}</strong>. Please check your inbox for
                  complete details and instructions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <FaWhatsapp className="h-5 w-5" />
                      Share on WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Header />
      <FloatingActionButtons />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 drop-shadow-lg">
              Book Your Experience
            </h1>
            <p className="text-lg opacity-95 drop-shadow">
              Fill in your details to reserve your tea tour
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-primary">
                      Personal Information
                    </h2>

                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) =>
                            setFormData({ ...formData, countryCode: value })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} {item.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          className="flex-1"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="234567890"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="packs">Number of People (0-8)</Label>
                      <Input
                        id="packs"
                        type="number"
                        min="0"
                        max="8"
                        value={formData.packs}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            packs: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-primary">
                      Booking Details
                    </h2>

                    <div>
                      <Label htmlFor="location">Select Location *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) =>
                          setFormData({ ...formData, location: value })
                        }
                        required
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Choose a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locationChoices.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Select Date *</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    {selectedDate && (
                      <div className="space-y-4 rounded-lg border border-dashed border-muted p-4 bg-muted/10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="text-lg font-semibold text-primary">
                            Availability Overview
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {format(selectedDate, "PPP")} • Seasons & Activities
                          </span>
                        </div>
                        {availabilityForDate ? (
                          <div className="space-y-4">
                            <div className="rounded-md border border-muted-foreground/20 bg-background/70 p-4">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id="use-global-seats"
                                    checked={useGlobalSeatCount}
                                    onCheckedChange={(checked) =>
                                      handleGlobalSeatToggle(checked)
                                    }
                                  />
                                  <label
                                    htmlFor="use-global-seats"
                                    className="cursor-pointer text-sm text-foreground"
                                  >
                                    Use the same seat count for every selected
                                    season
                                  </label>
                                </div>
                                {useGlobalSeatCount && (
                                  <div className="flex items-center gap-2">
                                    <Label
                                      htmlFor="global-seat-count"
                                      className="text-xs uppercase tracking-wide text-muted-foreground"
                                    >
                                      Seats per season
                                    </Label>
                                    <Input
                                      id="global-seat-count"
                                      type="number"
                                      min="0"
                                      className="w-24"
                                      value={
                                        Number.isNaN(globalSeatCount)
                                          ? ""
                                          : globalSeatCount
                                      }
                                      onChange={(e) =>
                                        handleGlobalSeatCountChange(
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                              {!useGlobalSeatCount && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Adjust seat counts individually inside each
                                  season card below.
                                </p>
                              )}
                            </div>
                            <div className="grid gap-3">
                              {availabilityForDate.map((season) => {
                                const totalAvailable =
                                  getSeasonAvailabilityTotal(season.id);
                                const seasonSelection =
                                  seasonSelections[season.id];
                                const isSelected = Boolean(seasonSelection);
                                const seatValue =
                                  isSelected &&
                                  typeof seasonSelection.seatsRequested ===
                                    "number"
                                    ? String(seasonSelection.seatsRequested)
                                    : "";
                                const seatInputId = `seats-${season.id}`;

                                return (
                                  <div
                                    key={season.id}
                                    className="rounded-md border bg-background px-4 py-3 shadow-sm"
                                  >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div className="flex items-start gap-3">
                                        <Checkbox
                                          id={`season-${season.id}`}
                                          checked={isSelected}
                                          onCheckedChange={() =>
                                            handleSeasonToggle(season.id)
                                          }
                                          aria-label={`Select ${season.id}`}
                                        />
                                        <label
                                          htmlFor={`season-${season.id}`}
                                          className="cursor-pointer"
                                        >
                                          <p className="font-medium text-primary">
                                            {season.id} • {season.window}
                                          </p>
                                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            {totalAvailable} seats left today
                                          </p>
                                        </label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Label
                                          htmlFor={seatInputId}
                                          className="text-xs uppercase tracking-wide text-muted-foreground"
                                        >
                                          Seats needed
                                        </Label>
                                        <Input
                                          id={seatInputId}
                                          type="number"
                                          min="0"
                                          max={totalAvailable}
                                          className="w-24"
                                          value={isSelected ? seatValue : ""}
                                          onChange={(e) =>
                                            handleSeatsChange(
                                              season.id,
                                              Number.parseInt(
                                                e.target.value,
                                                10
                                              ) || 0
                                            )
                                          }
                                          disabled={!isSelected}
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                      {season.activities.map((activity) => {
                                        const seatsTaken = Math.max(
                                          0,
                                          activity.capacity - activity.available
                                        );
                                        const capacityLabel = `${activity.available} of ${activity.capacity} seats available`;
                                        const fillPercent = activity.capacity
                                          ? Math.round(
                                              (seatsTaken / activity.capacity) *
                                                100
                                            )
                                          : 0;
                                        const normalizedActivityId =
                                          activity.name
                                            .replace(/\s+/g, "-")
                                            .toLowerCase();
                                        const activityCheckboxId = `activity-${season.id}-${normalizedActivityId}`;
                                        const activitySelected = Boolean(
                                          seasonSelection?.activities?.[
                                            activity.name
                                          ]?.selected
                                        );
                                        return (
                                          <div
                                            key={activity.name}
                                            className={`rounded border p-3 transition-colors ${
                                              activitySelected
                                                ? "border-primary bg-primary/5"
                                                : "border-muted-foreground/20 bg-muted/40"
                                            }`}
                                          >
                                            <div className="flex items-start justify-between gap-2">
                                              <label
                                                htmlFor={activityCheckboxId}
                                                className={`flex items-center gap-2 text-sm font-semibold ${
                                                  isSelected
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                                }`}
                                              >
                                                <Checkbox
                                                  id={activityCheckboxId}
                                                  checked={activitySelected}
                                                  disabled={!isSelected}
                                                  onCheckedChange={() =>
                                                    handleActivityToggle(
                                                      season.id,
                                                      activity.name
                                                    )
                                                  }
                                                />
                                                {activity.name}
                                              </label>
                                              <span className="text-xs text-muted-foreground">
                                                {capacityLabel}
                                              </span>
                                            </div>
                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-muted">
                                              <div
                                                className={`h-full rounded ${
                                                  activitySelected
                                                    ? "bg-primary"
                                                    : "bg-primary/40"
                                                }`}
                                                style={{
                                                  width: `${Math.min(
                                                    100,
                                                    Math.max(0, fillPercent)
                                                  )}%`,
                                                }}
                                              />
                                            </div>
                                            {activitySelected &&
                                              activity.sessionTypes &&
                                              activity.sessionTypes.length >
                                                0 && (
                                                <div className="mt-3 space-y-2">
                                                  <p className="text-xs font-medium text-muted-foreground">
                                                    Select session types:
                                                  </p>
                                                  {activity.sessionTypes.map(
                                                    (st) => {
                                                      const stCheckboxId = `st-${season.id}-${normalizedActivityId}-${st.id}`;
                                                      const stSelected =
                                                        seasonSelection
                                                          ?.activities?.[
                                                          activity.name
                                                        ]?.sessionTypes?.[
                                                          st.id
                                                        ] || false;
                                                      return (
                                                        <div
                                                          key={st.id}
                                                          className="flex items-center gap-2"
                                                        >
                                                          <Checkbox
                                                            id={stCheckboxId}
                                                            checked={stSelected}
                                                            onCheckedChange={() =>
                                                              handleSessionTypeToggle(
                                                                season.id,
                                                                activity.name,
                                                                st.id
                                                              )
                                                            }
                                                          />
                                                          <label
                                                            htmlFor={
                                                              stCheckboxId
                                                            }
                                                            className="text-xs cursor-pointer"
                                                          >
                                                            {st.name} -{" "}
                                                            {formatPrice(
                                                              st.price
                                                            )}
                                                          </label>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Availability information will appear once slots are
                            published for this date.
                          </p>
                        )}
                        {Object.keys(seasonSelections).length > 0 &&
                          !hasValidSeasonSelection && (
                            <p className="text-sm text-amber-600">
                              Select at least one activity, choose session
                              types, and enter the seats needed for each chosen
                              season.
                            </p>
                          )}
                        {seasonSelectionSummary.length > 0 && (
                          <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
                            <p className="font-medium text-primary">
                              Your selections
                            </p>
                            <ul className="mt-2 space-y-1 text-muted-foreground">
                              {Object.entries(seasonSelections).map(
                                ([seasonId, details]) => {
                                  const activities = Object.keys(
                                    details.activities
                                  );
                                  const activityList = activities.length
                                    ? activities.join(", ")
                                    : "No activities selected";
                                  return (
                                    <li key={seasonId}>
                                      <span className="font-medium text-foreground">
                                        {seasonId}:
                                      </span>{" "}
                                      {details.seatsRequested} seats •{" "}
                                      {activityList}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* <div>
                      <Label>Select Programs * (Select one or more)</Label>
                      <div className="space-y-3 mt-2">
                        {programsLoading ? (
                          <p className="text-sm text-muted-foreground">
                            Loading available programs...
                          </p>
                        ) : programsError ? (
                          <p className="text-sm text-red-600">
                            {programsError}
                          </p>
                        ) : programOptions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No programs are available right now. Please check
                            back later.
                          </p>
                        ) : (
                          programOptions.map((program) => {
                            const checkboxId = `program-${program.id}`;
                            const locationName = program.location?.name;
                            return (
                              <div
                                key={program.id}
                                className="rounded border border-muted-foreground/20 bg-muted/40 p-3"
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={checkboxId}
                                    checked={formData.programIds.includes(
                                      program.id
                                    )}
                                    onCheckedChange={() =>
                                      handleProgramToggle(program.id)
                                    }
                                  />
                                  <label
                                    htmlFor={checkboxId}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <p className="text-sm font-semibold text-foreground">
                                      {program.title}
                                    </p>
                                    {locationName && (
                                      <p className="text-xs text-muted-foreground">
                                        Location: {locationName}
                                      </p>
                                    )}
                                    {program.description && (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {program.description}
                                      </p>
                                    )}
                                  </label>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div> */}

                    {/* {programOptions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-serif font-bold text-primary">
                          Program Details & Sessions
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Review the sessions available in each program before
                          confirming your booking.
                        </p>
                        <div className="space-y-3">
                          {programOptions.map((program) => (
                            <div
                              key={`program-overview-${program.id}`}
                              className="rounded-md border border-muted-foreground/20 bg-background p-4 shadow-sm"
                            >
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-base font-semibold text-foreground">
                                    {program.title}
                                  </p>
                                  {program.location?.name && (
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                      Location: {program.location.name}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Seats available: {program.seats}
                                </span>
                              </div>
                              {program.description && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {program.description}
                                </p>
                              )}
                              {program.sessions.length > 0 ? (
                                <div className="mt-3 space-y-3">
                                  {program.sessions.map((session) => (
                                    <div
                                      key={`session-${session.id}`}
                                      className="rounded border border-muted-foreground/20 bg-muted/30 p-3"
                                    >
                                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm font-medium text-foreground">
                                          {session.name}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                          {formatTimeRange(
                                            session.startTime,
                                            session.endTime
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Session price:{" "}
                                        {formatPrice(session.price)}
                                      </p>
                                      {session.sessionTypes.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                          {session.sessionTypes.map((type) => (
                                            <li
                                              key={`session-type-${type.id}`}
                                              className="flex items-baseline justify-between gap-2"
                                            >
                                              <span className="font-medium text-foreground">
                                                {type.name}
                                              </span>
                                              <span>
                                                {formatPrice(type.price)}
                                              </span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-3 text-sm text-muted-foreground">
                                  Session schedule will be announced soon.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

                    <div>
                      <Label htmlFor="payment">Payment Option *</Label>
                      <Select
                        value={formData.payment}
                        onValueChange={(value) =>
                          setFormData({ ...formData, payment: value })
                        }
                        required
                      >
                        <SelectTrigger id="payment">
                          <SelectValue placeholder="Choose payment option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Payment</SelectItem>
                          <SelectItem value="partial">
                            Partial Payment (≥25% on arrival)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.payment === "partial" && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Note: Partial payment requires at least 25% payment
                          upon arrival
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="Any special requirements or questions?"
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={
                      isSubmitting ||
                      !selectedDate ||
                      formData.programIds.length === 0 ||
                      !hasValidSeasonSelection
                    }
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
