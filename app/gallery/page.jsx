"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaTimes } from "react-icons/fa";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Placeholder images - replace with actual tea estate images
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
      alt: "Tea fields at sunrise",
      category: "Tea Fields",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1545033702-79061161f11a?w=800&q=80",
      alt: "Tea plucking experience",
      category: "Plucking Tour",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800&q=80",
      alt: "Tea tasting session",
      category: "Tasting Session",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80",
      alt: "Green tea plantation",
      category: "Tea Fields",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
      alt: "Black tea processing",
      category: "Processing",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
      alt: "Tea cups arrangement",
      category: "Tasting Session",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1597318130702-690dd509c0cc?w=800&q=80",
      alt: "Tea leaves close up",
      category: "Tea Fields",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
      alt: "Tea ceremony setup",
      category: "Tasting Session",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1563822249366-163bd08f49fe?w=800&q=80",
      alt: "Panoramic tea estate view",
      category: "Tea Fields",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
              Gallery
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto drop-shadow">
              Explore the beauty of our tea estates and experiences through these
              curated moments
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-4 border-primary/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="inline-block rounded-full bg-primary/85 px-3 py-1 text-sm font-semibold text-white shadow-sm backdrop-blur">
                        {image.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <FaTimes className="h-8 w-8" />
            </button>
            <div
              className="max-w-4xl w-full max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-lg font-medium">
                  {selectedImage.alt}
                </p>
                <p className="text-gray-300 text-sm">{selectedImage.category}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
