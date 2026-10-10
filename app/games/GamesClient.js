"use client";

import { useMemo, useState } from "react";

const collection = "https://github.com/mashukui/web-games";
const live = "https://mashukui.github.io/web-games";
const browserGames = "https://github.com/emjay045/browser-games";
const browserLive = "https://emjay045.github.io/browser-games";

const games = [
  { id: "2048", name: "2048", category: "Puzzle", description: "Merge the tiles and chase your best score.", source: "https://github.com/gabrielecirulli/2048", thumbnail: "https://cloud.githubusercontent.com/assets/1175750/8614312/280e5dc2-26f1-11e5-9f1f-5891c3ca8b26.png", playUrl: "/games/2048/index.html", local: true },
  { id: "snake", name: "Snake", category: "Classic", description: "Eat, grow, and try not to run into yourself.", source: collection, playUrl: live + "/snake/" },
  { id: "tetris", name: "Tetris", category: "Puzzle", description: "Fit the falling blocks and clear lines.", source: browserGames, playUrl: browserLive + "/tetris/" },
  { id: "wordle", name: "Wordle", category: "Word", description: "Guess the hidden five-letter word.", source: browserGames, playUrl: browserLive + "/wordle/" },
  { id: "minesweeper", name: "Minesweeper", category: "Puzzle", description: "Clear the board without hitting a mine.", source: collection, playUrl: live + "/minesweeper/" },
  { id: "breakout", name: "Breakout", category: "Arcade", description: "Bounce the ball and break every brick.", source: collection, playUrl: live + "/breakout/" },
  { id: "pong", name: "Pong", category: "Arcade", description: "A simple paddle duel against the computer.", source: browserGames, playUrl: browserLive + "/pong/" },
  { id: "flappy-bird", name: "Flappy Bird", category: "Arcade", description: "Tap or click to fly through the pipes.", source: browserGames, playUrl: browserLive + "/flappy-bird/" },
  { id: "dino-run", name: "Dino Run", category: "Arcade", description: "Jump over cacti and see how long you last.", source: collection, playUrl: live + "/dino-run/" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", category: "Classic", description: "Play against the computer or a friend.", source: collection, playUrl: live + "/tic-tac-toe/" },
  { id: "connect-four", name: "Connect Four", category: "Classic", description: "Line up four discs before the computer does.", source: collection, playUrl: live + "/connect-four/" },
  { id: "memory-match", name: "Memory Match", category: "Puzzle", description: "Flip cards and find all the matching pairs.", source: collection, playUrl: live + "/memory-match/" },
  { id: "star-defender", name: "Star Defender", category: "Action", description: "Survive waves of enemies in a space shooter.", source: collection, playUrl: live + "/star-defender/" },
  { id: "piano-tap", name: "Piano Tap", category: "Arcade", description: "Tap the right tiles before they pass you.", source: collection, playUrl: live + "/piano-tap/" },
  { id: "cross-road", name: "Cross Road", category: "Arcade", description: "Dodge traffic and make it across safely.", source: collection, playUrl: live + "/cross-road/" },
  { id: "slide-puzzle", name: "Slide Puzzle", category: "Puzzle", description: "Slide the tiles back into the right order.", source: collection, playUrl: live + "/slide-puzzle/" },
  { id: "fruit-slice", name: "Fruit Slice", category: "Arcade", description: "Slice fruit and build up your combo.", source: collection, playUrl: live + "/fruit-slice/" },
  { id: "bubble-shooter", name: "Bubble Shooter", category: "Puzzle", description: "Match bubbles and clear the board.", source: collection, playUrl: live + "/bubble-shooter/" },
  { id: "sudoku", name: "Sudoku", category: "Puzzle", description: "Fill the grid so every row and box works.", source: collection, playUrl: live + "/sudoku/" },
  { id: "merge-drop", name: "Merge Drop", category: "Puzzle", description: "Drop matching fruit and merge them together.", source: collection, playUrl: live + "/merge-drop/" },
  { id: "water-sort", name: "Water Sort", category: "Puzzle", description: "Sort the colours into separate tubes.", source: collection, playUrl: live + "/water-sort/" },
  { id: "slingshot", name: "Slingshot", category: "Arcade", description: "Aim your shot and try to hit the target.", source: collection, playUrl: live + "/slingshot/" },
  { id: "helix-drop", name: "Helix Drop", category: "Arcade", description: "Guide the ball down through the tower.", source: collection, playUrl: live + "/helix-drop/" },
  { id: "gem-match", name: "Gem Match", category: "Puzzle", description: "Match gems and chain together combos.", source: collection, playUrl: live + "/gem-match/" },
  { id: "maze-muncher", name: "Maze Muncher", category: "Arcade", description: "Collect every dot and avoid the ghosts.", source: collection, playUrl: live + "/maze-muncher/" },
  { id: "air-hockey", name: "Air Hockey", category: "Sports", description: "Play a quick air hockey match against AI.", source: collection, playUrl: live + "/air-hockey/" },
  { id: "reversi", name: "Reversi", category: "Classic", description: "Flip your opponent's pieces and control the board.", source: collection, playUrl: live + "/reversi/" },
  { id: "battleship", name: "Battleship", category: "Classic", description: "Find the hidden fleet before the computer finds yours.", source: collection, playUrl: live + "/battleship/" },
  { id: "sokoban", name: "Sokoban", category: "Puzzle", description: "Push every crate onto a target without getting stuck.", source: collection, playUrl: live + "/sokoban/" },
  { id: "lights-out", name: "Lights Out", category: "Puzzle", description: "Switch off every light with the fewest moves.", source: collection, playUrl: live + "/lights-out/" },
  { id: "ant-flap", name: "Ant Flap", category: "Arcade", description: "Fly through the gaps and avoid the branches.", source: collection, playUrl: live + "/ant-flap/" },
  { id: "ant-jump", name: "Ant Jump", category: "Arcade", description: "Bounce across platforms and keep climbing.", source: collection, playUrl: live + "/ant-jump/" },
  { id: "block-drop", name: "Block Drop", category: "Puzzle", description: "Stack falling blocks and clear the board.", source: collection, playUrl: live + "/block-drop/" },
  { id: "paddle-duel", name: "Paddle Duel", category: "Arcade", description: "Play a Pong-style match with three difficulty levels.", source: collection, playUrl: live + "/paddle-duel/" },
  { id: "stack-tower", name: "Stack Tower", category: "Arcade", description: "Stack blocks as accurately as you can.", source: collection, playUrl: live + "/stack-tower/" },
  { id: "whack-a-mole", name: "Whack-a-Mole", category: "Arcade", description: "Hit the moles, avoid the bombs, beat the timer.", source: collection, playUrl: live + "/whack-a-mole/" },
  { id: "t-rex-runner", name: "T-Rex Runner", category: "Arcade", description: "Jump over obstacles and see how far you get.", source: "https://github.com/wayou/t-rex-runner", thumbnail: "https://raw.githubusercontent.com/wayou/t-rex-runner/master/assets/screenshot.gif", playUrl: "https://wayou.github.io/t-rex-runner/" },
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
