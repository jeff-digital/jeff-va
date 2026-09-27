document.addEventListener("DOMContentLoaded", () => {
    const whatsappModal = document.getElementById("whatsappQrModal");
    const whatsappTriggers = document.querySelectorAll(".whatsapp-qr-trigger");
    const closeWhatsAppButtons = document.querySelectorAll(".whatsapp-qr-close");
    const whatsappQrDownloadButton = document.getElementById("downloadWhatsAppQr");

    if (whatsappModal) {
        const closeWhatsAppModal = () => {
            whatsappModal.classList.add("hidden");
            whatsappModal.classList.remove("flex");
            whatsappModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("overflow-hidden");
        };

        const openWhatsAppModal = (event) => {
            event.preventDefault();
            whatsappModal.classList.remove("hidden");
            whatsappModal.classList.add("flex");
            whatsappModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("overflow-hidden");
        };

        whatsappTriggers.forEach((trigger) => {
            trigger.addEventListener("click", openWhatsAppModal);
        });

        closeWhatsAppButtons.forEach((button) => {
            button.addEventListener("click", closeWhatsAppModal);
        });

        whatsappModal.addEventListener("click", (event) => {
            if (event.target === whatsappModal) {
                closeWhatsAppModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !whatsappModal.classList.contains("hidden")) {
                closeWhatsAppModal();
            }
        });
    }

    if (whatsappQrDownloadButton) {
        whatsappQrDownloadButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const qrUrl = whatsappQrDownloadButton.dataset.qrUrl;
            if (!qrUrl) {
                window.location.href = whatsappQrDownloadButton.href;
                return;
            }

            try {
                const response = await fetch(qrUrl);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = objectUrl;
                link.download = "jeffrey-whatsapp-qr-code.png";
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(objectUrl);
            } catch (error) {
                window.location.href = qrUrl;
            }
        });
    }

    const resumeModal = document.getElementById("resumeModal");
    const resumeTriggers = document.querySelectorAll(".resume-modal-trigger");
    const closeResumeButtons = document.querySelectorAll(".resume-modal-close");

    if (resumeModal) {
        const closeResumeModal = () => {
            resumeModal.classList.add("hidden");
            resumeModal.classList.remove("flex");
            resumeModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("overflow-hidden");
        };

        const openResumeModal = () => {
            resumeModal.classList.remove("hidden");
            resumeModal.classList.add("flex");
            resumeModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("overflow-hidden");
        };

        resumeTriggers.forEach((trigger) => {
            trigger.addEventListener("click", openResumeModal);
        });

        closeResumeButtons.forEach((button) => {
            button.addEventListener("click", closeResumeModal);
        });

        resumeModal.addEventListener("click", (event) => {
            if (event.target === resumeModal) {
                closeResumeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !resumeModal.classList.contains("hidden")) {
                closeResumeModal();
            }
        });
    }
});

const aboutGrid = document.querySelector('#about > div > div.grid');
const aboutLeftColumn = aboutGrid?.children[0];
const aboutRightColumn = aboutGrid?.children[1];
const servicesBlock = aboutLeftColumn?.querySelector('.mt-9');
const credentialsBlock = aboutRightColumn?.querySelector('.mt-8');

if (aboutLeftColumn && aboutRightColumn && servicesBlock && credentialsBlock) {
    const softwareBlocks = Array.from(aboutRightColumn.children)
        .filter((child) => child !== credentialsBlock);

    softwareBlocks.forEach((block) => aboutLeftColumn.insertBefore(block, servicesBlock));
    aboutRightColumn.insertBefore(servicesBlock, credentialsBlock);
}

document.addEventListener("DOMContentLoaded", () => {
    const videoCarousels = document.querySelectorAll("[data-carousel]");

    videoCarousels.forEach((carousel) => {
        const viewport = carousel.querySelector(".video-carousel-viewport");
        const track = carousel.querySelector(".video-carousel-track");
        const prevBtn = carousel.parentElement.querySelector("[data-direction='prev']");
        const nextBtn = carousel.parentElement.querySelector("[data-direction='next']");

        if (!viewport || !track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        let startX = 0;
        let lastPointerX = 0;
        let startScroll = 0;
        let isDragging = false;

        const getCardWidth = () => {
            const firstCard = track.querySelector(".video-carousel-card");
            return firstCard ? firstCard.getBoundingClientRect().width + 16 : 320;
        };

        const clampIndex = (value) => {
            const maxIndex = Math.max(track.children.length - 1, 0);
            return Math.min(Math.max(value, 0), maxIndex);
        };

        const updatePosition = (index) => {
            const cardWidth = getCardWidth();
            currentIndex = clampIndex(index);
            const move = currentIndex * cardWidth;
            track.style.transform = `translateX(-${move}px)`;
        };

        prevBtn.addEventListener("click", () => updatePosition(currentIndex - 1));
        nextBtn.addEventListener("click", () => updatePosition(currentIndex + 1));

        viewport.addEventListener("pointerdown", (event) => {
            isDragging = true;
            startX = event.clientX;
            lastPointerX = event.clientX;
            startScroll = currentIndex * getCardWidth();
            viewport.classList.add("dragging");
            viewport.setPointerCapture(event.pointerId);
        });

        viewport.addEventListener("pointermove", (event) => {
            if (!isDragging) return;
            lastPointerX = event.clientX;
            const delta = event.clientX - startX;
            const cardWidth = getCardWidth();
            const pull = Math.min(Math.max(delta * 0.9, -cardWidth * 1.4), cardWidth * 1.4);
            const targetMove = startScroll - pull;
            track.style.transform = `translateX(-${targetMove}px)`;
        });

        const finishDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove("dragging");
            const delta = lastPointerX - startX;
            const cardWidth = getCardWidth();
            const threshold = cardWidth * 0.2;
            const direction = (delta > threshold) ? 1 : (delta < -threshold) ? -1 : 0;
            if (direction !== 0) {
                updatePosition(currentIndex + direction);
            } else {
                updatePosition(currentIndex);
            }
        };

        viewport.addEventListener("pointerup", finishDrag);
        viewport.addEventListener("pointerleave", finishDrag);
        viewport.addEventListener("pointercancel", finishDrag);
        updatePosition(0);
    });

    document.querySelectorAll("[data-project-marquee-carousel]").forEach((carousel) => {
        const viewport = carousel.querySelector("[data-project-marquee]");
        const previousButton = carousel.querySelector("[data-marquee-direction='prev']");
        const nextButton = carousel.querySelector("[data-marquee-direction='next']");
        const firstCard = viewport?.querySelector(".project-marquee-card");

        if (!viewport || !previousButton || !nextButton || !firstCard) return;

        const getStep = () => firstCard.getBoundingClientRect().width + 16;

        previousButton.addEventListener("click", () => {
            viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
        });
        nextButton.addEventListener("click", () => {
            viewport.scrollBy({ left: getStep(), behavior: "smooth" });
        });
    });
});
