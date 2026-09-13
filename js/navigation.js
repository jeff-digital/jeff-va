(() => {
    const nav = document.getElementById("mainNav");
    const stickyClasses = [
        "fixed", "top-0", "left-0", "right-0", "z-50", "bg-[#1a2340]",
        "px-8", "py-3", "shadow-lg"
    ];
    let activeAnimationFrame = null;

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

        if (activeAnimationFrame !== null) {
            cancelAnimationFrame(activeAnimationFrame);
            activeAnimationFrame = null;
        }

        const targetTop = targetId === "#home"
            ? 0
            : Math.max(
                0,
                target.getBoundingClientRect().top + window.scrollY -
                (nav ? nav.offsetHeight : 0)
            );

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.scrollTo(0, targetTop);
        } else {
            const startTop = window.scrollY;
            const distance = targetTop - startTop;
            const duration = Math.min(
                1800,
                Math.max(900, Math.abs(distance) * 0.8)
            );
            const startTime = performance.now();

            function animateScroll(currentTime) {
                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );
                const easedProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                window.scrollTo(0, startTop + distance * easedProgress);

                if (progress < 1) {
                    activeAnimationFrame = requestAnimationFrame(animateScroll);
                } else {
                    activeAnimationFrame = null;
                }
            }

            activeAnimationFrame = requestAnimationFrame(animateScroll);
        }

        history.pushState(null, "", targetId);
    });

    lucide.createIcons();
})();
