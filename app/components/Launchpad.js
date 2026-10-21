"use client";

import { useEffect, useMemo, useState } from "react";

const featured = [
  { id: "pacman", name: "Pac-Man", category: "Arcade", note: "Classic maze chase", icon: "◉" },
  { id: "snake", name: "Snake", category: "Classic", note: "One more run", icon: "〰" },
  { id: "2048", name: "2048", category: "Puzzle", note: "Think a few moves ahead", icon: "▦" },
  { id: "dino-run", name: "Dino Run", category: "Arcade", note: "Beat your best run", icon: "♞" },
  { id: "minesweeper", name: "Minesweeper", category: "Puzzle", note: "Trust the numbers", icon: "▧" },
  { id: "breakout", name: "Breakout", category: "Arcade", note: "Clear the whole board", icon: "▥" },
];
const themePacks = [
  { id: "midnight", name: "Midnight", color: "#9d8cff", theme: "Midnight" },
  { id: "ocean", name: "Ocean", color: "#5bc9e8", theme: "Ocean" },
  { id: "sunset", name: "Sunset", color: "#ff986e", theme: "Sunset" },
  { id: "forest", name: "Forest", color: "#65d6a0", theme: "Forest" },
  { id: "lavender", name: "Lavender", color: "#d0a5ff", theme: "Lavender" },
];
const readJson = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value ?? fallback; } catch { return fallback; }
};
const todayKey = () => new Date().toISOString().slice(0, 10);
const levelFor = (xp) => Math.floor(Math.max(0, xp) / 250) + 1;

