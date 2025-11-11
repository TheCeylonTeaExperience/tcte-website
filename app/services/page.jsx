import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaLeaf, FaClock, FaUsers, FaCheck } from "react-icons/fa";

export default function Services() {
  const services = [
    {
      id: "plucking-tour",
      title: "Plucking Tour",
      price: "$45 - $65",
      duration: "2 hours",
      groupSize: "2-8 people",
      description:
        "Experience the art of tea plucking firsthand in our pristine tea gardens. Learn the traditional 'two leaves and a bud' technique from our expert pluckers.",
      image: "https://images.unsplash.com/photo-1545033702-79061161f11a?w=800&q=80",
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
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              Our Tea Experiences
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Choose from our curated programs designed for every tea enthusiast
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-serif font-bold mb-2">
                          {service.title}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          {service.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="h-4 w-4" />
                        <span>{service.groupSize}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      <p className="font-semibold flex items-center gap-2">
                        <FaLeaf className="h-4 w-4 text-primary" />
                        What's Included:
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <FaCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/book">Book This Experience</Link>
                    </Button>
                  </CardFooter>
                </Card>
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
