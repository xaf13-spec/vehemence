"use client";

const spotifyPlaylists = [
  {
    id: "0U28P0QVB1QRxpqp5IHOlH",
    name: "CHROMAKOPIA",
    creator: "Tyler, The Creator",
    type: "album",
  },
  {
    id: "3bjHe3Dd46bZ6Za7iIffoD",
    name: "best songs brent faiyaz",
    creator: "unofficial person",
    type: "playlist",
  },
  {
    id: "76rIPTSqm8noZgcmNhe1Hp",
    name: "90s rap songs",
    creator: "unofficial person",
    type: "playlist",
  },
  {
    id: "5TyvcgbIV0jT4LBInrJafN",
    name: "malcolm todd, frank ocean, steve lacy, daniel caeser, childish gambino, tyler the creator.",
    creator: "unofficial person",
    type: "playlist",
  },
  {
    id: "28bqh5m3XyaDZahhwoNXp2",
    name: "school playlist",
    creator: "spotify playlist",
    type: "playlist",
  },
  {
    id: "0vonmhVqP4CbuOlSbWBZ1h",
    name: "3am playlist",
    creator: "spotify playlist",
    type: "playlist",
  },
  {
    id: "1HFnpLBaSM3XC3LX5UtnfO",
    name: "mj",
    creator: "spotify playlist",
    type: "playlist",
  },
];

function playPlaylist(playlist) {
  window.dispatchEvent(new CustomEvent("vehemence:spotify-select", { detail: playlist }));
}

export default function MusicClient() {
  return (
    <main className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Music</h1>
        </div>
      </section>

      <section className="music-section">
        <div className="music-section-heading">
          <div><h2>Spotify</h2></div>
        </div>
        <div className="spotify-grid">
          {spotifyPlaylists.map((playlist) => (
            <article className="spotify-card" key={`${playlist.type}-${playlist.id}`}>
              <div className="spotify-card-heading">
                <div>
                  <span className="music-status">{playlist.type === "album" ? "album" : "playlist"}</span>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.creator}</p>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => playPlaylist(playlist)}
                >
                  play
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
