    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    /* OPEN / CLOSE MOBILE MENU */

    mobileMenuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");

    });

    document.querySelectorAll(".mobile-nav-link").forEach(link => {

        link.addEventListener("click", function () {

            mobileMenu.classList.add("hidden");

        });

    });