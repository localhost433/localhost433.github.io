#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://localhost433.github.io/";
const urls = ["", "projects.html", "notes.html", "blog.html"];

const posts = JSON.parse(fs.readFileSync(path.join(ROOT, "posts/metadata/entries.json"), "utf8"));
for (const post of posts) {
  urls.push(`post.html?id=${encodeURIComponent(post.slug)}`);
}

const courses = JSON.parse(fs.readFileSync(path.join(ROOT, "notes/metadata/courses.json"), "utf8"));
for (const course of courses) {
  urls.push(`course.html?id=${encodeURIComponent(course.slug)}`);
  const indexPath = path.join(ROOT, "notes/courses", course.slug, "index.json");
  if (!fs.existsSync(indexPath)) continue;
  const notes = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  for (const note of notes) {
    if (!note.slug) continue;
    urls.push(`note.html?course=${encodeURIComponent(course.slug)}&note=${encodeURIComponent(note.slug)}`);
  }
}

const escapeXml = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(url => `  <url><loc>${escapeXml(new URL(url, SITE).href)}</loc></url>`),
  '</urlset>',
  ''
].join("\n");

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);
console.log(`Wrote sitemap.xml with ${urls.length} URLs.`);
