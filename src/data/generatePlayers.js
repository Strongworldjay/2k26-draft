// src/data/generatePlayers.js
import { ALL_PLAYERS } from './players.js';

const sampleN = (arr, n) => {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
};

export function generatePlayers(count = 36) {
  const selected = sampleN(ALL_PLAYERS, Math.min(count, ALL_PLAYERS.length));
  return selected.map((p, i) => ({
    id: `${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: p.name,
    initials: p.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase(),
    overall: p.overall,
    team: p.team,            // slug must match CSS (e.g., 'lakers', 'celtics', 'sixers')
    position: p.position,
    taken: false,
  }));
}
