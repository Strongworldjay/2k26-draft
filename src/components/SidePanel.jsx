// src/components/SidePanel.jsx
import React from 'react';
import { TEAM_ABBR, TEAM_NAME, TEAM_COLOR, TEAM_SORT_NAME } from '../data/teams.js';

const TEAM_NAME_COLLATOR = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

function abbr(pick) {
  if (!pick) return '—';
  const parts = pick.name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts.at(-1)[0]).toUpperCase();
}

function bucketFromFirstPos(position = '') {
  const first = position
    .toUpperCase()
    .split('/')
    .map((part) => part.trim())
    .find(Boolean);

  if (first === 'PG' || first === 'SG') return 'G';
  if (first === 'SF' || first === 'PF') return 'F';
  if (first === 'C') return 'C';
  return null;
}

function sortByTeamName(a, b) {
  const teamA = TEAM_SORT_NAME[a?.team] ?? TEAM_NAME[a?.team] ?? '';
  const teamB = TEAM_SORT_NAME[b?.team] ?? TEAM_NAME[b?.team] ?? '';

  return (
    TEAM_NAME_COLLATOR.compare(teamA, teamB) ||
    TEAM_NAME_COLLATOR.compare(a?.name ?? '', b?.name ?? '')
  );
}

export default function SidePanel({
  side,
  ownerLabel,
  franchise,
  team,
  rookie,
  titleDesktop,
  titleMobile,
  isActive = false,
}) {
  const title = titleDesktop ?? TEAM_NAME[franchise] ?? 'Team';
  const short = titleMobile ?? TEAM_ABBR[franchise] ?? '#';

  const roster = [...team, ...(rookie ? [rookie] : [])].filter(Boolean);
  const orderedRoster = [...roster].sort(sortByTeamName);

  const slots = [
    ...orderedRoster,
    ...Array.from({ length: Math.max(0, 13 - orderedRoster.length) }, () => null),
  ].slice(0, 13);

  const averageOverall = roster.length
    ? (roster.reduce((sum, player) => sum + (player.overall || 0), 0) / roster.length).toFixed(1)
    : '—';

  const counts = { G: 0, F: 0, C: 0 };
  roster.forEach((player) => {
    const bucket = bucketFromFirstPos(player.position);
    if (bucket) counts[bucket] += 1;
  });

  const panelStyle = isActive ? { '--franchise-color': TEAM_COLOR[franchise] } : undefined;

  const shiftClass =
    side === 'left'
      ? 'md:-translate-x-2 lg:-translate-x-4'
      : side === 'right'
        ? 'md:translate-x-2 lg:translate-x-4'
        : '';

  return (
    <aside
      className={`panel rounded-xl p-3 md:p-4 bg-[#efe4cb] text-black flex flex-col ${
        isActive ? 'panel-active' : ''
      } ${shiftClass} transition-transform duration-200`}
      style={panelStyle}
    >
      <div className="md:hidden flex items-center justify-between mb-2">
        <div>
          {ownerLabel && (
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              {ownerLabel}
            </p>
          )}
          <h2 className="text-xl font-semibold" style={{ color: TEAM_COLOR[franchise] }}>
            {short}
          </h2>
        </div>
        <span className="text-xs opacity-75">Roster</span>
      </div>

      <div className="hidden md:block text-center mb-2">
        {ownerLabel && (
          <p className="text-sm font-semibold uppercase tracking-wider opacity-75 mb-1">
            {ownerLabel}
          </p>
        )}
        <h2 className="text-2xl font-semibold" style={{ color: TEAM_COLOR[franchise] }}>
          {title}
        </h2>
        <p className="text-sm opacity-80">{TEAM_ABBR[franchise] || ''}</p>
      </div>

      <div className="md:hidden grid grid-cols-5 gap-1.5">
        {slots.map((pick, index) => {
          const tag = pick ? TEAM_ABBR[pick.team] || 'FA' : '—';
          const text = pick ? `${abbr(pick)}·${tag}${pick.rookie ? '·R' : ''}` : ' ';
          return (
            <div
              key={index}
              className="h-10 rounded-lg bg-black/5 border border-black/10 grid place-items-center text-[11px] font-semibold"
              title={
                pick
                  ? `${pick.name} • ${TEAM_NAME[pick.team] || tag} • ${pick.overall}${pick.rookie ? ' • Rookie' : ''}`
                  : 'Empty'
              }
              style={pick ? { color: TEAM_COLOR[pick.team] } : undefined}
            >
              {text}
            </div>
          );
        })}
      </div>

      <ol className="hidden md:block space-y-0.5 text-[14px] leading-[1.35] mt-1">
        {slots.map((pick, index) => (
          <li key={index} className="flex gap-2">
            <span className="opacity-70 w-6 text-right shrink-0">{index + 1}.</span>
            <span
              className="flex-1 min-w-0"
              style={pick ? { color: TEAM_COLOR[pick.team] } : undefined}
            >
              {pick
                ? `${pick.name} (${pick.position}) • ${TEAM_ABBR[pick.team] || 'FA'} • OVR ${pick.overall}${pick.rookie ? ' • Rookie' : ''}`
                : '\u00A0'}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-3 pt-2 border-t border-black/10 text-sm md:text-base">
        <div className="flex items-center justify-between">
          <span className="opacity-75">Avg OVR</span>
          <span className="font-semibold">{averageOverall}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 opacity-90 text-sm">
          {counts.G > 0 && <span>{counts.G}x Guards</span>}
          {counts.F > 0 && <span>{counts.F}x Forwards</span>}
          {counts.C > 0 && <span>{counts.C}x Centers</span>}
          {counts.G + counts.F + counts.C === 0 && <span className="opacity-60">—</span>}
        </div>
      </div>
    </aside>
  );
}
