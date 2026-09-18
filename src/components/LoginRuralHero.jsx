export default function LoginRuralHero() {
  return (
    <svg
      className="rural-hero-svg"
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf3e3" />
          <stop offset="45%" stopColor="#f3ecd6" />
          <stop offset="100%" stopColor="#f7dfb8" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9c99e" />
          <stop offset="100%" stopColor="#a6bb8a" />
        </linearGradient>
        <linearGradient id="fieldMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8caa5c" />
          <stop offset="100%" stopColor="#6f9345" />
        </linearGradient>
        <linearGradient id="fieldNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5f8a3d" />
          <stop offset="100%" stopColor="#3f6b2a" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="800" height="1000" fill="url(#skyGrad)" />

      {/* sun */}
      <circle cx="620" cy="640" r="150" fill="url(#sunGlow)" />
      <circle cx="620" cy="640" r="46" fill="#ffe08a" />

      {/* far hills */}
      <path
        d="M0,560 C120,520 220,545 320,520 C430,495 520,540 620,510 C700,488 760,515 800,505 L800,1000 L0,1000 Z"
        fill="url(#hillFar)"
        opacity="0.65"
      />

      {/* mid field with village houses */}
      <path
        d="M0,660 C140,620 260,655 400,630 C540,605 640,650 800,620 L800,1000 L0,1000 Z"
        fill="url(#fieldMid)"
        opacity="0.85"
      />

      {/* tiny village houses on the mid ridge */}
      <g opacity="0.9">
        <g transform="translate(430,600)">
          <rect x="-16" y="-14" width="32" height="20" rx="2" fill="#caa06a" />
          <polygon points="-20,-14 0,-30 20,-14" fill="#8a5a3a" />
        </g>
        <g transform="translate(475,614)">
          <rect x="-13" y="-11" width="26" height="16" rx="2" fill="#d9b27f" />
          <polygon points="-16,-11 0,-24 16,-11" fill="#79502f" />
        </g>
        <g transform="translate(560,608)">
          <rect x="-14" y="-12" width="28" height="18" rx="2" fill="#caa06a" />
          <polygon points="-17,-12 0,-26 17,-12" fill="#8a5a3a" />
        </g>
      </g>

      {/* near rolling field */}
      <path
        d="M0,760 C160,720 300,770 460,740 C600,715 700,760 800,735 L800,1000 L0,1000 Z"
        fill="url(#fieldNear)"
      />

      {/* furrow lines for a farmed-field feel */}
      <g stroke="#345522" strokeWidth="3" opacity="0.35" strokeLinecap="round">
        <path d="M40,900 C220,860 380,900 560,865" fill="none" />
        <path d="M20,950 C220,905 400,950 620,910" fill="none" />
        <path d="M0,995 C220,950 420,995 680,955" fill="none" />
      </g>

      {/* farmer silhouette, seated, looking toward the sunset */}
      <g transform="translate(255,760)">
        <ellipse cx="0" cy="150" rx="60" ry="14" fill="#2f4a20" opacity="0.25" />
        {/* body */}
        <path
          d="M-38,140 C-42,100 -30,60 -10,45 C0,38 4,30 2,18 C0,4 -8,-6 -6,-20 C-4,-34 10,-40 22,-32 C34,-24 34,-8 26,2 C20,10 22,22 30,30 C48,42 58,80 52,140 Z"
          fill="#f4ede0"
        />
        {/* turban-wrapped scarf trailing down the back */}
        <path
          d="M18,-30 C34,-24 40,-8 34,10 C30,22 32,44 44,58 C54,70 54,92 40,98 C30,60 18,40 10,20 C4,4 8,-16 18,-30 Z"
          fill="#e7ded0"
        />
        {/* head + turban */}
        <circle cx="4" cy="-38" r="20" fill="#a9754e" />
        <path
          d="M-16,-42 C-16,-58 -2,-68 8,-66 C22,-64 30,-52 26,-40 C18,-46 10,-48 2,-46 C-6,-44 -12,-42 -16,-42 Z"
          fill="#e9d7ae"
        />
        {/* knees drawn up, arms resting */}
        <path
          d="M-38,140 C-46,110 -40,78 -20,64 C-8,56 4,58 6,70 C8,82 -4,88 -14,96 C-24,104 -28,122 -22,140 Z"
          fill="#efe6d4"
        />
      </g>

      {/* tree branch overhang, top-left corner */}
      <g transform="translate(-30,-20)" opacity="0.95">
        <path
          d="M0,0 C60,20 120,10 180,60 C220,92 260,80 300,110"
          stroke="#5c4128"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60,15 C90,40 100,80 80,120"
          stroke="#5c4128"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {[
          [30, 10], [55, 25], [80, 15], [110, 35], [140, 45], [170, 65],
          [200, 75], [230, 95], [70, 60], [95, 90], [60, 100], [40, 40],
        ].map(([x, y], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="22"
            ry="13"
            fill={i % 2 === 0 ? "#5c7a3a" : "#6f9245"}
            transform={`rotate(${(i * 37) % 360} ${x} ${y})`}
            opacity="0.9"
          />
        ))}
      </g>

      {/* stone marker, bottom-left */}
      <g transform="translate(60,880)">
        <path d="M-30,120 L-24,0 L24,-6 L30,120 Z" fill="#33452a" />
        <path d="M-24,0 L24,-6 L20,-14 L-20,-8 Z" fill="#425a37" />
      </g>
    </svg>
  );
}
