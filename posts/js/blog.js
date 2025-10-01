/* blog.js - list of posts with tag filter, pagination, and search */

// Constants
const PER_PAGE = 10;

// DOM Elements
const list = document.getElementById("posts-list");
const btnBox = document.getElementById("tag-buttons");
const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");
const searchBox = document.getElementById("search-box");

// State
let posts = [];
let filtered = [];
let postBodies = {}; // slug -> raw searchable text content (lowercase)
let invertedIndex = {}; // token -> Set(slug)
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
    meta.textContent = `${post.date}${post.author ? ` - by ${post.author}` : ""}`;

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

// Execute a search over titles + loaded body excerpts
function executeSearch() {
  const query = searchBox.value.trim().toLowerCase();
  if (!query) {
    resetSearchAndFilter();
    return;
  }

  // Tokenize query for index lookup
  const tokens = Array.from(new Set(query.split(/\W+/).filter(t => t.length > 0)));
  let candidateSlugs = null;
  tokens.forEach(t => {
    const bucket = invertedIndex[t];
    if (!bucket) {
      candidateSlugs = new Set();
      return;
    }
    if (candidateSlugs === null) {
      candidateSlugs = new Set(bucket);
    } else {
      // intersect
      candidateSlugs = new Set([...candidateSlugs].filter(s => bucket.has(s)));
    }
  });

  let candidatesArray;
  if (!candidateSlugs || candidateSlugs.size === 0) {
    candidatesArray = posts;
  } else {
    candidatesArray = posts.filter(p => candidateSlugs.has(p.slug));
  }

  filtered = candidatesArray.filter(post => {
    const body = postBodies[post.slug] || "";
    return post.title.toLowerCase().includes(query) || body.includes(query);
  });

  currentPage = 1;
  renderPage();
}

// Trigger search only on button click or Enter key
searchButton.addEventListener("click", executeSearch);
searchBox.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    executeSearch();
  }
});

// Handle tag button clicks
function handleTagClick(tag) {
  searchBox.value = "";
  applyTagFilter(tag);
  if (tag) {
    history.replaceState({ tag }, "", window.location.pathname);
  } else {
    history.replaceState({}, "", window.location.pathname);
  }
}

// Apply tag filter
function applyTagFilter(tag) {
  filtered = tag ? posts.filter(post => (post.tags || []).includes(tag)) : posts;
  currentPage = 1;
  renderPage();
}

function resetSearchAndFilter() {
  searchBox.value = "";
  filtered = posts;
  currentPage = 1;
  renderPage();
}

// React to popstate (back/forward navigation)
window.addEventListener("popstate", () => {
  resetSearchAndFilter();
});

/* -------------------- Initialization -------------------- */

// Fetch posts and initialize the page
fetch("./posts/metadata/entries.json")
  .then(response => response.json())
  .then(data => {
    posts = data;
  filtered = posts;
  // Reset search and filter
  resetSearchAndFilter();

    // Build tag buttons
    const tags = [...new Set(posts.flatMap(post => post.tags || []))];
    btnBox.appendChild(createButton("All", () => handleTagClick(null)));
    tags.forEach(tag => {
      btnBox.appendChild(createButton(tag, () => handleTagClick(tag)));
    });

    // Preload post bodies (best-effort). Assumes markdown at ./posts/entries/<slug>.md
    const slugSafe = /^[\w-]+$/;
    posts.forEach(p => {
      if (!slugSafe.test(p.slug)) return; // skip unsafe slug
      const mdPath = `./posts/entries/${p.slug}.md`;
      fetch(mdPath)
        .then(r => (r.ok ? r.text() : ""))
        .then(text => {
          const lowered = text
            .replace(/`[^`]*`/g, " ")
            .replace(/\*|_|#/g, " ")
            .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
            .toLowerCase();
          postBodies[p.slug] = lowered;
          // Build inverted index tokens
            lowered.split(/\W+/).forEach(tok => {
              if (tok.length < 2) return; // skip very short tokens
              let set = invertedIndex[tok];
              if (!set) {
                set = new Set();
                invertedIndex[tok] = set;
              }
              set.add(p.slug);
            });
        })
        .catch(() => { /* ignore failures */ });
    });
  })
  .catch(err => {
    console.error("Failed to load posts", err);
    list.innerHTML = "<p>Unable to load posts.</p>";
  });