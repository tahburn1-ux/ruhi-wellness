import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="hero-bg pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[oklch(0.92_0.03_78)] border border-[oklch(0.87_0.025_78)] text-xs font-semibold text-gold uppercase tracking-widest mb-6">
            <Shield className="w-3.5 h-3.5" />
            Legal
          </div>
          <h1 className="font-serif text-5xl font-bold text-brown mb-4">Privacy Policy</h1>
          <p className="text-rw-muted text-lg max-w-xl">
            Last updated: 1 January 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-cream2 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-card rounded-2xl p-8 space-y-8 text-rw-muted leading-relaxed">

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">1. Introduction</h2>
              <p>
                Ruhi Wellness ("we", "us", "our") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website at <strong className="text-brown">ruhiwellness.com</strong> or engage our mobile IV therapy services.
              </p>
              <p className="mt-3">
                We are registered as a data controller under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. By using our services, you consent to the practices described in this policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">2. Information We Collect</h2>
              <p className="mb-3">We may collect and process the following categories of personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-brown">Identity Data:</strong> Full name, date of birth.</li>
                <li><strong className="text-brown">Contact Data:</strong> Email address, phone number, delivery/service address.</li>
                <li><strong className="text-brown">Health Data:</strong> Medical history, current medications, allergies, and health questionnaire responses collected prior to treatment (Special Category Data under UK GDPR).</li>
                <li><strong className="text-brown">Booking Data:</strong> Treatment preferences, appointment dates and times, booking history.</li>
                <li><strong className="text-brown">Financial Data:</strong> Payment card details (processed securely by our payment provider — we do not store full card numbers).</li>
                <li><strong className="text-brown">Technical Data:</strong> IP address, browser type, device information, and cookies when you visit our website.</li>
                <li><strong className="text-brown">Communications Data:</strong> Records of correspondence with us via email, phone, or contact forms.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To process and manage your bookings and appointments.</li>
                <li>To conduct pre-treatment health consultations and assess suitability for IV therapy.</li>
                <li>To administer clinical treatments safely and effectively.</li>
                <li>To communicate with you regarding your appointments, including confirmations and reminders.</li>
                <li>To process payments and manage billing.</li>
                <li>To respond to enquiries and provide customer support.</li>
                <li>To comply with our legal and regulatory obligations as a healthcare provider.</li>
                <li>To send you marketing communications, where you have given your consent (you may opt out at any time).</li>
                <li>To improve our website and services through analytics.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">4. Legal Basis for Processing</h2>
              <p className="mb-3">We process your personal data on the following legal bases:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-brown">Contract:</strong> Processing necessary to fulfil your booking and deliver our services.</li>
                <li><strong className="text-brown">Legal Obligation:</strong> Processing required to comply with healthcare regulations and record-keeping requirements.</li>
                <li><strong className="text-brown">Vital Interests:</strong> Processing health data where necessary to protect your health and safety.</li>
                <li><strong className="text-brown">Legitimate Interests:</strong> Processing for business administration, fraud prevention, and service improvement.</li>
                <li><strong className="text-brown">Consent:</strong> Processing for marketing communications, where you have opted in.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">5. Sharing Your Information</h2>
              <p className="mb-3">We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-brown">Healthcare Practitioners:</strong> Our registered nurses and clinical staff who administer your treatment.</li>
                <li><strong className="text-brown">Payment Processors:</strong> Secure third-party payment providers to process transactions.</li>
                <li><strong className="text-brown">IT Service Providers:</strong> Hosting, booking, and communication platforms that support our operations, all bound by data processing agreements.</li>
                <li><strong className="text-brown">Regulatory Bodies:</strong> Where required by law, including the Nursing and Midwifery Council (NMC) or other regulatory authorities.</li>
                <li><strong className="text-brown">Emergency Services:</strong> In the event of a medical emergency during treatment.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy. Clinical and health records are retained for a minimum of 8 years following your last appointment, in accordance with NHS and healthcare regulatory guidance. Financial records are retained for 7 years for tax and accounting purposes. You may request deletion of non-clinical data at any time, subject to our legal obligations.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">7. Your Rights</h2>
              <p className="mb-3">Under UK GDPR, you have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-brown">Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-brown">Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-brown">Right to Erasure:</strong> Request deletion of your data, subject to legal obligations.</li>
                <li><strong className="text-brown">Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
                <li><strong className="text-brown">Right to Data Portability:</strong> Request your data in a portable format.</li>
                <li><strong className="text-brown">Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
                <li><strong className="text-brown">Right to Withdraw Consent:</strong> Withdraw consent for marketing at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at <strong className="text-brown">hello@ruhiwellness.com</strong>. We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">8. Cookies</h2>
              <p>
                Our website uses cookies to improve your browsing experience and analyse website traffic. Essential cookies are required for the website to function. Analytics cookies help us understand how visitors use our site. You can control cookie preferences through your browser settings. Continued use of our website constitutes acceptance of our use of essential cookies.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">9. Security</h2>
              <p>
                We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. All data is transmitted over encrypted connections (HTTPS). Access to personal data is restricted to authorised personnel only. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or by email. The date at the top of this policy indicates when it was last revised. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-brown mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-brown">Ruhi Wellness</strong></p>
                <p>Email: <a href="mailto:hello@ruhiwellness.com" className="text-gold hover:underline">hello@ruhiwellness.com</a></p>
                <p>Phone: <a href="tel:+447700900000" className="text-gold hover:underline">+44 (0) 7700 900000</a></p>
              </div>
              <p className="mt-3">
                You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">ico.org.uk</a> if you believe your data rights have been violated.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
