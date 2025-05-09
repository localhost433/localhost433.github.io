// /api/comments.js

import fs from "fs";
import path from "path";
import { kv } from "@vercel/kv";
import sanitizeHtml from "sanitize-html";

const USE_KV = process.env.USE_KV === "true";

function filePath() { return path.join(process.cwd(), "comments.json"); }

async function readComments(slug) {
    if (USE_KV) return (await kv.get(`comments:${slug}`)) || [];
    if (!fs.existsSync(filePath())) fs.writeFileSync(filePath(), "{}");
    const data = JSON.parse(fs.readFileSync(filePath(), "utf8"));
    return data[slug] || [];
}

async function writeComments(slug, arr) {
    if (USE_KV) return kv.set(`comments:${slug}`, arr);
    const data = fs.existsSync(filePath())
        ? JSON.parse(fs.readFileSync(filePath(), "utf8"))
        : {};
    data[slug] = arr;
    fs.writeFileSync(filePath(), JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
    if (req.method === 'POST' && !req.body) {
        return res.status(400).json({ error: "Invalid or missing request body" });
    }

    if (req.method === 'GET') {
        const { slug } = req.query;
        if (!slug) {
            return res.status(400).json({ error: "Missing slug" });
        }
        const comments = await readComments(slug);
        return res.status(200).json(comments);
    }

    if (req.method === 'POST') {
        const { slug, text } = req.body;
        if (!slug || !text) {
            return res.status(400).json({ error: "Missing slug or text" });
        }

        const sanitizedText = sanitizeHtml(text, {
            allowedTags: [],
            allowedAttributes: {},
        });

        const timestamp = Date.now();
        const comments = await readComments(slug);
        comments.push({ text: sanitizedText, timestamp });
        await writeComments(slug, comments);
        return res.status(201).json({ text: sanitizedText, timestamp });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
