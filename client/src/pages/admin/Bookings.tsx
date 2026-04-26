import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { AdminSidebar } from "./Dashboard";
import { Search, Eye, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const utils = trpc.useUtils();
  const { data: bookingsData, isLoading } = trpc.bookings.list.useQuery({ search, status: statusFilter || undefined });
  const bookings = (bookingsData as any)?.rows ?? (Array.isArray(bookingsData) ? bookingsData : []);
  const updateStatus = trpc.bookings.updateStatus.useMutation({ onSuccess: () => utils.bookings.list.invalidate() });
  const deleteBooking = trpc.bookings.delete.useMutation({ onSuccess: () => { utils.bookings.list.invalidate(); toast.success("Booking deleted"); } });

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/bookings" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-[oklch(0.18_0.06_220)]">Bookings</h1>
          <p className="text-[oklch(0.5_0.03_215)] mt-1">Manage all client appointments and consent forms</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.6_0.03_215)]" />
            <input type="text" placeholder="Search by name, email, service..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[oklch(0.88_0.01_215)] rounded-xl bg-white text-sm focus:outline-none focus:border-[oklch(0.55_0.12_195)]"
            />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border border-[oklch(0.88_0.01_215)] rounded-xl bg-white text-sm focus:outline-none focus:border-[oklch(0.55_0.12_195)] text-[oklch(0.35_0.03_220)]">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.6_0.03_215)] pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[oklch(0.88_0.01_215)] bg-[oklch(0.96_0.01_210)]">
                  {["Client", "Service", "Date & Time", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-[oklch(0.45_0.03_215)] text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-[oklch(0.92_0.01_215)]">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-[oklch(0.94_0.02_205)] rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-[oklch(0.6_0.03_215)]">No bookings found.</td></tr>
                ) : (
                  bookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-[oklch(0.92_0.01_215)] hover:bg-[oklch(0.97_0.005_215)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-[oklch(0.25_0.04_220)]">{b.fullName}</div>
                        <div className="text-xs text-[oklch(0.55_0.03_215)]">{b.email}</div>
                      </td>
                      <td className="px-5 py-4 text-[oklch(0.35_0.03_220)]">{b.serviceName}</td>
                      <td className="px-5 py-4">
                        <div className="text-[oklch(0.35_0.03_220)]">{b.bookingDate}</div>
                        <div className="text-xs text-[oklch(0.55_0.03_215)]">{b.bookingTime}</div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={b.status}
                          onChange={e => updateStatus.mutate({ id: b.id, status: e.target.value as any })}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[b.status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/bookings/${b.id}`}>
                            <button className="p-1.5 rounded-lg hover:bg-[oklch(0.94_0.02_205)] text-[oklch(0.38_0.09_220)] transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => { if (confirm("Delete this booking?")) deleteBooking.mutate({ id: b.id }); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
