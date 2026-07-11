import {
  PERSISTED_FIELDS,
  SEMESTER_OPTIONS,
  type CoverData,
  type PersistedField,
} from "@/lib/cover";

const STORAGE_KEY = "assignment-cover:v1";
const TEMPLATE_KEY = "assignment-cover:template";

export type PersistedCover = Partial<Pick<CoverData, PersistedField>>;

/**
 * Read the remembered fields from localStorage. Returns an empty object when
 * nothing is stored or the value is unreadable (private mode, corrupted JSON,
 * SSR) so callers can always spread the result safely.
 */
export function loadPersistedCover(): PersistedCover {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const result: PersistedCover = {};

    const writable = result as Record<PersistedField, string>;
    for (const field of PERSISTED_FIELDS) {
      const value = parsed[field];
      if (typeof value !== "string") continue;
      // Drop stale values that no longer match an enum-constrained field, so an
      // old free-text semester can't linger and break the Select or validation.
      if (field === "semester" && !SEMESTER_OPTIONS.includes(value as never)) {
        continue;
      }
      writable[field] = value;
    }

    return result;
  } catch {
    return {};
  }
}

/**
 * Persist only the remembered fields. The assignment number is never written,
 * so returning students always start on a fresh assignment selection.
 */
export function savePersistedCover(data: CoverData): void {
  if (typeof window === "undefined") return;

  try {
    const payload: PersistedCover = {};
    const writable = payload as Record<PersistedField, string>;
    for (const field of PERSISTED_FIELDS) {
      writable[field] = data[field];
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable (private mode, quota). Persistence is a
    // convenience, not a requirement, so we fail silently.
  }
}

/** Remember which template the student last used. */
export function loadPersistedTemplate(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TEMPLATE_KEY);
  } catch {
    return null;
  }
}

export function savePersistedTemplate(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TEMPLATE_KEY, id);
  } catch {
    // ignore
  }
}
