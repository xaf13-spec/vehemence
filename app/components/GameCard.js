"use client";

import { useState } from "react";
import GamePlayer from "./GamePlayer";

function localDateKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function addAchievementNotifications(played, favorites, recent, activeDays) {
  if (localStorage.getItem("vehemence_notify_achievements") === "false") return;
  const unlocked = JSON.parse(localStorage.getItem("vehemence_achievement_unlocks") || "[]");
  const checks = [
    ["first-game", played >= 1, "First Game", "You played your first game."],
    ["collector", favorites.length >= 5, "Collector", "You favorited 5 games."],
    ["regular", activeDays.length >= 7, "Regular", "You played on 7 different days."],
    ["explorer", recent.length >= 10, "Explorer", "You played 10 different games."],
    ["veteran", played >= 50, "Veteran", "You played 50 games."],
  ];
  const notifications = JSON.parse(localStorage.getItem("vehemence_notifications") || "[]");
  let changed = false;
  checks.forEach(([id, condition, title, text]) => {
    if (!condition || unlocked.includes(id)) return;
    unlocked.push(id);
    notifications.unshift({ id: `achievement-${id}`, title: `Achievement unlocked: ${title}`, text, type: "Achievement", read: false });
    changed = true;
  });
  if (!changed) return;
  localStorage.setItem("vehemence_achievement_unlocks", JSON.stringify(unlocked));
  localStorage.setItem("vehemence_notifications", JSON.stringify(notifications.slice(0, 100)));
  window.dispatchEvent(new Event("vehemence-notifications-changed"));
}

export default function GameCard({ game, favorite = false, onFavorite, onOpen }) {
  const [open, setOpen] = useState(false);

  function startGame() {
    const remember = localStorage.getItem("vehemence_remember_game") !== "false";
    if (remember) localStorage.setItem("vehemence_last_game", game.name);

    const recent = JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]").filter((name) => name !== game.name);
    const nextRecent = [game.name, ...recent].slice(0, 20);
    localStorage.setItem("vehemence_recent_games", JSON.stringify(nextRecent));

    const played = Number(localStorage.getItem("vehemence_games_played") || 0) + 1;
    localStorage.setItem("vehemence_games_played", String(played));

    const today = localDateKey();
    const days = JSON.parse(localStorage.getItem("vehemence_active_days") || "[]").filter((day) => day !== today);
    const activeDays = [today, ...days].slice(0, 365);
    localStorage.setItem("vehemence_active_days", JSON.stringify(activeDays));

    const favorites = JSON.parse(localStorage.getItem("vehemence_favorites") || "[]");
    addAchievementNotifications(played, favorites, nextRecent, activeDays);
    window.dispatchEvent(new Event("vehemence-games-changed"));
    onOpen?.(game);
    setOpen(true);
  }

  return <>
    <article className="game-card">
      <button type="button" className="game-card-main" onClick={startGame}>
        <div className="game-thumbnail"><span>{game.name}</span></div>
        <div className="game-info"><div><h3>{game.name}</h3><p>{game.description}</p></div><span className="game-category">{game.category}</span></div>
      </button>
      <button type="button" className={`game-favorite ${favorite ? "active" : ""}`} aria-label={favorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`} onClick={() => onFavorite?.(game.name)}>{favorite ? "★" : "☆"}</button>
    </article>
    {open && <GamePlayer game={game} onClose={() => setOpen(false)} />}
  </>;
}
