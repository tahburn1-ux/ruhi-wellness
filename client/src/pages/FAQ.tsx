import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "About IV Therapy",
    items: [
      {
        q: "What is IV drip therapy?",
        a: "IV (intravenous) drip therapy delivers vitamins, minerals, antioxidants, and hydration directly into your bloodstream via a small cannula. This bypasses the digestive system, allowing 100% absorption — compared to only 20–30% from oral supplements. Sessions typically last 30–60 minutes and are administered by a qualified nurse.",
      },
      {
        q: "Is IV therapy safe?",
        a: "Yes. All Ruhi Wellness sessions are administered by fully registered, experienced nurses. We use only pharmaceutical-grade ingredients sourced from regulated UK suppliers. A brief health consultation is conducted before every session to ensure suitability. IV therapy is not recommended for individuals with certain medical conditions — our team will advise you during the consultation.",
      },
      {
        q: "How will I feel after a session?",
        a: "Most clients report feeling refreshed, energised, and mentally clearer within a few hours of their session. Results vary depending on the drip selected and individual health status. Hydration and immune-focused drips tend to produce the most immediate effects.",
      },
      {
        q: "How often should I have IV therapy?",
        a: "This depends on your wellness goals. For general maintenance and hydration, once or twice a month is typical. For recovery or performance goals, sessions may be scheduled more frequently. Our team will advise a personalised schedule during your consultation.",
      },
    ],
  },
  {
    category: "Our Service",
    items: [
      {
        q: "Where do you administer the drips?",
        a: "Ruhi Wellness is a fully mobile service. We come to you — your home, hotel room, or office anywhere across London and surrounding areas. No clinic visit is required. Simply book online and our nurse will arrive at your chosen location at the agreed time.",
      },
      {
        q: "What areas do you cover?",
        a: "We currently serve London and surrounding areas. If you are unsure whether we cover your location, please contact us at hello@ruhiwellness.com or call +44 (0) 7700 900000 and we will do our best to accommodate you.",
      },
      {
        q: "How long does a session take?",
        a: "Sessions range from 30 to 60 minutes depending on the drip selected. Please also allow an additional 10–15 minutes for the initial health consultation and cannula placement. We recommend having a light meal or snack before your appointment.",
      },
      {
        q: "Can I book for a group or event?",
        a: "Absolutely. We offer group bookings for events, hen parties, corporate wellness days, and more. Please contact us directly at hello@ruhiwellness.com to discuss group pricing and availability.",
      },
    ],
  },
  {
    category: "Booking & Payment",
    items: [
      {
        q: "How do I book a session?",
        a: "You can book directly through our website using the 'Book Now' button. Select your preferred drip, choose a date and time, complete your details, and sign the consent form. You will receive a confirmation email once your booking is confirmed.",
      },
      {
        q: "What is your cancellation policy?",
        a: "We require at least 24 hours' notice for cancellations or rescheduling. Cancellations made with less than 24 hours' notice may be subject to a cancellation fee. Please contact us as soon as possible if you need to change your appointment.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, as well as bank transfers. Payment details will be provided at the time of booking confirmation. We do not accept cash payments.",
      },
      {
        q: "Do you offer gift vouchers?",
        a: "Yes! Ruhi Wellness gift vouchers make a wonderful gift for birthdays, anniversaries, or any occasion. Please contact us at hello@ruhiwellness.com to purchase a gift voucher.",
      },
    ],
  },
  {
    category: "Health & Safety",
    items: [
      {
        q: "Who is IV therapy NOT suitable for?",
        a: "IV therapy may not be suitable for individuals who are pregnant or breastfeeding, have kidney or heart disease, have certain blood disorders, or are taking specific medications. A full health questionnaire is completed before every session. If you have any concerns, please consult your GP before booking.",
      },
      {
        q: "Are there any side effects?",
        a: "IV therapy is generally very well tolerated. Some clients may experience mild bruising or discomfort at the cannula site, which resolves quickly. Rarely, some individuals may experience a cool sensation during infusion or mild nausea. Our nurses are trained to manage any reactions and will monitor you throughout your session.",
      },
      {
        q: "Do I need a GP referral?",
        a: "No GP referral is required. However, we do conduct a health consultation before every session and reserve the right to decline treatment if we believe it is not in your best interest. We always prioritise your safety.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[oklch(0.87_0.025_78)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="font-medium text-brown group-hover:text-gold transition-colors">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gold flex-shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-rw-muted leading-relaxed text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Centre
          </div>
          <h1 className="font-serif text-5xl font-bold text-brown mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-rw-muted text-lg max-w-xl">
            Everything you need to know about Ruhi Wellness and our mobile IV drip therapy service.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-cream2 py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-4 pb-2 border-b-2 border-gold/30">
                {section.category}
              </h2>
              <div className="glass-card rounded-2xl px-6">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <div className="glass-card rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-brown mb-3">Still have questions?</h3>
            <p className="text-rw-muted mb-6">
              Our team is happy to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@ruhiwellness.com"
                className="btn-gold px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-widest"
              >
                Email Us
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-widest border-2 border-gold text-gold hover:bg-gold hover:text-white transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
