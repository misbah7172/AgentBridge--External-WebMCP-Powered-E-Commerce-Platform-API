"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) return;
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return <button type="button" onClick={logout} disabled={busy} className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Signing out…" : "Sign out"}</button>;
}
