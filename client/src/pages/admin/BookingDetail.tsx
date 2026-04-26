import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { AdminSidebar } from "./Dashboard";
import AdminGuard from "@/components/AdminGuard";
import { ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";

function AdminBookingDetailInner() {
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();
  const { data: booking, isLoading } = trpc.bookings.byId.useQuery({ id: parseInt(id || "0") });
  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => { utils.bookings.byId.invalidate(); toast.success("Status updated"); }
  });

  if (isLoading) return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/bookings" />
      <main className="flex-1 p-8"><div className="animate-pulse space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl" />)}</div></main>
    </div>
  );

  if (!booking) return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/bookings" />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center"><p className="text-[oklch(0.50_0.03_65)]">Booking not found.</p><Link href="/admin/bookings"><button className="btn-primary mt-4">Back</button></Link></div>
      </main>
    </div>
  );

  const b = booking as any;
  const medHistory = b.medicalHistory || [];
  const medications = b.medications || [];
  const wellbeing = b.wellbeing || [];
  const ivntHistory = b.ivntHistory || {};
  const consentData = b.consentData || {};

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/bookings" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <Link href="/admin/bookings">
            <button className="flex items-center gap-2 text-sm text-[oklch(0.50_0.03_65)] hover:text-[oklch(0.52_0.10_75)] mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Bookings
            </button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[oklch(0.18_0.05_60)]">{b.fullName}</h1>
              <p className="text-[oklch(0.50_0.03_65)]">Ref: {b.reference}</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={b.status}
                onChange={e => updateStatus.mutate({ id: b.id, status: e.target.value as any })}
                className="px-4 py-2 rounded-xl border border-[oklch(0.87_0.025_78)] bg-white text-sm font-semibold text-[oklch(0.35_0.04_65)] focus:outline-none focus:border-[oklch(0.52_0.10_75)]">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking info */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Appointment Details</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: "Service", value: b.serviceName },
                { label: "Date", value: b.bookingDate },
                { label: "Time", value: b.bookingTime },
                { label: "Price", value: `£${parseFloat(b.servicePrice || "0").toFixed(2)}` },
                { label: "Email", value: b.email },
                { label: "Phone", value: b.phone },
                { label: "DOB", value: b.dob || "—" },
                { label: "Delivery Address", value: b.deliveryAddress || "Not provided" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[oklch(0.92_0.01_215)] last:border-0">
                  <span className="text-[oklch(0.50_0.03_65)]">{label}</span>
                  <span className="font-medium text-[oklch(0.25_0.04_220)]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Consent Checklist</h2>
            <div className="space-y-2">
              {[
                { key: "consent1", label: "Consents to IVNT" },
                { key: "consent2", label: "Medical history accurate" },
                { key: "consent3", label: "Understands withdrawal rights" },
                { key: "consent4", label: "Data retention agreed" },
                { key: "consent5", label: "18+ confirmed" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${consentData[key] ? "bg-green-100" : "bg-red-100"}`}>
                    {consentData[key] ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-500" />}
                  </div>
                  <span className="text-[oklch(0.35_0.04_65)]">{label}</span>
                </div>
              ))}
              {b.signatureName && (
                <div className="mt-4 pt-3 border-t border-[oklch(0.87_0.025_78)]">
                  <div className="text-xs text-[oklch(0.50_0.03_65)] mb-1">Signed by:</div>
                  <div className="font-serif italic text-lg text-[oklch(0.25_0.04_220)]">{b.signatureName}</div>
                </div>
              )}
            </div>
          </div>

          {/* IVNT History */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">IVNT History</h2>
            <div className="space-y-3 text-sm">
              {[
                { key: "previousIVNT", label: "Previous IVNT" },
                { key: "adverseReaction", label: "Adverse reaction" },
                { key: "allergies", label: "Known allergies" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between">
                    <span className="text-[oklch(0.50_0.03_65)]">{label}</span>
                    <span className={`font-semibold ${ivntHistory[key] === "yes" ? "text-red-600" : "text-green-600"}`}>
                      {ivntHistory[key] || "—"}
                    </span>
                  </div>
                  {ivntHistory[`${key}Details`] && (
                    <p className="text-xs text-[oklch(0.50_0.03_65)] mt-1 bg-[oklch(0.96_0.03_78)] rounded p-2">
                      {ivntHistory[`${key}Details`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical History */}
        {medHistory.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mt-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Medical History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medHistory.filter((m: any) => m.yes).map((m: any, i: number) => (
                <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="font-medium text-sm text-red-800">{m.condition}</div>
                  {m.details && <div className="text-xs text-red-600 mt-1">{m.details}</div>}
                </div>
              ))}
              {medHistory.filter((m: any) => m.yes).length === 0 && (
                <p className="text-sm text-[oklch(0.50_0.03_65)] col-span-2">No conditions reported.</p>
              )}
            </div>
          </div>
        )}

        {/* Medications */}
        {medications.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mt-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Current Medications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[oklch(0.87_0.025_78)]">
                    {["Medication", "Dose", "Frequency", "Reason"].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-[oklch(0.50_0.03_65)] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med: any, i: number) => (
                    <tr key={i} className="border-b border-[oklch(0.92_0.01_215)]">
                      <td className="py-2 px-3 text-[oklch(0.30_0.04_65)]">{med.name}</td>
                      <td className="py-2 px-3 text-[oklch(0.40_0.03_65)]">{med.dose}</td>
                      <td className="py-2 px-3 text-[oklch(0.40_0.03_65)]">{med.frequency}</td>
                      <td className="py-2 px-3 text-[oklch(0.40_0.03_65)]">{med.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wellbeing */}
        {wellbeing.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mt-6">
            <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Wellbeing Symptoms</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {wellbeing.filter((w: any) => w.yes).map((w: any, i: number) => (
                <div key={i} className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  {w.symptom}
                </div>
              ))}
              {wellbeing.filter((w: any) => w.yes).length === 0 && (
                <p className="text-sm text-[oklch(0.50_0.03_65)] col-span-3">No symptoms reported.</p>
              )}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <h2 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Admin Notes</h2>
          <textarea
            defaultValue={b.adminNotes || ""}
            placeholder="Add internal notes about this booking..."
            rows={4}
            onBlur={e => updateStatus.mutate({ id: b.id, status: b.status, adminNotes: e.target.value })}
            className="w-full border border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white resize-none"
          />
        </div>
      </main>
    </div>
  );
}

export default function AdminBookingDetail() {
  return (
    <AdminGuard>
      <AdminBookingDetailInner />
    </AdminGuard>
  );
}
