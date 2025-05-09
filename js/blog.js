/* blog.js – list of posts with tag filter, pagination, and search */

// Constants
const PER_PAGE = 8;

// DOM Elements
const list = document.getElementById("posts-list");
const btnBox = document.getElementById("tag-buttons");
const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");
const searchBox = document.getElementById("search-box");

// State
let posts = [];
let filtered = [];
let currentPage = 1;

/* -------------------- Utility Functions -------------------- */

// Create a button with text and click callback
function createButton(text, callback) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "tag-button";
  button.addEventListener("click", callback);
  return button;
}

/* -------------------- Rendering Functions -------------------- */

// Render posts with optional tag filter
function renderPosts(posts, filterTag = null) {
  list.innerHTML = "";

  posts.forEach(post => {
    if (filterTag && !(post.tags || []).includes(filterTag)) return;

    const entry = document.createElement("div");
    entry.className = "post-entry";

    const title = document.createElement("a");
    title.href = `post.html?id=${post.slug}`;
    title.textContent = post.title;
    title.className = "post-title";

    const meta = document.createElement("div");
    meta.className = "post-meta-inline";
    meta.textContent = `${post.date}${post.author ? ` • by ${post.author}` : ""}`;

    const tagsDiv = document.createElement("div");
    (post.tags || []).forEach(tag => {
      const span = document.createElement("span");
      span.className = "post-tag";
      span.textContent = tag;
      tagsDiv.appendChild(span);
    });

    entry.append(title, meta, tagsDiv);
    list.appendChild(entry);
  });
}

// Render the current page of posts
function renderPage() {
  const start = (currentPage - 1) * PER_PAGE;
  renderPosts(filtered.slice(start, start + PER_PAGE));
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = start + PER_PAGE >= filtered.length;
}

/* -------------------- Event Handlers -------------------- */

// Handle pagination (previous button)
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

// Handle pagination (next button)
nextBtn.addEventListener("click", () => {
  if (currentPage * PER_PAGE < filtered.length) {
    currentPage++;
    renderPage();
  }
});

// Handle search input
searchBox.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  filtered = posts.filter(post => post.title.toLowerCase().includes(query));
  currentPage = 1;
  renderPage();
});

// Handle tag button clicks
function handleTagClick(tag) {
  const params = new URLSearchParams(location.search);
  params.set("tag", tag);
  history.pushState({ tag }, "", `?${params.toString()}`);
  applyTagFilter(tag);
}

// Apply tag filter
function applyTagFilter(tag) {
  filtered = tag ? posts.filter(post => (post.tags || []).includes(tag)) : posts;
  currentPage = 1;
  renderPage();
}

// React to popstate (back/forward navigation)
window.addEventListener("popstate", e => {
  const tag = e.state?.tag || null;
  applyTagFilter(tag);
});

/* -------------------- Initialization -------------------- */

// Fetch posts and initialize the page
fetch("/posts/metadata/entries.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
    const params = new URLSearchParams(location.search);
    const initialTag = params.get("tag");
    filtered = posts;

    // Render initial posts
    applyTagFilter(initialTag);

    // Build tag buttons
    const tags = [...new Set(posts.flatMap(post => post.tags || []))];
    btnBox.appendChild(createButton("All", () => handleTagClick(null)));
    tags.forEach(tag => {
      btnBox.appendChild(createButton(tag, () => handleTagClick(tag)));
    });
  })
  .catch(err => {
    console.error("Failed to load posts", err);
    list.innerHTML = "<p>Unable to load posts.</p>";
  });