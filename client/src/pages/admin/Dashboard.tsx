import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/AdminLayout";
import {
  CalendarCheck,
  Clock,
  TrendingUp,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

// Re-export AdminSidebar for any pages that still import it directly
export { AdminSidebar } from "@/components/AdminLayout";

function AdminDashboardInner() {
  const { admin } = useAdminAuth();
  const { data: stats } = trpc.bookings.stats.useQuery();
  const { data: bookingsData } = trpc.bookings.list.useQuery({ limit: 5 });
  const bookings =
    (bookingsData as any)?.rows ??
    (Array.isArray(bookingsData) ? bookingsData : []);
  const { data: messages = [] } = trpc.contact.list.useQuery();
  const unreadMessages = messages.filter((m: any) => m.status === "unread").length;

  return (
    <>
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[oklch(0.18_0.05_60)]">
          Dashboard
        </h1>
        <p className="text-[oklch(0.50_0.03_65)] mt-1 text-sm">
          Welcome back, {admin?.username || "Admin"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {[
          {
            label: "Total Bookings",
            value: (stats as any)?.total || 0,
            icon: CalendarCheck,
            color: "oklch(0.38 0.09 220)",
          },
          {
            label: "Pending",
            value: (stats as any)?.pending || 0,
            icon: Clock,
            color: "oklch(0.65 0.15 60)",
          },
          {
            label: "Confirmed",
            value: (stats as any)?.confirmed || 0,
            icon: TrendingUp,
            color: "oklch(0.55 0.15 145)",
          },
          {
            label: "Unread Messages",
            value: unreadMessages,
            icon: MessageSquare,
            color: "oklch(0.55 0.12 195)",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-[oklch(0.50_0.03_65)] leading-tight">
                {label}
              </span>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
              </div>
            </div>
            <div
              className="text-2xl sm:text-3xl font-bold"
              style={{ color }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent bookings + messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[oklch(0.22_0.05_60)]">
              Recent Bookings
            </h2>
            <Link href="/admin/bookings">
              <button className="text-xs text-[oklch(0.52_0.10_75)] font-semibold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-sm text-[oklch(0.58_0.03_65)] text-center py-8">
              No bookings yet.
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {bookings.map((b: any) => (
                <Link key={b.id} href={`/admin/bookings/${b.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[oklch(0.92_0.03_78)] transition-colors cursor-pointer gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-[oklch(0.25_0.04_220)] truncate">
                        {b.fullName}
                      </div>
                      <div className="text-xs text-[oklch(0.50_0.03_65)] truncate">
                        {b.serviceName} · {b.bookingDate}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[oklch(0.22_0.05_60)]">
              Recent Messages
            </h2>
            <Link href="/admin/messages">
              <button className="text-xs text-[oklch(0.52_0.10_75)] font-semibold flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-[oklch(0.58_0.03_65)] text-center py-8">
              No messages yet.
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {(messages as any[]).slice(0, 5).map((m: any) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-[oklch(0.96_0.03_78)]"
                >
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-medium text-sm text-[oklch(0.25_0.04_220)] truncate">
                      {m.fullName}
                    </span>
                    {m.status === "unread" && (
                      <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.10_75)] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[oklch(0.50_0.03_65)] line-clamp-2">
                    {m.inquiry}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <AdminDashboardInner />
    </AdminLayout>
  );
}
