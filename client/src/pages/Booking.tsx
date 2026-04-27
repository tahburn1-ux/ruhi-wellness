import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, Check, AlertCircle, Droplets, X, Lock } from "lucide-react";
import { toast } from "sonner";

// ── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TIME_SLOTS = ["09:00 AM","10:00 AM","10:30 AM","11:15 AM","12:00 PM","01:30 PM","02:30 PM","03:30 PM","04:00 PM","05:00 PM"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ["Schedule", "Details", "Consent Form", "Confirm"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < step ? "bg-[oklch(0.52_0.10_75)] text-white" :
              i + 1 === step ? "bg-[oklch(0.52_0.10_75)] text-white ring-4 ring-[oklch(0.82_0.06_75)]" :
              "bg-white border-2 border-[oklch(0.87_0.025_78)] text-[oklch(0.58_0.03_65)]"
            }`}>
              {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i + 1 === step ? "text-[oklch(0.52_0.10_75)]" : "text-[oklch(0.58_0.03_65)]"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-1 mb-5 transition-all ${i + 1 < step ? "bg-[oklch(0.52_0.10_75)]" : "bg-[oklch(0.87_0.025_78)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Mini calendar ─────────────────────────────────────────────────────────────
function Calendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const tomorrow = new Date(t); tomorrow.setDate(t.getDate() + 1);
    return d < tomorrow || d.getDay() === 0; // no Sundays, no past
  };

  const isSelected = (day: number) =>
    selected && selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-[oklch(0.92_0.03_78)] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[oklch(0.52_0.10_75)]" />
        </button>
        <span className="font-semibold text-[oklch(0.22_0.05_60)]">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-[oklch(0.92_0.03_78)] transition-colors">
          <ChevronRight className="w-5 h-5 text-[oklch(0.52_0.10_75)]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-[oklch(0.58_0.03_65)] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day && (
              <button
                disabled={isDisabled(day)}
                onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  isSelected(day) ? "bg-[oklch(0.52_0.10_75)] text-white shadow-md scale-110" :
                  isDisabled(day) ? "text-[oklch(0.80_0.02_78)] cursor-not-allowed" :
                  "hover:bg-[oklch(0.92_0.03_78)] text-[oklch(0.30_0.04_65)]"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Medical history conditions ────────────────────────────────────────────────
const CONDITIONS = [
  "Hypertension (high blood pressure)", "Hypotension (low blood pressure)", "Diabetes (Type 1 or 2)",
  "Kidney disease / renal impairment", "Liver disease / hepatic impairment", "Heart disease / cardiac conditions",
  "Congestive heart failure", "Pulmonary oedema", "Epilepsy / seizure disorder",
  "Anaemia or blood disorders", "Clotting disorders / DVT / PE", "Autoimmune conditions",
  "Active cancer or undergoing chemotherapy", "Pregnancy or breastfeeding", "Allergies to vitamins/minerals",
  "Phobia of needles / vasovagal syncope", "Previous adverse reaction to IV therapy",
];

const WELLBEING = [
  "Fatigue or low energy", "Headaches or migraines", "Muscle aches or pains",
  "Poor sleep quality", "Digestive issues", "Frequent illness / low immunity",
  "Brain fog or poor concentration", "Dehydration", "Stress or anxiety",
];

// ── Consent Form (Step 3) ─────────────────────────────────────────────────────
function ConsentForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (key: string, val: any) => onChange({ ...data, [key]: val });

  const setMedHistory = (index: number, field: string, val: any) => {
    const arr = [...(data.medicalHistory || CONDITIONS.map(c => ({ condition: c, yes: null, details: "" })))];
    arr[index] = { ...arr[index], [field]: val };
    set("medicalHistory", arr);
  };

  const setWellbeing = (index: number, field: string, val: any) => {
    const arr = [...(data.wellbeing || WELLBEING.map(s => ({ symptom: s, yes: null, notes: "" })))];
    arr[index] = { ...arr[index], [field]: val };
    set("wellbeing", arr);
  };

  const addMedication = () => {
    const meds = [...(data.medications || []), { name: "", dose: "", frequency: "", reason: "" }];
    set("medications", meds);
  };

  const setMed = (i: number, field: string, val: string) => {
    const meds = [...(data.medications || [])];
    meds[i] = { ...meds[i], [field]: val };
    set("medications", meds);
  };

  const removeMed = (i: number) => {
    const meds = (data.medications || []).filter((_: any, idx: number) => idx !== i);
    set("medications", meds);
  };

  const medHistory = data.medicalHistory || CONDITIONS.map(c => ({ condition: c, yes: null, details: "" }));
  const wellbeing = data.wellbeing || WELLBEING.map(s => ({ symptom: s, yes: null, notes: "" }));

  return (
    <div className="space-y-8">
      {/* Section 1: Consent */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-4">
          1. Consent & Declaration
        </h3>
        <div className="bg-[oklch(0.96_0.03_78)] rounded-xl p-4 text-sm text-[oklch(0.40_0.03_65)] leading-relaxed mb-4">
          I understand that IV Nutrient Therapy (IVNT) involves the administration of vitamins, minerals, and other nutrients directly into the bloodstream via intravenous infusion. I acknowledge that while IVNT is generally considered safe, it carries potential risks including but not limited to: infection at the insertion site, bruising, phlebitis, air embolism, allergic reactions, and electrolyte imbalances.
        </div>
        {[
          { key: "consent1", label: "I consent to the administration of IV Nutrient Therapy and understand the risks involved." },
          { key: "consent2", label: "I confirm that the medical history information I provide is accurate and complete to the best of my knowledge." },
          { key: "consent3", label: "I understand that I may withdraw my consent at any time before or during the procedure." },
          { key: "consent4", label: "I agree that Ruhi Wellness may retain my medical information for the purpose of providing safe treatment." },
          { key: "consent5", label: "I confirm I am 18 years of age or older." },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 mb-3 cursor-pointer group">
            <div
              onClick={() => set(key, !data[key])}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                data[key] ? "bg-[oklch(0.32_0.05_60)] border-[oklch(0.32_0.05_60)]" : "border-[oklch(0.7_0.03_215)] group-hover:border-[oklch(0.32_0.05_60)]"
              }`}
            >
              {data[key] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-[oklch(0.35_0.04_65)]">{label}</span>
          </label>
        ))}
      </div>

      {/* Section 2: Medical History */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-2">
          2. Medical History
        </h3>
        <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">Please indicate if you have or have had any of the following conditions:</p>
        <div className="space-y-3">
          {medHistory.map((item: any, i: number) => (
            <div key={i} className="border border-[oklch(0.87_0.025_78)] rounded-xl p-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[oklch(0.35_0.04_65)] flex-1">{item.condition}</span>
                <div className="flex gap-2">
                  {[{ val: true, label: "Yes" }, { val: false, label: "No" }].map(({ val, label }) => (
                    <button
                      key={label}
                      onClick={() => setMedHistory(i, "yes", val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        item.yes === val
                          ? "bg-[oklch(0.32_0.05_60)] text-white border border-[oklch(0.32_0.05_60)]"
                          : "bg-[oklch(0.92_0.03_78)] text-[oklch(0.50_0.03_65)] border border-transparent hover:border-[oklch(0.32_0.05_60)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {item.yes && (
                <input
                  type="text"
                  placeholder="Please provide details..."
                  value={item.details}
                  onChange={e => setMedHistory(i, "details", e.target.value)}
                  className="mt-2 w-full text-sm border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Medications */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-2">
          3. Current Medications
        </h3>
        <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">List any medications, supplements, or vitamins you are currently taking:</p>
        {(data.medications || []).map((med: any, i: number) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 border border-[oklch(0.87_0.025_78)] rounded-xl">
            {[
              { field: "name", placeholder: "Medication name" },
              { field: "dose", placeholder: "Dose (e.g. 10mg)" },
              { field: "frequency", placeholder: "Frequency" },
              { field: "reason", placeholder: "Reason" },
            ].map(({ field, placeholder }) => (
              <input key={field} type="text" placeholder={placeholder} value={med[field]}
                onChange={e => setMed(i, field, e.target.value)}
                className="text-sm border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white"
              />
            ))}
            <button onClick={() => removeMed(i)} className="text-xs text-red-500 hover:text-red-700 col-span-2 md:col-span-4 text-right">
              Remove
            </button>
          </div>
        ))}
        <button onClick={addMedication} className="text-sm text-[oklch(0.32_0.05_60)] font-semibold hover:underline">
          + Add Medication
        </button>
      </div>

      {/* Section 4: IVNT History */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-4">
          4. IVNT History
        </h3>
        {[
          { key: "previousIVNT", label: "Have you received IV Nutrient Therapy before?" },
          { key: "adverseReaction", label: "Have you ever had an adverse reaction to IV therapy?" },
          { key: "allergies", label: "Do you have any known allergies to vitamins, minerals, or medications?" },
        ].map(({ key, label }) => (
          <div key={key} className="mb-4">
            <p className="text-sm text-[oklch(0.35_0.04_65)] mb-2">{label}</p>
            <div className="flex gap-3">
              {[{ val: "yes", label: "Yes" }, { val: "no", label: "No" }].map(({ val, label: l }) => (
                <button key={val} onClick={() => set(key, val)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    data[key] === val ? "bg-[oklch(0.32_0.05_60)] text-white" : "bg-[oklch(0.92_0.03_78)] text-[oklch(0.50_0.03_65)] hover:bg-[oklch(0.32_0.05_60)]"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
            {data[key] === "yes" && (
              <input type="text" placeholder="Please provide details..."
                value={data[`${key}Details`] || ""}
                onChange={e => set(`${key}Details`, e.target.value)}
                className="mt-2 w-full text-sm border border-[oklch(0.87_0.025_78)] rounded-lg px-3 py-2 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white"
              />
            )}
          </div>
        ))}
      </div>

      {/* Section 5: Wellbeing */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-2">
          5. General Wellbeing
        </h3>
        <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">Are you currently experiencing any of the following?</p>
        <div className="space-y-3">
          {wellbeing.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 border border-[oklch(0.87_0.025_78)] rounded-xl">
              <span className="text-sm text-[oklch(0.35_0.04_65)]">{item.symptom}</span>
              <div className="flex gap-2">
                {[{ val: true, label: "Yes" }, { val: false, label: "No" }].map(({ val, label }) => (
                  <button key={label} onClick={() => setWellbeing(i, "yes", val)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      item.yes === val
                        ? "bg-[oklch(0.32_0.05_60)] text-white"
                        : "bg-[oklch(0.92_0.03_78)] text-[oklch(0.50_0.03_65)] hover:bg-[oklch(0.32_0.05_60)]"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Signature */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold text-[oklch(0.22_0.05_60)] mb-4">
          6. Declaration & Signature
        </h3>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            By typing your full name below, you confirm that all information provided is accurate and that you consent to treatment.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[oklch(0.35_0.04_65)] mb-1">Full Name (Signature)</label>
            <input type="text" placeholder="Type your full name"
              value={data.signatureName || ""}
              onChange={e => set("signatureName", e.target.value)}
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white font-serif italic text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[oklch(0.35_0.04_65)] mb-1">Date</label>
            <input type="text" value={new Date().toLocaleDateString("en-GB")} readOnly
              className="w-full border border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 bg-[oklch(0.96_0.03_78)] text-[oklch(0.50_0.03_65)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Booking ──────────────────────────────────────────────────────────────
export default function Booking() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const preselectedSlug = params.get("service") || "";

  const { data: services = [] } = trpc.services.list.useQuery();
  const createBooking = trpc.bookings.create.useMutation();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [personalData, setPersonalData] = useState({ fullName: "", email: "", phone: "", dob: "", deliveryAddress: "" });
  const [consentData, setConsentData] = useState<any>({});
  const [bookingRef, setBookingRef] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  // Preselect service from URL
  useEffect(() => {
    if (preselectedSlug && services.length > 0) {
      const svc = services.find((s: any) => s.slug === preselectedSlug);
      if (svc) setSelectedService(svc);
    }
  }, [preselectedSlug, services]);

  const canProceedStep1 = selectedService && selectedDate && selectedTime;
  const canProceedStep2 = personalData.fullName && personalData.email && personalData.phone && personalData.deliveryAddress;
  // All 5 consent checkboxes + signature
  const consentChecked = consentData.consent1 && consentData.consent2 && consentData.consent3 && consentData.consent4 && consentData.consent5 && consentData.signatureName?.trim();
  // All medical history conditions must have Yes or No answered
  const medHistory3 = consentData.medicalHistory || CONDITIONS.map(c => ({ condition: c, yes: null, details: "" }));
  const allMedAnswered = medHistory3.every((m: any) => m.yes !== null && m.yes !== undefined);
  // All wellbeing symptoms must have Yes or No answered
  const wellbeing3 = consentData.wellbeing || WELLBEING.map(s => ({ symptom: s, yes: null, notes: "" }));
  const allWellbeingAnswered = wellbeing3.every((w: any) => w.yes !== null && w.yes !== undefined);
  // All IVNT history questions must be answered
  const allIVNTAnswered = consentData.previousIVNT && consentData.adverseReaction && consentData.allergies;
  const canProceedStep3 = consentChecked && allMedAnswered && allWellbeingAnswered && allIVNTAnswered;

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    try {
      // Ensure wellbeing and medicalHistory are fully populated with defaults
      const wellbeingData = (consentData.wellbeing || WELLBEING.map(s => ({ symptom: s, yes: null, notes: "" })))
        .map((w: any) => ({ symptom: w.symptom || "", yes: w.yes ?? null, notes: w.notes || "" }));
      const medHistoryData = (consentData.medicalHistory || CONDITIONS.map(c => ({ condition: c, yes: null, details: "" })))
        .map((m: any) => ({ condition: m.condition || "", yes: m.yes ?? null, details: m.details || "" }));
      const medicationsData = (consentData.medications || [])
        .map((med: any) => ({ name: med.name || "", dose: med.dose || "", frequency: med.frequency || "", reason: med.reason || "" }));
      const result = await createBooking.mutateAsync({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        bookingDate: selectedDate.toISOString().split("T")[0],
        bookingTime: selectedTime,
        ...personalData,
        consentData: {
          consent1: consentData.consent1 ?? false, consent2: consentData.consent2 ?? false,
          consent3: consentData.consent3 ?? false, consent4: consentData.consent4 ?? false, consent5: consentData.consent5 ?? false,
        },
        medicalHistory: medHistoryData,
        medications: medicationsData,
        ivntHistory: {
          previousIVNT: consentData.previousIVNT || null, adverseReaction: consentData.adverseReaction || null,
          allergies: consentData.allergies || null,
          previousIVNTDetails: consentData.previousIVNTDetails || "",
          adverseReactionDetails: consentData.adverseReactionDetails || "",
          allergiesDetails: consentData.allergiesDetails || "",
        },
        wellbeing: wellbeingData,
      });
      setBookingRef((result as any)?.reference || "RW-" + Date.now());
      setSubmitted(true);
      toast.success("Booking confirmed!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit booking");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 max-w-xl mx-auto px-6 text-center">
          <div className="glass-card rounded-3xl p-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[oklch(0.52_0.10_75)] to-[oklch(0.52_0.10_75)] flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[oklch(0.18_0.05_60)] mb-3">
              Booking Confirmed!
            </h2>
            <p className="text-[oklch(0.50_0.03_65)] mb-4">
              Your booking reference is:
            </p>
            <div className="text-2xl font-bold text-[oklch(0.52_0.10_75)] font-mono bg-[oklch(0.92_0.03_78)] rounded-xl py-3 px-6 mb-6">
              {bookingRef}
            </div>
            <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">
              We'll be in touch to confirm your appointment. Please save your reference number.
            </p>
            <div className="bg-[oklch(0.96_0.03_78)] rounded-xl p-4 text-sm text-[oklch(0.40_0.03_65)] mb-6 text-left">
              <div className="font-semibold text-brown mb-1">We will come to you at:</div>
              <div className="text-[oklch(0.35_0.04_65)]">{personalData.deliveryAddress}</div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/services">
                <button className="btn-outline text-sm">Browse Services</button>
              </Link>
              <Link href="/">
                <button className="btn-primary text-sm">Back to Home</button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-[oklch(0.52_0.10_75)]" />
              <h1 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)]">Book Your Session</h1>
            </div>
            <Link href="/">
              <button className="text-sm text-[oklch(0.50_0.03_65)] hover:text-[oklch(0.52_0.10_75)] flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel
              </button>
            </Link>
          </div>

          <StepIndicator step={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Step 1: Schedule */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)] mb-1">Select Your Treatment</h2>
                    <p className="text-sm text-[oklch(0.50_0.03_65)]">Choose the IV drip therapy that suits your needs.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((svc: any) => (
                      <button key={svc.id} onClick={() => setSelectedService(svc)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedService?.id === svc.id
                            ? "border-[oklch(0.52_0.10_75)] bg-[oklch(0.92_0.03_78)]"
                            : "border-[oklch(0.87_0.025_78)] hover:border-[oklch(0.82_0.06_75)] bg-white"
                        }`}>
                        <div className="flex items-center gap-3">
                          <Droplets className="w-5 h-5 text-[oklch(0.52_0.10_75)]" />
                          <div>
                            <div className="font-semibold text-[oklch(0.22_0.05_60)] text-sm">{svc.name}</div>
                            <div className="text-xs text-[oklch(0.50_0.03_65)]">{svc.duration} · £{parseFloat(svc.price).toFixed(0)}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)] mb-1">Select Date & Time</h2>
                    <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">We require at least 24 hours notice. No Sunday appointments.</p>
                    <Calendar selected={selectedDate} onSelect={setSelectedDate} />
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="font-semibold text-[oklch(0.22_0.05_60)] mb-3 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-[oklch(0.52_0.10_75)]" />
                        Available Times
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((time) => (
                          <button key={time} onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 rounded-full text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "bg-[oklch(0.52_0.10_75)] text-white shadow-md"
                                : "border border-[oklch(0.87_0.025_78)] text-[oklch(0.4_0.03_220)] hover:border-[oklch(0.52_0.10_75)]"
                            }`}>
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)] mb-1">Your Details</h2>
                    <p className="text-sm text-[oklch(0.50_0.03_65)]">We need a few details to confirm your booking.</p>
                  </div>
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    {[
                      { key: "fullName", label: "Full Name *", type: "text", placeholder: "Jane Doe" },
                      { key: "email", label: "Email Address *", type: "email", placeholder: "jane@example.com" },
                      { key: "phone", label: "Phone Number *", type: "tel", placeholder: "+44 7360 060980" },
                      { key: "dob", label: "Date of Birth", type: "date", placeholder: "" },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-[oklch(0.35_0.04_65)] mb-1">{label}</label>
                        <input type={type} placeholder={placeholder}
                          value={(personalData as any)[key]}
                          onChange={e => setPersonalData({ ...personalData, [key]: e.target.value })}
                          className="w-full border border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white text-[oklch(0.25_0.04_220)]"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-[oklch(0.35_0.04_65)] mb-1">Delivery Address * <span className="text-xs font-normal text-[oklch(0.58_0.03_65)]">(where we will come to you)</span></label>
                      <textarea
                        placeholder="e.g. 12 Wellness Lane, London, W1A 1AA — or hotel name and room number"
                        rows={3}
                        value={personalData.deliveryAddress}
                        onChange={e => setPersonalData({ ...personalData, deliveryAddress: e.target.value })}
                        className="w-full border border-[oklch(0.87_0.025_78)] rounded-xl px-4 py-3 focus:outline-none focus:border-[oklch(0.52_0.10_75)] bg-white text-[oklch(0.25_0.04_220)] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Consent Form */}
              {step === 3 && (
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)] mb-1">Consent & Medical History</h2>
                  <p className="text-sm text-[oklch(0.50_0.03_65)] mb-4">
                    For your safety, please complete this form honestly and thoroughly. All information is confidential.
                  </p>
                  {/* Completion checklist */}
                  <div className="mb-6 glass-card rounded-2xl p-4 border border-[oklch(0.87_0.025_78)]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.45_0.06_65)] mb-3">Required to proceed</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {[
                        { label: "All 5 consent declarations", done: !!(consentData.consent1 && consentData.consent2 && consentData.consent3 && consentData.consent4 && consentData.consent5) },
                        { label: "All medical history questions", done: allMedAnswered },
                        { label: "IVNT history (3 questions)", done: !!(consentData.previousIVNT && consentData.adverseReaction && consentData.allergies) },
                        { label: "Wellbeing symptoms (9 questions)", done: allWellbeingAnswered },
                        { label: "Signature (typed full name)", done: !!(consentData.signatureName?.trim()) },
                      ].map(({ label, done }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            done ? "bg-[oklch(0.52_0.10_75)]" : "border-2 border-[oklch(0.75_0.03_65)]"
                          }`}>
                            {done && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={done ? "text-[oklch(0.35_0.04_65)] line-through opacity-60" : "text-[oklch(0.35_0.04_65)]"}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ConsentForm data={consentData} onChange={setConsentData} />
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-bold text-[oklch(0.18_0.05_60)] mb-1">Confirm Your Booking</h2>
                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    {[
                      { label: "Treatment", value: selectedService?.name },
                      { label: "Date", value: selectedDate?.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                      { label: "Time", value: selectedTime },
                      { label: "Name", value: personalData.fullName },
                      { label: "Email", value: personalData.email },
                      { label: "Phone", value: personalData.phone },
                      { label: "Delivery Address", value: personalData.deliveryAddress },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-[oklch(0.92_0.01_215)] last:border-0">
                        <span className="text-sm text-[oklch(0.50_0.03_65)]">{label}</span>
                        <span className="text-sm font-semibold text-[oklch(0.25_0.04_220)]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[oklch(0.96_0.03_78)] rounded-xl p-4 text-sm text-[oklch(0.40_0.03_65)]">
                    By confirming, you agree to our terms of service and health disclaimer. A member of our team will contact you to finalise your appointment.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-outline flex items-center gap-2 text-sm">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    onClick={() => { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={
                      (step === 1 && !canProceedStep1) ||
                      (step === 2 && !canProceedStep2) ||
                      (step === 3 && !canProceedStep3)
                    }
                    className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={createBooking.isPending}
                    className="btn-primary flex items-center gap-2 text-sm disabled:opacity-70"
                  >
                    {createBooking.isPending ? "Submitting..." : "Confirm Booking →"}
                  </button>
                )}
              </div>
            </div>

            {/* Booking Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h3 className="font-serif text-lg font-semibold text-[oklch(0.22_0.05_60)] mb-4">Booking Summary</h3>
                {selectedService ? (
                  <>
                    <div className="flex items-center gap-3 mb-4 p-3 bg-[oklch(0.92_0.03_78)] rounded-xl">
                      <Droplets className="w-5 h-5 text-[oklch(0.52_0.10_75)]" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[oklch(0.52_0.10_75)]">
                          {selectedService.category}
                        </div>
                        <div className="font-semibold text-[oklch(0.22_0.05_60)] text-sm">{selectedService.name}</div>
                        <div className="text-xs text-[oklch(0.50_0.03_65)]">{selectedService.duration}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      {selectedDate && (
                        <div className="flex justify-between">
                          <span className="text-[oklch(0.50_0.03_65)]">Date</span>
                          <span className="font-medium text-[oklch(0.30_0.04_65)]">
                            {selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span className="text-[oklch(0.50_0.03_65)]">Time</span>
                          <span className="font-medium text-[oklch(0.30_0.04_65)]">{selectedTime}</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-[oklch(0.87_0.025_78)] pt-4 flex justify-between items-center">
                      <span className="font-semibold text-[oklch(0.35_0.04_65)]">Total</span>
                      <span className="text-2xl font-bold text-[oklch(0.52_0.10_75)]">
                        £{parseFloat(selectedService.price).toFixed(0)}
                      </span>
                    </div>
                    {step < 4 && canProceedStep1 && (
                      <button
                        onClick={() => { if (step === 1) setStep(2); }}
                        className="w-full mt-4 btn-primary text-sm"
                        disabled={step !== 1}
                      >
                        {step === 1 ? "Continue to Details →" : "In Progress..."}
                      </button>
                    )}
                    <div className="flex items-center justify-center gap-1 mt-3 text-xs text-[oklch(0.58_0.03_65)]">
                      <Lock className="w-3 h-3" /> Secure Booking
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[oklch(0.58_0.03_65)]">Select a treatment to see your booking summary.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
