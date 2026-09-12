"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const themes = ["Midnight", "Cherry Blossom", "Ocean", "Aquatic", "Lavender", "Forest", "Sunset", "Rose", "Cloud", "Autumn", "Frost", "Mocha", "Moss", "Crimson", "Sakura"];
const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Times New Roman", "Courier New", "Consolas", "Lucida Console", "Impact", "Comic Sans MS", "Segoe UI", "Calibri", "Cambria", "Century Gothic", "Palatino"];

function applySettings() {
  const root = document.documentElement;
  const get = (key, fallback) => localStorage.getItem(key) ?? fallback;
  const theme = get("vehemence_theme", "Midnight");
  const font = get("vehemence_font", "Arial");
  const scale = get("vehemence_ui_scale", "Normal");
  const compact = get("vehemence_compact", "false");
  const animations = get("vehemence_animations", "true");
  const blur = get("vehemence_blur", "true");
  const background = get("vehemence_background", "true");
  if (themes.includes(theme)) root.setAttribute("data-theme", theme.toLowerCase().replaceAll(" ", "-"));
  if (fonts.includes(font)) root.style.setProperty("--site-font", font);
  root.setAttribute("data-ui-scale", scale.toLowerCase());
  root.setAttribute("data-compact", compact);
  root.setAttribute("data-animations", animations);
  root.setAttribute("data-blur", blur);
  root.setAttribute("data-background-effects", background);
  document.title = "Vehemence";
}

export default function BrowserCustomization() {
  const pathname = usePathname();
  useEffect(() => { applySettings(); }, [pathname]);
  useEffect(() => {
    const handle = () => applySettings();
    window.addEventListener("storage", handle);
    window.addEventListener("vehemence-settings-changed", handle);
    return () => { window.removeEventListener("storage", handle); window.removeEventListener("vehemence-settings-changed", handle); };
  }, []);
  return null;
}
