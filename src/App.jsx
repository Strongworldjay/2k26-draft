// src/App.jsx
import React, { useMemo, useState } from 'react';
import DraftBoard from './components/DraftBoard.jsx';
import SidePanel from './components/SidePanel.jsx';
import Modal from './components/Modal.jsx';
import { generatePlayers } from './data/generatePlayers.js';
import { ALL_PLAYERS } from './data/players.js';
import { TEAM_NAME, TEAM_ABBR, randomFranchise } from './data/teams.js';

const BOARD_SIZE = 36;
const DRAFT_PICKS_PER_TEAM = 12;

function randomStartingTeam() {
  return Math.random() < 0.5 ? 1 : 2;
}

function rookieFor(franchise) {
  const rookies = ALL_PLAYERS.filter((player) => player.team === franchise && player.rookie);
  return rookies.find((player) => player.rookieAuto)
    ?? rookies.slice().sort((a, b) => b.overall - a.overall)[0]
    ?? null;
}

export default function App() {
  const [players, setPlayers] = useState(() => generatePlayers(BOARD_SIZE));
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [draftHistory, setDraftHistory] = useState([]);
  const [activeTeam, setActiveTeam] = useState(() => randomStartingTeam());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [boardVersion, setBoardVersion] = useState(0);
  const [franchise1, setFranchise1] = useState(() => randomFranchise());
  const [franchise2, setFranchise2] = useState(() => randomFranchise([franchise1]));

  const rookie1 = rookieFor(franchise1);
  const rookie2 = rookieFor(franchise2);
  const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.overall - a.overall), [players]);
  const activeRoster = activeTeam === 1 ? team1 : team2;
  const picksRemaining = DRAFT_PICKS_PER_TEAM - activeRoster.length;
  const canPick = (player) => !player.taken && picksRemaining > 0;

  const takePlayer = (id) => {
    const player = players.find((candidate) => candidate.id === id);
    if (!player || player.taken || picksRemaining <= 0) return;

    const drafted = { ...player, taken: true };
    setPlayers((current) => current.map((candidate) => candidate.id === id ? drafted : candidate));
    if (activeTeam === 1) setTeam1((current) => [...current, drafted]);
    else setTeam2((current) => [...current, drafted]);
    setDraftHistory((current) => [...current, { id, team: activeTeam }]);
    setActiveTeam(activeTeam === 1 ? 2 : 1);
  };

  const undo = () => {
    const last = draftHistory.at(-1);
    if (!last) return;

    setDraftHistory((current) => current.slice(0, -1));
    if (last.team === 1) setTeam1((current) => current.filter((player) => player.id !== last.id));
    else setTeam2((current) => current.filter((player) => player.id !== last.id));
    setPlayers((current) => current.map((player) => player.id === last.id ? { ...player, taken: false } : player));
    setActiveTeam(last.team);
  };

  const resetBoard = () => {
    const nextFranchise1 = randomFranchise();
    const nextFranchise2 = randomFranchise([nextFranchise1]);
    setFranchise1(nextFranchise1);
    setFranchise2(nextFranchise2);
    setPlayers(generatePlayers(BOARD_SIZE));
    setTeam1([]);
    setTeam2([]);
    setDraftHistory([]);
    setActiveTeam(randomStartingTeam());
    setBoardVersion((version) => version + 1);
  };

  const activeFranchise = activeTeam === 1 ? franchise1 : franchise2;

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="pt-5 md:pt-10 text-center select-none">
        <h1 className="text-3xl md:text-6xl font-title title-emboss">2K26 DRAFT</h1>
        <p className="text-lg md:text-3xl mt-1 md:mt-2 opacity-90 flex items-center justify-center gap-2">
          {activeTeam === 1 && <span className="arrow" aria-hidden>←</span>}
          <span><span className="md:hidden">{TEAM_ABBR[activeFranchise]}</span><span className="hidden md:inline">{TEAM_NAME[activeFranchise]}</span> Picks</span>
          {activeTeam === 2 && <span className="arrow" aria-hidden>→</span>}
        </p>
      </header>

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-3 md:gap-8 px-3 md:px-6 py-4 md:py-10">
        <SidePanel side="left" ownerLabel="Izzy's Team" franchise={franchise1} team={team1} rookie={rookie1} isActive={activeTeam === 1} />

        <div className="relative">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-3 md:mb-6">
            {[{ team: 1, franchise: franchise1 }, { team: 2, franchise: franchise2 }].map(({ team, franchise }) => (
              <button type="button" key={team} onClick={() => setActiveTeam(team)} className={`px-3 py-1.5 rounded-md text-sm border ${activeTeam === team ? 'bg-white text-black' : 'bg-black text-white'} border-white/20`}>
                {TEAM_ABBR[franchise]}
              </button>
            ))}
            <button type="button" onClick={undo} disabled={!draftHistory.length} className="px-3 py-1.5 rounded-md text-sm border border-white/20 disabled:opacity-40">Undo</button>
            <button type="button" onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-md text-sm border border-white/20">New Board</button>
          </div>

          <DraftBoard key={boardVersion} players={sortedPlayers} onPick={takePlayer} canPick={canPick} />
        </div>

        <SidePanel side="right" ownerLabel="Jay's Team" franchise={franchise2} team={team2} rookie={rookie2} isActive={activeTeam === 2} />
      </main>

      <Modal open={confirmOpen} title="Start a new board?" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm opacity-90">This will clear current picks and generate a new random board and teams.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="px-3 py-1.5 rounded-md border border-white/15" onClick={() => setConfirmOpen(false)}>Cancel</button>
          <button type="button" className="px-3 py-1.5 rounded-md bg-white text-black" onClick={() => { setConfirmOpen(false); resetBoard(); }}>Yes, New Board</button>
        </div>
      </Modal>
    </div>
  );
}
