(() => {
    const nav = document.getElementById("mainNav");
    const header = document.querySelector(".site-header");

    if (header) {
        let wasScrolled;
        const updateHeaderState = () => {
            const isScrolled = window.scrollY > 12;
            if (isScrolled === wasScrolled) return;
            wasScrolled = isScrolled;
            header.classList.toggle("is-scrolled", isScrolled);
        };

        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });
    }

    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]');

        if (
            !link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey
        ) {
            return;
        }

        const targetId = link.getAttribute("href");
        // Dialog links are handled exclusively by case-studies.js.
        if (targetId?.startsWith("#case-study-")) return;
        const target = targetId && targetId !== "#"
            ? document.getElementById(targetId.slice(1))
            : null;

        if (!target) {
            return;
        }

        event.preventDefault();

        target.classList.add("show");
        const targetTop = targetId === "#home"
            ? 0
            : Math.max(
                0,
                target.getBoundingClientRect().top + window.scrollY -
                (header ? header.offsetHeight : (nav ? nav.offsetHeight : 0))
            );

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.scrollTo({ top: targetTop, behavior: "auto" });
        } else {
            window.scrollTo({ top: targetTop, behavior: "smooth" });
        }

        history.pushState(null, "", targetId);
    });
})();
