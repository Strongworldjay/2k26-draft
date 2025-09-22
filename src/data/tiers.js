// src/data/tiers.js
export function tierFromOverall(ovr) {
  if (ovr >= 97) return { key: 'dm', label: 'Dark Matter' };       // 97–99 (+100)
  if (ovr >= 94) return { key: 'go', label: 'Galaxy Opal' };       // 94–96
  if (ovr >= 90) return { key: 'pd', label: 'Pink Diamond' };      // 90–93
  if (ovr >= 87) return { key: 'dia', label: 'Diamond' };          // 87–89
  if (ovr >= 83) return { key: 'ame', label: 'Amethyst' };         // 83–86
  if (ovr >= 78) return { key: 'rub', label: 'Ruby' };             // 78–82
  if (ovr >= 74) return { key: 'sap', label: 'Sapphire' };         // 74–77
  if (ovr >= 70) return { key: 'em', label: 'Emerald' };           // 70–73
  if (ovr >= 65) return { key: 'gld', label: 'Gold' };             // 65–69
  if (ovr >= 60) return { key: 'sil', label: 'Silver' };           // 60–64
  return { key: 'brz', label: 'Bronze' };                          // 55–59
}
