import Image from "next/image";
import { ChevronDown, ExternalLink, Menu, Phone } from "lucide-react";
import { LINES, SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <>
      <div className="bg-[#091a3c] text-white">
        <div className="site-container flex min-h-10 items-center justify-between gap-4 py-2 text-[13px]">
          <p className="hidden text-white/72 md:block">Tecnologia brasileira em iluminação automotiva desde 1981</p>
          <div className="ml-auto flex items-center gap-4">
            <a className="focus-ring flex items-center gap-2 hover:text-blue-200" href={SITE.phoneHref}><Phone size={14} /> {SITE.phoneDisplay}</a>
            <a className="focus-ring hidden hover:text-blue-200 sm:block" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_6px_28px_rgba(10,35,78,.06)] backdrop-blur-xl">
        <div className="site-container flex h-[82px] items-center justify-between gap-6">
          <a href="/" className="focus-ring shrink-0" aria-label="Orgus Indústria - página inicial">
            <Image src="/images/logo.png" alt="Orgus" width={184} height={64} priority className="h-auto w-[148px] sm:w-[170px]" />
          </a>
          <nav className="hidden items-center gap-7 text-[14px] font-bold text-[#23344f] lg:flex" aria-label="Navegação principal">
            <a className="focus-ring transition hover:text-[#245bb6]" href="/">Home</a>
            <a className="focus-ring transition hover:text-[#245bb6]" href="/empresa">Empresa</a>
            <div className="group relative py-7">
              <button className="focus-ring flex items-center gap-1 transition hover:text-[#245bb6]" type="button">Produtos <ChevronDown size={15} /></button>
              <div className="invisible absolute left-1/2 top-[72px] w-72 -translate-x-1/2 translate-y-2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-[0_18px_55px_rgba(8,29,70,.16)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {LINES.map((line) => (
                  <a key={line.slug} href={`/produtos/${line.slug}`} className="focus-ring block rounded-lg px-4 py-3 hover:bg-blue-50">
                    <span className="block text-sm font-extrabold text-[#173e90]">{line.title}</span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-500">{line.short}</span>
                  </a>
                ))}
              </div>
            </div>
            <a className="focus-ring transition hover:text-[#245bb6]" href="/catalogos">Catálogos</a>
            <a className="focus-ring transition hover:text-[#245bb6]" href="/transparencia">Transparência</a>
            <a className="focus-ring transition hover:text-[#245bb6]" href="/contato">Contato</a>
          </nav>
          <div className="hidden lg:block">
            <details className="group relative">
              <summary className="focus-ring flex cursor-pointer list-none items-center gap-2 rounded-md bg-[#173e90] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f327c]">Área do representante <ChevronDown size={15} /></summary>
              <div className="absolute right-0 top-14 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <a className="focus-ring flex items-center justify-between rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50" href="http://179.189.229.246:8080/auth" target="_blank" rel="noreferrer">Acesso 1 <ExternalLink size={14}/></a>
                <a className="focus-ring flex items-center justify-between rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50" href="http://177.86.124.113:8080/auth" target="_blank" rel="noreferrer">Acesso 2 <ExternalLink size={14}/></a>
              </div>
            </details>
          </div>
          <details className="relative lg:hidden">
            <summary className="focus-ring flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-[#173e90]" aria-label="Abrir menu"><Menu /></summary>
            <nav className="absolute right-0 top-14 max-h-[75vh] w-[min(340px,calc(100vw-28px))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl" aria-label="Navegação móvel">
              <a className="block rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="/">Home</a>
              <a className="block rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="/empresa">Empresa</a>
              <p className="px-4 pb-1 pt-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">Produtos</p>
              {LINES.map((line) => <a key={line.slug} className="block rounded-lg px-4 py-3 pl-6 font-bold text-[#173e90] hover:bg-blue-50" href={`/produtos/${line.slug}`}>{line.title}</a>)}
              <a className="block rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="/catalogos">Catálogos</a>
              <a className="block rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="/transparencia">Transparência</a>
              <a className="block rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="/contato">Contato</a>
              <div className="mt-2 border-t border-slate-200 pt-2">
                <a className="flex items-center justify-between rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="http://179.189.229.246:8080/auth" target="_blank" rel="noreferrer">Representante — Acesso 1 <ExternalLink size={14}/></a>
                <a className="flex items-center justify-between rounded-lg px-4 py-3 font-bold hover:bg-blue-50" href="http://177.86.124.113:8080/auth" target="_blank" rel="noreferrer">Representante — Acesso 2 <ExternalLink size={14}/></a>
              </div>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
