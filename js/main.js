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

const initializeVideoCarousels = () => {
    const videoCarousels = document.querySelectorAll("[data-carousel]");

    videoCarousels.forEach((carousel) => {
        const viewport = carousel.querySelector(".video-carousel-viewport");
        const track = carousel.querySelector(".video-carousel-track");
        const prevBtn = carousel.parentElement.querySelector("[data-direction='prev']");
        const nextBtn = carousel.parentElement.querySelector("[data-direction='next']");

        if (!viewport || !track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

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

            video.autoplay = false;
            video.removeAttribute("autoplay");
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
                const playToggle = card.querySelector(".video-card-play-toggle");
                const button = card.querySelector(".video-card-audio-toggle");
                const isActive = index === currentIndex;
                const title = card.querySelector("h4")?.textContent?.trim() || "Video";
                const isUserPaused = card.dataset.userPaused === "true";

                if (video) {
                    video.preload = "auto";
                    video.setAttribute("preload", "auto");

                    if (isActive && !isUserPaused) {
                        activateVideo(video);
                    } else {
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
            const activeCard = track.querySelectorAll(".video-carousel-card")[currentIndex];
            const activeVideo = activeCard?.querySelector("video");
            if (!activeVideo) return;

            if (activeCard?.dataset.userPaused !== "true") {
                activateVideo(activeVideo);
            }
        };

        const updatePosition = (index) => {
            currentIndex = clampIndex(index);
            const activeCard = track.querySelectorAll(".video-carousel-card")[currentIndex];
            const cardOffset = activeCard ? activeCard.offsetLeft : 0;
            const maxTranslate = getMaxTranslate();
            const move = Math.min(cardOffset, maxTranslate);
            track.style.transform = `translateX(-${move}px)`;
            syncVideoAudio();
        };

        Array.from(track.querySelectorAll(".video-carousel-card")).forEach((card) => {
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

                const cardIndex = Array.from(track.children).indexOf(card);
                if (cardIndex !== currentIndex) {
                    updatePosition(cardIndex);
                }

                const activeCard = track.querySelectorAll(".video-carousel-card")[currentIndex];
                const activeVideo = activeCard?.querySelector("video");
                if (!activeVideo) return;

                const shouldPlay = activeVideo.paused;
                Array.from(track.querySelectorAll(".video-carousel-card")).forEach((item) => {
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
                const cardIndex = Array.from(track.children).indexOf(card);
                updatePosition(cardIndex);

                const activeVideo = track.querySelectorAll(".video-carousel-card")[cardIndex]?.querySelector("video");
                if (!activeVideo) return;

                const isMuted = activeVideo.muted;
                activeVideo.muted = !isMuted;
                activeVideo.volume = activeVideo.muted ? 0 : 1;
                syncVideoAudio();
            });

            card.addEventListener("click", () => {
                const cardIndex = Array.from(track.children).indexOf(card);
                updatePosition(cardIndex);

                const activeCard = track.querySelectorAll(".video-carousel-card")[currentIndex];
                const activeVideo = activeCard?.querySelector("video");
                if (!activeVideo) return;

                Array.from(track.querySelectorAll(".video-carousel-card")).forEach((item) => {
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
            video.preload = "auto";
            video.setAttribute("preload", "auto");
            video.muted = true;
            video.volume = 0;
            video.playsInline = true;
            video.load();
        });

        prevBtn.addEventListener("click", () => {
            updatePosition(currentIndex - 1);
        });
        nextBtn.addEventListener("click", () => {
            updatePosition(currentIndex + 1);
        });

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
                        const card = video.closest(".video-carousel-card");
                        if (card && (card !== track.querySelectorAll(".video-carousel-card")[currentIndex] || card.dataset.userPaused === "true")) {
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

        updatePosition(0);
    });
};

const initializeAiPromptCarousels = () => {
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

        const moveAiPromptCarousel = (direction) => {
            const cards = Array.from(carousel.querySelectorAll(".project-marquee-card"));
            const maxIndex = Math.max(cards.length - 1, 0);
            const nextStep = Math.min(Math.max(direction, -1), 1);
            activeAiIndex = Math.min(Math.max(activeAiIndex + nextStep, 0), maxIndex);

            const currentScroll = viewport.scrollLeft;
            const targetScroll = Math.max(0, Math.min(currentScroll + nextStep * getStep(), viewport.scrollWidth - viewport.clientWidth));
            viewport.scrollLeft = targetScroll;
            activateAiPromptVideos();
        };

        previousButton.onclick = () => moveAiPromptCarousel(-1);
        nextButton.onclick = () => moveAiPromptCarousel(1);

        previousButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                moveAiPromptCarousel(-1);
            }
        });

        nextButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                moveAiPromptCarousel(1);
            }
        });
    });
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
