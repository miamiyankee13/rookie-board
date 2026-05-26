import React from "react";

/**
 * RpField — controlled input + dot colored by Reception Perception rank.
 *   #1–5   = elite (green)
 *   #6–15  = solid (amber)
 *   #16+   = depth (rose)
 */
export function RpField({ value, onChange }) {
  const raw = value ?? "";
  const n = Number(raw);

  let tone = "depth";

  if (raw !== "" && Number.isFinite(n)) {
    if (n <= 5) tone = "elite";
    else if (n <= 15) tone = "solid";
    else tone = "depth";
  }

  return (
    <div className="rp-field">
      <input
        className="input"
        value={raw}
        onChange={(e) => onChange(e.target.value)}
        placeholder="RP"
        maxLength={2}
      />
      <span className={`rp-dot ${tone}`} />
    </div>
  );
}