import type { CoverTemplate } from "@/lib/templates/types";
import { ModernPreview } from "./preview";

/**
 * Modern — a duplicate of the Classic serif/bordered cover that adds a
 * "Submitted to" (teacher name + department) block on the left, alongside the
 * "Submitted by" student block on the right.
 */
export const modernTemplate: CoverTemplate = {
  id: "modern",
  name: "Modern",
  description: "Classic layout with a 'Submitted to' teacher block.",
  Preview: ModernPreview,
  loadDocument: async () => (await import("./document")).ModernDocument,
  usesSubmittedTo: true,
};
