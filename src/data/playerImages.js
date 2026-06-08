// src/data/playerImages.js
import { nameToSlug } from './slug.js';

// Grab images directly from src/assets (handles upper- and lower-case extensions).
const imported = import.meta.glob(
  '/src/assets/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}',
  { eager: true, import: 'default' }
);

// Build a lookup table: "jayson-tatum" -> URL.
const LOOKUP = Object.fromEntries(
  Object.entries(imported).map(([fullPath, url]) => {
    const file = fullPath.split('/').pop() || '';
    const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, '');
    return [base.toLowerCase(), url];
  })
);

export function getPlayerImage(player, { warn = false } = {}) {
  const tryKeys = new Set();
  if (player?.image) tryKeys.add(nameToSlug(player.image));
  if (player?.name) tryKeys.add(nameToSlug(player.name));

  for (const key of tryKeys) {
    if (LOOKUP[key]) return LOOKUP[key];
  }

  if (warn && tryKeys.size) {
    console.warn('[player image] not found:', player?.name, 'tried:', [...tryKeys]);
  }
  return null;
}
