/* note.js - render individual note */

const slugCounts = Object.create(null);
function slugify(raw) {
    const str = String(raw || "");
    let base = str
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w\-]/g, '');

    const count = slugCounts[base] || 0;
    slugCounts[base] = count + 1;
    return count ? `${base}-${count}` : base;
}

function parseFrontMatter(md) {
    const re = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/;
    const m = re.exec(md);
    return m
        ? { meta: window.jsyaml.load(m[1]) || {}, body: md.slice(m[0].length) }
        : { meta: {}, body: md };
}

const params = new URLSearchParams(location.search);
const course = params.get("course");
const noteSlug = params.get("note");
if (!course || !noteSlug) {
    location.href = "notes.html";
}

marked.setOptions({
    gfm: true,
    smartLists: true,
    smartypants: false,
    headerIds: true,
    headerPrefix: ''
});

const headingData = [];

const artifactStore = [];
marked.use({
  extensions: [{
    name: "artifact",
    level: "block",
    start(src) { const i = src.indexOf("```artifact"); return i === -1 ? undefined : i; },
    tokenizer(src) {
      const m = /^```artifact([^\n]*)\n([\s\S]*?)```(?:\n|$)/.exec(src);
      if (!m) return;
      return { type: "artifact", raw: m[0], info: (m[1] || "").trim(), code: m[2] };
    },
    renderer(token) {
      const parsed = ArtifactUtils.parseArtifactInfo("artifact " + token.info);
      const idx = artifactStore.length;
      artifactStore.push({ src: parsed.src, code: parsed.src ? null : token.code });
      return `<div class="artifact-mount" data-artifact-index="${idx}"></div>`;
    }
  }]
});

const container = document.getElementById("note-content");
fetch(`/notes/courses/${course}/${noteSlug}.md`)
    .then(r => {
        if (!r.ok) throw new Error("Note not found");
        return r.text();
    })
    .then(md => {
        const { meta, body } = parseFrontMatter(md);
        document.title = meta.title || noteSlug;

        const footnotes = [];

        const bodyWithoutDefs = body.replace(
            /^\s*\[([^\]]+)\]:\s*(.+)$/gm,
            (_, num, text) => {
                footnotes.push({ num, text: text.trim() });
                return '';
            }
        )

        const bodyWithRefs = bodyWithoutDefs.replace(
            /\[\^(d+)\]/g,
            (_, num) => `<sup id="fnref${num}"><a href="#fn${num}">${num}</a></sup>`
        );

        const back = document.querySelectorAll("#back-to-course, .back-link, .top-back-link");
        back.forEach(back => back.href = `course.html?id=${encodeURIComponent(course)}`);

    const h1 = document.createElement("h1");
    h1.textContent = meta.title || noteSlug;
    h1.id = slugify(h1.textContent);
    container.append(h1);

        headingData.length = 0;
        for (let k in slugCounts) delete slugCounts[k];

        const dirty = marked.parse(bodyWithRefs);
        const sanitize = window.DOMPurify?.sanitize || (s => s);
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = sanitize(dirty);

        const used = new Set();
        contentDiv.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
            if (!h.id) {
                h.id = slugify(h.textContent);
            }
            let base = h.id;
            let i = 1;
            while (used.has(h.id)) {
                h.id = `${base}-${i++}`;
            }
            used.add(h.id);
        });

        contentDiv.querySelectorAll('img').forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.margin = '0 auto';
        });

        const tocEntries = [];
        tocEntries.push({ text: h1.textContent, level: 1, slug: h1.id });
        contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
            tocEntries.push({
                text: h.textContent,
                level: parseInt(h.tagName.charAt(1), 10),
                slug: h.id
            });
        });

        container.append(contentDiv);
        hydrateArtifacts(contentDiv, course);

        if (tocEntries.length) {
            const tocNav = document.createElement("nav");
            tocNav.className = "table-of-contents";
            const ul = document.createElement("ul");

            tocEntries.forEach(({ text, level, slug }) => {
                const li = document.createElement("li");
                li.style.marginLeft = `${(level - 1) * 16}px`;

                const a = document.createElement("a");
                a.href = `#${slug}`;
                a.textContent = text;
                a.addEventListener("click", e => {
                    e.preventDefault();
                    const target = document.getElementById(slug);
                    if (target) {
                        history.replaceState(null, '', `#${slug}`);
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        target.classList.add('toc-highlight');
                        setTimeout(() => target.classList.remove('toc-highlight'), 1200);
                    }
                });

                li.append(a);
                ul.append(li);
            });

            tocNav.append(ul);
            container.insertBefore(tocNav, contentDiv);
        }

        if (footnotes.length) {
            const fnSec = document.createElement("section");
            fnSec.className = "footnotes";
            const hr = document.createElement("hr");
            fnSec.appendChild(hr);

            const ol = document.createElement("ol");
            footnotes.forEach(({ num, text }) => {
                const li = document.createElement("li");
                li.id = `fn${num}`;
                const fnHtml = sanitize(marked.parseInline(text));
                li.innerHTML = fnHtml;
                ol.appendChild(li);
            });
            fnSec.appendChild(ol);
            container.appendChild(fnSec);
        }

        contentDiv.querySelectorAll('table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        function applyHighlight() {
            if (window.hljs) {
                container.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
            }
        }

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([container])
                .then(applyHighlight)
                .catch(err => {
                    console.error('MathJax typeset failed:', err);
                    applyHighlight();
                });
        } else {
            applyHighlight();
        }
        back.href = `course.html?id=${encodeURIComponent(course)}`;
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Could not load note.</p>";
    });

