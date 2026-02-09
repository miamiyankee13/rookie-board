import React from "react";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toastWrap">
      <div className="toast">{message}</div>
    </div>
  );
}