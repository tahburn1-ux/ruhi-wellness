import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Droplets } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => location === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.38_0.09_220)] to-[oklch(0.55_0.12_195)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-semibold text-lg text-[oklch(0.28_0.09_220)]">
            Ruhi Wellness
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors relative pb-1 ${
                isActive(link.href)
                  ? "text-[oklch(0.38_0.09_220)]"
                  : "text-[oklch(0.35_0.03_220)] hover:text-[oklch(0.38_0.09_220)]"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[oklch(0.38_0.09_220)] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm font-medium text-[oklch(0.5_0.03_215)] hover:text-[oklch(0.38_0.09_220)] transition-colors"
          >
            Admin
          </Link>
          <Link href="/booking">
            <button className="btn-primary text-sm py-2 px-5">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[oklch(0.38_0.09_220)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden navbar-blur border-t border-[oklch(0.88_0.01_215)]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[oklch(0.35_0.03_220)] hover:text-[oklch(0.38_0.09_220)] transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setOpen(false)}>
              <button className="btn-primary text-sm w-full">Book Now</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
