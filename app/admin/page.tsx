import type { Metadata } from "next";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { AdminClaim } from "@/components/admin-claim";
import { AdminDashboard } from "@/components/admin-dashboard";
import { authenticatedUserSignOutPath, chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getAdminState } from "@/lib/admin";
import { getAllProductImages, getAllProducts, getContactMessages, getDocuments } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Área administrativa",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  const state = await getAdminState();
  if (!state.user) return <main className="flex min-h-screen items-center justify-center bg-[#eef3fa] p-5"><div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"><Image src="/images/logo.png" alt="Orgus" width={160} height={56} className="mx-auto"/><LockKeyhole className="mx-auto mt-8 text-[#173e90]" size={38}/><h1 className="mt-4 text-2xl font-black">Área administrativa</h1><p className="mt-3 leading-7 text-slate-600">Entre com sua conta autorizada para gerenciar o conteúdo do site.</p><a href={chatGPTSignInPath("/admin")} target="_top" className="focus-ring mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#173e90] px-6 font-extrabold text-white">Entrar com segurança</a><a href="/" className="mt-5 block text-sm font-bold text-slate-500">Voltar ao site</a></div></main>;
  if (state.canClaim) return <main className="flex min-h-screen items-center justify-center bg-[#eef3fa] p-5"><AdminClaim/></main>;
  if (!state.isAdmin) return <main className="flex min-h-screen items-center justify-center bg-[#eef3fa] p-5"><div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl"><LockKeyhole className="mx-auto text-red-500" size={38}/><h1 className="mt-4 text-2xl font-black">Acesso não autorizado</h1><p className="mt-3 text-slate-600">O usuário {state.user.email} não possui permissão administrativa.</p><a href={authenticatedUserSignOutPath(state.user)} target="_top" className="mt-6 inline-block font-extrabold text-[#173e90] underline">Sair e trocar de conta</a></div></main>;
  const [products, images, catalogs, transparency, messages] = await Promise.all([getAllProducts(), getAllProductImages(), getDocuments("catalog"), getDocuments("transparency"), getContactMessages()]);
  const records = products.map((product) => ({ ...product, images: images.filter((image) => image.product_id === product.id) }));
  return <AdminDashboard user={state.user} products={records} catalogs={catalogs} transparency={transparency} messages={messages} signOutPath={authenticatedUserSignOutPath(state.user)}/>;
}
