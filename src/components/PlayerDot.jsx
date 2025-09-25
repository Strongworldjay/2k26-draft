// src/components/PlayerDot.jsx
import React, { useState } from "react";
import { tierFromOverall } from "../data/tiers.js";
import { getPlayerImage } from "../data/playerImages.js";

export default function PlayerDot({ player, onClick, disabled }) {
  const [hover, setHover] = useState(false);
  const tier = tierFromOverall(player.overall); // common | uncommon | rare | very-rare | legendary | superstar
  const teamClass = player.team ? `${player.team}-bg` : "freeagent-bg";
  const img = getPlayerImage(player, { warn: true });

  return (
    <div className="relative">
      {/* OUTER: rarity-colored ring + glow */}
      <div className={`rarity-ring ring-${tier.key} glow-${tier.key}`}>
        {/* INNER: team-colored background (no gap) */}
        <div className={`player-core ${teamClass}`}>
          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            disabled={disabled}
            aria-label={`${player.name}, ${player.position || ""} overall ${player.overall}`}
            title={`${player.name} • ${player.position || "—"} • OVR ${player.overall}`}
            className={`player-dot ${
              disabled ? "disabled" : "cursor-pointer"
            }`}
            style={{ outline: "none" }}
          >
            {img ? (
              <img
                src={img}
                alt={player.name}
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            ) : (
              <span className="text-base md:text-xl font-bold leading-none text-center">
                {player.initials}
              </span>
            )}

            {/* subtle gradient for readability if images are bright */}
            {img && (
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
            )}
          </button>
        </div>
      </div>

      {hover && (
        <div className="tooltip left-1/2 top-0">
          <div className="font-semibold">{player.name}</div>
          <div className="opacity-80 text-xs">
            {player.position} • Overall {player.overall} • {tier.label}
          </div>
        </div>
      )}
    </div>
  );
}
