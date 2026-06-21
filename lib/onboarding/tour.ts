export const TOUR_STORAGE_PREFIX = "subsignal_tour_completed";

export function getTourStorageKey(userId: string): string {
  return `${TOUR_STORAGE_PREFIX}_${userId}`;
}

export function clearTourCompleted(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getTourStorageKey(userId));
}

export function isTourCompleted(userId: string): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(getTourStorageKey(userId)));
}

export function markTourCompleted(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTourStorageKey(userId), "1");
}
