import React, { useState } from 'react'

export default function PlayerDot({ player, onClick, disabled, rank }) {
  const [hover, setHover] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        className={`player-dot ${disabled ? 'disabled' : 'cursor-pointer'}`}
        aria-label={`${player.name} overall ${player.overall}`}
        disabled={disabled}
        title={`${player.name} • OVR ${player.overall}`}
      >
        <span className="text-xl md:text-2xl font-bold">{player.initials}</span>
      </button>

      {hover && (
        <div className="tooltip left-1/2 top-0">
          <div className="font-semibold">{player.name}</div>
          <div className="opacity-80 text-xs">Overall {player.overall}</div>
        </div>
      )}

      {player.taken && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs uppercase tracking-wider opacity-70">
          Taken
        </div>
      )}
      <div className="absolute -top-3 -right-3 text-[10px] md:text-xs opacity-60">#{rank}</div>
    </div>
  )
}
