"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setMessage("");
  }

  return (
    <main className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div>
            <p className="eyebrow">VEHEMENCE</p>
            <h1>Online Chat</h1>
            <p>Talk with the Vehemence community.</p>
          </div>
          <span className="chat-status">Online</span>
        </div>

        <section className="chat-card">
          <div className="chat-messages">
            <div className="chat-empty">
              <h2>No messages yet</h2>
              <p>Start the conversation.</p>
            </div>
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              type="text"
              placeholder="Send a message..."
              maxLength={500}
            />
            <button type="submit" className="primary-button">
              Send
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
