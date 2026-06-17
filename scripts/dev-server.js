#!/usr/bin/env node
/*
 * Minimal zero-dependency static file server for local development.
 *
 * Serves the repository ROOT, so absolute paths used throughout the site
 * (/notes/..., /js/..., /css/..., /notes/artifact-host.html, ...) resolve
 * exactly as they do in production — and there is no `builds` allowlist to
 * trip over (that is a vercel.json concern, see README).
 *
 * It does NOT execute the serverless functions in api/. For comments and
 * the GitHub-languages endpoint, use `npm run dev:vercel` instead.
 *
 * Usage:  node scripts/dev-server.js [port]   (default 3000, or $PORT)
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || process.argv[2] || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  // strip query string; default directory requests to index.html
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("400 Bad Request");
    return;
  }
  if (pathname.endsWith("/")) pathname += "index.html";

  // resolve within ROOT and block path traversal
  const filePath = path.join(ROOT, pathname);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end("403 Forbidden");
    console.log("403", pathname);
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found: " + pathname);
      console.log("404", pathname);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Robots-Tag": "noai,noimageai",
    });
    fs.createReadStream(filePath).pipe(res);
    console.log("200", pathname);
  });
});

server.listen(PORT, () => {
  console.log("\n  Static dev server  →  http://localhost:" + PORT);
  console.log("  Serving root       →  " + ROOT);
  console.log("  Note: api/ serverless functions are NOT run here.");
  console.log("        For comments / API work use `npm run dev:vercel`.\n");
});
