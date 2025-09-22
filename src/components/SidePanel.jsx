// src/components/SidePanel.jsx
import React from 'react';

export default function SidePanel({ title, team, accent='left' }) {
  return (
    <aside className="rounded-xl p-4 md:p-6 bg-[var(--maroon)]/90 min-h-[640px] flex flex-col">
      <h2 className="text-2xl font-semibold text-center mb-2">{title}</h2>
      <p className="text-center text-sm opacity-90 mb-4">Sports Team</p>
      <ol className="space-y-1 text-sm md:text-base">
        {Array.from({ length: 13 }).map((_, i) => {
          const pick = team[i];
          return (
            <li key={i} className="flex gap-2">
              <span className="opacity-70 w-6 text-right">{i + 1}.</span>
              <span className="flex-1">
                {pick ? `${pick.name} (${pick.position}) • OVR ${pick.overall}` : 'Player Name'}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
