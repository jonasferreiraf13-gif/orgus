import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { createPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contato",
  description:
    "Fale com a Orgus Indústria em Vargem Grande Paulista, SP, para informações comerciais sobre faróis automotivos, catálogos e atendimento.",
  path: "/contato",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <main><PageHero eyebrow="Contato" title="Vamos conversar?" text="Nossa equipe está pronta para receber sua dúvida, solicitação comercial ou pedido de informação."/><section className="bg-[#f5f7fb] py-16 lg:py-24"><div className="site-container">{status === "enviado" && <div className="mb-7 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 font-bold text-[#173e90]" role="status">Mensagem enviada. Nossa equipe responderá pelo contato informado.</div>}{status === "erro" && <div className="mb-7 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700" role="alert">Não foi possível enviar agora. Tente novamente ou escreva para {SITE.email}.</div>}<div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><div className="rounded-2xl bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">Canais de atendimento</h2><div className="mt-8 grid gap-6"><a href={SITE.phoneHref} className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#173e90]"><Phone size={20}/></span><span><span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">Telefone</span><span className="mt-1 block font-extrabold">{SITE.phoneDisplay}</span></span></a><a href={`mailto:${SITE.email}`} className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#173e90]"><Mail size={20}/></span><span><span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">E-mail</span><span className="mt-1 block font-extrabold">{SITE.email}</span></span></a><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#173e90]"><MapPin size={20}/></span><span><span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">Endereço</span><span className="mt-1 block max-w-sm font-bold leading-6">{SITE.address}</span></span></div></div></div><div className="rounded-2xl bg-[#0a1d43] p-8 text-white shadow-xl sm:p-10"><h2 className="text-2xl font-black">Envie uma mensagem</h2><p className="mb-7 mt-2 text-white/60">Preencha os dados abaixo. Responderemos pelo contato informado.</p><ContactForm/></div></div></div></section></main>;
}
