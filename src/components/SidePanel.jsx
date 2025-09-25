// src/components/SidePanel.jsx
import React from 'react';
import { TEAM_ABBR, TEAM_NAME, TEAM_COLOR } from '../data/teams.js';

function abbr(pick) {
  if (!pick) return '—';
  const parts = pick.name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function SidePanel({
  franchise,
  team,
  rookie,
  titleDesktop,
  titleMobile,
  isActive = false,
}) {
  const title = titleDesktop ?? TEAM_NAME[franchise] ?? 'Team';
  const short = titleMobile ?? (TEAM_ABBR[franchise] ?? '#');

  const slots = Array.from({ length: 13 }).map((_, i) => (i < 12 ? team[i] ?? null : (rookie ?? null)));

  const draftedPlusRookie = [...team, ...(rookie ? [rookie] : [])].filter(Boolean);
  const avgOVR = draftedPlusRookie.length
    ? (draftedPlusRookie.reduce((s, p) => s + (p.overall || 0), 0) / draftedPlusRookie.length).toFixed(1)
    : '—';

  const panelStyle = isActive ? { '--franchise-color': TEAM_COLOR[franchise] } : undefined;
  const headerStyle = { color: TEAM_COLOR[franchise] }; // <-- color the team name

  return (
    <aside
      className={`panel rounded-xl p-3 md:p-6 bg-[var(--maroon)]/90 flex flex-col ${isActive ? 'panel-active' : ''}`}
      style={panelStyle}
    >
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold" style={headerStyle}>{short}</h2>
        <span className="text-xs opacity-80">Roster</span>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block text-center mb-2">
        <h2 className="text-2xl font-semibold" style={headerStyle}>{title}</h2>
        <p className="text-sm opacity-90">{TEAM_ABBR[franchise] || ''}</p>
      </div>

      {/* Mobile compact roster grid (13 slots) */}
      <div className="md:hidden grid grid-cols-5 gap-1.5">
        {slots.map((pick, i) => {
          const tag = pick ? (TEAM_ABBR[pick.team] || 'FA') : '—';
          const text = pick ? `${abbr(pick)}·${tag}${pick.rookie ? '·R' : ''}` : ' ';
          return (
            <div
              key={i}
              className="h-10 rounded-lg bg-black/20 border border-white/10 grid place-items-center text-[11px] font-semibold"
              title={pick ? `${pick.name} • ${tag} • ${pick.overall}${pick.rookie ? ' • Rookie' : ''}` : 'Empty'}
              aria-label={pick ? `${pick.name} ${pick.overall}` : 'Empty slot'}
              style={pick ? { color: TEAM_COLOR[pick.team] } : undefined}
            >
              {text}
            </div>
          );
        })}
      </div>

      {/* Desktop full list */}
      <ol className="hidden md:block space-y-1 text-sm md:text-base mt-1">
        {slots.map((pick, i) => {
          if (!pick) {
            return (
              <li key={i} className="flex gap-2">
                <span className="opacity-70 w-6 text-right">{i + 1}.</span>
                <span className="flex-1">&nbsp;</span>
              </li>
            );
          }
          const tag = TEAM_ABBR[pick.team] || 'FA';
          return (
            <li key={i} className="flex gap-2">
              <span className="opacity-70 w-6 text-right">{i + 1}.</span>
              <span className="flex-1" style={{ color: TEAM_COLOR[pick.team] }}>
                {pick.name} ({pick.position}) • {tag} • OVR {pick.overall}{pick.rookie ? ' • Rookie' : ''}
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
