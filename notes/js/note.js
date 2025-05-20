/* note.js – render note */

function parseFrontMatter(md) {
    const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(md);
    if (!match) return { meta: {}, body: md };
    const meta = window.jsYaml ? jsYaml.load(match[1]) : {};
    return { meta, body: md.slice(match[0].length) };
}

const p = new URLSearchParams(location.search);
const course = p.get("course");
const noteSlug = p.get("note");
if (!course || !noteSlug) location.href = "notes.html";

const article = document.getElementById("note-content");

fetch(`/notes/entries/${course}/${noteSlug}.md`)
    .then(r => r.text())
    .then(raw => {
        const { meta, body } = parseFrontMatter(raw);
        document.title = `${meta.title || noteSlug} – Notes`;

        const h1 = document.createElement("h1");
        h1.textContent = meta.title || noteSlug;
        article.appendChild(h1);

        const html = window.marked ? marked.parse(body) : body;
        article.insertAdjacentHTML("beforeend", html);

        if (window.MathJax) MathJax.typesetPromise?.([article]);
    })
    .catch(e => {
        console.error(e);
        article.innerHTML = "<h2>Note not found.</h2>";
    });
