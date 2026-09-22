document.addEventListener("DOMContentLoaded", () => {

    const revealTargets = document.querySelectorAll("section:not(#home)");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealTargets.forEach((element) => {
        if (!element.classList.contains("reveal")) {
            element.classList.add("reveal");
        }
        observer.observe(element);
    });

    if (window.location.hash === "#projects") {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            projectsSection.classList.add("show");
        }
    }

});
