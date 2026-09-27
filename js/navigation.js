(() => {
    const nav = document.getElementById("mainNav");
    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeaderState = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
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
        const target = targetId && targetId !== "#"
            ? document.querySelector(targetId)
            : null;

        if (!target) {
            return;
        }

        event.preventDefault();

        const targetTop = targetId === "#home"
            ? 0
            : Math.max(
                0,
                target.getBoundingClientRect().top + window.scrollY -
                (nav ? nav.offsetHeight : 0)
            );

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.scrollTo({ top: targetTop, behavior: "auto" });
        } else {
            window.scrollTo({ top: targetTop, behavior: "smooth" });
        }

        history.pushState(null, "", targetId);
    });
})();
