import "./globals.css";
import "./themes.css";
import "./fonts.css";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

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
      </body>
    </html>
  );
}
