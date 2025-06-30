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
  });
});

// Analytics
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};