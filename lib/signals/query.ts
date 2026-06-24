import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Platform, Signal, SignalStatus } from "@/types";
import type { SignalFilter } from "@/components/dashboard/filter-bar";

export const SIGNALS_PAGE_SIZE = 20;

export interface SignalsSearchParams {
  status?: string;
  platform?: string;
  minScore?: string;
  draft?: string;
  q?: string;
  sort?: string;
  page?: string;
}

export type DraftFilter = "all" | "with" | "without";

export interface ParsedSignalsQuery {
  status: SignalFilter;
  platform: Platform | "all";
  minScore: number | null;
  draft: DraftFilter;
  q: string;
  sort: "date" | "score";
  page: number;
  limit: number;
  hasActiveFilters: boolean;
}

export function parseSignalsQuery(
  params: SignalsSearchParams
): ParsedSignalsQuery {
  const statusValues: SignalFilter[] = [
    "all",
    "new",
    "viewed",
    "replied",
    "dismissed",
  ];
  const status = statusValues.includes(params.status as SignalFilter)
    ? (params.status as SignalFilter)
    : "all";

  const platforms: (Platform | "all")[] = ["all", "hn", "reddit", "twitter", "ih"];
  const platform = platforms.includes(params.platform as Platform | "all")
    ? (params.platform as Platform | "all")
    : "all";

  const minScore =
    params.minScore === "7" ? 7 : params.minScore === "9" ? 9 : null;

  const draftValues: DraftFilter[] = ["all", "with", "without"];
  const draft = draftValues.includes(params.draft as DraftFilter)
    ? (params.draft as DraftFilter)
    : "all";

  const q = params.q?.trim() ?? "";
  const sort = params.sort === "score" ? "score" : "date";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const limit = page * SIGNALS_PAGE_SIZE;

  const hasActiveFilters =
    status !== "all" ||
    platform !== "all" ||
    minScore !== null ||
    draft !== "all" ||
    q.length > 0 ||
    sort !== "date";

  return { status, platform, minScore, draft, q, sort, page, limit, hasActiveFilters };
}

function escapeIlike(term: string): string {
  return term.replace(/[%_\\]/g, "\\$&");
}

type AdminClient = SupabaseClient<Database>;

export async function fetchSignals(
  supabase: AdminClient,
  userId: string,
  query: ParsedSignalsQuery
): Promise<{ signals: Signal[]; total: number; error: string | null }> {
  let dbQuery = supabase
    .from("signals")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (query.status !== "all") {
    dbQuery = dbQuery.eq("status", query.status as SignalStatus);
  }

  if (query.platform !== "all") {
    dbQuery = dbQuery.eq("platform", query.platform);
  }

  if (query.minScore !== null) {
    dbQuery = dbQuery.gte("intent_score", query.minScore);
  }

  if (query.draft === "with") {
    dbQuery = dbQuery.not("draft_reply", "is", null).neq("draft_reply", "");
  } else if (query.draft === "without") {
    dbQuery = dbQuery.or("draft_reply.is.null,draft_reply.eq.");
  }

  if (query.q) {
    const safe = query.q.replace(/[,().]/g, " ").trim();
    if (safe) {
      const pattern = `%${escapeIlike(safe)}%`;
      dbQuery = dbQuery.or(`title.ilike.${pattern},body.ilike.${pattern}`);
    }
  }

  if (query.sort === "score") {
    dbQuery = dbQuery
      .order("intent_score", { ascending: false, nullsFirst: false })
      .order("found_at", { ascending: false });
  } else {
    dbQuery = dbQuery.order("found_at", { ascending: false });
  }

  dbQuery = dbQuery.limit(query.limit);

  const { data, count, error } = await dbQuery;

  if (error) {
    return { signals: [], total: 0, error: error.message };
  }

  return {
    signals: (data as Signal[]) ?? [],
    total: count ?? 0,
    error: null,
  };
}

export function buildSignalsUrl(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>
): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value && value !== "all" && !(key === "sort" && value === "date")) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `/signals?${qs}` : "/signals";
}
