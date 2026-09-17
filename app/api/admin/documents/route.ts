import { env } from "cloudflare:workers";
import { getRawDb } from "@/db";
import { requireAdminApi } from "@/lib/admin";

const safeName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error; if (!env.BUCKET) return Response.json({ error: "Armazenamento indisponível" }, { status: 503 });
  const data = await request.formData(); const type = String(data.get("type") ?? ""); const title = String(data.get("title") ?? "").trim(); const file = data.get("file");
  if (!new Set(["catalog", "transparency"]).has(type) || !title || title.length > 180 || !(file instanceof File) || file.type !== "application/pdf" || file.size > 25_000_000) return Response.json({ error: "Envie um PDF válido de até 25 MB" }, { status: 400 });
  try {
    const db = getRawDb();
    if (type === "transparency") { const previous = await db.prepare("SELECT object_key FROM documents WHERE type = 'transparency'").all<{ object_key: string }>(); await db.prepare("DELETE FROM documents WHERE type = 'transparency'").run(); await Promise.all(previous.results.map((item) => env.BUCKET!.delete(item.object_key))); }
    const key = `documents/${type}/${crypto.randomUUID()}-${safeName(file.name)}`; await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: "application/pdf" }, customMetadata: { filename: file.name } });
    await db.prepare("INSERT INTO documents (type, title, object_key, filename, content_type, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)").bind(type, title, key, file.name, file.type, new Date().toISOString()).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) { console.error("document_upload_failed", error); return Response.json({ error: "Não foi possível enviar o arquivo" }, { status: 500 }); }
}
