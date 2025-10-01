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