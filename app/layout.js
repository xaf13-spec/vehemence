import "./globals.css";
import "./themes.css";
import "./fonts.css";
import "./profile.css";
import "./settings.css";
import "./chat-widget.css";
import "./call-widget.css";
import "./game-player.css";
import "./browser/browser.css";
import ChatWidget from "./components/ChatWidget";
import CallWidget from "./components/CallWidget";
import BrowserCustomization from "./components/BrowserCustomization";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "Vehemence",
  description: "Vehemence - Games, community, and more."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BrowserCustomization />
        <AppShell>{children}</AppShell>
        <ChatWidget />
        <CallWidget />
      </body>
    </html>
  );
}
