import "./globals.css";
import "./launchpad.css";
import "./themes.css";
import "./fonts.css";
import "./profile.css";
import "./settings.css";
import "./chat-widget.css";
import "./call-widget.css";
import "./page-transition.css";
import "./navigation.css";
import "./friends/friends.css";
import "./soundboard/soundboard.css";
import "./social-dashboard.css";
import "./games/games.css";
import "./browser/browser.css";
import "./modern-ui.css";
import ChatWidget from "./components/ChatWidget";
import CallWidget from "./components/CallWidget";
import BackgroundEffects from "./components/BackgroundEffects";
import BrowserCustomization from "./components/BrowserCustomization";
import AppShell from "./components/AppShell";
import { getCurrentUser } from "../lib/auth";

export const metadata = { title: "Vehemence", description: "Vehemence - community, games, and more." };

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (<html lang="en"><body><BackgroundEffects /><BrowserCustomization /><AppShell user={user}>{children}</AppShell><ChatWidget /><CallWidget /></body></html>);
}
