import React from "react";

/**
 * KpiStrip — Big Board derived metrics.
 * Everything here is calculated from the board you already have;
 * no new inputs, no new persistence.
 */
export function KpiStrip({ board }) {
  const tiers = board?.tiers ?? [];
  const players = board?.players ?? {};

  const total = tiers.reduce((s, t) => s + (t.playerIds?.length ?? 0), 0);
  const blueChip = tiers[0]?.playerIds?.length ?? 0;

  const counts = { QB: 0, RB: 0, WR: 0, TE: 0 };
  for (const t of tiers) {
    for (const pid of t.playerIds ?? []) {
      const p = players[pid];
      if (p && Object.prototype.hasOwnProperty.call(counts, p.pos)) {
        counts[p.pos] += 1;
      }
    }
  }

  const lastEdit = (() => {
    if (!board?.updatedAt) return "—";
    const d = new Date(board.updatedAt);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  })();

  return (
    <div className="kpis">
      <div className="kpi">
        <span className="kpi-lbl">Total Prospects</span>
        <div className="kpi-v">{total}</div>
        <span className="kpi-foot">{tiers.length} TIERS</span>
      </div>
      <div className="kpi">
        <span className="kpi-lbl">Blue Chip</span>
        <div className="kpi-v amber">{blueChip}</div>
        <span className="kpi-foot">TIER 01</span>
      </div>
      <div className="kpi">
        <span className="kpi-lbl">By Position</span>
        <div className="kpi-row">
          {["QB", "RB", "WR", "TE"].map((p) => (
            <span key={p} className="kpi-pos" data-p={p}>
              {p}·<b>{counts[p]}</b>
            </span>
          ))}
        </div>
        <span className="kpi-foot">DEPTH</span>
      </div>
      <div className="kpi">
        <span className="kpi-lbl">Last Edit</span>
        <div className="kpi-v small">{lastEdit}</div>
        <span className="kpi-foot">AUTOSAVED · LOCAL</span>
      </div>
    </div>
  );
}
