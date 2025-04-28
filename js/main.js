document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("posts-list");

  fetch("/posts/metadata/entries.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return res.json();
    })
    .then((posts) => {
      posts.forEach((post) => {
        const entry = document.createElement("div");
        entry.className = "post-entry";

        const title = document.createElement("a");
        title.href = `post.html?id=${post.slug}`;
        title.textContent = post.title;
        title.className = "post-title";

        const meta = document.createElement("div");
        meta.className = "post-meta-inline";
        meta.textContent = `${post.date}${post.author ? " • by " + post.author : ""}`;

        entry.appendChild(title);
        entry.appendChild(meta);

        container.appendChild(entry);
      });
    })
    .catch((err) => {
      console.error("Failed to load blog entries:", err);
      container.innerHTML = "<p>Unable to load posts at this time.</p>";
    });
});
