import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LINES } from "@/lib/site";

const copy = [
  { kicker: "Linha leve", title: "Precisão que ilumina cada caminho.", text: "Faróis e kits para automóveis e utilitários, produzidos com tecnologia e confiança." },
  { kicker: "Pesados e ônibus", title: "Visibilidade para quem move o Brasil.", text: "Iluminação automotiva preparada para caminhões, ônibus e longas jornadas." },
  { kicker: "Universais e agrícolas", title: "Desempenho além do asfalto.", text: "Faróis auxiliares e soluções universais para aplicações que exigem mais." },
];

export function HeroCarousel({ current = 0 }: { current?: number }) {
  const active = current >= 0 && current < LINES.length ? current : 0;
  const previous = (active - 1 + LINES.length) % LINES.length;
  const next = (active + 1) % LINES.length;

  return (
    <section id="destaque" className="relative min-h-[640px] overflow-hidden bg-[#081a3c] text-white sm:min-h-[700px]" aria-roledescription="carrossel" aria-label="Linhas de produtos Orgus">
      {LINES.map((line, index) => (
        <div key={line.slug} className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
          <Image src={line.image} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,19,47,.96)_0%,rgba(7,25,60,.76)_42%,rgba(5,18,42,.15)_78%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,17,38,.7),transparent_42%)]" />
        </div>
      ))}
      <div className="beam-grid absolute inset-0 opacity-40" />
      <div className="site-container relative z-10 flex min-h-[640px] items-center py-20 sm:min-h-[700px]">
        <div className="max-w-3xl pt-8">
          <p className="mb-5 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[.2em] text-blue-200"><span className="h-px w-10 bg-blue-300" />{copy[active].kicker}</p>
          <h1 className="max-w-3xl text-[clamp(3rem,7vw,6.7rem)] font-black leading-[.91] tracking-[-.06em]">{copy[active].title}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/75 sm:text-xl">{copy[active].text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={`/produtos/${LINES[active].slug}`} className="focus-ring inline-flex min-h-13 items-center gap-2 rounded-md bg-white px-6 font-extrabold text-[#173e90] transition hover:bg-blue-50">Conheça a linha <ArrowRight size={18}/></a>
            <a href="/empresa" className="focus-ring inline-flex min-h-13 items-center rounded-md border border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur-sm transition hover:bg-white/12">Conheça a Orgus</a>
          </div>
        </div>
      </div>
      <div className="site-container absolute inset-x-0 bottom-7 z-20 flex items-end justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Selecionar destaque">
          {LINES.map((line, index) => <a key={line.slug} href={`/?slide=${index}#destaque`} rel="nofollow" className={`focus-ring block h-1.5 rounded-full transition-all ${index === active ? "w-14 bg-white" : "w-7 bg-white/35 hover:bg-white/65"}`} aria-label={`Mostrar ${line.title}`} aria-selected={index === active} role="tab" />)}
        </div>
        <div className="flex gap-2">
          <a href={`/?slide=${previous}#destaque`} rel="nofollow" className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 backdrop-blur hover:bg-white/15" aria-label="Slide anterior"><ChevronLeft /></a>
          <a href={`/?slide=${next}#destaque`} rel="nofollow" className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 backdrop-blur hover:bg-white/15" aria-label="Próximo slide"><ChevronRight /></a>
        </div>
      </div>
    </section>
  );
}
