import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* Drag-handle icon — simple 6-dot grip */
function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <circle cx="3" cy="3" r="1" />
      <circle cx="9" cy="3" r="1" />
      <circle cx="3" cy="6" r="1" />
      <circle cx="9" cy="6" r="1" />
      <circle cx="3" cy="9" r="1" />
      <circle cx="9" cy="9" r="1" />
    </svg>
  );
}

export function PlayerRow({
  id,
  player,
  overallRank,
  posRank,
  onUpdatePlayer,
  onDeletePlayer,
  onOpenNotes,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const pos = player?.pos || "WR";
  const rankLabel =
    typeof overallRank === "number"
      ? `#${String(overallRank).padStart(2, "0")}`
      : `#${overallRank}`;

  return (
    <div
      ref={setNodeRef}
      className="bb-row"
      data-pos={pos}
      data-dragging={isDragging ? "true" : "false"}
      style={style}
    >
      <div className="bb-grip">
        <span className="grip" {...attributes} {...listeners} title="Drag to reorder">
          <GripIcon />
        </span>
      </div>

      <div className="bb-rank">
        <span className="rank">{rankLabel}</span>
      </div>

      <div className="bb-pos">
        <span className="pos-wrap" data-pos={pos}>
          <b>{pos}</b>
          {posRank ? <i>{posRank}</i> : null}
          <select
            value={pos}
            onChange={(e) => onUpdatePlayer(id, { pos: e.target.value })}
            aria-label="Change position"
          >
            <option value="QB">QB</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="TE">TE</option>
          </select>
        </span>
      </div>

      <div className="bb-name">
        <input
          className="input sans name"
          value={player.name}
          onChange={(e) => onUpdatePlayer(id, { name: e.target.value })}
          placeholder="Player name"
          aria-label="Player name"
        />
      </div>

      <div className="bb-actions">
        <button
          className="icon-btn"
          onClick={() => onOpenNotes(id)}
          title="Notes"
          aria-label="Edit notes"
        >
          ✎
        </button>
        <button
          className="icon-btn danger"
          onClick={() => onDeletePlayer(id)}
          title="Remove player"
          aria-label="Remove player"
        >
          ×
        </button>
      </div>
    </div>
  );
}
