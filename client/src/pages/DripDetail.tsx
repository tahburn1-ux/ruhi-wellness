import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, CheckCircle, Users, Beaker, Droplets, Zap, Brain, Activity, Dumbbell, RefreshCw, Sparkles, Shield } from "lucide-react";

function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    droplet: <Droplets className="w-7 h-7" />,
    zap: <Zap className="w-7 h-7" />,
    brain: <Brain className="w-7 h-7" />,
    activity: <Activity className="w-7 h-7" />,
    dumbbell: <Dumbbell className="w-7 h-7" />,
    "refresh-cw": <RefreshCw className="w-7 h-7" />,
    sparkles: <Sparkles className="w-7 h-7" />,
    shield: <Shield className="w-7 h-7" />,
  };
  return <span className="flex items-center justify-center w-14 h-14 rounded-sm bg-[oklch(0.92_0.03_78)] text-gold">{icons[name] || <Droplets className="w-7 h-7" />}</span>;
}

export default function DripDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading } = trpc.services.bySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 max-w-4xl mx-auto px-6">
          <div className="h-8 w-48 bg-[oklch(0.92_0.03_78)] rounded animate-pulse mb-6" />
          <div className="h-64 bg-[oklch(0.92_0.03_78)] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-3xl text-brown">Treatment not found</h1>
          <Link href="/services">
            <button className="btn-primary mt-6">Back to Services</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-bg pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/services">
            <button className="flex items-center gap-2 text-sm text-rw-muted hover:text-gold transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </button>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="tag-badge">{service.tag}</span>
                <span className="tag-badge">{service.category}</span>
              </div>
              <div className="mb-4"><ServiceIcon name={service.icon ?? "droplet"} /></div>
              <h1 className="font-serif text-5xl font-bold text-brown mb-3">
                {service.name}
              </h1>
              <p className="text-xl text-gold font-medium mb-4">{service.tagline}</p>
              <p className="text-rw-muted leading-relaxed mb-6">{service.description}</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-rw-muted">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-4xl font-bold text-gold">
                    £{parseFloat(service.price).toFixed(0)}
                  </div>
                  <div className="text-xs text-rw-muted">per session</div>
                </div>
                <Link href={`/booking?service=${service.slug}`}>
                  <button className="btn-primary">Book This Drip →</button>
                </Link>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-8">
              <h3 className="font-serif text-xl font-semibold text-brown mb-5 flex items-center gap-2">
                <Beaker className="w-5 h-5 text-gold" />
                Ingredients
              </h3>
              <div className="space-y-3">
                {(service.ingredients || []).map((ing: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[oklch(0.96_0.03_78)]">
                    <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-sm text-brown">{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Ideal For */}
      <section className="section-cream py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Benefits */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-semibold text-brown mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gold" />
              Key Benefits
            </h3>
            <ul className="space-y-3">
              {(service.benefits || []).map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-brown">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal For */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-semibold text-brown mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              Ideal For
            </h3>
            <div className="flex flex-wrap gap-3">
              {(service.idealFor || []).map((item: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-medium bg-[oklch(0.92_0.03_78)] text-brown border border-[oklch(0.87_0.025_78)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-teal py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Ready to Experience {service.name}?
          </h2>
          <p className="text-white/80 mb-8">
            Book your session today. Our qualified nurses will ensure a safe, comfortable, and effective treatment.
          </p>
          <Link href={`/booking?service=${service.slug}`}>
            <button className="bg-white text-[oklch(0.28_0.09_220)] font-bold py-3 px-8 rounded-full hover:bg-white/90 transition-colors">
              Book {service.name} — £{parseFloat(service.price).toFixed(0)}
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
