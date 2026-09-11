"use client";
import { useCallback, useEffect, useState } from "react";
import { ConnectButton } from "@withone/connect/react";

type OneState = { configured: boolean; connected: boolean; message?: string; connections: { key: string; name: string; platform: string; access: { policy?: string; methods?: string[]; actions?: { title: string }[] } }[] };
export default function OneConnections() {
  const [state, setState] = useState<OneState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/one/connections", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load your connected accounts.");
      setState(data);
    } catch (error) { setError(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/one/connections", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load your connected accounts.");
        if (!controller.signal.aborted) setState(data);
      })
      .catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Please try again."); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, []);
  return <section className="surface connection-card">
    <p className="eyebrow">Your accounts</p><h2>Choose what you share</h2>
    <p className="muted">Connect through One to choose which accounts Meemaw may access. You can change or revoke access in One at any time.</p>
    {state?.configured && <div className="one-button"><ConnectButton authorizeUrl="/api/one/authorize" label={state.connected ? "Manage connected accounts" : "Connect with One"} theme="light" onSuccess={() => { void reload(); }} onError={message => setError(message)} /></div>}
    {state && !state.configured && <p className="notice">Account connections are being set up. Your profile and family invitations are ready to use.</p>}
    {state?.message && <p className="notice">{state.message}</p>}
    {state?.connected && state.connections.length === 0 && <p className="notice">One is connected, but no accounts were shared. Choose an account using the button above.</p>}
    {state?.connections.map(connection => <div className="connected-account" key={connection.key}><div><strong>{connection.name}</strong><p>{connection.platform}</p></div><span className="status accepted">{connection.access.policy === "full" ? "Full access granted" : connection.access.policy === "methods" ? `Allowed: ${connection.access.methods?.join(", ") || "none"}` : connection.access.policy === "actions" ? `${connection.access.actions?.length || 0} actions allowed` : "Access granted"}</span></div>)}
    {error && <p className="notice error" role="alert">{error}</p>}
    <button type="button" className="quiet-link" disabled={busy} onClick={() => { setBusy(true); setError(""); void reload(); }}>{busy ? "Checking accounts…" : "Refresh accounts"}</button>
  </section>;
}
