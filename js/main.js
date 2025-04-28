document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("posts-list");

  fetch("metadata/entries.json")
    .then((res) => res.json())
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
    });
});
