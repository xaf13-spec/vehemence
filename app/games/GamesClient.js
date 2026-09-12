"use client";

import { useEffect, useMemo, useState } from "react";
import GameCard from "../components/GameCard";

const games = [
  { name: "Cookie Clicker", description: "Build your cookie empire one click at a time.", category: "Idle", hasSound: true, url: "https://orteil.dashnet.org/cookieclicker/" },
  { name: "Retro Bowl", description: "Classic-style football with a simple pick-up-and-play feel.", category: "Sports", hasSound: true },
  { name: "Slope", description: "Roll down the track, dodge obstacles, and stay on course.", category: "Arcade", hasSound: true, url: "https://bigfoot9999.github.io/Slope-Game/" },
  { name: "Rocket Goal", description: "Fast arcade soccer with rockets and quick reactions.", category: "Sports", hasSound: true },
  { name: "Geometry Dash", description: "Jump, fly, and time your moves through rhythmic levels.", category: "Arcade", hasSound: true },
  { name: "Moto X3M", description: "Race through obstacle courses and pull off wild stunts.", category: "Racing", hasSound: true },
  { name: "Moto X3M 2", description: "More tracks, more jumps, and more motorcycle chaos.", category: "Racing", hasSound: true },
  { name: "Moto X3M 3", description: "Keep the bike moving through another set of tricky tracks.", category: "Racing", hasSound: true },
  { name: "Moto X3M 4 Winter", description: "Take the Moto X3M challenge into snowy tracks.", category: "Racing", hasSound: true },
  { name: "Moto X3M 5 Pool Party", description: "Race through a bright pool-party obstacle course.", category: "Racing", hasSound: true },
  { name: "Moto X3M 6 Spooky Land", description: "A spooky Moto X3M ride packed with dangerous-looking tracks.", category: "Racing", hasSound: true },
  { name: "Eaglercraft", description: "Minecraft-style browser gameplay running directly in the web client.", category: "Adventure", hasSound: true, url: "https://g.deev.is/eaglercraft/" },
  { name: "Level Devil", description: "A platformer where the level itself keeps trying to surprise you.", category: "Platformer", hasSound: true, url: "https://playleveldevil.com/" },
  { name: "Basketball Stars", description: "Take on fast basketball matches and work on your shots.", category: "Sports", hasSound: true },
  { name: "Happy Wheels", description: "Physics-based obstacle courses with unpredictable movement.", category: "Arcade", hasSound: true },
  { name: "Minesweeper", description: "Clear the board, mark the mines, and don't hit one.", category: "Puzzle", hasSound: false, url: "https://mines.now.sh/" },
  { name: "Worlde", description: "Guess the hidden word in as few tries as possible.", category: "Puzzle", hasSound: false },
  { name: "Slither.io", description: "Grow your snake, collect dots, and avoid crashing.", category: "Arcade", hasSound: true },
  { name: "Chess", description: "Play classic chess right in the browser.", category: "Board", hasSound: false, url: "https://lichess.org/" },
  { name: "Tetris", description: "Stack falling pieces and clear lines before the board fills.", category: "Puzzle", hasSound: true, url: "https://play.tetris.com/" },
  { name: "FNAF", description: "Survive the night by keeping an eye on what is happening around you.", category: "Horror", hasSound: true },
  { name: "Subway Surfers", description: "Dash through the tracks, dodge obstacles, and grab coins.", category: "Arcade", hasSound: true },
  { name: "Among Us", description: "Complete tasks, watch the crew, and figure out who is suspicious.", category: "Social", hasSound: true },
  { name: "Space Waves", description: "Guide your ship through tight spaces and keep your timing sharp.", category: "Arcade", hasSound: true },
  { name: "Speed Stars", description: "Sprint, time your steps, and chase faster runs.", category: "Sports", hasSound: true },
  { name: "Stickman Hook", description: "Swing from point to point and keep your momentum going.", category: "Arcade", hasSound: true },
  { name: "SoFlo Wheelie Life", description: "Cruise around and practice your wheelies in an open driving world.", category: "Racing", hasSound: true }
];

const categories = ["All", ...Array.from(new Set(games.map((game) => game.category)))];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  function loadState() {
    try {
      setFavorites(JSON.parse(localStorage.getItem("vehemence_favorites") || "[]"));
      setRecent(JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]"));
    } catch {
      setFavorites([]);
      setRecent([]);
    }
  }

  useEffect(() => {
    loadState();
    const refresh = loadState;
    window.addEventListener("vehemence-games-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vehemence-games-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function toggleFavorite(name) {
    const next = favorites.includes(name) ? favorites.filter((item) => item !== name) : [...favorites, name];
    setFavorites(next);
    localStorage.setItem("vehemence_favorites", JSON.stringify(next));
    window.dispatchEvent(new Event("vehemence-games-changed"));
  }

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let result = games.filter((game) =>
      (!normalized || `${game.name} ${game.description} ${game.category}`.toLowerCase().includes(normalized)) &&
      (category === "All" || game.category === category)
    );

    if (sort === "A–Z") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Recently Played") result = [...result].sort((a, b) => (recent.indexOf(a.name) < 0 ? 99 : recent.indexOf(a.name)) - (recent.indexOf(b.name) < 0 ? 99 : recent.indexOf(b.name)));
    if (sort === "Favorites") result = [...result].sort((a, b) => Number(!favorites.includes(a.name)) - Number(!favorites.includes(b.name)));

    return result;
  }, [query, category, sort, favorites, recent]);

  const recentGames = recent.map((name) => games.find((game) => game.name === name)).filter(Boolean).slice(0, 3);
  const favoriteGames = games.filter((game) => favorites.includes(game.name));

  return (
    <main className="games-page">
      <div className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Games</h1>
          <p>Find something to play.</p>
        </div>
        <input className="game-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search games..." />
      </div>

      <div className="game-toolbar">
        <div className="game-filter-group">
          {categories.map((item) => (
            <button type="button" key={item} className={`game-filter ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <select className="game-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort games">
          <option>Popular</option>
          <option>Newest</option>
          <option>Recently Played</option>
          <option>A–Z</option>
          <option>Favorites</option>
        </select>
      </div>

      {recentGames.length > 0 && (
        <section className="game-section">
          <div className="section-title-row">
            <div><h2>Continue Playing</h2><p className="section-subtitle">Jump back into games you recently opened.</p></div>
          </div>
          <div className="game-grid">{recentGames.map((game) => <GameCard key={`recent-${game.name}`} game={game} favorite={favorites.includes(game.name)} onFavorite={toggleFavorite} />)}</div>
        </section>
      )}

      {favoriteGames.length > 0 && (
        <section className="game-section">
          <div className="section-title-row">
            <div><h2>Favorites</h2><p className="section-subtitle">Your saved games.</p></div>
          </div>
          <div className="game-grid">{favoriteGames.map((game) => <GameCard key={`favorite-${game.name}`} game={game} favorite onFavorite={toggleFavorite} />)}</div>
        </section>
      )}

      <section className="game-section">
        <div className="section-title-row">
          <div><h2>All Games</h2><p className="section-subtitle">Browse the full Vehemence library.</p></div>
          <span className="game-count">{filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}</span>
        </div>
        <div className="game-grid">
          {filteredGames.length ? filteredGames.map((game) => <GameCard key={game.name} game={game} favorite={favorites.includes(game.name)} onFavorite={toggleFavorite} />) : (
            <div className="empty-games"><p>No games match your search.</p><button className="secondary-button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear Filters</button></div>
          )}
        </div>
      </section>
    </main>
  );
}
