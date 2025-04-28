fetch("projects/metadata.json")
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(projects => {
        const container = document.getElementById("projects-list");
        if (!container) {
            console.error("Error: 'projects-list' element not found in the DOM.");
            return;
        }
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