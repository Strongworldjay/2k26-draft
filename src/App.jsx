import React, { useMemo, useState } from 'react'
import DraftBoard from './components/DraftBoard.jsx'
import SidePanel from './components/SidePanel.jsx'
import { generatePlayers } from './data/generatePlayers.js'

export default function App() {
  const [players, setPlayers] = useState(() => generatePlayers(36))
  const [team1, setTeam1] = useState([])
  const [team2, setTeam2] = useState([])
  const [activeTeam, setActiveTeam] = useState(2) // Team 2 starts (matches mockup arrow)

  const sortedPlayers = useMemo(() => {
    const arr = [...players]
    arr.sort((a, b) => b.overall - a.overall)
    return arr
  }, [players])

  const picksRemaining = 13 - (activeTeam === 1 ? team1.length : team2.length)
  const canPick = (p) => !p.taken && picksRemaining > 0

  const takePlayer = (id) => {
    const pIdx = players.findIndex(p => p.id === id)
    if (pIdx === -1) return
    if (players[pIdx].taken) return

    const updated = players.map(p => p.id === id ? { ...p, taken: true } : p)
    setPlayers(updated)

    if (activeTeam === 1) {
      setTeam1(t => [...t, updated[pIdx]])
      setActiveTeam(2)
    } else {
      setTeam2(t => [...t, updated[pIdx]])
      setActiveTeam(1)
    }
  }

  const undo = () => {
    // Undo last pick from the team that picked most recently
    const lastTeam = team1.length === team2.length ? null : (team1.length > team2.length ? 1 : 2)
    if (lastTeam === null && team1.length === 0 && team2.length === 0) return

    let playerToRevert = null
    if (lastTeam === 1 || (lastTeam === null && team2.length > 0)) {
      playerToRevert = team1[team1.length - 1]
      setTeam1(t => t.slice(0, -1))
      setActiveTeam(1)
    } else {
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
      <header className="pt-6 md:pt-10 text-center select-none">
        <h1 className="text-4xl md:text-6xl font-title title-emboss">2K26 DRAFT</h1>
        <p className="text-xl md:text-3xl mt-2 opacity-90">Team {activeTeam} Picks <span className="inline-block align-middle ml-2">➡</span></p>
      </header>

      <main className="max-w-[1200px] mx-auto grid grid-cols-[260px_1fr_260px] gap-4 md:gap-8 px-3 md:px-6 py-6 md:py-10">
        {/* Team 1 Panel */}
        <SidePanel
          title="Team 1"
          team={team1}
          accent="left"
        />

        {/* Center Board */}
        <div className="relative">
          <div className="absolute -left-4 right-0 -top-10 flex justify-center gap-3">
            <button onClick={() => setActiveTeam(1)} className={`px-3 py-1.5 rounded-md text-sm border ${activeTeam===1?'bg-white text-black':'bg-black text-white'} border-white/20`}>Team 1 to Pick</button>
            <button onClick={() => setActiveTeam(2)} className={`px-3 py-1.5 rounded-md text-sm border ${activeTeam===2?'bg-white text-black':'bg-black text-white'} border-white/20`}>Team 2 to Pick</button>
            <button onClick={undo} className="px-3 py-1.5 rounded-md text-sm border border-white/20">Undo</button>
            <button onClick={resetBoard} className="px-3 py-1.5 rounded-md text-sm border border-white/20">New Board</button>
          </div>

          <DraftBoard
            players={sortedPlayers}
            onPick={takePlayer}
            canPick={canPick}
          />
        </div>

        {/* Team 2 Panel */}
        <SidePanel
          title="Team 2"
          team={team2}
          accent="right"
        />
      </main>
    </div>
  )
}
