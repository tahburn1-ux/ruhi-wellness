import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DripScrollIndicator from "@/components/DripScrollIndicator";
import { ArrowRight, Clock } from "lucide-react";

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
      <DripScrollIndicator />

      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.55_0.12_195)]">Our Treatments</span>
          <h1 className="font-serif text-5xl font-bold text-[oklch(0.18_0.06_220)] mt-3 mb-4">
            Cellular Renewal & Hydration
          </h1>
          <p className="text-[oklch(0.45_0.03_215)] max-w-2xl mx-auto text-lg">
            Discover our curated selection of premium IV drip therapies, designed to restore balance, accelerate recovery, and elevate your baseline wellness.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="section-white sticky top-16 z-40 border-b border-[oklch(0.88_0.01_215)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[oklch(0.38_0.09_220)] text-white shadow-md"
                  : "bg-[oklch(0.94_0.02_205)] text-[oklch(0.38_0.09_220)] hover:bg-[oklch(0.88_0.03_200)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="section-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-[oklch(0.94_0.02_205)] animate-pulse" />
              ))}
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">
                    {category === "Wellness" ? "💧" : category === "Recovery" ? "💪" : "✨"}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[oklch(0.22_0.07_220)]">{category}</h2>
                  <div className="flex-1 h-px bg-[oklch(0.88_0.01_215)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service: any, i: number) => (
                    <div key={service.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                      <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:shadow-lg transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{service.icon}</span>
                          <span className="tag-badge">{service.tag}</span>
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.07_220)] mb-2 group-hover:text-[oklch(0.38_0.09_220)] transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-[oklch(0.5_0.03_215)] leading-relaxed flex-1 mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[oklch(0.6_0.03_215)] mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[oklch(0.88_0.01_215)]">
                          <span className="text-2xl font-bold text-[oklch(0.38_0.09_220)]">
                            £{parseFloat(service.price).toFixed(0)}
                          </span>
                          <Link href={`/services/${service.slug}`}>
                            <button className="flex items-center gap-1.5 text-sm font-semibold text-[oklch(0.38_0.09_220)] hover:gap-2.5 transition-all">
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
