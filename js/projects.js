fetch("projects/metadata.json")
    .then(res => res.json())
    .then(projects => {
        const container = document.getElementById("projects-list");
        projects.forEach(project => {
            const entry = document.createElement("div");
            entry.className = "post-entry";

            const title = document.createElement("a");
            title.href = project.link;
            title.target = "_blank";
            title.textContent = project.title;
            title.className = "post-title";

            const meta = document.createElement("div");
            meta.className = "post-meta-inline";
            meta.textContent = project.tech || "";

            entry.appendChild(title);
            entry.appendChild(meta);

            container.appendChild(entry);
        });
    })
    .catch(error => {
        console.error("Error loading projects:", error);
    });