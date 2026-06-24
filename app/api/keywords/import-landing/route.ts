import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crawlWebsite } from "@/lib/website/crawl";
import { expandSynonyms } from "@/lib/intelligence/synonyms";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  }

  try {
    const crawl = await crawlWebsite(url);
    const suggestions: string[] = [];

    if (crawl.title) {
      suggestions.push(...crawl.title.split(/\s+/).filter((w) => w.length > 4).slice(0, 3));
    }
    for (const heading of crawl.headings.slice(0, 5)) {
      const words = heading.split(/\s+/).filter((w) => w.length > 4);
      if (words.length >= 2) suggestions.push(words.slice(0, 4).join(" "));
    }
    if (crawl.description) {
      suggestions.push(crawl.description.split(/[.!]/)[0]?.trim().slice(0, 60) ?? "");
    }

    const unique = [...new Set(suggestions.map((s) => s.trim()).filter((s) => s.length >= 3))].slice(0, 8);

    return NextResponse.json({
      ok: true,
      crawl: {
        title: crawl.title,
        description: crawl.description,
        headings: crawl.headings.slice(0, 5),
      },
      suggestions: unique,
      synonyms: unique.flatMap((s) => expandSynonyms(s)).slice(0, 12),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al importar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
