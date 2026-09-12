"use client";

import { useState } from "react";
import GamePlayer from "./GamePlayer";

export default function GameCard({ game }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="game-card game-card-button" onClick={() => setOpen(true)}>
        <div className="game-thumbnail">
          <span>{game.name}</span>
        </div>

        <div className="game-info">
          <div>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>

          <span className="game-category">{game.category}</span>
        </div>
      </button>

      {open && <GamePlayer game={game} onClose={() => setOpen(false)} />}
    </>
  );
}
