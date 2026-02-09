export const POSITIONS = ["QB", "RB", "WR", "TE"];

export function defaultTierTitle(index) {
  return `Tier ${index + 1}`;
}

/**
 * Board JSON schema (v1)
 * {
 *  version: 1,
 *  boardId: string,
 *  yearLabel: string, // "2026 Rookie Class"
 *  updatedAt: number,
 *  tiers: [
 *    { id, title, note, playerIds: [id, ...] }
 *  ],
 *  players: {
 *    [playerId]: {
 *      id, name, pos, notes,
 *      tags: string[],
 *      posMeta: { ZAP?: string, Category?: string, RP?: string } // RP used for WR only
 *    }
 *  }
 * }
 */