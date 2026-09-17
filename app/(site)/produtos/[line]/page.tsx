import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ProductBrowser } from "@/components/product-browser";
import { getPublicProducts } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import { getLineBySlug, LINES } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ line: string }> }): Promise<Metadata> {
  const { line: slug } = await params;
  const line = getLineBySlug(slug);
  if (!line) return { title: "Produtos" };
  return createPageMetadata({
    title: `${line.title} — Faróis Automotivos`,
    description: `${line.description} Consulte por código, marca ou modelo no catálogo Orgus.`,
    path: `/produtos/${line.slug}`,
  });
}

export default async function LinePage({
  params,
  searchParams,
}: {
  params: Promise<{ line: string }>;
  searchParams: Promise<{ q?: string; marca?: string }>;
}) {
  const { line: slug } = await params;
  const { q, marca } = await searchParams;
  const line = getLineBySlug(slug);
  if (!line) notFound();
  const products = await getPublicProducts(line.value);
  return <main><PageHero eyebrow="Produtos" title={line.title} text={line.description} image={line.image}/><section className="bg-[#f6f8fc] py-16 lg:py-24"><div className="site-container"><div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-base leading-7 text-slate-600">Escolha uma marca abaixo ou pesquise diretamente pelo código, marca ou modelo do produto.</p></div><ProductBrowser products={products} lineTitle={line.title} lineSlug={line.slug} search={q} brand={marca}/></div></section></main>;
}

export function generateStaticParams() { return LINES.map((line) => ({ line: line.slug })); }
