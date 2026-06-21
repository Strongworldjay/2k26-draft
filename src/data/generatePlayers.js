import { ALL_PLAYERS } from './players.js';
import { tierFromOverall } from './tiers.js';

/** ----- Config ----- */
const DEFAULT_BOARD_SIZE = 36;
const MIN_CENTERS = 0;

/** Rarity weights. These keys must match tiers.js. */
const RARITY_WEIGHTS = {
  common: 0.01,
  uncommon: 0.40,
  rare: 0.35,
  'very-rare': 0.17,
  legendary: 0.05,
  superstar: 0.02,
};

/** Chance to inject one franchise legend into a generated board. */
const DEFAULT_LEGEND_CHANCE = 0.25;

const isCenter = (player) => /(^|\/)C($|\/)/i.test(player.position || '');
const playerKey = (player) => `${(player.name || '').toLowerCase()}::${player.team || ''}`;

function buildTierBuckets(players, excluded = new Set()) {
  const buckets = {
    common: [], uncommon: [], rare: [], 'very-rare': [], legendary: [], superstar: [],
  };

  players.forEach((player, index) => {
    if (excluded.has(index)) return;
    const key = tierFromOverall(player.overall)?.key || 'common';
    buckets[key]?.push(index);
  });
  return buckets;
}

function pickTierKey(buckets) {
  const entries = Object.entries(RARITY_WEIGHTS).filter(([key]) => (buckets[key]?.length ?? 0) > 0);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries.at(-1)?.[0] ?? null;
}

function popRandomFromBucket(buckets, key) {
  const bucket = buckets[key];
  if (!bucket?.length) return null;
  const offset = Math.floor(Math.random() * bucket.length);
  return bucket.splice(offset, 1)[0] ?? null;
}

function pickRandomLegend(excludedKeys = new Set()) {
  const candidates = ALL_PLAYERS.filter((player) => player.legend && !excludedKeys.has(playerKey(player)));
  if (!candidates.length) return null;
  const player = candidates[Math.floor(Math.random() * candidates.length)];
  return { ...player, legendInjected: true };
}

function trimToSizePreserveLegends(players, max) {
  while (players.length > max) {
    let dropIndex = -1;
    let lowestOverall = Infinity;

    players.forEach((player, index) => {
      if (player.legend || player.legendInjected) return;
      if ((player.overall ?? 0) < lowestOverall) {
        lowestOverall = player.overall ?? 0;
        dropIndex = index;
      }
    });

    players.splice(dropIndex >= 0 ? dropIndex : players.length - 1, 1);
  }
}

function makeId(index) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toUiPlayers(players) {
  return players.map((player, index) => ({
    id: makeId(index),
    name: player.name,
    initials: player.name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
    overall: player.overall,
    team: player.team,
    position: player.position,
    taken: false,
    rookie: !!player.rookie,
    rookieAuto: !!player.rookieAuto,
    legend: !!player.legend,
    legendInjected: !!player.legendInjected,
  }));
}

/**
 * Generate a weighted draft board.
 * Auto-slot rookies and franchise legends are excluded from the normal pool.
 * Legends can enter only through the optional legend-injection step.
 */
export function generatePlayers(
  count = DEFAULT_BOARD_SIZE,
  { legendChance = DEFAULT_LEGEND_CHANCE, forceLegend = false } = {}
) {
  const pool = ALL_PLAYERS.filter((player) => !player.rookieAuto && !player.legend);
  const targetSize = Math.min(count, pool.length);
  const chosen = new Set();

  if (MIN_CENTERS > 0) {
    const centerIndices = pool
      .map((player, index) => ({ player, index }))
      .filter(({ player }) => isCenter(player))
      .map(({ index }) => index);

    const centerBuckets = buildTierBuckets(pool, new Set(pool.map((_, index) => index).filter((index) => !centerIndices.includes(index))));
    while (chosen.size < Math.min(MIN_CENTERS, centerIndices.length)) {
      const key = pickTierKey(centerBuckets);
      if (!key) break;
      const index = popRandomFromBucket(centerBuckets, key);
      if (index != null) chosen.add(index);
    }
  }

  while (chosen.size < targetSize) {
    const buckets = buildTierBuckets(pool, chosen);
    const key = pickTierKey(buckets);
    if (!key) break;
    const index = popRandomFromBucket(buckets, key);
    if (index != null) chosen.add(index);
  }

  const selected = [...chosen].map((index) => pool[index]);
  if (forceLegend || Math.random() < legendChance) {
    const legend = pickRandomLegend(new Set(selected.map(playerKey)));
    if (legend) selected.push(legend);
  }

  selected.sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0));
  trimToSizePreserveLegends(selected, targetSize);

  return toUiPlayers(selected.sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0)));
}
