import React from "react";

export function RookieIcon({ size = 20, title = "Rookie Board" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label={title}
      style={{ display: "block" }}
      shapeRendering="geometricPrecision"
    >
      {/* Inner football seam only */}
      <path
        d="M18 74
           C26 50 42 36 64 36
           C86 36 102 50 110 74
           C102 94 86 108 64 108
           C42 108 26 94 18 74 Z"
        fill="none"
        stroke="var(--rb-logo-stroke)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Refined laces */}
      <path
        d="M50 40c9-3 19-3 28 0"
        fill="none"
        stroke="var(--rb-logo-band)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <g stroke="var(--rb-logo-band)" strokeWidth="3" strokeLinecap="round">
        <path d="M54 38v8" />
        <path d="M60 36v10" />
        <path d="M66 36v10" />
        <path d="M72 36v10" />
        <path d="M78 38v8" />
      </g>

      {/* Bars (analytics) */}
      <rect x="40" y="78" width="10" height="18" rx="2" fill="var(--rb-logo-accent)" opacity="0.55" />
      <rect x="54" y="70" width="10" height="26" rx="2" fill="var(--rb-logo-accent)" opacity="0.7" />
      <rect x="68" y="60" width="10" height="36" rx="2" fill="var(--rb-logo-accent)" opacity="0.85" />
      <rect x="82" y="50" width="10" height="46" rx="2" fill="var(--rb-logo-accent)" />

      {/* Trend line */}
      <path
        d="M34 88 L48 80 L62 72 L76 64 L90 54"
        fill="none"
        stroke="var(--rb-logo-accent)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="48" cy="80" r="4" fill="var(--rb-logo-accent)" />
      <circle cx="62" cy="72" r="4" fill="var(--rb-logo-accent)" />
      <circle cx="76" cy="64" r="4" fill="var(--rb-logo-accent)" />
    </svg>
  );
}