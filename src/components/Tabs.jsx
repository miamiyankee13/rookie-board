import React from "react";

/**
 * Tabs — kept API-compatible with the previous version.
 * Pass an optional `counts` map ({ "Big Board": 11, QB: 3, ... }) to
 * display small per-tab counts in the new Terminal styling.
 */
export function Tabs({ tabs, active, onChange, counts }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => {
        const key = t.toLowerCase().replace(/\s+/g, "-");
        const isActive = active === t;
        const c = counts && counts[t];
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`tab tab-${key}`}
            data-active={isActive ? "true" : "false"}
            onClick={() => onChange(t)}
          >
            {t}
            {typeof c === "number" && <span className="tab-count">{c}</span>}
          </button>
        );
      })}
    </div>
  );
}
