// src/data/playerImages.js

// Inline slug utility so we don't depend on another module
function nameToSlug(name = "") {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")      // strip accents
    .replace(/[^a-zA-Z0-9\s-]/g, "")      // remove punctuation
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// Grab images directly from src/assets (handles upper & lower case extensions)
const imported = import.meta.glob(
  "/src/assets/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}",
  { eager: true, import: "default" }
);

// Build a lookup table: "jayson-tatum" -> URL
const LOOKUP = {};
for (const fullPath in imported) {
  const url = imported[fullPath];
  const file = fullPath.split("/").pop();                 // keep original case
  const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, ""); // strip ext (case-insensitive)
  LOOKUP[base.toLowerCase()] = url;
}

// Helpful log while wiring images
console.log("player image keys loaded:", Object.keys(LOOKUP));

export function getPlayerImage(player, { warn = false } = {}) {
  const tryKeys = [];
  if (player?.image) tryKeys.push(player.image.toLowerCase());
  if (player?.name) tryKeys.push(nameToSlug(player.name)); // -> "jayson-tatum"

  for (const key of tryKeys) {
    if (LOOKUP[key]) return LOOKUP[key];
  }
  if (warn && tryKeys.length) {
    console.warn("[player image] not found:", player?.name, "tried:", tryKeys, "keys:", Object.keys(LOOKUP));
  }
  return null;
}
