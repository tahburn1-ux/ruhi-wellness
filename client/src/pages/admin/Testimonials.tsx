import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";
import { toast } from "sonner";

function TestimonialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: any;
  onSave: (d: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(
    initial || {
      clientName: "",
      initials: "",
      rating: 5,
      text: "",
      serviceName: "",
      isActive: true,
      sortOrder: 0,
    }
  );
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="font-serif text-xl font-bold text-[oklch(0.18_0.05_60)]">
            {initial ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-[oklch(0.92_0.03_78)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { key: "clientName", label: "Client Name *" },
            { key: "initials", label: "Initials (e.g. SM)" },
            { key: "serviceName", label: "Service Name" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      n <= form.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-[oklch(0.80_0.02_78)]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
              Testimonial Text *
            </label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={4}
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)] resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                form.isActive
                  ? "bg-[oklch(0.52_0.10_75)]"
                  : "bg-[oklch(0.7_0.03_215)]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  form.isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm text-[oklch(0.35_0.04_65)]">
              Show on website
            </span>
          </label>
        </div>
        <div className="flex gap-3 mt-5 sm:mt-6">
          <button
            onClick={() => onSave(form)}
            className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center"
          >
            <Check className="w-4 h-4" /> Save
          </button>
          <button
            onClick={onCancel}
            className="btn-outline text-sm flex-1 justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminTestimonialsInner() {
  const utils = trpc.useUtils();
  const { data: testimonials = [] } = trpc.testimonials.listAll.useQuery();
  const create = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      utils.testimonials.listAll.invalidate();
      setShowForm(false);
      toast.success("Testimonial added");
    },
  });
  const update = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      utils.testimonials.listAll.invalidate();
      setEditing(null);
      toast.success("Testimonial updated");
    },
  });
  const del = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      utils.testimonials.listAll.invalidate();
      toast.success("Deleted");
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[oklch(0.18_0.05_60)]">
            Testimonials
          </h1>
          <p className="text-[oklch(0.50_0.03_65)] mt-1 text-sm">
            Manage client reviews shown on the website
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Testimonial</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {(testimonials as any[]).map((t: any) => (
          <div key={t.id} className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-[oklch(0.35_0.04_65)] italic mb-4 line-clamp-3">
              "{t.text}"
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.52_0.10_75)] to-[oklch(0.52_0.10_75)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.initials || t.clientName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[oklch(0.22_0.05_60)] truncate">
                    {t.clientName}
                  </div>
                  {t.serviceName && (
                    <div className="text-xs text-[oklch(0.52_0.10_75)] truncate">
                      {t.serviceName}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    t.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {t.isActive ? "Live" : "Hidden"}
                </span>
                <button
                  onClick={() => setEditing(t)}
                  className="p-1.5 rounded-lg hover:bg-[oklch(0.92_0.03_78)] text-[oklch(0.52_0.10_75)]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) del.mutate({ id: t.id });
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TestimonialForm
          onSave={(d) => create.mutate(d)}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editing && (
        <TestimonialForm
          initial={editing}
          onSave={(d) => update.mutate({ id: editing.id, ...d })}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}

export default function AdminTestimonials() {
  return (
    <AdminLayout title="Testimonials">
      <AdminTestimonialsInner />
    </AdminLayout>
  );
}
