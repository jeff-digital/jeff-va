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
            window.resumePortfolioVideos?.();
        };

        const openWhatsAppModal = (event) => {
            event.preventDefault();
            window.pausePortfolioVideos?.();
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
            window.resumePortfolioVideos?.();
        };

        const openResumeModal = () => {
            window.pausePortfolioVideos?.();
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

const initializeVideoCarousels = () => {
    const videoCarousels = document.querySelectorAll("[data-carousel]");

    videoCarousels.forEach((carousel) => {
        const viewport = carousel.querySelector(".video-carousel-viewport");
        const track = carousel.querySelector(".video-carousel-track");
        const prevBtn = carousel.parentElement.querySelector("[data-direction='prev']");
        const nextBtn = carousel.parentElement.querySelector("[data-direction='next']");

        if (!viewport || !track || !prevBtn || !nextBtn) return;

        const controls = prevBtn.closest(".video-carousel-controls");
        const videoCards = Array.from(track.querySelectorAll(".video-carousel-card"));
        const videos = videoCards.map((card) => card.querySelector("video")).filter(Boolean);
        let currentIndex = 0;
        let isCarouselVisible = false;

        const clampIndex = (value) => {
            const maxIndex = Math.max(track.children.length - 1, 0);
            return Math.min(Math.max(value, 0), maxIndex);
        };

        const getMaxTranslate = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

        const syncCarouselControls = () => {
            const canScroll = getMaxTranslate() > 1;
            if (controls) controls.hidden = !canScroll;
            prevBtn.disabled = !canScroll;
            nextBtn.disabled = !canScroll;
        };

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

            if (!isCarouselVisible || hasOpenPortfolioModal() || document.body.classList.contains("overflow-hidden")) {
                deactivateVideo(video);
                return;
            }

            portfolioVideos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    deactivateVideo(otherVideo);
                }
            });

            video.autoplay = false;
            video.removeAttribute("autoplay");
            video.preload = "metadata";
            video.setAttribute("preload", "metadata");

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
            video.preload = "none";
            video.setAttribute("preload", "none");
            video.muted = true;
            video.volume = 0;
        };

        const syncVideoAudio = () => {
            videoCards.forEach((card, index) => {
                const video = card.querySelector("video");
                const playToggle = card.querySelector(".video-card-play-toggle");
                const button = card.querySelector(".video-card-audio-toggle");
                const isActive = index === currentIndex;
                const title = card.querySelector("h4")?.textContent?.trim() || "Video";
                const isUserPaused = card.dataset.userPaused === "true";
                if (video) {
                    if (isActive && !isUserPaused && isCarouselVisible) {
                        activateVideo(video);
                    } else {
                        video.preload = "none";
                        video.setAttribute("preload", "none");
                        deactivateVideo(video);
                    }
                }

                if (playToggle) {
                    const icon = playToggle.querySelector("i");
                    const isPlaying = !!video && isActive && !video.paused && !isUserPaused;
                    playToggle.classList.toggle("is-playing", isPlaying);
                    playToggle.setAttribute("aria-label", isPlaying ? `Pause ${title}` : `Play ${title}`);
                    if (icon) {
                        icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
                    }
                }

                if (button) {
                    const icon = button.querySelector("i");
                    const isMuted = !isActive || video?.muted;
                    button.classList.toggle("muted", isMuted);
                    button.setAttribute("aria-label", isMuted ? `Unmute ${title}` : `Mute ${title}`);
                    if (icon) {
                        icon.className = isMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
                    }
                }
            });
        };

        const activateCurrentCardAudio = () => {
            const activeCard = videoCards[currentIndex];
            const activeVideo = activeCard?.querySelector("video");
            if (!activeVideo) return;

            if (activeCard?.dataset.userPaused !== "true") {
                activateVideo(activeVideo);
            }
        };

        const updatePosition = (index) => {
            currentIndex = clampIndex(index);
            const activeCard = videoCards[currentIndex];
            const cardOffset = activeCard ? activeCard.offsetLeft : 0;
            const maxTranslate = getMaxTranslate();
            const move = Math.min(cardOffset, maxTranslate);
            track.style.transform = `translateX(-${move}px)`;
            syncCarouselControls();
            syncVideoAudio();
        };

        videoCards.forEach((card) => {
            const visual = card.querySelector(".project-marquee-visual");
            const video = card.querySelector("video");

            if (!visual || !video) return;

            card.dataset.userPaused = "true";

            const playToggleButton = document.createElement("button");
            playToggleButton.type = "button";
            playToggleButton.className = "video-card-play-toggle";
            playToggleButton.setAttribute("aria-label", "Play video");
            playToggleButton.innerHTML = '<i class="fa-solid fa-play"></i>';
            playToggleButton.addEventListener("click", (event) => {
                event.stopPropagation();

                const cardIndex = videoCards.indexOf(card);
                if (cardIndex !== currentIndex) {
                    updatePosition(cardIndex);
                }

                const activeCard = videoCards[currentIndex];
                const activeVideo = activeCard?.querySelector("video");
                if (!activeVideo) return;

                const shouldPlay = activeVideo.paused;
                videoCards.forEach((item) => {
                    const itemVideo = item.querySelector("video");
                    if (item === activeCard) {
                        item.dataset.userPaused = shouldPlay ? "false" : "true";
                    } else {
                        item.dataset.userPaused = "true";
                        if (itemVideo && !itemVideo.paused) {
                            itemVideo.pause();
                        }
                    }
                });

                if (shouldPlay) {
                    activateVideo(activeVideo);
                } else {
                    if (!activeVideo.paused) {
                        activeVideo.pause();
                    }
                }

                syncVideoAudio();
            });

            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "video-card-audio-toggle muted";
            toggleButton.setAttribute("aria-label", "Unmute video");
            toggleButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();
                const cardIndex = videoCards.indexOf(card);
                updatePosition(cardIndex);

                const activeVideo = videoCards[cardIndex]?.querySelector("video");
                if (!activeVideo) return;

                const isMuted = activeVideo.muted;
                activeVideo.muted = !isMuted;
                activeVideo.volume = activeVideo.muted ? 0 : 1;
                syncVideoAudio();
            });

            card.addEventListener("click", () => {
                const cardIndex = videoCards.indexOf(card);
                updatePosition(cardIndex);

                const activeCard = videoCards[currentIndex];
                const activeVideo = activeCard?.querySelector("video");
                if (!activeVideo) return;

                videoCards.forEach((item) => {
                    const itemVideo = item.querySelector("video");
                    if (item === activeCard) {
                        item.dataset.userPaused = "false";
                    } else {
                        item.dataset.userPaused = "true";
                        if (itemVideo && !itemVideo.paused) {
                            itemVideo.pause();
                        }
                    }
                });

                activateVideo(activeVideo);
                syncVideoAudio();
            });

            visual.appendChild(playToggleButton);
            visual.appendChild(toggleButton);
            video.autoplay = false;
            video.removeAttribute("autoplay");
            video.preload = "none";
            video.setAttribute("preload", "none");
            video.muted = true;
            video.volume = 0;
            video.playsInline = true;
        });

        prevBtn.addEventListener("click", () => {
            updatePosition(currentIndex - 1);
        });
        nextBtn.addEventListener("click", () => {
            updatePosition(currentIndex + 1);
        });

        let touchStartX = 0;
        let touchPointerId = null;
        let suppressClickUntil = 0;

        viewport.addEventListener("pointerdown", (event) => {
            if (event.pointerType !== "touch" || !event.isPrimary || event.target.closest("button")) return;

            touchPointerId = event.pointerId;
            touchStartX = event.clientX;
            viewport.setPointerCapture(event.pointerId);
        });

        viewport.addEventListener("pointerup", (event) => {
            if (event.pointerId !== touchPointerId) return;

            const deltaX = event.clientX - touchStartX;
            touchPointerId = null;

            if (Math.abs(deltaX) < Math.max(40, viewport.clientWidth * 0.12)) return;

            suppressClickUntil = Date.now() + 500;
            updatePosition(currentIndex + (deltaX < 0 ? 1 : -1));
        });

        viewport.addEventListener("pointercancel", () => {
            touchPointerId = null;
        });

        viewport.addEventListener("click", (event) => {
            if (Date.now() >= suppressClickUntil) return;

            event.preventDefault();
            event.stopPropagation();
            suppressClickUntil = 0;
        }, true);

        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isCarouselVisible = entry.isIntersecting;
                if (!entry.isIntersecting) {
                    videos.forEach(deactivateVideo);
                    visibleVideoCarousels.delete(carousel);
                    window.dispatchEvent(new Event("portfolio:video-carousel-visibility-changed"));
                    return;
                }

                visibleVideoCarousels.add(carousel);
                syncVideoAudio();
                window.dispatchEvent(new Event("portfolio:video-carousel-visibility-changed"));
            });
        }, {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        });

        visibilityObserver.observe(viewport);
        window.addEventListener("portfolio:modal-closed", () => {
            if (isCarouselVisible) syncVideoAudio();
        });

        updatePosition(0);
        const resizeObserver = new ResizeObserver(() => updatePosition(currentIndex));
        resizeObserver.observe(viewport);
        resizeObserver.observe(track);
        window.addEventListener("resize", () => updatePosition(currentIndex));
    });
};

