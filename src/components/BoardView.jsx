import React, { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TierSection } from "./TierSection";

/**
 * Drag/drop logic:
 * - Items are player IDs
 * - We keep tier membership by moving player IDs between tier arrays
 * - Over target can be a player ID (row) OR a tier ID (container)
 */
export function BoardView({
  board,
  onUpdateBoard,
  onUpdateTier,
  onDeleteTier,
  onAddPlayerToTier,
  onUpdatePlayer,
  onDeletePlayer,
  onOpenNotes,
}) {
  const sensors = useSensors(
    // Match your Depth Chart app desktop feel
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Match your Depth Chart app touch feel
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const tiers = board.tiers;
  const playersById = board.players;

  const allPlayerIdsInOrder = tiers.flatMap((t) => t.playerIds);

  const posRankById = useMemo(() => {
    const counters = { QB: 0, RB: 0, WR: 0, TE: 0 };
    const map = {};

    for (const pid of allPlayerIdsInOrder) {
      const p = playersById?.[pid];
      if (!p?.pos) continue;

      // only count the positions we support
      if (!counters.hasOwnProperty(p.pos)) continue;

      counters[p.pos] += 1;
      map[pid] = counters[p.pos];
    }

    return map;
  }, [allPlayerIdsInOrder, playersById]);

  const getPosRank = (playerId) => posRankById[playerId] ?? null;

  const getOverallRank = (playerId) => {
    const idx = allPlayerIdsInOrder.indexOf(playerId);
    return idx >= 0 ? idx + 1 : "—";
  };

  const findTierIdByPlayerId = (playerId) => {
    for (const t of tiers) {
      if (t.playerIds.includes(playerId)) return t.id;
    }
    return null;
  };

  // Rows-first collision:
  // - If we are over a player row, use closestCenter (smooth sortable behavior like depth chart)
  // - Otherwise, allow tier containers to win via pointerWithin (nice full-card highlight)
  const collisionDetectionStrategy = (args) => {
    const centerCollisions = closestCenter(args);
    const centerOverId = getFirstCollision(centerCollisions, "id");

    if (centerOverId != null && playersById?.[centerOverId]) {
      return centerCollisions;
    }

    const pointerCollisions = pointerWithin(args);
    const pointerOverId = getFirstCollision(pointerCollisions, "id");
    if (pointerOverId != null) return pointerCollisions;

    const rectCollisions = rectIntersection(args);
    const rectOverId = getFirstCollision(rectCollisions, "id");
    if (rectOverId != null) return rectCollisions;

    return centerCollisions;
  };

  const movePlayer = (activeId, overId) => {
    const fromTierId = findTierIdByPlayerId(activeId);
    if (!fromTierId) return;

    const isOverPlayer = !!playersById?.[overId];
    const toTierId = isOverPlayer ? findTierIdByPlayerId(overId) : String(overId);
    if (!toTierId) return;

    const newTiers = tiers.map((t) => ({ ...t, playerIds: [...t.playerIds] }));

    const fromTier = newTiers.find((t) => t.id === fromTierId);
    const toTier = newTiers.find((t) => t.id === toTierId);
    if (!fromTier || !toTier) return;

    // Same-tier reorder (buttery, matches depth chart)
    if (fromTierId === toTierId && isOverPlayer) {
      const oldIndex = fromTier.playerIds.indexOf(activeId);
      const newIndex = fromTier.playerIds.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return;

      fromTier.playerIds = arrayMove(fromTier.playerIds, oldIndex, newIndex);
      onUpdateBoard({ ...board, tiers: newTiers, updatedAt: Date.now() });
      return;
    }

    // Cross-tier move (v1 rule: always append to end of target tier)
    const fromIdx = fromTier.playerIds.indexOf(activeId);
    if (fromIdx >= 0) fromTier.playerIds.splice(fromIdx, 1);

    // Always append in target tier for predictability
    toTier.playerIds.push(activeId);

    onUpdateBoard({ ...board, tiers: newTiers, updatedAt: Date.now() });
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over?.id) return;
    if (active.id === over.id) return;
    movePlayer(String(active.id), String(over.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
    >
      <div className="grid">
        {tiers.map((tier) => (
          <TierSection
            key={tier.id}
            tier={tier}
            playersById={playersById}
            getOverallRank={getOverallRank}
            getPosRank={getPosRank}
            onUpdateTier={onUpdateTier}
            onDeleteTier={onDeleteTier}
            onAddPlayerToTier={onAddPlayerToTier}
            onUpdatePlayer={onUpdatePlayer}
            onDeletePlayer={onDeletePlayer}
            onOpenNotes={onOpenNotes}
          />
        ))}
      </div>
    </DndContext>
  );
}