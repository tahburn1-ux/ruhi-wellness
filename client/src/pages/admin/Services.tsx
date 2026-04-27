import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

function ServiceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(
    initial || {
      slug: "",
      name: "",
      tagline: "",
      category: "Wellness",
      tag: "",
      price: "",
      duration: "45 Min Session",
      description: "",
      icon: "droplet",
      ingredients: [],
      benefits: [],
      idealFor: [],
      isActive: true,
      sortOrder: 0,
    }
  );

  const setList = (key: string, val: string) => {
    const arr = val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm({ ...form, [key]: arr });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[oklch(0.18_0.05_60)]">
            {initial ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-[oklch(0.92_0.03_78)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* 2-col grid on sm+, single col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { key: "name", label: "Name *", type: "text" },
              { key: "slug", label: "Slug *", type: "text" },
              { key: "tagline", label: "Tagline", type: "text" },
              { key: "price", label: "Price (£) *", type: "number" },
              { key: "duration", label: "Duration", type: "text" },
              { key: "icon", label: "Icon (emoji)", type: "text" },
              { key: "tag", label: "Tag Badge", type: "text" },
              { key: "sortOrder", label: "Sort Order", type: "number" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        key === "sortOrder"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    })
                  }
                  className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
            >
              {["Wellness", "Recovery", "Beauty"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)] resize-none"
            />
          </div>
          {[
            { key: "ingredients", label: "Ingredients (one per line)" },
            { key: "benefits", label: "Benefits (one per line)" },
            { key: "idealFor", label: "Ideal For (one per line)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <textarea
                value={((form as any)[key] || []).join("\n")}
                onChange={(e) => setList(key, e.target.value)}
                rows={3}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)] resize-none"
              />
            </div>
          ))}
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
              Active (visible on site)
            </span>
          </label>
        </div>
        <div className="flex gap-3 mt-5 sm:mt-6">
          <button
            onClick={() => onSave(form)}
            className="btn-primary flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
          >
            <Check className="w-4 h-4" /> SAVE SERVICE
          </button>
          <button
            onClick={onCancel}
            className="btn-outline text-sm flex-1 sm:flex-none justify-center"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminServicesInner() {
  const utils = trpc.useUtils();
  const { data: services = [], isLoading } = trpc.services.listAll.useQuery();
  const createService = trpc.services.create.useMutation({
    onSuccess: () => {
      utils.services.listAll.invalidate();
      setShowForm(false);
      toast.success("Service created");
    },
    onError: (e) => toast.error("Failed to create: " + e.message),
  });
  const updateService = trpc.services.update.useMutation({
    onSuccess: () => {
      utils.services.listAll.invalidate();
      setEditing(null);
      toast.success("Service updated!");
    },
    onError: (e) => toast.error("Failed to save: " + e.message),
  });
  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => {
      utils.services.listAll.invalidate();
      toast.success("Service deleted");
    },
    onError: (e) => toast.error("Failed to delete: " + e.message),
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[oklch(0.18_0.05_60)]">
            Services
          </h1>
          <p className="text-[oklch(0.50_0.03_65)] mt-1 text-sm">
            Manage your IV drip treatments and pricing
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Service</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-2xl animate-pulse"
              />
            ))
          : (services as any[]).map((svc: any) => (
              <div key={svc.id} className="glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl sm:text-2xl shrink-0">
                      {svc.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[oklch(0.22_0.05_60)] truncate">
                        {svc.name}
                      </div>
                      <div className="text-xs text-[oklch(0.52_0.10_75)] truncate">
                        {svc.category} · {svc.tag}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${
                      svc.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {svc.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-[oklch(0.50_0.03_65)] line-clamp-2 mb-3">
                  {svc.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-[oklch(0.52_0.10_75)]">
                    £{parseFloat(svc.price).toFixed(0)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(svc)}
                      className="p-1.5 rounded-lg hover:bg-[oklch(0.92_0.03_78)] text-[oklch(0.52_0.10_75)]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this service?"))
                          deleteService.mutate({ id: svc.id });
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
        <ServiceForm
          onSave={(data) => createService.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editing && (
        <ServiceForm
          initial={editing}
          onSave={(data) =>
            updateService.mutate({ id: editing.id, ...data })
          }
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}

export default function AdminServices() {
  return (
    <AdminLayout title="Services">
      <AdminServicesInner />
    </AdminLayout>
  );
}
