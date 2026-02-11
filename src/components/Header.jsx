import React, { useRef } from "react";

export function Header({
  board,
  theme,
  onToggleTheme,
  onNewTier,
  onExport,
  onImportFile,
  onCopy,
  onPasteOpen,
  onResetBoard,
}) {
  const fileRef = useRef(null);

  return (
    <div className="card header">
      <div className="row space">
        <div>
          <div className="h1">{board.yearLabel}</div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={onToggleTheme} title="Toggle Theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button className="btn" onClick={onNewTier} title="Add a Tier">+ Tier</button>
        </div>
      </div>

      <div className="hr" />

      <div className="row" style={{ flexWrap: "wrap" }}>
        <button className="btn" onClick={onExport} title="Export JSON File">Export JSON</button>

        <button
          className="btn"
          onClick={() => fileRef.current?.click()}
          title="Import JSON File"
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.target.value = "";
          }}
        />

        <button className="btn" onClick={onCopy} title="Copy JSON Board">Copy JSON</button>
        <button className="btn" onClick={onPasteOpen} title="Paste JSON Board">Paste JSON</button>

        <button className="btn" onClick={onResetBoard} title="Reset Local Board">
          Reset Board
        </button>
      </div>
    </div>
  );
}