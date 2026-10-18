"use client";

import { useMemo, useState } from "react";

const thumbnailFor = (game) => {
  const palette = { Puzzle: ["#243b72", "#0f172a"], Classic: ["#166534", "#052e16"], Arcade: ["#7c2d12", "#431407"], Platformer: ["#075985", "#082f49"], Word: ["#365314", "#1a2e05"], Board: ["#475569", "#0f172a"], Casual: ["#9d174d", "#500724"], Racing: ["#9a3412", "#431407"] };
  const [a, b] = palette[game.category] || ["#334155", "#0f172a"];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="640" height="300" fill="url(#g)"/><circle cx="320" cy="150" r="180" fill="#fff" opacity=".06"/><text x="320" y="150" font-size="112" text-anchor="middle" dominant-baseline="middle">' + (game.cover || "🎮") + '</text><text x="24" y="270" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#fff" opacity=".8">VEHEMENCE ARCADE</text></svg>';
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

const games = [
  { id: "pacman", name: "Pac-Man", category: "Arcade", description: "Clear the maze, collect dots, and avoid the ghosts. Hosted directly on Vehemence.", source: "https://github.com/leereilly/games", cover: "🟡", playUrl: "/games/pacman/index.html" },
  { id: "2048", name: "2048", category: "Puzzle", description: "Merge matching number tiles and chase your best score.", source: "https://github.com/gabrielecirulli/2048", cover: "🔢", playUrl: "/games/2048/index.html" },
  { id: "snake", name: "Snake", category: "Classic", description: "Eat, grow, and avoid running into yourself.", source: "https://github.com/mashukui/web-games", cover: "🐍", playUrl: "/games/snake/index.html" },
  { id: "breakout", name: "Breakout", category: "Arcade", description: "Bounce the ball and break through the bricks.", source: "https://github.com/mashukui/web-games", cover: "🧱", playUrl: "/games/breakout/index.html" },
  { id: "minesweeper", name: "Minesweeper", category: "Puzzle", description: "Use logic to clear the grid without selecting a mine.", source: "https://github.com/mashukui/web-games", cover: "🚩", playUrl: "/games/minesweeper/index.html" },
  { id: "chess", name: "Tic-Tac-Toe", category: "Board", description: "Get three in a row before your opponent.", source: "https://github.com/mashukui/web-games", cover: "❌", playUrl: "/games/tic-tac-toe/index.html" },
  { id: "connect-four", name: "Connect Four", category: "Board", description: "Line up four discs to win.", source: "https://github.com/mashukui/web-games", cover: "🔴", playUrl: "/games/connect-four/index.html" },
  { id: "tetris", name: "Tetris", category: "Puzzle", description: "Stack falling blocks and clear complete lines.", source: "https://github.com/mashukui/web-games", cover: "🧩", playUrl: "/games/tetris/index.html" },
  { id: "cross-road", name: "Crossy Road-style", category: "Arcade", description: "Hop across roads and avoid traffic in this locally hosted arcade game.", source: "https://github.com/mashukui/web-games", cover: "🐔", playUrl: "/games/cross-road/index.html" },
  { id: "dino-dash", name: "Dino Dash", category: "Arcade", description: "Jump over obstacles and see how long you can last.", source: "https://github.com/mashukui/web-games", cover: "🦖", playUrl: "/games/dino-dash/index.html" },
  { id: "flappy-bird", name: "Flappy Bird", category: "Arcade", description: "Tap or press space to fly through the gaps.", source: "https://github.com/mashukui/web-games", cover: "🐤", playUrl: "/games/flappy-bird/index.html" },
  { id: "pong", name: "Pong", category: "Arcade", description: "Keep the ball in play and outscore your opponent.", source: "https://github.com/mashukui/web-games", cover: "🏓", playUrl: "/games/pong/index.html" },
];

const categories = ["All", ...new Set(games.map((game) => game.category))];

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);

  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <h1>Games</h1>
          <p className="games-intro">Open-source browser games, hosted on Vehemence.</p>
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

        {selectedGame && (
          <section className="games-player" aria-label={`Playing ${selectedGame.name}`}>
            <div className="games-player-header">
              <div><h2>{selectedGame.name}</h2><p>Running from Vehemence's own game files</p></div>
              <div className="games-player-header-actions"><a href={selectedGame.playUrl} target="_blank" rel="noreferrer">Open separately ↗</a><button type="button" onClick={() => setSelectedGame(null)} aria-label="Close game">Close game ✕</button></div>
            </div>
            <iframe className="games-player-frame" src={selectedGame.playUrl} title={selectedGame.name} allow="fullscreen; autoplay; gamepad" allowFullScreen />
          </section>
        )}
        <p className="games-results-count">{filteredGames.length} games</p>
        <div className="games-grid">
          {filteredGames.map((game) => (
            <article className="game-card" key={game.id}>
              <div className="game-card-art game-card-art-image">
                <img src={thumbnailFor(game)} alt={game.name + " thumbnail"} loading="lazy" />
              </div>
              <div className="game-card-copy">
                <p>{game.category}</p>
                <h2>{game.name}</h2>
                <span>{game.description}</span>
              </div>
              <div className="game-card-actions">
                <button type="button" className="primary-button" onClick={() => { setSelectedGame(game); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Play</button>
                <a href={game.source} target="_blank" rel="noreferrer">Code source ↗</a>
              </div>
            </article>
          ))}
        </div>

        {filteredGames.length === 0 && <p className="games-empty">No games found.</p>}
        <p className="games-footnote">Games launch inside this page using files hosted on Vehemence. Source links credit the open-source projects used as references.</p>
      </section>
    </main>
  );
}
