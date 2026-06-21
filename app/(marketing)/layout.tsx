import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intent monitoring para founders SaaS",
  description:
    "Monitorea Hacker News, puntúa conversaciones por intención de compra y genera borradores de respuesta genuinos con IA.",
  openGraph: {
    title: "SubSignal — Intent monitoring para founders SaaS",
    description:
      "Dejá de buscar clientes manualmente en HN. SubSignal encuentra señales de alta intención y te ayuda a responder con valor.",
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
