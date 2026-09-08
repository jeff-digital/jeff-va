(() => {
    const nav = document.getElementById("mainNav");
    const stickyClasses = [
        "fixed", "top-0", "left-0", "right-0", "z-50", "bg-[#1a2340]",
        "px-8", "py-3", "shadow-lg"
    ];

    if (nav) {
        window.addEventListener("scroll", () => {
            stickyClasses.forEach((className) => {
                nav.classList.toggle(className, window.scrollY > 100);
            });
        }, { passive: true });
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

        window.scrollTo({
            top: targetTop,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
        });

        history.pushState(null, "", targetId);
    });

    lucide.createIcons();
})();
