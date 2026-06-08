// src/components/DraftBoard.jsx
import React from 'react';
import PlayerDot from './PlayerDot.jsx';

export default function DraftBoard({ players, onPick, canPick }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 place-items-center mt-6 sm:mt-8 md:mt-10" role="list" aria-label="Draftable players">
      {players.map((player, index) => (
        <div role="listitem" key={player.id} className="dot-enter" style={{ '--i': index, '--fromX': index % 2 === 0 ? '-30vw' : '30vw' }}>
          <PlayerDot player={player} disabled={!canPick(player)} onClick={() => canPick(player) && onPick(player.id)} />
        </div>
      ))}
    </div>
  );
}
