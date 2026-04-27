import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Shield, Star, Users, Award, Leaf } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Client-Centred Care",
    description: "Every session is tailored to your individual health goals. We take the time to understand your needs before recommending a treatment.",
  },
  {
    icon: Shield,
    title: "Clinical Excellence",
    description: "All treatments are administered by fully registered nurses with extensive clinical experience. Your safety is our absolute priority.",
  },
  {
    icon: Leaf,
    title: "Premium Ingredients",
    description: "We use only pharmaceutical-grade vitamins and minerals sourced from regulated UK suppliers — never compromising on quality.",
  },
  {
    icon: Star,
    title: "Luxury at Home",
    description: "We bring the clinic to you. Experience premium wellness care in the comfort of your own home, hotel, or office.",
  },
  {
    icon: Users,
    title: "Personalised Approach",
    description: "No two clients are the same. We create bespoke treatment plans based on your lifestyle, goals, and health history.",
  },
  {
    icon: Award,
    title: "Trusted & Accredited",
    description: "Ruhi Wellness operates in full compliance with UK healthcare regulations, with all practitioners holding valid professional registrations.",
  },
];

const team = [
  {
    name: "Dr. Ruhi Patel",
    role: "Founder & Lead Clinician",
    bio: "With over 12 years of experience in integrative medicine and IV therapy, Dr. Patel founded Ruhi Wellness with a vision to make premium cellular health accessible to everyone. She holds a Doctorate in Medicine from King's College London and is a registered member of the General Medical Council.",
  },
  {
    name: "Nurse Sarah Thompson",
    role: "Senior IV Therapy Specialist",
    bio: "Sarah is a registered nurse with 8 years of experience in acute care and wellness medicine. She specialises in complex IV formulations and has administered thousands of successful IV therapy sessions across London.",
  },
  {
    name: "Nurse James Okafor",
    role: "IV Therapy Practitioner",
    bio: "James brings 6 years of NHS nursing experience to the Ruhi Wellness team. His calm, professional approach and expert cannulation technique ensure every client feels at ease throughout their session.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className="font-serif text-5xl font-bold text-brown mb-6 max-w-2xl">
            Wellness, Delivered to Your Door.
          </h1>
          <p className="text-rw-muted text-lg max-w-2xl leading-relaxed">
            Ruhi Wellness was founded on a simple belief: that premium cellular health should be accessible, convenient, and deeply personal. We bring clinical-grade IV drip therapy directly to you — wherever you are in London.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-cream2 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-brown mb-6">Our Mission</h2>
              <p className="text-rw-muted leading-relaxed mb-4">
                At Ruhi Wellness, we believe that optimal health is not a luxury — it is a right. Our mission is to empower individuals to take control of their wellbeing through evidence-based, clinically administered IV therapy that delivers real, measurable results.
              </p>
              <p className="text-rw-muted leading-relaxed mb-4">
                Founded in London, we have built our reputation on three pillars: clinical excellence, uncompromising ingredient quality, and a genuinely personalised approach to every client's health journey.
              </p>
              <p className="text-rw-muted leading-relaxed">
                Whether you're recovering from illness, preparing for a major event, managing chronic fatigue, or simply investing in your long-term health, Ruhi Wellness is here to support you — at home, at your hotel, or at your office.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">500+</span>
                </div>
                <div>
                  <div className="font-semibold text-brown">Sessions Administered</div>
                  <div className="text-sm text-rw-muted">Across London and surrounding areas</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">100%</span>
                </div>
                <div>
                  <div className="font-semibold text-brown">Registered Practitioners</div>
                  <div className="text-sm text-rw-muted">All nurses hold valid NMC registration</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">4.9★</span>
                </div>
                <div>
                  <div className="font-semibold text-brown">Average Client Rating</div>
                  <div className="text-sm text-rw-muted">Based on verified client reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">UK</span>
                </div>
                <div>
                  <div className="font-semibold text-brown">Pharmaceutical-Grade Ingredients</div>
                  <div className="text-sm text-rw-muted">Sourced from regulated UK suppliers only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-brown mb-4">Our Values</h2>
            <p className="text-rw-muted max-w-xl mx-auto">
              Everything we do is guided by a commitment to your health, safety, and satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-brown mb-2">{value.title}</h3>
                <p className="text-sm text-rw-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-cream2 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-brown mb-4">Meet the Team</h2>
            <p className="text-rw-muted max-w-xl mx-auto">
              Our practitioners are experienced, compassionate, and dedicated to your wellbeing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="glass-card rounded-2xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-[oklch(0.38_0.08_68)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-serif text-2xl font-bold">
                    {member.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <h3 className="font-semibold text-brown text-lg mb-1">{member.name}</h3>
                <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-3">{member.role}</p>
                <p className="text-sm text-rw-muted leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold text-brown mb-4">Ready to Experience the Difference?</h2>
          <p className="text-rw-muted mb-8 text-lg">
            Book your first session today and discover why hundreds of Londoners trust Ruhi Wellness for their cellular health.
          </p>
          <a
            href="/booking"
            className="btn-gold px-8 py-4 rounded-sm font-semibold text-sm uppercase tracking-widest inline-block"
          >
            Book Your Session
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
