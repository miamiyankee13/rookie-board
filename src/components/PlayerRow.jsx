import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function posClass(pos) {
  return pos?.toLowerCase?.() ?? "qb";
}

export function PlayerRow({
  id,
  player,
  overallRank,
  onUpdatePlayer,
  onDeletePlayer,
  onOpenNotes,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div ref={setNodeRef} className="playerRow" style={style}>
      <div className="dragHandle" {...attributes} {...listeners} title="Drag to reorder">
        ☰
      </div>

      <div className="rank">#{overallRank}</div>

      <span className={`pill ${posClass(player.pos)}`}>{player.pos}</span>

      <input
        className="input nameInput"
        value={player.name}
        onChange={(e) => onUpdatePlayer(id, { name: e.target.value })}
        placeholder="Player"
      />

      <div className="playerRowMeta">
        <select
          className="select"
          value={player.pos}
          onChange={(e) => onUpdatePlayer(id, { pos: e.target.value })}
        >
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
        </select>

        <div className="smallActions">
          <button className="iconBtn" onClick={() => onOpenNotes(id)} title="Notes">📝</button>
          <button className="iconBtn" onClick={() => onDeletePlayer(id)} title="Delete">🗑</button>
        </div>
      </div>
    </div>
  );
}