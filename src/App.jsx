import React, { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { loadBoard, saveBoard } from "./lib/storage";
import { copyText } from "./lib/clip";
import { makeSampleBoard } from "./data/sampleBoard";
import { defaultTierTitle } from "./data/schema";

import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { BoardView } from "./components/BoardView";
import { PositionView } from "./components/PositionView";
import { Drawer } from "./components/Drawer";
import { Modal } from "./components/Modal";
import { Toast } from "./components/Toast";

const TAB_BIG = "Big Board";
const TAB_QB = "QB";
const TAB_RB = "RB";
const TAB_WR = "WR";
const TAB_TE = "TE";
const ACTIVE_TAB_KEY = "rookie_active_tab";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("rookie_theme") || "dark");
  const tabs = useMemo(() => [TAB_BIG, TAB_QB, TAB_RB, TAB_WR, TAB_TE], []);

  const [tab, setTab] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_TAB_KEY);
      if (saved && tabs.includes(saved)) return saved;
    } catch {}
    return TAB_BIG;
  });

  const [toast, setToast] = useState("");

  const [board, setBoard] = useState(() => loadBoard() || makeSampleBoard());

  // Notes drawer
  const [notesOpen, setNotesOpen] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState(null);

  // Paste modal
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
    localStorage.setItem("rookie_theme", theme);
  }, [theme]);

  useEffect(() => {
    saveBoard(board);
  }, [board]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, tab);
    } catch {}
  }, [tab]);

  const updateBoard = (next) => setBoard(next);

  const updateTier = (tierId, patch) => {
    setBoard((b) => ({
      ...b,
      tiers: b.tiers.map((t) => (t.id === tierId ? { ...t, ...patch } : t)),
      updatedAt: Date.now(),
    }));
  };

  const deleteTier = (tierId) => {
    setBoard((b) => {
      if (b.tiers.length <= 1) {
        setToast("Need at Least One Tier");
        return b;
      }
      // Move players to previous tier (or next if first)
      const idx = b.tiers.findIndex((t) => t.id === tierId);
      if (idx < 0) return b;

      const targetIdx = idx > 0 ? idx - 1 : 1;
      const tierToDelete = b.tiers[idx];
      const targetTier = b.tiers[targetIdx];

      const newTiers = b.tiers
        .filter((t) => t.id !== tierId)
        .map((t) => ({ ...t, playerIds: [...t.playerIds] }));

      const tgt = newTiers.find((t) => t.id === targetTier.id);
      if (tgt) tgt.playerIds.push(...tierToDelete.playerIds);

      return { ...b, tiers: newTiers, updatedAt: Date.now() };
    });
    setToast("Tier Deleted");
  };

  const addTier = () => {
    setBoard((b) => ({
      ...b,
      tiers: [
        ...b.tiers,
        { id: nanoid(), title: defaultTierTitle(b.tiers.length), note: "", playerIds: [] },
      ],
      updatedAt: Date.now(),
    }));
    setToast("Tier Added");
  };

  const addPlayerToTier = (tierId) => {
    const pid = nanoid();
    const newPlayer = {
      id: pid,
      name: "",
      pos: "WR",
      notes: "",
      tags: [],
      posMeta: { ZAP: "", Category: "", RP: "" },
    };

    setBoard((b) => ({
      ...b,
      players: { ...b.players, [pid]: newPlayer },
      tiers: b.tiers.map((t) =>
        t.id === tierId ? { ...t, playerIds: [...t.playerIds, pid] } : t
      ),
      updatedAt: Date.now(),
    }));
    setToast("Player Added");
  };

  const updatePlayer = (playerId, patch) => {
    setBoard((b) => ({
      ...b,
      players: {
        ...b.players,
        [playerId]: { ...b.players[playerId], ...patch },
      },
      updatedAt: Date.now(),
    }));
  };

  const deletePlayer = (playerId) => {
    setBoard((b) => {
      const newPlayers = { ...b.players };
      delete newPlayers[playerId];

      const newTiers = b.tiers.map((t) => ({
        ...t,
        playerIds: t.playerIds.filter((id) => id !== playerId),
      }));

      return { ...b, players: newPlayers, tiers: newTiers, updatedAt: Date.now() };
    });
    setToast("Player Removed");
  };

  const openNotes = (playerId) => {
    setActivePlayerId(playerId);
    setNotesOpen(true);
  };

  const activePlayer = activePlayerId ? board.players[activePlayerId] : null;

  const doExport = () => {
    const json = JSON.stringify(board, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rookie-board-${board.yearLabel.replace(/\D+/g, "").slice(0, 4) || "class"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToast("Exported JSON");
  };

  const doImportFile = async (file) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || parsed.version !== 1 || !parsed.tiers || !parsed.players) {
        setToast("Invalid JSON");
        return;
      }
      setBoard({ ...parsed, updatedAt: Date.now() });
      setToast("Imported JSON");
    } catch {
      setToast("Import Failed");
    }
  };

  const doCopy = async () => {
    try {
      const ok = await copyText(JSON.stringify(board));
      setToast(ok ? "Copied JSON Board" : "Copy Failed");
    } catch {
      setToast("Copy Failed");
    }
  };

  const doPasteApply = () => {
    try {
      const parsed = JSON.parse(pasteText);
      if (!parsed || parsed.version !== 1 || !parsed.tiers || !parsed.players) {
        setToast("Invalid JSON");
        return;
      }
      setBoard({ ...parsed, updatedAt: Date.now() });
      setPasteOpen(false);
      setPasteText("");
      setToast("Pasted JSON Board");
    } catch {
      setToast("Invalid JSON");
    }
  };

  const resetBoard = () => {
    setBoard(makeSampleBoard());
    setToast("Reset Board");
  };

  return (
    <div className="container">
      <Header
        board={board}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onExport={doExport}
        onImportFile={doImportFile}
        onCopy={doCopy}
        onPasteOpen={() => setPasteOpen(true)}
        onResetBoard={resetBoard}
        activeTab={tab}
      />

    <div className="tabsSticky">
      <div className="card tabsCard">
        <div className="row space">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
      </div>
    </div>

      {tab === TAB_BIG && (
        <BoardView
          board={board}
          onAddTier={addTier}
          onUpdateBoard={updateBoard}
          onUpdateTier={updateTier}
          onDeleteTier={deleteTier}
          onAddPlayerToTier={addPlayerToTier}
          onUpdatePlayer={updatePlayer}
          onDeletePlayer={deletePlayer}
          onOpenNotes={openNotes}
        />
      )}

      {tab === TAB_QB && (
        <PositionView board={board} position="QB" onUpdatePlayer={updatePlayer} onOpenNotes={openNotes} />
      )}
      {tab === TAB_RB && (
        <PositionView board={board} position="RB" onUpdatePlayer={updatePlayer} onOpenNotes={openNotes} />
      )}
      {tab === TAB_WR && (
        <PositionView board={board} position="WR" onUpdatePlayer={updatePlayer} onOpenNotes={openNotes} />
      )}
      {tab === TAB_TE && (
        <PositionView board={board} position="TE" onUpdatePlayer={updatePlayer} onOpenNotes={openNotes} />
      )}

      <Drawer
        open={notesOpen}
        title={activePlayer ? `Notes — ${activePlayer.name || "Unnamed"}` : "Notes"}
        onClose={() => setNotesOpen(false)}
      >
        {activePlayer ? (
          <div style={{ display: "grid", gap: 10 }}>
            <div className="row" style={{ gap: 10 }}>
              <span className={`pill ${activePlayer.pos.toLowerCase()}`}>{activePlayer.pos}</span>
            </div>

            <textarea
              className="textarea"
              value={activePlayer.notes ?? ""}
              onChange={(e) => updatePlayer(activePlayer.id, { notes: e.target.value })}
              placeholder="Enter Notes"
            />

            <div className="row space">
              <button className="btn" onClick={() => setNotesOpen(false)}>Done</button>
            </div>
          </div>
        ) : (
          <div className="muted">No Player Selected</div>
        )}
      </Drawer>

      <Modal open={pasteOpen} title="Paste JSON Board" onClose={() => setPasteOpen(false)}>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="muted">
            Paste a previously copied board (JSON). This will replace your current local board.
          </div>
          <textarea
            className="textarea"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder='{"version":1,...}'
          />
          <div className="row space">
            <button className="btn" onClick={() => setPasteOpen(false)}>Cancel</button>
            <button className="btn primary" onClick={doPasteApply}>Apply</button>
          </div>
        </div>
      </Modal>

      <Toast message={toast} />
    </div>
  );
}