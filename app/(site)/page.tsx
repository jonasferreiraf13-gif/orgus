import Image from "next/image";
import { ArrowRight, Award, Factory, Microscope, ShieldCheck } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { createPageMetadata, DEFAULT_DESCRIPTION } from "@/lib/seo";
import { LINES } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Orgus Indústria | Faróis Automotivos desde 1981",
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const strengths = [
  { icon: Microscope, title: "Pesquisa e tecnologia", text: "Investimento contínuo no desenvolvimento de soluções alinhadas às exigências do mercado automotivo." },
  { icon: Factory, title: "Produção especializada", text: "Equipamentos, instalações modernas e uma equipe preparada para fabricar com consistência." },
  { icon: ShieldCheck, title: "Qualidade em cada etapa", text: "Processos acompanhados da produção ao pós-venda, com foco nas necessidades dos clientes." },
  { icon: Award, title: "Experiência desde 1981", text: "Mais de quatro décadas dedicadas à fabricação de faróis e peças plásticas técnicas automotivas." },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ slide?: string }>;
}) {
  const { slide } = await searchParams;
  const parsedSlide = Number.parseInt(slide ?? "0", 10);
  const currentSlide = Number.isInteger(parsedSlide) ? parsedSlide : 0;

  return (
    <main>
      <HeroCarousel current={currentSlide} />
      <section className="py-20 lg:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <span className="eyebrow">Nossa história</span>
            <h2 className="section-title">Tecnologia, experiência e compromisso com a estrada.</h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Fundada em 1981, a Orgus nasceu voltada à fabricação de faróis automotivos. Investimentos constantes em pesquisa, equipamentos, pessoas e instalações mantêm a empresa atualizada com as tecnologias que orientam o setor em todo o mundo.</p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Hoje, a Orgus combina capacidade produtiva, atendimento próximo e melhoria contínua para oferecer produtos eficientes ao mercado nacional e internacional.</p>
            <a href="/empresa" className="focus-ring mt-8 inline-flex items-center gap-2 font-extrabold text-[#173e90] hover:text-[#245bb6]">Conheça nossa empresa <ArrowRight size={18}/></a>
          </div>
          <div className="relative min-h-[430px] overflow-hidden rounded-2xl bg-[#173e90] shadow-[0_24px_70px_rgba(15,50,124,.2)]">
            <Image src="/images/empresa-fachada.jpg" alt="Instalações da Orgus Indústria" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071a3c] to-transparent p-7 pt-24 text-white"><p className="text-5xl font-black tracking-tight">1981</p><p className="mt-1 font-bold text-white/75">O início de uma história dedicada à iluminação automotiva.</p></div>
          </div>
        </div>
      </section>
      <section className="bg-[#f2f6fc] py-20 lg:py-28">
        <div className="site-container">
          <span className="eyebrow">Linhas de produtos</span>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="section-title">Soluções para cada tipo de aplicação.</h2><p className="max-w-md text-base leading-7 text-slate-600">Acesse cada linha, escolha uma marca e encontre os produtos disponíveis.</p></div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {LINES.map((line, index) => (
              <article key={line.slug} className="group industrial-card overflow-hidden rounded-2xl">
                <div className="relative h-64 overflow-hidden"><Image src={line.image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#081a3c]/70 to-transparent"/><span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/15 text-sm font-black text-white backdrop-blur">0{index + 1}</span></div>
                <div className="p-7"><p className="text-sm font-bold text-[#3274db]">{line.short}</p><h3 className="mt-2 text-2xl font-black tracking-tight">{line.title}</h3><p className="mt-3 min-h-20 leading-7 text-slate-600">{line.description}</p><a href={`/produtos/${line.slug}`} className="focus-ring mt-5 inline-flex items-center gap-2 font-extrabold text-[#173e90]">Ver produtos <ArrowRight size={17}/></a></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center"><span className="eyebrow">Nossa forma de trabalhar</span><h2 className="section-title mx-auto">Qualidade construída todos os dias.</h2></div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {strengths.map(({ icon: Icon, title, text }) => <div key={title} className="bg-white p-7"><Icon className="text-[#3274db]" size={30}/><h3 className="mt-6 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
