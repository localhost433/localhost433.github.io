import { kv } from "@vercel/kv";
import sanitizeHtml from "sanitize-html";
import fs from "fs/promises";
import path from "path";

const USE_KV = process.env.VERCEL_ENV === "production";
const COMMENTS_DIR = path.join(process.cwd(), "comments");

// Always use KV—remove file‐based fallback to avoid race conditions
async function readComments(slug) {
  if (USE_KV) {
    return (await kv.get(`comments:${slug}`)) || [];
  }
  try {
    const file = path.join(COMMENTS_DIR, `${slug}.json`);
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeComments(slug, arr) {
  if (USE_KV) {
    await kv.set(`comments:${slug}`, arr);
    return;
  }
  await fs.mkdir(COMMENTS_DIR, { recursive: true });
  const file = path.join(COMMENTS_DIR, `${slug}.json`);
  await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");
}

export default async function handler(req, res) {
  if (req.method === 'POST' && !req.body) {
    return res.status(400).json({ error: "Invalid or missing request body" });
  }

  if (req.method === 'GET') {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "Missing slug" });
    const comments = await readComments(slug);
    return res.status(200).json(comments);
  }

  if (req.method === 'POST') {
    const { slug, text, author } = req.body;
    if (!slug || !text) {
      return res.status(400).json({ error: "Missing slug or text" });
    }

    const sanitizedText = sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedAuthor = sanitizeHtml(author || "Anonymous", {
      allowedTags: [],
      allowedAttributes: {},
    });
    const timestamp = new Date();

    const comments = await readComments(slug);
    comments.push({ author: sanitizedAuthor, text: sanitizedText, timestamp });
    await writeComments(slug, comments);

    return res.status(201).json({ author: sanitizedAuthor, text: sanitizedText, timestamp });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}