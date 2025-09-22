import { FIRST_NAMES, LAST_NAMES } from './names.js'

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const makeName = () => {
  const f = FIRST_NAMES[rand(0, FIRST_NAMES.length - 1)]
  const l = LAST_NAMES[rand(0, LAST_NAMES.length - 1)]
  return `${f} ${l}`
}

export function generatePlayers(count = 36) {
  // generate base overalls skewed high-to-low
  const players = Array.from({ length: count }).map((_, i) => {
    const name = makeName()
    const overall = rand(65, 97) // tweakable
    const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
    return {
      id: `${i}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      name,
      initials,
      overall,
      taken: false,
    }
  })
  // We will sort in App.jsx; here we can randomize a bit to allow variety.
  return players
}
