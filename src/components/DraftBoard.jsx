// src/components/DraftBoard.jsx
import React from 'react';
import PlayerDot from './PlayerDot.jsx';

export default function DraftBoard({ players, onPick, canPick }) {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6 place-items-center mt-6 sm:mt-8 md:mt-10"
      role="list"
      aria-label="Draftable players"
    >
      {players.map((p, idx) => (
        <div role="listitem" key={p.id}>
          <PlayerDot
            player={p}
            rank={idx + 1}
            disabled={!canPick(p)}
            onClick={() => canPick(p) && onPick(p.id)}
          />
        </div>
      ))}
    </div>
  );
}
