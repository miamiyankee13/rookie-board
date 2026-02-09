const KEY = "rookie_board_v1";

export function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveBoard(board) {
  try {
    localStorage.setItem(KEY, JSON.stringify(board));
  } catch {
    // ignore
  }
}