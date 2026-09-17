import { permanentRedirect } from "next/navigation";

export default async function LegacyPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const legacyPath = path.join("/").toLowerCase();

  if (legacyPath.startsWith("empresa")) permanentRedirect("/empresa");
  if (legacyPath.startsWith("contato")) permanentRedirect("/contato");
  if (legacyPath.startsWith("catalogos-online")) permanentRedirect("/catalogos");
  if (legacyPath.includes("transparencia")) permanentRedirect("/transparencia");
  if (legacyPath.includes("linha-leve")) permanentRedirect("/produtos/linha-leve");
  if (legacyPath.includes("pesados-onibus")) permanentRedirect("/produtos/pesados-onibus");
  if (legacyPath.includes("universais")) permanentRedirect("/produtos/universais");

  permanentRedirect("/");
}
