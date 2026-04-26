import { useEffect, useRef, useState } from "react";

interface IVDripBagProps {
  scrollProgress?: number; // 0–1 from parent
}

export default function IVDripBag({ scrollProgress = 0 }: IVDripBagProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(0);

  // Liquid fill level: starts at 80% full, drains as user scrolls
  const liquidLevel = Math.max(0.05, 0.80 - scrollProgress * 0.70);
  // Liquid Y position in the bag (SVG coords: bag interior ~y=80 to y=280)
  const bagTop = 80;
  const bagBottom = 285;
  const bagHeight = bagBottom - bagTop;
  const liquidY = bagTop + bagHeight * (1 - liquidLevel);

  // Click to create ripple
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 520;
    const id = nextId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 900);
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full cursor-pointer select-none"
      onClick={handleClick}
      aria-label="Animated IV drip bag — click to interact"
    >
      <defs>
        {/* Liquid gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.10 78)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="oklch(0.52 0.10 75)" stopOpacity="0.85" />
        </linearGradient>
        {/* Bag gradient */}
        <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.975 0.012 80)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="oklch(0.955 0.020 78)" stopOpacity="0.9" />
        </linearGradient>
        {/* Gold outline gradient */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.10 78)" />
          <stop offset="100%" stopColor="oklch(0.38 0.08 68)" />
        </linearGradient>
        {/* Clip for liquid inside bag */}
        <clipPath id="bagClip">
          <path d="M130,75 Q130,55 200,50 Q270,55 270,75 L285,285 Q285,310 200,315 Q115,310 115,285 Z" />
        </clipPath>
        {/* Wave filter for liquid surface */}
        <filter id="waveFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="2" seed="2">
            <animate attributeName="baseFrequency" values="0.02 0.08;0.025 0.09;0.02 0.08" dur="4s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ── Hanger hook ─────────────────────────────────────────────────── */}
      <g className="bag-sway">
        {/* Hook */}
        <path
          d="M200,8 Q200,2 206,2 Q212,2 212,8 L212,28"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Hook circle */}
        <circle cx="200" cy="8" r="5" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />

        {/* ── Hanger bar ─────────────────────────────────────────────── */}
        <rect x="155" y="28" width="90" height="8" rx="4" fill="url(#goldGrad)" opacity="0.9" />
        {/* Strings from bar to bag top */}
        <line x1="170" y1="36" x2="155" y2="55" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.7" />
        <line x1="230" y1="36" x2="245" y2="55" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.7" />

        {/* ── Bag body ────────────────────────────────────────────────── */}
        {/* Bag shadow */}
        <path
          d="M130,75 Q130,55 200,50 Q270,55 270,75 L285,285 Q285,312 200,317 Q115,312 115,285 Z"
          fill="oklch(0.52 0.10 75 / 0.08)"
          transform="translate(4,4)"
        />
        {/* Bag fill */}
        <path
          d="M130,75 Q130,55 200,50 Q270,55 270,75 L285,285 Q285,310 200,315 Q115,310 115,285 Z"
          fill="url(#bagGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />

        {/* ── Liquid inside bag ───────────────────────────────────────── */}
        <g clipPath="url(#bagClip)">
          {/* Liquid body */}
          <rect
            x="80"
            y={liquidY}
            width="240"
            height={bagBottom - liquidY + 20}
            fill="url(#liquidGrad)"
            style={{ transition: "y 0.8s cubic-bezier(0.4,0,0.2,1), height 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
          {/* Animated wave surface */}
          <rect
            x="80"
            y={liquidY - 6}
            width="240"
            height="12"
            fill="url(#liquidGrad)"
            filter="url(#waveFilter)"
            opacity="0.8"
            style={{ transition: "y 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
          {/* Shimmer highlight */}
          <ellipse
            cx="165"
            cy={liquidY + 20}
            rx="18"
            ry="8"
            fill="white"
            opacity="0.25"
            className="liquid-shimmer"
          />
        </g>

        {/* ── Bag label ───────────────────────────────────────────────── */}
        <rect x="145" y="155" width="110" height="90" rx="6"
          fill="oklch(0.975 0.012 80 / 0.85)"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />
        {/* Ruhi logo symbol — simplified infinity/knot */}
        <path
          d="M185,185 C185,178 195,175 200,182 C205,175 215,178 215,185 C215,192 205,196 200,190 C195,196 185,192 185,185 Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="2"
        />
        <text x="200" y="215" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="600" fill="oklch(0.38 0.08 68)" letterSpacing="2">RUHI</text>
        <text x="200" y="228" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="8" fill="oklch(0.52 0.10 75)" letterSpacing="3">WELLNESS</text>

        {/* ── Bag bottom port ─────────────────────────────────────────── */}
        <rect x="188" y="312" width="24" height="18" rx="4" fill="url(#goldGrad)" opacity="0.9" />
        <rect x="193" y="330" width="14" height="8" rx="2" fill="url(#goldGrad)" opacity="0.7" />

        {/* ── Drip tube ───────────────────────────────────────────────── */}
        <path
          d="M200,338 L200,420 Q200,440 210,445 L210,490"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Drip chamber */}
        <rect x="193" y="360" width="14" height="35" rx="7"
          fill="oklch(0.975 0.012 80 / 0.9)"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
        />
        {/* Drip drops */}
        <ellipse cx="200" cy="380" rx="3" ry="4"
          fill="url(#liquidGrad)"
          className="tube-drip"
        />
        <ellipse cx="200" cy="380" rx="3" ry="4"
          fill="url(#liquidGrad)"
          className="tube-drip-2"
        />

        {/* ── Needle at bottom ────────────────────────────────────────── */}
        <path
          d="M207,490 L213,510 L207,508 L200,512 L193,508 L187,510 L193,490 Z"
          fill="url(#goldGrad)"
          opacity="0.85"
        />
      </g>

      {/* ── Botanical leaf accents ───────────────────────────────────────── */}
      <g opacity="0.18" fill="none" stroke="oklch(0.52 0.10 75)" strokeWidth="1.2">
        {/* Left leaf */}
        <path d="M60,200 Q30,160 50,120 Q70,160 60,200 Z" />
        <path d="M60,200 Q55,160 50,120" />
        <path d="M60,200 Q40,175 35,145" />
        <path d="M60,200 Q65,170 68,140" />
        {/* Right leaf */}
        <path d="M340,240 Q370,200 350,160 Q330,200 340,240 Z" />
        <path d="M340,240 Q345,200 350,160" />
        <path d="M340,240 Q360,215 365,185" />
        <path d="M340,240 Q335,210 332,180" />
        {/* Small accent dots */}
        <circle cx="75" cy="280" r="2" fill="oklch(0.52 0.10 75)" />
        <circle cx="85" cy="295" r="1.5" fill="oklch(0.52 0.10 75)" />
        <circle cx="325" cy="160" r="2" fill="oklch(0.52 0.10 75)" />
        <circle cx="315" cy="175" r="1.5" fill="oklch(0.52 0.10 75)" />
      </g>

      {/* ── Click ripples ────────────────────────────────────────────────── */}
      {ripples.map((r) => (
        <g key={r.id}>
          <circle cx={r.x} cy={r.y} r="0" fill="none" stroke="oklch(0.52 0.10 75)" strokeWidth="2" opacity="0.7">
            <animate attributeName="r" from="0" to="60" dur="0.8s" fill="freeze" />
            <animate attributeName="opacity" from="0.7" to="0" dur="0.8s" fill="freeze" />
          </circle>
          <circle cx={r.x} cy={r.y} r="0" fill="none" stroke="oklch(0.68 0.10 78)" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" from="0" to="40" dur="0.6s" fill="freeze" />
            <animate attributeName="opacity" from="0.5" to="0" dur="0.6s" fill="freeze" />
          </circle>
          <circle cx={r.x} cy={r.y} r="3" fill="oklch(0.52 0.10 75)" opacity="0.8">
            <animate attributeName="r" from="3" to="0" dur="0.4s" fill="freeze" />
            <animate attributeName="opacity" from="0.8" to="0" dur="0.4s" fill="freeze" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
