"use client";

import { useEffect, useState } from "react";

const demoMessages = [
  { username: "Vehemence", message: "Welcome to the chat!", time: "2m ago" },
  { username: "Alex", message: "yo whats up", time: "1m ago" }
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(demoMessages);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { username: "You", message: text, time: "now" }
    ]);
    setMessage("");
  }

  const latest = messages[messages.length - 1];
  const notificationCount = open ? 0 : messages.length;

  return (
    <div className={`chat-widget ${open ? "chat-widget-open" : ""}`}>
      {open ? (
        <section className="chat-window">
          <header className="chat-window-header">
            <div>
              <strong>Online Chat</strong>
              <span>Community chat</span>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)}>
              −
            </button>
          </header>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div className="chat-message" key={`${item.username}-${index}`}>
                <div className="chat-message-top">
                  <strong>{item.username}</strong>
                  <span>{item.time}</span>
                </div>
                <div className="chat-bubble">{item.message}</div>
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              type="text"
              placeholder="Type a message..."
              maxLength={500}
            />
            <button type="submit" className="chat-send">Send</button>
          </form>
        </section>
      ) : (
        <div className="chat-minimized-wrap">
          {latest && (
            <div className="chat-preview">
              <strong>{latest.username}</strong>
              <span>{latest.message}</span>
              <small>{latest.time}</small>
            </div>
          )}

          <button type="button" className="chat-launcher" onClick={() => setOpen(true)}>
            <span className="chat-icon">💬</span>
            {notificationCount > 0 && (
              <span className="chat-notification">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
