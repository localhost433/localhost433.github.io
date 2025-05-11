import jsYaml from 'js-yaml';

function parseFrontMatter(md) {
  const re = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/;
  const m = re.exec(md);
  if (!m) return { meta: {}, body: md };

  // parse with js-yaml
  let meta = {};
  try {
    meta = jsYaml.load(m[1]) || {};
  } catch (err) {
    console.warn('YAML parse error:', err);
  }

  const body = md.slice(m[0].length);
  return { meta, body };
}

const slug = new URLSearchParams(location.search).get("id");
if (!slug) {
  location.href = "blog.html";
}

// Check that post-content exists
const content = document.getElementById("post-content");
if (!content) {
  console.error("Element with id 'post-content' not found.");
  throw new Error("Required DOM element not found.");
}

fetch(`/posts/entries/${slug}.md`)
  .then(r => r.text())
  .then(md => {
    const { meta, body } = parseFrontMatter(md);

    // Provide DOMPurify fallback if not available
    const sanitize = window.DOMPurify?.sanitize || (str => str);

    const cleanTitle = sanitize(meta.title || "Untitled");
    document.title = `${cleanTitle} – Robin's Blog`;

    const h1 = document.createElement("h1");
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

    const footerDiv = document.createElement("div");
    footerDiv.className = "post-location";
    const author = meta.author || "Anonymous";
    const date = meta.date || "In a fragment of time";
    footerDiv.textContent = `${author}, ${date}${meta.location ? ' in ' + meta.location : "Somewhere on Earth"}`;
    footerDiv.style.textAlign = "right";
    content.appendChild(footerDiv);


    // If MathJax is present, render any math
    if (window.MathJax) {
      window.MathJax.typesetPromise?.([content]);
    }
  })
  .catch(e => {
    console.error(e);
    content.innerHTML = "<h2>Post not found</h2>";
  });