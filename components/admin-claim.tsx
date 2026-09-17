"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export function AdminClaim() {
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function claim() { setLoading(true); setError(""); const response = await fetch("/api/admin/claim", { method: "POST" }); if (response.ok) { window.location.reload(); return; } const body = await response.json().catch(() => ({})); setError(body.error ?? "Não foi possível ativar o administrador."); setLoading(false); }
  return <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl"><ShieldCheck className="mx-auto text-[#173e90]" size={42}/><h1 className="mt-5 text-2xl font-black">Ativar administrador inicial</h1><p className="mt-3 leading-7 text-slate-600">Este ambiente ainda não possui um administrador. Ative o usuário conectado para gerenciar produtos, catálogos e relatórios.</p>{error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}<button onClick={claim} disabled={loading} className="focus-ring mt-6 min-h-12 rounded-lg bg-[#173e90] px-6 font-extrabold text-white disabled:opacity-60">{loading ? "Ativando..." : "Ativar meu acesso"}</button></div>;
}
