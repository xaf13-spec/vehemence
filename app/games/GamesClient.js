"use client";

import { useEffect, useMemo, useState } from "react";

const sourceUrl = "https://github.com/xaf13-spec/vehemence/blob/main/app/games/GamesClient.js";

const clickers = [
  { id: "neon-tap", name: "Neon Tap", category: "Clickers", description: "Charge a neon core, upgrade your taps, and automate the grid.", icon: "⚡", color: "cyan", featured: true, type: "clicker" },
  { id: "cosmic-miner", name: "Cosmic Miner", category: "Clickers", description: "Mine stardust and build a self-running space operation.", icon: "☄️", color: "violet", featured: true, type: "clicker" },
  { id: "gem-rush", name: "Gem Rush", category: "Clickers", description: "Tap for gems, power up your tools, and stack passive income.", icon: "💎", color: "blue", type: "clicker" },
  { id: "cookie-lab", name: "Cookie Lab", category: "Clickers", description: "Cook up a ridiculous cookie empire, one tap at a time.", icon: "🍪", color: "amber", type: "clicker" },
  { id: "cyber-tycoon", name: "Cyber Tycoon", category: "Clickers", description: "Turn a tiny terminal into a high-tech money machine.", icon: "🖥️", color: "green", featured: true, type: "clicker" },
  { id: "star-forge", name: "Star Forge", category: "Clickers", description: "Forge stars and scale your cosmic production line.", icon: "🌟", color: "pink", type: "clicker" },
  { id: "pet-pixels", name: "Pet Pixels", category: "Clickers", description: "Collect pixel energy and upgrade your virtual companions.", icon: "🐾", color: "pink", type: "clicker" },
  { id: "quantum-clicker", name: "Quantum Clicker", category: "Clickers", description: "Bend the numbers with upgrades and quantum automation.", icon: "🧬", color: "violet", type: "clicker" },
  { id: "candy-stack", name: "Candy Stack", category: "Clickers", description: "Build a colourful candy factory with endless upgrades.", icon: "🍬", color: "pink", type: "clicker" },
  { id: "deep-sea-tapper", name: "Deep Sea Tapper", category: "Clickers", description: "Collect ocean energy and automate your underwater base.", icon: "🌊", color: "blue", type: "clicker" },
  { id: "pixel-farm", name: "Pixel Farm", category: "Clickers", description: "Grow pixel crops, harvest credits, and expand your farm.", icon: "🌱", color: "green", type: "clicker" },
  { id: "dungeon-coin", name: "Dungeon Coin", category: "Clickers", description: "Tap for loot, upgrade your gear, and build a gold reserve.", icon: "🪙", color: "amber", type: "clicker" }
];

const browserGames = [
  { id: "cookie-clicker", name: "Cookie Clicker", category: "Idle", description: "The classic browser idle game from its creator.", icon: "🍪", url: "https://orteil.dashnet.org/cookieclicker/", source: "https://github.com/ozh/cookieclicker", externalOnly: true, featured: true },
  { id: "tiny-fishing", name: "Tiny Fishing", category: "Casual", description: "Cast your line and see what you can catch.", icon: "🎣", url: "https://majesticwafer.github.io/tiny-fishing/", source: "https://github.com/MajesticWafer/tiny-fishing", externalOnly: true },
  { id: "2048", name: "2048", category: "Puzzle", description: "Combine tiles and chase the 2048 tile.", icon: "🔢", url: "https://play2048.co/", source: "https://github.com/gabrielecirulli/2048", externalOnly: true },
  { id: "snake", name: "Snake", category: "Arcade", description: "Eat, grow, and avoid your tail.", icon: "🐍", url: "https://kyroskoh.github.io/snake-game/", source: "https://github.com/kyroskoh/snake-game", externalOnly: true },
  { id: "dino", name: "Dino Runner", category: "Arcade", description: "Jump over obstacles in a fast endless runner.", icon: "🦖", url: "https://chromedino.com/", source: "https://github.com/wayou/t-rex-runner", externalOnly: true },
  { id: "chess", name: "Lichess", category: "Strategy", description: "Play chess against people or the computer.", icon: "♟️", url: "https://lichess.org/", source: "https://github.com/lichess-org/lila", externalOnly: true },
  { id: "existence-simulator", name: "Existence Simulator", category: "Idle", description: "An open-source incremental clicker project.", icon: "🌍", url: "https://jesselawson.itch.io/existence-simulator", source: "https://github.com/jesselawson/existence-simulator", externalOnly: true },
  { id: "society-fail", name: "Society Fail", category: "Idle", description: "A post-apocalyptic incremental clicker.", icon: "🏙️", url: "https://society.fail/", source: "https://github.com/Shpigford/society-fail", externalOnly: true },
  { id: "eaglercraft", name: "Eaglercraft", category: "Sandbox", description: "A community-made Minecraft browser project. Opens separately for compatibility.", icon: "⛏️", url: "https://g.eags.us/eaglercraft/", source: "https://github.com/LAX1DUDE/eaglercraft", externalOnly: true, featured: true }
];

