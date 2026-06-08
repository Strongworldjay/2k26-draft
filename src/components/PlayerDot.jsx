// src/components/PlayerDot.jsx
import React, { useState } from 'react';
import { tierFromOverall } from '../data/tiers.js';
import { getPlayerImage } from '../data/playerImages.js';
import { TEAM_ABBR } from '../data/teams.js';

export default function PlayerDot({ player, onClick, disabled }) {
  const [hover, setHover] = useState(false);
  const tier = tierFromOverall(player.overall);
  const ringKey = player.legend || player.legendInjected ? 'legend' : tier.key;
  const teamClass = player.team ? `${player.team}-bg` : 'freeagent-bg';
  const image = getPlayerImage(player);
  const isTaken = !!player.taken;

  return (
    <div className="relative">
      <div className={`rarity-ring ring-${ringKey} ${isTaken ? 'taken' : `glow-${ringKey}`}`}>
        <div className={`player-core ${teamClass}`}>
          <button
            type="button"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            onClick={onClick}
            disabled={disabled}
            aria-label={`${player.name}, ${player.position || ''}, overall ${player.overall}`}
            className={`player-dot relative ${disabled ? 'disabled' : 'cursor-pointer'}`}
          >
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover rounded-full" draggable={false} />
            ) : (
              <span className="text-base md:text-xl font-bold leading-none text-center">{player.initials}</span>
            )}
            {image && <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/0 via-black/0 to-black/20" />}
          </button>
        </div>
      </div>

      {hover && (
        <div className="tooltip left-1/2 top-0 z-20" role="tooltip">
          <div className="font-semibold">{player.name}</div>
          <div className="opacity-80 text-xs">{player.overall} • {player.position} • {TEAM_ABBR[player.team] || ''}</div>
        </div>
      )}
    </div>
  );
}
