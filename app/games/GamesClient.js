"use client";

import { useMemo, useState } from "react";

const collection = "https://github.com/sausi-7/games";
const live = "https://sausi-7.github.io/games/";
const classicSource = "https://github.com/gabrielecirulli/2048";
const thumbnailFor = (game) => {
  const palette = { Puzzle: ["#243b72", "#0f172a"], Classic: ["#166534", "#052e16"], Arcade: ["#7c2d12", "#431407"], Platformer: ["#075985", "#082f49"], Word: ["#365314", "#1a2e05"], Board: ["#475569", "#0f172a"], Casual: ["#9d174d", "#500724"], Sports: ["#166534", "#052e16"], Racing: ["#9a3412", "#431407"], Shooter: ["#4338ca", "#1e1b4b"] };
  const [a, b] = palette[game.category] || ["#334155", "#0f172a"];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="640" height="300" fill="url(#g)"/><circle cx="320" cy="150" r="180" fill="#fff" opacity=".06"/><path d="M0 252 Q160 220 320 260 T640 245 V300 H0Z" fill="#000" opacity=".18"/><text x="320" y="165" font-size="112" text-anchor="middle" dominant-baseline="middle">' + (game.cover || "🎮") + '</text><text x="24" y="270" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#fff" opacity=".8">VEHEMENCE ARCADE</text></svg>';
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};

const games = [
  { id: "moto-x3m", name: "Moto X3M", category: "Racing", description: "The recognizable bike stunt racer with ramps, loops, and timed levels.", source: "https://games.famobi.com/moto-x3m", thumbnail: "https://img.cdn.famobi.com/portal/html5games/images/tmp/MotoX3mTeaser.jpg", cover: "🏍️", playUrl: "https://play.famobi.com/moto-x3m" },
  { id: "moto-x3m-pool-party", name: "Moto X3M Pool Party", category: "Racing", description: "The summer edition of Moto X3M with waterpark tracks and stunts.", source: "https://games.famobi.com/moto-x3m-pool-party", cover: "🌊", playUrl: "https://play.famobi.com/moto-x3m-pool-party" },
  { id: "moto-x3m-winter", name: "Moto X3M Winter", category: "Racing", description: "A winter-themed Moto X3M bike-racing edition.", source: "https://www.x3mmoto.com/games/winter/", cover: "❄️", playUrl: "https://www.x3mmoto.com/games/winter/", externalOpenUrl: "https://www.x3mmoto.com/games/winter/" },
  { id: "eaglercraft", name: "Eaglercraft", category: "Sandbox", description: "A Minecraft-style browser sandbox.", source: "https://github.com/LAX1DUDE/eaglercraft", cover: "⛏️", playUrl: "https://dev.eaglercraft.com/play?version=1.8.8", externalOpenUrl: "https://dev.eaglercraft.com/play?version=1.8.8" },
  { id: "2048", name: "2048", category: "Puzzle", description: "Merge matching number tiles and chase your best score.", source: classicSource, cover: "🔢", thumbnail: "https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png", playUrl: "/games/2048/index.html", local: true },
  { id: "snake", name: "Snake", category: "Classic", description: "Eat, grow, and avoid running into yourself.", source: "https://github.com/mashukui/web-games", cover: "🐍", playUrl: "/games/snake/index.html" },
  { id: "pacman", name: "Pac-Man", category: "Arcade", description: "Clear the maze and avoid the ghosts.", source: collection, cover: "👻", playUrl: live + "games/arcade/pacman/index.html" },
  { id: "wordle", name: "Wordle-style Word Puzzle", category: "Word", description: "Guess the hidden five-letter word.", source: collection, cover: "🔤", playUrl: live + "games/word-quiz/wordle/index.html" },
  { id: "breakout", name: "Breakout", category: "Arcade", description: "Bounce the ball and break through the bricks.", source: "https://github.com/mashukui/web-games", cover: "🧱", playUrl: "/games/breakout/index.html" },
  { id: "minesweeper", name: "Minesweeper", category: "Puzzle", description: "Use logic to clear the grid without selecting a mine.", source: "https://github.com/mashukui/web-games", cover: "💣", playUrl: "/games/minesweeper/index.html" },
  { id: "chess", name: "Chess", category: "Board", description: "A classic strategy game against the computer.", source: collection, cover: "♟️", playUrl: live + "games/board/chess/index.html" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", category: "Board", description: "Get three in a row before your opponent.", source: "https://github.com/mashukui/web-games", cover: "❌", playUrl: "/games/tic-tac-toe/index.html" },
  { id: "connect-four", name: "Connect Four", category: "Board", description: "Line up four discs to win.", source: "https://github.com/mashukui/web-games", cover: "🔴", playUrl: "/games/connect-four/index.html" },
  { id: "tetris-style", name: "Tetris-style Blocks", category: "Puzzle", description: "Stack falling blocks and clear complete lines.", source: "https://github.com/mashukui/web-games", cover: "🧱", playUrl: "/games/tetris/index.html" },
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

        {selectedGame && (
          <section className="games-player" aria-label={`Playing ${selectedGame.name}`}>
            <div className="games-player-header">
              <div><h2>{selectedGame.name}</h2><p>{selectedGame.externalOpenUrl ? "If it is blocked here, open the game directly." : "Playing on Vehemence"}</p></div>
              <div className="games-player-header-actions">{selectedGame.externalOpenUrl && <a href={selectedGame.externalOpenUrl} target="_blank" rel="noreferrer">Open game ↗</a>}<button type="button" onClick={() => setSelectedGame(null)} aria-label="Close game">Close game ✕</button></div>
            </div>
            <iframe className="games-player-frame" src={selectedGame.playUrl} title={selectedGame.name} allow="fullscreen; autoplay; gamepad" allowFullScreen />
            <p className="games-player-note">If this game does not load here, its original host may block embedding; that game needs to be hosted directly on Vehemence.</p>
          </section>
        )}
        <p className="games-results-count">{filteredGames.length} games</p>
        <div className="games-grid">
          {filteredGames.map((game) => (
            <article className="game-card" key={game.id}>
              <div className="game-card-art game-card-art-image">
                <img src={game.thumbnail || thumbnailFor(game)} alt={game.name + " thumbnail"} loading="lazy" />
              </div>
              <div className="game-card-copy">
                <p>{game.category}</p>
                <h2>{game.name}</h2>
                <span>{game.description}</span>
              </div>
              <div className="game-card-actions">
                <button type="button" className="primary-button" onClick={() => { setSelectedGame(game); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Play</button>
                <a href={game.source} target="_blank" rel="noreferrer">Source</a>
              </div>
            </article>
          ))}
        </div>

        {filteredGames.length === 0 && <p className="games-empty">No games found.</p>}
        <p className="games-footnote">Games launch in the player above. Source code is linked on each card.</p>
      </section>
    </main>
  );
}
