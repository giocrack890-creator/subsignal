import { NextResponse } from "next/server";
import { sendPushToUser } from "@/lib/push/send";

function authorize(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    userId?: string;
    title?: string;
    body?: string;
    signalId?: string;
  };

  if (!body.userId || !body.title || !body.body || !body.signalId) {
    return NextResponse.json({ error: "Payload incompleto" }, { status: 400 });
  }

  await sendPushToUser(body.userId, {
    title: body.title,
    body: body.body,
    signalId: body.signalId,
  });

  return NextResponse.json({ ok: true });
}
