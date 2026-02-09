import React from "react";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" style={{ display: "flex", gap: 8 }}>
      {tabs.map((t) => {
        const key = t.toLowerCase().replace(" ", "-");
        const isActive = active === t;

        return (
          <button
            key={t}
            className={`tab tab-${key}`}
            data-active={isActive ? "true" : "false"}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}