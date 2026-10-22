"use client";

import * as React from "react";
import Link from "next/link";
import { Code2, Coffee, FilePlus2, Star } from "lucide-react";
import {
  BUYMEACOFFEE_URL,
  CONTRIBUTING_URL,
  GITHUB_REPO,
  GITHUB_URL,
} from "@/lib/site";

/** Compact star count, e.g. 1.2k. */
function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

/**
 * Fetches the repository's public star count from the GitHub API. No user data
 * is sent, and if the request fails (offline, placeholder repo) the count is
 * simply omitted — the star link still works.
 */
function useGitHubStars(): number | null {
  const [stars, setStars] = React.useState<number | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        /* offline or unreachable — leave the count empty */
      });
    return () => {
      active = false;
    };
  }, []);

  return stars;
}

export function SiteFooter() {
  const stars = useGitHubStars();

  return (
    <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 pt-8 pb-10 sm:px-6">
      {/* Short divider — separates just the bottom section, not the whole page */}
      <div aria-hidden className="h-px w-full max-w-sm bg-zinc-200" />

      {/* Two ways to get a new template */}
      <div className="flex flex-wrap items-center justify-center gap-2">
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

      <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 text-sm shadow-sm">
        <span className="px-3 py-1.5 text-zinc-500">Open source</span>

        <span aria-hidden className="h-4 w-px bg-zinc-200" />

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            stars !== null ? `Star on GitHub, ${stars} stars` : "Star on GitHub"
          }
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          <Star className="size-4" />
          Star on GitHub
          {stars !== null ? (
            <span className="text-zinc-400">{formatStars(stars)}</span>
          ) : null}
        </a>
      </div>

      <a
        href={BUYMEACOFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100"
      >
        <Coffee className="size-4 text-amber-500" />
        Buy me a coffee
      </a>

      <p className="text-center text-xs text-zinc-400">
        Proudly open source · runs entirely in your browser — no account, no
        upload, no tracking.
      </p>
    </footer>
  );
}
