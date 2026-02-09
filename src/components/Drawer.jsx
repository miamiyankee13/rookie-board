import React from "react";

export function Drawer({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="drawerOverlay" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="row space">
          <div className="h1">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="hr" />
        {children}
      </div>
    </div>
  );
}