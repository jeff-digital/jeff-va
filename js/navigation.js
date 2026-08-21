    const nav = document.getElementById("mainNav");

    /*
    ============================================================
    FIXED NAVIGATION WHEN SCROLLING
    ============================================================
    */

    window.addEventListener("scroll", function () {

        if (window.scrollY > 100) {

            nav.classList.add(
                "fixed",
                "top-0",
                "left-0",
                "right-0",
                "z-50",
                "bg-[#1a2340]",
                "px-8",
                "py-3",
                "shadow-lg"
            );

        } else {

            nav.classList.remove(
                "fixed",
                "top-0",
                "left-0",
                "right-0",
                "z-50",
                "bg-[#1a2340]",
                "px-8",
                "py-3",
                "shadow-lg"
            );

        }

    });



    /*
    ============================================================
    SMOOTH NAVIGATION
    ============================================================
    */

    document.querySelectorAll('#mainNav a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const targetId = this.getAttribute("href");

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }


            /*
            ----------------------------------------------------
            HOME
            ----------------------------------------------------
            */

            if (targetId === "#home") {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                return;
            }


            /*
            ----------------------------------------------------
            OTHER SECTIONS
            ----------------------------------------------------
            */

            const navHeight = nav.offsetHeight;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                navHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });
    lucide.createIcons();
