# Contributing

Thanks for taking the time to contribute! Coverly is a small, friendly
open-source project, and contributions of every size are welcome —
whether that's reporting a bug, improving the docs, or adding a whole new cover
template.

This guide walks through how to contribute in general, and then the two things
people most often want to do: **report an issue** and **add a new template**.

## How to contribute

1. **Fork** the repository and **clone** your fork.
2. Install dependencies and start the dev server:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Create a branch for your change:
   ```bash
   git checkout -b my-change
   ```
4. Make your change. Before you push, make sure it type-checks and lints:
   ```bash
   pnpm exec tsc --noEmit
   pnpm lint
   ```
5. **Commit** with a clear message, **push** to your fork, and open a
   **Pull Request** describing what you changed and why.

Keep pull requests focused — one topic per PR is easier to review and merge.

## Found an issue?

If something is broken, confusing, or missing:

1. Search the **[Issues](../../issues)** tab first — it may already be reported.
2. If it's new, **open an issue**. Please include:
   - what you expected to happen,
   - what actually happened,
   - steps to reproduce it, and
   - your device/browser (this is a browser-only app, so that helps a lot).

Good bug reports are a genuinely valuable contribution. If you're not sure
whether something is a bug, open an issue anyway and we'll figure it out together.

## Adding a new template

Templates are the heart of this project, and new ones are the most welcome kind
of contribution. Every template lives in its own folder and is registered in one
place — no other part of the app needs to change.

Each template implements a single contract, [`CoverTemplate`](lib/templates/types.ts):
a **preview** (the on-screen A4 sheet) and a **document** (the printable PDF),
both driven by the same form data.

To add one, use the existing [`classic`](lib/templates/classic) template as a
reference and:

1. **Create a folder** at `lib/templates/<your-template>/`.
2. **`preview.tsx`** — an HTML/Tailwind React component that renders the A4 sheet
   on screen. Size everything in `cqi` units (see `classic/preview.tsx`) so the
   sheet scales fluidly on mobile and desktop.
3. **`document.tsx`** — an [`@react-pdf/renderer`](https://react-pdf.org)
   component that renders the printable PDF, matching the preview. Keep the two
   in sync by sharing layout constants (see `classic/layout.ts`).
4. **`index.tsx`** — export a `CoverTemplate` object with an `id`, `name`,
   `description`, your `Preview`, and a lazy `loadDocument`:
   ```ts
   import type { CoverTemplate } from "@/lib/templates/types";
   import { MyPreview } from "./preview";

   export const myTemplate: CoverTemplate = {
     id: "my-template",
     name: "My Template",
     description: "A short description of the look.",
     Preview: MyPreview,
     loadDocument: async () => (await import("./document")).MyDocument,
   };
   ```
5. **Register it** by adding your template to the `templates` array in
   [`lib/templates/registry.ts`](lib/templates/registry.ts). The template picker,
   the live preview and the PDF download all pick it up automatically.

Tips:

- The PDF renderer uses the built-in PDF fonts (Helvetica, Times, Courier) so
  generation stays instant and offline. If you need another font you must
  register it — prefer the built-ins where you can.
- Templates only render the fields in [`CoverData`](lib/cover.ts). If your design
  needs a new field, open an issue first so we can discuss it.

## Other contributions

Plenty of other things help just as much:

- fixing bugs or improving accessibility,
- refining the UI, copy, or documentation,
- improving performance or the developer experience.

If you're planning something larger, open an issue to talk it through before you
start — it saves everyone time. Above all, be kind and constructive; this is a
project built by and for students, in the open. ❤️
