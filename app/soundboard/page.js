import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import SoundboardClient from "./SoundboardClient";

export default async function SoundboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Soundboard</h1>
          <p>Play your sounds, see their duration, and keep track of the current time.</p>
        </div>
      </header>
      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Sounds</h2>
            <p className="section-subtitle">Send me the sound links and I can add them here with custom names.</p>
          </div>
        </div>
        <SoundboardClient />
      </section>
    </main>
  );
}
