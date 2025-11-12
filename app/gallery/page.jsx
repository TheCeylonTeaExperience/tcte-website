"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleEffect from "@/components/ParticleEffect";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
      alt: "Tea fields at sunrise",
      category: "Tea Fields",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1518989229641-1e87b979d145?auto=format&fit=crop&w=1200&q=80",
      alt: "Guided tea plucking tour",
      category: "Plucking Tour",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=1200&q=80",
      alt: "Tea tasting setup with cups",
      category: "Tasting Session",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80",
      alt: "Rolling hills of green tea",
      category: "Tea Fields",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=80",
      alt: "Processing fresh black tea leaves",
      category: "Processing",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=80",
      alt: "Elegant tea cup arrangement",
      category: "Tasting Session",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1597318130702-690dd509c0cc?auto=format&fit=crop&w=1200&q=80",
      alt: "Fresh tea leaves close-up",
      category: "Tea Fields",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
      alt: "Tea ceremony setup with kettle",
      category: "Tasting Session",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1563822249366-163bd08f49fe?auto=format&fit=crop&w=1200&q=80",
      alt: "Panoramic tea estate view",
      category: "Tea Fields",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1573875376991-9625d31b7a03?auto=format&fit=crop&w=1200&q=80",
      alt: "Traditional wooden tea house",
      category: "Heritage",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1505731132160-eca3da39b807?auto=format&fit=crop&w=1200&q=80",
      alt: "Tea plantation workers harvesting",
      category: "Plucking Tour",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1464306208223-e0b4495a5553?auto=format&fit=crop&w=1200&q=80",
      alt: "Assortment of loose leaf teas",
      category: "Tea Varietals",
    },
  ];

  // Navigation functions
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };

  const goToPrevious = () => {
    const prevIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const goToNext = () => {
    const nextIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  // Touch/Swipe navigation
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, selectedImageIndex]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Header />
      <FloatingActionButtons />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground py-24 relative overflow-hidden">
          <ParticleEffect particleCount={15} color="rgba(255, 255, 255, 0.15)" size={1.5} speed={0.2} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 morph animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 morph animate-float" style={{animationDelay: '1s'}} />
          
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
        <section className="py-20 bg-gradient-to-b from-background via-secondary/5 to-primary/5 relative overflow-hidden">
          {/* Decorative floating elements */}
          <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-secondary/20 rounded-full animate-float" style={{animationDelay: "2s"}} />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl font-serif font-bold mb-4 text-primary gradient-text">
                Moments Captured in Time
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every image tells a story of tradition, craftsmanship, and the beauty of tea
              </p>
            </div>
            
            <div
              className="grid gap-8 stagger-children"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border-4 border-primary/20 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-500 hover:-translate-y-6 hover:border-primary/50 hover:shadow-2xl animate-scale-in hover-lift"
                  onClick={() => openLightbox(image, index)}
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-1"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-full p-6 transition-all duration-500 group-hover:translate-y-0">
                      <div className="space-y-2">
                        <p className="text-white font-bold text-lg drop-shadow-lg">{image.alt}</p>
                        <p className="inline-block rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur border border-white/20 animate-shimmer">
                          {image.category}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" style={{background: 'linear-gradient(45deg, transparent 30%, rgba(56, 142, 60, 0.1) 50%, transparent 70%)'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Lightbox with Slideshow */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 z-60 bg-black/30 backdrop-blur-sm p-3 rounded-full hover:bg-black/50 magnetic"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <FaTimes className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 text-white/80 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full z-60">
              <span className="text-sm font-medium">
                {selectedImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Previous Button */}
            <button
              className="group absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 z-60 bg-black/40 backdrop-blur-md p-4 rounded-full hover:bg-primary/80 magnetic liquid-btn border border-white/20 hover:border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              <FaChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Next Button */}
            <button
              className="group absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 z-60 bg-black/40 backdrop-blur-md p-4 rounded-full hover:bg-primary/80 magnetic liquid-btn border border-white/20 hover:border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <FaChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-l from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <div
              className="max-w-5xl w-full max-h-[90vh] relative animate-scale-in"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain animate-fade-in-up transition-all duration-500 ease-in-out transform"
                  style={{
                    filter: 'brightness(1) contrast(1.05)',
                  }}
                />
                
                {/* Enhanced image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Animated info panel */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent animate-slide-in-left">
                  <div className="space-y-3">
                    <p className="text-white text-2xl font-bold drop-shadow-lg animate-text-reveal">
                      {selectedImage.alt}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="inline-block rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur border border-white/20 animate-bounce-in">
                        {selectedImage.category}
                      </p>
                      <p className="text-white/80 text-sm animate-fade-in-up" style={{animationDelay: "0.3s"}}>
                        Use ← → keys or click arrows to navigate • ESC to close
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 animate-rotate-in" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 animate-rotate-in" style={{animationDelay: "0.1s"}} />
                <div className="absolute bottom-20 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 animate-rotate-in" style={{animationDelay: "0.2s"}} />
                <div className="absolute bottom-20 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 animate-rotate-in" style={{animationDelay: "0.3s"}} />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-60">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <div className="flex gap-2 max-w-xs sm:max-w-md md:max-w-lg overflow-x-auto scrollbar-hide scroll-smooth">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                        setSelectedImage(images[index]);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 magnetic ${
                        index === selectedImageIndex
                          ? "border-white shadow-lg shadow-white/20"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === selectedImageIndex && (
                        <div className="absolute inset-0 bg-white/20 animate-fade-in" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-60">
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                      setSelectedImage(images[index]);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === selectedImageIndex
                        ? "bg-white shadow-lg shadow-white/20"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
