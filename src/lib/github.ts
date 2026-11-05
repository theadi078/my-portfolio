import { env, isGithubConfigured } from "./env";

export type GithubSummary = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  publicRepos: number;
  totalStars: number;
  languages: { name: string; count: number }[];
  repos: { name: string; description: string | null; url: string; stars: number; language: string | null }[];
};

/**
 * Live GitHub data. Returns null when GITHUB_USERNAME is not set or the API
 * fails, so the UI can render its placeholder state instead of fake numbers.
 */
export async function getGithubSummary(): Promise<GithubSummary | null> {
  if (!isGithubConfigured) return null;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (env.github.token) headers.Authorization = `Bearer ${env.github.token}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${env.github.username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${env.github.username}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos: Array<Record<string, unknown>> = await reposRes.json();
    const owned = repos.filter((r) => !r.fork);
    const languageCounts = new Map<string, number>();
    let totalStars = 0;

    for (const repo of owned) {
      totalStars += Number(repo.stargazers_count ?? 0);
      const lang = repo.language as string | null;
      if (lang) languageCounts.set(lang, (languageCounts.get(lang) ?? 0) + 1);
    }

    return {
      login: user.login,
      name: user.name ?? null,
      avatarUrl: user.avatar_url,
      bio: user.bio ?? null,
      followers: user.followers ?? 0,
      publicRepos: user.public_repos ?? 0,
      totalStars,
      languages: [...languageCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      repos: owned
        .sort((a, b) => Number(b.stargazers_count ?? 0) - Number(a.stargazers_count ?? 0))
        .slice(0, 6)
        .map((r) => ({
          name: String(r.name),
          description: (r.description as string | null) ?? null,
          url: String(r.html_url),
          stars: Number(r.stargazers_count ?? 0),
          language: (r.language as string | null) ?? null,
        })),
    };
  } catch {
    return null;
  }
}