const games = [...clickers, ...browserGames];
const categories = ["All games", ...new Set(games.map((game) => game.category))];
const freshSave = { coins: 0, clickPower: 1, autoPower: 0 };

function formatNumber(value) {
  return Math.floor(value).toLocaleString("en-US");
}

function BuiltinClicker({ game }) {
  const [save, setSave] = useState(freshSave);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vehemence_clicker_" + game.id);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSave({
          coins: Math.max(0, Number(parsed.coins) || 0),
          clickPower: Math.max(1, Number(parsed.clickPower) || 1),
          autoPower: Math.max(0, Number(parsed.autoPower) || 0)
        });
      } else {
        setSave(freshSave);
      }
    } catch {
      setSave(freshSave);
    }
    setReady(true);
  }, [game.id]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("vehemence_clicker_" + game.id, JSON.stringify(save)); } catch {}
  }, [game.id, ready, save]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      setSave((previous) => previous.autoPower > 0
        ? { ...previous, coins: previous.coins + previous.autoPower }
        : previous);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [game.id, ready]);

  const clickCost = Math.floor(20 * Math.pow(1.55, save.clickPower - 1));
  const autoCost = Math.floor(75 * Math.pow(1.5, save.autoPower));

  return <section className={"clicker-console clicker-" + game.color}>
    <div className="clicker-console-top"><span className="clicker-live-dot" /> LOCAL SAVE ACTIVE <span className="clicker-console-id">VEH / {game.id.toUpperCase()}</span></div>
    <div className="clicker-main">
      <div className="clicker-game-icon">{game.icon}</div>
      <p className="clicker-resource-label">TOTAL {game.name.toUpperCase()} CREDITS</p>
      <strong className="clicker-balance">{formatNumber(save.coins)}</strong>
      <p className="clicker-rate">+{formatNumber(save.autoPower)} / SEC <span>·</span> +{formatNumber(save.clickPower)} / TAP</p>
      <button type="button" className="clicker-tap-button" onClick={() => setSave((previous) => ({ ...previous, coins: previous.coins + previous.clickPower }))} aria-label={"Tap to earn credits in " + game.name}>
        <span>{game.icon}</span><strong>TAP TO EARN</strong><small>+{formatNumber(save.clickPower)} CREDITS</small>
      </button>
    </div>
    <div className="clicker-upgrades">
      <div className="clicker-upgrade-copy"><span>UPGRADE 01</span><strong>Power Tap</strong><small>Increase credits earned per tap.</small></div>
      <div className="clicker-upgrade-action"><small>COST {formatNumber(clickCost)}</small><button type="button" disabled={save.coins < clickCost} onClick={() => setSave((previous) => previous.coins >= clickCost ? { ...previous, coins: previous.coins - clickCost, clickPower: previous.clickPower + 1 } : previous)}>Upgrade <span>↗</span></button></div>
    </div>
    <div className="clicker-upgrades">
      <div className="clicker-upgrade-copy"><span>UPGRADE 02</span><strong>Auto Generator</strong><small>Earn credits every second automatically.</small></div>
      <div className="clicker-upgrade-action"><small>COST {formatNumber(autoCost)}</small><button type="button" disabled={save.coins < autoCost} onClick={() => setSave((previous) => previous.coins >= autoCost ? { ...previous, coins: previous.coins - autoCost, autoPower: previous.autoPower + 1 } : previous)}>Install <span>↗</span></button></div>
    </div>
    <div className="clicker-console-bottom"><span>POWER LEVEL <b>{save.clickPower}</b></span><span>GENERATORS <b>{save.autoPower}</b></span><button type="button" onClick={() => { if (window.confirm("Reset progress for " + game.name + "? This only resets this game's local save.")) setSave(freshSave); }}>Reset save</button></div>
  </section>;
}

