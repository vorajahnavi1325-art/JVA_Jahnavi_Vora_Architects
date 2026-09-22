document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCROLL REVEALS
    ===================================================== */

    const revealSections = document.querySelectorAll(
        ".editorial-section, " +
        ".concept-block, " +
        ".drawing-section, " +
        ".full-image-section, " +
        ".large-gallery-section, " +
        ".two-image-section, " +
        ".offset-image-section, " +
        ".sketch-section, " +
        ".detail-section, " +
        ".sketch-wide-section, " +
        ".material-section"
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealSections.forEach((section) => {
        revealObserver.observe(section);
    });


    /* =====================================================
       IMAGE LIGHTBOX
    ===================================================== */

    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");

    const projectImages = document.querySelectorAll(
        ".within-page img"
    );

    projectImages.forEach((image) => {
        image.addEventListener("click", () => {

            if (image.closest(".project-header")) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || "";

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const heroImage = document.querySelector(
        ".project-hero-image img"
    );

    if (heroImage) {

        let ticking = false;

        function updateHero() {
            const scroll = window.scrollY;
            const amount = Math.min(scroll * 0.12, 90);

            heroImage.style.transform =
                `translate3d(0, ${amount}px, 0) scale(1.04)`;

            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    requestAnimationFrame(updateHero);
                    ticking = true;
                }
            },
            { passive: true }
        );
    }


    /* =====================================================
       SAVE WORK POSITION
       This is called when a project is opened or when the
       visitor uses either BACK TO WORK button.
    ===================================================== */

    function saveWorkPosition() {
        sessionStorage.setItem(
            "jvaWorkScroll",
            window.scrollY.toString()
        );
    }


    const backButtons = document.querySelectorAll(
        ".project-back, .project-back-bottom"
    );

    backButtons.forEach((button) => {
        button.addEventListener("click", saveWorkPosition);
    });

});
