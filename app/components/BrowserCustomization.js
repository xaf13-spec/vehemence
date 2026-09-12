"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const tabIconUrls = {
  "Google Classroom": "https://www.google.com/s2/favicons?domain=classroom.google.com&sz=64",
  "Google Docs": "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64",
  "Google Slides": "https://www.google.com/s2/favicons?domain=slides.google.com&sz=64",
  "Google Drive": "https://www.google.com/s2/favicons?domain=drive.google.com&sz=64",
  "Khan Academy": "https://www.google.com/s2/favicons?domain=khanacademy.org&sz=64"
};

const themes = ["Midnight", "Cherry Blossom", "Ocean", "Aquatic", "Lavender", "Forest", "Sunset", "Rose", "Cloud", "Autumn", "Frost", "Mocha", "Moss", "Crimson", "Sakura"];
const fonts = ["Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Times New Roman", "Courier New", "Consolas", "Lucida Console", "Impact", "Comic Sans MS", "Segoe UI", "Calibri", "Cambria", "Century Gothic", "Palatino"];

function readSetting(localKey, cookieKey) {
  const cookieValue = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${cookieKey}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return cookieValue ? decodeURIComponent(cookieValue) : localStorage.getItem(localKey);
}

function applySettings() {
  const savedTheme = readSetting("vehemence_theme", "vehemence_theme");
  const savedFont = readSetting("vehemence_font", "vehemence_font");
  const savedIcon = readSetting("vehemence_tab_icon", "vehemence_tab_icon");
  const savedName = readSetting("vehemence_site_name", "vehemence_site_name")?.trim();

  if (savedTheme && themes.includes(savedTheme)) {
    document.documentElement.setAttribute("data-theme", savedTheme.toLowerCase().replaceAll(" ", "-"));
  }

  if (savedFont && fonts.includes(savedFont)) {
    document.documentElement.style.setProperty("--site-font", savedFont);
  }

  if (savedIcon && tabIconUrls[savedIcon]) {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = tabIconUrls[savedIcon];
  }

  document.title = savedName || "Vehemence";
}

export default function BrowserCustomization() {
  const pathname = usePathname();

  useEffect(() => {
    applySettings();
  }, [pathname]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === null || [
        "vehemence_theme",
        "vehemence_font",
        "vehemence_tab_icon",
        "vehemence_site_name"
      ].includes(event.key)) {
        applySettings();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
}
