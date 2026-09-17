import { getRawDb } from "@/db";

export async function POST(request: Request) {
  const isHtmlForm = !request.headers.get("content-type")?.includes("application/json");
  const redirectToContact = (status: "enviado" | "erro") =>
    Response.redirect(new URL(`/contato?status=${status}`, request.url), 303);

  try {
    const body = isHtmlForm
      ? Object.fromEntries(await request.formData())
      : await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim(); const email = String(body.email ?? "").trim(); const phone = String(body.phone ?? "").trim(); const message = String(body.message ?? "").trim();
    if (String(body.website ?? "").trim()) return isHtmlForm ? redirectToContact("enviado") : Response.json({ ok: true }, { status: 201 });
    if (name.length < 2 || !email.includes("@") || message.length < 5 || name.length > 120 || email.length > 180 || phone.length > 40 || message.length > 4000) return isHtmlForm ? redirectToContact("erro") : Response.json({ error: "Dados inválidos" }, { status: 400 });
    await getRawDb().prepare("INSERT INTO contact_messages (name, email, phone, message, status, created_at) VALUES (?, ?, ?, ?, 'novo', ?)").bind(name, email, phone, message, new Date().toISOString()).run();
    return isHtmlForm ? redirectToContact("enviado") : Response.json({ ok: true }, { status: 201 });
  } catch (error) { console.error("contact_submit_failed", error); return isHtmlForm ? redirectToContact("erro") : Response.json({ error: "Serviço temporariamente indisponível" }, { status: 503 }); }
}
