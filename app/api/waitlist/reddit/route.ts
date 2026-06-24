import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string | undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    email = user.email;
  } else {
    try {
      const body = (await request.json()) as { email?: string };
      email = body.email?.trim().toLowerCase();
    } catch {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("waitlist_reddit").upsert(
    { email },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (error) {
    console.error("[waitlist/reddit]", error);
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