/* ---- artifact hydration ---- */
function currentArtifactTheme() {
  return document.documentElement.classList.contains("dark-mode") ? "dark" : "light";
}

const liveArtifactFrames = [];
const sharedLayerCache = new Map();
function fetchTextCached(path) {
  if (sharedLayerCache.has(path)) return sharedLayerCache.get(path);
  const p = fetch(path).then(r => (r.ok ? r.text() : null)).catch(() => null);
  sharedLayerCache.set(path, p);
  return p;
}
async function gatherSharedLayers(course) {
  const [globalCss, courseCss, globalKit, courseKit] = await Promise.all([
    fetchTextCached("/notes/artifacts/theme.css"),
    fetchTextCached(`/notes/courses/${course}/demos/_shared.css`),
    fetchTextCached("/notes/artifacts/kit.jsx"),
    fetchTextCached(`/notes/courses/${course}/demos/_kit.jsx`)
  ]);
  const css = [globalCss, courseCss].filter(Boolean);
  const modules = {};
  if (globalKit) modules["@kit"] = globalKit;
  if (courseKit) modules["@course"] = courseKit;
  return { css, modules };
}

function renderArtifactError(mount, message) {
  mount.classList.add("ready");
  mount.innerHTML = "";
  const card = document.createElement("div");
  card.className = "artifact-error";
  card.textContent = "Artifact error: " + message;
  mount.appendChild(card);
}

async function setupArtifact(mount, course) {
  const entry = artifactStore[+mount.dataset.artifactIndex];
  let code;
  try {
    if (entry.src) {
      const path = ArtifactUtils.resolveArtifactSrc(course, entry.src);
      const r = await fetch(path);
      if (!r.ok) throw new Error("Could not load " + path);
      code = await r.text();
    } else {
      code = entry.code;
    }
  } catch (err) { renderArtifactError(mount, err.message); return; }

  code = ArtifactUtils.ensureDefaultExport(code);
  const { css, modules } = await gatherSharedLayers(course);

  const specs = new Set(ArtifactUtils.scanBareSpecifiers(code));
  Object.keys(modules).forEach(k => ArtifactUtils.scanBareSpecifiers(modules[k]).forEach(s => specs.add(s)));
  const libImports = ArtifactUtils.buildLibImports(Array.from(specs));

  const id = "art-" + mount.dataset.artifactIndex + "-" + Math.random().toString(36).slice(2);
  const iframe = document.createElement("iframe");
  iframe.className = "artifact-frame";
  iframe.title = "Interactive artifact";
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.setAttribute("scrolling", "no");
  iframe.src = "/notes/artifact-host.html";

  const payload = { source: "note", type: "artifact:init", id, code, css, modules, libImports, theme: currentArtifactTheme() };

  window.addEventListener("message", e => {
    const d = e.data || {};
    if (e.source !== iframe.contentWindow) return;
    if (d.type === "artifact:hostready") iframe.contentWindow.postMessage(payload, "*");
    else if (d.id !== id) return;
    else if (d.type === "artifact:ready") mount.classList.add("ready");
    else if (d.type === "artifact:height") iframe.style.height = d.px + "px";
    else if (d.type === "artifact:error") mount.classList.add("ready");
  });

  mount.appendChild(iframe);
  liveArtifactFrames.push({ id, iframe });
}

function hydrateArtifacts(root, course) {
  const mounts = root.querySelectorAll(".artifact-mount");
  mounts.forEach(m => { m.innerHTML = '<div class="artifact-spinner" role="status" aria-label="Loading demo"></div>'; });
  if (!mounts.length) return;
  if (!("IntersectionObserver" in window)) { mounts.forEach(m => setupArtifact(m, course)); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { obs.unobserve(en.target); setupArtifact(en.target, course); } });
  }, { rootMargin: "200px" });
  mounts.forEach(m => io.observe(m));
}

/* chain the site's theme hook so live artifacts re-theme on toggle */
const prevOnThemeChange = window.onThemeChange;
window.onThemeChange = function (mode) {
  if (typeof prevOnThemeChange === "function") prevOnThemeChange(mode);
  liveArtifactFrames.forEach(f => {
    if (f.iframe.contentWindow) f.iframe.contentWindow.postMessage({ source: "note", type: "artifact:theme", theme: mode }, "*");
  });
};

const tokenizer = {
  em(src) {
    // Only treat *...* as emphasis, ignore underscores
    const match = /^\*([^*]+)\*/.exec(src);
    if (!match) return;
    return {
      type: 'em',
      raw: match[0],
      text: match[1],
      tokens: this.lexer.inlineTokens(match[1])
    };
  },
  strong(src) {
    // Only treat **...** as strong emphasis, ignore __
    const match = /^\*\*([^*]+)\*\*/.exec(src);
    if (!match) return;
    return {
      type: 'strong',
      raw: match[0],
      text: match[1],
      tokens: this.lexer.inlineTokens(match[1])
    };
  }
};

marked.use({ tokenizer });
