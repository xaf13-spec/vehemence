import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

const games = [
{
name: "Game 1",
description: "Your first Vehemence game.",
category: "Featured"
},
{
name: "Game 2",
description: "Another game to play.",
category: "Action"
},
{
name: "Game 3",
description: "Something new to try.",
category: "Adventure"
}
];

export default async function Games() {
const user = await getCurrentUser();

if (!user) {
redirect("/rules");
}

return (
<main className="games-page">
<div className="games-header">
<div>
<p className="eyebrow">VEHEMENCE</p>
<h1>Games</h1>
<p>Find something to play.</p>
</div>

    <input
      className="game-search"
      type="text"
      placeholder="Search games..."
    />
  </div>

  <section className="game-section">
    <h2>Recently Played</h2>

    <div className="game-grid">
      <div className="empty-games">
        <p>No recently played games yet.</p>
      </div>
    </div>
  </section>

  <section className="game-section">
    <h2>All Games</h2>

    <div className="game-grid">
      {games.map((game) => (
        <div className="game-card" key={game.name}>
          <div className="game-thumbnail">
            <span>{game.name}</span>
          </div>

          <div className="game-info">
            <div>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </div>

            <span className="game-category">
              {game.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
</main>

);
}
