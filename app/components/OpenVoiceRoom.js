"use client";

import { useCallback, useEffect, useRef, useState } from "react";

async function roomRequest(action, extra = {}) {
  const response = await fetch("/api/open-voice", {
    method: action === "poll" ? "GET" : "POST",
    credentials: "same-origin",
    cache: "no-store",
    ...(action === "poll" ? {} : {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra })
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Voice chat request failed.");
  return data;
}

export default function OpenVoiceRoom() {
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [error, setError] = useState("");
  const [connectionCount, setConnectionCount] = useState(0);

  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map());
  const audioHostRef = useRef(null);
  const signalCursorRef = useRef(0);
  const handledOffersRef = useRef(new Set());
  const queuedCandidatesRef = useRef(new Map());
  const joinedRef = useRef(false);

  const sendSignal = useCallback(async (toUser, kind, payload) => {
    await roomRequest("signal", { toUser, kind, payload });
  }, []);

  const closePeer = useCallback((userId) => {
    const entry = peersRef.current.get(userId);
    if (!entry) return;
    entry.peer.onicecandidate = null;
    entry.peer.ontrack = null;
    entry.peer.onconnectionstatechange = null;
    entry.peer.close();
    if (entry.audio) {
      entry.audio.srcObject = null;
      entry.audio.remove();
    }
    peersRef.current.delete(userId);
    handledOffersRef.current.delete(userId);
    queuedCandidatesRef.current.delete(userId);
    setConnectionCount(peersRef.current.size);
  }, []);

  const makePeer = useCallback((userId) => {
    const existing = peersRef.current.get(userId);
    if (existing) return existing.peer;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    const entry = { peer, audio: null };
    peersRef.current.set(userId, entry);
    localStreamRef.current?.getAudioTracks().forEach((track) => peer.addTrack(track, localStreamRef.current));

    peer.onicecandidate = (event) => {
      if (event.candidate && joinedRef.current) {
        sendSignal(userId, "candidate", event.candidate.toJSON()).catch(() => {});
      }
    };
    peer.ontrack = (event) => {
      const stream = event.streams?.[0];
      if (!stream || !audioHostRef.current) return;
      if (!entry.audio) {
        const audio = document.createElement("audio");
        audio.autoplay = true;
        audio.playsInline = true;
        audio.dataset.voiceUser = userId;
        audioHostRef.current.appendChild(audio);
        entry.audio = audio;
      }
      entry.audio.srcObject = stream;
      entry.audio.muted = deafened;
      entry.audio.play().catch(() => setError("Your browser blocked voice playback. Click the page and try again."));
    };
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed" || peer.connectionState === "closed") {
        if (peer.connectionState === "failed") setError("A voice connection failed. Try leaving and rejoining.");
      }
    };
    setConnectionCount(peersRef.current.size);
    return peer;
  }, [deafened, sendSignal]);

  const flushCandidates = useCallback(async (userId, peer) => {
    if (!peer.remoteDescription) return;
    const queued = queuedCandidatesRef.current.get(userId) || [];
    queuedCandidatesRef.current.set(userId, []);
    for (const candidate of queued) {
      try { await peer.addIceCandidate(candidate); } catch {}
    }
  }, []);

  const processSignals = useCallback(async (signals) => {
    for (const signal of signals || []) {
      const fromUser = signal.fromUser;
      if (!fromUser || fromUser === currentUserId) continue;
      try {
        if (signal.kind === "offer") {
          const peer = makePeer(fromUser);
          if (handledOffersRef.current.has(fromUser)) continue;
          handledOffersRef.current.add(fromUser);
          await peer.setRemoteDescription(signal.payload);
          await flushCandidates(fromUser, peer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await sendSignal(fromUser, "answer", peer.localDescription.toJSON());
        } else if (signal.kind === "answer") {
          const peer = peersRef.current.get(fromUser)?.peer;
          if (peer && !peer.remoteDescription) {
            await peer.setRemoteDescription(signal.payload);
            await flushCandidates(fromUser, peer);
          }
        } else if (signal.kind === "candidate") {
          const peer = peersRef.current.get(fromUser)?.peer;
          if (peer?.remoteDescription) {
            try { await peer.addIceCandidate(signal.payload); } catch {}
          } else {
            const queue = queuedCandidatesRef.current.get(fromUser) || [];
            queue.push(signal.payload);
            queuedCandidatesRef.current.set(fromUser, queue);
          }
        }
      } catch {
        setError("Could not establish one of the voice connections. Try rejoining.");
      }
    }
  }, [currentUserId, flushCandidates, makePeer, sendSignal]);

  const pollRoom = useCallback(async () => {
    const response = await fetch(`/api/open-voice?since=${signalCursorRef.current}`, {
      credentials: "same-origin",
      cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Could not refresh voice chat.");
    setCurrentUserId(data.currentUserId || "");
    setParticipants(data.participants || []);
    const signals = data.signals || [];
    if (signals.length) {
      signalCursorRef.current = Math.max(signalCursorRef.current, Number(data.latestSignalId) || 0);
      await processSignals(signals);
    }
    const presentIds = new Set((data.participants || []).map((person) => person.user_id));
    for (const userId of peersRef.current.keys()) {
      if (!presentIds.has(userId)) closePeer(userId);
    }
    const selfId = data.currentUserId;
    for (const person of data.participants || []) {
      if (!selfId || person.user_id === selfId || selfId.localeCompare(person.user_id) >= 0) continue;
      const peer = makePeer(person.user_id);
      const entry = peersRef.current.get(person.user_id);
      if (!entry?.offerStarted && peer.signalingState === "stable") {
        entry.offerStarted = true;
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await sendSignal(person.user_id, "offer", peer.localDescription.toJSON());
        } catch {
          entry.offerStarted = false;
          setError("Could not start a voice connection with a participant.");
        }
      }
    }
  }, [closePeer, makePeer, processSignals, sendSignal]);

  const leaveRoom = useCallback(async (sendLeave = true) => {
    joinedRef.current = false;
    setJoined(false);
    for (const userId of [...peersRef.current.keys()]) closePeer(userId);
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (audioHostRef.current) audioHostRef.current.replaceChildren();
    setParticipants([]);
    setConnectionCount(0);
    setMuted(false);
    setDeafened(false);
    if (sendLeave) {
      try { await roomRequest("leave"); } catch {}
    }
  }, [closePeer]);

  useEffect(() => {
    if (!joined) return;
    let stopped = false;
    const runPoll = async () => {
      if (stopped || !joinedRef.current) return;
      try {
        await pollRoom();
        setError("");
      } catch (err) {
        setError(err?.message || "Voice chat disconnected.");
      }
    };
    runPoll();
    const pollTimer = window.setInterval(runPoll, 1800);
    const heartbeatTimer = window.setInterval(() => {
      if (joinedRef.current) roomRequest("heartbeat").catch(() => {});
    }, 7000);
    return () => {
      stopped = true;
      window.clearInterval(pollTimer);
      window.clearInterval(heartbeatTimer);
    };
  }, [joined, pollRoom]);

  useEffect(() => () => {
    joinedRef.current = false;
    for (const entry of peersRef.current.values()) entry.peer.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    for (const entry of peersRef.current.values()) {
      if (entry.audio) entry.audio.muted = deafened;
    }
  }, [deafened]);

  async function joinRoom() {
    if (joining || joined) return;
    setJoining(true);
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is unavailable in this browser or connection.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      await roomRequest("join");
      joinedRef.current = true;
      setJoined(true);
      setMuted(false);
      setDeafened(false);
    } catch (err) {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setError(err?.message || "Could not join voice chat. Check microphone permissions.");
    } finally {
      setJoining(false);
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
  }

  function toggleDeafen() {
    const next = !deafened;
    setDeafened(next);
    for (const entry of peersRef.current.values()) {
      if (entry.audio) entry.audio.muted = next;
    }
  }

  return (
    <section className="open-voice-card">
      <div className="open-voice-heading">
        <div className="open-voice-mark" aria-hidden="true">◖</div>
        <div className="open-voice-title">
          <h2>open voice chat</h2>
          <p>hang out with anyone in the online chat</p>
        </div>
        <span className={joined ? "open-voice-live" : "open-voice-closed"}>
          <span />{joined ? "connected" : "open room"}
        </span>
      </div>

      <div className="open-voice-participants">
        {joined && <div className="open-voice-person open-voice-you"><span className="open-voice-avatar">you</span><span className="open-voice-person-name">you</span><span className="open-voice-person-state">{muted ? "muted" : "in voice"}</span></div>}
        {participants.filter((person) => person.user_id !== currentUserId).map((person) => (
          <div className="open-voice-person" key={person.user_id}>
            <span className="open-voice-avatar">{(person.username || "?").slice(0, 1)}</span>
            <span className="open-voice-person-name">{person.username}</span>
            <span className="open-voice-person-state">in voice</span>
          </div>
        ))}
        {!participants.length && !joined && <p className="open-voice-empty">no one's in voice right now. be the first.</p>}
        {joined && participants.filter((person) => person.user_id !== currentUserId).length === 0 && <p className="open-voice-empty">you're here first. friends can join anytime.</p>}
      </div>

      {error && <p className="open-voice-error" role="status">{error}</p>}
      <div className="open-voice-actions">
        {!joined ? (
          <button type="button" className="open-voice-join" onClick={joinRoom} disabled={joining}>
            {joining ? "joining..." : "join voice chat"}
          </button>
        ) : (
          <>
            <span className="open-voice-connection-count">{connectionCount + 1} {connectionCount === 0 ? "person" : "people"} connected</span>
            <button type="button" className={muted ? "open-voice-control active" : "open-voice-control"} onClick={toggleMute}>{muted ? "unmute" : "mute"}</button>
            <button type="button" className={deafened ? "open-voice-control active" : "open-voice-control"} onClick={toggleDeafen}>{deafened ? "undeafen" : "deafen"}</button>
            <button type="button" className="open-voice-leave" onClick={() => leaveRoom(true)}>leave</button>
          </>
        )}
      </div>
      <div className="open-voice-audio-host" ref={audioHostRef} aria-hidden="true" />
    </section>
  );
}
