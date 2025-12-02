/* course.js - course page*/

const params = new URLSearchParams(location.search);
const slug = params.get("id");
if (!slug) location.href = "notes.html";

const listEl = document.getElementById("notes-list");
const heading = document.getElementById("course-title");

fetch(`/notes/metadata/courses.json`)
  .then(r => r.json())
  .then(all => {
    const course = all.find(c => c.slug === slug);
    heading.textContent = course ? course.title : slug;
  });

fetch(`/notes/courses/${slug}/index.json`)
  .then(r => r.json())
  .then(notes => {
    if (!notes.length) {
      listEl.innerHTML = "<p>No notes yet.</p>";
      return;
    }

    notes.forEach(n => {
      const div = document.createElement("div");
      div.className = "note-entry";

      const link = document.createElement("a");
      link.href = `note.html?course=${slug}&note=${n.slug}`;
      link.textContent = n.title;
      link.className = "note-title";

      const date = document.createElement("div");
      date.className = "note-date";
      date.textContent = n.date || "";

      div.append(link, date);
      listEl.appendChild(div);
    });
  })
  .catch(e => {
    console.error(e);
    listEl.innerHTML = "<p>Notes are unavailable at the moment, they might not be uploaded yet.</p>";
  });