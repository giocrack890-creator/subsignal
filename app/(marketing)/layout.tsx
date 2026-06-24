import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intent monitoring para founders SaaS",
  description:
    "Monitorea Hacker News, puntúa conversaciones por intención de compra y genera borradores de respuesta genuinos con IA.",
  openGraph: {
    title: "Intent monitoring para founders SaaS",
    description:
      "Dejá de buscar clientes manualmente en HN. Encontrá señales de alta intención y respondé con valor.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
