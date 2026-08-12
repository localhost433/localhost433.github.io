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
    const title = course ? course.title : slug;
    const pageMeta = {
      title: `${title} - Robin's Notes`,
      description: course
        ? `${course.semester} course notes for ${course.title}, taught by ${course.instructor}.`
        : `Course notes for ${title}.`
    };
    if (window.updatePageMeta) {
      window.updatePageMeta(pageMeta);
    } else {
      window.pendingPageMeta = pageMeta;
    }
  });

fetch(`/notes/courses/${slug}/index.json`)
  .then(r => r.json())
  .then(notes => {
    if (!notes.length) {
      listEl.innerHTML = "<p>No notes yet.</p>";
      return;
    }

    notes.forEach(n => {
      // A section header, not a note: { "group": "C++" }.
      if (n.group) {
        const h = document.createElement("h2");
        h.className = "note-group";
        h.textContent = n.group;
        listEl.appendChild(h);
        return;
      }

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
