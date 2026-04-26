import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Clock, MapPin, Mail, Send, Car } from "lucide-react";
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            <Car className="w-3.5 h-3.5" />
            Mobile Service
          </div>
          <h1 className="font-serif text-5xl font-bold text-brown mb-4">
            Connect with Care.
          </h1>
          <p className="text-rw-muted text-lg max-w-xl">
            Get in touch to book your at-home IV therapy session or ask us anything about our treatments. We come to you — home, hotel, or office.
          </p>
        </div>
      </section>

      <section className="section-cream2 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-semibold text-brown mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brown mb-2">Message Received!</h3>
                <p className="text-rw-muted">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-brown mb-1">Full Name</label>
                  <input type="text" placeholder="Jane Doe"
                    value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className="w-full border-0 border-b-2 border-[oklch(0.87_0.025_78)] py-3 px-0 focus:outline-none focus:border-gold bg-transparent text-brown transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown mb-1">Email Address</label>
                  <input type="email" placeholder="jane@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border-0 border-b-2 border-[oklch(0.87_0.025_78)] py-3 px-0 focus:outline-none focus:border-gold bg-transparent text-brown transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown mb-1">Your Inquiry</label>
                  <textarea placeholder="How can we assist your wellness journey today?"
                    rows={5} value={form.inquiry} onChange={e => setForm({ ...form, inquiry: e.target.value })}
                    className="w-full border-2 border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 focus:outline-none focus:border-gold bg-[oklch(0.975_0.012_80)] text-brown resize-none transition-colors"
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
            {/* Phone */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.92_0.03_78)] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-brown mb-1">Direct Line</div>
                  <a href={`tel:${s["contact.phone"] || "+447700900000"}`}
                    className="text-gold font-semibold hover:underline">
                    {s["contact.phone"] || "+44 (0) 7700 900000"}
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.92_0.03_78)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-brown mb-1">Email</div>
                  <a href={`mailto:${s["contact.email"] || "hello@ruhiwellness.com"}`}
                    className="text-gold font-semibold hover:underline">
                    {s["contact.email"] || "hello@ruhiwellness.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.92_0.03_78)] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-brown mb-3">Service Hours</div>
                  <div className="space-y-1 text-sm text-rw-muted">
                    <div className="flex justify-between gap-8">
                      <span>Mon–Fri</span>
                      <span className="font-medium text-brown">{s["contact.hours.weekdays"]?.replace("Mon–Fri: ", "") || "9:00 AM – 7:00 PM"}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Saturday</span>
                      <span className="font-medium text-brown">{s["contact.hours.saturday"]?.replace("Saturday: ", "") || "10:00 AM – 5:00 PM"}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Sunday</span>
                      <span className="font-medium text-[oklch(0.58_0.03_65)]">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service area — mobile service, no fixed clinic */}
            <div className="glass-card rounded-2xl p-6 border border-[oklch(0.87_0.025_78)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.92_0.03_78)] flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-brown mb-1">We Come To You</div>
                  <p className="text-sm text-rw-muted leading-relaxed">
                    Ruhi Wellness is a fully mobile service. Our qualified nurse will travel to your home, hotel room, or office across{" "}
                    <span className="font-medium text-brown">{s["contact.serviceArea"] || "London & surrounding areas"}</span>.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gold">
                    <MapPin className="w-3.5 h-3.5" />
                    No clinic visit required
                  </div>
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
