import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const entertainment = [];

export default async function EntertainmentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Entertainment</h1>
          <p>Movies, shows, and other stuff outside the game library.</p>
        </div>
      </header>

      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Entertainment</h2>
            <p className="section-subtitle">More content will be added here.</p>
          </div>
        </div>
        <div className="empty-games">
          <p>No entertainment items yet.</p>
        </div>
      </section>
    </main>
  );
}
