/** Credenciales y helpers compartidos para Twitter/X vía GetXAPI */

const GETXAPI_BASE_URL = "https://api.getxapi.com";

export function getGetXApiKey(): string {
  const key =
    process.env.GETXAPI_API_KEY?.trim() ??
    process.env.TWITTER_BEARER_TOKEN?.trim();

  if (!key) {
    throw new Error(
      "Twitter/X no configurado. Definí GETXAPI_API_KEY (dashboard en getxapi.com)."
    );
  }

  return key;
}

export function isTwitterConfigured(): boolean {
  return Boolean(
    process.env.GETXAPI_API_KEY?.trim() ?? process.env.TWITTER_BEARER_TOKEN?.trim()
  );
}

export function getTwitterLookbackHours(): number {
  const raw = process.env.CRON_TWITTER_LOOKBACK_HOURS?.trim();
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed) && parsed > 0 && parsed <= 168) {
    return parsed;
  }
  return 24;
}

export function buildGetXApiSearchQuery(keyword: string): string {
  const trimmed = keyword.trim();
  const sinceDate = new Date(
    Date.now() - getTwitterLookbackHours() * 3600 * 1000
  );
  const since = sinceDate.toISOString().slice(0, 10);

  if (trimmed.includes(" ") && !trimmed.startsWith('"')) {
    return `"${trimmed.replace(/"/g, "")}" -filter:retweets lang:en since:${since}`;
  }

  return `${trimmed.replace(/"/g, "")} -filter:retweets lang:en since:${since}`;
}

export function getGetXApiSearchUrl(params: {
  query: string;
  product?: "Latest" | "Top";
  cursor?: string;
}): string {
  const url = new URL(`${GETXAPI_BASE_URL}/twitter/tweet/advanced_search`);
  url.searchParams.set("q", params.query);
  url.searchParams.set("product", params.product ?? "Latest");
  if (params.cursor) {
    url.searchParams.set("cursor", params.cursor);
  }
  return url.toString();
}
