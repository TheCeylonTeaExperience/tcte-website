"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaLeaf,
  FaClock,
  FaUsers,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: "/image/PluckingTour.jpg",
      alt: "Lush tea fields at sunrise",
    },
    {
      url: "/image/g1.jpg",
      alt: "Lush tea fields at sunrise",
    },
    {
      url: "/image/g2.jpg",
      alt: "Green tea plantation",
    },
    {
      url: "/image/g3.jpg",
      alt: "Tea tasting session",
    },
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };
  const features = [
    {
      icon: FaLeaf,
      title: "Authentic Experience",
      description: "From leaf to cup, experience the complete tea journey",
    },
    {
      icon: FaClock,
      title: "Flexible Sessions",
      description: "Multiple time slots to fit your schedule",
    },
    {
      icon: FaUsers,
      title: "Expert Guides",
      description: "Learn from passionate tea masters",
    },
    {
      icon: FaStar,
      title: "Premium Quality",
      description: "Experience the finest teas in scenic estates",
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Image Slider */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Image Slider Background */}
          <div className="absolute inset-0 -z-10">
            {heroImages.map((image, index) => (
              <div
                key={image.url}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={index !== currentSlide}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors duration-200"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors duration-200"
            aria-label="Next slide"
          >
            <FaChevronRight className="h-6 w-6" />
          </button>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
            <div className="space-y-8 fade-in">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 max-w-4xl mx-auto leading-tight drop-shadow-lg">
                  Discover the Art of{" "}
                  <span className="text-yellow-300">Tea</span> in Paradise
                </h1>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto drop-shadow-md">
                Immerse yourself in authentic tea tourism experiences. From
                plucking to tasting, journey through the world of premium tea in
                our scenic estates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  <Link href="/book">Book Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm transition-colors duration-200"
                >
                  <Link href="/gallery">View Gallery</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-primary">
                Why Choose THE CEYLON TEA
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the finest tea tourism with our expertly curated
                programs
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg bg-white/90 backdrop-blur-sm group"
                >
                  <CardContent className="pt-8 text-center">
                    <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-3 text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Services Preview */}
        <section className="py-20 bg-gradient-to-br from-white via-secondary/5 to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-primary">
                Our Tea Experiences
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from our curated tea tourism programs designed for every
                tea enthusiast
              </p>
            </div>
            <div
              className="grid gap-8"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              }}
            >
              {[
                {
                  name: "Plucking Tour",
                  image: "/image/PluckingTour.jpg",
                  price: "From $45",
                },
                {
                  name: "Black Tea Experience",
                  image:
                    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
                  price: "From $55",
                },
                {
                  name: "Green Tea Experience",
                  image:
                    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80",
                  price: "From $55",
                },
                {
                  name: "Tea Tasting Session",
                  image:
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80",
                  price: "From $35",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-3xl border-4 border-primary/20 bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xl font-bold text-white drop-shadow-lg mb-1">
                        {service.name}
                      </p>
                      <p className="text-sm font-semibold text-secondary drop-shadow bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                        {service.price}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-6">
                      Discover the unique journey of tea production with expert
                      guides
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto p-0 text-primary font-semibold transition-colors duration-200 hover:text-primary/80"
                    >
                      <Link
                        href="/services"
                        className="flex items-center gap-1"
                      >
                        Learn More
                        <span>→</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto space-y-8 fade-in-up">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-6 drop-shadow-xl text-white">
                  Ready to Begin Your Tea Journey?
                </h2>
              </div>
              <p className="text-lg md:text-2xl mb-12 opacity-95 drop-shadow-lg max-w-3xl mx-auto">
                Book your authentic tea tourism experience today and create
                unforgettable memories in our scenic tea estates.
              </p>

              <div>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-xl px-12 py-8 bg-white text-primary hover:bg-white/90 font-bold rounded-full transition-colors duration-300"
                >
                  <Link href="/book">Book Your Experience</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap justify-center gap-12 text-base opacity-95">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors duration-200">
                  <FaStar className="text-secondary text-xl" />
                  <span className="font-semibold">5-Star Rated</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors duration-200">
                  <FaUsers className="text-secondary text-xl" />
                  <span className="font-semibold">1000+ Happy Guests</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors duration-200">
                  <FaLeaf className="text-secondary text-xl" />
                  <span className="font-semibold">100% Organic</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
