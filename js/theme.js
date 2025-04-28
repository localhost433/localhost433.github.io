/* Dark-mode toggle */
function initializeThemeToggle(){
    const btn = document.getElementById("theme-toggle");
    if(!btn){ console.warn("theme-toggle not found"); return; }
  
    const enable = ()=>{
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme","dark");
      btn.textContent="Light Mode";
    };
    const disable = ()=>{
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme","light");
      btn.textContent="Dark Mode";
    };
  
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme:dark)").matches;
    (stored==="dark" || (!stored && prefersDark)) ? enable() : disable();
  
    btn.addEventListener("click", ()=>{
      document.documentElement.classList.contains("dark-mode") ? disable() : enable();
    });
  }
  
  /* Wait for header/footer to be injected */
  document.addEventListener("DOMContentLoaded", initializeThemeToggle);
  