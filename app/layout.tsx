import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Orgus Indústria | Faróis Automotivos desde 1981",
    template: "%s | Orgus Indústria",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        legalName: "Orgus Indústria e Comércio LTDA",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/images/logo.png`,
        foundingDate: "1981",
        telephone: "+55 11 4158-8686",
        email: SITE.email,
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Estrada Francisca Manoel de Oliveira, 602 - Jardim Portão Vermelho",
          addressLocality: "Vargem Grande Paulista",
          addressRegion: "SP",
          postalCode: "06735-182",
          addressCountry: "BR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+55 11 4158-8686",
          email: SITE.email,
          contactType: "customer service",
          areaServed: "BR",
          availableLanguage: "Portuguese",
        },
        sameAs: [SITE.instagram, SITE.facebook],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "pt-BR",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
