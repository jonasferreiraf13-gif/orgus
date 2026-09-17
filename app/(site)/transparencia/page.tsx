import { Download, Scale } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getDocuments } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Portal da Transparência",
  description:
    "Consulte e baixe os Relatórios de Transparência e Igualdade Salarial de Mulheres e Homens da Orgus Indústria.",
  path: "/transparencia",
});
export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const documents = await getDocuments("transparency");
  return <main><PageHero eyebrow="Compromisso" title="Portal da Transparência" text="Acesso aos Relatórios de Transparência e Igualdade Salarial de Mulheres e Homens." image="/images/empresa-fachada.jpg"/><section className="py-16 lg:py-24"><div className="site-container"><div className="mx-auto max-w-4xl"><div className="mb-10 rounded-2xl bg-blue-50 p-7 sm:flex sm:items-start sm:gap-5"><Scale className="shrink-0 text-[#173e90]" size={32}/><div><h2 className="text-xl font-black">Transparência e igualdade</h2><p className="mt-2 leading-7 text-slate-600">A Orgus disponibiliza seus relatórios em atendimento às diretrizes de transparência salarial, reforçando seu compromisso com relações éticas, responsáveis e respeitosas.</p></div></div>{documents.length ? <div className="grid gap-4">{documents.map((doc) => <article key={doc.id} className="industrial-card flex flex-col gap-5 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-[#3274db]">Relatório oficial</p><h3 className="mt-2 text-lg font-black">{doc.title}</h3><p className="mt-1 text-sm text-slate-500">Publicado em {new Date(doc.uploaded_at).toLocaleDateString("pt-BR")}</p></div><a href={`/api/file?key=${encodeURIComponent(doc.object_key)}&download=1`} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#173e90] px-5 font-extrabold text-white"><Download size={17}/> Baixar PDF</a></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center"><p className="font-extrabold">Nenhum relatório publicado no momento.</p></div>}</div></div></section></main>;
}
