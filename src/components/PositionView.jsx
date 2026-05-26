import React from "react";
import { ZapField } from "./ZapField";
import { RpField } from "./RpField";

function PosPill({ pos, posRank }) {
  return (
    <span className="pv-pill" data-pos={pos}>
      {pos}
      {posRank ? <i>{posRank}</i> : null}
    </span>
  );
}

export function PositionView({ board, position, onUpdatePlayer, onOpenNotes }) {
  const tiers = board.tiers;
  const players = board.players;

  const rows = [];
  let overallRank = 0;
  let posRank = 0;

  for (const tier of tiers) {
    for (const pid of tier.playerIds) {
      overallRank += 1;
      const p = players[pid];
      if (!p) continue;
      if (p.pos !== position) continue;
      rows.push({
        tierTitle: tier.title,
        tierId: tier.id,
        overallRank,
        posRank: (posRank += 1),
        player: p,
      });
    }
  }

  const showRP  = position === "WR";
  const showZAP = position !== "QB";
  const showCat = position !== "QB";

  const updateMeta = (player, key, value) =>
    onUpdatePlayer(player.id, {
      posMeta: { ...(player.posMeta ?? {}), [key]: value },
    });

  return (
    <div className="position-shell">
      <div className="pos-note" data-pos={position}>
        <div>// EDIT TIER &amp; RANK ON BIG BOARD</div>
        <div className="pos-note-r">
          <span>
            <b>{rows.length}</b> {position} ON BOARD
          </span>
        </div>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="pv-desktop">
        <table className="pv-table">
          <colgroup>
            <col className="col-tier" />
            <col className="col-rank" />
            <col className="col-player" />
            {showRP && <col className="col-rp" />}
            {showZAP && <col className="col-zap" />}
            {showCat && <col className="col-cat" />}
            <col className="col-notes" />
          </colgroup>

          <thead>
            <tr>
              <th>Tier</th>
              <th className="num">Rank</th>
              <th>Player</th>
              {showRP && <th>RP</th>}
              {showZAP && <th>ZAP</th>}
              {showCat && <th>Category</th>}
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.player.id}>
                <td>
                  <span className="pv-tier">{r.tierTitle}</span>
                </td>
                <td className="num">
                  <span className="rank">
                    #{String(r.overallRank).padStart(2, "0")}
                  </span>
                </td>
                <td>
                  <div className="pv-pname">
                    <PosPill pos={position} posRank={r.posRank} />
                    <span className="pv-name">{r.player.name || "Unnamed"}</span>
                  </div>
                </td>
                {showRP && (
                  <td>
                    <RpField
                      value={r.player.posMeta?.RP ?? ""}
                      onChange={(v) => updateMeta(r.player, "RP", v)}
                    />
                  </td>
                )}
                {showZAP && (
                  <td>
                    <ZapField
                      value={r.player.posMeta?.ZAP ?? ""}
                      onChange={(v) => updateMeta(r.player, "ZAP", v)}
                    />
                  </td>
                )}
                {showCat && (
                  <td>
                    <input
                      className="input sans"
                      value={r.player.posMeta?.Category ?? ""}
                      onChange={(e) => updateMeta(r.player, "Category", e.target.value)}
                      placeholder="Category"
                      maxLength={19}
                    />
                  </td>
                )}
                <td>
                  <button
                    className="btn"
                    onClick={() => onOpenNotes(r.player.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="pv-empty">// NO {position} ADDED TO BIG BOARD</div>
        )}
      </div>

      {/* ─── MOBILE CARDS ─── */}
      <div className="pv-mobile">
        {rows.map((r) => (
          <div key={r.player.id} className="pv-card" data-pos={position}>
            <div className="pv-card-top">
              <div className="pv-pname">
                <PosPill pos={position} posRank={r.posRank} />
                <span className="pv-name">{r.player.name || "Unnamed"}</span>
              </div>
              <button className="btn" onClick={() => onOpenNotes(r.player.id)}>
                Notes
              </button>
            </div>

            <div className="pv-card-meta">
              <span>{r.tierTitle}</span>
              <span>·</span>
              <b>#{String(r.overallRank).padStart(2, "0")}</b>
            </div>

            {(showRP || showZAP || showCat) && (
              <div className="pv-card-fields">
                {showRP && (
                  <div className="pv-card-field">
                    <span className="pv-card-field-lbl">RP Rank</span>
                    <RpField
                      value={r.player.posMeta?.RP ?? ""}
                      onChange={(v) => updateMeta(r.player, "RP", v)}
                    />
                  </div>
                )}
                {showZAP && (
                  <div className="pv-card-field">
                    <span className="pv-card-field-lbl">ZAP</span>
                    <ZapField
                      value={r.player.posMeta?.ZAP ?? ""}
                      onChange={(v) => updateMeta(r.player, "ZAP", v)}
                    />
                  </div>
                )}
                {showCat && (
                  <div className="pv-card-field">
                    <span className="pv-card-field-lbl">Category</span>
                    <input
                      className="input sans"
                      value={r.player.posMeta?.Category ?? ""}
                      onChange={(e) =>
                        updateMeta(r.player, "Category", e.target.value)
                      }
                      placeholder="Category"
                      maxLength={19}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {rows.length === 0 && (
          <div className="pv-empty">// NO {position} ADDED TO BIG BOARD</div>
        )}
      </div>
    </div>
  );
}
