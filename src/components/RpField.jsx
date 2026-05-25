import React from "react";

/**
 * RpField — controlled input + dot colored by Reception Perception rank.
 *   #1–5   = elite (green)
 *   #6–15  = solid (amber)
 *   #16+   = depth (rose)
 * Empty / non-numeric value = neutral dim dot.
 */
export function RpField({ value = "", onChange, placeholder = "rank" }) {
  const n = parseInt(value, 10);
  let cls = "";
  if (Number.isFinite(n) && n > 0) {
    if (n <= 5) cls = "elite";
    else if (n <= 15) cls = "solid";
    else cls = "depth";
  }

  return (
    <div className="rp-field">
      <span className={`rp-dot ${cls}`} aria-hidden />
      <input
        className="input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        aria-label="Reception Perception rank"
      />
    </div>
  );
}
