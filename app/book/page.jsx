"use client";

import { useState } from "react";
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

export default function BookNow() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    location: "",
    session: "",
    programs: [],
    packs: 1,
    payment: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const programs = [
    "Plucking Tour",
    "Black Tea Experience",
    "Green Tea Experience",
    "Tea Tasting Session",
  ];

  const sessions = [
    "9:30 AM - 11:30 AM",
    "10:30 AM - 12:30 PM",
    "2:30 PM - 4:30 PM",
    "3:30 PM - 5:30 PM",
  ];

  const locations = [
    "Hill Country Estate",
    "Mountain View Plantation",
    "Valley Gardens",
    "Sunrise Estate",
  ];

  const countryCodes = [
    { code: "+1", country: "US/CA" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+94", country: "LK" },
    { code: "+61", country: "AU" },
    { code: "+86", country: "CN" },
  ];

  const handleProgramToggle = (program) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter((p) => p !== program)
        : [...prev.programs, program],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
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
      `Hi! I've just booked a tea tour.\n\nReference Code: ${referenceCode}\nName: ${formData.name}\nDate: ${format(selectedDate, "PPP")}\nSession: ${formData.session}\nPrograms: ${formData.programs.join(", ")}`
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
                      <strong>Session:</strong> {formData.session}
                    </p>
                    <p>
                      <strong>Programs:</strong> {formData.programs.join(", ")}
                    </p>
                    <p>
                      <strong>Location:</strong> {formData.location}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  A confirmation email has been sent to <strong>{formData.email}</strong>. 
                  Please check your inbox for complete details and instructions.
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
                    <a href="/">Return to Home</a>
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
                          {locations.map((loc) => (
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

                    <div>
                      <Label htmlFor="session">Select Session *</Label>
                      <Select
                        value={formData.session}
                        onValueChange={(value) =>
                          setFormData({ ...formData, session: value })
                        }
                        required
                      >
                        <SelectTrigger id="session">
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map((sess) => (
                            <SelectItem key={sess} value={sess}>
                              {sess}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Select Programs * (Select one or more)</Label>
                      <div className="space-y-3 mt-2">
                        {programs.map((program) => (
                          <div key={program} className="flex items-center space-x-2">
                            <Checkbox
                              id={program}
                              checked={formData.programs.includes(program)}
                              onCheckedChange={() => handleProgramToggle(program)}
                            />
                            <label
                              htmlFor={program}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {program}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="packs">
                        Number of People (0-8)
                      </Label>
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
                          Note: Partial payment requires at least 25% payment upon
                          arrival
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
                    disabled={isSubmitting || !selectedDate || formData.programs.length === 0}
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
