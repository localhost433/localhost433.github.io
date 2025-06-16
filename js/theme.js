/* Dark-mode toggle */
export function initializeThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const enable = () => {
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    btn.textContent = "Light Mode";
    if (typeof window.onThemeChange === "function") {
      window.onThemeChange("dark");
    }
  };
  const disable = () => {
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    btn.textContent = "Dark Mode";
    if (typeof window.onThemeChange === "function") {
      window.onThemeChange("light");
    }
  };

  btn.addEventListener("click", () => {
    document.documentElement.classList.contains("dark-mode") ? disable() : enable();
  });

  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    enable();
  } else {
    disable();
  }
}