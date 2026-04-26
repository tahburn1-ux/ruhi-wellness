import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGuard from "@/components/AdminGuard";
import { LayoutDashboard, CalendarCheck, Beaker, Star, Settings, MessageSquare, TrendingUp, Users, Clock, DollarSign, Droplets, LogOut, ChevronRight, Globe } from "lucide-react";

function AdminSidebar({ active }: { active: string }) {
  const { logout } = useAdminAuth();
  const nav = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
    { href: "/admin/services", icon: Beaker, label: "Services" },
    { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];
  return (
    <aside className="w-60 min-h-screen bg-[oklch(0.15_0.04_220)] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img
            src="/manus-storage/ruhi-logo-clean_b23934de.png"
            alt="Ruhi Wellness"
            className="h-10 w-auto object-contain" />
          <div className="text-xs text-white/50 ml-1">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              active === href ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}>
              <Icon className="w-4 h-4" />
              {label}
            </div>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            <Globe className="w-4 h-4" />
            View Site
          </div>
        </Link>
        <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export { AdminSidebar };

function AdminDashboardInner() {
  const { admin } = useAdminAuth();
  const { data: stats } = trpc.bookings.stats.useQuery();
  const { data: bookingsData } = trpc.bookings.list.useQuery({ limit: 5 });
  const bookings = (bookingsData as any)?.rows ?? (Array.isArray(bookingsData) ? bookingsData : []);
  const { data: messages = [] } = trpc.contact.list.useQuery();

  const unreadMessages = messages.filter((m: any) => m.status === "unread").length;

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[oklch(0.18_0.05_60)]">Dashboard</h1>
          <p className="text-[oklch(0.50_0.03_65)] mt-1">Welcome back, {admin?.username || "Admin"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Bookings", value: (stats as any)?.total || 0, icon: CalendarCheck, color: "oklch(0.38 0.09 220)" },
            { label: "Pending", value: (stats as any)?.pending || 0, icon: Clock, color: "oklch(0.65 0.15 60)" },
            { label: "Confirmed", value: (stats as any)?.confirmed || 0, icon: TrendingUp, color: "oklch(0.55 0.15 145)" },
            { label: "Unread Messages", value: unreadMessages, icon: MessageSquare, color: "oklch(0.55 0.12 195)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[oklch(0.50_0.03_65)]">{label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)]">Recent Bookings</h2>
              <Link href="/admin/bookings">
                <button className="text-xs text-[oklch(0.52_0.10_75)] font-semibold flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-[oklch(0.58_0.03_65)] text-center py-8">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[oklch(0.92_0.03_78)] transition-colors cursor-pointer">
                      <div>
                        <div className="font-medium text-sm text-[oklch(0.25_0.04_220)]">{b.fullName}</div>
                        <div className="text-xs text-[oklch(0.50_0.03_65)]">{b.serviceName} · {b.bookingDate}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "completed" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent messages */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)]">Recent Messages</h2>
              <Link href="/admin/messages">
                <button className="text-xs text-[oklch(0.52_0.10_75)] font-semibold flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            {messages.length === 0 ? (
              <p className="text-sm text-[oklch(0.58_0.03_65)] text-center py-8">No messages yet.</p>
            ) : (
              <div className="space-y-3">
                {(messages as any[]).slice(0, 5).map((m: any) => (
                  <div key={m.id} className="p-3 rounded-xl bg-[oklch(0.96_0.03_78)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[oklch(0.25_0.04_220)]">{m.fullName}</span>
                      {m.status === "unread" && <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.10_75)]" />}
                    </div>
                    <p className="text-xs text-[oklch(0.50_0.03_65)] line-clamp-2">{m.inquiry}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardInner />
    </AdminGuard>
  );
}
