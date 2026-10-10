"use client";

import { useMemo, useState } from "react";

const games = [
  {
    id: "2048",
    name: "2048",
    category: "Puzzle",
    description: "Combine matching tiles and try to reach 2048.",
    source: "https://github.com/gabrielecirulli/2048",
    thumbnail: "https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png",
    license: "MIT",
    playUrl: "/games/2048/index.html",
  },
  {
    id: "t-rex-runner",
    name: "T-Rex Runner",
    category: "Arcade",
    description: "Jump over obstacles in the classic endless runner.",
    source: "https://github.com/wayou/t-rex-runner",
    thumbnail: "https://raw.githubusercontent.com/wayou/t-rex-runner/master/assets/screenshot.gif",
    license: "BSD-3-Clause",
  },
  {
    id: "snake",
    name: "Snake Game",
    category: "Arcade",
    description: "Eat food, grow longer, and beat your high score.",
    source: "https://github.com/kyroskoh/snake-game",
    thumbnail: "https://raw.githubusercontent.com/kyroskoh/snake-game/main/screenshot.png",
    license: "MIT (as stated in repository README)",
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    category: "Idle",
    description: "Grow a cookie empire in this classic incremental game.",
    source: "https://github.com/ozh/cookieclicker",
    thumbnail: "https://raw.githubusercontent.com/ozh/cookieclicker/master/img/perfectCookie.png",
    license: "Needs further license verification before hosting",
  },
  {
    id: "tiny-fishing",
    name: "Tiny Fishing",
    category: "Casual",
    description: "Cast your line and catch fish in this browser game.",
    source: "https://github.com/MajesticWafer/tiny-fishing",
    thumbnail: "https://raw.githubusercontent.com/MajesticWafer/tiny-fishing/master/thumbnail.png",
    license: "Needs further license verification before hosting",
  },
];

const categories = ["All games", ...new Set(games.map((game) => game.category))];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All games" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  return (
    <main className="games-page games-page-tech">
      <header className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE / ARCADE SYSTEM</p>
          <h1>Game <span>Grid</span></h1>
          <p className="games-intro">Real game projects from GitHub. Cards use the games' own project images, not custom-made artwork.</p>
        </div>
        <div className="games-count"><span className="games-count-dot" />{games.length} PROJECTS LISTED</div>
      </header>
      <section className="game-section">
        <div className="games-toolbar">
          <label className="games-search">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the grid..." aria-label="Search games" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="games-grid">
          {filteredGames.map((game) => (
            <article className="game-card game-card-tech" key={game.id}>
              <div className="game-card-art game-card-art-image">
                <img src={game.thumbnail} alt={game.name + " game thumbnail"} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              </div>
              <div className="game-card-copy">
                <p>{game.category}</p>
                <h2>{game.name}</h2>
                <span>{game.description}</span>
              </div>
              <div className="game-card-actions">
                {game.playUrl ? <a className="primary-button" href={game.playUrl}>Play now ↗</a> : <button type="button" className="primary-button" disabled title="This game needs a verified, locally hosted build before it can launch here">Not hosted yet</button>}
                <a href={game.source} target="_blank" rel="noreferrer" title="View original game project on GitHub">GitHub ↗</a>
              </div>
            </article>
          ))}
        </div>
        {filteredGames.length === 0 && <p className="games-empty">No games match that search.</p>}
      </section>
    </main>
  );
}
