/**
 * Shared layout constants for the "With teacher" template — a duplicate of the
 * Classic serif/bordered cover that additionally shows a "Submitted to"
 * (teacher) block on the left. Expressed in PDF points against an A4 page; the
 * PDF document uses them directly and the preview converts them to `cqi`.
 */

/** A4 width in points — the reference for the pt -> cqi conversion. */
export const A4_WIDTH_PT = 595.28;

export const MODERN = {
  /** White margin outside the border frame. */
  pagePadding: 40,
  frame: {
    border: 1.4,
    paddingX: 46,
    paddingTop: 52,
    paddingBottom: 24,
  },
  title: {
    size: 52,
    gapBelow: 12,
  },
  subject: {
    size: 24,
  },
  submitted: {
    labelSize: 15,
    valueSize: 15,
    /** Horizontal overhang of each block toward its border (negative = closer
     *  to the frame edge). */
    blockMarginX: -24,
    rowGap: 7,
    gapBelowLabel: 10,
    /** Width of the blank "Submitted to" line shown when no teacher is typed. */
    teacherLineWidth: 150,
  },
  flex: {
    top: 4.5,
    middle: 5,
    bottom: 0.15,
  },
  serif: "'Times New Roman', Times, serif",
} as const;
