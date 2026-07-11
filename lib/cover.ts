import { z } from "zod";

/**
 * The assignment options shown in the Select. The first, plain "Assignment",
 * is the default — the cover then shows just the word until a number is picked.
 * Kept as a const tuple so the Zod enum and the TypeScript union stay in sync.
 */
export const ASSIGNMENT_OPTIONS = [
  "Assignment",
  "Assignment 1",
  "Assignment 2",
  "Assignment 3",
  "Assignment 4",
] as const;

export type AssignmentNumber = (typeof ASSIGNMENT_OPTIONS)[number];

/**
 * Semester options, written as ordinals ("1st Semester" … "8th Semester").
 * A standard 4-year programme runs to 8; extend this tuple if a programme
 * needs more (e.g. "9th Semester", "10th Semester").
 */
export const SEMESTER_OPTIONS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
] as const;

export type Semester = (typeof SEMESTER_OPTIONS)[number];

const required = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required` })
    .max(120, { message: `${label} is too long` });

export const coverSchema = z.object({
  assignmentNumber: z.enum(ASSIGNMENT_OPTIONS),
  subject: required("Subject"),
  studentName: required("Student name"),
  rollNumber: required("Roll number"),
  department: required("Department"),
  semester: z.enum(SEMESTER_OPTIONS),
});

export type CoverData = z.infer<typeof coverSchema>;

/**
 * Fields worth remembering between visits. A student's identity and course
 * details rarely change, so we restore them automatically. The assignment
 * number is deliberately excluded — it is the one thing a student changes each
 * time they come back to print a new cover.
 */
export const PERSISTED_FIELDS = [
  "subject",
  "studentName",
  "rollNumber",
  "department",
  "semester",
] as const satisfies readonly (keyof CoverData)[];

export type PersistedField = (typeof PERSISTED_FIELDS)[number];

export const DEFAULT_COVER: CoverData = {
  assignmentNumber: "Assignment",
  subject: "",
  studentName: "",
  rollNumber: "",
  department: "",
  semester: "1st Semester",
};

/**
 * Human-friendly placeholders used both as input hints and as the greyed-out
 * text in the live preview, so an empty cover still looks like a real page.
 */
export const PLACEHOLDERS: Record<keyof CoverData, string> = {
  assignmentNumber: "Assignment",
  subject: "Subject",
  studentName: "Student Name",
  rollNumber: "Roll Number",
  department: "Department",
  semester: "1st Semester",
};
