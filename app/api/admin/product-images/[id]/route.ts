import { env } from "cloudflare:workers";
import { getRawDb } from "@/db";
import { requireAdminApi } from "@/lib/admin";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error; const id = Number((await params).id); if (!Number.isInteger(id)) return Response.json({ error: "Imagem inválida" }, { status: 400 });
  const image = await getRawDb().prepare("SELECT object_key FROM product_images WHERE id = ?").bind(id).first<{ object_key: string }>(); if (!image) return Response.json({ error: "Imagem não encontrada" }, { status: 404 });
  await getRawDb().prepare("DELETE FROM product_images WHERE id = ?").bind(id).run(); if (env.BUCKET) await env.BUCKET.delete(image.object_key); return Response.json({ ok: true });
}
