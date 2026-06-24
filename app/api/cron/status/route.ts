import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("cron_logs")
    .select("ran_at, status")
    .order("ran_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.ran_at) {
    return NextResponse.json({ ranAt: null, status: null, minutesAgo: null });
  }

  const minutesAgo = Math.floor(
    (Date.now() - new Date(data.ran_at).getTime()) / 60000
  );

  return NextResponse.json({
    ranAt: data.ran_at,
    status: data.status,
    minutesAgo,
  });
}
