import fetch from "node-fetch";

export default async function handler(req, res) {
  const { repo } = req.query;
  if (!repo) {
    return res.status(400).json({ error: "Missing repo query parameter" });
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
    const data = await gh.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}