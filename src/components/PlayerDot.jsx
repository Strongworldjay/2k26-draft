// src/components/PlayerDot.jsx
import React, { useState } from "react";
import { tierFromOverall } from "../data/tiers.js";
import { getPlayerImage } from "../data/playerImages.js";
import { TEAM_ABBR } from "../data/teams.js";

export default function PlayerDot({ player, onClick, disabled }) {
  const [hover, setHover] = useState(false);
  const tier = tierFromOverall(player.overall); // common | uncommon | rare | very-rare | legendary | superstar
  const teamClass = player.team ? `${player.team}-bg` : "freeagent-bg";
  const img = getPlayerImage(player, { warn: true });

  const isTaken = !!player.taken; // only use taken (not disabled) to gray ring & kill glow

  return (
    <div className="relative">
      {/* OUTER: rarity-colored ring + glow (turn gray & no-glow when taken) */}
      <div className={`rarity-ring ring-${tier.key} ${isTaken ? 'taken' : `glow-${tier.key}`}`}>
        {/* INNER: team-colored background (no gap) */}
        <div className={`player-core ${teamClass}`}>
          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            disabled={disabled}
            aria-label={`${player.name}, ${player.position || ""} ${player.overall}`}
            title={`${player.name} • ${player.position || "—"} • ${player.overall} • ${TEAM_ABBR[player.team] || ""}`}
            className={`player-dot ${disabled ? "disabled" : "cursor-pointer"}`}
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
            {player.overall} • {player.position} • {TEAM_ABBR[player.team] || ""}
          </div>
        </div>
      )}
    </div>
  );
}
