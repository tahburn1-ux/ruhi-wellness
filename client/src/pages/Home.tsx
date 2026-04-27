import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IVDripBag from "@/components/IVDripBag";
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

// ── Botanical background SVG ──────────────────────────────────────────────────
function BotanicalBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large warm blob top-right */}
      <ellipse cx="1100" cy="200" rx="480" ry="420" fill="oklch(0.88 0.04 78)" opacity="0.45" />
      {/* Medium blob bottom-right */}
      <ellipse cx="1300" cy="750" rx="320" ry="260" fill="oklch(0.84 0.05 75)" opacity="0.30" />
      {/* Small blob bottom-left */}
      <ellipse cx="120" cy="820" rx="220" ry="160" fill="oklch(0.86 0.04 76)" opacity="0.22" />

      {/* ── Main botanical stem + leaves (centre-right, large) ── */}
      <g stroke="oklch(0.55 0.10 72)" strokeWidth="1.4" fill="none" opacity="0.55">
        {/* Main stem */}
        <path d="M820,900 C820,900 830,700 810,550 C795,420 840,300 860,180" strokeWidth="2" />

        {/* Leaf pair 1 — large, near bottom */}
        <path d="M820,760 C780,700 720,660 680,620 C720,640 780,700 820,760 Z" />
        <path d="M820,760 C820,760 810,690 790,660" />
        <path d="M820,760 C820,760 770,710 740,685" />
        <path d="M820,760 C820,760 730,650 700,630" />

        {/* Leaf pair 1 right */}
        <path d="M820,760 C860,700 920,660 960,620 C920,640 860,700 820,760 Z" />
        <path d="M820,760 C820,760 830,690 850,660" />
        <path d="M820,760 C820,760 870,710 900,685" />
        <path d="M820,760 C820,760 930,650 960,630" />

        {/* Leaf pair 2 — mid */}
        <path d="M815,580 C770,520 710,490 665,455 C710,475 770,520 815,580 Z" />
        <path d="M815,580 C815,580 800,510 778,480" />
        <path d="M815,580 C815,580 755,525 725,500" />
        <path d="M815,580 C815,580 680,465 660,455" />

        {/* Leaf pair 2 right */}
        <path d="M815,580 C860,520 920,490 965,455 C920,475 860,520 815,580 Z" />
        <path d="M815,580 C815,580 830,510 852,480" />
        <path d="M815,580 C815,580 875,525 905,500" />
        <path d="M815,580 C815,580 950,465 970,455" />

        {/* Leaf pair 3 — upper */}
        <path d="M830,390 C790,330 740,305 700,275 C740,295 790,330 830,390 Z" />
        <path d="M830,390 C830,390 815,320 795,295" />
        <path d="M830,390 C830,390 765,335 740,312" />

        {/* Leaf pair 3 right */}
        <path d="M830,390 C870,330 920,305 960,275 C920,295 870,330 830,390 Z" />
        <path d="M830,390 C830,390 845,320 865,295" />
        <path d="M830,390 C830,390 895,335 920,312" />

        {/* Small top sprigs */}
        <path d="M855,220 C835,185 820,160 830,130 C840,160 850,185 855,220 Z" />
        <path d="M855,220 C875,185 890,160 880,130 C870,160 860,185 855,220 Z" />
      </g>

      {/* Scattered gold dots */}
      <g fill="oklch(0.58 0.10 74)" opacity="0.35">
        <circle cx="1050" cy="140" r="3" />
        <circle cx="1080" cy="165" r="2" />
        <circle cx="1030" cy="175" r="1.5" />
        <circle cx="1100" cy="120" r="2.5" />
        <circle cx="1130" cy="155" r="1.5" />
        <circle cx="1350" cy="480" r="3" />
        <circle cx="1370" cy="510" r="2" />
        <circle cx="1340" cy="530" r="1.5" />
        <circle cx="680" cy="800" r="2" />
        <circle cx="660" cy="820" r="1.5" />
      </g>
    </svg>
  );
}

