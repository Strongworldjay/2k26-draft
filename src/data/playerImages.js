// src/data/playerImages.js
import { nameToSlug } from "../utils/slug.js";

// Look only in src/assets (no subfolder)
const imported = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const LOOKUP = {};
for (const fullPath in imported) {
  const url = imported[fullPath];               // resolved URL
  const file = fullPath.split("/").pop().toLowerCase();
  const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, "");
  LOOKUP[base] = url;
}

/**
 * Returns the image URL if found.
 * Matching order:
 * 1) player.image (filename base you set manually, no extension)
 * 2) slug from player.name, e.g., "trae-young"
 */
export function getPlayerImage(player, { warn = false } = {}) {
  const tryKeys = [];
  if (player?.image) tryKeys.push(player.image.toLowerCase());
  if (player?.name) tryKeys.push(nameToSlug(player.name));

  for (const key of tryKeys) {
    if (LOOKUP[key]) return LOOKUP[key];
  }
  if (warn && tryKeys.length) {
    console.warn("[player image] not found", player?.name, "tried:", tryKeys);
  }
  return null;
}
