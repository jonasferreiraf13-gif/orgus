export const SITE = {
  phoneDisplay: "11 4158-8686",
  phoneHref: "tel:+551141588686",
  email: "contato@orgus.com.br",
  address: "Estrada Francisca Manoel de Oliveira, 602 - Jardim Portão Vermelho, Vargem Grande Paulista - SP, CEP 06735-182",
  instagram: "https://www.instagram.com/orgusindustria",
  facebook: "https://www.facebook.com/orgusfarois/",
} as const;

export const LINES = [
  {
    slug: "linha-leve",
    value: "leve",
    title: "Linha Leve",
    short: "Automóveis e utilitários",
    description: "Faróis principais, auxiliares e kits desenvolvidos para automóveis e utilitários.",
    image: "/images/hero-leve.jpg",
  },
  {
    slug: "pesados-onibus",
    value: "pesado-onibus",
    title: "Pesados e Ônibus",
    short: "Caminhões e transporte coletivo",
    description: "Faróis principais e auxiliares para caminhões e ônibus, preparados para a rotina das estradas.",
    image: "/images/hero-pesados.jpeg",
  },
  {
    slug: "universais",
    value: "universal",
    title: "Universais e Agrícolas",
    short: "Aplicações especiais",
    description: "Soluções de iluminação principal e auxiliar para aplicações universais, off-road e agrícolas.",
    image: "/images/hero-universal.png",
  },
] as const;

export function getLineBySlug(slug: string) {
  return LINES.find((line) => line.slug === slug);
}

export function getLineByValue(value: string) {
  return LINES.find((line) => line.value === value);
}
