"use client";

const entertainment = [
  { name: "StreameX", description: "Open StreameX without leaving Vehemence.", url: "https://www.streamex.sh/", icon: "▶" },
];

export default function EntertainmentClient() {
  return (
    <div className="game-grid">
      {entertainment.map((item) => (
        <article className="game-card" key={item.name}>
          <a className="game-card-main" href={item.url} target="_blank" rel="noreferrer">
            <div className="game-thumbnail">
              <div className="game-thumb-shine" />
              <span className="game-thumb-icon">{item.icon}</span>
              <span className="game-thumb-name">{item.name}</span>
            </div>
            <div className="game-info">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <span className="game-category">Entertainment</span>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
