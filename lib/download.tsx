import type { CoverData } from "@/lib/cover";
import type { CoverTemplate } from "@/lib/templates/types";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileName(data: CoverData): string {
  const parts = [slugify(data.studentName), slugify(data.assignmentNumber)].filter(Boolean);
  return `${parts.join("-") || "assignment-cover"}.pdf`;
}

/**
 * Generate the cover PDF in the browser and trigger a download. The heavy PDF
 * renderer and the template's document component are imported on demand so they
 * never weigh down the initial page load.
 */
export async function downloadCoverPdf(
  data: CoverData,
  template: CoverTemplate,
): Promise<void> {
  const [{ pdf }, CoverDocument] = await Promise.all([
    import("@react-pdf/renderer"),
    template.loadDocument(),
  ]);

  const blob = await pdf(<CoverDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName(data);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    // Give the browser a tick to start the download before revoking.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
