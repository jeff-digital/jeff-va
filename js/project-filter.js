document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = Array.from(
        document.querySelectorAll("[data-project-filter]")
    );
    const projectPanels = Array.from(document.querySelectorAll("[data-project-panel]"));
    const toolButtons = Array.from(document.querySelectorAll("[data-tool-filter]"));
    const toolPanels = Array.from(document.querySelectorAll("[data-tool-panel]"));

    function showToolCategory(category) {
        toolPanels.forEach((panel) => {
            const isSelected = panel.dataset.toolPanel === category;
            panel.classList.toggle("hidden", !isSelected);
        });

        toolButtons.forEach((button) => {
            const isSelected = button.dataset.toolFilter === category;
            button.classList.toggle("bg-[#1a2340]", isSelected);
            button.classList.toggle("text-white", isSelected);
            button.classList.toggle("border-[#1a2340]", isSelected);
            button.classList.toggle("bg-white", !isSelected);
            button.classList.toggle("text-[#1a2340]", !isSelected);
            button.classList.toggle("border-gray-200", !isSelected);
        });
    }

    if (toolButtons.length && toolPanels.length) {
        toolButtons.forEach((button) => {
            button.addEventListener("click", () => {
                showToolCategory(button.dataset.toolFilter);
            });
        });

        showToolCategory("essential-tools");
    }

    const projectOrder = ["administration", "website", "technical"];
    const projectContainer = projectPanels[0]?.parentElement;
    let activeProjectCategory = "administration";

    if (projectContainer) {
        projectOrder.forEach((category) => {
            const panel = projectPanels.find(
                (projectPanel) => projectPanel.dataset.projectPanel === category
            );

            if (panel) {
                projectContainer.appendChild(panel);
            }
        });
    }

    if (!filterButtons.length || !projectPanels.length) {
        return;
    }

    const websitePanel = document.querySelector('[data-project-panel="website"]');

    if (websitePanel) {
        const projectCards = Array.from(websitePanel.querySelectorAll(":scope > .grid > .group"));

        projectCards.sort((firstCard, secondCard) => {
            const firstIsClient = firstCard.textContent.includes("Client Project");
            const secondIsClient = secondCard.textContent.includes("Client Project");

            return Number(secondIsClient) - Number(firstIsClient);
        });

        const projectGrid = websitePanel.querySelector(":scope > .grid");
        projectCards.forEach((card) => projectGrid.appendChild(card));
    }

    function showProjectCategory(category, shouldAnimate = true) {
        const currentIndex = projectOrder.indexOf(activeProjectCategory);
        const nextIndex = projectOrder.indexOf(category);
        const slideClass = nextIndex > currentIndex
            ? "project-panel-slide-from-right"
            : "project-panel-slide-from-left";

        projectPanels.forEach((panel) => {
            const isSelected = panel.dataset.projectPanel === category;

            panel.classList.toggle("hidden", !isSelected);
            panel.setAttribute("aria-hidden", String(!isSelected));

            if (isSelected && shouldAnimate && category !== activeProjectCategory) {
                panel.classList.remove(
                    "project-panel-slide-from-right",
                    "project-panel-slide-from-left"
                );
                void panel.offsetWidth;
                panel.classList.add(slideClass);
            }
        });

        filterButtons.forEach((button) => {
            const isSelected = button.dataset.projectFilter === category;

            button.setAttribute("aria-selected", String(isSelected));
            button.tabIndex = isSelected ? 0 : -1;
            button.classList.toggle("bg-[#1a2340]", isSelected);
            button.classList.toggle("text-white", isSelected);
            button.classList.toggle("border-[#1a2340]", isSelected);
            button.classList.toggle("bg-white", !isSelected);
            button.classList.toggle("text-[#1a2340]", !isSelected);
            button.classList.toggle("border-gray-300", !isSelected);
        });

        activeProjectCategory = category;
    }

    filterButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            showProjectCategory(button.dataset.projectFilter);
        });

        button.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                return;
            }

            event.preventDefault();

            let nextIndex = index;

            if (event.key === "ArrowLeft") {
                nextIndex = (index - 1 + filterButtons.length) % filterButtons.length;
            } else if (event.key === "ArrowRight") {
                nextIndex = (index + 1) % filterButtons.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = filterButtons.length - 1;
            }

            const nextButton = filterButtons[nextIndex];
            showProjectCategory(nextButton.dataset.projectFilter);
            nextButton.focus();
        });
    });

    showProjectCategory("administration", false);
});
