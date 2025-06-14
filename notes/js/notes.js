/* notes.js - courses list */

const listEl = document.getElementById("courses-list");

fetch("/notes/metadata/courses.json")
  .then(r => r.json())
  .then(courses => {
    if (!courses.length) {
      listEl.innerHTML = "<p>No courses yet.</p>";
      return;
    }

    courses.forEach(c => {
      const div = document.createElement("div");
      div.className = "course-entry";

      const link = document.createElement("a");
      link.href = `course.html?id=${encodeURIComponent(c.slug)}`;
      link.textContent = c.title;
      link.className = "course-title";

      const meta = document.createElement("div");
      meta.className = "course-meta";
      meta.textContent = `${c.semester || ""}${c.instructor ? " - " + c.instructor : ""}`;

      div.append(link, meta);
      listEl.appendChild(div);
    });
  })
  .catch(e => {
    console.error("Could not load courses.json", e);
    listEl.innerHTML = "<p>Failed to load courses.</p>";
  });
