"use client";

import { useEffect, useState } from "react";

function readBackgroundSettings() {
  try {
    return {
      mode: localStorage.getItem("vehemence_background_mode") || "theme",
      image: localStorage.getItem("vehemence_custom_background") || "",
      enabled: document.documentElement.getAttribute("data-background-effects") !== "false",
      theme: document.documentElement.getAttribute("data-theme") || "midnight",
    };
  } catch {
    return { mode: "theme", image: "", enabled: true, theme: "midnight" };
  }
}

export default function BackgroundEffects() {
  const [settings, setSettings] = useState({ mode: "theme", image: "", enabled: true, theme: "midnight" });

  useEffect(() => {
    const sync = () => setSettings(readBackgroundSettings());
    sync();
    window.addEventListener("vehemence-settings-changed", sync);
    window.addEventListener("storage", sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-background-effects"] });
    return () => {
      window.removeEventListener("vehemence-settings-changed", sync);
      window.removeEventListener("storage", sync);
      observer.disconnect();
    };
  }, []);

  const custom = settings.mode === "custom" && settings.image;
  const imageStyle = custom ? {
    backgroundImage: `linear-gradient(180deg, rgba(5, 8, 13, .38), rgba(5, 8, 13, .66)), url(${JSON.stringify(settings.image)})`,
  } : undefined;

  return <div className={`ambient-background theme-${settings.theme} ${custom ? "ambient-custom" : ""} ${settings.enabled ? "effects-enabled" : "effects-muted"}`} style={imageStyle} aria-hidden="true">
    {!custom && settings.enabled && <>
      <div className="ambient-glow" />
      <div className="ambient-sun" />
      <div className="ambient-stars" />
      <div className="ambient-horizon" />
      <div className="ambient-wave ambient-wave-one" />
      <div className="ambient-wave ambient-wave-two" />
      <div className="ambient-wave ambient-wave-three" />
      <div className="ambient-particles" />
    </>}
  </div>;
}
