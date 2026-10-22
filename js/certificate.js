document.addEventListener("DOMContentLoaded", () => {
    const viewCertificateButton = document.getElementById("viewCertificateButton");
    const certificateModal = document.getElementById("certificateModal");
    const closeCertificateButton = document.getElementById("closeCertificateButton");
    const certificateCategory = document.getElementById("certificateCategory");
    const certificateYear = document.getElementById("certificateYear");
    const certificateList = document.getElementById("certificateList");
    const noCertificates = document.getElementById("noCertificates");

    if (!certificateModal) {
        console.error("certificateModal not found.");
        return;
    }

    let filterFrame = 0;
    const certificateItems = certificateList
        ? Array.from(certificateList.querySelectorAll(".certificate-item"))
        : [];

    function displayCertificates() {
        if (!certificateList || !noCertificates) return;

        cancelAnimationFrame(filterFrame);
        filterFrame = requestAnimationFrame(() => {
            const selectedCategory = certificateCategory?.value ?? "all";
            const selectedYear = certificateYear?.value ?? "all";
            let visibleCount = 0;

            certificateItems.forEach((certificate) => {
                const categoryMatches =
                    selectedCategory === "all" ||
                    certificate.dataset.category === selectedCategory;
                const yearMatches =
                    selectedYear === "all" ||
                    certificate.dataset.year === selectedYear;
                const isVisible = categoryMatches && yearMatches;

                certificate.hidden = !isVisible;
                visibleCount += isVisible ? 1 : 0;
            });

            noCertificates.hidden = visibleCount > 0;
        });
    }

    if (viewCertificateButton) {
        viewCertificateButton.addEventListener("click", () => {
            window.pausePortfolioVideos?.();
            document.body.classList.add("certificate-modal-open");
            certificateModal.classList.remove("hidden");
            certificateModal.classList.add("flex");
            document.body.classList.add("overflow-hidden");
            displayCertificates();
        });
    }

    certificateCategory?.addEventListener("change", displayCertificates);
    certificateYear?.addEventListener("change", displayCertificates);

    function closeCertificateModal() {
        certificateModal.classList.add("hidden");
        certificateModal.classList.remove("flex");
        document.body.classList.remove("certificate-modal-open");
        document.body.classList.remove("overflow-hidden");
        if (!document.body.classList.contains("overflow-hidden")) {
            window.resumePortfolioVideos?.();
        }
    }

    closeCertificateButton?.addEventListener("click", closeCertificateModal);

    certificateModal.addEventListener("click", (event) => {
        if (event.target === certificateModal) closeCertificateModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !certificateModal.classList.contains("hidden")) {
            closeCertificateModal();
        }
    });
});
