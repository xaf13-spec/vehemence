"use client";
import { useRef, useState } from "react";
import { createAIConversation } from "./actions";

const modes = {
  math: {
    title: "math solver",
    placeholder: "type a math problem in words or symbols...",
    examples: ["40 times 129 to the power of 2", "square root of 81", "3x plus 7 equals 22"]
  },
  writing: {
    title: "writing assistant",
    placeholder: "tell me what you need written or paste something to improve...",
    examples: ["write a paragraph about climate change", "help me start an essay about friendship", "make this sentence clearer"]
  }
};

export default function AIClient() {
  const [mode, setMode] = useState("math");
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);
  const inputRef = useRef(null);

  function switchMode(next) {
    if (busy || next === mode) return;
    setMode(next);
    setInput("");
    setAnswer("");
    setError("");
    setActive(null);
  }

  function newTask() {
    if (busy) return;
    setInput("");
    setAnswer("");
    setError("");
    setActive(null);
    inputRef.current?.focus();
  }

  async function submit(e) {
    e?.preventDefault();
    const prompt = input.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      let conversationId = active;
      if (!conversationId) {
        const created = await createAIConversation();
        if (created.error) throw new Error(created.error);
        conversationId = created.conversation.id;
        setActive(conversationId);
      }
      setInput("");
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: prompt, mode })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The request failed. Please try again.");
      }
      if (!response.body) throw new Error("The AI did not return a response.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setAnswer(result);
      }
      result += decoder.decode();
      setAnswer(result);
      if (!result.trim()) throw new Error("The AI returned an empty response. Please try again.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const current = modes[mode];

  return (
    <main className="ai-tools-page">
      <div className="ai-tools-shell">
        <div className="ai-tools-heading">
          <div className="ai-tools-mark">✳</div>
          <h1>vehemence ai</h1>
        </div>
        <div className="ai-mode-tabs" role="tablist" aria-label="ai tools">
          <button type="button" role="tab" aria-selected={mode === "math"} className={mode === "math" ? "active" : ""} onClick={() => switchMode("math")}>math</button>
          <button type="button" role="tab" aria-selected={mode === "writing"} className={mode === "writing" ? "active" : ""} onClick={() => switchMode("writing")}>writing</button>
        </div>
        <section className="ai-tool-panel">
          <div className="ai-tool-title-row">
            <div>
              <h2>{current.title}</h2>
              <p>{mode === "math" ? "ask using words, symbols, or a mix of both" : "write something new or improve what you already have"}</p>
            </div>
            <button type="button" className="ai-new-task" onClick={newTask} disabled={busy}>new task</button>
          </div>
          <form className="ai-tool-form" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(e); } }}
              placeholder={current.placeholder}
              rows={4}
              maxLength={12000}
              disabled={busy}
            />
            <div className="ai-tool-form-footer">
              <span>enter to submit · shift + enter for a new line</span>
              <button className="ai-run-button" type="submit" disabled={busy || !input.trim()}>{busy ? "working..." : mode === "math" ? "solve →" : "write →"}</button>
            </div>
          </form>
          {!answer && !busy && !error && (
            <div className="ai-examples">
              <span>try asking</span>
              <div>{current.examples.map(example => <button type="button" key={example} onClick={() => { setInput(example); inputRef.current?.focus(); }}>{example}</button>)}</div>
            </div>
          )}
          {(answer || busy || error) && (
            <div className="ai-result" aria-live="polite">
              <div className="ai-result-heading"><span>{mode === "math" ? "solution" : "result"}</span>{answer && <button type="button" onClick={() => navigator.clipboard?.writeText(answer)}>copy</button>}</div>
              {answer && <div className="ai-result-content">{answer}</div>}
              {busy && !answer && <p className="ai-working">working on it...</p>}
              {busy && answer && <p className="ai-working">generating...</p>}
              {error && <p className="ai-tool-error">{error}</p>}
            </div>
          )}
          <p className="ai-tool-disclaimer">ai can make mistakes. double-check important answers.</p>
        </section>
      </div>
    </main>
  );
}
