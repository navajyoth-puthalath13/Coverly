import type { ComponentType } from "react";
import type { CoverData } from "@/lib/cover";

/**
 * Props shared by a template's preview and document. The live preview may
 * receive partial data (fields the student hasn't filled yet); the PDF document
 * only ever receives fully-validated data.
 */
export type PreviewProps = { data: Partial<CoverData> };
export type DocumentProps = { data: CoverData };

/**
 * A cover template. This is the single contract an open-source contributor
 * implements to add a new design:
 *
 *   1. Create a folder under `lib/templates/<your-template>/`.
 *   2. Add a `preview.tsx` — an HTML/Tailwind React component that renders the
 *      A4 sheet on screen (see `classic/preview.tsx` for the sizing helper).
 *   3. Add a `document.tsx` — an `@react-pdf/renderer` component that renders
 *      the printable PDF, matching the preview.
 *   4. Export a `CoverTemplate` (see `classic/index.tsx`) and register it in
 *      `lib/templates/registry.ts`.
 *
 * The `Document` is loaded lazily so the (heavy) PDF renderer never ships in
 * the initial page bundle — it is fetched only when a student downloads.
 */
export interface CoverTemplate {
  /** Stable, URL-safe identifier persisted in local storage. */
  id: string;
  /** Display name shown in the template picker. */
  name: string;
  /** One-line description of the look. */
  description: string;
  /** On-screen A4 preview (HTML/Tailwind). */
  Preview: ComponentType<PreviewProps>;
  /** Lazily-loaded printable PDF document (@react-pdf/renderer). */
  loadDocument: () => Promise<ComponentType<DocumentProps>>;
  /**
   * When true, the form surfaces the optional "Submitted to" (teacher name +
   * department) inputs, because this template renders them. Omit for templates
   * that don't use them.
   */
  usesSubmittedTo?: boolean;
}
