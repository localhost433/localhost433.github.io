import { Redis } from "@upstash/redis";
import { Pool } from "pg";
import sanitizeHtml from "sanitize-html";

const kv = new Redis({
  url: process.env.UPSTASH_KV_REST_URL,
  token: process.env.UPSTASH_KV_REST_TOKEN,
});

let pg;
if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.VERCEL_POSTGRES_URL
  });
}
pg = global._pgPool;

export default async function handler(req, res) {
  try {
    const { method } = req;

    if (method === "GET") {
      const { slug } = req.query;
      if (!slug) return res.status(400).json({ error: "Missing slug" });

      const cacheKey = `comments:${slug}`;
      let comments = await kv.get(cacheKey);
      if (comments) {
        return res.status(200).json(comments);
      }

      const { rows } = await pg.query(
        "SELECT id, slug, author, text, created_at FROM comments WHERE slug = $1 ORDER BY created_at",
        [slug]
      );
      comments = rows.map(r => ({
        id: r.id,
        slug: r.slug,
        author: r.author,
        text: r.text,
        timestamp: r.created_at,
      }));

      await kv.set(cacheKey, comments, { ex: 60 * 5 });
      return res.status(200).json(comments);
    }

    if (method === "POST") {
      const { slug, text, author = "Anonymous" } = req.body;
      if (!slug || !text) {
        return res.status(400).json({ error: "Missing slug or text" });
      }

      const cleanText = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
      const cleanAuthor = sanitizeHtml(author, { allowedTags: [], allowedAttributes: {} });

      const insert = await pg.query(
        "INSERT INTO comments (slug, author, text) VALUES ($1, $2, $3) RETURNING id, created_at",
        [slug, cleanAuthor, cleanText]
      );
      const entry = {
        id: insert.rows[0].id,
        slug,
        author: cleanAuthor,
        text: cleanText,
        timestamp: insert.rows[0].created_at,
      };

      const cacheKey = `comments:${slug}`;
      let cached = (await kv.get(cacheKey)) || [];
      cached.push(entry);
      await kv.set(cacheKey, cached, { ex: 60 * 5 });

      return res.status(201).json(entry);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}