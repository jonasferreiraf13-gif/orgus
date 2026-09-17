import { getRawDb } from "@/db";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAllowedAdminEmail } from "@/lib/admin";

export async function POST() {
  const user = await getChatGPTUser(); if (!user) return Response.json({ error: "Autenticação necessária" }, { status: 401 });
  if (!isAllowedAdminEmail(user.email)) return Response.json({ error: "Acesso permitido somente ao e-mail administrativo" }, { status: 403 });
  const db = getRawDb(); const count = await db.prepare("SELECT COUNT(*) AS count FROM admins").first<{ count: number }>();
  if (Number(count?.count ?? 0) > 0) return Response.json({ error: "O administrador inicial já foi definido" }, { status: 409 });
  await db.prepare("INSERT INTO admins (user_id, email, created_at) VALUES (?, ?, ?)").bind(user.userId, user.email, new Date().toISOString()).run();
  return Response.json({ ok: true }, { status: 201 });
}