// ── Video Hero ──────────────────────────────────────────────────────────────
function GoldParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    // Particle definition
    interface Particle {
      x: number; y: number;
      r: number;       // radius
      vx: number; vy: number;
      alpha: number;   // current opacity
      alphaDir: number; // fade in/out speed
      hue: number;     // gold hue variation
    }

    const PARTICLE_COUNT = 90;
    const particles: Particle[] = [];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const makeParticle = (): Particle => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(2, 7),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.22, -0.06),
      alpha: rand(0.05, 0.55),
      alphaDir: rand(0.001, 0.004) * (Math.random() > 0.5 ? 1 : -1),
      hue: rand(38, 52),
    });

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
    };

    const draw = () => {
      // Soft cream background
      ctx.fillStyle = "oklch(0.975 0.012 80)";
      ctx.fillRect(0, 0, W, H);

      // Large soft bokeh blobs
      const blobs = [
        { x: W * 0.72, y: H * 0.35, r: H * 0.42, a: 0.13 },
        { x: W * 0.85, y: H * 0.65, r: H * 0.32, a: 0.09 },
        { x: W * 0.55, y: H * 0.15, r: H * 0.25, a: 0.07 },
      ];
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(196,158,80,${b.a})`);
        g.addColorStop(1, "rgba(196,158,80,0)");
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Particles
      for (const p of particles) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, `hsla(${p.hue},65%,55%,${p.alpha})`);
        g.addColorStop(1, `hsla(${p.hue},65%,55%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha > 0.6 || p.alpha < 0.03) p.alphaDir *= -1;
        if (p.y < -20 || p.x < -20 || p.x > W + 20) {
          p.x = rand(0, W);
          p.y = H + 10;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

function VideoHero({ heroTitle, heroSubtitle, renderHeroTitle }: {
  heroTitle: string;
  heroSubtitle: string;
  renderHeroTitle: (raw: string) => React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "oklch(0.975 0.012 80)" }}>
      {/* Animated gold particle canvas */}
      <GoldParticleCanvas />

      {/* Bottom fade so content below hero blends smoothly */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[oklch(0.975_0.012_80)] to-transparent pointer-events-none z-10" />

      {/* Botanical SVG overlay — gold line art */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-10">
        <BotanicalBackground />
      </div>

      {/* Hero content — left-aligned, matching reference layout */}
      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 items-center">

            {/* Left: text column */}
            <div className="max-w-[640px]">
              {/* Liquid glass badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.10_78)] animate-pulse" />
                Mobile IV Therapy — We Come To You
              </div>

              {/* Headline */}
              <h1
                className="text-[3.6rem] lg:text-[4.8rem] xl:text-[5.6rem] font-bold leading-[1.05] text-brown mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {renderHeroTitle(heroTitle)}
              </h1>

              {/* Botanical divider */}
              <div className="divider-line mb-6" style={{ color: "oklch(0.78 0.10 78)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10,2 C10,2 6,6 6,10 C6,14 10,18 10,18 C10,18 14,14 14,10 C14,6 10,2 10,2 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.5"/>
                </svg>
              </div>

              {/* Subtitle */}
              <p className="text-base lg:text-[1.05rem] text-rw-muted leading-relaxed mb-10 max-w-[480px]">
                {heroSubtitle}
              </p>

              {/* Liquid glass CTAs */}
              <div className="flex flex-wrap gap-4 mb-14">
                <Link href="/booking">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-widest transition-all"
                    style={{ background: "oklch(0.52 0.10 75)", color: "oklch(0.975 0.012 80)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.45 0.10 75)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.52 0.10 75)")}>
                    Book Now <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/services">
                  <button className="btn-outline flex items-center gap-2">
                    View Our Drips
                  </button>
                </Link>
              </div>

              {/* 4 feature icons — liquid glass cards */}
              <div className="flex items-start gap-0">
                {[
                  { icon: Zap, label: "Boost Energy", sub: "Fight fatigue &\nfeel revitalised" },
                  { icon: Shield, label: "Support Immunity", sub: "Strengthen your\nbody's defenses" },
                  { icon: Sparkles, label: "Enhance Wellness", sub: "Hydrate, restore &\nfeel your best" },
                  { icon: Heart, label: "Convenient Care", sub: "We come to you,\nso you can too" },
                ].map(({ icon: Icon, label, sub }, idx) => (
                  <div key={label} className="flex items-start">
                    {idx > 0 && (
                      <div className="w-px self-stretch bg-[oklch(0.82_0.03_78)] mx-5 mt-1" />
                    )}
                    <div className="text-left min-w-[100px]">
                      <Icon className="w-7 h-7 mb-2 text-gold" strokeWidth={1.3} />
                      <div className="text-sm font-semibold text-brown leading-tight">{label}</div>
                      <div className="text-[11px] text-rw-muted leading-snug mt-0.5 whitespace-pre-line">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: IV drip bag — aligned with hero text, shifted left and up */}
            <div className="hidden lg:flex justify-start items-start self-stretch pl-4 pt-4">
              <div className="relative w-[320px] xl:w-[400px] h-[580px] xl:h-[660px] float-anim -mt-8">
                <div className="absolute inset-0 rounded-full opacity-40 blur-3xl"
                  style={{ background: "radial-gradient(circle, oklch(0.68 0.10 78), transparent 70%)" }} />
                <IVDripBag scrollProgress={0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Reviews Carousel ────────────────────────────────────────────────────────
function ReviewsCarousel({ testimonials }: { testimonials: any[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % total), 4000);
    return () => clearInterval(timer);
  }, [paused, total]);

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  // Show 3 cards on desktop, 1 on mobile
  const getVisible = () => {
    if (total === 0) return [];
    const indices = [];
    for (let i = 0; i < Math.min(3, total); i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  return (
    <section className="section-gold py-20" id="reviews">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.68_0.10_78)]">Client Stories</span>
          <h2 className="font-serif text-4xl font-bold text-[oklch(0.975_0.012_80)] mt-2">
            Real Results, Real People
          </h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
            {getVisible().map((idx, pos) => {
              const t = testimonials[idx];
              return (
                <div
                  key={`${t.id}-${pos}`}
                  className={`glass-card rounded-xl p-6 border border-white/20 transition-all duration-500 ${
                    pos === 1 ? "scale-105 shadow-xl" : "opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating || 5)].map((_: any, j: number) => (
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
              );
            })}
          </div>

          {/* Prev / Next controls */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[oklch(0.975_0.012_80)] border border-[oklch(0.87_0.025_78)] shadow flex items-center justify-center text-gold hover:bg-[oklch(0.92_0.03_78)] transition-colors"
                aria-label="Previous review"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[oklch(0.975_0.012_80)] border border-[oklch(0.87_0.025_78)] shadow flex items-center justify-center text-gold hover:bg-[oklch(0.92_0.03_78)] transition-colors"
                aria-label="Next review"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-gold w-6"
                    : "bg-[oklch(0.68_0.10_78)]/40 hover:bg-[oklch(0.68_0.10_78)]/70"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main Home ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: services = [] } = trpc.services.list.useQuery();
  const { data: testimonials = [] } = trpc.testimonials.list.useQuery();
  const { data: settings = {} } = trpc.settings.get.useQuery();
  const seedMutation = trpc.seed.run.useMutation();

  const [scrollProgress, setScrollProgress] = useState(0);

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

  const featured = services.slice(0, 4);

  // Parse hero title: "Body," and "Soul" get gold italic treatment
  const renderHeroTitle = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, i) => {
      // Highlight the last word of each line in gold
      const words = line.split(" ");
      const lastWord = words.pop();
      const rest = words.join(" ");
      return (
        <span key={i} className="block">
          {rest && <>{rest} </>}
          <span className="gradient-text italic">{lastWord}</span>
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ── Hero (video + liquid glass) ──────────────────────────────────── */}
      <VideoHero
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        renderHeroTitle={renderHeroTitle}
      />

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="section-cream2 py-12 border-y border-[oklch(0.87_0.025_78)]">
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
      <section className="section-cream py-20">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section id="benefits" className="section-cream2 py-20">
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
      <section id="process" className="section-cream py-20">
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
        <ReviewsCarousel testimonials={testimonials} />
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="section-cream py-20">
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
