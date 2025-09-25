// src/App.jsx
import React, { useMemo, useState } from 'react';
import DraftBoard from './components/DraftBoard.jsx';
import SidePanel from './components/SidePanel.jsx';
import Modal from './components/Modal.jsx';
import { generatePlayers } from './data/generatePlayers.js';
import { ALL_PLAYERS } from './data/players.js';
import { TEAM_NAME, TEAM_ABBR, randomFranchise } from './data/teams.js';

export default function App() {
  const [players, setPlayers] = useState(() => generatePlayers(36));
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [activeTeam, setActiveTeam] = useState(2);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [boardVersion, setBoardVersion] = useState(0);

  // Random franchises + rookies (auto slot #13)
  const [franchise1, setFranchise1] = useState(() => randomFranchise());
  const [franchise2, setFranchise2] = useState(() => randomFranchise([franchise1]));

  // Choose the auto-designated rookie if present; otherwise highest-OVR rookie
  const rookieFor = (slug) => {
    const rookies = ALL_PLAYERS.filter(p => p.team === slug && p.rookie);
    if (rookies.length === 0) return null;
    const primary = rookies.find(p => p.rookieAuto);
    if (primary) return primary;
    return rookies.slice().sort((a, b) => b.overall - a.overall)[0] || null;
  };

  const rookie1 = rookieFor(franchise1) || null;
  const rookie2 = rookieFor(franchise2) || null;

  const sortedPlayers = useMemo(() => {
    const arr = [...players];
    arr.sort((a, b) => b.overall - a.overall);
    return arr;
  }, [players]);

  // 12 draftable picks per team since pick #13 is the rookie
  const picksRemaining = 12 - (activeTeam === 1 ? team1.length : team2.length);
  const canPick = (p) => !p.taken && picksRemaining > 0;

  const takePlayer = (id) => {
    const idx = players.findIndex((p) => p.id === id);
    if (idx < 0 || players[idx].taken) return;
    const updated = players.map((p) => (p.id === id ? { ...p, taken: true } : p));
    const picked = { ...updated[idx] };
    setPlayers(updated);
    if (activeTeam === 1) {
      setTeam1((t) => [...t, picked]);
      setActiveTeam(2);
    } else {
      setTeam2((t) => [...t, picked]);
      setActiveTeam(1);
    }
  };

  const undo = () => {
    const lastTeam = team1.length === team2.length ? null : team1.length > team2.length ? 1 : 2;
    let playerToRevert = null;

    if (lastTeam === 1 || (lastTeam === null && team2.length > 0)) {
      playerToRevert = team1[team1.length - 1];
      setTeam1((t) => t.slice(0, -1));
      setActiveTeam(1);
    } else if (team2.length > 0) {
      playerToRevert = team2[team2.length - 1];
      setTeam2((t) => t.slice(0, -1));
      setActiveTeam(2);
    }

    if (playerToRevert) {
      setPlayers((ps) => ps.map((p) => (p.id === playerToRevert.id ? { ...p, taken: false } : p)));
    }
  };

  const resetBoard = () => {
    // New random franchises each time, ensure they differ
    const f1 = randomFranchise();
    const f2 = randomFranchise([f1]);
    setFranchise1(f1);
    setFranchise2(f2);

    setPlayers(generatePlayers(36)); // rookies with rookieAuto are excluded in generator
    setTeam1([]);
    setTeam2([]);
    setActiveTeam(2);
    setBoardVersion((v) => v + 1); // retrigger fly-in animation
  };

  const activeLabel =
    activeTeam === 1 ? TEAM_NAME[franchise1] : TEAM_NAME[franchise2];

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="pt-5 md:pt-10 text-center select-none">
        {/* Titles */}
        <h1 className="hidden md:block text-4xl md:text-6xl font-title title-emboss">2K26 DRAFT</h1>
        <h1 className="md:hidden text-3xl font-title title-emboss">2K26 DRAFT</h1>

        {/* Directional arrow toward active team, and show franchise label */}
        <p className="text-lg md:text-3xl mt-1 md:mt-2 opacity-90 flex items-center justify-center gap-2">
          {activeTeam === 1 && <span className="arrow" aria-hidden>←</span>}
          <span>
            <span className="md:hidden">
              {TEAM_ABBR[activeTeam === 1 ? franchise1 : franchise2]}
            </span>
            <span className="hidden md:inline">{activeLabel}</span> Picks
          </span>
          {activeTeam === 2 && <span className="arrow" aria-hidden>→</span>}
        </p>
      </header>

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-3 md:gap-8 px-3 md:px-6 py-4 md:py-10">
        {/* Left panel */}
        <SidePanel
          franchise={franchise1}
          titleDesktop={TEAM_NAME[franchise1]}
          titleMobile={TEAM_ABBR[franchise1]}
          team={team1}
          rookie={rookie1}
          isActive={activeTeam === 1} 
        />

        {/* Center Board + controls */}
        <div className="relative">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-center mb-3 md:mb-6">
            <button
              onClick={() => setActiveTeam(1)}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                activeTeam === 1 ? 'bg-white text-black' : 'bg-black text-white'
              } border-white/20`}
            >
              {TEAM_ABBR[franchise1]}
            </button>
            <button
              onClick={() => setActiveTeam(2)}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                activeTeam === 2 ? 'bg-white text-black' : 'bg-black text-white'
              } border-white/20`}
            >
              {TEAM_ABBR[franchise2]}
            </button>
            <button onClick={undo} className="px-3 py-1.5 rounded-md text-sm border border-white/20">
              Undo
            </button>
            <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-md text-sm border border-white/20">
              New Board
            </button>
          </div>

          {/* Re-mount on version change to trigger fly-in animation */}
          <DraftBoard
            key={boardVersion}
            version={boardVersion}
            players={sortedPlayers}
            onPick={takePlayer}
            canPick={canPick}
          />
        </div>

        {/* Right panel */}
        <SidePanel
          franchise={franchise2}
          titleDesktop={TEAM_NAME[franchise2]}
          titleMobile={TEAM_ABBR[franchise2]}
          team={team2}
          rookie={rookie2}
          isActive={activeTeam === 2} 
        />
      </main>

      {/* Confirm modal */}
      <Modal open={confirmOpen} title="Start a new board?" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm opacity-90">
          This will clear current picks and generate a new random board and teams.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded-md border border-white/15"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-white text-black"
            onClick={() => {
              setConfirmOpen(false);
              resetBoard();
            }}
          >
            Yes, New Board
          </button>
        </div>
      </Modal>
    </div>
  );
}
