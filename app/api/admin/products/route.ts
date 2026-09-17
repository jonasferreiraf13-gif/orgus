import { env } from "cloudflare:workers";
import { getRawDb } from "@/db";
import { requireAdminApi } from "@/lib/admin";

const allowedLines = new Set(["leve", "pesado-onibus", "universal"]);
const allowedImages = new Set(["image/jpeg", "image/png", "image/webp"]);
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const safeName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.error) return auth.error;
  if (!env.BUCKET) return Response.json({ error: "Armazenamento indisponível" }, { status: 503 });
  try {
    const data = await request.formData(); const line = text(data, "line"); const brand = text(data, "brand"); const model = text(data, "model"); const code = text(data, "code"); const side = text(data, "side"); const description = text(data, "description"); const active = text(data, "active") === "true" ? 1 : 0;
    if (!allowedLines.has(line) || !brand || !model || !code || !side || [brand, model, code, side].some((value) => value.length > 160) || description.length > 6000) return Response.json({ error: "Revise os campos obrigatórios" }, { status: 400 });
    const images = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    if (images.length > 8 || images.some((file) => !allowedImages.has(file.type) || file.size > 8_000_000)) return Response.json({ error: "Envie até 8 imagens JPG, PNG ou WEBP de no máximo 8 MB" }, { status: 400 });
    const now = new Date().toISOString(); const result = await getRawDb().prepare("INSERT INTO products (line, brand, model, code, side, description, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(line, brand, model, code, side, description, active, now, now).run();
    const id = Number(result.meta.last_row_id);
    for (let index = 0; index < images.length; index++) { const file = images[index]; const key = `products/${id}/${crypto.randomUUID()}-${safeName(file.name)}`; await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { filename: file.name } }); await getRawDb().prepare("INSERT INTO product_images (product_id, object_key, filename, content_type, sort_order) VALUES (?, ?, ?, ?, ?)").bind(id, key, file.name, file.type, index).run(); }
    return Response.json({ id }, { status: 201 });
  } catch (error) { console.error("product_create_failed", error); const message = error instanceof Error && error.message.includes("UNIQUE") ? "Já existe um produto com esse código" : "Não foi possível cadastrar o produto"; return Response.json({ error: message }, { status: message.startsWith("Já") ? 409 : 500 }); }
}
