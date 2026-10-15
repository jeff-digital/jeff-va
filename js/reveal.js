document.addEventListener("DOMContentLoaded", () => {
    const revealTargets = document.querySelectorAll("section.reveal:not(#home)");

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
            threshold: 0,
            rootMargin: "120px 0px"
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

    if (window.location.hash === "#featured-case-studies") {
        const featuredCaseStudies = document.getElementById("featured-case-studies");
        if (featuredCaseStudies) {
            requestAnimationFrame(() => featuredCaseStudies.classList.add("show"));
        }
    }
});
