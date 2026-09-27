document.addEventListener("DOMContentLoaded", () => {
    const revealTargets = document.querySelectorAll("section:not(#home)");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealSection = (element) => {
        element.classList.add("show");
        observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealSection(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealTargets.forEach((element) => {
        if (!element.classList.contains("reveal")) {
            element.classList.add("reveal");
        }

        if (prefersReducedMotion) {
            element.classList.add("show");
            return;
        }

        observer.observe(element);
    });

    if (window.location.hash === "#projects") {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            requestAnimationFrame(() => {
                projectsSection.classList.add("show");
            });
        }
    }
});
