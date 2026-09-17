import { env } from "cloudflare:workers";
import { getRawDb } from "@/db";
import { requireAdminApi } from "@/lib/admin";

const allowedLines = new Set(["leve", "pesado-onibus", "universal"]); const allowedImages = new Set(["image/jpeg", "image/png", "image/webp"]);
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const safeName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error; if (!env.BUCKET) return Response.json({ error: "Armazenamento indisponível" }, { status: 503 });
  try {
    const id = Number((await params).id); const data = await request.formData(); const line = text(data, "line"); const brand = text(data, "brand"); const model = text(data, "model"); const code = text(data, "code"); const side = text(data, "side"); const description = text(data, "description"); const active = text(data, "active") === "true" ? 1 : 0;
    if (!Number.isInteger(id) || !allowedLines.has(line) || !brand || !model || !code || !side) return Response.json({ error: "Dados inválidos" }, { status: 400 });
    const images = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0); if (images.length > 8 || images.some((file) => !allowedImages.has(file.type) || file.size > 8_000_000)) return Response.json({ error: "Imagens inválidas" }, { status: 400 });
    await getRawDb().prepare("UPDATE products SET line = ?, brand = ?, model = ?, code = ?, side = ?, description = ?, active = ?, updated_at = ? WHERE id = ?").bind(line, brand, model, code, side, description, active, new Date().toISOString(), id).run();
    const current = await getRawDb().prepare("SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM product_images WHERE product_id = ?").bind(id).first<{ max_sort: number }>(); let sort = Number(current?.max_sort ?? -1) + 1;
    for (const file of images) { const key = `products/${id}/${crypto.randomUUID()}-${safeName(file.name)}`; await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { filename: file.name } }); await getRawDb().prepare("INSERT INTO product_images (product_id, object_key, filename, content_type, sort_order) VALUES (?, ?, ?, ?, ?)").bind(id, key, file.name, file.type, sort++).run(); }
    return Response.json({ ok: true });
  } catch (error) { console.error("product_update_failed", error); const message = error instanceof Error && error.message.includes("UNIQUE") ? "Já existe um produto com esse código" : "Não foi possível atualizar o produto"; return Response.json({ error: message }, { status: message.startsWith("Já") ? 409 : 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error; const id = Number((await params).id); if (!Number.isInteger(id)) return Response.json({ error: "Produto inválido" }, { status: 400 });
  const images = await getRawDb().prepare("SELECT object_key FROM product_images WHERE product_id = ?").bind(id).all<{ object_key: string }>(); await getRawDb().prepare("DELETE FROM products WHERE id = ?").bind(id).run(); if (env.BUCKET) await Promise.all(images.results.map((image) => env.BUCKET!.delete(image.object_key)));
  return Response.json({ ok: true });
}
