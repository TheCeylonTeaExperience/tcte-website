import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FaMapMarkerAlt, FaHeart, FaLeaf } from "react-icons/fa";

export default function About() {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Tea Master",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      name: "Priya Sharma",
      role: "Tour Coordinator",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
      name: "Arjun Patel",
      role: "Tea Sommelier",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
    {
      name: "Meera Reddy",
      role: "Heritage Guide",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
  ];

  const values = [
    {
      icon: FaLeaf,
      title: "Sustainability",
      description:
        "We practice eco-friendly farming and preserve our tea heritage for future generations",
    },
    {
      icon: FaHeart,
      title: "Authenticity",
      description:
        "Every experience is rooted in traditional tea culture and genuine hospitality",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Local Heritage",
      description:
        "We celebrate and share the rich history of tea cultivation in our region",
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
              Our Story
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto drop-shadow">
              A journey of passion, tradition, and the perfect cup of tea
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Nestled in the misty hills of the tea country, Reviva Tea Tours
                  was born from a deep love for tea and a desire to share its
                  magic with the world. For three generations, our family has
                  nurtured these tea estates, preserving traditional methods while
                  embracing sustainable practices.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  What started as a small family plantation has blossomed into a
                  premier destination for tea enthusiasts. We believe that tea is
                  more than just a beverage—it's a journey, a story, and a
                  connection to the land and the people who cultivate it.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, we invite you to be part of this story. Walk through our
                  verdant fields, learn the art of tea plucking, witness the
                  transformation from leaf to cup, and savor the fruits of
                  centuries-old wisdom in every sip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-primary">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To create authentic, educational, and memorable tea experiences
                while preserving our heritage and protecting our environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary">
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-br from-primary to-primary/70 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-2 text-primary">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6 text-primary">
                Our Location
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Located in the heart of the hill country, our estate spans over
                200 acres of pristine tea gardens, surrounded by lush forests and
                breathtaking mountain views. The cool climate and rich soil create
                the perfect conditions for growing exceptional tea.
              </p>
              <div className="bg-secondary/10 p-6 rounded-lg inline-block">
                <FaMapMarkerAlt className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Tea Estate Road, Hill Country</p>
                <p className="text-muted-foreground">Altitude: 1,500m above sea level</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-primary">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Passionate experts dedicated to sharing the art and culture of tea
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-all duration-300 group-hover:scale-105 shadow-lg group-hover:shadow-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-primary">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
