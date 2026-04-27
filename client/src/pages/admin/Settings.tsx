import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="font-serif text-base sm:text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4 sm:mb-5 pb-3 border-b border-[oklch(0.87_0.025_78)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function AdminSettingsInner() {
  const utils = trpc.useUtils();
  const { data: rawSettings = {} } = trpc.settings.get.useQuery();
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      toast.success("Settings saved!");
    },
    onError: (e) => toast.error("Failed to save settings: " + e.message),
  });
  const uploadMedia = trpc.media.upload.useMutation();

  const settings = rawSettings as Record<string, string>;
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Object.keys(settings).length > 0) setForm(settings);
  }, [JSON.stringify(settings)]);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => updateSettings.mutate({ settings: form });

  const handleImageUpload = async (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      try {
        const result = await uploadMedia.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64,
        });
        set(key, result.url);
        toast.success("Image uploaded!");
      } catch {
        toast.error("Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[oklch(0.18_0.05_60)]">
            Settings
          </h1>
          <p className="text-[oklch(0.50_0.03_65)] mt-1 text-sm">
            Manage site content, contact info, and images
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Brand */}
      <SettingsSection title="Brand & Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { key: "brand.name", label: "Business Name" },
            { key: "brand.tagline", label: "Tagline" },
            { key: "brand.heroTitle", label: "Hero Title" },
            { key: "brand.heroSubtitle", label: "Hero Subtitle" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Contact */}
      <SettingsSection title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { key: "contact.phone", label: "Phone Number" },
            { key: "contact.email", label: "Email Address" },
            { key: "contact.address", label: "Address" },
            {
              key: "contact.hours.weekdays",
              label: "Weekday Hours (e.g. Mon–Fri: 9am–7pm)",
            },
            { key: "contact.hours.saturday", label: "Saturday Hours" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About Section">
        <div className="space-y-4">
          {[
            { key: "about.heading", label: "Section Heading" },
            { key: "about.subheading", label: "Subheading" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
              About Body Text
            </label>
            <textarea
              value={form["about.body"] || ""}
              onChange={(e) => set("about.body", e.target.value)}
              rows={5}
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)] resize-none"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Images */}
      <SettingsSection title="Images & Media">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {[
            { key: "image.hero", label: "Hero Background Image" },
            { key: "image.about", label: "About Section Image" },
            { key: "image.logo", label: "Logo Image" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-2">
                {label}
              </label>
              {form[key] && (
                <img
                  src={form[key]}
                  alt={label}
                  className="w-full h-28 sm:h-32 object-cover rounded-xl mb-2 border border-[oklch(0.87_0.025_78)]"
                />
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form[key] || ""}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="Image URL or upload"
                  className="flex-1 min-w-0 border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
                />
                <label className="btn-outline text-sm flex items-center gap-1 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(key, f);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* Booking */}
      <SettingsSection title="Booking Configuration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { key: "booking.notice", label: "Minimum Notice (hours)" },
            {
              key: "booking.slots",
              label: "Available Time Slots (comma-separated)",
            },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[oklch(0.50_0.03_65)] mb-1">
                {label}
              </label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[oklch(0.52_0.10_75)]"
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </>
  );
}

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings">
      <AdminSettingsInner />
    </AdminLayout>
  );
}
