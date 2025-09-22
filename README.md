# 2K26 Draft (React + Vite + Tailwind)

A clean NBA 2K26-style draft board: two team panels on the sides, a 6×6 grid of 36 player "heads" in the middle.
- Players are **randomly generated** each board.
- Grid is **sorted by Overall** (top-left highest → bottom-right lowest).
- Hover a dot to see **Name + Overall**; click to **draft** to the active team.
- Picks **alternate** by default (Team 2 starts, matching the mockup arrow).
- Use the **Team to Pick** buttons to force a specific team if needed.
- **Undo** last pick, or **New Board** to reroll the 36 players.

## Quickstart

```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev

# 3) Open the URL Vite prints (usually http://localhost:5173)
```

## Tech
- React 18 + Vite
- TailwindCSS 3

## Customize

- Change color theme in `tailwind.config.js` and `src/index.css`
- Player generation logic in `src/data/generatePlayers.js`
- Side panel slots: edit `SidePanel.jsx` (currently 13 spots)
- Grid size: change columns/rows in `DraftBoard.jsx` & CSS

Enjoy!
