"use client";

const realGames = {
  "Retro Bowl": {
    url: "https://retrobowl.me/play.html",
    embedUrl: "https://retrobowl.me/play.html",
  },
  "Slope": {
    url: "https://www.rocketgames.io/game/slope",
    embedUrl: "https://www.rocketgames.io/game/slope",
  },
  "Rocket Goal": {
    url: "https://www.rocketgames.io/game/rocket-goal-io",
    embedUrl: "https://www.rocketgames.io/game/rocket-goal-io",
  },
  "Geometry Dash": {
    url: "https://www.rocketgames.io/game/geometry-dash",
    embedUrl: "https://www.rocketgames.io/game/geometry-dash",
  },
  "Eaglercraft": {
    url: "https://eaglercraft.com/play?version=1.8.8-wasm",
    embedUrl: "https://eaglercraft.com/play?version=1.8.8-wasm",
  },
  "Level Devil": {
    url: "https://playleveldevil.com/",
    embedUrl: "https://playleveldevil.com/",
  },
  "Basketball Stars": {
    url: "https://www.rocketgames.io/game/basketball-stars-2026",
    embedUrl: "https://www.rocketgames.io/game/basketball-stars-2026",
  },
  "Minesweeper": {
    url: "https://play-minesweeper.games/",
    embedUrl: "https://play-minesweeper.games/embed/?size=beginner&theme=dark",
  },
  "Worlde": {
    url: "https://www.rocketgames.io/game/wordle",
    embedUrl: "https://www.rocketgames.io/game/wordle",
  },
  "Slither.io": {
    url: "https://slither.io/",
    embedUrl: "https://slither.io/",
  },
  "Chess": {
    url: "https://lichess.org/",
    embedUrl: "https://lichess.org/embed/game/4mwG9f8J?theme=auto&bg=auto",
  },
  "Tetris": {
    url: "https://play.tetris.com/",
    embedUrl: "https://play.tetris.com/",
  },
  "FNAF": {
    url: "https://www.freddy-fnaf.com/",
    embedUrl: "https://www.freddy-fnaf.com/",
  },
  "Subway Surfers": {
    url: "https://www.rocketgames.io/game/subway-surfers-multiplayer",
    embedUrl: "https://www.rocketgames.io/game/subway-surfers-multiplayer",
  },
  "Space Waves": {
    url: "https://www.crazygames.com/game/space-waves",
    embedUrl: "https://www.crazygames.com/game/space-waves",
  },
  "Speed Stars": {
    url: "https://www.rocketgames.io/game/speed-stars",
    embedUrl: "https://www.rocketgames.io/game/speed-stars",
  },
};

function ExternalGame({ name, config }) {
  const embedUrl = config.embedUrl || config.url;

  return (
    <div className="vb-center" style={{ padding: 0, gap: 0, position: "relative", overflow: "hidden" }}>
      <iframe
        src={embedUrl}
        title={name}
        allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-write"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        loading="eager"
        style={{ width: "100%", height: "100%", minHeight: 500, border: 0, display: "block" }}
      />
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <button
          type="button"
          className="vb-button"
          style={{ pointerEvents: "auto", background: "rgba(10,10,14,.92)" }}
          onClick={() => window.open(config.url, "_blank", "noopener,noreferrer")}
        >
          Open directly
        </button>
      </div>
    </div>
  );
}

function Unavailable({ name }) {
  return (
    <div className="vb-center">
      <span className="settings-eyebrow">VEHEMENCE GAME</span>
      <h2>{name}</h2>
      <p>There isn't a verified browser build available for this title in Vehemence right now.</p>
    </div>
  );
}

export default function GameBuild({ game }) {
  const config = realGames[game.name];
  return config ? <ExternalGame name={game.name} config={config} /> : <Unavailable name={game.name} />;
}
