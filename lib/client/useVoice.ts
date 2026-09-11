"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
type Recognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  start(): void; stop(): void; abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const subscribe = () => () => {};
const recognitionSupported = () => Boolean((window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition);
export function useVoice(onTranscript: (text: string) => void) {
  const canListen = useSyncExternalStore(subscribe, recognitionSupported, () => false);
  const canSpeak = useSyncExternalStore(subscribe, () => "speechSynthesis" in window, () => false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const recognition = useRef<Recognition | null>(null);
  const transcript = useRef(onTranscript);
  useEffect(() => { transcript.current = onTranscript; }, [onTranscript]);
  useEffect(() => () => {
    if (recognition.current) { recognition.current.onend = null; recognition.current.onresult = null; recognition.current.onerror = null; recognition.current.abort(); }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);
  function stop() {
    recognition.current?.abort(); setListening(false);
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function listen() {
    if (listening) { recognition.current?.stop(); return; }
    stop(); setError("");
    const Constructor = (window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition;
    if (!Constructor) { setError("Voice input is unavailable in this browser. You can type your question below."); return; }
    const next = new Constructor(); recognition.current = next;
    next.lang = "en-US"; next.interimResults = false; next.continuous = false;
    next.onresult = event => { transcript.current(Array.from(event.results).map(result => result[0].transcript).join(" ")); };
    next.onerror = event => { setListening(false); if (event.error !== "aborted") setError(event.error === "not-allowed" ? "Microphone access was denied. Allow it in browser settings or type below." : "I didn’t catch that. Try again or type your question."); };
    next.onend = () => setListening(false);
    try { next.start(); setListening(true); } catch { setError("The microphone could not start. Please try again."); }
  }
  function speak(text: string) {
    if (!canSpeak) { setError("Read-aloud is unavailable in this browser. The answer is shown below."); return; }
    stop(); setError("");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = event => { setSpeaking(false); if (event.error !== "interrupted" && event.error !== "canceled") setError("Audio could not play. You can read the answer below."); };
    setSpeaking(true); window.speechSynthesis.speak(utterance);
  }
  return { canListen, canSpeak, listening, speaking, error, listen, speak, stop };
}
