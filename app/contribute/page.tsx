"use client";

import * as React from "react";
import Link from "next/link";
import {
  useForm,
  type FieldErrors,
  type Resolver,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_REQUEST,
  templateRequestSchema,
  type TemplateRequest,
} from "@/lib/requests";
import { cn } from "@/lib/utils";

/** Bridges Zod validation into React Hook Form without the resolver package. */
const requestResolver: Resolver<TemplateRequest> = async (values) => {
  const result = templateRequestSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<TemplateRequest> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof TemplateRequest | undefined;
    if (key && !errors[key]) {
      errors[key] = { type: issue.code, message: issue.message };
    }
  }
  return { values: {}, errors };
};

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {hint ? (
          <span className="ml-2 font-normal text-zinc-400">{hint}</span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-input bg-white px-3 py-2.5 text-base shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-200 aria-invalid:border-destructive";

export default function ContributePage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateRequest>({
    resolver: requestResolver,
    defaultValues: DEFAULT_REQUEST,
    mode: "onTouched",
  });

  const textareaProps = (reg: UseFormRegisterReturn, id: string, invalid: boolean) => ({
    id,
    "aria-invalid": invalid ? true : undefined,
    "aria-describedby": invalid ? `${id}-error` : undefined,
    className: cn(fieldClass, "min-h-28 resize-y"),
    ...reg,
  });

  const onSubmit = handleSubmit(async (data) => {
    setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }
      setSubmitted(true);
      toast.success("Request sent", { description: "Thanks — I'll take a look." });
    } catch (err) {
      toast.error("Couldn't send", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSending(false);
    }
  });

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Back to Coverly
        </Link>

        {submitted ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-zinc-900 text-white">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Request sent</h1>
            <p className="mt-3 max-w-sm text-pretty text-zinc-500">
              Thanks for the suggestion — it&apos;s on its way to me. I read every
              one.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100"
            >
              Back to Coverly
            </Link>
          </div>
        ) : (
          <>
            <header className="mt-8">
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Request a template
              </h1>
              <p className="mt-3 text-pretty text-zinc-500">
                Want a cover or form Coverly doesn&apos;t have yet? Tell me what you
                need and which fields it should include — I&apos;ll build it. Sent
                straight to me, nothing public.
              </p>
            </header>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" hint="optional" error={errors.name?.message}>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="h-11 rounded-xl bg-white text-base shadow-sm"
                    aria-invalid={errors.name ? true : undefined}
                    {...register("name")}
                  />
                </Field>
                <Field id="email" label="Email" hint="optional" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 rounded-xl bg-white text-base shadow-sm"
                    aria-invalid={errors.email ? true : undefined}
                    {...register("email")}
                  />
                </Field>
              </div>

              <Field
                id="title"
                label="What cover or form do you want?"
                error={errors.title?.message}
              >
                <Input
                  id="title"
                  placeholder="e.g. Lab record cover, Internship report cover"
                  className="h-11 rounded-xl bg-white text-base shadow-sm"
                  aria-invalid={errors.title ? true : undefined}
                  {...register("title")}
                />
              </Field>

              <Field
                id="fields"
                label="Which fields should it include?"
                error={errors.fields?.message}
              >
                <textarea
                  placeholder="e.g. Student name, Register number, Experiment no., Date, Guide name…"
                  {...textareaProps(register("fields"), "fields", !!errors.fields)}
                />
              </Field>

              <Field id="notes" label="Anything else?" hint="optional" error={errors.notes?.message}>
                <textarea
                  placeholder="Layout ideas, a reference you've seen, anything helpful."
                  {...textareaProps(register("notes"), "notes", !!errors.notes)}
                />
              </Field>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="mt-1 h-14 rounded-2xl text-base font-medium shadow-sm"
              >
                {sending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Send request
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
