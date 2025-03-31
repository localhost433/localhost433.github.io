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

document.addEventListener("DOMContentLoaded", () => {
    const slug = getSlugFromURL();
    const contentDiv = document.getElementById("post-content");

    if (!slug) {
        contentDiv.innerHTML = "<p>Error: No post ID provided.</p>";
        return;
    }

    fetch(`./posts/${slug}.md`)
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
            contentDiv.appendChild(metaWrapper);
            contentDiv.appendChild(bodyContainer);

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
            contentDiv.innerHTML = `
                <h2>Post Not Found</h2>
                <a href="index.html" class="back-link">Back to Home</a>`;
        });
});
