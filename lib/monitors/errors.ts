import type { PlatformMeta } from "./types";

/** Error lanzado cuando se intenta fetch en una plataforma aún no implementada */
export class PlatformNotImplementedError extends Error {
  readonly platform: PlatformMeta["platform"];
  readonly meta: PlatformMeta;

  constructor(meta: PlatformMeta) {
    super(
      `${meta.label} monitor pendiente: ${meta.blockers[0] ?? meta.implementationNotes}`
    );
    this.name = "PlatformNotImplementedError";
    this.platform = meta.platform;
    this.meta = meta;
  }
}

export function isPlatformNotImplementedError(
  error: unknown
): error is PlatformNotImplementedError {
  return error instanceof PlatformNotImplementedError;
}
