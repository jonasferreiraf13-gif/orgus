import Image from "next/image";
import { Camera, Mail, MapPin, Phone, ThumbsUp } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { LINES, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#081a3c] text-white">
      <div className="beam-grid border-b border-white/10 py-16 lg:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-extrabold uppercase tracking-[.18em] text-blue-300">Fale com a Orgus</span>
            <h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Conte com quem entende de iluminação automotiva.</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/65">Envie sua dúvida, solicitação comercial ou pedido de informação. Nossa equipe entrará em contato.</p>
          </div>
          <ContactForm compact />
        </div>
      </div>
      <div className="site-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.9fr_1.2fr]">
        <div>
          <Image src="/images/logo.png" alt="Orgus" width={178} height={62} className="rounded bg-white p-2" />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">Faróis automotivos desenvolvidos com tecnologia, qualidade e compromisso desde 1981.</p>
          <div className="mt-5 flex gap-3">
            <a className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:bg-white/10" href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram da Orgus"><Camera size={18}/></a>
            <a className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:bg-white/10" href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook da Orgus"><ThumbsUp size={18}/></a>
          </div>
        </div>
        <div><h3 className="font-extrabold">Navegação</h3><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="/empresa">Empresa</a><a href="/catalogos">Catálogos</a><a href="/transparencia">Transparência</a><a href="/contato">Contato</a><a href="/admin">Área administrativa</a></div></div>
        <div><h3 className="font-extrabold">Produtos</h3><div className="mt-4 grid gap-3 text-sm text-white/65">{LINES.map((line) => <a key={line.slug} href={`/produtos/${line.slug}`}>{line.title}</a>)}</div></div>
        <div>
          <h3 className="font-extrabold">Contato</h3>
          <div className="mt-4 grid gap-4 text-sm text-white/65">
            <a href={SITE.phoneHref} className="flex items-start gap-3"><Phone className="mt-0.5 shrink-0 text-blue-300" size={17}/>{SITE.phoneDisplay}</a>
            <a href={`mailto:${SITE.email}`} className="flex items-start gap-3"><Mail className="mt-0.5 shrink-0 text-blue-300" size={17}/>{SITE.email}</a>
            <p className="flex items-start gap-3 leading-6"><MapPin className="mt-0.5 shrink-0 text-blue-300" size={17}/>{SITE.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} Orgus Indústria. Todos os direitos reservados.</div>
    </footer>
  );
}
