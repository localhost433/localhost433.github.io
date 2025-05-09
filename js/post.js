// ...existing code...

function parseFrontMatter(md) {
  const m = /^---\r?\n([\s\S]+?)\r?\n---/.exec(md);
  if (!m) return { meta: {}, body: md };
  const yaml = m[1];
  const meta = {};
  // Use safer regex parsing for each line
  yaml.split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) meta[match[1].trim()] = match[2].trim();
  });
  return { meta, body: md.slice(m[0].length) };
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

/* ---------- fetch markdown ---------- */
fetch(`/posts/entries/${slug}.md`)
  .then(r => r.text())
  .then(md => {
    const { meta, body } = parseFrontMatter(md);
    document.title = `${meta.title} – Robin's Blog`;

    // Provide DOMPurify fallback if not available
    const sanitize = window.DOMPurify?.sanitize || (str => str);

    const dirtyHTML = marked.parse(body);
    const html = sanitize(dirtyHTML);

    const h1 = document.createElement("h1");
    h1.textContent = meta.title || "Untitled";
    content.append(h1);

    const bodyDiv = document.createElement("div");
    bodyDiv.innerHTML = html;
    content.appendChild(bodyDiv);

    const footerDiv = document.createElement("div");
    footerDiv.className = "post-location";
    const author = meta.author || "Anonymous";
    const date = meta.date || "In a fragment of time";
    footerDiv.textContent = `${author}, ${date}${meta.location ? ' in ' + meta.location : "Somewhere on Earth"}`;
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

/* ---------- comments ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("comments-list");
  const form = document.getElementById("comment-form");

  if (!list || !form) {
    console.error("Required elements for comments not found.");
    return;
  }

  // Move add() here, before we load existing comments
  const add = (comment) => {
    // Provide DOMPurify fallback if not available
    const sanitize = window.DOMPurify?.sanitize || (str => str);
    const p = document.createElement("p");
    const sanitizedAuthor = sanitize(comment.author || "Anonymous");
    const sanitizedText = sanitize(comment.text);
    p.innerHTML = `<strong>${sanitizedAuthor}:</strong> ${sanitizedText}`;
    list.appendChild(p);
  };

  // Fetch existing comments
  fetch(`/api/comments?slug=${slug}`)
    .then(r => r.json())
    .then(arr => {
      if (arr.length === 0) {
        list.innerHTML = "<p class='no-comments'>No comments yet. Be the first!</p>";
      } else {
        arr.forEach(c => add(c));
      }
    })
    .catch(e => console.error("Failed to load comments", e));

  // Handle new comment submissions
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value.trim();
    if (!text) return;

    const author = document.getElementById("comment-author").value.trim() || "Anonymous";

    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, text, author })
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Submission error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(comment => {
        add(comment);
        requestAnimationFrame(() => form.reset());
      })
      .catch(err => {
        console.error("Failed to submit comment", err);
        alert("Comment submission failed. Please try again later.");
      });
  });
});