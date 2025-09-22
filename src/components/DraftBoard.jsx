import React from 'react'
import PlayerDot from './PlayerDot.jsx'

export default function DraftBoard({ players, onPick, canPick }) {
  // 6 x 6 grid
  return (
    <div className="grid grid-cols-6 gap-6 md:gap-8 place-items-center mt-10">
      {players.map((p, idx) => (
        <PlayerDot
          key={p.id}
          player={p}
          rank={idx + 1}
          disabled={!canPick(p)}
          onClick={() => canPick(p) && onPick(p.id)}
        />
      ))}
    </div>
  )
}
