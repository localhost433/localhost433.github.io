/* blog.js - list of posts with tag filter, pagination, and search */

// Pagination size (mutable via dropdown)
let perPage = 10;

// DOM Elements
const list = document.getElementById("posts-list");
const btnBox = document.getElementById("tag-buttons");
const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");
const perPageSelect = document.getElementById("per-page-select");
const pageInput = document.getElementById("page-input");
const totalPagesSpan = document.getElementById("total-pages");
const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");

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
function totalPages() {
  return Math.max(1, Math.ceil(filtered.length / perPage));
}

function clampPage() {
  const tp = totalPages();
  if (currentPage > tp) currentPage = tp;
  if (currentPage < 1) currentPage = 1;
}

function renderPage() {
  clampPage();
  const start = (currentPage - 1) * perPage;
  renderPosts(filtered.slice(start, start + perPage));
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages();
  if (pageInput) pageInput.value = currentPage;
  if (totalPagesSpan) totalPagesSpan.textContent = ` / ${totalPages()}`;
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
  if (currentPage < totalPages()) {
    currentPage++;
    renderPage();
  }
});

// Change per-page size
if (perPageSelect) {
  perPageSelect.addEventListener("change", () => {
    const val = parseInt(perPageSelect.value, 10);
    if ([10, 20, 50].includes(val)) {
      perPage = val;
      currentPage = 1;
      renderPage();
    }
  });
}

// Page jump input
if (pageInput) {
  pageInput.addEventListener("change", () => {
    let val = parseInt(pageInput.value, 10);
    if (Number.isNaN(val)) val = 1;
    currentPage = val;
    renderPage();
  });
  pageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      let val = parseInt(pageInput.value, 10);
      if (Number.isNaN(val)) val = currentPage;
      currentPage = val;
      renderPage();
    }
  });
}

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
    // Sort posts so newest appear first. We try date (desc) then fallback to slug id.
    posts = data.slice().sort((a, b) => {
      const da = a.date ? new Date(a.date) : null;
      const db = b.date ? new Date(b.date) : null;
      const va = da instanceof Date && !isNaN(da) ? da.getTime() : null;
      const vb = db instanceof Date && !isNaN(db) ? db.getTime() : null;

      if (va !== null && vb !== null && va !== vb) {
        // Newest first
        return vb - va;
      }

      // Fallback: sort by slug/id descending so higher numbered posts come first
      if (a.slug && b.slug) {
        return b.slug.localeCompare(a.slug, undefined, { numeric: true, sensitivity: "base" });
      }

      return 0;
    });

    filtered = posts;
  // Reset search and filter (also updates pagination UI)
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