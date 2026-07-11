import type { CoverTemplate } from "@/lib/templates/types";
import { classicTemplate } from "./classic";

/**
 * The registry of available cover templates.
 *
 * To add a new template, build it under `lib/templates/<name>/` (see the
 * `classic` folder as a reference) and add it to this array — the picker,
 * preview and PDF download pick it up automatically.
 */
export const templates: CoverTemplate[] = [classicTemplate];

export const DEFAULT_TEMPLATE_ID = classicTemplate.id;

/** Resolve a template by id, falling back to the default when unknown. */
export function getTemplate(id: string | null | undefined): CoverTemplate {
  return templates.find((t) => t.id === id) ?? templates[0];
}
