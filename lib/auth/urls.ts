/** URL base de la app para redirects de auth */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getAuthCallbackUrl(): string {
  return `${getAppUrl()}/callback`;
}
