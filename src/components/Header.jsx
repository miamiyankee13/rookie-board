import React, { useMemo, useRef } from "react";

/**
 * Header — status bar + brand + utility actions.
 * Same API as before. The previous RookieIcon is replaced by an
 * inline "R" badge so the chrome reads as a single piece.
 */
export function Header({
  board,
  theme,
  onToggleTheme,
  onExport,
  onImportFile,
  onCopyText,
  onCopy,
  onPasteOpen,
  onResetBoard,
}) {
  const fileRef = useRef(null);

  const totalProspects = useMemo(
    () => (board?.tiers ?? []).reduce((s, t) => s + (t.playerIds?.length ?? 0), 0),
    [board]
  );
  const tiersCount = (board?.tiers ?? []).length;

  const updatedLabel = useMemo(() => {
    if (!board?.updatedAt) return "—";
    const d = new Date(board.updatedAt);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [board?.updatedAt]);

  return (
    <>
      <div className="statusbar">
        <div>
          <span className="pulse" />
          <b>LIVE</b> · LOCAL · AUTOSAVED
        </div>
        <div className="statusbar-workspace">
          Workspace · SCOUTING / PROSPECTS
        </div>
        <div className="statusbar-clock">UPDATED · {String(updatedLabel).toUpperCase()}</div>
      </div>

      <div className="header">
        <div className="brand">
          <div className="logo" aria-hidden>R</div>
          <div className="brand-text">
            <div className="brand-title">{board?.yearLabel || "Rookie Board"}</div>
            <div className="brand-meta">
              {totalProspects} {totalProspects === 1 ? "prospect" : "prospects"} · {tiersCount} {tiersCount === 1 ? "tier" : "tiers"}
            </div>
          </div>
        </div>

        <div className="utility">
          <button className="btn" onClick={onExport} title="Export JSON file">
            Export JSON
          </button>

          <button
            className="btn"
            onClick={() => fileRef.current?.click()}
            title="Import JSON file"
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

          <button className="btn" onClick={onCopyText} title="Copy board as text">
            Copy Text
          </button>
          <button className="btn" onClick={onCopy} title="Copy board as JSON">
            Copy JSON
          </button>
          <button className="btn" onClick={onPasteOpen} title="Paste a JSON board">
            Paste JSON
          </button>
          <button className="btn" onClick={onResetBoard} title="Reset local board">
            Reset
          </button>

          <button
            className="btn icon"
            onClick={onToggleTheme}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </>
  );
}
