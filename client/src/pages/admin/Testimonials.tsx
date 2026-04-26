import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AdminSidebar } from "./Dashboard";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";
import { toast } from "sonner";

function TestimonialForm({ initial, onSave, onCancel }: { initial?: any; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial || { clientName: "", initials: "", rating: 5, text: "", serviceName: "", isActive: true, sortOrder: 0 });
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-[oklch(0.18_0.06_220)]">{initial ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <button onClick={onCancel}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          {[
            { key: "clientName", label: "Client Name *" },
            { key: "initials", label: "Initials (e.g. SM)" },
            { key: "serviceName", label: "Service Name" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.5_0.03_215)] mb-1">{label}</label>
              <input type="text" value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-[oklch(0.88_0.01_215)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[oklch(0.55_0.12_195)]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.5_0.03_215)] mb-1">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                  <Star className={`w-6 h-6 transition-colors ${n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-[oklch(0.8_0.01_215)]"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.5_0.03_215)] mb-1">Testimonial Text *</label>
            <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
              rows={4} className="w-full border border-[oklch(0.88_0.01_215)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[oklch(0.55_0.12_195)] resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.isActive ? "bg-[oklch(0.38_0.09_220)]" : "bg-[oklch(0.7_0.03_215)]"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-[oklch(0.35_0.03_220)]">Show on website</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="btn-primary flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> Save
          </button>
          <button onClick={onCancel} className="btn-outline text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTestimonials() {
  const utils = trpc.useUtils();
  const { data: testimonials = [] } = trpc.testimonials.listAll.useQuery();
  const create = trpc.testimonials.create.useMutation({ onSuccess: () => { utils.testimonials.listAll.invalidate(); setShowForm(false); toast.success("Testimonial added"); } });
  const update = trpc.testimonials.update.useMutation({ onSuccess: () => { utils.testimonials.listAll.invalidate(); setEditing(null); toast.success("Testimonial updated"); } });
  const del = trpc.testimonials.delete.useMutation({ onSuccess: () => { utils.testimonials.listAll.invalidate(); toast.success("Deleted"); } });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.01_210)]">
      <AdminSidebar active="/admin/testimonials" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[oklch(0.18_0.06_220)]">Testimonials</h1>
            <p className="text-[oklch(0.5_0.03_215)] mt-1">Manage client reviews shown on the website</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(testimonials as any[]).map((t: any) => (
            <div key={t.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-[oklch(0.35_0.03_220)] italic mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center text-white text-xs font-bold">
                    {t.initials || t.clientName.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[oklch(0.22_0.07_220)]">{t.clientName}</div>
                    {t.serviceName && <div className="text-xs text-[oklch(0.55_0.12_195)]">{t.serviceName}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.isActive ? "Live" : "Hidden"}
                  </span>
                  <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg hover:bg-[oklch(0.94_0.02_205)] text-[oklch(0.38_0.09_220)]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: t.id }); }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showForm && <TestimonialForm onSave={(d) => create.mutate(d)} onCancel={() => setShowForm(false)} />}
        {editing && <TestimonialForm initial={editing} onSave={(d) => update.mutate({ id: editing.id, ...d })} onCancel={() => setEditing(null)} />}
      </main>
    </div>
  );
}
