"use client";

import * as React from "react";
import { Heart, Star } from "lucide-react";
import { GITHUB_REPO, GITHUB_URL } from "@/lib/site";

/** GitHub mark (lucide dropped its brand icons). */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

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
    <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 pb-10 sm:px-6">
      <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 text-sm shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-zinc-500">
          <Heart className="size-3.5 fill-zinc-400 text-zinc-400" />
          Open source
        </span>

        <span aria-hidden className="h-4 w-px bg-zinc-200" />

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          <GithubIcon className="size-4" />
          GitHub
        </a>

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
          {stars !== null ? formatStars(stars) : "Star"}
        </a>
      </div>

      <p className="text-center text-xs text-zinc-400">
        Made with love · runs entirely in your browser — no account, no upload,
        no tracking.
      </p>
    </footer>
  );
}
