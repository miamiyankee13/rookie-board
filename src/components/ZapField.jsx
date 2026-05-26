import React from "react";

/**
 * ZapField — controlled input + live amber bar (0–100 scale).
 * The bar is derived from whatever you type; if the value
 * isn't a number, the bar shows empty.
 */
export function ZapField({ value = "", onChange, placeholder = "ZAP" }) {
  const n = parseFloat(value);
  const hasValue = Number.isFinite(n);
  const pct = hasValue ? Math.min(100, Math.max(0, n)) : 0;

  return (
    <div className="zap-field">
      <input
        className={`input${hasValue ? " has-value" : ""}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        aria-label="ZAP score"
      />
      <div className="zap-bar" aria-hidden>
        <i style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}
