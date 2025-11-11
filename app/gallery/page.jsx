"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
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
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              Gallery
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Explore the beauty of our tea estates and experiences through these
              curated moments
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-sm font-medium">
                        {image.category}
                      </p>
                    </div>
                  </div>
                </Card>
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
