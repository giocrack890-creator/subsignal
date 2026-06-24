/** Credenciales y token OAuth compartidos para adapters Reddit */

interface RedditTokenCache {
  accessToken: string;
  expiresAtMs: number;
}

let tokenCache: RedditTokenCache | null = null;

export function getRedditUserAgent(): string {
  const custom = process.env.REDDIT_USER_AGENT?.trim();
  if (custom) return custom;
  return "ThreadPulse/1.0 (intent monitoring)";
}

export function getRedditCredentials(): {
  clientId: string;
  clientSecret: string;
} | null {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function assertRedditConfigured(): void {
  if (!getRedditCredentials()) {
    throw new Error(
      "Reddit no configurado. Definí REDDIT_CLIENT_ID y REDDIT_CLIENT_SECRET."
    );
  }
}

export async function getRedditAccessToken(): Promise<string> {
  assertRedditConfigured();
  const { clientId, clientSecret } = getRedditCredentials()!;

  if (tokenCache && tokenCache.expiresAtMs > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": getRedditUserAgent(),
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Reddit OAuth error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new Error("Reddit OAuth no devolvió access_token");
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAtMs: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return data.access_token;
}

export function getRedditLookbackHours(): number {
  const raw = process.env.CRON_REDDIT_LOOKBACK_HOURS?.trim();
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed) && parsed > 0 && parsed <= 48) {
    return parsed;
  }
  return 2;
}
