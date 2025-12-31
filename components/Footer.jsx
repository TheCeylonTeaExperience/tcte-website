import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaWhatsapp, href: "https://wa.me/1234567890", label: "WhatsApp" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold">THE CEYLON TEA EXPERIENCE</h3>
        
            <p className="text-sm opacity-90">
              DISCOVER THE ART OF CEYLON TEA
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-90 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm opacity-90 hover:opacity-100"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-90">
              {/* <li>Tea Estate Road, Hill Country</li> */}
              <li>
                
                <a href="tel:+1234567890" className="hover:opacity-100">
                  (+94) XXX XXX XXXX
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ceylonteaexperience.com"
                  className="hover:opacity-100"
                >
                  info@ceylonteaexperience.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:bookings@ceylonteaexperience.com"
                  className="hover:opacity-100"
                >
                  bookings@ceylonteaexperience.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.ceylonteaexperience.com"
                  className="hover:opacity-100"
                >
                  www.ceylonteaexperience.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; {currentYear} THE CEYLON TEA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
