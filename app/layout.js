import "./globals.css";
import "./themes.css";
import "./fonts.css";
import "./profile.css";
import "./chat-widget.css";
import "./call-widget.css";
import "./game-player.css";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import CallWidget from "./components/CallWidget";

export const metadata = {
  title: "Vehemence",
  description: "Vehemence - Games, community, and more."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <ChatWidget />
        <CallWidget />
      </body>
    </html>
  );
}
