"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, Mic, Plus, RefreshCw } from "lucide-react";
import type { DashboardData, FamilyConnection } from "@/lib/types";
import { api, RequestError } from "@/lib/client/api";
import AskPanel from "./AskPanel";
import OneConnections from "./OneConnections";

export default function FamilyDashboard({ initial }: { initial: DashboardData }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [selected, setSelected] = useState<FamilyConnection | null>(null);
  const [connecting, setConnecting] = useState(initial.connections.length === 0);
  const [code, setCode] = useState("");
  const [relationship, setRelationship] = useState("Grandson");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const elder = data.user.role === "ELDER";
  async function perform(action: () => Promise<unknown>, success = "") {
    setBusy(true); setError(""); setMessage("");
    try { await action(); setData(await api.dashboard()); setMessage(success); }
    catch (error) { if (error instanceof RequestError && error.status === 401) router.replace("/login"); else setError(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  function connect(event: FormEvent) {
    event.preventDefault();
    void perform(async () => { await api.connect(code, relationship); setCode(""); setConnecting(false); }, "Request sent. Your relative can approve it from their Meemaw account.");
  }
  async function share() {
    setError(""); setMessage("");
    const text = `Connect with ${data.user.name} on Meemaw. My family code is ${data.user.familyCode}.`;
    try {
      if (navigator.share) await navigator.share({ title: "My Meemaw family code", text });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(text); setMessage("Family code copied. Share it with someone you want to connect with."); }
      else setMessage(`Your family code is ${data.user.familyCode}. You can select and copy it below.`);
    } catch (error) { if (!(error instanceof Error && error.name === "AbortError")) setError("Sharing could not open. You can select and copy the family code below."); }
  }
  async function logout() {
    setBusy(true); setError("");
    try { await api.logout(); router.replace("/login"); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not sign out."); setBusy(false); }
  }
  return <main className="meemaw-app dashboard-page">
    <header className="family-header"><a href="/dashboard" className="brand"><HeartHandshake size={30} /><span>Meemaw</span></a><button className="quiet-link" type="button" onClick={() => void logout()} disabled={busy}>Sign out</button></header>
    <div className="dashboard-shell">
      {error && <p className="notice error" role="alert">{error}</p>}
      {message && <p className="notice" role="status">{message}</p>}
      {selected ? <AskPanel key={selected.id} connection={selected} onBack={() => setSelected(null)} /> : <>
        <section className="dashboard-intro"><p className="eyebrow">A little closer, every day</p><h1>Hello, {data.user.name}.</h1><p className="muted">{elder ? "Who would you like to hear about today?" : "You’re ready. Invite the people who matter most."}</p></section>
        {!elder && <><section className="surface invite-card"><div><p className="eyebrow">Your family code</p><p className="family-code">{data.user.familyCode}</p><p className="muted">Share this code with your family. You approve each person before they can ask about you.</p><p className="instagram-label">Instagram · @{data.user.instagramUsername}</p></div><button type="button" className="primary" onClick={() => void share()}>Share family code</button></section><OneConnections /></>}
        <div className="section-heading"><h2>{elder ? "Your family" : "Family connections"}</h2><button type="button" className="quiet-link" disabled={busy} onClick={() => void perform(async () => {})}><RefreshCw size={19} />{busy ? "Updating…" : "Refresh"}</button></div>
        {data.connections.length === 0 && <div className="empty-state"><HeartHandshake size={40} /><h3>{elder ? "Let’s find your family." : "Your first connection starts here."}</h3><p>{elder ? "Ask your relative for their family code, then enter it below." : "Share your family code. Requests will appear here for you to approve."}</p></div>}
        <div className="family-grid">{data.connections.map(connection => <article className="surface family-card" key={connection.id}>
          <div className="avatar">{connection.person.name.slice(0, 1)}</div><span className={`status ${connection.status.toLowerCase()}`}>{connection.status === "ACCEPTED" ? "Connected" : connection.status === "PENDING" ? "Waiting for approval" : "Connection declined"}</span>
          <h3>{connection.person.name}</h3><p className="relationship">{elder ? connection.relationship : `You are their ${connection.relationship.toLowerCase()}`}</p>
          {connection.person.location && <p className="muted">{connection.person.location}</p>}
          {elder && connection.status === "ACCEPTED" && <button type="button" className="primary" onClick={() => setSelected(connection)}><Mic size={24} />Ask about {connection.person.name}</button>}
          {elder && connection.status === "PENDING" && <p className="field-note">We’ll be ready once your relative approves. Use Refresh to check.</p>}
          {!elder && connection.status === "PENDING" && <div className="button-row"><button type="button" className="primary" disabled={busy} onClick={() => void perform(() => api.respond(connection.id, "ACCEPTED"), "Connection approved.")}>Accept</button><button type="button" className="secondary" disabled={busy} onClick={() => void perform(() => api.respond(connection.id, "DECLINED"), "Connection declined.")}>Decline</button></div>}
          {!elder && connection.status === "ACCEPTED" && <button type="button" className="quiet-link" disabled={busy} onClick={() => void perform(() => api.respond(connection.id, "DECLINED"), "Access removed.")}>Remove access</button>}
        </article>)}</div>
        {elder && <section className="add-family-section">
          {!connecting ? <button type="button" className="secondary" onClick={() => setConnecting(true)}><Plus size={24} />Add a family member</button> : <form className="surface form-stack connect-form" onSubmit={connect}><h2>Connect with family</h2><label>Family code<input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="MF-…" required maxLength={40} autoCapitalize="characters" spellCheck={false} /></label><label>They are my<select value={relationship} onChange={e => setRelationship(e.target.value)}>{["Grandson", "Granddaughter", "Son", "Daughter", "Sibling", "Parent", "Friend", "Other relative"].map(label => <option key={label}>{label}</option>)}</select></label><button type="submit" className="primary" disabled={busy || !code.trim()}>{busy ? "Sending…" : "Send connection request"}</button><button type="button" className="quiet-link" disabled={busy} onClick={() => setConnecting(false)}>Cancel</button></form>}
        </section>}
      </>}
    </div>
  </main>;
}
