// src/data/generatePlayers.js
import { ALL_PLAYERS } from "./players.js";
import { tierFromOverall } from "./tiers.js";

/** ----- Config ----- */
const BOARD_SIZE = 36;
const MIN_CENTERS = 4;

/** Rarity weights (must match tier keys from tiers.js) */
const RARITY_WEIGHTS = {
  "common": 0.19,       // 60–74
  "uncommon": 0.42,     // 75–79
  "rare": 0.25,         // 80–85
  "very-rare": 0.10,    // 86–89
  "legendary": 0.03,    // 90–94
  "superstar": 0.01,    // 95+
};

/** -------------------- helpers -------------------- */

const isCenter = (p) =>
  /\bC\b/i.test(p.position || "") || (p.position || "").includes("C");

/** Build per-tier buckets of indices for fast sampling without duplicates */
function buildTierBuckets(players, exclude = new Set()) {
  const buckets = {
    "common": [],
    "uncommon": [],
    "rare": [],
    "very-rare": [],
    "legendary": [],
    "superstar": [],
  };
  players.forEach((p, idx) => {
    if (exclude.has(idx)) return;
    const t = tierFromOverall(p.overall)?.key || "common";
    if (buckets[t]) buckets[t].push(idx);
  });
  return buckets;
}

/** Weighted pick of a tier key, skipping empty buckets */
function pickTierKey(buckets) {
  const entries = Object.entries(RARITY_WEIGHTS).filter(
    ([key]) => (buckets[key]?.length ?? 0) > 0
  );
  if (entries.length === 0) return null;
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of entries) {
    if ((r -= w) <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/** Pop a random index from a bucket */
function popRandomFromBucket(buckets, key) {
  const arr = buckets[key];
  if (!arr || arr.length === 0) return null;
  const i = Math.floor(Math.random() * arr.length);
  const [idx] = arr.splice(i, 1);
  return idx ?? null;
}

/** Map players → UI objects */
function toUiPlayers(list) {
  return list.map((p, i) => ({
    id: `${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: p.name,
    initials: p.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(),
    overall: p.overall,
    team: p.team,
    position: p.position,
    taken: false,
    rookie: !!p.rookie,         // keep flag for UI (if any sneak in)
    rookieAuto: !!p.rookieAuto, // not used on board, but preserved
  }));
}

/** -------------------- main API -------------------- */

/**
 * Generate a draft board of `count` players, excluding ONLY auto-locked rookies.
 * - Guarantees at least MIN_CENTERS centers.
 * - Uses rarity weights for the rest.
 */
export function generatePlayers(count = BOARD_SIZE) {
  // EXCLUDE only the auto-locked rookies from the draftable pool
  const POOL = ALL_PLAYERS.filter(p => !p.rookieAuto);

  const n = Math.min(count, POOL.length);
  const chosen = new Set(); // indices into POOL

  // 1) Ensure minimum number of centers
  const centerIndices = POOL
    .map((p, idx) => ({ p, idx }))
    .filter(({ p }) => isCenter(p))
    .map(({ idx }) => idx);

  const needCenters = Math.min(MIN_CENTERS, centerIndices.length);
  if (needCenters > 0) {
    // Build center-only tier buckets for weighted selection among centers
    const centerBuckets = {
      "common": [],
      "uncommon": [],
      "rare": [],
      "very-rare": [],
      "legendary": [],
      "superstar": [],
    };
    centerIndices.forEach((idx) => {
      const key = tierFromOverall(POOL[idx].overall)?.key || "common";
      centerBuckets[key].push(idx);
    });

    while (chosen.size < needCenters) {
      const key = pickTierKey(centerBuckets);
      if (!key) break; // no centers left
      const idx = popRandomFromBucket(centerBuckets, key);
      if (idx == null) continue;
      chosen.add(idx);
    }
  }

  // 2) Fill the rest using weighted tiers (no duplicates)
  while (chosen.size < n) {
    const buckets = buildTierBuckets(POOL, chosen);
    const key = pickTierKey(buckets);
    if (!key) break; // no players left
    const idx = popRandomFromBucket(buckets, key);
    if (idx == null) continue;
    chosen.add(idx);
  }

  // 3) Materialize chosen indices → player objects
  const selected = Array.from(chosen).map((idx) => POOL[idx]);

  // 4) If we still came up short (e.g., extremely tiny pool), top up randomly
  while (selected.length < n) {
    const i = Math.floor(Math.random() * POOL.length);
    if (!selected.includes(POOL[i])) selected.push(POOL[i]);
  }

  // Sort by overall desc (board expects this)
  selected.sort((a, b) => b.overall - a.overall);

  return toUiPlayers(selected);
}
