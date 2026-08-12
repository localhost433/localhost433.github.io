// header-footer.js

import { initializeThemeToggle } from './theme.js'; 

const PAGE_META = {
  "": ["Robin's Site", "Robin's projects, writing, and course notes."],
  "index.html": ["Robin's Site", "Robin's projects, writing, and course notes."],
  "projects.html": ["Projects - Robin's Site", "Software projects and experiments by Robin."],
  "notes.html": ["Notes - Robin's Site", "Robin's course notes."],
  "blog.html": ["Blog - Robin's Site", "Posts by Robin about everything."],
  "course.html": ["Course Notes - Robin's Site", "Lecture notes and study materials."],
  "note.html": ["Course Note - Robin's Site", "A course note by Robin."],
  "post.html": ["Post - Robin's Site", "A blog post by Robin."]
};

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
}

let dynamicPageMetaApplied = false;

function updatePageMeta({ title, description } = {}) {
  if (title || description) dynamicPageMetaApplied = true;
  const page = (location.pathname.split("/").pop() || "").toLowerCase();
  const fallback = PAGE_META[page] || PAGE_META[""];
  const finalTitle = title || document.title || fallback[0];
  const finalDescription = description || fallback[1];
  const canonicalUrl = new URL(location.pathname + location.search, "https://localhost433.github.io").href;

  document.title = finalTitle;
  upsertMeta('meta[name="description"]', { name: "description", content: finalDescription });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: finalTitle });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: finalDescription });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: page === "post.html" ? "article" : "website" });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: finalTitle });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: finalDescription });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

window.updatePageMeta = updatePageMeta;
if (window.pendingPageMeta) {
  updatePageMeta(window.pendingPageMeta);
  delete window.pendingPageMeta;
}

function loadHeaderFooter() {
  return Promise.all([
    fetch("components/header.html")
      .then(r => r.text())
      .then(html => document.getElementById("header-placeholder").innerHTML = html),
    fetch("components/footer.html")
      .then(r => r.text())
      .then(html => document.getElementById("footer-placeholder").innerHTML = html)
  ]);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!dynamicPageMetaApplied) updatePageMeta();
  // Inject centralized meta tags if template present
  const metaTpl = document.getElementById('meta-include');
  if (metaTpl && metaTpl.dataset.src) {
    fetch(metaTpl.dataset.src)
      .then(r => r.text())
      .then(fragment => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fragment;
        // Avoid duplicate robots/meta by removing any existing with same name/http-equiv
        const incoming = Array.from(tempDiv.children);
        incoming.forEach(el => {
          if (el.tagName === 'META') {
            const name = el.getAttribute('name');
            const equiv = el.getAttribute('http-equiv');
            if (name) {
              document.head.querySelectorAll(`meta[name="${name}"]`).forEach(e => e.remove());
            }
            if (equiv) {
              document.head.querySelectorAll(`meta[http-equiv="${equiv}"]`).forEach(e => e.remove());
            }
            document.head.appendChild(el);
          }
        });
      })
      .catch(() => { /* silent fail */ });
  }
  loadHeaderFooter().then(() => {
    initializeThemeToggle();
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
    // Dynamic filesystem-style path indicator
    const pathEl = document.getElementById("fs-path");
    if (pathEl) {
      const page = (location.pathname.split("/").pop() || "").toLowerCase();
      const params = new URLSearchParams(location.search);
      const courseId = params.get("id") || params.get("course");
      // Map known secondary pages to pseudo-dirs
      const mapping = {
        "projects.html": "~/projects/",
        "notes.html": "~/notes/",
        "blog.html": "~/blog/",
        "post.html": "~/blog/",
        "index.html": "~/" // home
      };
      if ((page === 'course.html' || page === 'note.html') && courseId) {
        pathEl.textContent = `~/notes/${courseId}/`;
      } else {
        pathEl.textContent = mapping[page] || "~/";
      }
      const brandEl = document.getElementById('site-brand');
      if (brandEl) {
        if (pathEl.textContent !== "~/") {
          brandEl.style.display = 'none';
        } else {
          brandEl.style.display = '';
        }
      }
    }
  });
});

// Analytics
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};
