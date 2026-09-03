/* =================================================
   LOAD CERTIFICATE.HTML
================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const certificateContainer =
        document.getElementById(
            "certificateModalContainer"
        );

    if (!certificateContainer) {
        console.error(
            "certificateModalContainer not found."
        );

        return;
    }


    fetch("certificate.html")
        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status}`
                );
            }

            return response.text();

        })

        .then((html) => {

            certificateContainer.innerHTML = html;

            initializeCertificateModal();

        })

        .catch((error) => {

            console.error(
                "Failed to load certificate.html:",
                error
            );

        });

});


/* =================================================
   INITIALIZE CERTIFICATE MODAL
================================================= */

function initializeCertificateModal() {

    const viewCertificateButton =
        document.getElementById(
            "viewCertificateButton"
        );

    const certificateModal =
        document.getElementById(
            "certificateModal"
        );

    const closeCertificateButton =
        document.getElementById(
            "closeCertificateButton"
        );

    const certificateCategory =
        document.getElementById(
            "certificateCategory"
        );

    const certificateYear =
        document.getElementById(
            "certificateYear"
        );

    const certificateList =
        document.getElementById(
            "certificateList"
        );

    const noCertificates =
        document.getElementById(
            "noCertificates"
        );


    /* =================================================
       CHECK ELEMENTS
    ================================================= */

    if (!certificateModal) {

        console.error(
            "certificateModal not found."
        );

        return;

    }


    /* =================================================
       DISPLAY CERTIFICATES
    ================================================= */

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
            (certificate) => {

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


        /* SHOW / HIDE EMPTY MESSAGE */

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


    /* =================================================
       OPEN MODAL
    ================================================= */

    if (viewCertificateButton) {

        viewCertificateButton.addEventListener(
            "click",
            () => {

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


    /* =================================================
       CATEGORY FILTER
    ================================================= */

    if (certificateCategory) {

        certificateCategory.addEventListener(
            "change",
            displayCertificates
        );

    }


    /* =================================================
       YEAR FILTER
    ================================================= */

    if (certificateYear) {

        certificateYear.addEventListener(
            "change",
            displayCertificates
        );

    }


    /* =================================================
       CLOSE MODAL
    ================================================= */

    function closeCertificateModal() {

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


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    if (closeCertificateButton) {

        closeCertificateButton.addEventListener(
            "click",
            closeCertificateModal
        );

    }


    /* =================================================
       CLICK OUTSIDE MODAL
    ================================================= */

    certificateModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                certificateModal
            ) {

                closeCertificateModal();

            }

        }
    );


    /* =================================================
       ESC KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                !certificateModal.classList.contains(
                    "hidden"
                )
            ) {

                closeCertificateModal();

            }

        }
    );

}