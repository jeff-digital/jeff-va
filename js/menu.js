
const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileMenuOverlay =
    document.getElementById("mobileMenuOverlay");

const menuIcon =
    document.getElementById("menuIcon");

function openMobileMenu() {


    mobileMenu.classList.remove(
        "translate-x-full"
    );
    mobileMenuOverlay.classList.remove(
        "opacity-0",
        "pointer-events-none"
    );
    mobileMenuOverlay.classList.add(
        "opacity-100"
    );
    menuIcon.textContent = "×";
    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );
    mobileMenuButton.setAttribute(
        "aria-label",
        "Close navigation"
    );
}


function closeMobileMenu() {
    mobileMenu.classList.add(
        "translate-x-full"
    );
    mobileMenuOverlay.classList.remove(
        "opacity-100"
    );
    mobileMenuOverlay.classList.add(
        "opacity-0",
        "pointer-events-none"
    );
    menuIcon.textContent = "☰";
    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );
    mobileMenuButton.setAttribute(
        "aria-label",
        "Open navigation"
    );
}

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

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener(
        "click",
        closeMobileMenu
    );
}


document
    .querySelectorAll(".mobile-nav-link")
    .forEach(link => {
        link.addEventListener(
            "click",
            closeMobileMenu
        );
    });