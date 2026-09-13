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
        </div>
      </header>
      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Sounds</h2>
          </div>
        </div>
        <SoundboardClient />
      </section>
    </main>
  );
}
