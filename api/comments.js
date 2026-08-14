import { createHash } from "node:crypto";
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

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 10 * 60;
const TURNSTILE_AFTER = 3;
const DUPLICATE_WINDOW_SECONDS = 10 * 60;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_SLUG_LENGTH = 200;
const MAX_AUTHOR_LENGTH = 80;
const MAX_TEXT_LENGTH = 4_000;
const MAX_TURNSTILE_TOKEN_LENGTH = 4_096;

function header(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
}

function clientIp(req) {
  return (
    header(req, "x-forwarded-for").split(",")[0].trim() ||
    header(req, "x-real-ip") ||
    req.socket?.remoteAddress ||
    "unknown"
  ).slice(0, 128);
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function bodySize(req) {
  const declared = Number(header(req, "content-length"));
  if (Number.isFinite(declared) && declared > 0) return declared;
  return Buffer.byteLength(JSON.stringify(req.body ?? ""), "utf8");
}

function parseBody(req) {
  if (typeof req.body !== "string") return req.body || {};
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

function looksLikeBot(req) {
  const userAgent = header(req, "user-agent");
  return !userAgent || /bot|crawler|spider|scrapy|curl|wget/i.test(userAgent);
}

function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SITE_KEY);
}

async function verifyTurnstile(token, ip) {
  if (!token || token.length > MAX_TURNSTILE_TOKEN_LENGTH) return false;

  const payload = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip && ip !== "unknown") payload.set("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

async function countPost(ip, slug) {
  const key = `comments:rate:${digest(`${ip}:${slug}`)}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, RATE_WINDOW_SECONDS);
  return count;
}

export default async function handler(req, res) {
  try {
    const { method } = req;

    if (method === "GET") {
      const { slug } = req.query;
      if (!slug) return res.status(400).json({ error: "Missing slug" });
      if (typeof slug !== "string" || slug.length > MAX_SLUG_LENGTH) {
        return res.status(400).json({ error: "Invalid slug" });
      }

      const cacheKey = `comments:${slug}`;
      let comments = await kv.get(cacheKey);
      if (comments) {
        res.setHeader("Cache-Control", "public, max-age=0, s-maxage=900, stale-while-revalidate=3600");
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

      await kv.set(cacheKey, comments, { ex: 60 * 15 });
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=900, stale-while-revalidate=3600");
      return res.status(200).json(comments);
    }

    if (method === "POST") {
      if (bodySize(req) > MAX_BODY_BYTES) {
        return res.status(413).json({ error: "Request body too large" });
      }

      const body = parseBody(req);
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const {
        slug,
        text,
        author = "Anonymous",
        website = "",
        turnstileToken = "",
      } = body;

      if (
        typeof slug !== "string" ||
        typeof text !== "string" ||
        typeof author !== "string" ||
        typeof website !== "string" ||
        typeof turnstileToken !== "string"
      ) {
        return res.status(400).json({ error: "Invalid comment fields" });
      }

      const normalizedSlug = slug.trim();
      if (!normalizedSlug || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(normalizedSlug)) {
        return res.status(400).json({ error: "Missing slug or text" });
      }
      if (normalizedSlug.length > MAX_SLUG_LENGTH) {
        return res.status(400).json({ error: "Slug is too long" });
      }
      if (!text.trim()) return res.status(400).json({ error: "Missing slug or text" });
      if (text.length > MAX_TEXT_LENGTH || author.length > MAX_AUTHOR_LENGTH) {
        return res.status(413).json({ error: "Comment is too long" });
      }

      const ip = clientIp(req);
      const count = await countPost(ip, normalizedSlug);
      if (count > RATE_LIMIT) {
        res.setHeader("Retry-After", RATE_WINDOW_SECONDS);
        return res.status(429).json({ error: "Too many comments; try again later" });
      }

      // Bots often fill hidden fields. Silently accept the request without writing it.
      if (website.trim()) {
        return res.status(202).json({ accepted: true });
      }

      const suspicious = looksLikeBot(req) || count >= TURNSTILE_AFTER;
      if (suspicious && turnstileConfigured()) {
        if (!turnstileToken) {
          return res.status(403).json({ error: "challenge_required" });
        }
        if (!(await verifyTurnstile(turnstileToken, ip))) {
          return res.status(403).json({ error: "challenge_failed" });
        }
      }

      const cleanText = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
      const cleanAuthor = sanitizeHtml(author, { allowedTags: [], allowedAttributes: {} });

      const duplicateKey = `comments:duplicate:${digest(
        `${normalizedSlug}:${cleanAuthor}:${cleanText}`
      )}`;
      const reserved = await kv.set(duplicateKey, "1", {
        nx: true,
        ex: DUPLICATE_WINDOW_SECONDS,
      });
      if (!reserved) {
        return res.status(409).json({ error: "Duplicate comment" });
      }

      const insert = await pg.query(
        "INSERT INTO comments (slug, author, text) VALUES ($1, $2, $3) RETURNING id, created_at",
        [normalizedSlug, cleanAuthor, cleanText]
      );
      const entry = {
        id: insert.rows[0].id,
        slug: normalizedSlug,
        author: cleanAuthor,
        text: cleanText,
        timestamp: insert.rows[0].created_at,
      };

      const cacheKey = `comments:${normalizedSlug}`;
      let cached = (await kv.get(cacheKey)) || [];
      if (!Array.isArray(cached)) cached = [];
      cached.push(entry);
      await kv.set(cacheKey, cached, { ex: 60 * 15 });

      res.setHeader("Cache-Control", "no-store");
      return res.status(201).json(entry);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
