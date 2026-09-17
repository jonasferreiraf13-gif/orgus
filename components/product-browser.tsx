import { ArrowLeft, ArrowRight, Box, Search } from "lucide-react";
import type { Product } from "@/lib/data";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type ProductBrowserProps = {
  products: Product[];
  lineTitle: string;
  lineSlug: string;
  search?: string;
  brand?: string;
};

export function ProductBrowser({
  products,
  lineTitle,
  lineSlug,
  search = "",
  brand = "",
}: ProductBrowserProps) {
  const query = search.trim();
  const selectedBrand = brand.trim();
  const brands = Array.from(new Set(products.map((product) => product.brand))).sort(
    (a, b) => a.localeCompare(b, "pt-BR"),
  );
  const items = query
    ? products.filter((product) =>
        normalize(`${product.code} ${product.brand} ${product.model}`).includes(
          normalize(query),
        ),
      )
    : selectedBrand
      ? products.filter((product) => product.brand === selectedBrand)
      : [];

  return (
    <div>
      <form
        action={`/produtos/${lineSlug}`}
        method="get"
        className="relative mx-auto max-w-3xl"
        role="search"
      >
        <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#3274db]" />
        <label className="sr-only" htmlFor="product-search">Pesquisar produtos</label>
        <input
          id="product-search"
          name="q"
          defaultValue={query}
          placeholder="Pesquise por código, marca ou modelo"
          className="focus-ring h-16 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-16 text-base shadow-[0_12px_35px_rgba(12,37,81,.08)] placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="focus-ring absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#173e90] text-white hover:bg-[#0f327c]"
          aria-label="Pesquisar"
        >
          <Search size={19} />
        </button>
      </form>

      <div className="mt-12">
        {query ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-bold text-slate-500">
                {items.length} {items.length === 1 ? "produto encontrado" : "produtos encontrados"} para “{query}”
              </p>
              <a href={`/produtos/${lineSlug}`} className="font-extrabold text-[#173e90]">Limpar pesquisa</a>
            </div>
            <ProductGrid items={items} />
          </>
        ) : selectedBrand ? (
          <>
            <a href={`/produtos/${lineSlug}`} className="focus-ring mb-7 inline-flex items-center gap-2 font-extrabold text-[#173e90]"><ArrowLeft size={17}/> Voltar para as marcas</a>
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-wider text-[#3274db]">Produtos da marca</p>
              <h2 className="mt-1 text-3xl font-black">{selectedBrand}</h2>
            </div>
            <ProductGrid items={items} />
          </>
        ) : brands.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((item) => (
              <a
                key={item}
                href={`/produtos/${lineSlug}?marca=${encodeURIComponent(item)}`}
                className="focus-ring group flex min-h-32 items-center justify-between rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-slate-400">Marca</span>
                  <span className="mt-2 block text-xl font-black text-[#0b1832]">{item}</span>
                  <span className="mt-2 block text-sm text-slate-500">{products.filter((product) => product.brand === item).length} produtos</span>
                </span>
                <ArrowRight className="text-[#3274db] transition group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Produtos em atualização"
            text={`Os itens de ${lineTitle} serão disponibilizados em breve.`}
          />
        )}
      </div>
    </div>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length) {
    return <EmptyState title="Nenhum produto encontrado" text="Revise o código, a marca ou o modelo pesquisado." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <a
          key={product.id}
          href={`/produto/${product.id}`}
          className="focus-ring group industrial-card overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(12,37,81,.14)]"
        >
          <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#eef3fa]">
            {product.image_key ? (
              <img
                src={`/api/file?key=${encodeURIComponent(product.image_key)}`}
                alt={`${product.brand} ${product.model}`}
                className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <Box className="text-slate-300" size={58} />
            )}
            <span className="absolute left-4 top-4 rounded bg-[#173e90] px-3 py-1 text-xs font-extrabold text-white">Cód. {product.code}</span>
          </div>
          <div className="p-6">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#3274db]">{product.brand}</p>
            <h3 className="mt-2 text-xl font-black tracking-tight">{product.model}</h3>
            <p className="mt-2 text-sm text-slate-500">Lado: {product.side}</p>
            <span className="mt-5 inline-flex items-center gap-2 font-extrabold text-[#173e90]">Ver detalhes <ArrowRight size={16}/></span>
          </div>
        </a>
      ))}
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <Box className="mx-auto text-slate-400" size={34} />
      <p className="mt-4 font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}
