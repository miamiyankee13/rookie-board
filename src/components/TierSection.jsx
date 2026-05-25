import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlayerRow } from "./PlayerRow";

export function TierSection({
  tier,
  tierIndex,
  onAddTier,
  playersById,
  getOverallRank,
  getPosRank,
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
      className="tier-panel"
      ref={setDropRef}
      data-droppable={isOver ? "true" : undefined}
    >
      <div className="tier-head">
        <div className="tier-tag">
          <span className="tier-stamp">T{String(tierIndex + 1).padStart(2, "0")}</span>
          <input
            className="tier-title-input"
            value={tier.title}
            onChange={(e) => onUpdateTier(tier.id, { title: e.target.value })}
            placeholder="Tier title"
            aria-label="Tier title"
          />
        </div>
        <input
          className="tier-note-input"
          placeholder="// tier note…"
          value={tier.note ?? ""}
          onChange={(e) => onUpdateTier(tier.id, { note: e.target.value })}
          aria-label="Tier note"
        />
        <div className="tier-actions">
          <span className="tier-meta">
            {tier.playerIds.length} {tier.playerIds.length === 1 ? "PROSPECT" : "PROSPECTS"}
          </span>
          {tierIndex === 0 ? (
            <button className="btn" onClick={onAddTier} title="Add a tier">
              ＋ Tier
            </button>
          ) : (
            <button
              className="btn danger"
              onClick={() => onDeleteTier(tier.id)}
              title="Delete tier"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="bb-head" aria-hidden>
        <div className="bb-grip" />
        <div className="bb-rank num">RNK</div>
        <div className="bb-pos">POS</div>
        <div className="bb-name">PLAYER</div>
        <div className="bb-actions">ACT</div>
      </div>

      <div className="tier-body">
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
                posRank={getPosRank ? getPosRank(pid) : null}
                onUpdatePlayer={onUpdatePlayer}
                onDeletePlayer={onDeletePlayer}
                onOpenNotes={onOpenNotes}
              />
            );
          })}
        </SortableContext>

        {tier.playerIds.length === 0 && (
          <div className="tier-empty">// EMPTY TIER</div>
        )}
      </div>

      <button
        className="add-player"
        onClick={() => onAddPlayerToTier(tier.id)}
        title="Add a player to this tier"
      >
        ＋ Add Prospect to {(tier.title || "Tier").toUpperCase()}
      </button>
    </div>
  );
}
