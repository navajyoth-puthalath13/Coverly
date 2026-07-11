import { GraduationCap } from "lucide-react";
import { CoverGenerator } from "@/components/cover-generator";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-5xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:pt-24">
        <header className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center lg:mb-16">
          {/* Brand lockup — icon symbol + product name, made noticeable */}
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <GraduationCap className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              Coverly
            </span>
          </div>

          {/* Descriptor badge — no icon */}
          <span className="mt-4 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-500 shadow-sm">
            Assignment Cover Generator
          </span>

          <h1 className="mt-7 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            A clean cover page,
            <br className="hidden sm:block" /> ready to print in seconds.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-zinc-500 sm:text-lg">
            Fill in your details, watch the preview update, and download a
            print-ready PDF. Everything stays on your device.
          </p>
        </header>

        <CoverGenerator />
      </main>

      <SiteFooter />
    </div>
  );
}
