import { Download, FileText } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getDocuments } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Catálogos de Faróis Automotivos",
  description:
    "Baixe os catálogos atualizados de faróis automotivos Orgus para veículos leves, caminhões, ônibus e aplicações universais.",
  path: "/catalogos",
});
export const dynamic = "force-dynamic";

export default async function CatalogsPage() {
  const documents = await getDocuments("catalog");
  return <main><PageHero eyebrow="Downloads" title="Catálogos Orgus" text="Acesse os materiais atualizados das nossas linhas de produtos." image="/images/hero-leve.jpg"/><section className="bg-[#f5f7fb] py-16 lg:py-24"><div className="site-container">{documents.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{documents.map((doc) => <article key={doc.id} className="industrial-card rounded-2xl p-7"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#173e90]"><FileText size={28}/></div><p className="mt-6 text-xs font-extrabold uppercase tracking-wider text-slate-400">Arquivo PDF</p><h2 className="mt-2 text-xl font-black">{doc.title}</h2><p className="mt-2 text-sm text-slate-500">Atualizado em {new Date(doc.uploaded_at).toLocaleDateString("pt-BR")}</p><a href={`/api/file?key=${encodeURIComponent(doc.object_key)}&download=1`} className="focus-ring mt-6 inline-flex items-center gap-2 font-extrabold text-[#173e90]">Baixar catálogo <Download size={17}/></a></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><FileText className="mx-auto text-slate-400" size={38}/><h2 className="mt-4 text-xl font-black">Catálogos em atualização</h2><p className="mt-2 text-slate-500">Os arquivos para download serão disponibilizados em breve.</p></div>}</div></section></main>;
}
