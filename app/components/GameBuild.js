"use client";

const realGames = {
  "Retro Bowl": {
    url: "https://www.miniplay.com/game/retro-bowl",
    embedUrl: "https://www.miniplay.com/embed/retro-bowl",
  },
  "Slope": {
    url: "https://www.bubbleshooter.net/slope/",
    embedUrl: "https://www.bubbleshooter.net/embed.php?id=460",
  },
  "Rocket Goal": {
    url: "https://www.miniplay.com/game/rocket-goal",
    embedUrl: "https://www.miniplay.com/embed/rocket-goal",
  },
  "Geometry Dash": {
    url: "https://www.miniplay.com/game/geometry-dash",
    embedUrl: "https://www.miniplay.com/embed/geometry-dash",
  },
  "Eaglercraft": {
    url: "https://www.miniplay.com/game/eaglercraft-minecraft-online",
    embedUrl: "https://www.miniplay.com/embed/eaglercraft-minecraft-online",
  },
  "Level Devil": {
    url: "https://www.miniplay.com/game/level-devil",
    embedUrl: "https://www.miniplay.com/embed/level-devil",
  },
  "Basketball Stars": {
    url: "https://www.bubbleshooter.net/game/basketball-stars/",
    embedUrl: "https://www.bubbleshooter.net/embed.php?id=1228",
  },
  "Minesweeper": {
    url: "https://play-minesweeper.games/",
    embedUrl: "https://play-minesweeper.games/embed/?size=beginner&theme=dark",
  },
  "Worlde": {
    url: "https://www.nytimes.com/games/wordle/index.html",
    embedUrl: null,
    embedUnsupported: true,
  },
  "Slither.io": {
    url: "https://www.gameflare.com/online-game/slitherio/",
    embedUrl: "https://www.gameflare.com/embed/slitherio/",
  },
  "Tetris": {
    url: "https://classicarcade.games/games/nes/tetris/",
    embedUrl: "https://classicarcade.games/games/nes/tetris?embed=1",
  },
  "FNAF": {
    url: "https://www.miniplay.com/game/five-nights-at-freddys",
    embedUrl: "https://www.miniplay.com/embed/five-nights-at-freddys",
  },
  "Subway Surfers": {
    url: "https://www.miniplay.com/game/subway-surfers",
    embedUrl: "https://www.miniplay.com/embed/subway-surfers",
  },
  "Space Waves": {
    url: "https://www.miniplay.com/game/space-waves",
    embedUrl: "https://www.miniplay.com/embed/space-waves",
  },
  "Speed Stars": {
    url: "https://www.play-games.com/game/39311/speed-stars.html",
    embedUrl: "https://www.play-games.com/iframe/39311.html",
  },
  "Google Baseball": {
    url: "https://www.google.com/doodles/fourth-of-july-2019",
    embedUrl: null,
    embedUnsupported: true,
  },
  "Google Snake": {
    url: "https://www.google.com/search?q=snake+game",
    embedUrl: null,
    embedUnsupported: true,
  },
  "Google Pac-Man": {
    url: "https://www.google.com/logos/2010/pacman10-i.html",
    embedUrl: null,
    embedUnsupported: true,
  },
  "Tomb of the Mask": {
    url: "https://www.miniplay.com/game/tomb-of-the-mask",
    embedUrl: "https://www.miniplay.com/embed/tomb-of-the-mask",
  },
};

function EmbedUnsupported({ name, url }) {
  return (
    <div className="vb-center">
      <span className="settings-eyebrow">VEHEMENCE GAME</span>
      <h2>{name}</h2>
      <p>This game host does not provide a browser-safe iframe endpoint.</p>
      <button type="button" className="vb-button" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
        Open game
      </button>
    </div>
  );
}

function ExternalGame({ name, config }) {
  const embedUrl = config.embedUrl || config.url;

  return (
    <div className="vb-center" style={{ padding: 0, gap: 0, position: "relative", overflow: "hidden" }}>
      <iframe
        src={embedUrl}
        title={name}
        allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-write; web-share"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ width: "100%", height: "100%", minHeight: 500, border: 0, display: "block" }}
      />
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <button type="button" className="vb-button" style={{ pointerEvents: "auto", background: "rgba(10,10,14,.92)" }} onClick={() => window.open(config.url, "_blank", "noopener,noreferrer")}>
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
  if (!config) return <Unavailable name={game.name} />;
  if (config.embedUnsupported) return <EmbedUnsupported name={game.name} url={config.url} />;
  return <ExternalGame name={game.name} config={config} />;
}
