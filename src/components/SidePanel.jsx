// src/components/SidePanel.jsx
import React from 'react';
import { TEAM_ABBR, TEAM_NAME } from '../data/teams.js';

function abbr(pick) {
  if (!pick) return '—';
  const parts = pick.name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SidePanel({ franchise, team, rookie, titleDesktop, titleMobile }) {
  const title = titleDesktop ?? TEAM_NAME[franchise] ?? 'Team';
  const short = titleMobile ?? (TEAM_ABBR[franchise] ?? '#');

  // build displayed list: 12 drafted + slot 13 = rookie (if present)
  const slots = Array.from({ length: 13 }).map((_, i) => {
    if (i < 12) return team[i] ?? null;
    return rookie ?? null;
  });

  const draftedPlusRookie = [...team, ...(rookie ? [rookie] : [])];
  const drafted = draftedPlusRookie.filter(Boolean);
  const avgOVR = drafted.length ? (drafted.reduce((s, p) => s + (p.overall || 0), 0) / drafted.length).toFixed(1) : '—';

  return (
    <aside className="rounded-xl p-3 md:p-6 bg-[var(--maroon)]/90 flex flex-col">
      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{short}</h2>
        <span className="text-xs opacity-80">Roster</span>
      </div>

      {/* Desktop */}
      <div className="hidden md:block text-center mb-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm opacity-90">{TEAM_ABBR[franchise] || ''}</p>
      </div>

      {/* Mobile compact 13 slots */}
      <div className="md:hidden grid grid-cols-5 gap-1.5">
        {slots.map((pick, i) => {
          const tag = pick ? (TEAM_ABBR[pick.team] || 'FA') : '—';
          const text = pick ? `${abbr(pick)}·${tag}${pick.rookie ? '·R' : ''}` : '—';
          return (
            <div
              key={i}
              className="h-10 rounded-lg bg-black/20 border border-white/10 grid place-items-center text-[11px] font-semibold"
              title={pick ? `${pick.name} • ${tag} • OVR ${pick.overall}${pick.rookie ? ' • Rookie' : ''}` : 'Empty'}
              aria-label={pick ? `${pick.name} overall ${pick.overall}` : 'Empty slot'}
            >
              {text}
            </div>
          );
        })}
      </div>

      {/* Desktop detailed list */}
      <ol className="hidden md:block space-y-1 text-sm md:text-base mt-1">
        {slots.map((pick, i) => {
          const tag = pick ? (TEAM_ABBR[pick.team] || 'FA') : '';
          return (
            <li key={i} className="flex gap-2">
              <span className="opacity-70 w-6 text-right">{i + 1}.</span>
              <span className="flex-1">
                {pick
                  ? `${pick.name} (${pick.position}) • ${tag} • OVR ${pick.overall}${pick.rookie ? ' • Rookie' : ''}`
                  : 'Player Name'}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Footer: Average overall */}
      <div className="mt-3 md:mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-sm md:text-base">
        <span className="opacity-80">Avg OVR</span>
        <span className="font-semibold">{avgOVR}</span>
      </div>
    </aside>
  );
}
