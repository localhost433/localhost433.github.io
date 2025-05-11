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
if (!slug) location.href = "blog.html";

const content = document.getElementById("post-content");
if (!content) {
  console.error("Element with id 'post-content' not found.");
  throw new Error("Required DOM element not found.");
}

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

    const footerDiv = document.createElement("div");
    footerDiv.id         = "post-meta";
    footerDiv.className  = "post-location";
    const author = meta.author || "Anonymous";
    const date = meta.date || "In a fragment of time";
    footerDiv.textContent = `${author}, ${date}${meta.location ? ' in ' + meta.location : " Somewhere on Earth"}`;
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