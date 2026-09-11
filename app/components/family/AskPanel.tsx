"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Mic, Volume2 } from "lucide-react";
import { api } from "@/lib/client/api";
import AnswerFeedback from "./AnswerFeedback";
import { useVoice } from "@/lib/client/useVoice";
import type { AskResponse, FamilyConnection } from "@/lib/types";
export default function AskPanel({ connection, onBack }: { connection: FamilyConnection; onBack: () => void }) {
  const person = connection.person;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = useRef<AbortController | null>(null);
  const voice = useVoice(setQuestion);
  useEffect(() => () => active.current?.abort(), []);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!question.trim() || busy) return;
    voice.stop(); setError(""); setAnswer(null); setBusy(true);
    const controller = new AbortController(); active.current = controller;
    try {
      const result = await api.askRelative(person.id, question.trim(), controller.signal);
      if (!controller.signal.aborted) setAnswer(result);
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Please try again.");
    } finally { if (active.current === controller) { active.current = null; setBusy(false); } }
  }
  function cancel() { active.current?.abort(); active.current = null; setBusy(false); }
  return <section className="ask-panel">
    <button type="button" className="quiet-link" onClick={() => { cancel(); voice.stop(); onBack(); }}><ArrowLeft size={24} /> Your family</button>
    <div className="ask-heading"><div className="avatar">{person.name.slice(0, 1)}</div><p className="eyebrow">{connection.relationship}</p><h1>Ask about {person.name}</h1><p className="muted">A little closer, even when you’re apart.</p></div>
    <div className="surface ask-card">
      <button className={`microphone ${voice.listening ? "listening" : ""}`} type="button" onClick={voice.listen} disabled={busy || !voice.canListen} aria-label={voice.listening ? "Stop listening" : `Speak a question about ${person.name}`} aria-pressed={voice.listening}><Mic size={42} /><span>{voice.listening ? "Finish" : "Speak"}</span></button>
      <p className="mic-label" aria-live="polite">{voice.listening ? "Listening… tap Finish when you’re done" : voice.canListen ? "Speak your question" : "Type your question below"}</p>
      <p className="muted voice-note">{voice.canListen ? "Your browser may use its speech service to transcribe your voice. Review the words before asking." : "This browser doesn’t support voice input. You can still ask anything by typing."}</p>
      {voice.error && <p className="notice error" role="alert">{voice.error}</p>}
      <form onSubmit={submit} className="form-stack">
        <label>Your question<textarea value={question} onChange={e => setQuestion(e.target.value)} maxLength={2000} required rows={3} placeholder={`What has ${person.name} been doing?`} disabled={busy} /></label>
        <button className="question-suggestion" type="button" disabled={busy} onClick={() => setQuestion(`What has ${person.name} been up to recently?`)}>Try: “What’s new with {person.name}?”</button>
        <button className="primary" type="submit" disabled={busy || voice.listening || !question.trim()}>{busy ? "Finding an update…" : "Ask my question"}</button>
        {busy && <button type="button" className="secondary" onClick={cancel}>Cancel</button>}
      </form>
      {error && <p className="notice error" role="alert">{error}</p>}
    </div>
    {answer && <section className="surface answer-card" aria-live="polite" aria-atomic="true">
      <p className="eyebrow">Your family update</p><h2>Here’s what we found about {person.name}</h2>
      {answer.learning.feedbackCount > 0 && <p className="field-note">Using your feedback: {answer.learning.responseStyle === "detailed" ? "more detail" : "shorter answers"}.</p>}
      <p className="answer-text">{answer.answer}</p>
      <p className="field-note">Activity checked {new Date(answer.activityUpdatedAt).toLocaleString()}</p>
      {answer.sources.length > 0 && <ul className="source-list">{answer.sources.map((source, i) => <li key={`${source.url}-${i}`}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>}
      <div className="button-row"><button type="button" className="primary" onClick={() => voice.speaking ? voice.stop() : voice.speak(answer.answer)} disabled={!voice.canSpeak}><Volume2 size={24} />{voice.speaking ? "Stop reading" : "Read this to me"}</button><button type="button" className="secondary" onClick={() => { voice.stop(); setAnswer(null); setQuestion(""); document.querySelector<HTMLTextAreaElement>("textarea")?.focus(); }}>Ask another question</button></div>
      <AnswerFeedback key={answer.id} answerId={answer.id} />
    </section>}
  </section>;
}
