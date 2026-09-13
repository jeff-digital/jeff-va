document.addEventListener("DOMContentLoaded", () => {

    const certificateContainer = document.getElementById("certificateModalContainer");

    if (!certificateContainer) {
        console.error("certificateModalContainer not found.");
        return;
    }

    fetch("certificate.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return response.text();
        })
        .then((html) => {
            certificateContainer.innerHTML = html;
            initializeCertificateModal();
        })
        .catch((error) => {
            console.error("Failed to load certificate.html:", error);
        });
});

function initializeCertificateModal() {
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

    function displayCertificates() {
        if (!certificateList || !noCertificates) {
            return;
        }

        const selectedCategory = certificateCategory?.value ?? "all";
        const selectedYear = certificateYear?.value ?? "all";
        const certificateItems = certificateList.querySelectorAll(".certificate-item");
        let visibleCount = 0;

        certificateItems.forEach((certificate) => {
            const categoryMatches =
                selectedCategory === "all" ||
                certificate.dataset.category === selectedCategory;
            const yearMatches =
                selectedYear === "all" ||
                certificate.dataset.year === selectedYear;
            const isVisible = categoryMatches && yearMatches;

            certificate.classList.toggle("hidden", !isVisible);
            visibleCount += isVisible ? 1 : 0;
        });

        noCertificates.classList.toggle("hidden", visibleCount > 0);
    }

    if (viewCertificateButton) {
        viewCertificateButton.addEventListener("click", () => {
            certificateModal.classList.remove("hidden");
            certificateModal.classList.add("flex");
            document.body.classList.add("overflow-hidden");
            displayCertificates();
        });
    }

    if (certificateCategory) {
        certificateCategory.addEventListener("change", displayCertificates);
    }

    if (certificateYear) {
        certificateYear.addEventListener("change", displayCertificates);
    }

    function closeCertificateModal() {
        certificateModal.classList.add("hidden");
        certificateModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    if (closeCertificateButton) {
        closeCertificateButton.addEventListener("click", closeCertificateModal);
    }

    certificateModal.addEventListener("click", (event) => {
        if (event.target === certificateModal) {
            closeCertificateModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            !certificateModal.classList.contains("hidden")
        ) {
            closeCertificateModal();
        }
    });
}