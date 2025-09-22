// src/components/SidePanel.jsx
import React from 'react'

function abbr(pick) {
  if (!pick) return '—'
  // First initial + last initial (or single name fallback)
  const parts = pick.name.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function SidePanel({ titleDesktop = 'Team', titleMobile = '#', team }) {
  return (
    <aside className="rounded-xl p-3 md:p-6 bg-[var(--maroon)]/90 flex flex-col">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{titleMobile}</h2>
        <span className="text-xs opacity-80">Roster</span>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block text-center mb-2">
        <h2 className="text-2xl font-semibold">{titleDesktop}</h2>
        <p className="text-sm opacity-90">Sports Team</p>
      </div>

      {/* Mobile compact roster grid (13 slots) */}
      <div className="md:hidden grid grid-cols-5 gap-1.5">
        {Array.from({ length: 13 }).map((_, i) => {
          const pick = team[i]
          return (
            <div
              key={i}
              className="h-10 rounded-lg bg-black/20 border border-white/10 grid place-items-center text-xs font-semibold"
              title={pick ? `${pick.name} • OVR ${pick.overall}` : 'Empty'}
              aria-label={pick ? `${pick.name} overall ${pick.overall}` : 'Empty slot'}
            >
              {abbr(pick)}
            </div>
          )
        })}
      </div>

      {/* Desktop full list */}
      <ol className="hidden md:block space-y-1 text-sm md:text-base mt-1">
        {Array.from({ length: 13 }).map((_, i) => {
          const pick = team[i]
          return (
            <li key={i} className="flex gap-2">
              <span className="opacity-70 w-6 text-right">{i + 1}.</span>
              <span className="flex-1">
                {pick ? `${pick.name} (${pick.position}) • OVR ${pick.overall}` : 'Player Name'}
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
