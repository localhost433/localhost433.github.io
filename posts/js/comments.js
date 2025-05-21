document.addEventListener("DOMContentLoaded", () => {
  const slug = new URLSearchParams(window.location.search).get("id");
  if (!slug) return;

  const commentsList = document.getElementById("comments-list");
  const form = document.getElementById("comment-form");
  if (!commentsList || !form) {
    console.error("Required DOM elements are missing");
    return;
  }

  const sanitize = window.DOMPurify?.sanitize || (s => s);

  function add(comment) {
    const p = document.createElement("p");
    const author = sanitize(comment.author || "Anonymous");
    const text = sanitize(comment.text);
    p.innerHTML = `<strong>${author}:</strong> ${text}`;
    commentsList.appendChild(p);
  }

  // load existing
  fetch(`/api/comments?slug=${slug}`)
    .then(r => r.ok ? r.json() : [])
    .then(arr => {
      if (!arr.length) {
        commentsList.innerHTML =
          "<p class='no-comments'>No comments yet. Be the first!</p>";
      } else {
        arr.forEach(add);
      }
    })
    .catch(e => console.error("Failed to load comments", e));

  // new comment
  form.addEventListener("submit", e => {
    e.preventDefault();
    const textEl = document.getElementById("comment-text");
    const authEl = document.getElementById("comment-author");
    const text = textEl.value.trim();
    const author = authEl.value.trim() || "Anonymous";
    if (!text) return;

    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, text, author })
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(comment => {
        add(comment);
        requestAnimationFrame(() => form.reset());
      })
      .catch(err => {
        console.error("Failed to post comment", err);
        alert("Could not submit comment—please try again.");
      });
  });
});