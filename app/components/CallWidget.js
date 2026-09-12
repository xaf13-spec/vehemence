"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 1000;

async function callApi(body) {
  const response = await fetch("/api/calls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Call request failed.");
  }

  return data;
}

export default function CallWidget() {
  const [calls, setCalls] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");

  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const seenCandidatesRef = useRef(new Set());
  const activeCallIdRef = useRef(null);
  const initializedCallRef = useRef(null);

  const cleanupMedia = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    seenCandidatesRef.current.clear();
    activeCallIdRef.current = null;
    initializedCallRef.current = null;
    setMuted(false);
  }, []);

  const finishCall = useCallback(async (callId) => {
    cleanupMedia();
    setActiveCall(null);
    setCalls((current) => current.filter((call) => call.id !== callId));

    try {
      await callApi({ action: "end", callId });
    } catch {
      // The other side may have already ended the call.
    }
  }, [cleanupMedia]);

  const setupPeer = useCallback(async (call) => {
    if (initializedCallRef.current === call.id) return;
    initializedCallRef.current = call.id;
    activeCallIdRef.current = call.id;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteAudioRef.current && remoteStream) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play().catch(() => {});
        }
      };

      peer.onicecandidate = async (event) => {
        if (!event.candidate) return;

        try {
          await callApi({
            action: "candidate",
            callId: call.id,
            value: event.candidate.toJSON()
          });
        } catch {
          // Polling will keep the call alive if an individual candidate fails.
        }
      };

      peer.onconnectionstatechange = () => {
        if (["failed", "closed", "disconnected"].includes(peer.connectionState)) {
          setError("The voice connection ended.");
        }
      };

      if (currentUserId === call.callerId) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        await callApi({
          action: "offer",
          callId: call.id,
          value: peer.localDescription.toJSON()
        });
      }
    } catch (err) {
      initializedCallRef.current = null;
      setError(err?.message || "Microphone access was unavailable.");
    }
  }, [currentUserId]);

  const processCall = useCallback(async (call) => {
    const isCaller = call.callerId === currentUserId;
    const isCallee = call.calleeId === currentUserId;

    if (!isCaller && !isCallee) return;

    if (call.status === "ringing" && isCallee) {
      setActiveCall((current) => current || call);
      return;
    }

    if (call.status === "accepted") {
      setActiveCall(call);
      await setupPeer(call);

      const peer = peerRef.current;
      if (!peer) return;

      if (isCallee && call.offer && !peer.currentRemoteDescription) {
        await peer.setRemoteDescription(call.offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        await callApi({
          action: "answer",
          callId: call.id,
          value: peer.localDescription.toJSON()
        });
      }

      if (isCaller && call.answer && !peer.currentRemoteDescription) {
        await peer.setRemoteDescription(call.answer);
      }

      const { data } = await fetch(`/api/calls?callId=${encodeURIComponent(call.id)}`).then((response) => response.json()).catch(() => ({ data: [] }));
      const candidates = Array.isArray(data) ? data : [];

      for (const candidate of candidates) {
        if (!candidate?.id || seenCandidatesRef.current.has(candidate.id)) continue;
        seenCandidatesRef.current.add(candidate.id);

        if (candidate.senderId !== currentUserId) {
          try {
            await peer.addIceCandidate(candidate.candidate);
          } catch {
            // Ignore stale ICE candidates.
          }
        }
      }
    }
  }, [currentUserId, setupPeer]);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await fetch("/api/calls", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (cancelled) return;

        setCurrentUserId(data.currentUserId || null);
        setCalls(data.calls || []);
      } catch {
        // Keep the widget quiet when the user is logged out or offline.
      }
    };

    poll();
    const interval = window.setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!currentUserId || !calls.length) return;

    calls.forEach((call) => {
      processCall(call).catch((err) => {
        setError(err?.message || "Could not connect the call.");
      });
    });
  }, [calls, currentUserId, processCall]);

  useEffect(() => {
    return () => cleanupMedia();
  }, [cleanupMedia]);

  const incomingCall = activeCall && activeCall.status === "ringing" && activeCall.calleeId === currentUserId;
  const outgoingCall = activeCall && activeCall.status === "ringing" && activeCall.callerId === currentUserId;
  const connectedCall = activeCall && activeCall.status === "accepted";

  const otherUsername = activeCall
    ? activeCall.callerId === currentUserId
      ? activeCall.calleeUsername
      : activeCall.callerUsername
    : "";

  const accept = async () => {
    if (!activeCall) return;

    try {
      setError("");
      await callApi({ action: "accept", callId: activeCall.id });
    } catch (err) {
      setError(err?.message || "Could not accept the call.");
    }
  };

  const decline = async () => {
    if (!activeCall) return;

    const callId = activeCall.id;
    cleanupMedia();
    setActiveCall(null);
    setCalls((current) => current.filter((call) => call.id !== callId));

    try {
      await callApi({ action: "decline", callId });
    } catch {
      // Nothing else to do if the call has already disappeared.
    }
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
  };

  if (!activeCall && !error) return <audio ref={remoteAudioRef} autoPlay />;

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay />

      {activeCall && (
        <div className="call-widget">
          <div className="call-window">
            <div className="call-window-top">
              <span className="settings-eyebrow">VOICE CALL</span>
              <span className="call-status-dot" />
            </div>

            <div className="call-person">
              <h2>{otherUsername}</h2>
              <p>
                {incomingCall
                  ? "Incoming call"
                  : outgoingCall
                    ? "Calling…"
                    : connectedCall
                      ? "Connected"
                      : "Connecting…"}
              </p>
            </div>

            {error && <div className="call-error">{error}</div>}

            <div className="call-actions">
              {incomingCall && (
                <>
                  <button type="button" className="call-action call-accept" onClick={accept}>
                    Accept
                  </button>
                  <button type="button" className="call-action call-decline" onClick={decline}>
                    Decline
                  </button>
                </>
              )}

              {connectedCall && (
                <>
                  <button type="button" className="call-action call-mute" onClick={toggleMute}>
                    {muted ? "Unmute" : "Mute"}
                  </button>
                  <button type="button" className="call-action call-decline" onClick={() => finishCall(activeCall.id)}>
                    End Call
                  </button>
                </>
              )}

              {outgoingCall && (
                <button type="button" className="call-action call-decline" onClick={decline}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!activeCall && error && (
        <div className="call-error-toast">{error}</div>
      )}
    </>
  );
}
