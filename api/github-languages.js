import fetch from "node-fetch";

const ALLOWED_REPOS = new Set([
  "localhost433/probability-cup",
  "localhost433/LeetHub",
  "localhost433/Vibe-Search-Engine",
  "localhost433/pa-toponyms",
  "localhost433/nyc-mayor-prediction",
  "localhost433/icloud-mcp",
  "localhost433/Peking-NYT",
  "localhost433/Prime-Factorization-Game",
]);
const CACHE_TTL_MS = 15 * 60 * 1000;
const languageCache = new Map();
const NON_CODE_LANGUAGES = new Set([
  "CSV",
  "JSON",
  "Markdown",
  "TOML",
  "XML",
  "YAML",
]);

function filterLanguages(languages) {
  return Object.fromEntries(
    Object.entries(languages).filter(([language, bytes]) => (
      !NON_CODE_LANGUAGES.has(language)
      && typeof bytes === "number"
      && Number.isFinite(bytes)
      && bytes > 0
    ))
  );
}

export default async function handler(req, res) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { repo } = req.query;
  if (!repo || typeof repo !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    return res.status(400).json({ error: "Invalid or missing repo query parameter" });
  }
  if (!ALLOWED_REPOS.has(repo)) {
    return res.status(403).json({ error: "Repository is not available through this endpoint" });
  }

  const cached = languageCache.get(repo);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json(cached.data);
  }

  const token = process.env.GITHUB_PAT || '';
  const headers = token
    ? { Authorization: `token ${token}` }
    : {};

  try {
    const gh = await fetch(`https://api.github.com/repos/${repo}/languages`, { headers });
    if (!gh.ok) {
      return res.status(gh.status).json({ error: "GitHub API error" });
    }
    const data = filterLanguages(await gh.json());
    languageCache.set(repo, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
