"use client";

import { useEffect, useRef, useState } from "react";
import { getBrowserTimeZone } from "@/lib/timezone";
import { features } from "@/content/site";
import { Button } from "@/components/ui/Button";

/** Config-flagged (features.callbackRequest) — ships disabled by default; renders nothing until enabled. */
export function CallbackRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const renderedAtRef = useRef(0);
  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  if (!features.callbackRequest) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Please confirm you consent to us contacting you about this request.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          preferredWindow,
          timeZone: getBrowserTimeZone(),
          serviceConsent: true,
          renderedAt: renderedAtRef.current,
          companyWebsite: "",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-sm text-ink-soft">Thanks — we&rsquo;ll call you back during your preferred window.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-line bg-canvas p-5">
      <p className="text-sm font-medium text-ink">Request a call back</p>
      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
      />
      <input
        placeholder="Phone number to call"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
      />
      <input
        placeholder="Preferred window (e.g. weekday mornings)"
        value={preferredWindow}
        onChange={(e) => setPreferredWindow(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
      />
      <label className="flex items-start gap-2 text-xs text-ink-soft">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        I consent to being contacted about this request.
      </label>
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button type="submit" variant="secondary" disabled={status === "submitting"} className="!py-2 text-sm">
        {status === "submitting" ? "Sending…" : "Request call back"}
      </Button>
    </form>
  );
}
