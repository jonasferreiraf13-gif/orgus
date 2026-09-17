import type { Metadata } from "next";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_ORIGIN = (configuredOrigin || "https://orgus.com.br").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Orgus Indústria";

export const DEFAULT_DESCRIPTION =
  "Fabricante brasileira de faróis automotivos para veículos leves, caminhões, ônibus e aplicações universais e agrícolas desde 1981.";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
