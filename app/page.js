import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaLeaf, FaClock, FaUsers, FaStar } from "react-icons/fa";

export default function Home() {
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
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary mb-6 max-w-4xl mx-auto leading-tight">
              Discover the Art of Tea in Paradise
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Immerse yourself in authentic tea tourism experiences. From plucking
              to tasting, journey through the world of premium tea in our scenic
              estates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/book">Book Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
              >
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12 text-primary">
              Why Choose Reviva Tea Tours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6 text-center">
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-serif font-bold text-xl mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Services Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-primary">
                Our Tea Experiences
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from our curated tea tourism programs designed for every tea
                enthusiast
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Plucking Tour",
                "Black Tea Experience",
                "Green Tea Experience",
                "Tea Tasting Session",
              ].map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-serif font-bold text-lg mb-2">
                      {service}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Discover the unique journey of tea production
                    </p>
                    <Button asChild variant="link" className="p-0">
                      <Link href="/services">Learn More →</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Ready to Begin Your Tea Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Book your authentic tea tourism experience today and create
              unforgettable memories in our scenic tea estates.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link href="/book">Book Your Experience</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
