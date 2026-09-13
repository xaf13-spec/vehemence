"use client";

const realGames = {
  "Retro Bowl": "https://retrobowl.me/play.html",
  "Slope": "https://www.crazygames.com/game/slope",
  "Rocket Goal": "https://rocket-goal.io/",
  "Geometry Dash": "https://geometrydash-pc.com/",
  "Eaglercraft": "https://eaglercraft.com/play?version=1.8.8-wasm",
  "Level Devil": "https://playleveldevil.com/",
  "Basketball Stars": "https://www.crazygames.com/game/basketball-stars-2019",
  "Minesweeper": "https://minesweeper.online/",
  "Worlde": "https://www.nytimes.com/games/wordle/index.html",
  "Slither.io": "https://slither.io/",
  "Chess": "https://lichess.org/",
  "Tetris": "https://play.tetris.com/",
  "Space Waves": "https://www.crazygames.com/game/space-waves",
};

function ExternalGame({ name, url }) {
  return (
    <div className="vb-center" style={{ padding: 0, gap: 0, position: "relative", overflow: "hidden" }}>
      <iframe
        src={url}
        title={name}
        allow="autoplay; fullscreen; gamepad; pointer-lock"
        allowFullScreen
        style={{ width: "100%", height: "100%", minHeight: 500, border: 0, display: "block" }}
      />
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <button
          type="button"
          className="vb-button"
          style={{ pointerEvents: "auto", background: "rgba(10,10,14,.92)" }}
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
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
  const url = realGames[game.name];
  return url ? <ExternalGame name={game.name} url={url} /> : <Unavailable name={game.name} />;
}
