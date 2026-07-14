// src/App.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DraftBoard from './components/DraftBoard.jsx';
import SidePanel from './components/SidePanel.jsx';
import Modal from './components/Modal.jsx';
import { generatePlayers, playerHistoryKey } from './data/generatePlayers.js';
import { ALL_PLAYERS } from './data/players.js';
import { TEAM_NAME, TEAM_ABBR, FRANCHISE_SLUGS } from './data/teams.js';

const BOARD_SIZE = 36;
const DRAFT_PICKS_PER_TEAM = 12;
const PLAYER_COOLDOWN_BOARDS = 3;
const BOARD_STORAGE_KEY = '2k26-draft-board-state-v2';
const BACKLOG_STORAGE_KEY = '2k26-draft-backlog-v1';
const OLD_TEAM_STORAGE_KEY = '2k26-draft-saved-franchises';

function randomStartingTeam() {
  return Math.random() < 0.5 ? 1 : 2;
}

function randomItem(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function createEmptyBacklog() {
  return {
    playerCooldowns: {},
    usedFranchises: [],
  };
}

function normalizeBacklog(value) {
  const validFranchises = new Set(FRANCHISE_SLUGS);
  const usedFranchises = Array.isArray(value?.usedFranchises)
    ? [...new Set(value.usedFranchises.filter((slug) => validFranchises.has(slug)))]
    : [];

  const playerCooldowns = Object.fromEntries(
    Object.entries(value?.playerCooldowns ?? {})
      .map(([key, boardsLeft]) => [key, Math.floor(Number(boardsLeft))])
      .filter(([, boardsLeft]) => boardsLeft >= 1 && boardsLeft <= PLAYER_COOLDOWN_BOARDS)
  );

  return { playerCooldowns, usedFranchises };
}

function isValidMatchup(matchup) {
  return !!(
    matchup?.franchise1 &&
    matchup?.franchise2 &&
    matchup.franchise1 !== matchup.franchise2 &&
    FRANCHISE_SLUGS.includes(matchup.franchise1) &&
    FRANCHISE_SLUGS.includes(matchup.franchise2)
  );
}

function addMatchupToRotation(backlog, matchup) {
  if (!isValidMatchup(matchup)) return normalizeBacklog(backlog);

  const normalized = normalizeBacklog(backlog);
  return {
    ...normalized,
    usedFranchises: [
      ...new Set([
        ...normalized.usedFranchises,
        matchup.franchise1,
        matchup.franchise2,
      ]),
    ],
  };
}

function makeRotatingMatchup(backlog) {
  const normalized = normalizeBacklog(backlog);
  const used = new Set(normalized.usedFranchises);
  let available = FRANCHISE_SLUGS.filter((slug) => !used.has(slug));
  let cycleBase = normalized.usedFranchises;

  // A normal cycle removes two teams at a time. This fallback also protects
  // older or manually edited saved data that leaves fewer than two available.
  if (available.length < 2) {
    cycleBase = [];
    available = [...FRANCHISE_SLUGS];
  }

  const franchise1 = randomItem(available);
  const franchise2 = randomItem(available.filter((slug) => slug !== franchise1));
  const matchup = { franchise1, franchise2 };

  return {
    matchup,
    backlog: {
      ...normalized,
      usedFranchises: [...new Set([...cycleBase, franchise1, franchise2])],
    },
  };
}

function advancePlayerBacklog(backlog, draftedPlayers) {
  const normalized = normalizeBacklog(backlog);
  const playerCooldowns = {};

  Object.entries(normalized.playerCooldowns).forEach(([key, boardsLeft]) => {
    if (boardsLeft > 1) playerCooldowns[key] = boardsLeft - 1;
  });

  draftedPlayers.forEach((player) => {
    playerCooldowns[playerHistoryKey(player)] = PLAYER_COOLDOWN_BOARDS;
  });

  return {
    ...normalized,
    playerCooldowns,
  };
}

function readSavedMatchup() {
  try {
    const raw = localStorage.getItem(OLD_TEAM_STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!isValidMatchup(saved)) return null;

    return {
      franchise1: saved.franchise1,
      franchise2: saved.franchise2,
    };
  } catch {
    return null;
  }
}

function readSavedBacklog() {
  try {
    const raw = localStorage.getItem(BACKLOG_STORAGE_KEY);
    return raw ? normalizeBacklog(JSON.parse(raw)) : createEmptyBacklog();
  } catch {
    return createEmptyBacklog();
  }
}

function makeFreshBoardState({ backlog = createEmptyBacklog(), matchup = null } = {}) {
  const normalizedBacklog = normalizeBacklog(backlog);
  const rotation = isValidMatchup(matchup)
    ? {
        matchup,
        backlog: addMatchupToRotation(normalizedBacklog, matchup),
      }
    : makeRotatingMatchup(normalizedBacklog);

  return {
    players: generatePlayers(BOARD_SIZE, {
      playerCooldowns: rotation.backlog.playerCooldowns,
    }),
    team1: [],
    team2: [],
    draftHistory: [],
    activeTeam: randomStartingTeam(),
    matchup: rotation.matchup,
    backlog: rotation.backlog,
    boardVersion: Date.now(),
  };
}

function readSavedBoardState(fallbackBacklog) {
  try {
    const raw = localStorage.getItem(BOARD_STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!isValidMatchup(saved?.matchup)) return null;
    if (!Array.isArray(saved.players) || saved.players.length === 0) return null;

    const savedBacklog = normalizeBacklog(saved.backlog ?? fallbackBacklog);

    return {
      players: saved.players,
      team1: Array.isArray(saved.team1) ? saved.team1 : [],
      team2: Array.isArray(saved.team2) ? saved.team2 : [],
      draftHistory: Array.isArray(saved.draftHistory) ? saved.draftHistory : [],
      activeTeam: saved.activeTeam === 2 ? 2 : 1,
      matchup: saved.matchup,
      backlog: addMatchupToRotation(savedBacklog, saved.matchup),
      boardVersion: Number(saved.boardVersion) || 0,
    };
  } catch {
    return null;
  }
}

function saveBoardState(boardState) {
  try {
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardState));
    localStorage.setItem(BACKLOG_STORAGE_KEY, JSON.stringify(boardState.backlog));
    localStorage.setItem(OLD_TEAM_STORAGE_KEY, JSON.stringify(boardState.matchup));
  } catch {
    // localStorage can fail in private windows or restricted browsers.
  }
}

