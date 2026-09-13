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

export default function MusicClient() {
  return (
    <main className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">VEHEMENCE</p>
          <h1>Music</h1>
          <p>Play your playlists and music without leaving Vehemence.</p>
        </div>
      </section>

      <section className="music-section">
        <div className="music-section-heading">
          <div><h2>Spotify</h2><p>Playlists and albums you added to Vehemence.</p></div>
        </div>
        <div className="spotify-grid">
          {spotifyPlaylists.map((playlist) => (
            <article className="spotify-card" key={`${playlist.type}-${playlist.id}`}>
              <div className="spotify-card-heading">
                <div>
                  <span className="music-status">{playlist.type === "album" ? "ALBUM" : "SPOTIFY"}</span>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.creator}</p>
                </div>
              </div>
              <iframe
                src={`https://open.spotify.com/embed/${playlist.type}/${playlist.id}?utm_source=generator`}
                title={playlist.name}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
