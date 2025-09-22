// src/App.jsx
import React, { useMemo, useState } from 'react'
import DraftBoard from './components/DraftBoard.jsx'
import SidePanel from './components/SidePanel.jsx'
import Modal from './components/Modal.jsx'
import { generatePlayers } from './data/generatePlayers.js'

export default function App() {
  const [players, setPlayers] = useState(() => generatePlayers(36))
  const [team1, setTeam1] = useState([])
  const [team2, setTeam2] = useState([])
  const [activeTeam, setActiveTeam] = useState(2)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const sortedPlayers = useMemo(() => {
    const arr = [...players]
    arr.sort((a, b) => b.overall - a.overall)
    return arr
  }, [players])

  const picksRemaining = 13 - (activeTeam === 1 ? team1.length : team2.length)
  const canPick = (p) => !p.taken && picksRemaining > 0

  const takePlayer = (id) => {
    const idx = players.findIndex(p => p.id === id)
    if (idx < 0 || players[idx].taken) return
    const updated = players.map(p => p.id === id ? { ...p, taken: true } : p)
    const picked = { ...updated[idx] }
    setPlayers(updated)
    if (activeTeam === 1) { setTeam1(t => [...t, picked]); setActiveTeam(2) }
    else { setTeam2(t => [...t, picked]); setActiveTeam(1) }
  }

  const undo = () => {
    const lastTeam = team1.length === team2.length ? null : (team1.length > team2.length ? 1 : 2)
    let playerToRevert = null
    if (lastTeam === 1 || (lastTeam === null && team2.length > 0)) {
      playerToRevert = team1[team1.length - 1]
      setTeam1(t => t.slice(0, -1))
      setActiveTeam(1)
    } else if (team2.length > 0) {
      playerToRevert = team2[team2.length - 1]
      setTeam2(t => t.slice(0, -1))
      setActiveTeam(2)
    }
    if (playerToRevert) {
      setPlayers(ps => ps.map(p => p.id === playerToRevert.id ? { ...p, taken: false } : p))
    }
  }

  const resetBoard = () => {
    setPlayers(generatePlayers(36))
    setTeam1([])
    setTeam2([])
    setActiveTeam(2)
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <header className="pt-5 md:pt-10 text-center select-none">
        {/* Desktop title */}
        <h1 className="hidden md:block text-4xl md:text-6xl font-title title-emboss">2K26 DRAFT</h1>
        {/* Mobile title smaller */}
        <h1 className="md:hidden text-3xl font-title title-emboss">2K26 DRAFT</h1>

        <p className="text-lg md:text-3xl mt-1 md:mt-2 opacity-90">
          {/* Show "#1 / #2" on mobile; "Team X" on desktop */}
          <span className="md:hidden">#{activeTeam}</span>
          <span className="hidden md:inline">Team {activeTeam}</span> Picks <span className="inline-block align-middle ml-1">➡</span>
        </p>
      </header>

      <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-3 md:gap-8 px-3 md:px-6 py-4 md:py-10">
        {/* Team 1 Panel */}
        <SidePanel titleDesktop="Team 1" titleMobile="#1" team={team1} side="left" />

        {/* Center Board + controls */}
        <div className="relative">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-center mb-3 md:mb-6">
            <button onClick={() => setActiveTeam(1)} className={`px-3 py-1.5 rounded-md text-sm border ${activeTeam===1?'bg-white text-black':'bg-black text-white'} border-white/20`}>#1</button>
            <button onClick={() => setActiveTeam(2)} className={`px-3 py-1.5 rounded-md text-sm border ${activeTeam===2?'bg-white text-black':'bg-black text-white'} border-white/20`}>#2</button>
            <button onClick={undo} className="px-3 py-1.5 rounded-md text-sm border border-white/20">Undo</button>
            <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-md text-sm border border-white/20">New Board</button>
          </div>

          <DraftBoard players={sortedPlayers} onPick={takePlayer} canPick={canPick} />
        </div>

        {/* Team 2 Panel */}
        <SidePanel titleDesktop="Team 2" titleMobile="#2" team={team2} side="right" />
      </main>

      {/* Confirm modal */}
      <Modal open={confirmOpen} title="Start a new board?" onClose={() => setConfirmOpen(false)}>
        <p className="text-sm opacity-90">
          This will clear current picks and generate a new random board.
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
            onClick={() => { setConfirmOpen(false); resetBoard(); }}
          >
            Yes, New Board
          </button>
        </div>
      </Modal>
    </div>
  )
}
