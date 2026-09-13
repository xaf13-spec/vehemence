"use client";

const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/0vonmhVqP4CbuOlSbWBZ1h?utm_source=generator";

export default function PersistentSpotifyEmbed() {
  return (
    <div className="persistent-spotify-embed-wrap">
      <iframe
        src={spotifyEmbedUrl}
        title="3am playlist"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
}
