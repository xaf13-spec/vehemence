"use client";

import { useMemo, useState } from "react";

const collection = "https://github.com/sausi-7/games";
const live = "https://sausi-7.github.io/games/";
const classicSource = "https://github.com/gabrielecirulli/2048";

const games = [
  { id: "2048", name: "2048", category: "Puzzle", description: "Merge the tiles and chase your best score.", source: classicSource, thumbnail: "https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png", playUrl: "/games/2048/index.html", local: true },
  { id: "geometry-dash-style", name: "Clone Dash", category: "Arcade", description: "A Geometry Dash-style platformer with levels and an editor.", source: "https://github.com/royashbrook/clonedash", thumbnail: "", playUrl: "https://clonedash.royashbrook.com" },
  { id: "tetris", name: "Tetris", category: "Puzzle", description: "Fit falling blocks and clear lines.", source: collection, playUrl: live + "games/puzzle/tetris/index.html" },
  { id: "snake", name: "Snake", category: "Classic", description: "Eat, grow, and try not to hit yourself.", source: collection, playUrl: live + "games/arcade/snake/index.html" },
  { id: "pacman", name: "Pac-Man", category: "Arcade", description: "Clear the maze and avoid the ghosts.", source: collection, playUrl: live + "games/arcade/pacman/index.html" },
  { id: "flappy-bird", name: "Flappy Bird", category: "Arcade", description: "Tap to fly through the gaps.", source: collection, playUrl: live + "games/arcade/flappy/index.html" },
  { id: "crossy-road", name: "Crossy Road", category: "Arcade", description: "Dodge traffic and get across safely.", source: collection, playUrl: live + "games/arcade/crossy-road/index.html" },
  { id: "doodle-jump", name: "Doodle Jump", category: "Platformer", description: "Keep bouncing upward and avoid falling.", source: collection, playUrl: live + "games/platformer/doodle-jump/index.html" },
  { id: "wordle", name: "Wordle", category: "Word", description: "Guess the hidden five-letter word.", source: collection, playUrl: live + "games/word-quiz/wordle/index.html" },
  { id: "breakout", name: "Breakout-style Breakoid", category: "Arcade", description: "Bounce the ball and clear the blocks.", source: collection, playUrl: live + "games/arcade/breakoid/index.html" },
  { id: "chess", name: "Chess", category: "Board", description: "Play a classic chess match against the computer.", source: collection, playUrl: live + "games/board/chess/index.html" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", category: "Board", description: "Get three in a row before your opponent.", source: collection, playUrl: live + "games/board/tic-tac-toe/index.html" },
  { id: "connect-four", name: "Connect Four", category: "Board", description: "Line up four discs to win.", source: collection, playUrl: live + "games/board/connect-four/index.html" },
  { id: "candy-crush", name: "Candy Crush-style Match", category: "Casual", description: "Match colorful pieces and clear the board.", source: collection, playUrl: live + "games/casual/candy-crush/index.html" },
  { id: "bubble-shooter", name: "Bubble Shooter", category: "Puzzle", description: "Match bubbles and clear the screen.", source: collection, playUrl: live + "games/casual/bubble-shooter/index.html" },
  { id: "basketball", name: "Basketball", category: "Sports", description: "Take shots and try to beat your score.", source: collection, playUrl: live + "games/sports/basketball/index.html" },
  { id: "football", name: "Football", category: "Sports", description: "Play a quick football mini-game.", source: collection, playUrl: live + "games/sports/football/index.html" },
  { id: "car-race", name: "Car Race", category: "Racing", description: "Dodge traffic and keep the race going.", source: collection, playUrl: live + "games/racing/car-race/index.html" },
  { id: "two-cars", name: "Two Cars", category: "Racing", description: "Control two cars and dodge obstacles at once.", source: collection, playUrl: live + "games/racing/two-cars/index.html" },
  { id: "road-fighter", name: "Road Fighter", category: "Racing", description: "Race down the road and avoid traffic.", source: collection, playUrl: live + "games/racing/road-fighter/index.html" },
  { id: "space-waves", name: "Space Waves-style", category: "Arcade", description: "Guide your ship through a tight obstacle course.", source: collection, playUrl: live + "games/arcade/space-waves/index.html" },
  { id: "space-fighter", name: "Space Fighter", category: "Shooter", description: "Take on waves of enemies in space.", source: collection, playUrl: live + "games/shooter/space-fighter/index.html" },
  { id: "fruit-merge", name: "Fruit Merge", category: "Casual", description: "Drop matching fruit and merge them together.", source: collection, playUrl: live + "games/casual/fruit-merge/index.html" },
  { id: "stack-tower", name: "Stack Tower 3D", category: "Arcade", description: "Stack blocks as high as you can.", source: collection, playUrl: live + "games/3d/stack-tower/index.html" },
  { id: "parkour", name: "Parkour", category: "Platformer", description: "Jump across platforms and make it to the end.", source: collection, playUrl: live + "games/platformer/parkour/index.html" },
  { id: "mario-like", name: "Mario-style Platformer", category: "Platformer", description: "Run and jump through a classic side-scrolling level.", source: collection, playUrl: live + "games/platformer/mario/index.html" },
  { id: "sudoku", name: "Sudoku", category: "Puzzle", description: "Fill the grid with numbers using logic.", source: collection, playUrl: live + "games/puzzle/sudoku/index.html" },
  { id: "memory-match", name: "Memory Cards", category: "Puzzle", description: "Flip cards and find matching pairs.", source: collection, playUrl: live + "games/puzzle/memory-cards/index.html" },
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
              <div><h2>{selectedGame.name}</h2><p>Playing on Vehemence</p></div>
              <button type="button" onClick={() => setSelectedGame(null)} aria-label="Close game">Close game ✕</button>
            </div>
            <iframe className="games-player-frame" src={selectedGame.playUrl} title={selectedGame.name} allow="fullscreen; autoplay; gamepad" allowFullScreen />
            <p className="games-player-note">If this game does not load here, its original host may block embedding; that game needs to be hosted directly on Vehemence.</p>
          </section>
        )}
        <p className="games-results-count">{filteredGames.length} games</p>
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
