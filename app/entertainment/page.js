import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import EntertainmentClient from "./EntertainmentClient";

export default async function EntertainmentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/rules");

  return (
    <main className="games-page">
      <header className="games-header">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Entertainment</h1>
          <p>Click a card to watch without leaving Vehemence.</p>
        </div>
      </header>

      <section className="game-section">
        <div className="section-title-row">
          <div>
            <h2>Entertainment</h2>
            <p className="section-subtitle">Your entertainment sites, in the same card layout as Games.</p>
          </div>
        </div>
        <EntertainmentClient />
      </section>
    </main>
  );
}
