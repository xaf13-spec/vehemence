"use client";

import { useMemo, useState } from "react";

const games = [
  {
    id: "2048",
    name: "2048",
    category: "Puzzle",
    description: "Combine the tiles and reach 2048.",
    source: "https://github.com/gabrielecirulli/2048",
    thumbnail: "https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png",
    playUrl: "/games/2048/index.html",
  },
  {
    id: "t-rex-runner",
    name: "T-Rex Runner",
    category: "Arcade",
    description: "Jump over obstacles and see how far you can get.",
    source: "https://github.com/wayou/t-rex-runner",
    thumbnail: "https://raw.githubusercontent.com/wayou/t-rex-runner/master/assets/screenshot.gif",
  },
  {
    id: "snake",
    name: "Snake",
    category: "Arcade",
    description: "Eat, grow, and try to beat your high score.",
    source: "https://github.com/kyroskoh/snake-game",
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Clicker",
    description: "Build a cookie empire, one click at a time.",
    source: "https://github.com/ozh/cookieclicker",
    thumbnail: "https://raw.githubusercontent.com/ozh/cookieclicker/master/img/perfectCookie.png",
  },
  {
    id: "tiny-fishing",
    name: "Tiny Fishing",
    category: "Casual",
    description: "Cast a line and see what you catch.",
    source: "https://github.com/MajesticWafer/tiny-fishing",
  },
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <h1>Games</h1>
          <p className="games-intro">Find something to play.</p>
        </div>
      </header>

      <section className="game-section">
        <div className="games-toolbar">
          <label className="games-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games" aria-label="Search games" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter games by category">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="games-grid">
          {filteredGames.map((game) => (
            <article className="game-card" key={game.id}>
              {game.thumbnail ? (
                <div className="game-card-art game-card-art-image">
                  <img src={game.thumbnail} alt={game.name} loading="lazy" onError={(event) => { event.currentTarget.closest(".game-card-art").style.display = "none"; }} />
                </div>
              ) : null}
              <div className="game-card-copy">
                <p>{game.category}</p>
                <h2>{game.name}</h2>
                <span>{game.description}</span>
              </div>
              <div className="game-card-actions">
                {game.playUrl ? (
                  <a className="primary-button" href={game.playUrl}>Play</a>
                ) : (
                  <button type="button" className="primary-button" disabled title="The locally hosted game build is not ready yet">Coming soon</button>
                )}
                <a href={game.source} target="_blank" rel="noreferrer">Source</a>
              </div>
            </article>
          ))}
        </div>

        {filteredGames.length === 0 && <p className="games-empty">No games found.</p>}
      </section>
    </main>
  );
}
