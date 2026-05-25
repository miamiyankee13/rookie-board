import React from "react";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast-wrap">
      <div className="toast" role="status" aria-live="polite">
        {message}
      </div>
    </div>
  );
}
