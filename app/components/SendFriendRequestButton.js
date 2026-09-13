"use client";

import { useState } from "react";
import { sendFriendRequest } from "../friends/actions";

export default function SendFriendRequestButton({ username }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleClick() {
    if (status !== "idle") return;
    setStatus("sending");
    setError("");

    const result = await sendFriendRequest(username);

    if (result?.error) {
      setError(result.error);
      setStatus("idle");
      return;
    }

    setStatus(result?.accepted ? "accepted" : "sent");
  }

  const label =
    status === "sending"
      ? "Sending..."
      : status === "accepted"
        ? "Friends"
        : status === "sent"
          ? "Request Sent"
          : "Send Friend Request";

  return (
    <div>
      <button
        type="button"
        className="secondary-button"
        onClick={handleClick}
        disabled={status !== "idle"}
      >
        {label}
      </button>
      {error && (
        <div
          role="alert"
          style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
