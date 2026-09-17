import type { Metadata } from "next";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminState } from "@/lib/admin";
import { ADMIN_EMAIL, isAdminPasswordConfigured } from "@/lib/admin-auth";
import {
  getAllProductImages,
  getAllProducts,
  getContactMessages,
  getDocuments,
} from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Área administrativa",
  robots: { index: false, follow: false, nocache: true },
};

const errorMessages: Record<string, string> = {
  credenciais: "E-mail ou senha incorretos.",
  configuracao: "A senha administrativa ainda não foi configurada no servidor.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const state = await getAdminState();

  if (!state.user) {
    const { erro } = await searchParams;
    const message = erro ? errorMessages[erro] : "";
    const configured = isAdminPasswordConfigured();

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef3fa] p-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <Image
            src="/images/logo.png"
            alt="Orgus"
            width={160}
            height={56}
            className="mx-auto"
          />
          <LockKeyhole className="mx-auto mt-8 text-[#173e90]" size={38} />
          <h1 className="mt-4 text-center text-2xl font-black">
            Área administrativa
          </h1>
          <p className="mt-3 text-center leading-7 text-slate-600">
            Entre para gerenciar produtos, catálogos, relatórios e mensagens.
          </p>
          {message && (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
              {message}
            </p>
          )}
          {!configured && !message && (
            <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-800">
              Configure o segredo ADMIN_PASSWORD na Cloudflare antes do primeiro acesso.
            </p>
          )}
          <form action="/api/admin/login" method="post" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-extrabold text-slate-700">
              E-mail
              <input
                name="email"
                type="email"
                value={ADMIN_EMAIL}
                readOnly
                autoComplete="username"
                required
                className="admin-input bg-slate-50 text-slate-600"
              />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-slate-700">
              Senha
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="admin-input"
              />
            </label>
            <button
              type="submit"
              className="focus-ring mt-2 min-h-12 rounded-lg bg-[#173e90] px-6 font-extrabold text-white transition hover:bg-[#0f327c]"
            >
              Entrar
            </button>
          </form>
          <a
            href="/"
            className="mt-5 block text-center text-sm font-bold text-slate-500"
          >
            Voltar ao site
          </a>
        </div>
      </main>
    );
  }

  const [products, images, catalogs, transparency, messages] = await Promise.all([
    getAllProducts(),
    getAllProductImages(),
    getDocuments("catalog"),
    getDocuments("transparency"),
    getContactMessages(),
  ]);
  const records = products.map((product) => ({
    ...product,
    images: images.filter((image) => image.product_id === product.id),
  }));

  return (
    <AdminDashboard
      user={state.user}
      products={records}
      catalogs={catalogs}
      transparency={transparency}
      messages={messages}
      signOutPath="/api/admin/logout"
    />
  );
}
