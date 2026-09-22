document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll("section, figure, .project-nav-card");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {threshold:.08});
    revealItems.forEach(el => observer.observe(el));

    const hero = document.querySelector(".hero-image");
    let ticking = false;
    function parallax(){
        if(!hero) return;
        const y = Math.min(window.scrollY * .10, 90);
        hero.style.transform = `scale(1.04) translate3d(0, ${y}px, 0)`;
        ticking = false;
    }
    window.addEventListener("scroll", () => {
        if(!ticking){ requestAnimationFrame(parallax); ticking = true; }
    }, {passive:true});

    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const close = document.getElementById("lightboxClose");
    document.querySelectorAll("main img").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || "";
            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    });
    function closeLightbox(){
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => { if(e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", e => { if(e.key === "Escape") closeLightbox(); });
});
