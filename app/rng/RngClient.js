"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { craftGear, equipAura, equipGear, getRngState, rollRng, setAuraFavorite } from "./actions";

const fallbackAuras = [
  { id: "common", name: "Common", rarity: "Basic", one_in: 2, hue: "#b7becb" },
  { id: "uncommon", name: "Uncommon", rarity: "Basic", one_in: 10, hue: "#71d69b" },
  { id: "rare", name: "Rare", rarity: "Basic", one_in: 100, hue: "#64a8ff" },
  { id: "epic", name: "Epic", rarity: "Epic", one_in: 1000, hue: "#bd7cff" },
  { id: "legendary", name: "Legendary", rarity: "Legendary", one_in: 10000, hue: "#ffd36a" },
  { id: "mythic", name: "Mythic", rarity: "Mythic", one_in: 100000, hue: "#ff76bd" },
  { id: "vehemence", name: "Vehemence", rarity: "???", one_in: 1000000, hue: "#ffffff" }
];

const auraThemes = {
  gargantua: { hue: "#55a9ff", font: "Georgia, serif", background: "radial-gradient(circle at 50% 50%,rgba(55,140,255,.28),transparent 22%),radial-gradient(circle at 50% 50%,#03040a 0 28%,#10172b 29%,#03040a 48%,#000 70%)", glow: "rgba(75,160,255,.65)" },
  matrix: { hue: "#65ffd0", font: "monospace", background: "radial-gradient(circle,#42ffd21f,transparent 30%),linear-gradient(135deg,#04130f,#071a16 50%,#020504)", glow: "rgba(60,255,200,.6)" },
  runic: { hue: "#58ff79", font: "serif", background: "radial-gradient(circle,#35ff5b26,transparent 30%),linear-gradient(135deg,#06170b,#0b2512,#030704)", glow: "rgba(70,255,110,.58)" },
  bloodlust: { hue: "#ff4d68", font: "Georgia, serif", background: "radial-gradient(circle,#ff304030,transparent 30%),linear-gradient(135deg,#1b0307,#080204)", glow: "rgba(255,55,85,.62)" },
  chromatic: { hue: "#ffffff", font: "sans-serif", background: "conic-gradient(from 90deg,#ff3d8d,#6e7cff,#4dfff0,#fff06a,#ff3d8d)", glow: "rgba(255,255,255,.75)" }
};

function themeFor(aura) {
  const key = String(aura?.id || aura?.name || "").toLowerCase().replace(/[^a-z]/g, "");
  const named = Object.keys(auraThemes).find((x) => key.includes(x));
  if (named) return auraThemes[named];
  return { hue: aura?.hue || "#9d91ff", font: "inherit", background: `radial-gradient(circle at 50% 42%,${aura?.hue || "#8f7cff"}2e,transparent 30%),radial-gradient(circle at 50% 50%,rgba(255,255,255,.05),transparent 58%),#06070c`, glow: aura?.hue || "rgba(140,124,255,.55)" };
}

function formatOdds(value) {
  const n = Number(value || 0);
  return n ? `1 in ${n.toLocaleString()}` : "Unknown odds";
}

