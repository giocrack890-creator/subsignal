import { NextResponse } from "next/server";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as { subscription?: unknown };
  if (!body.subscription) {
    return NextResponse.json({ error: "subscription requerida" }, { status: 400 });
  }

  const { error } = await supabase.from("push_subscriptions").insert({
    user_id: user.id,
    subscription: body.subscription as Json,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
