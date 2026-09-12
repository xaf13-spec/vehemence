"use client";

import { useEffect, useMemo, useState } from "react";
import GameCard from "../components/GameCard";

const games = [
  { name: "Game 1", description: "Your first Vehemence game.", category: "Featured", hasSound: false },
  { name: "Game 2", description: "Another game to play.", category: "Action", hasSound: false },
  { name: "Game 3", description: "Something new to try.", category: "Adventure", hasSound: false }
];

const categories = ["All", ...Array.from(new Set(games.map((game) => game.category)))];

export default function Games() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  function loadState() {
    setFavorites(JSON.parse(localStorage.getItem("vehemence_favorites") || "[]"));
    setRecent(JSON.parse(localStorage.getItem("vehemence_recent_games") || "[]"));
  }

  useEffect(() => {
    loadState();
    const refresh = () => loadState();
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
    let result = games.filter((game) => {
      const matchesQuery = !normalized || `${game.name} ${game.description} ${game.category}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "All" || game.category === category;
      return matchesQuery && matchesCategory;
    });
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
        <div><p className="eyebrow">VEHEMENCE</p><h1>Games</h1><p>Find something to play.</p></div>
        <input className="game-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search games..." />
      </div>

      <div className="game-toolbar">
        <div className="game-filter-group">{categories.map((item) => <button type="button" key={item} className={`game-filter ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <select className="game-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort games"><option>Popular</option><option>Newest</option><option>Recently Played</option><option>A–Z</option><option>Favorites</option></select>
      </div>

      {recentGames.length > 0 && <section className="game-section"><div className="section-title-row"><div><h2>Continue Playing</h2><p className="section-subtitle">Jump back into games you recently opened.</p></div></div><div className="game-grid">{recentGames.map((game) => <GameCard key={`recent-${game.name}`} game={game} favorite={favorites.includes(game.name)} onFavorite={toggleFavorite} />)}</div></section>}

      {favoriteGames.length > 0 && <section className="game-section"><div className="section-title-row"><div><h2>Favorites</h2><p className="section-subtitle">Your saved games.</p></div></div><div className="game-grid">{favoriteGames.map((game) => <GameCard key={`favorite-${game.name}`} game={game} favorite onFavorite={toggleFavorite} />)}</div></section>}

      <section className="game-section"><div className="section-title-row"><div><h2>All Games</h2><p className="section-subtitle">Browse the full Vehemence library.</p></div><span className="game-count">{filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}</span></div><div className="game-grid">{filteredGames.length ? filteredGames.map((game) => <GameCard key={game.name} game={game} favorite={favorites.includes(game.name)} onFavorite={toggleFavorite} />) : <div className="empty-games"><p>No games match your search.</p><button className="secondary-button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear Filters</button></div>}</div></section>
    </main>
  );
}
