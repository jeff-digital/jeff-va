/* ================================================= */
/* MOBILE SLIDE NAVIGATION */
/* ================================================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileMenuOverlay =
    document.getElementById("mobileMenuOverlay");

const menuIcon =
    document.getElementById("menuIcon");


/* ================================================= */
/* OPEN MOBILE MENU */
/* ================================================= */

function openMobileMenu() {

    /* Slide menu into view */

    mobileMenu.classList.remove(
        "translate-x-full"
    );


    /* Show dark overlay */

    mobileMenuOverlay.classList.remove(
        "opacity-0",
        "pointer-events-none"
    );

    mobileMenuOverlay.classList.add(
        "opacity-100"
    );


    /* Change hamburger to X */

    menuIcon.textContent = "×";


    /* Update accessibility */

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    mobileMenuButton.setAttribute(
        "aria-label",
        "Close navigation"
    );
}


/* ================================================= */
/* CLOSE MOBILE MENU */
/* ================================================= */

function closeMobileMenu() {

    /* Slide menu out */

    mobileMenu.classList.add(
        "translate-x-full"
    );


    /* Hide dark overlay */

    mobileMenuOverlay.classList.remove(
        "opacity-100"
    );

    mobileMenuOverlay.classList.add(
        "opacity-0",
        "pointer-events-none"
    );


    /* Change X back to hamburger */

    menuIcon.textContent = "☰";


    /* Update accessibility */

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuButton.setAttribute(
        "aria-label",
        "Open navigation"
    );
}


/* ================================================= */
/* MENU BUTTON */
/* ================================================= */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                mobileMenuButton.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );

}


/* ================================================= */
/* OVERLAY */
/* ================================================= */

if (mobileMenuOverlay) {

    mobileMenuOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


/* ================================================= */
/* MOBILE NAVIGATION LINKS */
/* ================================================= */

document
    .querySelectorAll(".mobile-nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });