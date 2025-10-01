// header-footer.js

import { initializeThemeToggle } from './theme.js'; 

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