const LINGUIST_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  TypeScript: "#2b7489",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PowerShell: "#012456",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  // Add more colors as needed
  // Source: https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
};
// GitHub Linguist also reports data, configuration, and documentation formats.
// They are useful repository metadata, but not project implementation languages.
const NON_CODE_LANGUAGES = new Set([
  "CSV",
  "JSON",
  "Markdown",
  "TOML",
  "XML",
  "YAML",
]);
const langCache = new Map();

function filterLanguages(languages) {
  return Object.fromEntries(
    Object.entries(languages).filter(([language, bytes]) => (
      !NON_CODE_LANGUAGES.has(language)
      && typeof bytes === "number"
      && Number.isFinite(bytes)
      && bytes > 0
    ))
  );
}

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
    portion.title = `${lang} - ${(bytes / total * 100).toFixed(1)}%`;
    barContainer.appendChild(portion);
  });

  return barContainer;
}

async function fetchLanguages(project) {
  if (project.languages && Object.keys(project.languages).length > 0) {
    return filterLanguages(project.languages);
  }

  const repo = project.repo;
  if (!repo) return {};

  if (langCache.has(repo)) return langCache.get(repo);

  const githubUrl = `https://api.github.com/repos/${repo}/languages`;
  const proxyUrl = `/api/github-languages?repo=${encodeURIComponent(repo)}`;
  const repoName = repo.includes("/") ? repo.split("/").pop() : repo;
  const fallbackUrl = `/projects/languages/${encodeURIComponent(repoName)}.json`;
  const hostname = window.location.hostname;
  const isLocal = ["localhost", "127.0.0.1"].includes(hostname);
  const isGitHubPages = hostname.endsWith(".github.io");
  const urls = isLocal || isGitHubPages
    ? [githubUrl, fallbackUrl]
    : [proxyUrl, githubUrl, fallbackUrl];

  let lastError;
  for (const url of urls) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
      const data = await resp.json();
      if (!data || Array.isArray(data) || typeof data !== "object") {
        throw new Error("GitHub API returned an invalid languages payload");
      }
      const filtered = filterLanguages(data);
      langCache.set(repo, filtered);
      return filtered;
    } catch (err) {
      lastError = err;
    }
  }

  console.warn(`Could not load languages for ${repo} from GitHub or the local fallback.`, lastError);
  return {};
}

function createExternalLink(href, label) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function addProjectLinks(info, project) {
  const links = [];
  if (project.link) {
    links.push({
      href: project.link,
      label: project.linkLabel || (project.link.includes("github.com") ? "Source" : "Open project"),
    });
  }

  const source = project.source || (project.repo ? `https://github.com/${project.repo}` : null);
  if (source && source !== project.link) links.push({ href: source, label: "Source" });
  if (project.demo && project.demo !== project.link) links.push({ href: project.demo, label: "Live demo" });
  if (!links.length) return;

  const linkRow = document.createElement("div");
  linkRow.className = "project-links";
  links.forEach(({ href, label }, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.textContent = " · ";
      separator.setAttribute("aria-hidden", "true");
      linkRow.appendChild(separator);
    }
    linkRow.appendChild(createExternalLink(href, label));
  });
  info.appendChild(linkRow);
}

function addProjectMeta(info, project) {
  if (!project.period && !project.category) return;

  const meta = document.createElement("div");
  meta.className = "project-meta";
  if (project.period) {
    const period = document.createElement("span");
    period.textContent = project.period;
    meta.appendChild(period);
  }
  if (project.period && project.category) {
    const separator = document.createElement("span");
    separator.textContent = " · ";
    separator.setAttribute("aria-hidden", "true");
    meta.appendChild(separator);
  }
  if (project.category) {
    const category = document.createElement("span");
    category.textContent = project.category;
    meta.appendChild(category);
  }
  info.appendChild(meta);
}

function addTechnologyTags(info, project) {
  if (!project.tech) return;

  const stack = document.createElement("div");
  stack.className = "project-tech";
  project.tech.split(",").map(tech => tech.trim()).filter(Boolean).forEach(tech => {
    const tag = document.createElement("span");
    tag.className = "project-tech-tag";
    tag.textContent = tech;
    stack.appendChild(tag);
  });
  info.appendChild(stack);
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

      const title = document.createElement(project.link ? "a" : "span");
      if (project.link) {
        title.href = project.link;
        title.target = "_blank";
        title.rel = "noopener noreferrer";
      }
      title.textContent = project.title || "Untitled Project";
      title.className = "post-title";

      // Title, metadata, description, stack, and project links.
      const info = document.createElement("div");
      info.className = "project-info";
      info.appendChild(title);
      addProjectMeta(info, project);

      if (project.description) {
        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = project.description;
        info.appendChild(desc);
      }
      addTechnologyTags(info, project);
      addProjectLinks(info, project);
      entry.appendChild(info);

      // Repository language composition is secondary to the human-readable stack.
      const techContainer = document.createElement("div");
      techContainer.className = "languages";

      const techLabel = document.createElement("div");
      techLabel.className = "languages-label";
      techLabel.textContent = "repository languages";
      techContainer.appendChild(techLabel);

      const wrapper = document.createElement("div");
      wrapper.className = "linguist-wrapper";
      techContainer.appendChild(wrapper);

      entry.appendChild(techContainer);

      container.appendChild(entry);

      if (project.repo || (project.languages && Object.keys(project.languages).length > 0)) {
        try {
          const languages = await fetchLanguages(project);
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
            line.textContent = `${lang} - ${pct}`;
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
