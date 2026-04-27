import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/#benefits", label: "Benefits", hash: "benefits" },
  { href: "/services", label: "Our Drips" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  // Handle hash anchor navigation — works from any page
  const handleNavClick = useCallback((e: React.MouseEvent, href: string, hash?: string) => {
    if (!hash) return; // let normal Link handle it
    e.preventDefault();
    setOpen(false);
    if (location === "/") {
      // Already on home page — just scroll
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home first, then scroll after mount
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location, navigate]);

  const renderLink = (href: string, label: string, hash?: string, className?: string) => {
    if (hash) {
      return (
        <a
          key={label}
          href={href}
          onClick={(e) => handleNavClick(e, href, hash)}
          className={className}
        >
          {label}
        </a>
      );
    }
    return (
      <Link key={label} href={href}>
        <span className={className}>{label}</span>
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-blur shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Brand mark — mix-blend-mode:multiply makes cream bg invisible on light backgrounds */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <img
              src="/ruhi-logo.png"
              alt="Ruhi Wellness"
              className="h-14 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map(({ href, label, hash }) =>
            renderLink(
              href,
              label,
              hash,
              `text-[13px] font-medium tracking-wide cursor-pointer transition-colors duration-200 relative group
               ${location === href ? "text-[oklch(0.52_0.10_75)]" : "text-[oklch(0.30_0.05_62)] hover:text-[oklch(0.52_0.10_75)]"}`
            )
          )}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {user?.role === "admin" && (
            <Link href="/admin">
              <span className="text-[13px] font-medium text-[oklch(0.52_0.04_72)] hover:text-[oklch(0.52_0.10_75)] cursor-pointer transition-colors">
                Admin
              </span>
            </Link>
          )}
          <Link href="/booking">
            <button className="btn-primary text-[12px] py-2.5 px-6">Book Now</button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-[oklch(0.28_0.05_60)] hover:text-[oklch(0.52_0.10_75)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden navbar-blur border-t border-[oklch(0.87_0.025_78)]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4">
            {navLinks.map(({ href, label, hash }) =>
              renderLink(
                href,
                label,
                hash,
                "text-sm font-medium text-[oklch(0.30_0.05_62)] hover:text-[oklch(0.52_0.10_75)] cursor-pointer transition-colors block py-1"
              )
            )}
            {user?.role === "admin" && (
              <Link href="/admin">
                <span className="text-sm font-medium text-[oklch(0.52_0.04_72)] hover:text-[oklch(0.52_0.10_75)] cursor-pointer transition-colors block py-1">Admin</span>
              </Link>
            )}
            <Link href="/booking">
              <button className="btn-primary w-full mt-2">Book Now</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
