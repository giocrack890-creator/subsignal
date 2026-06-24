import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./landing.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intent monitoring para founders SaaS",
  description:
    "Encontrá conversaciones de alta intención en HN, Reddit y más. SubSignal te dice qué responder con un borrador listo para copiar.",
  openGraph: {
    title: "SubSignal — Intent monitoring para founders SaaS",
    description:
      "SubSignal encuentra señales de compra y redacta la respuesta por vos. Copiás, publicás y listo en 30 segundos.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`landing-sf ${inter.className}`}>{children}</div>;
}
