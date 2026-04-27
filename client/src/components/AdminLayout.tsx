import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGuard from "@/components/AdminGuard";
import {
  LayoutDashboard,
  CalendarCheck,
  Beaker,
  Star,
  Settings,
  MessageSquare,
  LogOut,
  Globe,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
  { href: "/admin/services", icon: Beaker, label: "Services" },
  { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

function SidebarContent({
  active,
  onNavClick,
}: {
  active: string;
  onNavClick?: () => void;
}) {
  const { logout } = useAdminAuth();
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img
            src="/ruhi-logo.png"
            alt="Ruhi Wellness"
            className="h-10 w-auto object-contain"
          />
          <div className="text-xs text-white/50 ml-1">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active === href
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/">
          <div
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            View Site
          </div>
        </Link>
        <button
          onClick={() => {
            onNavClick?.();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

function AdminLayoutInner({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeLabel =
    navItems.find((n) => n.href === location)?.label ?? title ?? "Admin";

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      {/* ── Desktop sidebar (always visible on lg+) ── */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-[oklch(0.15_0.04_220)] text-white flex-col shrink-0">
        <SidebarContent active={location} />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-[oklch(0.15_0.04_220)] text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent
          active={location}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-[oklch(0.15_0.04_220)] text-white shadow-md">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/ruhi-logo.png"
            alt="Ruhi Wellness"
            className="h-7 w-auto object-contain"
          />
          <span className="text-sm font-medium text-white/80 ml-1">
            {activeLabel}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminLayoutInner title={title}>{children}</AdminLayoutInner>
    </AdminGuard>
  );
}

// Re-export AdminSidebar for backward compatibility (no longer needed but keeps imports working)
export function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="hidden lg:flex w-60 min-h-screen bg-[oklch(0.15_0.04_220)] text-white flex-col shrink-0">
      <SidebarContent active={active} />
    </aside>
  );
}
