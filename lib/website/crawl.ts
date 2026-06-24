const MAX_HTML_BYTES = 500_000;
const FETCH_TIMEOUT_MS = 12_000;

export interface WebsiteCrawlResult {
  url: string;
  title: string | null;
  description: string | null;
  headings: string[];
  excerpt: string;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("URL vacía");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const match = html.match(re);
  return match?.[1]?.trim() ?? null;
}

function titleFromHtml(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
}

function headingsFromHtml(html: string): string[] {
  const matches = html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi);
  const headings: string[] = [];
  for (const match of matches) {
    const text = stripTags(match[1] ?? "");
    if (text.length >= 4 && text.length <= 120) headings.push(text);
    if (headings.length >= 8) break;
  }
  return headings;
}

export async function crawlWebsite(rawUrl: string): Promise<WebsiteCrawlResult> {
  const url = normalizeUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; IntentBot/1.0; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`No se pudo leer el sitio (${response.status})`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      throw new Error("El sitio no devolvió HTML");
    }

    const buffer = await response.arrayBuffer();
    const html = new TextDecoder("utf-8", { fatal: false }).decode(
      buffer.byteLength > MAX_HTML_BYTES
        ? buffer.slice(0, MAX_HTML_BYTES)
        : buffer
    );

    const title =
      metaContent(html, "og:title") ??
      titleFromHtml(html);
    const description =
      metaContent(html, "og:description") ??
      metaContent(html, "description");
    const headings = headingsFromHtml(html);
    const bodyText = stripTags(html).slice(0, 4000);

    return {
      url,
      title,
      description,
      headings,
      excerpt: [title, description, ...headings, bodyText]
        .filter(Boolean)
        .join("\n")
        .slice(0, 6000),
    };
  } finally {
    clearTimeout(timer);
  }
}
