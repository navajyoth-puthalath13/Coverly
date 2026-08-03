import { PLACEHOLDERS, type CoverData } from "@/lib/cover";
import { cn } from "@/lib/utils";
import type { PreviewProps } from "@/lib/templates/types";
import { A4_WIDTH_PT, MODERN } from "./layout";

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
      style={{ fontSize: cq(MODERN.submitted.valueSize), lineHeight: 1.35 }}
    >
      {text}
    </span>
  );
}

/**
 * Live preview of the "With teacher" cover — the Classic serif/bordered layout
 * plus a "Submitted to" (teacher) block on the left. Sizes are in `cqi` so the
 * sheet scales fluidly while matching the generated PDF.
 */
export function ModernPreview({ data }: PreviewProps) {
  const assignment = field(data, "assignmentNumber");
  const subject = field(data, "subject");
  const teacherName = data.submittedToName?.trim();
  const teacherDepartment = data.submittedToDepartment?.trim();

  return (
    <div
      aria-label="Assignment cover preview"
      role="img"
      className="aspect-[210/297] w-full overflow-hidden bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-28px_rgba(0,0,0,0.3)] ring-1 ring-zinc-200/80 [container-type:inline-size]"
      style={{ fontFamily: MODERN.serif }}
    >
      <div className="h-full w-full" style={{ padding: cq(MODERN.pagePadding) }}>
        <div
          className="flex h-full w-full flex-col items-center border-black"
          style={{
            borderWidth: "1.5px",
            paddingLeft: cq(MODERN.frame.paddingX),
            paddingRight: cq(MODERN.frame.paddingX),
            paddingTop: cq(MODERN.frame.paddingTop),
            paddingBottom: cq(MODERN.frame.paddingBottom),
          }}
        >
          <div style={{ flexGrow: MODERN.flex.top }} />

          {/* Hero: "Assignment N" */}
          <h2
            className="text-center font-bold text-zinc-900"
            style={{ fontSize: cq(MODERN.title.size), lineHeight: 1.1 }}
          >
            {assignment.text}
          </h2>

          <div style={{ height: cq(MODERN.title.gapBelow) }} />

          {/* Subject */}
          <p
            className={cn(
              "text-center font-bold",
              subject.isPlaceholder ? "text-zinc-300" : "text-zinc-900",
            )}
            style={{ fontSize: cq(MODERN.subject.size), lineHeight: 1.2 }}
          >
            {subject.text}
          </p>

          <div style={{ flexGrow: MODERN.flex.middle }} />

          {/* Submitted to (left, teacher) + Submitted by (right, student) */}
          <div className="flex w-full items-start justify-between">
            {/* Submitted to — teacher */}
            <div
              className="flex flex-col"
              style={{ marginLeft: cq(MODERN.submitted.blockMarginX) }}
            >
              <span
                className="text-zinc-900"
                style={{
                  fontSize: cq(MODERN.submitted.labelSize),
                  marginBottom: cq(MODERN.submitted.gapBelowLabel),
                  lineHeight: 1.3,
                }}
              >
                Submitted to
              </span>
              {teacherName ? (
                <div
                  className="flex flex-col"
                  style={{ rowGap: cq(MODERN.submitted.rowGap) }}
                >
                  <span
                    className="font-bold text-zinc-900"
                    style={{ fontSize: cq(MODERN.submitted.valueSize), lineHeight: 1.35 }}
                  >
                    {teacherName}
                  </span>
                  {teacherDepartment ? (
                    <span
                      className="font-bold text-zinc-900"
                      style={{ fontSize: cq(MODERN.submitted.valueSize), lineHeight: 1.35 }}
                    >
                      {teacherDepartment}
                    </span>
                  ) : null}
                </div>
              ) : (
                <span
                  className="block bg-zinc-300"
                  style={{ width: cq(MODERN.submitted.teacherLineWidth), height: "1px" }}
                />
              )}
            </div>

            {/* Submitted by — student */}
            <div
              className="flex flex-col"
              style={{ marginRight: cq(MODERN.submitted.blockMarginX) }}
            >
              <span
                className="text-zinc-900"
                style={{
                  fontSize: cq(MODERN.submitted.labelSize),
                  marginBottom: cq(MODERN.submitted.gapBelowLabel),
                  lineHeight: 1.3,
                }}
              >
                Submitted by
              </span>
              <div
                className="flex flex-col"
                style={{ rowGap: cq(MODERN.submitted.rowGap) }}
              >
                <SubmittedRow data={data} name="studentName" />
                <SubmittedRow data={data} name="rollNumber" />
                <SubmittedRow data={data} name="department" />
                <SubmittedRow data={data} name="semester" />
              </div>
            </div>
          </div>

          <div style={{ flexGrow: MODERN.flex.bottom }} />
        </div>
      </div>
    </div>
  );
}
