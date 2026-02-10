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
          <button className="btn" onClick={onToggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button className="btn" onClick={onNewTier}>+ Tier</button>
        </div>
      </div>

      <div className="hr" />

      <div className="row" style={{ flexWrap: "wrap" }}>
        <button className="btn" onClick={onExport}>Export JSON</button>

        <button
          className="btn"
          onClick={() => fileRef.current?.click()}
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

        <button className="btn" onClick={onCopy}>Copy Board</button>
        <button className="btn" onClick={onPasteOpen}>Paste Board</button>

        <button className="btn" onClick={onResetBoard} title="Resets local board only">
          Reset Board
        </button>
      </div>
    </div>
  );
}