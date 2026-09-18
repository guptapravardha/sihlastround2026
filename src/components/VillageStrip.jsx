export default function VillageStrip() {
  return (
    <svg
      className="village-strip-svg"
      viewBox="0 0 900 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,60 C120,30 220,55 320,40 C430,25 520,50 620,35 C720,22 820,45 900,32 L900,100 L0,100 Z"
        fill="#cdd9b8"
      />
      {/* tree, left */}
      <g transform="translate(90,38)" fill="#a9bd8c">
        <rect x="-3" y="18" width="6" height="20" fill="#8a9d6f" />
        <circle cx="0" cy="10" r="16" />
        <circle cx="-11" cy="18" r="11" />
        <circle cx="11" cy="18" r="11" />
      </g>
      {/* house, right of tree */}
      <g transform="translate(230,45)" fill="#9fb586">
        <rect x="-16" y="8" width="32" height="22" />
        <polygon points="-20,8 0,-10 20,8" />
      </g>
      {/* tractor, center */}
      <g transform="translate(450,48)" fill="#8fa87a">
        <rect x="-22" y="-6" width="26" height="14" rx="2" />
        <rect x="2" y="-16" width="8" height="10" />
        <circle cx="-14" cy="14" r="8" />
        <circle cx="12" cy="14" r="11" />
      </g>
      {/* house, right */}
      <g transform="translate(650,44)" fill="#9fb586">
        <rect x="-14" y="8" width="28" height="20" />
        <polygon points="-18,8 0,-9 18,8" />
      </g>
      {/* tree, far right */}
      <g transform="translate(790,36)" fill="#a9bd8c">
        <rect x="-3" y="18" width="6" height="20" fill="#8a9d6f" />
        <circle cx="0" cy="10" r="15" />
        <circle cx="-10" cy="18" r="10" />
        <circle cx="10" cy="18" r="10" />
      </g>
    </svg>
  );
}
