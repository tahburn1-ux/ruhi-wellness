import { Link } from "wouter";
import { Droplets, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.15_0.04_220)] text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.45_0.1_195)] flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold text-lg">Ruhi Wellness</span>
            </div>
            <p className="text-sm text-[oklch(0.7_0.03_215)] leading-relaxed">
              Elevating your baseline through clinical hydration and targeted cellular nutrition.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.7_0.03_215)] mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Health Disclaimer"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[oklch(0.65_0.03_215)] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.7_0.03_215)] mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "FAQs", href: "#" },
                { label: "Contact Clinic", href: "/contact" },
                { label: "Book Now", href: "/booking" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[oklch(0.65_0.03_215)] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.7_0.03_215)] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[oklch(0.65_0.03_215)]">
                <Phone className="w-4 h-4 text-[oklch(0.55_0.12_195)]" />
                +44 (0) 7700 900000
              </li>
              <li className="flex items-center gap-2 text-sm text-[oklch(0.65_0.03_215)]">
                <Mail className="w-4 h-4 text-[oklch(0.55_0.12_195)]" />
                hello@ruhiwellness.com
              </li>
              <li className="flex items-center gap-2 text-sm text-[oklch(0.65_0.03_215)]">
                <MapPin className="w-4 h-4 text-[oklch(0.55_0.12_195)]" />
                London, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[oklch(0.25_0.04_220)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[oklch(0.5_0.02_215)]">
            © 2025 Ruhi Wellness. Cellular Renewal & Hydration.
          </p>
          <p className="text-xs text-[oklch(0.5_0.02_215)]">
            All treatments administered by qualified healthcare professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
