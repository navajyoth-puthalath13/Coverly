import { PLACEHOLDERS, type CoverData } from "@/lib/cover";
import { cn } from "@/lib/utils";
import type { PreviewProps } from "@/lib/templates/types";
import { A4_WIDTH_PT, CLASSIC } from "./layout";

/** Convert a point value to a container-relative `cqi` length. */
const cq = (pt: number): string => `${(pt / A4_WIDTH_PT) * 100}cqi`;

function field(data: Partial<CoverData>, key: keyof CoverData) {
  const raw = data[key]?.trim();
  return raw
    ? { text: raw, isPlaceholder: false }
    : { text: PLACEHOLDERS[key], isPlaceholder: true };
}

function SubmittedRow({
  data,
  name,
}: {
  data: Partial<CoverData>;
  name: keyof CoverData;
}) {
  const { text, isPlaceholder } = field(data, name);
  return (
    <span
      className={cn("font-bold", isPlaceholder ? "text-zinc-300" : "text-zinc-900")}
      style={{ fontSize: cq(CLASSIC.submitted.valueSize), lineHeight: 1.35 }}
    >
      {text}
    </span>
  );
}

/**
 * Live, print-accurate preview of the Classic cover. Sizes are expressed in
 * `cqi` (container-inline-size) so the whole sheet scales fluidly with its
 * width while staying faithful to the generated PDF.
 */
export function ClassicPreview({ data }: PreviewProps) {
  const assignment = field(data, "assignmentNumber");
  const subject = field(data, "subject");

  return (
    <div
      aria-label="Assignment cover preview"
      role="img"
      className="aspect-[210/297] w-full overflow-hidden bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-28px_rgba(0,0,0,0.3)] ring-1 ring-zinc-200/80 [container-type:inline-size]"
      style={{ fontFamily: CLASSIC.serif }}
    >
      <div
        className="h-full w-full"
        style={{ padding: cq(CLASSIC.pagePadding) }}
      >
        <div
          className="flex h-full w-full flex-col items-center border-black"
          style={{
            borderWidth: "1.5px",
            paddingLeft: cq(CLASSIC.frame.paddingX),
            paddingRight: cq(CLASSIC.frame.paddingX),
            paddingTop: cq(CLASSIC.frame.paddingTop),
            paddingBottom: cq(CLASSIC.frame.paddingBottom),
          }}
        >
          <div style={{ flexGrow: CLASSIC.flex.top }} />

          {/* Hero: "Assignment N" */}
          <h2
            className="text-center font-bold text-zinc-900"
            style={{ fontSize: cq(CLASSIC.title.size), lineHeight: 1.1 }}
          >
            {assignment.text}
          </h2>

          <div style={{ height: cq(CLASSIC.title.gapBelow) }} />

          {/* Subject */}
          <p
            className={cn(
              "text-center font-bold",
              subject.isPlaceholder ? "text-zinc-300" : "text-zinc-900",
            )}
            style={{ fontSize: cq(CLASSIC.subject.size), lineHeight: 1.2 }}
          >
            {subject.text}
          </p>

          <div style={{ flexGrow: CLASSIC.flex.middle }} />

          {/* Submitted by — anchored to the right content margin */}
          <div className="flex w-full flex-col items-end">
            <div
              className="flex flex-col"
              style={{ marginRight: cq(CLASSIC.submitted.blockMarginRight) }}
            >
              <span
                className="text-zinc-900"
                style={{
                  fontSize: cq(CLASSIC.submitted.labelSize),
                  marginBottom: cq(CLASSIC.submitted.gapBelowLabel),
                  lineHeight: 1.3,
                }}
              >
                Submitted by
              </span>
              <div
                className="flex flex-col"
                style={{
                  marginLeft: cq(CLASSIC.submitted.indent),
                  rowGap: cq(CLASSIC.submitted.rowGap),
                }}
              >
                <SubmittedRow data={data} name="studentName" />
                <SubmittedRow data={data} name="rollNumber" />
                <SubmittedRow data={data} name="department" />
                <SubmittedRow data={data} name="semester" />
              </div>
            </div>
          </div>

          <div style={{ flexGrow: CLASSIC.flex.bottom }} />
        </div>
      </div>
    </div>
  );
}