function clearAllSavedState() {
  try {
    localStorage.removeItem(BOARD_STORAGE_KEY);
    localStorage.removeItem(BACKLOG_STORAGE_KEY);
    localStorage.removeItem(OLD_TEAM_STORAGE_KEY);
  } catch {
    // localStorage can fail in private windows or restricted browsers.
  }
}

function rookieFor(franchise) {
  const rookies = ALL_PLAYERS.filter((player) => player.team === franchise && player.rookie);
  return (
    rookies.find((player) => player.rookieAuto) ??
    rookies.slice().sort((a, b) => b.overall - a.overall)[0] ??
    null
  );
}

export default function App() {
  const [initialBoard] = useState(() => {
    const savedBacklog = readSavedBacklog();
    return (
      readSavedBoardState(savedBacklog) ??
      makeFreshBoardState({
        backlog: savedBacklog,
        matchup: readSavedMatchup(),
      })
    );
  });

  const [players, setPlayers] = useState(initialBoard.players);
  const [team1, setTeam1] = useState(initialBoard.team1);
  const [team2, setTeam2] = useState(initialBoard.team2);
  const [draftHistory, setDraftHistory] = useState(initialBoard.draftHistory);
  const [activeTeam, setActiveTeam] = useState(initialBoard.activeTeam);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);
  const [boardVersion, setBoardVersion] = useState(initialBoard.boardVersion);
  const [matchup, setMatchup] = useState(initialBoard.matchup);
  const [backlog, setBacklog] = useState(initialBoard.backlog);

  const { franchise1, franchise2 } = matchup;

  useEffect(() => {
    saveBoardState({
      players,
      team1,
      team2,
      draftHistory,
      activeTeam,
      matchup,
      backlog,
      boardVersion,
    });
  }, [players, team1, team2, draftHistory, activeTeam, matchup, backlog, boardVersion]);

  const rookie1 = rookieFor(franchise1);
  const rookie2 = rookieFor(franchise2);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.overall - a.overall),
    [players]
  );

  const activeRoster = activeTeam === 1 ? team1 : team2;
  const picksRemaining = DRAFT_PICKS_PER_TEAM - activeRoster.length;
  const activeFranchise = activeTeam === 1 ? franchise1 : franchise2;

  const canPick = (player) => !player.taken && picksRemaining > 0;

  const applyBoardState = (nextState) => {
    saveBoardState(nextState);
    setMatchup(nextState.matchup);
    setPlayers(nextState.players);
    setTeam1(nextState.team1);
    setTeam2(nextState.team2);
    setDraftHistory(nextState.draftHistory);
    setActiveTeam(nextState.activeTeam);
    setBacklog(nextState.backlog);
    setBoardVersion(nextState.boardVersion);
  };

  const takePlayer = (id) => {
    const player = players.find((candidate) => candidate.id === id);
    if (!player || player.taken || picksRemaining <= 0) return;

    const drafted = { ...player, taken: true };

    setPlayers((current) =>
      current.map((candidate) => (candidate.id === id ? drafted : candidate))
    );

    if (activeTeam === 1) setTeam1((current) => [...current, drafted]);
    else setTeam2((current) => [...current, drafted]);

    setDraftHistory((current) => [...current, { id, team: activeTeam }]);
    setActiveTeam(activeTeam === 1 ? 2 : 1);
  };

  const undo = () => {
    const last = draftHistory.at(-1);
    if (!last) return;

    setDraftHistory((current) => current.slice(0, -1));

    if (last.team === 1) {
      setTeam1((current) => current.filter((player) => player.id !== last.id));
    } else {
      setTeam2((current) => current.filter((player) => player.id !== last.id));
    }

    setPlayers((current) =>
      current.map((player) =>
        player.id === last.id ? { ...player, taken: false } : player
      )
    );

    setActiveTeam(last.team);
  };

  const resetBoard = () => {
    const draftedPlayers = [...team1, ...team2];
    const advancedBacklog = advancePlayerBacklog(backlog, draftedPlayers);
    const nextState = makeFreshBoardState({ backlog: advancedBacklog });
    applyBoardState(nextState);
  };

  const wipeSavedData = () => {
    clearAllSavedState();
    const nextState = makeFreshBoardState({ backlog: createEmptyBacklog() });
    applyBoardState(nextState);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f4ecdc] text-black">
      <main className="h-full max-w-[1520px] mx-auto grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)_250px] gap-3 md:gap-5 px-3 md:px-5 py-3 md:py-4 items-start">
        <SidePanel
          side="left"
          ownerLabel="Izzy's Team"
          franchise={franchise1}
          team={team1}
          rookie={rookie1}
          isActive={activeTeam === 1}
        />

        <section className="min-w-0 flex flex-col items-center">
          <div className="mb-2 md:mb-3 text-center select-none">
            <p className="text-lg md:text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
              {activeTeam === 1 && <span className="arrow" aria-hidden>←</span>}
              <span>
                <span className="md:hidden">{TEAM_ABBR[activeFranchise]}</span>
                <span className="hidden md:inline">{TEAM_NAME[activeFranchise]}</span>
                {' '}Picks
              </span>
              {activeTeam === 2 && <span className="arrow" aria-hidden>→</span>}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-2 md:mb-3">
            {[
              { team: 1, franchise: franchise1 },
              { team: 2, franchise: franchise2 },
            ].map(({ team, franchise }) => (
              <button
                type="button"
                key={team}
                onClick={() => setActiveTeam(team)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                  activeTeam === team
                    ? 'bg-[#e1c67d] text-black border-black/25'
                    : 'bg-[#efe4cb] text-black border-black/20'
                }`}
              >
                {TEAM_ABBR[franchise]}
              </button>
            ))}

            <button
              type="button"
              onClick={undo}
              disabled={!draftHistory.length}
              className="px-3 py-1.5 rounded-md text-sm border border-black/20 bg-[#efe4cb] text-black disabled:opacity-40"
            >
              Undo
            </button>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="px-3 py-1.5 rounded-md text-sm border border-black/20 bg-[#efe4cb] text-black"
            >
              New Board
            </button>

            <button
              type="button"
              onClick={() => setWipeConfirmOpen(true)}
              title="Clear the current board, player cooldowns, and used-team rotation"
              className="px-2 py-1 rounded-md text-xs border border-black/20 bg-[#efe4cb] text-black opacity-75 hover:opacity-100"
            >
              Reset Saved Data
            </button>
          </div>

          <DraftBoard
            key={boardVersion}
            players={sortedPlayers}
            onPick={takePlayer}
            canPick={canPick}
          />
        </section>

        <SidePanel
          side="right"
          ownerLabel="Jay's Team"
          franchise={franchise2}
          team={team2}
          rookie={rookie2}
          isActive={activeTeam === 2}
        />
      </main>

      <Modal
        open={confirmOpen}
        title="Start a new board?"
        onClose={() => setConfirmOpen(false)}
      >
        <p className="text-sm opacity-90">
          This will save the drafted players to the three-board odds backlog,
          clear the current picks, and assign two unused franchises.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-black/20 bg-[#efe4cb]"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-black/20 bg-[#e1c67d] text-black"
            onClick={() => {
              setConfirmOpen(false);
              resetBoard();
            }}
          >
            Yes, New Board
          </button>
        </div>
      </Modal>

      <Modal
        open={wipeConfirmOpen}
        title="Reset all saved draft data?"
        onClose={() => setWipeConfirmOpen(false)}
      >
        <p className="text-sm opacity-90">
          This clears the current draft, all player odds cooldowns, and the
          entire used-franchise rotation. A completely fresh board will start.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-black/20 bg-[#efe4cb]"
            onClick={() => setWipeConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md border border-black/20 bg-[#e1c67d] text-black"
            onClick={() => {
              setWipeConfirmOpen(false);
              wipeSavedData();
            }}
          >
            Reset Everything
          </button>
        </div>
      </Modal>
    </div>
  );
}
