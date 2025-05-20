/* note.js – render note */

const slugCounts = Object.create(null);
function slugify(raw) {
    const str = String(raw || "");
    let base = str
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w\-]/g, '');

    const count = slugCounts[base] || 0;
    slugCounts[base] = count + 1;
    return count ? `${base}-${count}` : base;
}

function parseFrontMatter(md) {
    const re = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/;
    const m = re.exec(md);
    return m
        ? { meta: window.jsyaml.load(m[1]) || {}, body: md.slice(m[0].length) }
        : { meta: {}, body: md };
}

const params = new URLSearchParams(location.search);
const course = params.get("course");
const noteSlug = params.get("note");
if (!course || !noteSlug) {
    location.href = "notes.html";
}

marked.setOptions({
    gfm: true,
    smartLists: true,
    smartypants: false,
    headerIds: true,
    headerPrefix: ""
});

const headingData = [];
const renderer = new marked.Renderer();

renderer.heading = (text, level, raw) => {
    const source = typeof raw === 'string' ? raw : text;
    const slug = slugify(source);
    headingData.push({ text, level, slug });
    return `<h${level} id="${slug}">${text}</h${level}>`;
};

marked.use({ renderer });

const container = document.getElementById("note-content");
fetch(`/notes/courses/${course}/${noteSlug}.md`)
    .then(r => {
        if (!r.ok) throw new Error("Note not found");
        return r.text();
    })
    .then(md => {
        const { meta, body } = parseFrontMatter(md);
        document.title = meta.title || noteSlug;

        const h1 = document.createElement("h1");
        h1.textContent = meta.title || noteSlug;
        container.append(h1);

        headingData.length = 0;
        for (let k in slugCounts) delete slugCounts[k];

        const dirty = marked.parse(body);
        const sanitize = window.DOMPurify?.sanitize || (s => s);
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = sanitize(dirty);

        const tocEntries = [];

        contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
            tocEntries.push({
                text: h.textContent,
                level: parseInt(h.tagName.charAt(1), 10),
                slug: h.id
            });
        });

        if (tocEntries.length) {
            const tocNav = document.createElement("nav");
            tocNav.className = "table-of-contents";
            const ul = document.createElement("ul");

            tocEntries.forEach(({ text, level, slug }) => {
                const li = document.createElement("li");
                li.style.marginLeft = `${(level - 1) * 16}px`;

                const a = document.createElement("a");
                a.href = `#${slug}`;
                a.textContent = text;
                li.append(a);

                li.addEventListener("click", e => {
                    e.preventDefault();
                    document.getElementById(slug)
                        .scrollIntoView({ behavior: "smooth" });
                });
                ul.append(li);
            });

            tocNav.append(ul);
            container.prepend(tocNav);
        }

        container.append(contentDiv);

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([container])
                .catch(err => console.error('MathJax typeset failed:', err));
        }
        
        const back = document.getElementById("back-to-course");
        back.href = `course.html?id=${encodeURIComponent(course)}`;
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Could not load note.</p>";
    });