const initializeAiPromptCarousels = () => {
    document.querySelectorAll("[data-project-marquee-carousel]").forEach((carousel) => {
        const viewport = carousel.querySelector("[data-project-marquee]");
        const previousButton = carousel.querySelector("[data-marquee-direction='prev']");
        const nextButton = carousel.querySelector("[data-marquee-direction='next']");
        const cards = Array.from(carousel.querySelectorAll(".project-marquee-card"));

        if (!viewport || !previousButton || !nextButton || cards.length === 0) return;

        const getStep = () => cards[0].getBoundingClientRect().width + 16;
        const aiVideos = cards.map((card) => card.querySelector("video")).filter(Boolean);
        const cardVisibility = new Map(cards.map((card, index) => [index, 0]));
        let activeAiIndex = 0;
        let visibleAiIndex = -1;
        let isCarouselVisible = false;

        const syncAiPromptVideos = () => {
            aiVideos.forEach((video) => {
                const cardIndex = cards.findIndex((card) => card.contains(video));
                const isActive = cardIndex === activeAiIndex &&
                    cardIndex === visibleAiIndex &&
                    isCarouselVisible &&
                    visibleVideoCarousels.size === 0 &&
                    !hasOpenPortfolioModal() &&
                    !document.body.classList.contains("overflow-hidden");

                if (isActive) {
                    portfolioVideos.forEach((otherVideo) => {
                        if (otherVideo !== video) {
                            otherVideo.pause();
                            otherVideo.preload = "none";
                            otherVideo.setAttribute("preload", "none");
                            otherVideo.muted = true;
                            otherVideo.volume = 0;
                        }
                    });
                    video.preload = "metadata";
                    video.setAttribute("preload", "metadata");
                    video.playsInline = true;
                    video.loop = true;
                    video.muted = true;
                    video.volume = 0;

                    if (video.paused) {
                        const playPromise = video.play();
                        if (playPromise && typeof playPromise.catch === "function") {
                            playPromise.catch(() => {});
                        }
                    }
                } else {
                    video.preload = "none";
                    video.setAttribute("preload", "none");
                    if (!video.paused) video.pause();
                    video.muted = true;
                    video.volume = 0;
                }
            });
        };

        const activateAiPromptCard = (index) => {
            activeAiIndex = Math.min(Math.max(index, 0), cards.length - 1);
            syncAiPromptVideos();
        };

        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isCarouselVisible = entry.isIntersecting;
                if (!isCarouselVisible) {
                    aiVideos.forEach((video) => {
                        if (!video.paused) video.pause();
                        video.preload = "none";
                        video.setAttribute("preload", "none");
                        video.muted = true;
                        video.volume = 0;
                    });
                    return;
                }

                syncAiPromptVideos();
            });
        }, {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        });

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = cards.indexOf(entry.target);
                if (index !== -1) {
                    cardVisibility.set(index, entry.intersectionRatio);
                }
            });

            const mostVisibleCard = Array.from(cardVisibility.entries())
                .filter(([, ratio]) => ratio >= 0.5)
                .sort((a, b) => b[1] - a[1])[0];
            visibleAiIndex = mostVisibleCard ? mostVisibleCard[0] : -1;
            if (visibleAiIndex !== -1) activeAiIndex = visibleAiIndex;
            syncAiPromptVideos();
        }, {
            root: viewport,
            threshold: [0, 0.5, 0.75, 1]
        });

        cards.forEach((card, index) => {
            const video = card.querySelector("video");
            if (video) {
                video.preload = "none";
                video.setAttribute("preload", "none");
                card.addEventListener("click", () => activateAiPromptCard(index));
            }
            cardObserver.observe(card);
        });

        visibilityObserver.observe(viewport);
        window.addEventListener("portfolio:video-carousel-visibility-changed", syncAiPromptVideos);
        window.addEventListener("portfolio:modal-closed", syncAiPromptVideos);

        const moveAiPromptCarousel = (direction) => {
            const nextIndex = Math.min(Math.max(activeAiIndex + direction, 0), cards.length - 1);
            const targetScroll = Math.max(0, Math.min(
                viewport.scrollLeft + direction * getStep(),
                viewport.scrollWidth - viewport.clientWidth
            ));
            activeAiIndex = nextIndex;
            syncAiPromptVideos();
            viewport.scrollTo({ left: targetScroll, behavior: "smooth" });
        };

        previousButton.addEventListener("click", () => moveAiPromptCarousel(-1));
        nextButton.addEventListener("click", () => moveAiPromptCarousel(1));
    });
};

const hasOpenPortfolioModal = () => Boolean(document.querySelector(
    "dialog[open], #contactSuccessModal:not(.hidden), #certificateModal:not(.hidden), #whatsappQrModal:not(.hidden), #resumeModal:not(.hidden)"
));

const portfolioVideos = Array.from(document.querySelectorAll("video"));
const visibleVideoCarousels = new Set();

portfolioVideos.forEach((video) => {
    video.preload = "none";
    video.setAttribute("preload", "none");
});

window.pausePortfolioVideos = () => {
    portfolioVideos.forEach((video) => {
        if (!video.paused) video.pause();
        video.preload = "none";
        video.setAttribute("preload", "none");
        video.muted = true;
        video.volume = 0;
    });
};

window.resumePortfolioVideos = () => {
    window.dispatchEvent(new Event("portfolio:modal-closed"));
};

const initializeAllCarousels = () => {
    initializeVideoCarousels();
    initializeAiPromptCarousels();

};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAllCarousels);
} else {
    initializeAllCarousels();
}
