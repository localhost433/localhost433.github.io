document.addEventListener("DOMContentLoaded", () => {
  function initializeThemeToggle() {
      const toggleBtn = document.getElementById("theme-toggle");
      if (!toggleBtn) {
          console.warn("Theme toggle button not found.");
          return;
      }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");

  const enableDark = () => {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "Light Mode";
  };

  const disableDark = () => {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "Dark Mode";
  };

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      enableDark();
  } else {
      disableDark();
  }

  toggleBtn.addEventListener("click", () => {
      if (document.documentElement.classList.contains("dark-mode")) {
          disableDark();
      } else {
          enableDark();
      }
  });
}
