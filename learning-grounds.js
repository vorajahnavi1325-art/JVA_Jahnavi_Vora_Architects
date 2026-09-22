document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));

    const hero = document.querySelector(".hero-image");
    let ticking = false;

    function heroParallax() {
        if (!hero) return;
        const y = Math.min(window.scrollY * 0.08, 70);
        hero.style.transform = `scale(1.04) translate3d(0, ${y}px, 0)`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(heroParallax);
            ticking = true;
        }
    }, { passive: true });

    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const close = lightbox?.querySelector(".lightbox-close");

    document.querySelectorAll("main img").forEach(img => {
        img.addEventListener("click", () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || "";
            lightbox.classList.add("open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    close?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeLightbox();
    });
});
