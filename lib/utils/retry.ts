interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  label?: string;
}

/** Reintenta una operación async con backoff exponencial */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 500, label = "operation" } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;

      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(
        `[retry] ${label} falló (intento ${attempt}/${maxAttempts}), reintentando en ${delay}ms…`,
        error instanceof Error ? error.message : error
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
