// src/components/SidePanel.jsx
import React from 'react';
import { TEAM_ABBR, TEAM_NAME, TEAM_COLOR } from '../data/teams.js';

function abbr(pick) {
  if (!pick) return '—';
  const parts = pick.name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts.at(-1)[0]).toUpperCase();
}

function bucketFromFirstPos(position = '') {
  const first = position.toUpperCase().split('/').map((part) => part.trim()).find(Boolean);
  if (first === 'PG' || first === 'SG') return 'G';
  if (first === 'SF' || first === 'PF') return 'F';
  if (first === 'C') return 'C';
  return null;
}

export default function SidePanel({ side, ownerLabel, franchise, team, rookie, titleDesktop, titleMobile, isActive = false }) {
  const title = titleDesktop ?? TEAM_NAME[franchise] ?? 'Team';
  const short = titleMobile ?? TEAM_ABBR[franchise] ?? '#';
  const slots = Array.from({ length: 13 }, (_, index) => (index < 12 ? team[index] ?? null : rookie ?? null));
  const roster = [...team, ...(rookie ? [rookie] : [])].filter(Boolean);
  const averageOverall = roster.length
    ? (roster.reduce((sum, player) => sum + (player.overall || 0), 0) / roster.length).toFixed(1)
    : '—';

  const counts = { G: 0, F: 0, C: 0 };
  roster.forEach((player) => {
    const bucket = bucketFromFirstPos(player.position);
    if (bucket) counts[bucket] += 1;
  });

  const panelStyle = isActive ? { '--franchise-color': TEAM_COLOR[franchise] } : undefined;
  const shiftClass = side === 'left'
    ? 'md:-translate-x-8 lg:-translate-x-12 xl:-translate-x-20'
    : side === 'right'
      ? 'md:translate-x-8 lg:translate-x-12 xl:translate-x-20'
      : '';

  return (
    <aside className={`panel rounded-xl p-3 md:p-6 bg-[var(--maroon)]/90 flex flex-col ${isActive ? 'panel-active' : ''} ${shiftClass} transition-transform duration-200`} style={panelStyle}>
      <div className="md:hidden flex items-center justify-between mb-2">
        <div>
          {ownerLabel && <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{ownerLabel}</p>}
          <h2 className="text-xl font-semibold" style={{ color: TEAM_COLOR[franchise] }}>{short}</h2>
        </div>
        <span className="text-xs opacity-80">Roster</span>
      </div>

      <div className="hidden md:block text-center mb-2">
        {ownerLabel && <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">{ownerLabel}</p>}
        <h2 className="text-2xl font-semibold" style={{ color: TEAM_COLOR[franchise] }}>{title}</h2>
        <p className="text-sm opacity-90">{TEAM_ABBR[franchise] || ''}</p>
      </div>

      <div className="md:hidden grid grid-cols-5 gap-1.5">
        {slots.map((pick, index) => {
          const tag = pick ? TEAM_ABBR[pick.team] || 'FA' : '—';
          const text = pick ? `${abbr(pick)}·${tag}${pick.rookie ? '·R' : ''}` : ' ';
          return (
            <div key={index} className="h-10 rounded-lg bg-black/20 border border-white/10 grid place-items-center text-[11px] font-semibold" title={pick ? `${pick.name} • ${tag} • ${pick.overall}${pick.rookie ? ' • Rookie' : ''}` : 'Empty'} style={pick ? { color: TEAM_COLOR[pick.team] } : undefined}>
              {text}
            </div>
          );
        })}
      </div>

      <ol className="hidden md:block space-y-1 text-sm md:text-base mt-1">
        {slots.map((pick, index) => (
          <li key={index} className="flex gap-2">
            <span className="opacity-70 w-6 text-right">{index + 1}.</span>
            <span className="flex-1" style={pick ? { color: TEAM_COLOR[pick.team] } : undefined}>
              {pick ? `${pick.name} (${pick.position}) • ${TEAM_ABBR[pick.team] || 'FA'} • OVR ${pick.overall}${pick.rookie ? ' • Rookie' : ''}` : '\u00A0'}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-3 md:mt-4 pt-2 border-t border-white/10 text-sm md:text-base">
        <div className="flex items-center justify-between"><span className="opacity-80">Avg OVR</span><span className="font-semibold">{averageOverall}</span></div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 opacity-90">
          {counts.G > 0 && <span>{counts.G}x Guards</span>}
          {counts.F > 0 && <span>{counts.F}x Forwards</span>}
          {counts.C > 0 && <span>{counts.C}x Centers</span>}
          {counts.G + counts.F + counts.C === 0 && <span className="opacity-70">—</span>}
        </div>
      </div>
    </aside>
  );
}