export default function RngClient() {
  const [state, setState] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [last, setLast] = useState(null);
  const [tab, setTab] = useState("roll");
  const [auto, setAuto] = useState(false);
  const [quick, setQuick] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef(null);

  async function refresh() {
    const result = await getRngState();
    if (result.error) setError(result.error); else setState(result.state);
  }

  useEffect(() => { refresh(); return () => clearInterval(timer.current); }, []);

  const inventory = state?.inventory || [];
  const gear = state?.gear || [];
  const gearDefs = state?.gear_defs || [];
  const rolls = Number(state?.rolls || 0);
  const pity = Number(state?.pity || 0);
  const luck = Number(state?.luck || 1);
  const equipped = state?.equipped || null;
  const equippedGear = gear.find((item) => item.equipped);
  const canAuto = rolls >= 25;
  const canQuick = rolls >= 250;
  const revealTheme = themeFor(last);

  async function doRoll() {
    if (rolling) return;
    setError("");
    setRolling(true);
    const result = await rollRng();
    if (result.error) { setError(result.error); setRolling(false); return; }
    setLast(result.result?.aura || result.result);
    setState(result.result?.state || state);
    if (!quick) await new Promise((resolve) => setTimeout(resolve, 900));
    setRolling(false);
    await refresh();
  }

  useEffect(() => {
    if (!auto || !canAuto) return;
    doRoll();
    timer.current = setInterval(() => doRoll(), quick ? 750 : 1750);
    return () => clearInterval(timer.current);
  }, [auto, quick, canAuto]);

  const sortedInventory = useMemo(() => [...inventory].sort((a, b) => Number(b.one_in || 0) - Number(a.one_in || 0)), [inventory]);

  async function action(fn) {
    const result = await fn();
    if (result?.error) setError(result.error); else await refresh();
  }

  return <main className="rng-page">
    <div className="rng-noise" />
    <header className="rng-header">
      <div className="rng-title-block"><p className="eyebrow">VEHEMENCE / AURA LAB</p><h1>RNG</h1><p>Roll. Collect. Craft. Become impossible to ignore.</p></div>
      <div className="rng-stats">
        <div><span>ROLLS</span><strong>{rolls.toLocaleString()}</strong></div>
        <div><span>LUCK</span><strong>{luck.toFixed(2)}×</strong>{equippedGear && <small>+{(Number(equippedGear.luck_bonus) * 100).toFixed(0)}% gear</small>}</div>
        <div><span>PITY</span><strong>{pity}<i>/10</i></strong></div>
      </div>
    </header>

    {error && <div className="rng-error"><span>!</span>{error}<button onClick={() => setError("")}>×</button></div>}

    <nav className="rng-tabs" aria-label="RNG sections">
      {[['roll','✦ Roll'],['inventory','◈ Auras'],['crafting','◇ Crafting'],['gear','⬡ Gear']].map(([id,label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}
    </nav>

    {tab === "roll" && <section className="rng-main-card">
      <div className={`rng-reveal ${rolling ? "is-rolling" : ""}`} style={{ "--aura-glow": revealTheme.glow, "--aura-hue": revealTheme.hue, background: revealTheme.background }}>
        <div className="rng-starfield" />
        <div className="rng-orbit orbit-a" /><div className="rng-orbit orbit-b" /><div className="rng-orbit orbit-c" />
        {last?.cutscene_url && !rolling && <video className="rng-cutscene" src={last.cutscene_url} autoPlay muted playsInline />}
        <div className="rng-reveal-content">
          <span className="rng-reveal-rarity" style={{ color: revealTheme.hue }}>{last?.rarity || "READY"}</span>
          <strong style={{ fontFamily: revealTheme.font }}>{last?.name || "Roll for an Aura"}</strong>
          <small>{last ? formatOdds(last.one_in) : "The next roll could rewrite your collection."}</small>
          {last?.description && <p>{last.description}</p>}
        </div>
        {last && <div className="rng-reveal-chip">{Number(last.one_in || 0) >= 1000000 ? "CUTSCENE TIER" : "AURA FOUND"}</div>}
      </div>

      <aside className="rng-control-rail">
        <div className="rng-next-card"><span>NEXT ROLL</span><strong>{last ? "Ready" : "???"}</strong><small>Base luck {Number(state?.base_luck || 1).toFixed(2)}×</small></div>
        <button className="rng-roll-button" disabled={rolling} onClick={doRoll}><span>{rolling ? "ROLLING" : "ROLL"}</span><b>SPACE</b></button>
        <div className="rng-control-grid">
          <button disabled={!canAuto} className={auto ? "enabled" : ""} onClick={() => setAuto(!auto)}><span>⚡</span><b>Auto Roll</b><small>{canAuto ? "Unlocked" : "25 rolls"}</small></button>
          <button disabled={!canQuick} className={quick ? "enabled" : ""} onClick={() => setQuick(!quick)}><span>↯</span><b>Quick Roll</b><small>{canQuick ? "Unlocked" : "250 rolls"}</small></button>
        </div>
        <div className="rng-pity"><div className="rng-pity-head"><span>PITY</span><b>{pity}/10</b></div><div className="rng-pity-track"><i style={{ width: `${Math.min(100, pity * 10)}%` }} /></div><small>10th roll temporarily doubles luck.</small></div>
        <div className="rng-mini-stats"><div><span>COLLECTED</span><b>{inventory.length}</b></div><div><span>GEAR</span><b>{gear.length}</b></div></div>
      </aside>
    </section>}

    {tab === "inventory" && <section className="rng-panel">
      <div className="rng-panel-heading"><div><span className="section-kicker">COLLECTION</span><h2>Auras</h2><p>Every aura you own. Favorites stay pinned in your collection.</p></div><div className="rng-count">{inventory.length} / {state?.auras?.length || "∞"}</div></div>
      <div className="rng-inventory">{sortedInventory.length === 0 ? <div className="rng-empty"><strong>Your collection is empty.</strong><span>Roll your first aura to start building it.</span></div> : sortedInventory.map((item) => { const t = themeFor(item); return <article className="rng-aura-card" key={item.id} style={{ "--card-hue": t.hue }}><div className="rng-aura-swatch" style={{ background: t.background }}><span>{item.favorite ? "★" : "✦"}</span></div><div className="rng-aura-info"><span>{item.rarity}</span><h3 style={{ fontFamily: t.font }}>{item.name}</h3><small>{formatOdds(item.one_in)} · ×{item.quantity}</small></div><div className="rng-aura-actions"><button onClick={() => action(() => equipAura(item.id))}>{equipped === item.id ? "Equipped" : "Equip"}</button><button className="icon" onClick={() => action(() => setAuraFavorite(item.id, !item.favorite))}>{item.favorite ? "★" : "☆"}</button></div></article>; })}</div>
    </section>}

    {tab === "crafting" && <section className="rng-panel">
      <div className="rng-panel-heading"><div><span className="section-kicker">JAKE'S WORKSHOP / VEHEMENCE EDITION</span><h2>Crafting</h2><p>Turn collected auras into permanent Luck Gear. Nothing is destroyed by accident: every recipe is explicit.</p></div></div>
      <div className="rng-craft-grid">{gearDefs.map((item) => { const recipe = item.recipe || {}; return <article className="rng-craft-card" key={item.id}><div className="craft-top"><span>TIER {item.tier}</span><b>+{(Number(item.luck_bonus) * 100).toFixed(0)}% LUCK</b></div><h3>{item.name}</h3><p>Forge this gear from your aura collection.</p><div className="recipe-list">{Object.entries(recipe).map(([id, need]) => { const owned = Number(inventory.find((x) => x.id === id)?.quantity || 0); return <div key={id} className={owned >= need ? "complete" : "missing"}><span>{id.replace(/_/g," ")}</span><b>{owned}/{need}</b></div>; })}</div><button disabled={Object.entries(recipe).some(([id,need]) => Number(inventory.find((x) => x.id === id)?.quantity || 0) < need)} onClick={() => action(() => craftGear(item.id))}>CRAFT GEAR</button></article>; })}</div>
    </section>}

    {tab === "gear" && <section className="rng-panel">
      <div className="rng-panel-heading"><div><span className="section-kicker">LOADOUT</span><h2>Luck Gear</h2><p>Equip one crafted piece to modify your rolling Luck.</p></div></div>
      <div className="rng-gear-hero"><div><span>ACTIVE LOADOUT</span><strong>{equippedGear?.name || "No gear equipped"}</strong><small>{equippedGear ? `+${(Number(equippedGear.luck_bonus) * 100).toFixed(0)}% Luck` : "Craft a piece in Crafting."}</small></div><div className="gear-luck-orb"><b>{luck.toFixed(2)}×</b><span>TOTAL LUCK</span></div></div>
      <div className="rng-gear-grid">{gear.length === 0 ? <div className="rng-empty"><strong>No gear yet.</strong><span>Craft your first piece from the Crafting tab.</span></div> : gear.map((item) => <article className={`rng-gear-card ${item.equipped ? "equipped" : ""}`} key={item.id}><span>TIER {item.tier}</span><h3>{item.name}</h3><strong>+{(Number(item.luck_bonus) * 100).toFixed(0)}% LUCK</strong><small>Owned ×{item.quantity}</small><button onClick={() => action(() => equipGear(item.id))}>{item.equipped ? "EQUIPPED" : "EQUIP GEAR"}</button></article>)}</div>
    </section>}
  </main>;
}
