import type { Metadata } from "next";

const SITE_NAME = "ThreadPulse";
const TITLE = `${SITE_NAME} — Intent monitoring para founders SaaS`;
const DESCRIPTION =
  "ThreadPulse encuentra señales de alta intención en Reddit y Hacker News y te ayuda a responder con valor.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
