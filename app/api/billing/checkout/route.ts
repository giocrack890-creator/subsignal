import { NextResponse, type NextRequest } from "next/server";
import {
  createCreemCheckoutSession,
  isCreemConfigured,
  parseCreemCheckoutPlan,
} from "@/lib/payments/creem";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const plan = parseCreemCheckoutPlan(request.nextUrl.searchParams.get("plan"));

  if (!plan) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  if (!isCreemConfigured()) {
    return NextResponse.redirect(new URL("/pricing?error=payments", request.url));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `/api/billing/checkout?plan=${plan}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const checkoutUrl = await createCreemCheckoutSession({
      userId: user.id,
      email: user.email,
      plan,
    });

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error("[billing/checkout] Error creando checkout Creem:", error);
    return NextResponse.redirect(new URL("/pricing?error=checkout", request.url));
  }
}
