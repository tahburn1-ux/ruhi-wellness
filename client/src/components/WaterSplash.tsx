import { useEffect, useRef, useState } from "react";

interface SplashState {
  active: boolean;
  phase: "drop" | "expand" | "ripple" | "done";
}

export function useWaterSplash() {
  const [splash, setSplash] = useState<SplashState>({ active: false, phase: "done" });
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const triggered = useRef<Set<number>>(new Set());
  const sectionRefs = useRef<HTMLElement[]>([]);

  const registerSection = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const triggerSplash = () => {
    setSplash({ active: true, phase: "drop" });
    setTimeout(() => setSplash({ active: true, phase: "expand" }), 300);
    setTimeout(() => setSplash({ active: true, phase: "ripple" }), 650);
    setTimeout(() => setSplash({ active: false, phase: "done" }), 1100);
  };

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const scrollingDown = y > lastScrollY.current;
        lastScrollY.current = y;
        ticking.current = false;
        if (!scrollingDown) return;

        for (const section of sectionRefs.current) {
          const rect = section.getBoundingClientRect();
          const boundary = Math.round(section.offsetTop);
          // Trigger when the section top enters the viewport
          if (rect.top > -40 && rect.top < 120 && !triggered.current.has(boundary)) {
            triggered.current.add(boundary);
            triggerSplash();
            break;
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { splash, registerSection };
}

export function WaterSplashOverlay({ splash }: { splash: SplashState }) {
  if (!splash.active && splash.phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Main expanding drop */}
      <div
        className="water-splash-circle"
        data-phase={splash.phase}
      />
      {/* Ripple rings */}
      {(splash.phase === "expand" || splash.phase === "ripple") && (
        <>
          <div className="water-ripple water-ripple-1" />
          <div className="water-ripple water-ripple-2" />
          <div className="water-ripple water-ripple-3" />
        </>
      )}
    </div>
  );
}
