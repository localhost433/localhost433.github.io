// Utility Functions
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function parseFrontMatter(markdown) {
  const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  if (!match) return { metadata: {}, body: markdown };

  const yaml = match[1];
  const body = markdown.slice(match[0].length);
  const metadata = {};

  yaml.split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':');
    metadata[key.trim()] = rest.join(':').trim();
  });

  return { metadata, body };
}

// Tag Management
const tagsSet = new Set();
let posts = []; // Initialize posts as an empty array

fetch('/posts/metadata/entries.json')
  .then(response => response.json())
  .then(data => {
    posts = data; // Assign fetched posts to the variable
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    // Create tag buttons
    const tagButtonsContainer = document.getElementById('tag-buttons');
    if (tagButtonsContainer) {
      tagsSet.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-button';
        button.textContent = tag;
        button.addEventListener('click', () => filterPosts(tag));
        tagButtonsContainer.appendChild(button);
      });
    } else {
      console.warn('Tag buttons container not found.');
    }
  })
  .catch(error => {
    console.error('Failed to load posts:', error);
  });

function filterPosts(tag) {
  const entries = document.querySelectorAll('.post-entry');
  entries.forEach(entry => {
    const tags = Array.from(entry.querySelectorAll('.post-tag')).map(e => e.textContent);
    entry.style.display = tags.includes(tag) ? 'flex' : 'none';
  });
}

// DOMContentLoaded Event Handler
document.addEventListener("DOMContentLoaded", () => {
  const postsList = document.getElementById("posts-list");
  const tagButtonsContainer = document.getElementById("tag-buttons");

  if (!postsList) return; // Only run on post.html where postsList exists

  fetch('/posts/metadata/entries.json')
    .then(response => response.json())
    .then(posts => {
      renderPosts(posts);
      createTagFilter(posts);
    })
    .catch(error => {
      console.error('Failed to load posts:', error);
    });

  function renderPosts(posts, filterTag = null) {
    postsList.innerHTML = ''; // Clear old posts first

    posts.forEach(post => {
      if (filterTag && (!post.tags || !post.tags.includes(filterTag))) {
        return; // Skip posts that don't match the filter
      }

      const entry = document.createElement("div");
      entry.className = "post-entry";

      const title = document.createElement("a");
      title.href = `post.html?id=${post.slug}`;
      title.textContent = post.title;
      title.className = "post-title";

      const meta = document.createElement("div");
      meta.className = "post-meta-inline";
      meta.textContent = `${post.date}${post.author ? " • by " + post.author : ""}`;

      const tagsContainer = document.createElement("div");
      tagsContainer.className = "tags-container";
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          const tagEl = document.createElement("span");
          tagEl.className = "post-tag";
          tagEl.textContent = tag;
          tagsContainer.appendChild(tagEl);
        });
      }

      entry.appendChild(title);
      entry.appendChild(meta);
      entry.appendChild(tagsContainer);

      postsList.appendChild(entry);
    });
  }

  function createTagFilter(posts) {
    const allTags = new Set();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => allTags.add(tag));
      }
    });

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = "tag-button";
    allButton.textContent = "All";
    allButton.addEventListener('click', () => renderPosts(posts, null));
    tagButtonsContainer.appendChild(allButton);

    // Add buttons for each unique tag
    allTags.forEach(tag => {
      const button = document.createElement('button');
      button.className = "tag-button";
      button.textContent = tag;
      button.addEventListener('click', () => renderPosts(posts, tag));
      tagButtonsContainer.appendChild(button);
    });
  }
});

// Load List of Posts
function loadPostList(postsList) {
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

        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tags-container";
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach(tag => {
            const tagEl = document.createElement("span");
            tagEl.className = "post-tag";
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
          });
        }

        entry.appendChild(title);
        entry.appendChild(meta);
        entry.appendChild(tagsContainer);

        postsList.appendChild(entry);
      });
    })
    .catch((err) => {
      console.error("Failed to load blog entries:", err);
      postsList.innerHTML = "<p>Unable to load posts at this time.</p>";
    });
}

// Load Specific Post
function loadSpecificPost(slug, contentDiv, postsList) {
  fetch(`/posts/entries/${slug}.md`)
    .then((res) => res.text())
    .then((markdown) => {
      const { metadata, body: markdownBody } = parseFrontMatter(markdown);
      const html = marked.parse(markdownBody);

      // Set page title
      document.title = `${metadata.title || "Untitled Post"} - Robin's Blog`;

      // Clear and build post content
      contentDiv.innerHTML = "";

      const titleEl = document.createElement("h1");
      titleEl.textContent = metadata.title || "Untitled Post";

      const metaWrapper = document.createElement("div");
      metaWrapper.className = "post-meta";

      const dateEl = document.createElement("span");
      dateEl.className = "post-date";
      dateEl.textContent = metadata.date || "Unknown date";

      const authorEl = document.createElement("span");
      authorEl.className = "post-author";
      authorEl.textContent = ` by ${metadata.author || "Anonymous"}`;

      metaWrapper.appendChild(dateEl);
      metaWrapper.appendChild(authorEl);

      const bodyContainer = document.createElement("div");
      bodyContainer.innerHTML = html;

      contentDiv.appendChild(titleEl);
      if (postsList) {
        postsList.style.display = "none";
      } else {
        console.warn('Posts list not found.');
      }
      contentDiv.appendChild(bodyContainer);

      // Hide the posts list
      if (postsList) {
        postsList.style.display = "none";
      }

      // Render MathJax if available
      if (window.MathJax) {
        requestAnimationFrame(() => {
          try {
            if (typeof MathJax.typesetPromise === "function") {
              MathJax.typesetPromise([contentDiv]).catch((err) =>
                console.error("MathJax render error:", err)
              );
            } else if (typeof MathJax.typeset === "function") {
              MathJax.typeset();
            } else {
              console.warn("MathJax is loaded, but no known typeset method is available.");
            }
          } catch (e) {
            console.error("MathJax exception:", e);
          }
        });
      }
    })
    .catch((err) => {
      console.error("Failed to load post:", err);
      contentDiv.innerHTML = `
        <h2>Post Not Found</h2>
        <a href="index.html" class="back-link">Back to Home</a>`;
    });
}