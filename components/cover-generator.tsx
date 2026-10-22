"use client";

import * as React from "react";
import Link from "next/link";
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Code2, Download, FilePlus2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ASSIGNMENT_OPTIONS,
  DEFAULT_COVER,
  PLACEHOLDERS,
  SEMESTER_OPTIONS,
  coverSchema,
  type CoverData,
} from "@/lib/cover";
import { downloadCoverPdf } from "@/lib/download";
import { CONTRIBUTING_URL } from "@/lib/site";
import {
  loadPersistedCover,
  loadPersistedTemplate,
  savePersistedCover,
  savePersistedTemplate,
} from "@/lib/storage";
import {
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  templates,
} from "@/lib/templates/registry";

/**
 * Bridges Zod validation into React Hook Form. Kept local (instead of the
 * @hookform/resolvers adapter) to avoid its zod-version-pinned types.
 */
const coverResolver: Resolver<CoverData> = async (values) => {
  const result = coverSchema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<CoverData> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof CoverData | undefined;
    if (key && !errors[key]) {
      errors[key] = { type: issue.code, message: issue.message };
    }
  }
  return { values: {}, errors };
};

/** A labelled text input with inline validation messaging. */
function TextField({
  id,
  label,
  error,
  registration,
  autoComplete,
}: {
  id: keyof CoverData;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={PLACEHOLDERS[id]}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-11 rounded-xl bg-white text-base shadow-sm"
        {...registration}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A labelled select bound to a form field. */
function SelectField({
  id,
  label,
  value,
  options,
  onValueChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v != null) onValueChange(v);
        }}
      >
        <SelectTrigger
          id={id}
          className="h-11 w-full rounded-xl bg-white text-base shadow-sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CoverGenerator() {
  const [downloading, setDownloading] = React.useState(false);
  const [templateId, setTemplateId] = React.useState(DEFAULT_TEMPLATE_ID);

  const form = useForm<CoverData>({
    resolver: coverResolver,
    defaultValues: DEFAULT_COVER,
    mode: "onTouched",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Restore remembered fields on mount, then persist every later change.
  // Reading localStorage must happen after mount to avoid hydration mismatch;
  // subscribing only *after* the reset means the empty defaults never overwrite
  // previously saved data. The assignment number is never written back.
  React.useEffect(() => {
    reset({ ...DEFAULT_COVER, ...loadPersistedCover() });
    const storedTemplate = loadPersistedTemplate();
    if (storedTemplate) setTemplateId(getTemplate(storedTemplate).id);

    const subscription = watch((current) => {
      savePersistedCover(current as CoverData);
    });
    return () => subscription.unsubscribe();
  }, [reset, watch]);

  // Live values that drive the preview.
  const values = useWatch({ control }) as CoverData;
  const template = getTemplate(templateId);
  const Preview = template.Preview;

  const onTemplateChange = (id: string) => {
    setTemplateId(id);
    savePersistedTemplate(id);
  };

  const onSubmit = handleSubmit(async (data) => {
    setDownloading(true);
    try {
      await downloadCoverPdf(data, template);
      toast.success("Cover downloaded", {
        description: `${data.assignmentNumber} · ${data.subject}`,
      });
    } catch {
      toast.error("Couldn't generate the PDF", {
        description: "Something went wrong — please try again.",
      });
    } finally {
      setDownloading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* Form column */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          {templates.length > 1 ? (
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={template.name}
                onValueChange={(v) => {
                  const next = templates.find((t) => t.name === v);
                  if (next) onTemplateChange(next.id);
                }}
              >
                <SelectTrigger
                  id="template"
                  className="h-11 w-full rounded-xl bg-white text-base shadow-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="assignmentNumber"
              label="Assignment number"
              value={values.assignmentNumber}
              options={ASSIGNMENT_OPTIONS}
              onValueChange={(v) =>
                setValue("assignmentNumber", v as CoverData["assignmentNumber"], {
                  shouldValidate: true,
                })
              }
            />

            <TextField
              id="subject"
              label="Subject"
              error={errors.subject?.message}
              registration={register("subject")}
            />

            <TextField
              id="studentName"
              label="Student name"
              autoComplete="name"
              error={errors.studentName?.message}
              registration={register("studentName")}
            />

            <TextField
              id="rollNumber"
              label="Roll number"
              error={errors.rollNumber?.message}
              registration={register("rollNumber")}
            />

            <TextField
              id="department"
              label="Department"
              error={errors.department?.message}
              registration={register("department")}
            />

            <SelectField
              id="semester"
              label="Semester"
              value={values.semester}
              options={SEMESTER_OPTIONS}
              onValueChange={(v) =>
                setValue("semester", v as CoverData["semester"], {
                  shouldValidate: true,
                })
              }
            />

            {/* "Submitted to" (teacher) — only for templates that show it */}
            {template.usesSubmittedTo ? (
              <>
                <TextField
                  id="submittedToName"
                  label="Teacher name (optional)"
                  error={errors.submittedToName?.message}
                  registration={register("submittedToName")}
                />
                <TextField
                  id="submittedToDepartment"
                  label="Teacher department (optional)"
                  error={errors.submittedToDepartment?.message}
                  registration={register("submittedToDepartment")}
                />
              </>
            ) : null}
          </div>
        </div>

        {/* Preview column */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-8">
            <p className="mb-3 hidden text-xs font-medium uppercase tracking-widest text-zinc-400 lg:block">
              Preview
            </p>
            <Card className="mx-auto max-w-[420px] rounded-3xl border-none bg-zinc-100/70 p-4 shadow-none sm:p-6 lg:max-w-none">
              <Preview data={values} />
            </Card>
          </div>
        </div>
      </div>

      {/* Primary action — reachable at the bottom, pinned on mobile. */}
      <div className="sticky bottom-0 z-10 mt-8 -mx-4 border-t border-zinc-200/70 bg-white/85 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-5 lg:static lg:mt-12 lg:border-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <Separator className="mb-4 hidden lg:block" />
        <Button
          type="submit"
          size="lg"
          disabled={downloading}
          className="h-14 w-full rounded-2xl text-base font-medium shadow-sm lg:max-w-sm"
        >
          {downloading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download className="size-5" />
              Download PDF
            </>
          )}
        </Button>

        {/* Two compact, equal-level ways to get a new template */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <a
            href={CONTRIBUTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Code2 className="size-3.5" />
            Contribute a template
          </a>
          <Link
            href="/contribute"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <FilePlus2 className="size-3.5" />
            Request a template
          </Link>
        </div>
      </div>
    </form>
  );
}
