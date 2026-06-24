import { NextResponse } from "next/server";
import { expandSynonyms } from "@/lib/intelligence/synonyms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term")?.trim();

  if (!term || term.length < 2) {
    return NextResponse.json({ error: "term requerido" }, { status: 400 });
  }

  return NextResponse.json({
    term,
    synonyms: expandSynonyms(term),
  });
}
