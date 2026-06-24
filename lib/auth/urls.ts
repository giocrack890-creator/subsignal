/** URL base de la app para redirects de auth */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getAuthCallbackUrl(next?: string | null): string {
  const base = `${getAppUrl()}/callback`;
  if (!next) return base;
  return `${base}?${new URLSearchParams({ next }).toString()}`;
}
