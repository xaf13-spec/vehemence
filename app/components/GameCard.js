"use client";

import { useState } from "react";
import GamePlayer from "./GamePlayer";

export default function GameCard({ game, favorite = false, onFavorite, onOpen }) {
  const [open, setOpen] = useState(false);
  function startGame() {
    localStorage.setItem("vehemence_last_game", game.name);
    const recent = JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]").filter((name) => name !== game.name);
    localStorage.setItem("vehemence_recent_games", JSON.stringify([game.name, ...recent].slice(0, 20)));
    localStorage.setItem("vehemence_games_played", String(Number(localStorage.getItem("vehemence_games_played") || 0) + 1));
    const today = new Date().toISOString().slice(0, 10);
    const days = JSON.parse(localStorage.getItem("vehemence_active_days") || "[]").filter((day) => day !== today);
    localStorage.setItem("vehemence_active_days", JSON.stringify([today, ...days].slice(0, 365)));
    window.dispatchEvent(new Event("vehemence-games-changed"));
    onOpen?.(game); setOpen(true);
  }
  return <><article className="game-card"><button type="button" className="game-card-main" onClick={startGame}><div className="game-thumbnail"><span>{game.name}</span></div><div className="game-info"><div><h3>{game.name}</h3><p>{game.description}</p></div><span className="game-category">{game.category}</span></div></button><button type="button" className={`game-favorite ${favorite ? "active" : ""}`} aria-label={favorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`} onClick={() => onFavorite?.(game.name)}>{favorite ? "★" : "☆"}</button></article>{open && <GamePlayer game={game} onClose={() => setOpen(false)} />}</>;
}
