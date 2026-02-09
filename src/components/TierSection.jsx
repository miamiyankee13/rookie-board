import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlayerRow } from "./PlayerRow";

export function TierSection({
  tier,
  playersById,
  getOverallRank,
  onUpdateTier,
  onDeleteTier,
  onAddPlayerToTier,
  onUpdatePlayer,
  onDeletePlayer,
  onOpenNotes,
}) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: tier.id });

  return (
    <div
      className="card"
      ref={setDropRef}
      style={{
        outline: isOver ? "2px solid rgba(122,162,255,0.35)" : "none",
        outlineOffset: "2px",
      }}
    >
      <div className="tierHeader">
        <div className="tierTitleWrap" style={{ flex: 1 }}>
          <input
            className="input"
            style={{ maxWidth: 220, fontWeight: 700 }}
            value={tier.title}
            onChange={(e) => onUpdateTier(tier.id, { title: e.target.value })}
          />
          <input
            className="input tierNoteInput"
            placeholder="Tier note (optional)"
            value={tier.note ?? ""}
            onChange={(e) => onUpdateTier(tier.id, { note: e.target.value })}
          />
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => onAddPlayerToTier(tier.id)}>
            + Player
          </button>
          <button
            className="btn danger"
            onClick={() => onDeleteTier(tier.id)}
            title="Delete tier"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="tierBody">
        <SortableContext items={tier.playerIds} strategy={verticalListSortingStrategy}>
          {tier.playerIds.map((pid) => {
            const p = playersById[pid];
            if (!p) return null;
            return (
              <PlayerRow
                key={pid}
                id={pid}
                player={p}
                overallRank={getOverallRank(pid)}
                onUpdatePlayer={onUpdatePlayer}
                onDeletePlayer={onDeletePlayer}
                onOpenNotes={onOpenNotes}
              />
            );
          })}
        </SortableContext>

        {tier.playerIds.length === 0 && (
          <div className="muted" style={{ padding: "10px 12px" }}>
            Empty tier — add a player.
          </div>
        )}
      </div>
    </div>
  );
}