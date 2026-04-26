import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Clock, MapPin, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const { data: settings = {} } = trpc.settings.get.useQuery();
  const sendMessage = trpc.contact.send.useMutation();
  const [form, setForm] = useState({ fullName: "", email: "", inquiry: "" });
  const [sent, setSent] = useState(false);

  const s = settings as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.inquiry) { toast.error("Please fill in your name and inquiry."); return; }
    try {
      await sendMessage.mutateAsync(form);
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-serif text-5xl font-bold text-[oklch(0.18_0.06_220)] mb-4">
            Connect with Care.
          </h1>
          <p className="text-[oklch(0.45_0.03_215)] text-lg max-w-xl">
            Reach out to schedule your specialised hydration therapy or speak with one of our clinical wellness specialists.
          </p>
        </div>
      </section>

      <section className="section-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-semibold text-[oklch(0.22_0.07_220)] mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.07_220)] mb-2">Message Received!</h3>
                <p className="text-[oklch(0.5_0.03_215)]">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.35_0.03_220)] mb-1">Full Name</label>
                  <input type="text" placeholder="Jane Doe"
                    value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className="w-full border-0 border-b-2 border-[oklch(0.88_0.01_215)] py-3 px-0 focus:outline-none focus:border-[oklch(0.55_0.12_195)] bg-transparent text-[oklch(0.25_0.04_220)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.35_0.03_220)] mb-1">Email Address</label>
                  <input type="email" placeholder="jane@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border-0 border-b-2 border-[oklch(0.88_0.01_215)] py-3 px-0 focus:outline-none focus:border-[oklch(0.55_0.12_195)] bg-transparent text-[oklch(0.25_0.04_220)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[oklch(0.35_0.03_220)] mb-1">Your Inquiry</label>
                  <textarea placeholder="How can we assist your wellness journey today?"
                    rows={5} value={form.inquiry} onChange={e => setForm({ ...form, inquiry: e.target.value })}
                    className="w-full border-2 border-[oklch(0.88_0.01_215)] rounded-xl px-4 py-3 focus:outline-none focus:border-[oklch(0.55_0.12_195)] bg-white text-[oklch(0.25_0.04_220)] resize-none transition-colors"
                  />
                </div>
                <button type="submit" disabled={sendMessage.isPending}
                  className="btn-primary flex items-center gap-2 disabled:opacity-70">
                  {sendMessage.isPending ? "Sending..." : <>Submit Request <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>

          {/* Info cards */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.94_0.02_205)] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[oklch(0.38_0.09_220)]" />
                </div>
                <div>
                  <div className="font-semibold text-[oklch(0.35_0.03_220)] mb-1">Direct Line</div>
                  <a href={`tel:${s["contact.phone"] || "+447700900000"}`}
                    className="text-[oklch(0.38_0.09_220)] font-semibold hover:underline">
                    {s["contact.phone"] || "+44 (0) 7700 900000"}
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.94_0.02_205)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[oklch(0.38_0.09_220)]" />
                </div>
                <div>
                  <div className="font-semibold text-[oklch(0.35_0.03_220)] mb-1">Email</div>
                  <a href={`mailto:${s["contact.email"] || "hello@ruhiwellness.com"}`}
                    className="text-[oklch(0.38_0.09_220)] font-semibold hover:underline">
                    {s["contact.email"] || "hello@ruhiwellness.com"}
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.94_0.02_205)] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[oklch(0.38_0.09_220)]" />
                </div>
                <div>
                  <div className="font-semibold text-[oklch(0.35_0.03_220)] mb-3">Clinical Hours</div>
                  <div className="space-y-1 text-sm text-[oklch(0.45_0.03_215)]">
                    <div className="flex justify-between gap-8">
                      <span>Mon–Fri</span>
                      <span className="font-medium">{s["contact.hours.weekdays"]?.replace("Mon–Fri: ", "") || "9:00 AM – 7:00 PM"}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Saturday</span>
                      <span className="font-medium">{s["contact.hours.saturday"]?.replace("Saturday: ", "") || "10:00 AM – 5:00 PM"}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Sunday</span>
                      <span className="font-medium text-[oklch(0.6_0.03_215)]">Closed for Renewal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.94_0.02_205)] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[oklch(0.38_0.09_220)]" />
                </div>
                <div>
                  <div className="font-semibold text-[oklch(0.35_0.03_220)] mb-1">Location</div>
                  <p className="text-sm text-[oklch(0.45_0.03_215)]">
                    {s["contact.address"] || "London, United Kingdom"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
