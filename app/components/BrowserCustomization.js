"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const themes = ["Midnight", "Cherry Blossom", "Ocean", "Aquatic", "Lavender", "Forest", "Sunset", "Rose", "Cloud", "Autumn", "Frost", "Mocha", "Moss", "Crimson", "Sakura"];
const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Times New Roman", "Courier New", "Consolas", "Lucida Console", "Impact", "Comic Sans MS", "Segoe UI", "Calibri", "Cambria", "Century Gothic", "Palatino"];

function readSetting(key) { return localStorage.getItem(key); }

function applySettings() {
  const savedTheme = readSetting("vehemence_theme");
  const savedFont = readSetting("vehemence_font");
  if (savedTheme && themes.includes(savedTheme)) document.documentElement.setAttribute("data-theme", savedTheme.toLowerCase().replaceAll(" ", "-"));
  if (savedFont && fonts.includes(savedFont)) document.documentElement.style.setProperty("--site-font", savedFont);
  document.title = "Vehemence";
}

export default function BrowserCustomization() {
  const pathname = usePathname();
  useEffect(() => { applySettings(); }, [pathname]);
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === null || ["vehemence_theme", "vehemence_font", "vehemence_ui_scale", "vehemence_compact", "vehemence_animations", "vehemence_blur", "vehemence_background"].includes(event.key)) applySettings();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("vehemence-settings-changed", applySettings);
    return () => { window.removeEventListener("storage", handleStorage); window.removeEventListener("vehemence-settings-changed", applySettings); };
  }, []);
  return null;
}
