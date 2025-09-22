// src/components/PlayerDot.jsx
import React, { useState } from 'react';
import { tierFromOverall } from '../data/tiers.js';
import { getPlayerImage } from '../data/playerImages.js';

export default function PlayerDot({ player, onClick, disabled, rank }) {
  const [hover, setHover] = useState(false);
  const tier = tierFromOverall(player.overall);
  const teamClass = player.team ? `${player.team}-bg` : 'freeagent-bg';
  const img = getPlayerImage(player, { warn: true });

  return (
    <div className="relative">
      <div className={`player-ring ${teamClass}`}>
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={onClick}
          disabled={disabled}
          aria-label={`${player.name}, ${player.position || ''} overall ${player.overall}`}
          title={`${player.name} • ${player.position || '—'} • OVR ${player.overall}`}
          className={`player-dot glow glow-${tier.key} ${disabled ? 'disabled' : 'cursor-pointer'} overflow-hidden`}
          style={{ outline: 'none' }}
        >
          {img ? (
            <img
              src={img}
              alt={player.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-lg md:text-2xl font-bold leading-none text-center">
              {player.initials}
            </span>
          )}
          {/* subtle gradient for readability if images are bright */}
          {img && (
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
          )}
        </button>
      </div>

      {hover && (
        <div className="tooltip left-1/2 top-0">
          <div className="font-semibold">{player.name}</div>
          <div className="opacity-80 text-xs">
            {player.position} • Overall {player.overall} • {tier.label}
          </div>
        </div>
      )}

      {player.taken && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] md:text-xs uppercase tracking-wider opacity-70">
          Taken
        </div>
      )}
      <div className="absolute -top-3 -right-3 text-[10px] md:text-xs opacity-60">#{rank}</div>
    </div>
  );
}
