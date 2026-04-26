import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IVDripBag from "@/components/IVDripBag";
import { WaterSplashOverlay, useWaterSplash } from "@/components/WaterSplash";
import { ArrowRight, Star, ChevronRight, Zap, Shield, Clock, Award, MapPin, Heart, Sparkles, Search, Calendar, ClipboardList, Droplets, Activity, Brain, RefreshCw, Dumbbell } from "lucide-react";

// ── Service Icon mapper ─────────────────────────────────────────────────────
function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    droplet: <Droplets className="w-7 h-7 text-gold" />,
    zap: <Zap className="w-7 h-7 text-gold" />,
    brain: <Brain className="w-7 h-7 text-gold" />,
    activity: <Activity className="w-7 h-7 text-gold" />,
    dumbbell: <Dumbbell className="w-7 h-7 text-gold" />,
    "refresh-cw": <RefreshCw className="w-7 h-7 text-gold" />,
    sparkles: <Sparkles className="w-7 h-7 text-gold" />,
    shield: <Shield className="w-7 h-7 text-gold" />,
  };
  return <span className="flex items-center justify-center w-10 h-10 rounded-sm bg-[oklch(0.92_0.03_78)]">{icons[name] || <Droplets className="w-7 h-7 text-gold" />}</span>;
}

// ── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ service }: { service: any }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card cursor-pointer h-72 ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="flip-card-front glass-card p-6 flex flex-col justify-between border border-[oklch(0.87_0.025_78)]">
          <div>
            <div className="flex items-start justify-between mb-3">
              <ServiceIcon name={service.icon} />
              <span className="tag-badge">{service.tag || service.category}</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-brown mb-2">{service.name}</h3>
            <p className="text-sm text-rw-muted leading-relaxed line-clamp-3">{service.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-serif text-2xl font-bold text-gold">£{parseFloat(service.price).toFixed(0)}</span>
            <span className="text-xs text-rw-muted flex items-center gap-1">
              Tap for benefits <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
        {/* Back */}
        <div className="flip-card-back p-6 flex flex-col justify-between"
          style={{ background: "linear-gradient(135deg, oklch(0.38 0.08 68), oklch(0.28 0.05 60))" }}>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[oklch(0.975_0.012_80)] mb-3">Benefits</h3>
            <ul className="space-y-1.5">
              {(service.benefits || []).slice(0, 5).map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[oklch(0.92_0.02_78)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.10_78)] flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/services/${service.slug}`}>
            <button className="mt-4 w-full py-2 rounded-sm bg-white/15 hover:bg-white/25 text-[oklch(0.975_0.012_80)] text-sm font-semibold transition-colors border border-white/30 uppercase tracking-widest">
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

  const [scrollProgress, setScrollProgress] = useState(0);
  const { splash, registerSection } = useWaterSplash();

  // Seed on first load if empty
  useEffect(() => {
    if (services.length === 0) seedMutation.mutate();
  }, [services.length]);

  // Track scroll progress for IV bag liquid level
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services, testimonials]);

  const heroTitle = (settings as any)["hero.title"] || "Revive Your Body,\nRevitalise Your Soul";
  const heroSubtitle = (settings as any)["hero.subtitle"] ||
    "Nutrient-rich IV therapy delivered in the comfort of your home, hotel, or office. Because life doesn't slow down, and neither should you.";

  const featured = services.slice(0, 6);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <WaterSplashOverlay splash={splash} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-bg min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Soft botanical background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[55%] h-full opacity-30"
            style={{ background: "radial-gradient(ellipse at 80% 40%, oklch(0.87 0.04 78), transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 w-[40%] h-[60%] opacity-20"
            style={{ background: "radial-gradient(ellipse at 20% 80%, oklch(0.82 0.05 75), transparent 65%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Mobile IV Therapy — We Come To You
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-brown mb-6">
              {heroTitle.split("\n").map((line: string, i: number) => (
                <span key={i} className={i === 1 ? "gradient-text block" : "block"}>{line}</span>
              ))}
            </h1>

            {/* Botanical divider */}
            <div className="divider-line mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold opacity-60">
                <path d="M10,2 C10,2 6,6 6,10 C6,14 10,18 10,18 C10,18 14,14 14,10 C14,6 10,2 10,2 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>

            <p className="text-base lg:text-lg text-rw-muted leading-relaxed mb-10 max-w-lg">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/booking">
                <button className="btn-primary flex items-center gap-2">
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/services">
                <button className="btn-outline flex items-center gap-2">
                  View Our Drips
                </button>
              </Link>
            </div>

            {/* Quick benefit icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: Zap, label: "Boost Energy", sub: "Fight fatigue & feel revitalised" },
                { icon: Shield, label: "Support Immunity", sub: "Strengthen your body's defenses" },
                { icon: Sparkles, label: "Enhance Wellness", sub: "Hydrate, restore & feel your best" },
                { icon: MapPin, label: "We Come To You", sub: "Home, hotel, or office — anywhere" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="text-xs font-semibold text-brown">{label}</div>
                  <div className="text-[10px] text-rw-muted leading-tight mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated IV drip bag */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-72 h-[420px] lg:w-80 lg:h-[480px] float-anim">
              {/* Soft glow behind bag */}
              <div className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, oklch(0.68 0.10 78), transparent 70%)" }} />
              <IVDripBag scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section
        ref={(el) => registerSection(el as HTMLElement)}
        className="section-cream2 py-12 border-y border-[oklch(0.87_0.025_78)]"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 500, suffix: "+", label: "Clients Treated" },
            { value: 100, suffix: "%", label: "IV Absorption Rate" },
            { value: 8, suffix: "", label: "Signature Drips" },
            { value: 30, suffix: " min", label: "Fastest Session" },
          ].map((stat) => (
            <div key={stat.label} className="reveal">
              <div className="font-serif text-3xl font-bold text-gold">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-rw-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Drips (Flip Cards) ────────────────────────────────────── */}
      <section
        ref={(el) => registerSection(el as HTMLElement)}
        className="section-cream py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Our Protocols</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-brown mt-2 mb-4">
              Targeted Infusions
            </h2>
            <div className="divider-line max-w-xs mx-auto mb-4">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-gold opacity-60">
                <path d="M10,2 C10,2 6,6 6,10 C6,14 10,18 10,18 C10,18 14,14 14,10 C14,6 10,2 10,2 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              </svg>
            </div>
            <p className="text-rw-muted max-w-xl mx-auto">
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
              <button className="btn-outline">View All Treatments →</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section
        id="benefits"
        ref={(el) => registerSection(el as HTMLElement)}
        className="section-cream2 py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Why IV Therapy</span>
              <h2 className="font-serif text-4xl font-bold text-brown mt-2 mb-6">
                The Science of Direct Delivery
              </h2>
              <p className="text-rw-muted leading-relaxed mb-8">
                Oral supplements pass through the digestive system, where absorption can be as low as 20%. IV therapy delivers nutrients directly into the bloodstream, achieving near-perfect absorption and immediate cellular uptake.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Zap, title: "Instant Effect", desc: "Feel the difference within minutes, not hours" },
                  { icon: Shield, title: "100% Absorption", desc: "Bypasses the digestive system entirely" },
                  { icon: Clock, title: "Long-lasting", desc: "Benefits persist for days after treatment" },
                  { icon: Award, title: "Clinically Formulated", desc: "Administered by qualified healthcare professionals" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-semibold text-brown">{title}</div>
                      <div className="text-sm text-rw-muted">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-right">
              <div className="glass-card rounded-2xl p-8 border border-[oklch(0.87_0.025_78)]">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Absorption Comparison</span>
                  <h3 className="font-serif text-2xl font-bold text-brown mt-2">IV vs Oral</h3>
                </div>
                <div className="space-y-5">
                  {[
                    { label: "IV Therapy", pct: 100, color: "oklch(0.52 0.10 75)" },
                    { label: "Oral Supplements", pct: 20, color: "oklch(0.70 0.06 78)" },
                    { label: "Food Sources", pct: 40, color: "oklch(0.65 0.05 76)" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-brown font-medium">{label}</span>
                        <span className="font-bold" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-[oklch(0.92_0.02_78)] rounded-full overflow-hidden">
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
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section
        id="process"
        ref={(el) => registerSection(el as HTMLElement)}
        className="section-cream py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">How It Works</span>
            <h2 className="font-serif text-4xl font-bold text-brown mt-2">Your Journey to Wellness</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose Your Drip", desc: "Browse our curated menu of IV therapies and select the treatment that matches your wellness goals.", Icon: Search },
              { step: "02", title: "Book & Share Location", desc: "Select your date, time, and share your address — home, hotel, or office. We require at least 24 hours notice.", Icon: Calendar },
              { step: "03", title: "Complete Health Form", desc: "Fill out our comprehensive consent and medical history form online to ensure your safety before we arrive.", Icon: ClipboardList },
              { step: "04", title: "We Come To You", desc: "Relax in your own space while our qualified nurse arrives and administers your personalised drip.", Icon: MapPin },
            ].map((item, i) => (
              <div key={item.step} className="reveal text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] flex items-center justify-center mx-auto">
                    <item.Icon className="w-7 h-7 text-gold" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-[oklch(0.975_0.012_80)] text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-brown mb-2">{item.title}</h3>
                <p className="text-sm text-rw-muted leading-relaxed">{item.desc}</p>
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
        <section
          ref={(el) => registerSection(el as HTMLElement)}
          className="section-gold py-20"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.68_0.10_78)]">Client Stories</span>
              <h2 className="font-serif text-4xl font-bold text-[oklch(0.975_0.012_80)] mt-2">
                Real Results, Real People
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t: any, i: number) => (
                <div key={t.id} className="reveal glass-card rounded-xl p-6 border border-white/20" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[oklch(0.68_0.10_78)] text-[oklch(0.68_0.10_78)]" />
                    ))}
                  </div>
                  <p className="text-sm text-brown leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[oklch(0.87_0.025_78)]">
                    <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-[oklch(0.975_0.012_80)] text-xs font-bold">
                      {t.initials || t.clientName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-brown">{t.clientName}</div>
                      {t.serviceName && <div className="text-xs text-gold">{t.serviceName}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        ref={(el) => registerSection(el as HTMLElement)}
        className="section-cream py-20"
      >
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Begin Your Journey</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-brown mt-3 mb-4">
            Ready to Revitalise?
          </h2>
          <div className="divider-line max-w-xs mx-auto mb-6">
            <Heart className="w-4 h-4 text-gold opacity-60" />
          </div>
          <p className="text-rw-muted mb-8 text-lg">
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
