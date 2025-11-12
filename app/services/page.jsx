"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { Button } from "@/components/ui/button";
import { FaLeaf, FaClock, FaUsers, FaCheck } from "react-icons/fa";

export default function Services() {
  const [isLoading, setIsLoading] = useState(true);
  const services = [
    {
      id: "plucking-tour",
      title: "Plucking Tour",
      price: "$45 - $65",
      duration: "2 hours",
      groupSize: "2-8 people",
      description:
        "Experience the art of tea plucking firsthand in our pristine tea gardens. Learn the traditional 'two leaves and a bud' technique from our expert pluckers.",
      image: "/image/PluckingTour.jpg",
      features: [
        "Hands-on tea plucking experience",
        "Traditional plucking techniques training",
        "Fresh tea leaves to take home",
        "Professional guidance throughout",
        "Scenic garden walk",
      ],
    },
    {
      id: "black-tea",
      title: "Black Tea Experience",
      price: "$55 - $75",
      duration: "2.5 hours",
      groupSize: "2-8 people",
      description:
        "Discover the complete journey of black tea from field to cup. Witness the withering, rolling, oxidation, and firing processes that create our signature black teas.",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
      features: [
        "Factory tour and processing demonstration",
        "Understanding oxidation levels",
        "Multiple black tea varieties tasting",
        "Learn brewing techniques",
        "Complimentary tea samples",
      ],
    },
    {
      id: "green-tea",
      title: "Green Tea Experience",
      price: "$55 - $75",
      duration: "2.5 hours",
      groupSize: "2-8 people",
      description:
        "Explore the delicate world of green tea production. Learn about the steaming and pan-firing methods that preserve the tea's natural antioxidants and fresh flavor.",
      image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80",
      features: [
        "Green tea processing demonstration",
        "Traditional Japanese and Chinese methods",
        "Health benefits education",
        "Premium green tea tasting",
        "Brewing workshop",
      ],
    },
    {
      id: "tea-tasting",
      title: "Tea Tasting Session",
      price: "$35 - $50",
      duration: "1.5 hours",
      groupSize: "2-8 people",
      description:
        "Embark on a sensory journey through our curated selection of premium teas. Develop your palate and learn professional tea evaluation techniques.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
      features: [
        "6-8 tea varieties tasting",
        "Professional cupping techniques",
        "Flavor profile identification",
        "Tea and food pairing basics",
        "Personalized recommendations",
      ],
    },
  ];

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Header />
      <FloatingActionButtons />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
              Our Tea Experiences
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto drop-shadow">
              Choose from our curated programs designed for every tea enthusiast
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="grid gap-8"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border-4 border-primary/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-primary/85 px-4 py-1 text-sm font-semibold text-white shadow-sm backdrop-blur">
                      {service.price}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-6 px-6 pt-6">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4 text-primary" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="h-4 w-4 text-primary" />
                        <span>{service.groupSize}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-semibold text-primary">
                        <FaLeaf className="h-4 w-4" />
                        What's Included
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <FaCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Button asChild className="w-full">
                      <Link href="/book">Book This Experience</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-6 text-primary">
                Customize Your Experience
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Want to combine multiple experiences? Our booking system allows you
                to select multiple programs and create your perfect tea day. Group
                discounts available for parties of 5 or more.
              </p>
              <Button asChild size="lg">
                <Link href="/book">Create Your Custom Experience</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
