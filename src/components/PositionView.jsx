import React from "react";

function posClass(pos) {
  return pos?.toLowerCase?.() ?? "qb";
}

export function PositionView({ board, position, onUpdatePlayer, onOpenNotes }) {
  const tiers = board.tiers;
  const players = board.players;

  // Preserve overall order & tier context, but only show the chosen position
  const rows = [];
  let overallRank = 0;

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
        player: p,
      });
    }
  }

  const showRP = position === "WR";
  const showZAP = position !== "QB";

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="row space">
        <div>
          <div className="muted">Edit Tier & Rank on Big Board</div>
        </div>
      </div>

      {/* Desktop/tablet table */}
      <div className="posDesktop">
        <div className="tableWrap">
          <table className="table positionTable">
            <colgroup>
              <col className="colTier" />
              <col className="colRank" />
              <col className="colPlayer" />
              {showRP && <col className="colRP" />}
              {showZAP && <col className="colZAP" />}
              <col className="colCategory" />
              <col className="colNotes" />
            </colgroup>

            <thead>
              <tr>
                <th className="th">Tier</th>
                <th className="th">Rank</th>
                <th className="th">Player</th>
                {showRP && <th className="th">RP</th>}
                {showZAP && <th className="th">ZAP</th>}
                <th className="th">Category</th>
                <th className="th">Notes</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr className="tr" key={r.player.id}>
                  <td className="td">{r.tierTitle}</td>

                  <td className="td" style={{ fontVariantNumeric: "tabular-nums" }}>
                    #{r.overallRank}
                  </td>

                  <td className="td playerCol">
                    <div className="row" style={{ gap: 10 }}>
                      <span className={`pill ${posClass(position)}`}>{position}</span>
                      <span style={{ fontWeight: 700 }}>{r.player.name}</span>
                    </div>
                  </td>

                  {showRP && (
                    <td className="td">
                      <input
                        className="input"
                        value={r.player.posMeta?.RP ?? ""}
                        onChange={(e) =>
                          onUpdatePlayer(r.player.id, {
                            posMeta: { ...(r.player.posMeta ?? {}), RP: e.target.value },
                          })
                        }
                        placeholder="RP"
                      />
                    </td>
                  )}

                  {showZAP && (
                    <td className="td">
                      <input
                        className="input"
                        value={r.player.posMeta?.ZAP ?? ""}
                        onChange={(e) =>
                          onUpdatePlayer(r.player.id, {
                            posMeta: { ...(r.player.posMeta ?? {}), ZAP: e.target.value },
                          })
                        }
                        placeholder="ZAP"
                      />
                    </td>
                  )}

                  <td className="td">
                    <input
                      className="input"
                      value={r.player.posMeta?.Category ?? ""}
                      onChange={(e) =>
                        onUpdatePlayer(r.player.id, {
                          posMeta: { ...(r.player.posMeta ?? {}), Category: e.target.value },
                        })
                      }
                      placeholder="Category"
                    />
                  </td>

                  <td className="td">
                    <button className="btn" onClick={() => onOpenNotes(r.player.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="muted" style={{ padding: 10 }}>
            No {position} players yet.
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="posMobile">
        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {rows.map((r) => (
            <div className="posCard" key={r.player.id}>
              <div className="posTop">
                <div className="row" style={{ gap: 8, minWidth: 0 }}>
                  <span className={`pill ${posClass(position)}`}>{position}</span>
                  <div className="posName">{r.player.name || "Unnamed"}</div>
                </div>

                <button className="btn" onClick={() => onOpenNotes(r.player.id)}>
                  Notes
                </button>
              </div>

              <div className="posMetaLine">
                <span className="posMetaText">{r.tierTitle}</span>
                <span className="posMetaDot">•</span>
                <span className="posMetaText">#{r.overallRank}</span>
              </div>

              <div
                className={`posFields ${
                  showRP ? "posFields--wr" : position === "QB" ? "posFields--qb" : "posFields--std"
                }`}
              >
                {showRP && (
                  <input
                    className="input rpInput"
                    value={r.player.posMeta?.RP ?? ""}
                    onChange={(e) =>
                      onUpdatePlayer(r.player.id, {
                        posMeta: { ...(r.player.posMeta ?? {}), RP: e.target.value },
                      })
                    }
                    placeholder="RP"
                  />
                )}

                {showZAP && (
                  <input
                    className="input zapInput"
                    value={r.player.posMeta?.ZAP ?? ""}
                    onChange={(e) =>
                      onUpdatePlayer(r.player.id, {
                        posMeta: { ...(r.player.posMeta ?? {}), ZAP: e.target.value },
                      })
                    }
                    placeholder="ZAP"
                  />
                )}

                <input
                  className="input categoryInput"
                  value={r.player.posMeta?.Category ?? ""}
                  onChange={(e) =>
                    onUpdatePlayer(r.player.id, {
                      posMeta: { ...(r.player.posMeta ?? {}), Category: e.target.value },
                    })
                  }
                  placeholder="Category"
                />
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="muted" style={{ padding: 10 }}>
            No {position} players yet.
          </div>
        )}
      </div>
    </div>
  );
}