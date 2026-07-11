/**
 * Shared layout constants for the Classic template, expressed in PDF points
 * (1/72 inch) against an A4 page. The PDF document uses these values directly;
 * the on-screen preview converts them to `cqi` units so the two stay visually
 * identical at any size. Keep this file as the single source of truth for the
 * template's proportions.
 */

/** A4 width in points — the reference for the pt -> cqi conversion. */
export const A4_WIDTH_PT = 595.28;

export const CLASSIC = {
  /** White margin outside the border frame — larger values inset the frame
   *  further from the paper edge. */
  pagePadding: 40,
  frame: {
    border: 1.4,
    paddingX: 46,
    paddingTop: 52,
    /** Smaller than the top so the "Submitted by" block can sit lower,
     *  closer to the bottom border. */
    paddingBottom: 24,
  },
  title: {
    size: 52,
    /** Gap between the title and the subject — smaller pulls the subject up
     *  closer beneath the title. */
    gapBelow: 12,
  },
  subject: {
    size: 24,
  },
  submitted: {
    labelSize: 15,
    valueSize: 15,
    /** Offset of the "Submitted by" block from the right content margin. A
     *  negative value lets the block overhang the margin toward the border
     *  line, so it sits closer to the frame edge. */
    blockMarginRight: -24,
    /** Indent of the name/roll/department/semester block under "Submitted by".
     *  0 aligns the data flush-left with the "Submitted by" label. */
    indent: 0,
    rowGap: 7,
    gapBelowLabel: 10,
  },
  /** Vertical distribution (flex-grow ratios) of the empty space. The large
   *  middle share pushes the "Submitted by" block down toward the bottom-right
   *  corner, leaving the title in the upper third. */
  flex: {
    top: 4.5,
    middle: 5,
    bottom: 0.15,
  },
  serif: "'Times New Roman', Times, serif",
} as const;
