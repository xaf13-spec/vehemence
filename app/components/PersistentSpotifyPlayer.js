"use client";

import { useEffect, useRef, useState } from "react";

export default function PersistentSpotifyPlayer() {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  const repeatRef = useRef(false);
  const currentTrackRef = useRef(null);
  const lastRestartRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(null);
  const [repeat, setRepeat] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const select = (event) => {
      const item = event.detail;
      if (!item?.id || !controllerRef.current) return;

      controllerRef.current.loadEntity(`spotify:${item.type || "playlist"}:${item.id}`);
      setCurrent(item);
      setVisible(true);
      currentTrackRef.current = null;
      lastRestartRef.current = 0;
    };

    window.addEventListener("vehemence:spotify-select", select);
    return () => window.removeEventListener("vehemence:spotify-select", select);
  }, []);

  useEffect(() => {
    const createController = (IFrameAPI) => {
      if (!containerRef.current || controllerRef.current) return;

      IFrameAPI.createController(
        containerRef.current,
        {
          width: "100%",
          height: 352,
          uri: "spotify:playlist:28bqh5m3XyaDZahhwoNXp2",
          theme: "dark"
        },
        (controller) => {
          controllerRef.current = controller;
          setReady(true);

          controller.addListener(IFrameAPI.EVENTS.PLAYBACK_STARTED, (event) => {
            currentTrackRef.current = event?.data?.playingURI || null;
          });

          controller.addListener(IFrameAPI.EVENTS.PLAYBACK_UPDATE, (event) => {
            const data = event?.data;
            if (!data || !Number.isFinite(data.duration) || data.duration <= 0) return;

            const position = Number(data.position) || 0;
            const track = data.playingURI || null;

            if (track && track !== currentTrackRef.current) {
              currentTrackRef.current = track;
              lastRestartRef.current = 0;
            }

            if (
              repeatRef.current &&
              !data.isPaused &&
              track &&
              position >= data.duration - 700 &&
              lastRestartRef.current !== track
            ) {
              lastRestartRef.current = track;
              controller.seek(0);
              controller.play();
            }
          });
        }
      );
    };

    if (window.SpotifyIframeApi) {
      createController(window.SpotifyIframeApi);
      return undefined;
    }

    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (typeof previous === "function") previous(IFrameAPI);
      createController(IFrameAPI);
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
    };
  }, []);

  const toggleRepeat = () => {
    const next = !repeatRef.current;
    repeatRef.current = next;
    setRepeat(next);
  };

  return (
    <div className={`persistent-spotify-player ${visible ? "persistent-spotify-player-visible" : ""}`}>
      <div className="persistent-spotify-header">
        <div>
          <span className="persistent-spotify-label">music</span>
          <strong>{current?.name || "select a playlist"}</strong>
        </div>
        <button
          type="button"
          className={`secondary-button ${repeat ? "active" : ""}`}
          onClick={toggleRepeat}
          disabled={!ready}
          aria-pressed={repeat}
        >
          {repeat ? "repeat on" : "repeat"}
        </button>
      </div>
      <div ref={containerRef} className="persistent-spotify-embed" />
    </div>
  );
}
