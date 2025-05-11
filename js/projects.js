const LINGUIST_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  TypeScript: "#2b7489",
  HTML: "#e34c26",
  CSS: "#563d7c",
  // Add other languages and their colors as needed
};
const langCache = new Map();

function createLanguageBar(languages) {
  const total = Object.values(languages).reduce((acc, val) => acc + val, 0);

  if (total === 0) {
    const noLangDiv = document.createElement("div");
    noLangDiv.className = "linguist-bar";
    noLangDiv.textContent = "No language data available";
    return noLangDiv;
  }

  const barContainer = document.createElement("div");
  barContainer.className = "linguist-bar";

  Object.entries(languages).forEach(([lang, bytes]) => {
    const portion = document.createElement("span");
    portion.className = "linguist-bar-segment";
    portion.style.backgroundColor = LINGUIST_COLORS[lang] || "#ccc";
    portion.style.width = `${(bytes / total) * 100}%`;
    portion.title = `${lang} – ${(bytes / total * 100).toFixed(1)}%`;
    barContainer.appendChild(portion);
  });

  return barContainer;
}

async function fetchLanguages(repo) {
  if (langCache.has(repo)) return langCache.get(repo);

  const url = `https://api.github.com/repos/${repo}/languages`;
  const resp = await fetch(url);
  
  if (!resp.ok) {
    console.warn(`Could not load languages for ${repo}: ${resp.status}`);
    langCache.set(repo, {});
    return {};
  }

  const data = await resp.json();
  langCache.set(repo, data);
  return data;
}

fetch("projects/metadata.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(async projects => {
    const container = document.getElementById("projects-list");
    if (!container) {
      console.error("Error: 'projects-list' element not found");
      return;
    }

    for (const project of projects) {
      const entry = document.createElement("div");
      entry.className = "post-entry";

      const title = document.createElement("a");
      title.href = project.link;
      title.target = "_blank";
      title.textContent = project.title;
      title.className = "post-title";

      const meta = document.createElement("div");
      meta.className = "post-meta-inline";
      meta.textContent = project.tech || "";

      entry.appendChild(title);
      entry.appendChild(meta);

      container.appendChild(entry);

      if (project.repo) {
        try {
          const languages = await fetchLanguages(project.repo);
          const languageBar = createLanguageBar(languages);
          entry.appendChild(languageBar);
        } catch (error) {
          console.error(`Error loading languages for ${project.repo}:`, error);
        }
      }
    }
  })
  .catch(error => {
    console.error("Error loading projects:", error);
  });