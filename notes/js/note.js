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
    headerPrefix: ''
});

const headingData = [];

const container = document.getElementById("note-content");
fetch(`/notes/courses/${course}/${noteSlug}.md`)
    .then(r => {
        if (!r.ok) throw new Error("Note not found");
        return r.text();
    })
    .then(md => {
        const { meta, body } = parseFrontMatter(md);
        document.title = meta.title || noteSlug;

        const footnotes = [];

        const bodyWithoutDefs = body.replace(
            /^\s*\[([^\]]+)\]:\s*(.+)$/gm,
            (_, num, text) => {
                footnotes.push({ num, text: text.trim() });
                return '';
            }
        )

        const bodyWithRefs = bodyWithoutDefs.replace(
            /\[\^(d+)\]/g,
            (_, num) => `<sup id="fnref${num}"><a href="#fn${num}">${num}</a></sup>`
        );

        const back = document.getElementById("back-to-course");
        back.href = `course.html?id=${encodeURIComponent(course)}`;

        const h1 = document.createElement("h1");
        h1.textContent = meta.title || noteSlug;
        container.append(h1);

        headingData.length = 0;
        for (let k in slugCounts) delete slugCounts[k];

        const dirty = marked.parse(bodyWithRefs);
        const sanitize = window.DOMPurify?.sanitize || (s => s);
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = sanitize(dirty);

        contentDiv.querySelectorAll('img').forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.margin = '0 auto';
        });

        const tocEntries = [];
        contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
            tocEntries.push({
                text: h.textContent,
                level: parseInt(h.tagName.charAt(1), 10),
                slug: h.id
            });
        });

        container.append(contentDiv);

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
                a.addEventListener("click", e => {
                    e.preventDefault();
                    const target = document.getElementById(slug);
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                });

                li.append(a);
                ul.append(li);
            });

            tocNav.append(ul);
            container.insertBefore(tocNav, contentDiv);
        }

        if (footnotes.length) {
            const fnSec = document.createElement("section");
            fnSec.className = "footnotes";
            const hr = document.createElement("hr");
            fnSec.appendChild(hr);

            const ol = document.createElement("ol");
            footnotes.forEach(({ num, text }) => {
                const li = document.createElement("li");
                li.id = `fn${num}`;
                const fnHtml = sanitize(marked.parseInline(text));
                li.innerHTML = fnHtml;
                ol.appendChild(li);
            });
            fnSec.appendChild(ol);
            container.appendChild(fnSec);
        }

        contentDiv.querySelectorAll('table').forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise([container])
                .catch(err => console.error('MathJax typeset failed:', err));
        }
        back.href = `course.html?id=${encodeURIComponent(course)}`;
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Could not load note.</p>";
    });
