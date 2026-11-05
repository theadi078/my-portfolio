import { Github } from "lucide-react";
import { getGithubSummary } from "@/lib/github";

/** Shows real GitHub data when configured, and an honest placeholder when not. */
export async function GithubPanel({ profileUrl }: { profileUrl?: string }) {
  const summary = await getGithubSummary();

  if (!summary) {
    return (
      <div className="rounded-card border border-dashed border-line p-6">
        <p className="flex items-center gap-2 text-[15px] text-ink">
          <Github size={16} /> GitHub activity
        </p>
        <p className="mt-2 max-w-reading text-[14px] leading-relaxed text-muted">
          Live repository data is not connected yet. Set GITHUB_USERNAME in your environment
          variables and this panel fills itself in — repositories, stars, followers and languages.
        </p>
        {profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-block text-[14px] text-accent hover:underline"
          >
            Visit the profile instead
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-surface">
      <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
        {[
          { label: "Repositories", value: summary.publicRepos },
          { label: "Stars", value: summary.totalStars },
          { label: "Followers", value: summary.followers },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-4">
            <p className="font-display text-[22px] text-ink">{stat.value}</p>
            <p className="mt-0.5 text-[12px] text-faint">{stat.label}</p>
          </div>
        ))}
      </div>

      {summary.languages.length ? (
        <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-4">
          {summary.languages.map((lang) => (
            <span key={lang.name} className="rounded-chip border border-line px-2 py-0.5 text-[12px] text-muted">
              {lang.name} · {lang.count}
            </span>
          ))}
        </div>
      ) : null}

      <ul className="divide-y divide-line">
        {summary.repos.map((repo) => (
          <li key={repo.url}>
            <a href={repo.url} target="_blank" rel="noreferrer noopener" className="block px-4 py-3.5 hover:bg-raised">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] text-ink">{repo.name}</span>
                <span className="text-[12px] text-faint">{repo.stars} ★</span>
              </div>
              {repo.description ? (
                <p className="mt-1 line-clamp-1 text-[13px] text-muted">{repo.description}</p>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
