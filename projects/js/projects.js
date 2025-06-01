const LINGUIST_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  TypeScript: "#2b7489",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  // Add other languages as needed
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

  const ghurl = `https://api.github.com/repos/${repo}/languages`;
  let data = {};

  try {
    const resp = await fetch(ghurl);
    if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
    data = await resp.json();
  } catch (err) {
    console.warn(`Could not load languages for ${repo} from GitHub (Private repo), trying local fallback.`, err);
    const repoName = repo.includes('/') ? repo.split('/')[1] : repo;
    const fallbackFile = `/projects/languages/${repoName}.json`;
    try {
      const r2 = await fetch(fallbackFile);
      if (r2.ok) {
        data = await r2.json();
      } else {
        console.warn(`Local fallback file not found: ${fallbackFile}`);
        return {};
      }
    } catch (e2) {
      console.error(`Error loading local fallback for ${repo}:`, e2);
      data = {};
    }
  }

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
      title.href = project.link || "#";
      title.target = "_blank";
      title.textContent = project.title || "Untitled Project";
      title.className = "post-title";

      // div for the title and description
      const info = document.createElement("div");
      info.className = "project-info";

      // title
      info.appendChild(title);

      // short description under the title
      if (project.description) {
        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = project.description;
        info.appendChild(desc);
      }
      entry.appendChild(info);

      // languages
      const techContainer = document.createElement("div");
      techContainer.className = "languages";

      //header
      const techLabel = document.createElement("div");
      techLabel.className = "languages-label";
      techLabel.textContent = "languages";
      techContainer.appendChild(techLabel);

      // wrapper for bar + per‑lang list
      const wrapper = document.createElement("div");
      wrapper.className = "linguist-wrapper";
      techContainer.appendChild(wrapper);

      entry.appendChild(techContainer);

      container.appendChild(entry);

      if (project.repo) {
        try {
          const languages = await fetchLanguages(project.repo);
          const total = Object.values(languages).reduce((a, b) => a + b, 0);

          const languageBar = createLanguageBar(languages);
          wrapper.appendChild(languageBar);

          const langList = document.createElement("div");
          langList.className = "linguist-langs";
          Object.entries(languages).forEach(([lang, bytes]) => {
            const pct = total
              ? ((bytes / total * 100).toFixed(1) + "%")
              : "0%";
            const line = document.createElement("div");
            line.textContent = `${lang} – ${pct}`;
            langList.appendChild(line);
          });
          wrapper.appendChild(langList);

        } catch (err) {
          console.error(`Could not load languages for ${project.repo}`, err);
        }
      }
    }
  })
  .catch(error => {
    console.error("Error loading projects:", error);
  });