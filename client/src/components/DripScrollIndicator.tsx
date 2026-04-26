import { useEffect, useState } from "react";

export default function DripScrollIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="drip-indicator hidden lg:flex">
      {/* IV bag icon */}
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="opacity-60">
        <rect x="3" y="0" width="10" height="8" rx="2" fill="oklch(0.55 0.12 195)" opacity="0.5"/>
        <line x1="8" y1="8" x2="8" y2="12" stroke="oklch(0.55 0.12 195)" strokeWidth="1.5"/>
        <circle cx="8" cy="13" r="1.5" fill="oklch(0.55 0.12 195)" opacity="0.7"/>
      </svg>

      {/* Track */}
      <div className="drip-track">
        <div className="drip-fill" style={{ height: `${progress}%` }} />
      </div>

      {/* Drop */}
      <div className="drip-drop" />

      {/* Percentage */}
      <span
        className="text-[10px] font-semibold mt-1"
        style={{ color: "oklch(0.55 0.12 195)", writingMode: "vertical-rl" }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
}