export default function GamesClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All games");
  const [activeGame, setActiveGame] = useState(null);
  const filteredGames = useMemo(() => games.filter((game) =>
    (category === "All games" || game.category === category) &&
    (game.name + " " + game.description + " " + game.category).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  function launch(game) {
    try {
      const saved = { id: game.id, name: game.name, type: "game", playedAt: new Date().toISOString() };
      localStorage.setItem("vehemence_last_played", JSON.stringify(saved));
      window.dispatchEvent(new Event("vehemence-game-last-played"));
    } catch {}
    if (game.type === "clicker") {
      setActiveGame(game);
      return;
    }
    if (game.externalOnly) {
      window.open(game.url, "_blank", "noopener,noreferrer");
      return;
    }
    setActiveGame(game);
  }

  return <main className="games-page games-page-tech">
    <header className="games-header">
      <div><p className="eyebrow">VEHEMENCE / ARCADE SYSTEM</p><h1>Game <span>Grid</span></h1><p className="games-intro">Boot up a quick session. Your clicker progress saves on this device.</p></div>
      <div className="games-count"><span className="games-count-dot" />{games.length} GAMES AVAILABLE</div>
    </header>
    <section className="game-section">
      <div className="games-toolbar">
        <label className="games-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the grid..." aria-label="Search games" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      {activeGame && <section className="game-player">
        <div className="game-player-heading"><div><span>{activeGame.icon}</span><strong>{activeGame.name}</strong><small>{activeGame.type === "clicker" ? "VEHEMENCE ORIGINAL · LOCAL SAVE" : "BROWSER GAME"}</small></div><div className="game-player-actions">{activeGame.url && <a href={activeGame.url} target="_blank" rel="noreferrer">Open in new tab ↗</a>}<button type="button" onClick={() => setActiveGame(null)} aria-label="Close game">✕</button></div></div>
        {activeGame.type === "clicker" ? <BuiltinClicker key={activeGame.id} game={activeGame} /> : <><iframe title={activeGame.name} src={activeGame.url} allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /><p className="game-player-fallback">If this game blocks embedding, use <a href={activeGame.url} target="_blank" rel="noreferrer">Open in new tab ↗</a>.</p></>}
      </section>}
      <div className="games-grid">{filteredGames.map((game) => <article className={"game-card game-card-tech " + (game.featured ? "game-card-featured" : "")} key={game.id}>
        <div className={"game-card-art game-art-" + (game.color || game.category.toLowerCase().replace(/[^a-z]/g, "-"))}><span>{game.icon}</span>{game.featured && <small>FEATURED</small>}{game.type === "clicker" && <b>LOCAL GAME</b>}</div>
        <div className="game-card-copy"><p>{game.category}</p><h2>{game.name}</h2><span>{game.description}</span></div>
        <div className="game-card-actions"><button type="button" className="primary-button" onClick={() => launch(game)}>{game.type === "clicker" ? "Play now" : "Launch game"} <span>↗</span></button><a href={game.source || sourceUrl} target="_blank" rel="noreferrer" title="View source code on GitHub">GitHub ↗</a></div>
      </article>)}</div>
      {filteredGames.length === 0 && <p className="games-empty">No games match that search.</p>}
    </section>
  </main>;
}
