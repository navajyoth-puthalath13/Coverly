<!-- Logo goes here -->

# Coverly

Coverly generates a clean assignment cover page and downloads it as a
print-ready PDF in seconds. Built for students standing at a print shop with only
their phone — mobile-first, distraction-free, and completely private.

Everything runs in your browser. **No account, no upload, no backend, no
tracking.** Your details are saved only to your own device.

## Features

- **Live A4 preview** that updates instantly as you type.
- **One-tap PDF download** — print-ready, true to A4.
- **Remembers your details.** Your name, roll number, department, subject and
  semester are saved locally and restored on your next visit. Only the
  assignment number resets each time — because that's the one thing you change.
- **Mobile-first, keyboard-friendly, accessible.**
- **Pluggable templates** — new cover designs can be added with a single module
  (see [Contributing](#contributing)).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for the form
- [@react-pdf/renderer](https://react-pdf.org) for PDF generation
- [lucide-react](https://lucide.dev) icons

## Getting started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
pnpm build
pnpm start
```

## Project structure

```
app/                      Next.js app router (page, layout)
components/               UI — the form, footer, and shadcn/ui primitives
lib/
  cover.ts                Form schema, options, and shared types
  storage.ts              Local-storage persistence
  download.tsx            Client-side PDF generation + download
  site.ts                 Project constants (GitHub repo, links)
  templates/
    types.ts              The CoverTemplate contract
    registry.ts           The list of available templates
    classic/              The default template (preview + PDF + layout)
```

## Contributing

Contributions are very welcome — especially **new templates**. See
[CONTRIBUTING.md](CONTRIBUTING.md) for how to report an issue, add a template,
and set up the project locally.

## License

Released under the [MIT License](LICENSE).
