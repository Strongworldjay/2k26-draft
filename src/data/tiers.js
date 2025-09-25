// src/data/tiers.js
export function tierFromOverall(ovr) {
  if (ovr >= 95) return { key: 'superstar', label: 'Superstar' };   // 95+
  if (ovr >= 90) return { key: 'legendary', label: 'Legendary' };   // 90–94
  if (ovr >= 86) return { key: 'very-rare', label: 'Very Rare' };   // 86–89
  if (ovr >= 80) return { key: 'rare', label: 'Rare' };             // 80–85
  if (ovr >= 75) return { key: 'uncommon', label: 'Uncommon' };     // 75–79
  if (ovr >= 60) return { key: 'common', label: 'Common' };         // 60–74
  return { key: 'common', label: 'Common' };                         // <60 (fallback)
}
