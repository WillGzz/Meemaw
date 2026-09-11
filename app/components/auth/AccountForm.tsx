"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowLeft } from "lucide-react";
import { api } from "@/lib/client/api";
import type { Role } from "@/lib/types";

export default function AccountForm({ role }: { role?: Role }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(role === "ELDER" ? 1 : 2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instagram, setInstagram] = useState("");
  const [location, setLocation] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (stage === 1) { setStage(2); return; }
    setBusy(true);
    try {
      if (role) await api.register({ role, name, email, password, instagramUsername: instagram, location });
      else await api.login(email, password);
      router.replace("/dashboard"); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Please try again."); setBusy(false); }
  }
  return (
    <main className="meemaw-app account-page">
      <div className="account-shell">
        <Link className="quiet-link" href="/"><ArrowLeft size={20} /> Back home</Link>
        <section className="surface account-card">
          <div className="brand-mark"><HeartHandshake size={32} /></div>
          <p className="eyebrow">Meemaw · {role ? "Welcome to the family" : "Welcome back"}</p>
          <h1>{!role ? "Sign in" : stage === 1 ? "What’s your name?" : role === "RELATIVE" ? "Stay close, from anywhere." : "Save your place."}</h1>
          <p className="muted">{!role ? "Your family is right where you left them." : stage === 1 ? "Let’s make Meemaw yours." : role === "RELATIVE" ? "Create your account, then invite your family to connect." : "Use an email and password so you can come back to your family."}</p>
          <form onSubmit={submit} className="form-stack">
            {role && <label>Your name<input autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Ama Frempong" /></label>}
            {stage === 2 && <>
              {role === "RELATIVE" && <>
                <label>Instagram username<input required value={instagram} onChange={e => setInstagram(e.target.value)} maxLength={31} placeholder="@rexfordfrempong" autoCapitalize="none" spellCheck={false} /></label>
                <p className="field-note">You’ll choose what to share when you connect your account.</p>
                <label>Location <span className="muted">(optional)</span><input value={location} onChange={e => setLocation(e.target.value)} maxLength={120} autoComplete="address-level2" placeholder="Bronx, New York" /></label>
              </>}
              <label>Email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>
              <label>Password<input type="password" autoComplete={role ? "new-password" : "current-password"} required minLength={role ? 10 : 1} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} /></label>
              {role && <p className="field-note">Use at least 10 characters. Keep your password somewhere safe.</p>}
            </>}
            {error && <p className="notice error" role="alert">{error}</p>}
            <button className="primary" disabled={busy} type="submit">{busy ? "One moment…" : stage === 1 ? "Continue" : role ? "Create account" : "Sign in"}</button>
            {role === "ELDER" && stage === 2 && <button className="secondary" type="button" disabled={busy} onClick={() => setStage(1)}>Back</button>}
          </form>
          <p className="account-footer">{role ? <>Already have an account? <Link href="/login">Sign in</Link></> : <>New to Meemaw? <Link href="/">Create an account</Link></>}</p>
        </section>
      </div>
    </main>
  );
}
