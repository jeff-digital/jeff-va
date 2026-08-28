const viewCertificateButton =
    document.getElementById("viewCertificateButton");

const certificateModal =
    document.getElementById("certificateModal");

const closeCertificateButton =
    document.getElementById("closeCertificateButton");

const certificateCategory =
    document.getElementById("certificateCategory");

const certificateYear =
    document.getElementById("certificateYear");

const certificateList =
    document.getElementById("certificateList");

const noCertificates =
    document.getElementById("noCertificates");

function displayCertificates() {
    if (
        !certificateList ||
        !noCertificates
    ) {
        return;
    }

    const selectedCategory =
        certificateCategory
            ? certificateCategory.value
            : "all";
    const selectedYear =
        certificateYear
            ? certificateYear.value
            : "all";

    const certificateItems =
        certificateList.querySelectorAll(
            ".certificate-item"
        );

    let visibleCount = 0;

    certificateItems.forEach(
        function (certificate) {
            const category =
                certificate.dataset.category;

            const year =
                certificate.dataset.year;

            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;

            const yearMatch =
                selectedYear === "all" ||
                year === selectedYear;
            if (
                categoryMatch &&
                yearMatch
            ) {
                certificate.classList.remove(
                    "hidden"
                );
                visibleCount++;
            } else {
                certificate.classList.add(
                    "hidden"
                );
            }
        }
    );
    if (visibleCount === 0) {
        noCertificates.classList.remove(
            "hidden"
        );
    } else {
        noCertificates.classList.add(
            "hidden"
        );
    }
}

if (
    viewCertificateButton &&
    certificateModal
) {
    viewCertificateButton.addEventListener(
        "click",
        
        function () {
            certificateModal.classList.remove(
                "hidden"
            );
            certificateModal.classList.add(
                "flex"
            );
            document.body.classList.add(
                "overflow-hidden"
            );
            displayCertificates();
        }
    );
}

if (certificateCategory) {

    certificateCategory.addEventListener(
        "change",
        displayCertificates
    );
}

if (certificateYear) {
    certificateYear.addEventListener(
        "change",
        displayCertificates
    );
}

function closeCertificateModal() {
    if (!certificateModal) {
        return;
    }
    certificateModal.classList.add(
        "hidden"
    );
    certificateModal.classList.remove(
        "flex"
    );
    document.body.classList.remove(
        "overflow-hidden"
    );
}

if (closeCertificateButton) {

    closeCertificateButton.addEventListener(
        "click",
        closeCertificateModal
    );
}

if (certificateModal) {
    certificateModal.addEventListener(
        "click",
        function (event) {
            if (
                event.target === certificateModal
            ) {
                closeCertificateModal();
            }
        }
    );
}

document.addEventListener(
    "keydown",

    function (event) {
        if (
            event.key === "Escape" &&
            certificateModal &&
            !certificateModal.classList.contains(
                "hidden"
            )
        ) {
            closeCertificateModal();
        }
    }
);