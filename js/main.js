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

        const getMaxTranslate = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

        const fadeVolume = (video, toVolume, duration = 180) => {
            if (!video) return;

            const startVolume = Number.isFinite(video.volume) ? video.volume : 0;
            const startTime = performance.now();

            const step = (timestamp) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                video.volume = startVolume + (toVolume - startVolume) * progress;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const activateVideo = (video) => {
            if (!video) return;

            video.preload = "auto";
            video.setAttribute("preload", "auto");
            if (video.readyState < 2) {
                video.load();
            }

            if (video.paused) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {});
                }
            }

            video.muted = false;
            video.volume = 1;
        };

        const deactivateVideo = (video) => {
            if (!video) return;

            if (!video.paused) {
                video.pause();
            }
            video.muted = true;
            video.volume = 0;
        };

        const syncVideoAudio = () => {
            const cards = Array.from(track.querySelectorAll(".video-carousel-card"));

            cards.forEach((card, index) => {
                const video = card.querySelector("video");
                const button = card.querySelector(".video-card-audio-toggle");
                const isActive = index === currentIndex;
                const title = card.querySelector("h4")?.textContent?.trim() || "Video";

                if (video) {
                    video.preload = "auto";
                    video.setAttribute("preload", "auto");

                    if (isActive) {
                        activateVideo(video);
                    } else {
                        deactivateVideo(video);
                    }
                }

                if (button) {
                    const icon = button.querySelector("i");
                    const isMuted = !isActive;
                    button.classList.toggle("muted", isMuted);
                    button.setAttribute("aria-label", isMuted ? `Unmute ${title}` : `Mute ${title}`);
                    if (icon) {
                        icon.className = isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
                    }
                }
            });
        };

        const activateCurrentCardAudio = () => {
            const activeVideo = track.querySelectorAll(".video-carousel-card")[currentIndex]?.querySelector("video");
            if (!activeVideo) return;

            activateVideo(activeVideo);
        };

        const updatePosition = (index) => {
            currentIndex = clampIndex(index);
            const activeCard = track.querySelectorAll(".video-carousel-card")[currentIndex];
            const cardOffset = activeCard ? activeCard.offsetLeft : 0;
            const maxTranslate = getMaxTranslate();
            const move = Math.min(cardOffset, maxTranslate);
            track.style.transform = `translateX(-${move}px)`;
            syncVideoAudio();
            requestAnimationFrame(() => activateCurrentCardAudio());
        };

        Array.from(track.querySelectorAll(".video-carousel-card")).forEach((card) => {
            const visual = card.querySelector(".project-marquee-visual");
            const video = card.querySelector("video");

            if (!visual || !video) return;

            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "video-card-audio-toggle muted";
            toggleButton.setAttribute("aria-label", "Unmute video");
            toggleButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();
                const cardIndex = Array.from(track.children).indexOf(card);
                updatePosition(cardIndex);
            });

            card.addEventListener("click", () => {
                const cardIndex = Array.from(track.children).indexOf(card);
                updatePosition(cardIndex);
                activateCurrentCardAudio();
            });

            visual.appendChild(toggleButton);
            video.preload = "auto";
            video.setAttribute("preload", "auto");
            video.muted = true;
            video.volume = 0;
            video.playsInline = true;
            video.load();
        });

        prevBtn.addEventListener("click", () => {
            updatePosition(currentIndex - 1);
            activateCurrentCardAudio();
        });
        nextBtn.addEventListener("click", () => {
            updatePosition(currentIndex + 1);
            activateCurrentCardAudio();
        });

        viewport.addEventListener("pointerdown", (event) => {
            isDragging = true;
            startX = event.clientX;
            lastPointerX = event.clientX;
            startScroll = currentIndex * getCardWidth();
            viewport.classList.add("dragging");
            viewport.setPointerCapture(event.pointerId);
            activateCurrentCardAudio();
        });

        viewport.addEventListener("pointermove", (event) => {
            if (!isDragging) return;
            lastPointerX = event.clientX;
            const delta = event.clientX - startX;
            const cardWidth = getCardWidth();
            const pull = Math.min(Math.max(delta * 0.9, -cardWidth * 1.4), cardWidth * 1.4);
            const targetMove = Math.min(Math.max(startScroll - pull, 0), getMaxTranslate());
            track.style.transform = `translateX(-${targetMove}px)`;
        });

        const finishDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove("dragging");
            const delta = lastPointerX - startX;
            const cardWidth = getCardWidth();
            const threshold = cardWidth * 0.2;
            const direction = (delta < -threshold) ? 1 : (delta > threshold) ? -1 : 0;
            if (direction !== 0) {
                updatePosition(currentIndex + direction);
            } else {
                updatePosition(currentIndex);
            }
            requestAnimationFrame(() => activateCurrentCardAudio());
        };

        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    Array.from(track.querySelectorAll("video")).forEach((video) => {
                        video.pause();
                        video.muted = true;
                        video.volume = 0;
                    });
                    return;
                }

                document.querySelectorAll("video").forEach((video) => {
                    const owner = video.closest("[data-carousel]") || video.closest("[data-project-marquee-carousel]");
                    const isThisSection = owner === carousel;

                    if (isThisSection) {
                        if (video.closest(".video-carousel-card") && video.closest(".video-carousel-card") !== track.querySelectorAll(".video-carousel-card")[currentIndex]) {
                            deactivateVideo(video);
                            return;
                        }

                        activateVideo(video);
                    } else {
                        deactivateVideo(video);
                    }
                });

                syncVideoAudio();
            });
        }, {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        });

        visibilityObserver.observe(viewport);

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
        let activeAiIndex = 0;

        const activateAiPromptCard = (index) => {
            const cards = Array.from(carousel.querySelectorAll(".project-marquee-card"));
            const nextIndex = Math.min(Math.max(index, 0), Math.max(cards.length - 1, 0));
            activeAiIndex = nextIndex;

            cards.forEach((card, cardIndex) => {
                const video = card.querySelector("video");
                if (!video) return;

                if (cardIndex === activeAiIndex) {
                    video.preload = "auto";
                    video.setAttribute("preload", "auto");
                    video.playsInline = true;
                    video.loop = true;
                    video.muted = true;
                    video.volume = 0;

                    if (video.readyState < 2) {
                        video.load();
                    }

                    if (video.paused) {
                        const playPromise = video.play();
                        if (playPromise && typeof playPromise.catch === "function") {
                            playPromise.catch(() => {});
                        }
                    }
                    return;
                }

                if (!video.paused) {
                    video.pause();
                }
                video.muted = true;
                video.volume = 0;
            });
        };

        const activateAiPromptVideos = () => {
            activateAiPromptCard(activeAiIndex);
        };

        const pauseHiddenVideos = () => {
            const videos = Array.from(viewport.querySelectorAll("video"));
            videos.forEach((video) => {
                if (!video.paused) {
                    video.pause();
                }
                video.muted = true;
                video.volume = 0;
            });
        };

        const isCarouselVisible = () => {
            const rect = carousel.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
        };

        const syncAiPromptState = () => {
            const hasActiveVideoEditing = Array.from(document.querySelectorAll("[data-carousel]")).some((videoCarousel) => {
                const viewport = videoCarousel.querySelector(".video-carousel-viewport");
                if (!viewport) return false;

                const rect = viewport.getBoundingClientRect();
                return rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
            });

            if (hasActiveVideoEditing) {
                Array.from(carousel.querySelectorAll("video")).forEach((video) => {
                    if (!video.paused) {
                        video.pause();
                    }
                    video.muted = true;
                    video.volume = 0;
                });
                return;
            }

            const shouldPlay = isCarouselVisible();

            document.querySelectorAll("video").forEach((video) => {
                const owner = video.closest("[data-project-marquee-carousel]") || video.closest("[data-carousel]");
                const isThisSection = owner === carousel;
                const isVideoEditing = Boolean(video.closest("[data-carousel]"));

                if (isThisSection && !isVideoEditing) {
                    video.muted = true;
                    video.volume = 0;
                    if (shouldPlay && video.paused) {
                        const playPromise = video.play();
                        if (playPromise && typeof playPromise.catch === "function") {
                            playPromise.catch(() => {});
                        }
                    }
                    if (!shouldPlay && !video.paused) {
                        video.pause();
                    }
                    return;
                }

                if (!video.paused) {
                    video.pause();
                }
                video.muted = true;
                video.volume = 0;
            });
        };

        const visibilityObserver = new IntersectionObserver((entries) => {
            const isVisible = entries.some((entry) => entry.isIntersecting);

            if (!isVisible) {
                pauseHiddenVideos();
                return;
            }

            syncAiPromptState();
            requestAnimationFrame(activateAiPromptVideos);
        }, {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        });

        Array.from(carousel.querySelectorAll(".project-marquee-card")).forEach((card, index) => {
            const video = card.querySelector("video");
            if (video) {
                card.addEventListener("click", () => {
                    activateAiPromptCard(index);
                });
            }
        });

        visibilityObserver.observe(viewport);
        syncAiPromptState();
        requestAnimationFrame(activateAiPromptVideos);
        window.addEventListener("scroll", syncAiPromptState, { passive: true });
        window.addEventListener("resize", syncAiPromptState);
        window.addEventListener("load", () => requestAnimationFrame(activateAiPromptVideos), { once: true });
        window.addEventListener("pageshow", () => requestAnimationFrame(activateAiPromptVideos), { once: true });

        previousButton.addEventListener("click", () => {
            activeAiIndex = Math.max(activeAiIndex - 1, 0);
            viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
            activateAiPromptVideos();
        });
        nextButton.addEventListener("click", () => {
            const maxIndex = Math.max(Array.from(carousel.querySelectorAll(".project-marquee-card")).length - 1, 0);
            activeAiIndex = Math.min(activeAiIndex + 1, maxIndex);
            viewport.scrollBy({ left: getStep(), behavior: "smooth" });
            activateAiPromptVideos();
        });
    });
});
