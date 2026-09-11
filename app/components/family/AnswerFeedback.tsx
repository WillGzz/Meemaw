"use client";
import { useState } from "react";
import { api } from "@/lib/client/api";
const options = [
  { kind: "HELPFUL", label: "That helped", message: "Thank you. Your feedback has been saved." },
  { kind: "SHORTER", label: "Keep it shorter", message: "I’ll ask for shorter answers next time." },
  { kind: "MORE_DETAIL", label: "Tell me more", message: "I’ll ask for more detail next time." },
  { kind: "NOT_ACCURATE", label: "That doesn’t sound right", message: "Thank you for telling me. I’ll refresh the activity and ask for better-supported answers next time." },
];
export default function AnswerFeedback({ answerId }: { answerId: string }) {
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function rate(option: typeof options[number]) {
    setBusy(true); setError("");
    try { await api.feedback(answerId, option.kind); setSelected(option.kind); setMessage(option.message); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not save feedback."); }
    finally { setBusy(false); }
  }
  return <div className="answer-feedback"><h3>Was this helpful?</h3><div className="button-row">{options.map(option => <button type="button" key={option.kind} className="secondary" disabled={busy} aria-pressed={selected === option.kind} onClick={() => void rate(option)}>{option.label}</button>)}</div>{message && <p className="notice" role="status">{message}</p>}{error && <p className="notice error" role="alert">{error}</p>}</div>;
}
