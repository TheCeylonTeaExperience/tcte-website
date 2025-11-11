import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";

export default function Contact() {
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      details: ["Tea Estate Road", "Hill Country", "Postal Code: 12345"],
    },
    {
      icon: FaPhone,
      title: "Phone",
      details: ["+1 (234) 567-890"],
      link: "tel:+1234567890",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["info@revivatea.com"],
      link: "mailto:info@revivatea.com",
    },
    {
      icon: FaClock,
      title: "Hours",
      details: ["Monday - Sunday", "9:00 AM - 5:00 PM"],
    },
  ];

  // WhatsApp deep link with pre-filled message
  const whatsappMessage = encodeURIComponent(
    "Hello! I'm interested in booking a tea tour experience at Reviva Tea Tours."
  );
  const whatsappLink = `https://wa.me/1234567890?text=${whatsappMessage}`;

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
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl opacity-95 max-w-2xl mx-auto drop-shadow">
              Have questions? We're here to help you plan your perfect tea
              experience
            </p>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary">
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-br from-primary to-primary/70 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-primary">{info.title}</h3>
                    <div className="text-muted-foreground space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx}>
                          {info.link && idx === 0 ? (
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
                  title="Reviva Tea Tours Location"
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
                <a href="/book">Book Your Visit</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/services">View Our Programs</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
