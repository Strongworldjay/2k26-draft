// src/components/SidePanel.jsx
import React from 'react';
import { TEAM_ABBR, TEAM_NAME, TEAM_COLOR } from '../data/teams.js';

function abbr(pick) {
  if (!pick) return '—';
  const parts = pick.name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Parse first listed position token and map to G/F/C bucket
function bucketFromFirstPos(pos = '') {
  // Normalize, keep only letters, split on anything non-letters
  const tokens = pos
    .toUpperCase()
    .replace(/[^A-Z]/g, ' ')
    .split(' ')
    .filter(Boolean);

  // Find the first valid basketball position token in order
  for (const t of tokens) {
    if (t === 'PG' || t === 'SG') return 'G';   // Guard
    if (t === 'SF' || t === 'PF') return 'F';   // Forward
    if (t === 'C') return 'C';                  // Center
  }
  return null;
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

  // 12 drafted + slot 13 = rookie
  const slots = Array.from({ length: 13 }).map((_, i) => (i < 12 ? team[i] ?? null : (rookie ?? null)));

  const draftedPlusRookie = [...team, ...(rookie ? [rookie] : [])].filter(Boolean);
  const avgOVR = draftedPlusRookie.length
    ? (draftedPlusRookie.reduce((s, p) => s + (p.overall || 0), 0) / draftedPlusRookie.length).toFixed(1)
    : '—';

  // Count G/F/C from first listed position only
  let gCount = 0, fCount = 0, cCount = 0;
  for (const p of draftedPlusRookie) {
    const b = bucketFromFirstPos(p.position || '');
    if (b === 'G') gCount++;
    else if (b === 'F') fCount++;
    else if (b === 'C') cCount++;
  }

  const panelStyle = isActive ? { '--franchise-color': TEAM_COLOR[franchise] } : undefined;
  const headerStyle = { color: TEAM_COLOR[franchise] }; // team-colored title

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

      {/* Footer: Average overall + Position mix */}
      <div className="mt-3 md:mt-4 pt-2 border-t border-white/10 text-sm md:text-base">
        <div className="flex items-center justify-between">
          <span className="opacity-80">Avg OVR</span>
          <span className="font-semibold">{avgOVR}</span>
        </div>

        {/* Position counts (show only non-zero buckets) */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 opacity-90">
          {gCount > 0 && <span>{gCount}x Guards</span>}
          {fCount > 0 && <span>{fCount}x Forwards</span>}
          {cCount > 0 && <span>{cCount}x Centers</span>}
          {(gCount + fCount + cCount === 0) && <span className="opacity-70">—</span>}
        </div>
      </div>
    </aside>
  );
}
