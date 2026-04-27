import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export default function HealthDisclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            Medical Information
          </div>
          <h1 className="font-serif text-5xl font-bold text-brown mb-4">Health Disclaimer</h1>
          <p className="text-rw-muted text-lg max-w-xl">
            Last updated: 1 January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-cream2 py-16">
        <div className="max-w-3xl mx-auto px-6">

          {/* Important Notice Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Important Notice</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  The information on this website is for general informational purposes only and does not constitute medical advice. IV therapy is a medical procedure and must only be administered by qualified healthcare professionals. Always consult your GP or a qualified medical practitioner before undertaking any new health treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-8 text-rw-muted leading-relaxed">

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">1. Not Medical Advice</h2>
              <p>
                The content published on the Ruhi Wellness website, including descriptions of treatments, benefits, and health information, is provided for general informational and educational purposes only. It does not constitute, and should not be construed as, medical advice, diagnosis, or treatment recommendations.
              </p>
              <p className="mt-3">
                Ruhi Wellness is not a substitute for professional medical advice from a qualified physician or healthcare provider. Always seek the advice of your doctor or other qualified health professional with any questions you may have regarding a medical condition or treatment.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">2. Qualified Practitioners</h2>
              <p>
                All IV therapy sessions administered by Ruhi Wellness are carried out exclusively by registered nurses holding valid registration with the Nursing and Midwifery Council (NMC) of the United Kingdom. Our practitioners have undergone specialist training in IV therapy and cannulation.
              </p>
              <p className="mt-3">
                Prior to every session, a health consultation and medical questionnaire are completed to assess your suitability for treatment. Our practitioners reserve the right to decline treatment if, in their clinical judgement, it is not appropriate or safe for you.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">3. Contraindications</h2>
              <p className="mb-3">IV therapy may not be suitable for all individuals. You should not receive IV therapy if you have any of the following conditions, without prior written clearance from your GP:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Pregnancy or breastfeeding</li>
                <li>Chronic kidney disease or renal impairment</li>
                <li>Congestive heart failure or cardiac conditions</li>
                <li>Liver disease or hepatic impairment</li>
                <li>Active infections or sepsis</li>
                <li>Blood clotting disorders or haemophilia</li>
                <li>Known allergies to any ingredients in the selected drip formulation</li>
                <li>Glucose-6-phosphate dehydrogenase (G6PD) deficiency (for high-dose Vitamin C drips)</li>
                <li>Uncontrolled hypertension</li>
                <li>Current use of anticoagulant medications (e.g. warfarin) without GP approval</li>
              </ul>
              <p className="mt-3">
                This list is not exhaustive. You are responsible for disclosing your full medical history and current medications to our practitioners before treatment. Failure to disclose relevant medical information may result in adverse reactions for which Ruhi Wellness cannot be held liable.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">4. Potential Risks and Side Effects</h2>
              <p className="mb-3">As with any medical procedure involving intravenous access, IV therapy carries certain risks, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Bruising, swelling, or discomfort at the cannula insertion site</li>
                <li>Phlebitis (inflammation of the vein)</li>
                <li>Infection at the insertion site (rare with proper sterile technique)</li>
                <li>Allergic reaction to ingredients in the drip formulation</li>
                <li>Electrolyte imbalance (rare, particularly with high-dose mineral infusions)</li>
                <li>Mild nausea, dizziness, or lightheadedness during infusion</li>
                <li>Air embolism (extremely rare with proper administration technique)</li>
              </ul>
              <p className="mt-3">
                Our practitioners are trained to manage adverse reactions and carry appropriate emergency equipment. In the event of a serious adverse reaction, emergency services will be contacted immediately.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">5. No Guaranteed Results</h2>
              <p>
                The benefits described on our website are based on clinical evidence and client experiences. However, individual results vary and cannot be guaranteed. IV therapy is not a cure for any medical condition and should not be used as a replacement for prescribed medical treatment.
              </p>
              <p className="mt-3">
                Testimonials and reviews published on our website reflect individual experiences and are not representative of typical results. Ruhi Wellness makes no warranties or representations regarding the effectiveness of any treatment for any specific individual.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">6. Regulatory Compliance</h2>
              <p>
                Ruhi Wellness operates in compliance with applicable UK healthcare regulations, including the Health and Social Care Act 2008, the Medicines Act 1968, and relevant NMC standards of practice. All medications and supplements used in our formulations are sourced from licensed UK pharmaceutical suppliers and are used within their licensed indications or under appropriate clinical protocols.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">7. Consent</h2>
              <p>
                Before receiving any IV therapy treatment from Ruhi Wellness, you will be required to complete a health questionnaire and sign an informed consent form. By signing the consent form, you confirm that you have read and understood this Health Disclaimer, disclosed all relevant medical information, and consent to the administration of IV therapy by our practitioners.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Ruhi Wellness, its directors, employees, and practitioners shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of our services, except where such liability cannot be excluded under applicable law (including liability for death or personal injury caused by negligence).
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about this Health Disclaimer or wish to discuss your suitability for IV therapy, please contact us before booking:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-brown">Ruhi Wellness</strong></p>
                <p>Email: <a href="mailto:hello@ruhiwellness.com" className="text-gold hover:underline">hello@ruhiwellness.com</a></p>
                <p>Phone: <a href="tel:+447700900000" className="text-gold hover:underline">+44 (0) 7700 900000</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
