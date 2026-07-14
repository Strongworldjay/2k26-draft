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

/**
 * A drafted player remains slightly less likely to appear for three boards.
 * The value stored in playerCooldowns is the number of affected boards left.
 */
const COOLDOWN_WEIGHT_MULTIPLIERS = {
  3: 0.85,
  2: 0.90,
  1: 0.95,
};

const isCenter = (player) => /(^|\/)C($|\/)/i.test(player.position || '');

export function playerHistoryKey(player) {
  return `${(player?.name || '').trim().toLowerCase()}::${player?.team || ''}`;
}

function cooldownWeight(player, playerCooldowns = {}) {
  const boardsLeft = Number(playerCooldowns[playerHistoryKey(player)]) || 0;
  return COOLDOWN_WEIGHT_MULTIPLIERS[boardsLeft] ?? 1;
}

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
  const entries = Object.entries(RARITY_WEIGHTS).filter(
    ([key]) => (buckets[key]?.length ?? 0) > 0
  );
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries.at(-1)?.[0] ?? null;
}

function popWeightedFromBucket(buckets, key, players, playerCooldowns) {
  const bucket = buckets[key];
  if (!bucket?.length) return null;

  const weights = bucket.map((index) => cooldownWeight(players[index], playerCooldowns));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedOffset = bucket.length - 1;

  for (let offset = 0; offset < bucket.length; offset += 1) {
    roll -= weights[offset];
    if (roll <= 0) {
      selectedOffset = offset;
      break;
    }
  }

  return bucket.splice(selectedOffset, 1)[0] ?? null;
}

function pickRandomLegend(excludedKeys = new Set(), playerCooldowns = {}) {
  const candidates = ALL_PLAYERS.filter(
    (player) => player.legend && !excludedKeys.has(playerHistoryKey(player))
  );
  if (!candidates.length) return null;

  const weights = candidates.map((player) => cooldownWeight(player, playerCooldowns));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedIndex = candidates.length - 1;

  for (let index = 0; index < candidates.length; index += 1) {
    roll -= weights[index];
    if (roll <= 0) {
      selectedIndex = index;
      break;
    }
  }

  return { ...candidates[selectedIndex], legendInjected: true };
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
    initials: player.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
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
 * Recently drafted players receive a small temporary weight reduction within
 * their normal rarity tier, so the original rarity distribution stays intact.
 */
export function generatePlayers(
  count = DEFAULT_BOARD_SIZE,
  {
    legendChance = DEFAULT_LEGEND_CHANCE,
    forceLegend = false,
    playerCooldowns = {},
  } = {}
) {
  const pool = ALL_PLAYERS.filter((player) => !player.rookieAuto && !player.legend);
  const targetSize = Math.min(count, pool.length);
  const chosen = new Set();

  if (MIN_CENTERS > 0) {
    const centerIndices = pool
      .map((player, index) => ({ player, index }))
      .filter(({ player }) => isCenter(player))
      .map(({ index }) => index);

    const nonCenterIndices = new Set(
      pool
        .map((_, index) => index)
        .filter((index) => !centerIndices.includes(index))
    );
    const centerBuckets = buildTierBuckets(pool, nonCenterIndices);

    while (chosen.size < Math.min(MIN_CENTERS, centerIndices.length)) {
      const key = pickTierKey(centerBuckets);
      if (!key) break;
      const index = popWeightedFromBucket(
        centerBuckets,
        key,
        pool,
        playerCooldowns
      );
      if (index != null) chosen.add(index);
    }
  }

  while (chosen.size < targetSize) {
    const buckets = buildTierBuckets(pool, chosen);
    const key = pickTierKey(buckets);
    if (!key) break;
    const index = popWeightedFromBucket(buckets, key, pool, playerCooldowns);
    if (index != null) chosen.add(index);
  }

  const selected = [...chosen].map((index) => pool[index]);
  if (forceLegend || Math.random() < legendChance) {
    const legend = pickRandomLegend(
      new Set(selected.map(playerHistoryKey)),
      playerCooldowns
    );
    if (legend) selected.push(legend);
  }

  selected.sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0));
  trimToSizePreserveLegends(selected, targetSize);

  return toUiPlayers(
    selected.sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0))
  );
}
