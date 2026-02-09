import { nanoid } from "nanoid";
import { defaultTierTitle } from "./schema";

export function makeSampleBoard() {
  const mkPlayer = (name, pos) => {
    const id = nanoid();
    return {
      id,
      name,
      pos,
      notes: "",
      tags: [],
      posMeta: { ZAP: "", Category: "", RP: "" }
    };
  };

  const p1 = mkPlayer("Jeremiah Love", "RB");
  const p2 = mkPlayer("Fernando Mendoza", "QB");
  const p3 = mkPlayer("Makai Lemon", "WR");
  const p4 = mkPlayer("Carnell Tate", "WR");

  const t1 = { id: nanoid(), title: defaultTierTitle(0), note: "", playerIds: [p1.id, p2.id, p3.id, p4.id] };
  const t2 = { id: nanoid(), title: defaultTierTitle(1), note: "", playerIds: [] };

  const players = {
    [p1.id]: p1,
    [p2.id]: p2,
    [p3.id]: p3,
    [p4.id]: p4,
  };

  return {
    version: 1,
    boardId: nanoid(),
    yearLabel: "2026 Rookie Class",
    updatedAt: Date.now(),
    tiers: [t1, t2],
    players,
  };
}