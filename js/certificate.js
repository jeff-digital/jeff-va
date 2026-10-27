// Add or update certificates here; the side panel renders from this single source.
const certificateData = [
    {
        title: "HubSpot Sales Hub Software",
        issuer: "HubSpot Academy",
        date: "2026",
        category: "crm",
        imageSrc: "certificate/saleshub.png",
        verifyUrl: "https://app-na2.hubspot.com/academy/achievements/4834zrfd/en/1/jeffrey-almocera/hubspot-sales-hub-software-certified"
    },
    {
        title: "Generative AI Mastermind",
        issuer: "Generative AI Mastermind",
        date: "2026",
        category: "ai",
        imageSrc: "certificate/thumbs/ai-placeholder.svg",
        verifyUrl: "certificate/generativeai.pdf"
    },
    {
        title: "Google Ads Search Certification",
        issuer: "Google Skillshop",
        date: "2026",
        category: "digital-marketing",
        imageSrc: "certificate/accredible-google-ads.webp",
        verifyUrl: "https://skillshop.credential.net/bb90a964-e819-4fdf-ae95-44d8e8d87e62#acc.V6yusFR7"
    },
    {
        title: "Social Media Marketing",
        issuer: "HubSpot Academy",
        date: "2026",
        category: "digital-marketing",
        imageSrc: "certificate/sales.png",
        verifyUrl: "certificate/sales.png"
    },
    {
        title: "Digital Marketing Certified",
        issuer: "HubSpot Academy",
        date: "2026",
        category: "digital-marketing",
        imageSrc: "certificate/digital.png",
        verifyUrl: "certificate/digital.png"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const openButton = document.getElementById("openCertificatesPanel");
    const dialog = document.getElementById("certificateLightbox");
    const grid = document.getElementById("certificateGrid");
    const galleryView = document.getElementById("certificateGalleryView");
    const detailView = document.getElementById("certificateDetailView");
    const backButton = document.getElementById("certificateBackButton");
    const filters = Array.from(document.querySelectorAll("[data-certificate-filter]"));

    if (!openButton || !dialog || !grid || !galleryView || !detailView) return;

    const closeButton = dialog.querySelector(".certificate-lightbox-close");
    const image = document.getElementById("certificateLightboxImage");
    const category = document.getElementById("certificateLightboxCategory");
    const title = document.getElementById("certificateLightboxTitle");
    const issuer = document.getElementById("certificateLightboxIssuer");
    const date = document.getElementById("certificateLightboxDate");
    const verifyLink = document.getElementById("certificateVerifyLink");
    const categoryLabels = {
        crm: "CRM",
        ai: "Artificial Intelligence",
        "digital-marketing": "Digital Marketing"
    };
    let activeFilter = "all";
    let lastFocusedElement = null;
    let lastCertificateButton = null;

    const buildCertificateCard = (certificate, index) => {
        const item = document.createElement("li");
        item.className = "certificate-card";
        item.dataset.category = certificate.category;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "certificate-card-button";
        button.dataset.certificateIndex = String(index);
        button.setAttribute("aria-label", "View " + certificate.title + " certificate");

        const thumbnail = document.createElement("span");
        thumbnail.className = "certificate-thumbnail";

        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = certificate.imageSrc;
        thumbnailImage.alt = certificate.title + " certificate";
        thumbnailImage.loading = "lazy";
        thumbnailImage.decoding = "async";
        thumbnail.append(thumbnailImage);

        const copy = document.createElement("span");
        copy.className = "certificate-card-copy";

        const categoryText = document.createElement("span");
        categoryText.className = "certificate-card-category";
        categoryText.textContent = categoryLabels[certificate.category];

        const heading = document.createElement("h3");
        heading.textContent = certificate.title;

        const meta = document.createElement("span");
        meta.className = "certificate-card-meta";
        const issuerText = document.createElement("span");
        issuerText.textContent = certificate.issuer;
        const dateText = document.createElement("span");
        dateText.textContent = certificate.date;
        meta.append(issuerText, dateText);

        const view = document.createElement("span");
        view.className = "certificate-card-view";
        view.textContent = "View ";
        const viewArrow = document.createElement("span");
        viewArrow.setAttribute("aria-hidden", "true");
        viewArrow.textContent = "→";
        view.append(viewArrow);

        copy.append(categoryText, heading, meta, view);
        button.append(thumbnail, copy);
        item.append(button);
        return item;
    };

    const renderCertificates = () => {
        const fragment = document.createDocumentFragment();

        certificateData.forEach((certificate, index) => {
            if (activeFilter === "all" || certificate.category === activeFilter) {
                fragment.append(buildCertificateCard(certificate, index));
            }
        });

        grid.replaceChildren(fragment);
    };

    const showGallery = (restoreCardFocus = false) => {
        detailView.hidden = true;
        galleryView.hidden = false;
        image.src = "";

        if (restoreCardFocus && lastCertificateButton?.isConnected) {
            lastCertificateButton.focus();
        }
    };

    const showCertificateDetail = (index, trigger) => {
        const certificate = certificateData[index];
        if (!certificate) return;

        lastCertificateButton = trigger;
        image.src = certificate.imageSrc;
        image.alt = certificate.title + " certificate";
        category.textContent = categoryLabels[certificate.category];
        title.textContent = certificate.title;
        issuer.textContent = certificate.issuer;
        date.textContent = certificate.date;
        verifyLink.href = certificate.verifyUrl;

        galleryView.hidden = true;
        detailView.hidden = false;
        backButton?.focus();
    };

    const openPanel = () => {
        lastFocusedElement = document.activeElement;
        showGallery();
        renderCertificates();
        window.pausePortfolioVideos?.();
        document.body.classList.add("certificate-lightbox-open");
        dialog.showModal();
        closeButton?.focus();
    };

    const closePanel = () => {
        if (dialog.open) dialog.close();
    };

    openButton.addEventListener("click", openPanel);

    filters.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.certificateFilter;
            filters.forEach((filter) => {
                const isActive = filter === button;
                filter.classList.toggle("is-active", isActive);
                filter.setAttribute("aria-pressed", String(isActive));
            });
            renderCertificates();
        });
    });

    grid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-certificate-index]");
        if (button) {
            showCertificateDetail(Number(button.dataset.certificateIndex), button);
        }
    });

    backButton?.addEventListener("click", () => showGallery(true));
    closeButton?.addEventListener("click", closePanel);

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closePanel();
    });

    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closePanel();
    });

    dialog.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;

        const focusable = Array.from(
            dialog.querySelectorAll('button:not([disabled]):not([hidden]), a[href]:not([tabindex="-1"])')
        ).filter((element) => element.offsetParent !== null);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    dialog.addEventListener("close", () => {
        document.body.classList.remove("certificate-lightbox-open");
        showGallery();
        window.resumePortfolioVideos?.();
        lastFocusedElement?.focus();
    });

    renderCertificates();
});
