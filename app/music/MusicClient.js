"use client";

import { useEffect, useRef, useState } from "react";

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
    id: "28bqh5m3XyaDZahhwoNXp2",
    name: "locked in",
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

export default function MusicClient() {
  const controllers = useRef(new Map());
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (window.SpotifyIframeApi) {
      setApiReady(true);
      return undefined;
    }

    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.SpotifyIframeApi = IFrameAPI;
      setApiReady(true);
      if (typeof previous === "function") previous(IFrameAPI);
    };

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      if (window.onSpotifyIframeApiReady && window.onSpotifyIframeApiReady !== previous) {
        delete window.onSpotifyIframeApiReady;
      }
      controllers.current.clear();
    };
  }, []);

  function registerController(playlist, element) {
    if (!apiReady || !window.SpotifyIframeApi || !element || controllers.current.has(playlist.key)) return;

    window.SpotifyIframeApi.createController(
      element,
      {
        width: "100%",
        height: 152,
        uri: `spotify:${playlist.type}:${playlist.id}`,
        theme: "dark",
      },
      (controller) => {
        controllers.current.set(playlist.key, controller);
      }
    );
  }

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
          {spotifyPlaylists.map((playlist, index) => {
            const item = { ...playlist, key: `${playlist.type}-${playlist.id}-${index}` };
            return (
              <article className="spotify-card" key={item.key}>
                <div className="spotify-card-heading">
                  <div>
                    <span className="music-status">{item.type === "album" ? "ALBUM" : "SPOTIFY"}</span>
                    <h3>{item.name}</h3>
                    <p>{item.creator}</p>
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => controllers.current.get(item.key)?.restart()}
                    disabled={!apiReady}
                  >
                    Replay
                  </button>
                </div>
                <div
                  ref={(element) => registerController(item, element)}
                  className="spotify-embed"
                  aria-label={`${item.name} Spotify embed`}
                />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
