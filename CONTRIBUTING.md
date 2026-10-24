# Contributing

Thanks for taking the time to contribute! Coverly is a small, friendly
open-source project, and contributions of every size are welcome —
whether that's reporting a bug, improving the docs, or adding a whole new cover
template.

This guide walks through how to contribute in general, and then the two things
people most often want to do: **report an issue** and **add a new template**.

## How to contribute (the fork & pull-request flow)

Coverly uses the standard open-source **fork → branch → pull request** flow: you
work on **your own copy** of the repo and propose changes back with a PR. You
never push directly to the main repository.

1. **Fork** the repo — click **Fork** at the top-right of the GitHub page. This
   creates your own copy at `https://github.com/<your-username>/Coverly`.

2. **Clone your fork** and move into it:
   ```bash
   git clone https://github.com/<your-username>/Coverly.git
   cd Coverly
   ```

3. **Add the original repo as `upstream`** so you can pull future updates:
   ```bash
   git remote add upstream https://github.com/navajyoth-puthalath13/Coverly.git
   ```

4. **Install dependencies and start the dev server:**
   ```bash
   pnpm install
   pnpm dev
   ```

5. **Create a branch** for your change (never commit on `main`):
   ```bash
   git checkout -b my-change
   ```

6. **Make your change**, then make sure it type-checks and lints:
   ```bash
   pnpm exec tsc --noEmit
   pnpm lint
   ```

7. **Commit and push to your fork:**
   ```bash
   git add -A
   git commit -m "Describe what you changed and why"
   git push -u origin my-change
   ```

8. **Open the Pull Request.** After you push, GitHub shows a
   **"Compare & pull request"** button. The PR goes **from your fork's branch →
   the main Coverly repo's `main`**. Describe what you changed and why, and link
   any related issue (e.g. `Closes #12`).

9. A maintainer reviews it, you tweak if needed, and once approved it's merged. 🎉

**Keep your fork up to date** before starting new work:
```bash
git checkout main
git pull upstream main
git push origin main
```

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
