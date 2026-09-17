import { env } from "cloudflare:workers";

export async function GET(request: Request) {
  if (!env.BUCKET) return new Response("Armazenamento indisponível", { status: 503 });
  const url = new URL(request.url); const key = url.searchParams.get("key");
  if (!key || key.length > 500 || key.includes("..")) return new Response("Arquivo inválido", { status: 400 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Arquivo não encontrado", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("cache-control", key.startsWith("products/") ? "public, max-age=86400" : "private, max-age=300");
  if (url.searchParams.get("download") === "1") headers.set("content-disposition", `attachment; filename*=UTF-8''${encodeURIComponent(object.customMetadata?.filename ?? "arquivo")}`);
  return new Response(object.body, { headers });
}
