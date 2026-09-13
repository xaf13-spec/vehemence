"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { equipAura, getRngState, rollRng, sacrificeAura, setAuraFavorite } from "./actions";

const fallbackAuras = [
  { id: "common", name: "Common", rarity: "Common", one_in: 2 },
  { id: "uncommon", name: "Uncommon", rarity: "Uncommon", one_in: 10 },
  { id: "rare", name: "Rare", rarity: "Rare", one_in: 100 },
  { id: "epic", name: "Epic", rarity: "Epic", one_in: 1000 },
  { id: "legendary", name: "Legendary", rarity: "Legendary", one_in: 10000 },
  { id: "mythic", name: "Mythic", rarity: "Mythic", one_in: 100000 },
  { id: "vehemence", name: "Vehemence", rarity: "???", one_in: 1000000 }
];

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

  useEffect(() => { refresh(); return () => clearTimeout(timer.current); }, []);

  const auras = state?.auras?.length ? state.auras : fallbackAuras;
  const inventory = state?.inventory || [];
  const rolls = Number(state?.rolls || 0);
  const pity = Number(state?.pity || 0);
  const luck = Number(state?.luck || 1);
  const equipped = state?.equipped || null;
  const canAuto = rolls >= 25;
  const canQuick = rolls >= 250;

  async function doRoll() {
    if (rolling) return;
    setError(""); setRolling(!quick);
    const result = await rollRng();
    if (result.error) { setError(result.error); setRolling(false); return; }
    setLast(result.result?.aura || result.result);
    setState(result.result?.state || state);
    if (!quick) await new Promise((resolve) => setTimeout(resolve, 850));
    setRolling(false);
    await refresh();
  }

  useEffect(() => {
    if (!auto || !canAuto) return;
    doRoll();
    timer.current = setInterval(doRoll, quick ? 700 : 1700);
    return () => clearInterval(timer.current);
  }, [auto, quick, canAuto]);

  const sortedInventory = useMemo(() => [...inventory].sort((a, b) => Number(b.one_in || 0) - Number(a.one_in || 0)), [inventory]);

  async function action(fn) {
    const result = await fn();
    if (result?.error) setError(result.error); else await refresh();
  }

  return <main className="rng-page">
    <header className="rng-header">
      <div><p className="eyebrow">VEHEMENCE</p><h1>RNG</h1><p>Roll. Collect. Chase the impossible.</p></div>
      <div className="rng-stats"><div><span>Rolls</span><strong>{rolls.toLocaleString()}</strong></div><div><span>Luck</span><strong>{luck}×</strong></div><div><span>Pity</span><strong>{pity}/10</strong></div></div>
    </header>

    {error && <div className="rng-error">{error}</div>}

    <div className="rng-tabs"><button className={tab === "roll" ? "active" : ""} onClick={() => setTab("roll")}>Roll</button><button className={tab === "inventory" ? "active" : ""} onClick={() => setTab("inventory")}>Inventory</button><button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}>Luck Shop</button></div>

    {tab === "roll" && <section className="rng-main-card">
      <div className={`rng-reveal ${rolling ? "is-rolling" : ""}`}><span className="rng-reveal-rarity">{last?.rarity || "READY"}</span><strong>{last?.name || "Roll for an Aura"}</strong><small>{last ? `1 in ${Number(last.one_in || 0).toLocaleString()}` : "Your next roll could be anything."}</small></div>
      <button className="rng-roll-button" disabled={rolling} onClick={doRoll}>{rolling ? "ROLLING..." : "ROLL"}</button>
      <div className="rng-controls"><button disabled={!canAuto} className={auto ? "enabled" : ""} onClick={() => setAuto(!auto)}>⚡ Auto Roll {canAuto ? "" : "· 25 rolls"}</button><button disabled={!canQuick} className={quick ? "enabled" : ""} onClick={() => setQuick(!quick)}>🚀 Quick Roll {canQuick ? "" : "· 250 rolls"}</button></div>
      <div className="rng-pity"><span>Pity progress</span><div><i style={{ width: `${Math.min(100, pity * 10)}%` }} /></div><small>{pity}/10 · next pity roll gets 2× luck</small></div>
    </section>}

    {tab === "inventory" && <section className="rng-panel"><div className="rng-panel-heading"><div><h2>Aura Inventory</h2><p>{inventory.length} unique auras collected</p></div></div><div className="rng-inventory">{sortedInventory.length === 0 ? <div className="rng-empty">Nothing here yet. Go roll something.</div> : sortedInventory.map((item) => <article className="rng-aura-card" key={item.id}><div><span>{item.rarity}</span><h3>{item.name}</h3><small>1 in {Number(item.one_in || 0).toLocaleString()} · ×{item.quantity}</small></div><div className="rng-aura-actions"><button onClick={() => action(() => equipAura(item.id))}>{equipped === item.id ? "Equipped" : "Equip"}</button><button onClick={() => action(() => setAuraFavorite(item.id, !item.favorite))}>{item.favorite ? "★" : "☆"}</button><button onClick={() => action(() => sacrificeAura(item.id, Math.max(1, Math.floor(item.quantity / 2))))}>Sacrifice</button></div></article>)}</div></section>}

    {tab === "shop" && <section className="rng-panel"><div className="rng-panel-heading"><div><h2>Luck Shop</h2><p>Sacrifice duplicate auras to unlock permanent luck boosts.</p></div></div><div className="rng-shop-grid"><article><span>LUCK I</span><h3>+0.25× Luck</h3><p>Starter boost.</p><button onClick={() => setError("Shop upgrades will unlock after the sacrifice system is active.")}>Unlock</button></article><article><span>LUCK II</span><h3>+0.50× Luck</h3><p>Requires more sacrificed auras.</p><button onClick={() => setError("Shop upgrades will unlock after the sacrifice system is active.")}>Unlock</button></article><article><span>LUCK III</span><h3>+1.00× Luck</h3><p>A serious boost for collectors.</p><button onClick={() => setError("Shop upgrades will unlock after the sacrifice system is active.")}>Unlock</button></article></div></section>}
  </main>;
}
