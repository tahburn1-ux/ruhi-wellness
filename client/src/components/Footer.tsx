import { Link } from "wouter";
import { Droplets, Phone, Mail, MapPin, Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.18_0.05_60)] text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/ruhi-logo.png"
                alt="Ruhi Wellness"
                className="h-14 w-auto object-contain" />
            </div>
            <p className="text-sm text-[oklch(0.72_0.04_68)] leading-relaxed">
              Premium mobile IV therapy delivered to your home, hotel, or office across London.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[oklch(0.62_0.08_75)] font-semibold">
              <Car className="w-3.5 h-3.5" />
              We come to you
            </div>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.72_0.04_68)] mb-4">Treatments</h4>
            <ul className="space-y-2">
              {[
                { label: "All Drips", href: "/services" },
                { label: "Wellness Drips", href: "/services" },
                { label: "Recovery Drips", href: "/services" },
                { label: "Beauty Drips", href: "/services" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[oklch(0.65_0.03_65)] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.72_0.04_68)] mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "Book a Session", href: "/booking" },
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "#" },
                { label: "Health Disclaimer", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[oklch(0.65_0.03_65)] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.72_0.04_68)] mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[oklch(0.65_0.03_65)]">
                <Phone className="w-4 h-4 text-[oklch(0.62_0.08_75)]" />
                +44 (0) 7700 900000
              </li>
              <li className="flex items-center gap-2 text-sm text-[oklch(0.65_0.03_65)]">
                <Mail className="w-4 h-4 text-[oklch(0.62_0.08_75)]" />
                hello@ruhiwellness.com
              </li>
              <li className="flex items-start gap-2 text-sm text-[oklch(0.65_0.03_65)]">
                <MapPin className="w-4 h-4 text-[oklch(0.62_0.08_75)] mt-0.5 flex-shrink-0" />
                <span>Serving London &amp; surrounding areas.<br />We travel to you.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[oklch(0.28_0.05_62)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[oklch(0.52_0.03_65)]">
            © 2025 Ruhi Wellness. Mobile IV Therapy &amp; Cellular Renewal.
          </p>
          <p className="text-xs text-[oklch(0.52_0.03_65)]">
            All treatments administered by qualified healthcare professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
