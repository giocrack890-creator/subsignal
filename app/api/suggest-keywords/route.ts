import { NextResponse } from "next/server";
import { generateAiKeywordSuggestions } from "@/lib/keywords/ai-suggestions";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: {
    productName?: string;
    description?: string;
    targetCustomer?: string;
    painPoints?: string[];
    websiteUrl?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const suggestions = await generateAiKeywordSuggestions({
    productName: body.productName,
    description: body.description,
    targetCustomer: body.targetCustomer,
    painPoints: body.painPoints,
    websiteUrl: body.websiteUrl,
  });

  return NextResponse.json({ suggestions });
}
