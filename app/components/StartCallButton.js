"use client";

import { useState } from "react";

export default function StartCallButton({ calleeId }) {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  const startCall = async () => {
    if (loading || started) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "start",
          calleeId
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not start the call.");
      }

      setStarted(true);
    } catch (err) {
      setError(err?.message || "Could not start the call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-call-control">
      <button
        type="button"
        className="profile-call-button"
        onClick={startCall}
        disabled={loading || started}
      >
        {loading ? "Calling…" : started ? "Calling…" : "Start Call"}
      </button>
      {error && <span className="profile-call-error">{error}</span>}
    </div>
  );
}
