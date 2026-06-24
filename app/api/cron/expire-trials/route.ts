import { NextResponse } from "next/server";
import { expireTrials } from "@/lib/cron/expire-trials";

function authorizeCron(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await expireTrials();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[cron/expire-trials]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
