import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Box, CheckCircle2, Mail, Phone } from "lucide-react";
import { getProduct } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import { getLineByValue, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getProduct(Number(id));
  if (!data) return { title: "Produto" };
  const { product } = data;
  const description = `Farol automotivo Orgus ${product.brand} ${product.model}, código ${product.code}, lado ${product.side}. ${product.description}`
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return createPageMetadata({
    title: `${product.brand} ${product.model} — Código ${product.code}`,
    description,
    path: `/produto/${product.id}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const data = await getProduct(Number(id)); if (!data) notFound();
  const { product, images } = data; const line = getLineByValue(product.line);
  return <main className="bg-[#f5f7fb] py-12 lg:py-20"><div className="site-container"><a href={line ? `/produtos/${line.slug}` : "/"} className="focus-ring mb-8 inline-flex items-center gap-2 font-extrabold text-[#173e90]"><ArrowLeft size={17}/> Voltar para {line?.title ?? "produtos"}</a><div className="grid gap-9 lg:grid-cols-[1.05fr_.95fr]"><div><div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:min-h-[560px]">{images[0] ? <img src={`/api/file?key=${encodeURIComponent(images[0].object_key)}`} alt={`${product.brand} ${product.model}`} className="max-h-[500px] w-full object-contain"/> : <Box className="text-slate-300" size={90}/>}</div>{images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{images.slice(1).map((image) => <div key={image.id} className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2"><img src={`/api/file?key=${encodeURIComponent(image.object_key)}`} alt="" className="h-full w-full object-contain"/></div>)}</div>}</div><div className="lg:py-5"><p className="text-sm font-extrabold uppercase tracking-[.16em] text-[#3274db]">{line?.title}</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">{product.brand} {product.model}</h1><div className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-r border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Código</p><p className="mt-2 text-lg font-black">{product.code}</p></div><div className="border-b border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lado</p><p className="mt-2 text-lg font-black">{product.side}</p></div><div className="border-r border-slate-200 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Marca</p><p className="mt-2 font-extrabold">{product.brand}</p></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Modelo</p><p className="mt-2 font-extrabold">{product.model}</p></div></div>{product.description && <div className="mt-8"><h2 className="text-lg font-extrabold">Descrição</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{product.description}</p></div>}<div className="mt-9 rounded-2xl bg-[#0a1d43] p-6 text-white"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-300"/><div><h2 className="font-extrabold">Precisa de mais informações?</h2><p className="mt-1 text-sm leading-6 text-white/65">Fale com a equipe Orgus e informe o código {product.code}.</p></div></div><div className="mt-5 flex flex-wrap gap-3"><a href={SITE.phoneHref} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-extrabold text-[#173e90]"><Phone size={16}/> Ligar</a><a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Produto Orgus ${product.code}`)}`} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-3 text-sm font-extrabold"><Mail size={16}/> Enviar e-mail</a></div></div></div></div></div></main>;
}
