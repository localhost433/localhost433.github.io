function loadHeaderFooter() {
    return Promise.all([
        fetch("/components/header.html")
            .then(response => response.text())
            .then(data => document.getElementById("header-placeholder").innerHTML = data),
        fetch("/components/footer.html")
            .then(response => response.text())
            .then(data => document.getElementById("footer-placeholder").innerHTML = data)
    ]);
}

// After header and footer are loaded, then init dark mode
document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter().then(() => {
        initializeThemeToggle(); // <-- call dark mode setup AFTER loading header/footer
    });
});
