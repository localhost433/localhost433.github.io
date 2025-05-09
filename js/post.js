/* post.js – load ONE post and hook comments */
function parseFrontMatter(md) {
  const m = /^---\r?\n([\s\S]+?)\r?\n---/.exec(md);
  if (!m) return { meta: {}, body: md };
  const yaml = m[1]; const meta = {};
  yaml.split('\n').forEach(line => {
    const [k, ...v] = line.split(':'); meta[k.trim()] = v.join(':').trim();
  });
  return { meta, body: md.slice(m[0].length) };
}

const slug = new URLSearchParams(location.search).get("id");
if (!slug) { location.href = "blog.html"; }

const content = document.getElementById("post-content");
if (!content) {
  console.error("Element with id 'post-content' not found.");
  throw new Error("Required DOM element not found.");
}

/* ---------- fetch markdown ---------- */
fetch(`/posts/entries/${slug}.md`)
  .then(r => r.text())
  .then(md => {
    const { meta, body } = parseFrontMatter(md);
    document.title = `${meta.title} – Robin's Blog`;
    const dirty = marked.parse(body);
    const html = DOMPurify.sanitize(dirty);

    const h1 = document.createElement("h1"); h1.textContent = meta.title || "Untitled";
    content.append(h1);

    const bodyDiv = document.createElement("div"); bodyDiv.innerHTML = html;
    content.appendChild(bodyDiv);

    const footerDiv = document.createElement("div");
    footerDiv.className = "post-location";
    const author = meta.author || "Anonymous";
    const date = meta.date || "In a fragment of time";
    const loc = meta.location ? ` in ${meta.location}` : "Somewhere on Earth";
    footerDiv.textContent = `${author}, ${date}${loc}`;
    content.appendChild(footerDiv);

    /* MathJax render if present */
    if (window.MathJax) { window.MathJax.typesetPromise?.([content]); }
  })
  .catch(e => {
    console.error(e);
    content.innerHTML = "<h2>Post not found</h2>";
  })
  .catch(e => {
    console.error(e);
    content.innerHTML = "<h2>Post not found</h2>";
  });
const form = document.getElementById("comment-form");

if (!list || !form) {
  console.error("Required elements for comments not found.");
  return;
}
/* ---------- comments ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("comments-list");
  const form = document.getElementById("comment-form");

  fetch(`/api/comments?slug=${slug}`)
    .then(r => r.json())
    .then(arr => arr.forEach(c => add(c)))
    .catch(e => console.error("load comments", e));

  const add = (c) => {
    const p = document.createElement("p");
    const sanitizedAuthor = DOMPurify.sanitize(c.author || "Anonymous");
    const sanitizedText = DOMPurify.sanitize(c.text);
    p.innerHTML = `<strong>${sanitizedAuthor}:</strong> ${sanitizedText}`;
    list.appendChild(p);
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value.trim();
    if (!text) return;
    const author = document.getElementById("comment-author").value.trim() || "Anonymous";

    fetch("/api/comments", {
      method: "POST", headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, text, author })
    })
      .then(r => r.json()).then(c => { add(c); form.reset(); });
  });
});
