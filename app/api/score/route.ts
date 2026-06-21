import { NextResponse } from "next/server";
import { scorePost } from "@/lib/scoring";
import type { Platform, UserProduct } from "@/types";
import type { RawPost } from "@/lib/monitors/types";

function authorizeCron(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
}

interface ScoreRequestBody {
  post: RawPost;
  product: Pick<UserProduct, "name" | "description" | "target_customer" | "pain_points">;
  keyword: string;
  platform?: Platform;
}

export async function POST(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ScoreRequestBody;
  try {
    body = (await request.json()) as ScoreRequestBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.post?.externalId || !body.product?.name || !body.keyword) {
    return NextResponse.json(
      { error: "Campos requeridos: post, product.name, keyword" },
      { status: 400 }
    );
  }

  try {
    const result = await scorePost({
      post: body.post,
      product: body.product,
      keyword: body.keyword,
      platform: body.platform ?? "hn",
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
