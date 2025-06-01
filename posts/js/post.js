function parseFrontMatter(text) {
  const re = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/;
  const m  = text.match(re);
  let meta = {};
  let body = text;
  if (m) {
    if (window.jsyaml) {
      meta = window.jsyaml.load(m[1]);
    } else {
      console.error("jsyaml library is not available.");
    }
    body = text.slice(m[0].length);
  }
  return { meta, body };
}

const params = new URLSearchParams(location.search);
const slug = params.get("slug") || params.get("id");
if (!slug) {
  location.href = "blog.html";
  throw new Error("Slug not provided, redirecting to blog list.");
}

const content = document.getElementById("post-content");
if (!content) {
  console.error("Element with id 'post-content' not found.");
  throw new Error("Required DOM element not found.");
}

const renderer = new marked.Renderer();

renderer.code = function(code, infostring, escaped) {
  const lang = (infostring || "").trim().toLowerCase();

  if (lang === "mermaid") {
    return `<div class="mermaid">\n${code}\n</div>`;
  }
  return marked.Renderer.prototype.code.call(this, code, infostring, escaped);
};

marked.setOptions({
  gfm: true,
  breaks: false,
  smartLists: true,
  smartypants: false,
  renderer: renderer
});

fetch(`./posts/entries/${slug}.md`)
  .then(r => r.text())
  .then(md => {
    const { meta, body } = parseFrontMatter(md);

    // Provide DOMPurify fallback if not available
    const sanitize = window.DOMPurify?.sanitize || (str => str.replace(/<[^>]+>/g, ""));

    const cleanTitle = sanitize(meta.title || "Untitled");
    document.title = `${cleanTitle} – Robin's Blog`;

    const h1 = document.createElement("h1");
    h1.id          = "post-title";
    h1.textContent = cleanTitle;
    content.append(h1);

    let dirtyHTML = "";
    if (window.marked) {
      dirtyHTML = marked.parse(body);
    } else {
      console.error("Marked library is not available.");
      dirtyHTML = "<p>Markdown parsing is not supported.</p>";
    }
    const html = sanitize(dirtyHTML);

    const bodyDiv = document.createElement("div");
    bodyDiv.innerHTML = html;
    content.appendChild(bodyDiv);

    let rawDate = meta.date ? new Date(meta.date) : null;

    let dateDisplay;
    if (rawDate instanceof Date && !isNaN(rawDate)) {
      const Y = rawDate.getFullYear();
      const M = String(rawDate.getMonth() + 1).padStart(2, "0");
      const D = String(rawDate.getDate()).padStart(2, "0");
      dateDisplay = `${Y}-${M}-${D}`;
    } else {
      dateDisplay = "In a fragment of time";
    }

    const footerDiv = document.createElement("div");
    footerDiv.id        = "post-meta";
    footerDiv.className = "post-location";
    footerDiv.style.textAlign = "right";
    const author = meta.author || "Anonymous";
    const locationPart = meta.location
      ? ` in ${meta.location}`
      : " Somewhere on Earth";
    footerDiv.textContent = `${author}, ${dateDisplay}${locationPart}`;
    content.appendChild(footerDiv);

    // If MathJax is present, render any math
    if (window.MathJax) {
      window.MathJax.typesetPromise?.([content]).then(() => {
        if (window.mermaid) {
          try {
            mermaid.initialize({ startOnLoad: false });
            mermaid.init(undefined, bodyDiv);
          } catch (e) {
            console.warn("Mermaid failed to render:", e);
          }
        }
      }).catch((e) => {
        console.warn("MathJax vs Mermaid timing issue:", e);
        if (window.mermaid) {
          mermaid.initialize({ startOnLoad: false });
          mermaid.init(undefined, bodyDiv);
        }
      });
    } else {
      if (window.mermaid) {
        mermaid.initialize({ startOnLoad: false });
        mermaid.init(undefined, bodyDiv);
      }
    }
  })
  .catch(e => {
    console.error(e);
    content.innerHTML = "<h2>Post not found</h2>";
  });