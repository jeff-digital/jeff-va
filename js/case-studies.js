(() => {
    const dialog = document.createElement("dialog");
    dialog.className = "case-study-dialog";
    dialog.id = "case-study-dialog";
    dialog.setAttribute("aria-labelledby", "case-study-dialog-title");

    const panel = document.createElement("div");
    panel.className = "case-study-dialog-panel";

    const header = document.createElement("div");
    header.className = "case-study-dialog-header";

    const title = document.createElement("h2");
    title.id = "case-study-dialog-title";

    const closeButton = document.createElement("button");
    closeButton.className = "case-study-dialog-close";
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.setAttribute("aria-label", "Close case study");

    const contentContainer = document.createElement("div");
    contentContainer.className = "case-study-dialog-body";
    header.append(title, closeButton);
    panel.append(header, contentContainer);
    dialog.append(panel);
    document.body.append(dialog);

    document.querySelectorAll(".case-study-summary").forEach((summary) => {
        summary.setAttribute("role", "button");
        summary.setAttribute("aria-haspopup", "dialog");
        summary.setAttribute("aria-controls", dialog.id);
    });

    let activeCaseStudy = null;
    let activeContent = null;
    let opener = null;
    let backgroundScrollState = null;

    const lockBackgroundScroll = () => {
        if (backgroundScrollState) {
            return;
        }

        const body = document.body;
        const scrollY = window.scrollY;

        backgroundScrollState = {
            scrollY,
            bodyStyle: body.style.cssText
        };

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
    };

    const unlockBackgroundScroll = () => {
        if (!backgroundScrollState) {
            return;
        }

        const { scrollY, bodyStyle } = backgroundScrollState;
        backgroundScrollState = null;
        document.body.style.cssText = bodyStyle;
        window.scrollTo(0, scrollY);
    };

    const openCaseStudy = (caseStudy, trigger) => {
        if (!(caseStudy instanceof HTMLDetailsElement) || !caseStudy.classList.contains("case-study-card")) {
            return;
        }

        const content = caseStudy.querySelector(".case-study-content");
        const heading = caseStudy.querySelector(".case-study-title");

        if (!content || !heading || dialog.open) {
            return;
        }

        activeCaseStudy = caseStudy;
        activeContent = content;
        opener = trigger;
        title.textContent = heading.textContent.trim();
        caseStudy.open = false;
        contentContainer.append(content);
        window.pausePortfolioVideos?.();
        lockBackgroundScroll();
        dialog.showModal();

        if (window.location.hash !== `#${caseStudy.id}`) {
            history.pushState(null, "", `#${caseStudy.id}`);
        }
    };

    const closeCaseStudy = () => {
        if (dialog.open) {
            dialog.close();
        }
    };

    closeButton.addEventListener("click", closeCaseStudy);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && dialog.open) {
            event.preventDefault();
            closeCaseStudy();
        }
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeCaseStudy();
        }
    });

    dialog.addEventListener("close", () => {
        unlockBackgroundScroll();
        window.resumePortfolioVideos?.();

        if (activeCaseStudy && activeContent) {
            activeCaseStudy.append(activeContent);
        }

        if (activeCaseStudy && window.location.hash === `#${activeCaseStudy.id}`) {
            history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }

        activeCaseStudy = null;
        activeContent = null;
        opener?.focus();
        opener = null;
    });

    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#case-study-"]');

        if (link) {
            const caseStudy = document.getElementById(link.hash.slice(1));

            if (caseStudy instanceof HTMLDetailsElement) {
                event.preventDefault();
                openCaseStudy(caseStudy, link);
            }

            return;
        }

        const summary = event.target.closest(".case-study-summary");

        if (summary) {
            event.preventDefault();
            openCaseStudy(summary.closest(".case-study-card"), summary);
        }
    });

    const openCaseStudyFromHash = () => {
        if (dialog.open) {
            if (activeCaseStudy && window.location.hash !== `#${activeCaseStudy.id}`) {
                closeCaseStudy();
            }

            return;
        }

        const caseStudy = document.getElementById(window.location.hash.slice(1));

        if (caseStudy instanceof HTMLDetailsElement && caseStudy.classList.contains("case-study-card")) {
            openCaseStudy(caseStudy, null);
        }
    };

    window.addEventListener("hashchange", openCaseStudyFromHash);
    window.addEventListener("popstate", openCaseStudyFromHash);
    openCaseStudyFromHash();
})();