export default function Launchpad({ user, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [widgets, setWidgets] = useState({ quests: true, achievements: true, themes: true, timeline: true });
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [dailyGame, setDailyGame] = useState(featured[0]);
  const [customTheme, setCustomTheme] = useState("Midnight");
  const [rooms, setRooms] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [userId, setUserId] = useState(null);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [challengeUsername, setChallengeUsername] = useState("");
  const [challengeGameId, setChallengeGameId] = useState("pacman");
  const [platformMessage, setPlatformMessage] = useState("");
  const [platformError, setPlatformError] = useState("");
  const [platformBusy, setPlatformBusy] = useState(false);

  const sync = () => {
    const entries = readJson("vehemence_game_history", []);
    const recent = Array.isArray(entries) ? entries.slice(0, 12) : [];
    setHistory(recent);
    setLastPlayed(readJson("vehemence_last_played", null));
    const progress = readJson("vehemence_progress", { xp: 0, completed: [], day: todayKey() });
    const today = todayKey();
    if (progress.day !== today) {
      progress.day = today;
      progress.completed = [];
      localStorage.setItem("vehemence_progress", JSON.stringify(progress));
    }
    setXp(Number(progress.xp) || 0);
    setCompleted(Array.isArray(progress.completed) ? progress.completed : []);
    setFavorites(readJson("vehemence_favorites", []));
    setWidgets({ quests: true, achievements: true, themes: true, timeline: true, ...readJson("vehemence_dashboard_widgets", {}) });
    setCustomTheme(localStorage.getItem("vehemence_theme") || "Midnight");
    const seed = Number(today.replaceAll("-", "")) % featured.length;
    setDailyGame(featured[seed]);
  };

  async function refreshPlatform() {
    if (!user) return;
    const [roomResult, challengeResult] = await Promise.all([listPartyRooms(), listChallenges()]);
    if (roomResult?.rooms) setRooms(roomResult.rooms);
    if (roomResult?.userId) setUserId(roomResult.userId);
    if (challengeResult?.challenges) setChallenges(challengeResult.challenges);
    if (challengeResult?.userId) setUserId(challengeResult.userId);
  }

  async function handleCreateRoom() {
    setPlatformBusy(true); setPlatformError(""); setPlatformMessage("");
    const result = await createPartyRoom(dailyGame.id, dailyGame.name);
    if (result?.error) setPlatformError(result.error);
    else { setPlatformMessage(`Room created. Share code ${result.room.code} with your friends.`); await refreshPlatform(); }
    setPlatformBusy(false);
  }
  async function handleJoinRoom(event) {
    event.preventDefault(); setPlatformBusy(true); setPlatformError(""); setPlatformMessage("");
    const result = await joinPartyRoom(roomCodeInput);
    if (result?.error) setPlatformError(result.error);
    else { setPlatformMessage(`Joined room for ${result.room.game_name}.`); setRoomCodeInput(""); await refreshPlatform(); }
    setPlatformBusy(false);
  }
  async function handleChallenge(event) {
    event.preventDefault(); setPlatformBusy(true); setPlatformError(""); setPlatformMessage("");
    const game = featured.find((item) => item.id === challengeGameId) || featured[0];
    const result = await challengeUser(challengeUsername, game.id, game.name);
    if (result?.error) setPlatformError(result.error);
    else { setPlatformMessage(`Challenge sent to ${result.username}.`); setChallengeUsername(""); await refreshPlatform(); }
    setPlatformBusy(false);
  }
  async function handleChallengeResponse(id, accept) {
    setPlatformBusy(true); setPlatformError(""); setPlatformMessage("");
    const result = await respondToChallenge(id, accept);
    if (result?.error) setPlatformError(result.error);
    else { setPlatformMessage(accept ? "Challenge accepted." : "Challenge declined."); await refreshPlatform(); }
    setPlatformBusy(false);
  }
  async function handleCloseRoom(id) {
    setPlatformBusy(true); setPlatformError(""); setPlatformMessage("");
    const result = await closePartyRoom(id);
    if (result?.error) setPlatformError(result.error);
    else { setPlatformMessage("Party room closed."); await refreshPlatform(); }
    setPlatformBusy(false);
  }

  useEffect(() => {
    sync();
    if (user) refreshPlatform().catch(() => {});
    window.addEventListener("storage", sync);
    window.addEventListener("vehemence-game-last-played", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vehemence-game-last-played", sync);
    };
  }, [user?.id]);

  const level = levelFor(xp);
  const levelProgress = (xp % 250) / 250 * 100;
  const uniquePlayed = new Set(history.map((game) => game.id || game.name)).size;
  const quests = [
    { id: "launch", title: "Start a game", detail: "Open any game from the library.", reward: 25, done: completed.includes("launch") },
    { id: "variety", title: "Try something different", detail: "Play 2 different games today.", reward: 50, done: completed.includes("variety") },
    { id: "return", title: "Keep your streak alive", detail: "Check out today's featured game.", reward: 35, done: completed.includes("return") },
  ];
  const achievements = [
    { id: "first", title: "First Launch", detail: "Play your first game.", unlocked: history.length > 0 },
    { id: "collector", title: "Collector", detail: "Try 5 different games.", unlocked: uniquePlayed >= 5 },
    { id: "explorer", title: "Explorer", detail: "Try 10 different games.", unlocked: uniquePlayed >= 10 },
  ];
  const visibleHistory = history.slice(0, 5);
  const favoritedGames = useMemo(() => featured.filter((game) => favorites.includes(game.id)), [favorites]);

  function saveProgress(next) {
    localStorage.setItem("vehemence_progress", JSON.stringify(next));
    setXp(next.xp);
    setCompleted(next.completed);
  }
  function claimQuest(quest) {
    if (quest.done) return;
    const progress = readJson("vehemence_progress", { xp: 0, completed: [], day: todayKey() });
    if (progress.day !== todayKey()) { progress.day = todayKey(); progress.completed = []; }
    if (quest.id === "launch" && history.length < 1) { setNotice("Open a game first to complete this quest."); return; }
    if (quest.id === "variety" && uniquePlayed < 2) { setNotice("Play two different games first."); return; }
    if (quest.id === "return" && lastPlayed?.id !== dailyGame.id) { setNotice("Open today's featured game from the Games page first."); return; }
    progress.xp = (Number(progress.xp) || 0) + quest.reward;
    progress.completed = [...new Set([...(progress.completed || []), quest.id])];
    saveProgress(progress);
    setNotice(`+${quest.reward} XP earned.`);
  }
  function toggleFavorite(game) {
    const next = favorites.includes(game.id) ? favorites.filter((id) => id !== game.id) : [...favorites, game.id];
    localStorage.setItem("vehemence_favorites", JSON.stringify(next));
    setFavorites(next);
  }
  function applyTheme(pack) {
    localStorage.setItem("vehemence_theme", pack.theme);
    localStorage.setItem("vehemence_theme_workshop_pack", pack.id);
    setCustomTheme(pack.theme);
    window.dispatchEvent(new Event("vehemence-settings-changed"));
    setNotice(`${pack.name} theme applied.`);
  }
  function toggleWidget(id) {
    const next = { ...widgets, [id]: !widgets[id] };
    setWidgets(next);
    localStorage.setItem("vehemence_dashboard_widgets", JSON.stringify(next));
  }
  function openGame(game) {
    try { localStorage.setItem("vehemence_featured_pick", JSON.stringify(game)); } catch {}
    window.dispatchEvent(new Event("vehemence-open-game"));
    onNavigate("/games");
  }

  return (
    <main className="launchpad-page">
      <header className="launchpad-topline">
        <div><p className="eyebrow">VEHEMENCE / YOUR SPACE</p><h1>Ready when you are<span>.</span></h1><p className="launchpad-subtitle">Your games, your progress, your setup — all in one place.</p></div>
        <div className="launchpad-top-actions"><span className="launchpad-level-chip"><span>✦</span> LEVEL {level}</span><button className="secondary-button" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Done customizing" : "Customize dashboard"}</button></div>
      </header>

      {notice && <div className="launchpad-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

      <section className="launchpad-hero">
        <div className="launchpad-hero-copy"><span className="launchpad-kicker"><i /> TODAY'S DROP</span><p className="launchpad-hero-label">FEATURED GAME</p><h2>{dailyGame.name}</h2><p>{dailyGame.note}. A new pick every day, ready to launch.</p><div className="launchpad-hero-actions"><button className="launchpad-primary" type="button" onClick={() => openGame(dailyGame)}>Play today's pick <span>↗</span></button><button className="launchpad-ghost" type="button" onClick={() => onNavigate("/games")}>Explore all games</button></div></div>
        <div className="launchpad-hero-art" aria-hidden="true"><div className="launchpad-orbit orbit-a" /><div className="launchpad-orbit orbit-b" /><div className="launchpad-feature-symbol">{dailyGame.icon}</div><span className="launchpad-art-tag">{dailyGame.category.toUpperCase()} / DAILY PICK</span></div>
      </section>

      <section className="launchpad-progress-row">
        <article className="launchpad-progress-card"><div className="launchpad-card-heading"><span className="launchpad-card-icon">✦</span><span>YOUR PROGRESS</span><span className="launchpad-card-muted">{xp} XP</span></div><div className="launchpad-level-row"><div><small>LEVEL</small><strong>{level}</strong></div><div className="launchpad-level-copy"><b>{250 - (xp % 250)} XP to level {level + 1}</b><span>Every level unlocks another milestone.</span></div></div><div className="launchpad-progress-track"><span style={{ width: `${levelProgress}%` }} /></div><div className="launchpad-progress-foot"><span>Level {level}</span><span>{xp % 250} / 250 XP</span></div></article>
        <article className="launchpad-stat-card"><span className="launchpad-stat-icon">▦</span><span className="launchpad-stat-label">GAMES TRIED</span><strong>{uniquePlayed}</strong><p>Different games in your history</p></article>
        <article className="launchpad-stat-card"><span className="launchpad-stat-icon">◷</span><span className="launchpad-stat-label">RECENT ACTIVITY</span><strong>{history.length}</strong><p>Recent launches on this browser</p></article>
      </section>

      {editing && <section className="launchpad-widget-editor"><div><strong>Dashboard layout</strong><p>Choose which panels stay on your home screen.</p></div>{[{id:"quests",label:"Daily quests"},{id:"achievements",label:"Achievements"},{id:"themes",label:"Theme workshop"},{id:"timeline",label:"Gaming timeline"}].map((item) => <label key={item.id}><input type="checkbox" checked={Boolean(widgets[item.id])} onChange={() => toggleWidget(item.id)} /> {item.label}</label>)}</section>}

      <section className="launchpad-columns">
        <div className="launchpad-main-column">
          <section className="launchpad-section">
            <div className="launchpad-section-heading"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Continue playing</h2></div><button type="button" onClick={() => onNavigate("/games")}>All games <span>↗</span></button></div>
            {lastPlayed ? <button className="launchpad-continue-card" type="button" onClick={() => { try { localStorage.setItem("vehemence_featured_pick", JSON.stringify(lastPlayed)); } catch {} window.dispatchEvent(new Event("vehemence-open-game")); onNavigate("/games"); }}><span className="launchpad-continue-art">{featured.find((game) => game.id === lastPlayed.id)?.icon || "▶"}</span><span className="launchpad-continue-copy"><small>LAST PLAYED</small><strong>{lastPlayed.name || "Your last game"}</strong><span>Jump back into the arcade</span></span><span className="launchpad-continue-button">Continue ↗</span></button> : <div className="launchpad-empty"><span>▶</span><div><strong>Your next favorite starts here.</strong><p>Play a game and it will show up here automatically.</p></div><button type="button" onClick={() => onNavigate("/games")}>Browse games</button></div>}
          </section>

          <section className="launchpad-section">
            <div className="launchpad-section-heading"><div><p className="eyebrow">HAND-PICKED FOR YOU</p><h2>Quick picks</h2></div><button type="button" onClick={() => onNavigate("/games")}>Browse library <span>↗</span></button></div>
            <div className="launchpad-pick-grid">{featured.slice(0, 4).map((game) => <article className="launchpad-pick-card" key={game.id}><button type="button" className="launchpad-pick-main" onClick={() => openGame(game)}><span className="launchpad-pick-art">{game.icon}</span><span className="launchpad-pick-copy"><strong>{game.name}</strong><small>{game.category}</small></span></button><button type="button" className={favorites.includes(game.id) ? "launchpad-favorite is-favorite" : "launchpad-favorite"} onClick={() => toggleFavorite(game)} aria-label={favorites.includes(game.id) ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}>{favorites.includes(game.id) ? "★" : "☆"}</button></article>)}</div>
          </section>

          {favoritedGames.length > 0 && <section className="launchpad-section"><div className="launchpad-section-heading"><div><p className="eyebrow">SAVED BY YOU</p><h2>Your favorites</h2></div></div><div className="launchpad-favorite-row">{favoritedGames.map((game) => <button type="button" key={game.id} onClick={() => openGame(game)}><span>{game.icon}</span><b>{game.name}</b><i>↗</i></button>)}</div></section>}

          {widgets.timeline && <section className="launchpad-section"><div className="launchpad-section-heading"><div><p className="eyebrow">YOUR RECENT SESSIONS</p><h2>Gaming timeline</h2></div><span className="launchpad-section-meta">LATEST {visibleHistory.length}</span></div>{visibleHistory.length ? <div className="launchpad-timeline">{visibleHistory.map((game, index) => <div className="launchpad-timeline-item" key={`${game.id || game.name}-${index}`}><span className="launchpad-timeline-dot" /><span className="launchpad-timeline-game">{game.name}</span><span className="launchpad-timeline-date">{game.playedAt ? new Date(game.playedAt).toLocaleDateString() : "Recent"}</span></div>)}</div> : <div className="launchpad-inline-empty">Your game launches will appear here as you play.</div>}</section>}
        </div>

        <aside className="launchpad-side-column">
          {widgets.quests && <section className="launchpad-side-panel"><div className="launchpad-section-heading"><div><p className="eyebrow">EARN REWARDS</p><h2>Daily quests</h2></div><span className="launchpad-quest-mark">✦</span></div><div className="launchpad-quest-list">{quests.map((quest) => <article className={quest.done ? "launchpad-quest is-done" : "launchpad-quest"} key={quest.id}><span className="launchpad-quest-check">{quest.done ? "✓" : "○"}</span><div><strong>{quest.title}</strong><p>{quest.detail}</p><small>+{quest.reward} XP</small></div><button type="button" disabled={quest.done} onClick={() => claimQuest(quest)}>{quest.done ? "Claimed" : "Claim"}</button></article>)}</div><p className="launchpad-local-note">Progress is currently saved in this browser.</p></section>}

          {widgets.achievements && <section className="launchpad-side-panel"><div className="launchpad-section-heading"><div><p className="eyebrow">MILESTONES</p><h2>Achievements</h2></div><span className="launchpad-achievement-count">{achievements.filter((item) => item.unlocked).length}/{achievements.length}</span></div><div className="launchpad-achievement-list">{achievements.map((item) => <div className={item.unlocked ? "launchpad-achievement is-unlocked" : "launchpad-achievement"} key={item.id}><span>{item.unlocked ? "✦" : "◇"}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div><i>{item.unlocked ? "UNLOCKED" : "LOCKED"}</i></div>)}</div></section>}

          {widgets.themes && <section className="launchpad-side-panel"><div className="launchpad-section-heading"><div><p className="eyebrow">MAKE IT YOURS</p><h2>Theme workshop</h2></div><span className="launchpad-theme-icon">◒</span></div><p className="launchpad-theme-description">Try a new atmosphere without digging through settings.</p><div className="launchpad-theme-grid">{themePacks.map((pack) => <button type="button" key={pack.id} className={customTheme.toLowerCase() === pack.theme.toLowerCase() ? "launchpad-theme-swatch is-active" : "launchpad-theme-swatch"} onClick={() => applyTheme(pack)}><span style={{ "--pack-color": pack.color }} /><b>{pack.name}</b>{customTheme.toLowerCase() === pack.theme.toLowerCase() && <i>✓</i>}</button>)}</div><button type="button" className="launchpad-open-settings" onClick={() => onNavigate("/settings")}>More appearance settings <span>↗</span></button></section>}

          <section className="launchpad-side-panel launchpad-event-panel"><span className="launchpad-event-icon">✧</span><p className="eyebrow">VEHEMENCE DROPS</p><h2>Something new, every day.</h2><p>Check today's featured game, finish a quest, and keep building your profile milestones.</p><button type="button" onClick={() => openGame(dailyGame)}>Today's drop <span>↗</span></button></section>
        </aside>
      </section>
      {!user && <div className="launchpad-signup-note"><span>↗</span><div><strong>Want your Vehemence profile everywhere?</strong><p>Sign in to use your account features. This first dashboard version keeps game history and XP locally on this browser.</p></div><button type="button" onClick={() => onNavigate("/rules")}>Sign up / log in</button></div>}
    </main>
  );
}
