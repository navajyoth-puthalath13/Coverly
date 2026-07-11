import type { CoverTemplate } from "@/lib/templates/types";
import { ClassicPreview } from "./preview";

/**
 * Classic — a formal serif cover inside a bordered frame: a large
 * "Assignment N" title, the subject centred beneath it, and a "Submitted by"
 * block with the student's details. Mirrors the traditional printed cover page.
 */
export const classicTemplate: CoverTemplate = {
  id: "classic",
  name: "Classic",
  description: "Formal serif cover with a bordered frame.",
  Preview: ClassicPreview,
  loadDocument: async () => (await import("./document")).ClassicDocument,
};
