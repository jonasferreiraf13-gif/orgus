import "server-only";
import { getAdminUser } from "@/lib/admin-auth";

export async function getAdminState() {
  const user = await getAdminUser();
  return { user, isAdmin: Boolean(user) } as const;
}

export async function requireAdminApi() {
  const state = await getAdminState();
  if (!state.user) return { error: new Response(JSON.stringify({ error: "Sessão administrativa expirada" }), { status: 401, headers: { "content-type": "application/json", "cache-control": "no-store" } }) } as const;
  return { user: state.user, error: null } as const;
}
