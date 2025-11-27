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
    promoCode: "",
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
  const [currentStage, setCurrentStage] = useState("booking");
  const [guestDetails, setGuestDetails] = useState([]);
  const [verifiedLeader, setVerifiedLeader] = useState(null);
  const [promoStatus, setPromoStatus] = useState({ state: "idle", message: "" });

  const rangesOverlap = useCallback((first, second) => {
    if (!first?.startTime || !first?.endTime || !second?.startTime || !second?.endTime) {
      return false;
    }

    const firstStart = new Date(first.startTime).getTime();
    const firstEnd = new Date(first.endTime).getTime();
    const secondStart = new Date(second.startTime).getTime();
    const secondEnd = new Date(second.endTime).getTime();

    if (
      Number.isNaN(firstStart) ||
      Number.isNaN(firstEnd) ||
      Number.isNaN(secondStart) ||
      Number.isNaN(secondEnd)
    ) {
      return false;
    }

    return firstStart < secondEnd && firstEnd > secondStart;
  }, []);

  const formatTimeRange = useCallback((startIso, endIso) => {
    const formatTimeOfDay = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return "";

      // Sessions are stored in the DB as SQL TIME fields which Prisma maps
      // to JS Date objects anchored at 1970-01-01 in UTC. When that's the
      // case we should read the UTC hours/minutes to get the intended
      // time-of-day (avoid local timezone shift). For full datetimes use
      // local time display.
      const useUtc = date.getUTCFullYear() === 1970;
      const hours = String(useUtc ? date.getUTCHours() : date.getHours()).padStart(2, "0");
      const minutes = String(useUtc ? date.getUTCMinutes() : date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const startLabel = formatTimeOfDay(startIso);
    const endLabel = formatTimeOfDay(endIso);

    if (!startLabel || !endLabel) return "";

    return `${startLabel} - ${endLabel}`;
  }, []);

  const availabilityForDate = useMemo(() => {
    if (!selectedDate || programOptions.length === 0) return null;

    return programOptions.map((program) => {
      const programId = program.id ?? program.title ?? "";
      const parsedCapacity =
        typeof program.seats === "number"
          ? program.seats
          : Number.parseInt(program.seats ?? "", 10);
      const safeCapacity = Number.isNaN(parsedCapacity)
        ? null
        : Math.max(0, parsedCapacity);

      const activities = Array.isArray(program.sessions)
        ? program.sessions.map((session) => {
            const availabilityInfo = session?.availabilityForDate ?? {};
            const availableSource =
              availabilityInfo.availableSeats ??
              availabilityInfo.capacity ??
              safeCapacity ??
              0;
            const parsedAvailable = Number.parseInt(availableSource ?? "", 10);
            const safeAvailable = Number.isNaN(parsedAvailable)
              ? 0
              : Math.max(0, parsedAvailable);

            const capacitySource =
              availabilityInfo.capacity != null
                ? availabilityInfo.capacity
                : safeCapacity;
            const parsedActivityCapacity = Number.parseInt(
              capacitySource ?? "",
              10
            );
            const safeActivityCapacity = Number.isNaN(parsedActivityCapacity)
              ? null
              : Math.max(0, parsedActivityCapacity);

            return {
              id: session.id,
              name: session.name,
              available: safeAvailable,
              capacity: safeActivityCapacity,
              startTime: session.startTime,
              endTime: session.endTime,
              sessionTypes: Array.isArray(session.sessionTypes)
                ? session.sessionTypes.map((st) => ({
                    id: st.id,
                    name: st.name,
                    price: st.price,
                  }))
                : [],
            };
          })
        : [];

      return {
        id: program.title ?? String(programId),
        window: formatTimeRange(program.startTime, program.endTime),
        programId,
        activities,
      };
    });
  }, [selectedDate, programOptions, formatTimeRange]);

  const collectSelectedSessions = useCallback(
    (selectionsMap) => {
      if (!availabilityForDate) {
        return [];
      }

      const entries = [];

      Object.entries(selectionsMap || {}).forEach(([seasonId, selection]) => {
        if (!selection) {
          return;
        }

        const season = availabilityForDate.find((entry) => entry.id === seasonId);
        if (!season) {
          return;
        }

        Object.entries(selection.activities || {}).forEach(([activityName, activityState]) => {
          if (!activityState?.selected) {
            return;
          }

          const session = season.activities.find((activity) => activity.name === activityName);
          if (!session) {
            return;
          }

          entries.push({
            seasonId,
            activityName,
            sessionId: session.id,
            startTime: session.startTime,
            endTime: session.endTime,
          });
        });
      });

      return entries;
    },
    [availabilityForDate]
  );

  const selectedSessions = useMemo(
    () => collectSelectedSessions(seasonSelections),
    [collectSelectedSessions, seasonSelections]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      setProgramsLoading(true);
      setProgramsError("");
      try {
        const params = new URLSearchParams();
        if (selectedDate) {
          params.set("date", format(selectedDate, "yyyy-MM-dd"));
        }

        const queryString = params.toString();
        const response = await fetch(
          queryString
            ? `/api/public/programs?${queryString}`
            : "/api/public/programs",
          {
            cache: "no-store",
          }
        );

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
  }, [selectedDate]);

  const selectedProgramTitles = useMemo(
    () =>
      formData.programIds
        .map((id) => {
          const matchedProgram = programOptions.find((program) => {
            const resolved = program.id ?? program.title;
            return String(resolved) === String(id);
          });
          return matchedProgram?.title ?? null;
        })
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

  const totalSeatsRequested = useMemo(() => {
    return Object.values(seasonSelections).reduce((acc, season) => {
      const seats = typeof season?.seatsRequested === "number" ? season.seatsRequested : 0;
      return acc + Math.max(0, seats);
    }, 0);
  }, [seasonSelections]);

  const guestDetailsComplete = useMemo(() => {
    if (guestDetails.length === 0) {
      return false;
    }
    return guestDetails.every((guest) => {
      const nameValid = Boolean(guest?.name && guest.name.trim());
      const idValid = Boolean(guest?.idNumber && guest.idNumber.trim());
      const phoneValid = Boolean(guest?.phone && guest.phone.trim());
      const emailValid = Boolean(guest?.email && guest.email.trim());
      return nameValid && idValid && phoneValid && emailValid;
    });
  }, [guestDetails]);

  useEffect(() => {
    if (currentStage !== "guests") {
      return;
    }

    const desiredLength = Math.max(0, totalSeatsRequested);
    if (desiredLength === 0) {
      setCurrentStage("booking");
      return;
    }

    setGuestDetails((prev) => {
      if (prev.length === desiredLength) {
        return prev;
      }

      if (prev.length < desiredLength) {
        const additional = Array.from({ length: desiredLength - prev.length }, () => ({
          name: "",
          idNumber: "",
          phone: "",
          email: "",
        }));
        return [...prev, ...additional];
      }

      return prev.slice(0, desiredLength);
    });
  }, [currentStage, totalSeatsRequested]);

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
    const seasonMeta = availabilityForDate?.find((entry) => entry.id === seasonId);
    const resolvedProgramId = seasonMeta?.programId ?? seasonId;
    const normalizedProgramId = String(resolvedProgramId);
    const existingSelection = seasonSelections[seasonId];

    if (existingSelection) {
      const normalizedExistingProgramId = String(
        existingSelection.programId ?? normalizedProgramId
      );
      const programStillUsed = Object.entries(seasonSelections).some(
        ([key, value]) =>
          key !== seasonId && String(value?.programId ?? key) === normalizedExistingProgramId
      );

      setSeasonSelections((prev) => {
        const { [seasonId]: _removed, ...rest } = prev;
        return rest;
      });

      if (!programStillUsed) {
        setFormData((prev) => ({
          ...prev,
          programIds: prev.programIds.filter(
            (id) => String(id) !== normalizedExistingProgramId
          ),
        }));
      }

      return;
    }

    const totalAvailable = getSeasonAvailabilityTotal(seasonId);
    const initialSeats = useGlobalSeatCount
      ? clampSeatRequest(globalSeatCount, seasonId)
      : clampSeatRequest(totalAvailable > 0 ? 1 : 0, seasonId);

    setSeasonSelections((prev) => ({
      ...prev,
      [seasonId]: {
        programId: normalizedProgramId,
        seatsRequested: initialSeats,
        activities: {},
      },
    }));

    setFormData((prev) => {
      if (prev.programIds.some((id) => String(id) === normalizedProgramId)) {
        return prev;
      }
      return {
        ...prev,
        programIds: [...prev.programIds, normalizedProgramId],
      };
    });
  };

  const handleActivityToggle = (seasonId, activityName) => {
    const seasonMeta = availabilityForDate?.find((entry) => entry.id === seasonId);
    const normalizedProgramId = String(seasonMeta?.programId ?? seasonId);
    const targetSession = seasonMeta?.activities?.find(
      (activity) => activity.name === activityName
    );

    setSeasonSelections((prev) => {
      const existing = prev[seasonId] ?? {
        programId: normalizedProgramId,
        seatsRequested: useGlobalSeatCount
          ? clampSeatRequest(globalSeatCount, seasonId)
          : clampSeatRequest(1, seasonId),
        activities: {},
      };

      const activities = { ...existing.activities };
      if (activities[activityName]?.selected) {
        delete activities[activityName];
      } else {
        if (targetSession?.startTime && targetSession?.endTime) {
          const currentSelections = collectSelectedSessions(prev);
          const hasConflict = currentSelections.some((entry) => {
            if (entry.sessionId === targetSession.id) {
              return false;
            }
            return rangesOverlap(entry, targetSession);
          });

          if (hasConflict) {
            alert(
              "You already selected another activity that overlaps with this time slot. Please choose a different session."
            );
            return prev;
          }
        }

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

  const hasValidSeasonSelection = useMemo(() => {
    if (Object.keys(seasonSelections).length === 0) {
      return false;
    }

    return Object.entries(seasonSelections).every(([seasonId, entry]) => {
      if (!entry || entry.seatsRequested <= 0) {
        return false;
      }

      const selectedActivities = Object.entries(entry.activities ?? {}).filter(
        ([_, activity]) => activity?.selected
      );

      if (selectedActivities.length === 0) {
        return false;
      }

      return selectedActivities.some(([activityName, activity]) => {
        const season = availabilityForDate?.find((item) => item.id === seasonId);
        const matchingActivity = season?.activities?.find(
          (item) => item.name === activityName
        );
        const sessionTypes = matchingActivity?.sessionTypes ?? [];

        if (!sessionTypes.length) {
          return true;
        }

        return Object.keys(activity.sessionTypes ?? {}).length > 0;
      });
    });
  }, [availabilityForDate, seasonSelections]);

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

  const handlePromoCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      promoCode: value,
    }));
    setPromoStatus({ state: "idle", message: "" });
    setVerifiedLeader(null);
  };

  const handleVerifyPromoCode = async () => {
    const code = formData.promoCode?.trim();
    if (!code) {
      setPromoStatus({ state: "error", message: "Enter a promo code first." });
      setVerifiedLeader(null);
      return;
    }

    setPromoStatus({ state: "loading", message: "" });

    try {
      const params = new URLSearchParams({ code });
      const response = await fetch(`/api/public/promo?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || "Promo code could not be verified.";
        setPromoStatus({ state: "error", message });
        setVerifiedLeader(null);
        return;
      }

      setVerifiedLeader(data.leader);
      setPromoStatus({
        state: "success",
        message: `Promo code verified. Booking under ${
          data.leader?.name || data.leader?.email || "registered leader"
        }`,
      });

      setFormData((prev) => ({
        ...prev,
        name: data.leader?.name || prev.name,
        email: data.leader?.email || prev.email,
      }));
    } catch (error) {
      console.error("Promo code verification failed", error);
      setPromoStatus({
        state: "error",
        message: "Unable to verify promo code. Please try again.",
      });
      setVerifiedLeader(null);
    }
  };

  const handleClearPromoCode = () => {
    setVerifiedLeader(null);
    setPromoStatus({ state: "idle", message: "" });
    setFormData((prev) => ({
      ...prev,
      promoCode: "",
    }));
  };

  const handleProgramToggle = (programId) => {
    const normalizedId = String(programId);
    setFormData((prev) => {
      const exists = prev.programIds.some((id) => String(id) === normalizedId);
      const nextProgramIds = exists
        ? prev.programIds.filter((id) => String(id) !== normalizedId)
        : [...prev.programIds, normalizedId];

      return {
        ...prev,
        programIds: nextProgramIds,
      };
    });
  };

  const handleGuestDetailChange = (index, field, value) => {
    setGuestDetails((prev) => {
      const next = [...prev];
      const existing = next[index] ?? {
        name: "",
        idNumber: "",
        phone: "",
        email: "",
      };
      next[index] = {
        ...existing,
        [field]: value,
      };
      return next;
    });
  };

  const handleBackToBooking = () => {
    setIsSubmitting(false);
    setCurrentStage("booking");
  };

  const submitPayHereRedirect = useCallback((redirect) => {
    if (!redirect || typeof window === "undefined") {
      return;
    }

    const { actionUrl, params } = redirect;
    if (!actionUrl || !params || typeof params !== "object") {
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = actionUrl;
    form.style.display = "none";

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStage === "booking") {
      if (formData.programIds.length === 0) {
        alert("Select at least one program before proceeding.");
        return;
      }

      if (!hasValidSeasonSelection) {
        alert(
          "Select at least one season, choose activities, and set the seats needed before continuing."
        );
        return;
      }

      if (!selectedDate) {
        alert("Select a date before continuing.");
        return;
      }

      if (totalSeatsRequested === 0) {
        alert("Please specify how many seats you need before continuing.");
        return;
      }

      if (!verifiedLeader) {
        if (!formData.name?.trim()) {
          alert("Enter your full name before continuing.");
          return;
        }

        if (!formData.email?.trim()) {
          alert("Enter a valid email before continuing.");
          return;
        }

        if (!formData.phone?.trim()) {
          alert("Enter a contact number before continuing.");
          return;
        }
      }

      setCurrentStage("guests");
      return;
    }

    if (!guestDetailsComplete) {
      alert("Please fill in all guest details before confirming your booking.");
      return;
    }

    if (!selectedDate) {
      alert("Select a date before confirming your booking.");
      setCurrentStage("booking");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedDate) {
        throw new Error("Select a date before confirming your booking.");
      }

      // Send bookedDate as a date-only string (YYYY-MM-DD).
      // The API expects a date-like value; using a plain date string
      // avoids client/server timezone conversion issues.
      const bookingDateString = format(selectedDate, "yyyy-MM-dd");

      const contactNumber = [formData.countryCode, formData.phone]
        .filter(Boolean)
        .join(" ")
        .trim();

      let leaderId = verifiedLeader?.id;

      if (!leaderId) {
        const leaderPayload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: contactNumber,
        };

        const leaderResponse = await fetch("/api/public/leaders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leaderPayload),
        });

        const leaderResult = await leaderResponse.json();

        if (!leaderResponse.ok) {
          throw new Error(leaderResult?.error || "Could not save your contact details.");
        }

        leaderId = leaderResult?.leader?.id;
      }

      if (!leaderId) {
        throw new Error("Unable to determine the booking contact.");
      }

      const primaryName = (verifiedLeader?.name || formData.name || "Guest").trim();
      const [firstName, ...restNames] = primaryName.split(/\s+/);
      const lastName = restNames.join(" ") || "Customer";
      const primaryEmail = (verifiedLeader?.email || formData.email || "guest@example.com").trim();
      const primaryPhone = (verifiedLeader?.contact || contactNumber || "0000000000").trim();
      const addressLine = formData.notes?.trim() || formData.location || "N/A";
      const cityValue = formData.location || "Colombo";
      const countryValue = "Sri Lanka";

      const customersPayload = guestDetails.map((guest) => ({
        name: guest.name.trim(),
        email: guest.email.trim(),
        phone: guest.phone?.trim() || null,
        nic: guest.idNumber?.trim() || null,
      }));

      const bookingSelections = [];

      Object.entries(seasonSelections).forEach(([seasonId, selection]) => {
        const seatsRequested = Number.parseInt(selection?.seatsRequested, 10) || 0;
        if (seatsRequested <= 0) {
          return;
        }

        const resolvedProgramId = selection?.programId ?? seasonId;
        const program = programOptions.find((programOption) => {
          const optionId = programOption.id ?? programOption.title;
          return String(optionId) === String(resolvedProgramId);
        });

        if (!program) {
          return;
        }

        const activityEntries = Object.entries(selection.activities ?? {}).filter(
          ([, details]) => details?.selected
        );

        activityEntries.forEach(([activityName, details]) => {
          const session = program.sessions?.find(
            (item) => item.name === activityName
          );

          if (!session) {
            return;
          }

          const parsedSessionId = Number.parseInt(session.id, 10);
          if (Number.isNaN(parsedSessionId)) {
            return;
          }

          const sessionTypeIds = Object.keys(details.sessionTypes ?? {});

          if (sessionTypeIds.length === 0) {
            bookingSelections.push({
              sessionId: parsedSessionId,
              seatsRequested,
              customers: customersPayload,
            });
            return;
          }

          sessionTypeIds.forEach((typeId) => {
            const parsedTypeId = Number.parseInt(typeId, 10);
            if (Number.isNaN(parsedTypeId)) {
              return;
            }

            bookingSelections.push({
              sessionId: parsedSessionId,
              sessionTypeId: parsedTypeId,
              seatsRequested,
              customers: customersPayload,
            });
          });
        });
      });

      if (bookingSelections.length === 0) {
        throw new Error("No activities were selected for this booking.");
      }

      const payload = {
        leaderId,
        bookedDate: bookingDateString,
        selections: bookingSelections,
        payment: {
          paymentType: "Full",
          provider: "PAYHERE",
          currency: "LKR",
          method: "PayHere Checkout",
        },
        customer: {
          name: primaryName,
          firstName,
          lastName,
          email: primaryEmail,
          phone: primaryPhone,
          address: addressLine,
          city: cityValue,
          country: countryValue,
        },
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Booking failed. Please try again.");
      }

      if (result.paymentRedirect) {
        submitPayHereRedirect(result.paymentRedirect);
        return;
      }

      const bookingReference =
        result.referenceCode ??
        (result.bookingId ? `RV-${String(result.bookingId)}` : null);
      setReferenceCode(bookingReference || "");
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    const contactName =
      verifiedLeader?.name?.trim() || formData.name?.trim() || "Guest";
    const guestSummaryText = guestDetails.length
      ? guestDetails
          .map((guest, index) => {
            const namePart = guest?.name?.trim() || `Guest ${index + 1}`;
            const idPart = guest?.idNumber?.trim() || "ID N/A";
            const phonePart = guest?.phone?.trim() || "Phone N/A";
            const emailPart = guest?.email?.trim() || "Email N/A";
            return `${index + 1}. ${namePart} • ${idPart} • ${phonePart} • ${emailPart}`;
          })
          .join(" | ")
      : "No guest details provided";

    const whatsappMessage = encodeURIComponent(
      `Hi! I've just booked a tea tour.\n\nReference Code: ${referenceCode}\nName: ${
        contactName
      }\nDate: ${format(
        selectedDate,
        "PPP"
      )}\nSeasons: ${seasonSelectionSummary.join(
        " | "
      )}\nPrograms: ${selectedProgramTitles.join(", ")}\nGuests: ${guestSummaryText}`
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
                    {guestDetails.length > 0 && (
                      <div>
                        <strong>Guests:</strong>
                        <ul className="mt-2 space-y-1">
                          {guestDetails.map((guest, index) => (
                            <li key={`guest-summary-${index}`}>
                              <span className="font-medium text-foreground">
                                Guest {index + 1}:
                              </span>{" "}
                              {guest.name || "Name pending"} • {guest.idNumber || "ID pending"} • {guest.phone || "Phone pending"} • {guest.email || "Email pending"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                  {currentStage === "booking" ? (
                    <>
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
                       
                        {/* <div className="space-y-3">
                          <Label className="text-base font-medium">
                            Select Program(s) *
                          </Label>
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
                              No programs are available for booking right now. Please check back later or contact us for assistance.
                            </p>
                          ) : (
                            <div className="grid gap-3 md:grid-cols-2">
                              {programOptions.map((program) => {
                                const resolvedId = program.id ?? program.title;
                                const checkboxId = `program-${String(resolvedId)
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")}`;
                                const isSelected = formData.programIds.includes(resolvedId);
                                const timeRange =
                                  program?.startTime && program?.endTime
                                    ? formatTimeRange(program.startTime, program.endTime)
                                    : null;
                                return (
                                  <div
                                    key={String(resolvedId)}
                                    className={`rounded-lg border p-4 transition-colors ${
                                      isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/30 bg-background"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <Checkbox
                                        id={checkboxId}
                                        checked={isSelected}
                                        onCheckedChange={() => handleProgramToggle(resolvedId)}
                                      />
                                      <label
                                        htmlFor={checkboxId}
                                        className="flex-1 cursor-pointer space-y-2"
                                      >
                                        <div>
                                          <p className="text-sm font-semibold text-foreground">
                                            {program.title || "Untitled Program"}
                                          </p>
                                          {program?.location?.name && (
                                            <p className="text-xs text-muted-foreground">
                                              {program.location.name}
                                            </p>
                                          )}
                                        </div>
                                        <div className="space-y-1 text-xs text-muted-foreground">
                                          {timeRange && <p>Time: {timeRange}</p>}
                                          {typeof program?.seats === "number" && (
                                            <p>Seats available: {program.seats}</p>
                                          )}
                                          {program?.description && (
                                            <p className="line-clamp-3">
                                              {program.description}
                                            </p>
                                          )}
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div> */}

                        

                        

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
                                            const conflictsWithSelection = selectedSessions.some(
                                              (entry) => {
                                                if (entry.sessionId === activity.id) {
                                                  return false;
                                                }
                                                return rangesOverlap(entry, activity);
                                              }
                                            );
                                            const activityDisabled =
                                              !activitySelected && conflictsWithSelection;
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
                                                      disabled={!isSelected || activityDisabled}
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
                                                {activityDisabled && (
                                                  <p className="mt-2 text-xs text-amber-600">
                                                    This overlaps with another activity you already selected.
                                                  </p>
                                                )}
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
                        </div> */}

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
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-primary">
                          Personal Information
                        </h2>
                        <div>
                          <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                          <div className="flex gap-2">
                            <Input
                              id="promoCode"
                              value={formData.promoCode || ""}
                              onChange={(e) => handlePromoCodeChange(e.target.value)}
                              placeholder="Enter promo code if you have one"
                              className="flex-1"
                              disabled={promoStatus.state === "loading"}
                            />
                            {verifiedLeader ? (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleClearPromoCode}
                                disabled={promoStatus.state === "loading"}
                              >
                                Clear
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleVerifyPromoCode}
                                disabled={promoStatus.state === "loading"}
                              >
                                {promoStatus.state === "loading" ? "Verifying..." : "Verify"}
                              </Button>
                            )}
                          </div>
                          {promoStatus.message && (
                            <p
                              className={`mt-2 text-sm ${
                                promoStatus.state === "error"
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {promoStatus.message}
                            </p>
                          )}
                        </div>
                        {verifiedLeader ? (
                          <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
                            Booking will be linked to promo leader
                            {" "}
                            <span className="font-semibold">
                              {verifiedLeader.name || verifiedLeader.email}
                            </span>
                            .
                          </div>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                required={!verifiedLeader}
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
                                required={!verifiedLeader}
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
                                  required={!verifiedLeader}
                                  className="flex-1"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                  }
                                  placeholder="234567890"
                                />
                              </div>
                            </div>
                          </>
                        )}
                        
                      </div>

                     

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        // disabled={
                        //   !selectedDate ||
                        //   formData.programIds.length === 0 ||
                        //   !hasValidSeasonSelection ||
                        //   totalSeatsRequested === 0
                        // }
                      >
                        Next
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-primary">
                          Guest Details
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          We need information for each of the {totalSeatsRequested} people joining the tour. These details help our guides welcome everyone smoothly.
                        </p>

                        <div className="space-y-4">
                          {guestDetails.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                              Please go back and select your seats to continue.
                            </div>
                          ) : (
                            guestDetails.map((guest, index) => (
                              <div
                                key={`guest-${index}`}
                                className="rounded-lg border border-muted-foreground/30 bg-background p-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="text-lg font-semibold text-primary">
                                    Guest {index + 1}
                                  </h3>
                                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Seat #{index + 1}
                                  </span>
                                </div>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                  <div className="sm:col-span-1">
                                    <Label htmlFor={`guest-name-${index}`} className="text-sm">
                                      Full Name
                                    </Label>
                                    <Input
                                      id={`guest-name-${index}`}
                                      value={guest.name}
                                      onChange={(e) =>
                                        handleGuestDetailChange(index, "name", e.target.value)
                                      }
                                      placeholder="Guest name"
                                      required
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <Label htmlFor={`guest-id-${index}`} className="text-sm">
                                      ID / Passport Number
                                    </Label>
                                    <Input
                                      id={`guest-id-${index}`}
                                      value={guest.idNumber}
                                      onChange={(e) =>
                                        handleGuestDetailChange(index, "idNumber", e.target.value)
                                      }
                                      placeholder="ID number"
                                      required
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <Label htmlFor={`guest-phone-${index}`} className="text-sm">
                                      Phone Number
                                    </Label>
                                    <Input
                                      id={`guest-phone-${index}`}
                                      value={guest.phone}
                                      onChange={(e) =>
                                        handleGuestDetailChange(index, "phone", e.target.value)
                                      }
                                      placeholder="Contact number"
                                      required
                                    />
                                  </div>
                                  <div className="sm:col-span-1">
                                    <Label htmlFor={`guest-email-${index}`} className="text-sm">
                                      Email
                                    </Label>
                                    <Input
                                      id={`guest-email-${index}`}
                                      type="email"
                                      value={guest.email}
                                      onChange={(e) =>
                                        handleGuestDetailChange(index, "email", e.target.value)
                                      }
                                      placeholder="guest@example.com"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBackToBooking}
                          className="sm:w-40"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full sm:flex-1"
                          disabled={isSubmitting || !guestDetailsComplete}
                        >
                          {isSubmitting ? "Processing..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </>
                  )}
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
