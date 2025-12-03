"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleEffect from "@/components/ParticleEffect";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
  FaHeadset,
  FaGlobe,
} from "react-icons/fa";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true);

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      details: ["Galle, Sri Lanka"],
    },
    {
      icon: FaPhone,
      title: "Phone",
      details: ["(+94) XXX XXX XXXX"],
      link: "tel:(+94) XXX XXX XXXX",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["info@ceylonteaexperience.com", "bookings@ceylonteaexperience.com"],
      links: ["mailto:info@ceylonteaexperience.com", "mailto:bookings@ceylonteaexperience.com"],
    },
    {
      icon: FaGlobe,
      title: "Website",
      details: ["www.ceylonteaexperience.com"],
      link: "https://www.ceylonteaexperience.com",
    },
    {
      icon: FaClock,
      title: "Opening Hours",
      details: ["Daily – 9.00 AM to 7.00 PM"],
    },
  ];

  // WhatsApp deep link with pre-filled message
  const whatsappMessage = encodeURIComponent(
    "Hello! I'm interested in booking a tea tour experience at THE CEYLON TEA."
  );
  const whatsappLink = `https://wa.me/1234567890?text=${whatsappMessage}`;

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Header />
      <FloatingActionButtons />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #767014 0%, #C5BF81 50%, #767014 100%)' }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-block mb-6">
              <FaHeadset className="h-16 w-16 mx-auto mb-4 animate-pulse" style={{ color: '#ffffff' }} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-2xl" style={{ color: '#ffffff' }}>
              Contact Us
            </h1>
            <div className="h-1 w-32 mx-auto mb-6 rounded-full" style={{ background: 'linear-gradient(to right, transparent, #ffffff, transparent)' }}></div>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-lg font-light" style={{ color: '#ffffff', opacity: 0.95 }}>
              For bookings, group visits, collaborations, or general inquiries, reach out to us anytime.
            </p>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-16">
          <div className="container mx-auto px-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary flex-1 min-w-[300px] max-w-[380px]"
                >
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-br from-primary to-primary/70 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-primary">
                      {info.title}
                    </h3>
                    <div className="text-muted-foreground space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx}>
                          {info.links && info.links[idx] ? (
                            <a
                              href={info.links[idx]}
                              className="hover:text-primary transition-colors font-medium"
                            >
                              {detail}
                            </a>
                          ) : info.link && idx === 0 ? (
                            <a
                              href={info.link}
                              className="hover:text-primary transition-colors font-medium"
                            >
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="text-center mb-12">
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
                  Chat with us on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold mb-4 text-primary">
                Find Us Here
              </h2>
              <p className="text-muted-foreground">
                Located in the heart of the tea country
              </p>
            </div>

            {/* Embedded Google Map */}
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31685.984768749877!2d80.59668!3d6.94106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38173f1e09701%3A0x4ef18e3c9b3c9e0!2sNuwara%20Eliya%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="THE CEYLON TEA Location"
                ></iframe>
              </div>
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <a
                    href="https://maps.google.com/?q=Tea+Estate+Road+Hill+Country"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary">
              Ready to Experience Tea Tourism?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/book">Book Your Experience</Link>
              </Button>
              {/* <Button asChild size="lg" variant="outline">
                <Link href="/services">View Our Programs</Link>
              </Button> */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
