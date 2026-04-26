import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DripScrollIndicator from "@/components/DripScrollIndicator";
import { ArrowRight, Star, ChevronRight, Zap, Shield, Clock, Award } from "lucide-react";

// ── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ service }: { service: any }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card cursor-pointer h-64`}
      onClick={() => setFlipped(!flipped)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="flip-card-front glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{service.icon}</span>
              <span className="tag-badge">{service.tag}</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.07_220)] mb-2">
              {service.name}
            </h3>
            <p className="text-sm text-[oklch(0.45_0.03_215)] leading-relaxed line-clamp-3">
              {service.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-[oklch(0.38_0.09_220)]">
              £{parseFloat(service.price).toFixed(0)}
            </span>
            <span className="text-xs text-[oklch(0.55_0.03_215)] flex items-center gap-1">
              Tap for benefits <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back p-6 flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, oklch(0.28 0.09 220), oklch(0.45 0.1 195))" }}>
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-3">Benefits</h3>
            <ul className="space-y-1.5">
              {(service.benefits || []).slice(0, 5).map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.06_200)] flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/services/${service.slug}`}>
            <button className="mt-4 w-full py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors border border-white/30">
              Learn More →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Main Home ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: services = [] } = trpc.services.list.useQuery();
  const { data: testimonials = [] } = trpc.testimonials.list.useQuery();
  const { data: settings = {} } = trpc.settings.get.useQuery();
  const seedMutation = trpc.seed.run.useMutation();

  // Seed on first load if empty
  useEffect(() => {
    if (services.length === 0) {
      seedMutation.mutate();
    }
  }, [services.length]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services, testimonials]);

  const heroTitle = (settings as any)["hero.title"] || "Revitalise at the Cellular Level.";
  const heroSubtitle = (settings as any)["hero.subtitle"] || "Experience pure, targeted hydration and nutrient delivery in a soothing, premium environment.";

  const featured = services.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DripScrollIndicator />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 float-anim"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.12 195), transparent 70%)" }} />
          <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, oklch(0.45 0.1 195), transparent 70%)", animation: "float 5s ease-in-out infinite 1s" }} />
          {/* Animated drip lines */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute top-0 w-px opacity-10"
              style={{
                left: `${15 + i * 18}%`,
                height: "100%",
                background: "linear-gradient(to bottom, transparent, oklch(0.55 0.12 195), transparent)",
                animation: `drip-fall ${2 + i * 0.4}s ease-in infinite ${i * 0.5}s`,
              }} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[oklch(0.78_0.06_200)] text-xs font-semibold text-[oklch(0.38_0.09_220)] mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.55_0.12_195)] animate-pulse" />
              Medical-Grade Cellular Renewal
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-[oklch(0.18_0.06_220)] mb-6">
              {heroTitle.split(".")[0]}.<br />
              <span className="gradient-text">{heroTitle.split(".")[1] || "Feel the Difference."}</span>
            </h1>
            <p className="text-lg text-[oklch(0.4_0.03_215)] leading-relaxed mb-8 max-w-lg">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services">
                <button className="btn-primary flex items-center gap-2">
                  Explore Services <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/booking">
                <button className="btn-outline flex items-center gap-2">
                  Book a Session
                </button>
              </Link>
            </div>
          </div>

          {/* Right — stat card */}
          <div className="flex justify-center lg:justify-end">
            <div className="glass-card rounded-2xl p-8 max-w-xs w-full float-anim">
              <div className="flex justify-end mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center">
                  <span className="text-white text-lg">💧</span>
                </div>
              </div>
              <div className="text-5xl font-bold text-[oklch(0.28_0.09_220)] mb-2">100%</div>
              <p className="text-sm text-[oklch(0.45_0.03_215)] leading-relaxed">
                Absorption rate compared to oral supplements. Feel the difference instantly.
              </p>
              <div className="mt-6 pt-4 border-t border-[oklch(0.88_0.01_215)]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["SM", "JT", "PK"].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-[oklch(0.5_0.03_215)]">500+ happy clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="section-pale py-12 border-y border-[oklch(0.88_0.01_215)]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 500, suffix: "+", label: "Clients Treated" },
            { value: 100, suffix: "%", label: "IV Absorption Rate" },
            { value: 8, suffix: "", label: "Signature Drips" },
            { value: 30, suffix: " min", label: "Fastest Session" },
          ].map((stat) => (
            <div key={stat.label} className="reveal">
              <div className="text-3xl font-bold text-[oklch(0.38_0.09_220)] font-serif">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-[oklch(0.5_0.03_215)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Drips (Flip Cards) ────────────────────────────────────── */}
      <section className="section-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.55_0.12_195)]">Our Protocols</span>
            <h2 className="font-serif text-4xl font-bold text-[oklch(0.18_0.06_220)] mt-2 mb-4">
              Targeted Infusions
            </h2>
            <p className="text-[oklch(0.45_0.03_215)] max-w-xl mx-auto">
              Tap a card to discover the specific cellular benefits of each specialised treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((service, i) => (
              <div key={service.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <FlipCard service={service} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link href="/services">
              <button className="btn-outline">
                View All Treatments →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section id="benefits" className="section-pale py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.55_0.12_195)]">Why IV Therapy</span>
              <h2 className="font-serif text-4xl font-bold text-[oklch(0.18_0.06_220)] mt-2 mb-6">
                The Science of Direct Delivery
              </h2>
              <p className="text-[oklch(0.4_0.03_215)] leading-relaxed mb-8">
                Oral supplements pass through the digestive system, where absorption can be as low as 20%. IV therapy delivers nutrients directly into the bloodstream, achieving near-perfect absorption and immediate cellular uptake.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Instant Effect", desc: "Feel the difference within minutes, not hours" },
                  { icon: Shield, title: "100% Absorption", desc: "Bypasses the digestive system entirely" },
                  { icon: Clock, title: "Long-lasting", desc: "Benefits persist for days after treatment" },
                  { icon: Award, title: "Clinically Formulated", desc: "Administered by qualified healthcare professionals" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[oklch(0.22_0.07_220)]">{title}</div>
                      <div className="text-sm text-[oklch(0.5_0.03_215)]">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-right">
              <div className="relative">
                <div className="glass-card rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3">⚗️</div>
                    <h3 className="font-serif text-2xl font-bold text-[oklch(0.22_0.07_220)]">
                      IV vs Oral Absorption
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "IV Therapy", pct: 100, color: "oklch(0.38 0.09 220)" },
                      { label: "Oral Supplements", pct: 20, color: "oklch(0.7 0.04 215)" },
                      { label: "Food Sources", pct: 40, color: "oklch(0.65 0.04 215)" },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[oklch(0.35_0.03_220)]">{label}</span>
                          <span className="font-bold" style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-2 bg-[oklch(0.92_0.01_215)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section id="process" className="section-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.55_0.12_195)]">How It Works</span>
            <h2 className="font-serif text-4xl font-bold text-[oklch(0.18_0.06_220)] mt-2">
              Your Journey to Wellness
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose Your Drip", desc: "Browse our curated menu of IV therapies and select the one that matches your wellness goals.", icon: "🔍" },
              { step: "02", title: "Book a Session", desc: "Select your preferred date and time. We require at least 24 hours notice for all bookings.", icon: "📅" },
              { step: "03", title: "Complete Health Form", desc: "Fill out our comprehensive consent and medical history form to ensure your safety.", icon: "📋" },
              { step: "04", title: "Experience & Revitalise", desc: "Relax in our premium clinic while our qualified nurses administer your personalised drip.", icon: "✨" },
            ].map((item, i) => (
              <div key={item.step} className="reveal text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.94_0.02_205)] to-[oklch(0.88_0.03_200)] flex items-center justify-center text-2xl mx-auto">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[oklch(0.38_0.09_220)] text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[oklch(0.22_0.07_220)] mb-2">{item.title}</h3>
                <p className="text-sm text-[oklch(0.5_0.03_215)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Link href="/booking">
              <button className="btn-primary flex items-center gap-2 mx-auto">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section-teal py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.78_0.06_200)]">Client Stories</span>
              <h2 className="font-serif text-4xl font-bold text-white mt-2">
                Real Results, Real People
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t: any, i: number) => (
                <div key={t.id} className="reveal glass-card rounded-2xl p-6" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[oklch(0.3_0.04_220)] leading-relaxed mb-4 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[oklch(0.88_0.01_215)]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[oklch(0.55_0.12_195)] to-[oklch(0.38_0.09_220)] flex items-center justify-center text-white text-xs font-bold">
                      {t.initials || t.clientName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[oklch(0.22_0.07_220)]">{t.clientName}</div>
                      {t.serviceName && <div className="text-xs text-[oklch(0.55_0.12_195)]">{t.serviceName}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="section-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <h2 className="font-serif text-4xl font-bold text-[oklch(0.18_0.06_220)] mb-4">
            Ready to Revitalise?
          </h2>
          <p className="text-[oklch(0.45_0.03_215)] mb-8 text-lg">
            Book your personalised IV drip session today and experience the difference of cellular-level wellness.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/booking">
              <button className="btn-primary flex items-center gap-2">
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-outline">Contact Us</button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
