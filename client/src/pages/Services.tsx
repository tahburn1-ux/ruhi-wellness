import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, Droplets, Dumbbell, Sparkles, Zap, Brain, Activity, RefreshCw, Shield } from "lucide-react";

function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    droplet: <Droplets className="w-6 h-6 text-gold" />,
    zap: <Zap className="w-6 h-6 text-gold" />,
    brain: <Brain className="w-6 h-6 text-gold" />,
    activity: <Activity className="w-6 h-6 text-gold" />,
    dumbbell: <Dumbbell className="w-6 h-6 text-gold" />,
    "refresh-cw": <RefreshCw className="w-6 h-6 text-gold" />,
    sparkles: <Sparkles className="w-6 h-6 text-gold" />,
    shield: <Shield className="w-6 h-6 text-gold" />,
  };
  return <span className="flex items-center justify-center w-9 h-9 rounded-sm bg-[oklch(0.92_0.03_78)]">{icons[name] || <Droplets className="w-6 h-6 text-gold" />}</span>;
}

function CategoryIcon({ cat }: { cat: string }) {
  if (cat === "Wellness") return <Droplets className="w-5 h-5 text-gold" />;
  if (cat === "Recovery") return <Dumbbell className="w-5 h-5 text-gold" />;
  return <Sparkles className="w-5 h-5 text-gold" />;
}

const CATEGORIES = ["All", "Wellness", "Recovery", "Beauty"];

export default function Services() {
  const { data: services = [], isLoading } = trpc.services.list.useQuery();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services]);

  const filtered = activeCategory === "All"
    ? services
    : services.filter((s: any) => s.category === activeCategory);

  const grouped = CATEGORIES.filter(c => c !== "All").reduce((acc, cat) => {
    const items = filtered.filter((s: any) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Our Treatments</span>
          <h1 className="font-serif text-5xl font-bold text-brown mt-3 mb-4">
            Cellular Renewal & Hydration
          </h1>
          <p className="text-rw-muted max-w-2xl mx-auto text-lg">
            Discover our curated selection of premium IV drip therapies, designed to restore balance, accelerate recovery, and elevate your baseline wellness.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="section-cream sticky top-16 z-40 border-b border-[oklch(0.87_0.025_78)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-gold text-[oklch(0.975_0.012_80)] shadow-md"
                  : "bg-[oklch(0.96_0.03_78)] text-brown hover:bg-[oklch(0.91_0.04_78)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="section-cream2 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-[oklch(0.92_0.03_78)] animate-pulse" />
              ))}
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <CategoryIcon cat={category} />
                  <h2 className="font-serif text-2xl font-bold text-brown">{category}</h2>
                  <div className="flex-1 h-px bg-[oklch(0.87_0.025_78)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service: any, i: number) => (
                    <div key={service.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                      <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:shadow-lg transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                          <ServiceIcon name={service.icon} />
                          <span className="tag-badge">{service.tag}</span>
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-brown mb-2 group-hover:text-gold transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-rw-muted leading-relaxed flex-1 mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[oklch(0.6_0.03_215)] mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[oklch(0.87_0.025_78)]">
                          <span className="text-2xl font-bold text-gold">
                            £{parseFloat(service.price).toFixed(0)}
                          </span>
                          <Link href={`/services/${service.slug}`}>
                            <button className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all">
                              View Details <ArrowRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                        <Link href={`/booking?service=${service.slug}`} className="mt-3">
                          <button className="w-full py-2.5 rounded-full bg-[oklch(0.38_0.09_220)] text-white text-sm font-semibold hover:bg-[oklch(0.32_0.09_220)] transition-colors">
                            Select for Drip
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-20 text-[oklch(0.5_0.03_215)]">
              No treatments found in this category.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
