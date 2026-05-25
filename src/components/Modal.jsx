import React from "react";

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div className="drawer-title">{title}</div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
}
