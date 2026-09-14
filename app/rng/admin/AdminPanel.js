"use client";

import { useEffect, useMemo, useState } from "react";

const COMMANDS = [
  { id: "give_aura", label: "Give Aura", description: "Add any aura directly to your collection." },
  { id: "remove_aura", label: "Remove Aura", description: "Remove an aura from your collection." },
  { id: "set_luck", label: "Set Luck", description: "Set your effective RNG luck." },
  { id: "set_rolls", label: "Set Rolls", description: "Set your lifetime roll count." },
  { id: "set_pity", label: "Set Pity", description: "Set the current pity counter." },
  { id: "equip_aura", label: "Equip Aura", description: "Equip an aura instantly." },
  { id: "give_gear", label: "Give Gear", description: "Add crafted gear to your loadout." },
  { id: "set_biome", label: "Set Biome", description: "Change the current Vehemence RNG environment." },
  { id: "trigger_cutscene", label: "Trigger Cutscene", description: "Preview an aura's cinematic reveal." },
  { id: "clear_inventory", label: "Clear Inventory", description: "Clear RNG inventory after confirmation." },
  { id: "reset_rng", label: "Reset RNG", description: "Reset RNG progression after confirmation." },
];

export default function AdminPanel({ onClose }) {
  const [command, setCommand] = useState(null);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COMMANDS.filter((x) => `${x.label} ${x.description}`.toLowerCase().includes(q)) : COMMANDS;
  }, [query]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  function runCommand() {
    if (!command) return;
    setStatus(`Queued: ${command.label}${value ? ` — ${value}` : ""}`);
  }

  return (
    <div className="rng-admin-backdrop" role="dialog" aria-modal="true" aria-label="RNG Admin Panel">
      <div className="rng-admin-shell">
        <aside className="rng-admin-sidebar">
          <div className="rng-admin-brand"><span>V</span><div><b>VEHEMENCE</b><small>RNG CONTROL</small></div></div>
          <div className="rng-admin-status"><i /> ADMIN ACCESS <em>LOCAL</em></div>
          <div className="rng-admin-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search commands..." /></div>
          <div className="rng-admin-command-list">
            {filtered.map((item) => (
              <button key={item.id} className={command?.id === item.id ? "active" : ""} onClick={() => { setCommand(item); setStatus(""); }}>
                <span className="rng-admin-command-icon">{item.id === "trigger_cutscene" ? "✦" : "›"}</span>
                <span><b>{item.label}</b><small>{item.description}</small></span>
              </button>
            ))}
          </div>
          <button className="rng-admin-close" onClick={onClose}>ESC · CLOSE PANEL</button>
        </aside>
        <main className="rng-admin-main">
          <header className="rng-admin-header"><div><small>DEVELOPER CONSOLE</small><h1>{command?.label || "Command Center"}</h1><p>{command?.description || "Select an RNG command from the command deck."}</p></div><div className="rng-admin-key">CTRL <b>SHIFT</b> R</div></header>
          <section className="rng-admin-console">
            {!command ? <div className="rng-admin-empty"><div className="rng-admin-orb">V</div><h2>RNG CONTROL DECK</h2><p>Choose a command to begin. All privileged actions should be validated server-side before execution.</p></div> : <>
              <div className="rng-admin-command-title"><span>COMMAND</span><b>/{command.id}</b></div>
              <label>VALUE / TARGET<input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Aura name, amount, biome, or target..." /></label>
              <div className="rng-admin-preview"><span>EXECUTION PREVIEW</span><strong>{command.label}</strong><small>{command.description}</small></div>
              <button className="rng-admin-execute" onClick={runCommand}>EXECUTE COMMAND <span>↗</span></button>
              {status && <div className="rng-admin-result">{status}</div>}
            </>}
          </section>
        </main>
      </div>
    </div>
  );
}
