import "server-only";
import { getRawDb } from "@/db";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { SITE } from "@/lib/site";

export function isAllowedAdminEmail(email: string) {
  return email.trim().toLowerCase() === SITE.email.toLowerCase();
}

export async function getAdminState() {
  const user = await getChatGPTUser();
  if (!user) return { user: null, isAdmin: false, canClaim: false } as const;
  if (!isAllowedAdminEmail(user.email)) {
    return { user, isAdmin: false, canClaim: false } as const;
  }
  const [admin, count] = await Promise.all([
    getRawDb().prepare("SELECT id FROM admins WHERE user_id = ? LIMIT 1").bind(user.userId).first<{ id: number }>(),
    getRawDb().prepare("SELECT COUNT(*) AS count FROM admins").first<{ count: number }>(),
  ]);
  return { user, isAdmin: Boolean(admin), canClaim: Number(count?.count ?? 0) === 0 } as const;
}

export async function requireAdminApi() {
  const state = await getAdminState();
  if (!state.user) return { error: new Response(JSON.stringify({ error: "Autenticação necessária" }), { status: 401, headers: { "content-type": "application/json" } }) } as const;
  if (!state.isAdmin) return { error: new Response(JSON.stringify({ error: "Acesso negado" }), { status: 403, headers: { "content-type": "application/json" } }) } as const;
  return { user: state.user, error: null } as const;
}
