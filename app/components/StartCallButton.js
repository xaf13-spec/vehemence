"use client";

import { useState } from "react";

export default function StartCallButton({ calleeId }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleClick() {
    if (status !== "idle") return;

    setStatus("starting");
    setError("");

    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "start",
          calleeId: String(calleeId)
        })
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || `Call request failed (${response.status}).`);
      }

      if (!data.call?.id) {
        throw new Error("The call server did not return a call.");
      }

      setStatus("calling");

      window.dispatchEvent(
        new CustomEvent("vehemence-call-started", {
          detail: data.call
        })
      );
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Could not start the call.");
    }
  }

  return (
    <div className="profile-call-control">
      <button
        type="button"
        className="profile-call-button"
        onClick={handleClick}
        aria-label="Start voice call"
      >
        {status === "starting" ? "Starting…" : status === "calling" ? "Calling…" : "Start Call"}
      </button>
      {error && <span className="profile-call-error">{error}</span>}
    </div>
  );
}
