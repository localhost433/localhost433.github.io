// header-footer.js

import { initializeThemeToggle } from './theme.js'; 
// or if not using modules, just ensure initializeThemeToggle is global

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
    // now that <button id="theme-toggle"> is in the DOM:
    initializeThemeToggle();
  });
});
