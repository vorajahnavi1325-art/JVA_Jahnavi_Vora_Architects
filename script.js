/* =========================================================
   JVA — JAHNAVI VORA ARCHITECTS
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   JVA INTRO ANIMATION
   ========================================================= */

function initJVAIntro() {
    const intro = document.getElementById("jvaIntro");

    if (!intro) {
        document.body.classList.remove("intro-active");
        return;
    }

    document.body.classList.add("intro-active");

    // Intro plays on every page load / refresh.
    setTimeout(() => {
        intro.classList.add("hide");
        document.body.classList.remove("intro-active");
    }, 3000);

    setTimeout(() => {
        intro.remove();
    }, 4300);
}


/* =========================================================
   FULLSCREEN MENU
   ========================================================= */

function initMenu() {
    const menuOpen = document.getElementById("menuOpen");
    const menuClose = document.getElementById("menuClose");
    const menuOverlay = document.getElementById("menuOverlay");

    if (!menuOpen || !menuOverlay) {
        console.warn("JVA Menu: #menuOpen or #menuOverlay was not found.");
        return;
    }

    const menuLinks = menuOverlay.querySelectorAll(".menu-link");

    // Make sure the menu starts closed and the button is clickable.
    menuOverlay.setAttribute("aria-hidden", "true");
    menuOpen.setAttribute("aria-expanded", "false");
    menuOpen.style.pointerEvents = "auto";

    function openMenu(event) {
        if (event) event.preventDefault();

        menuOverlay.classList.add("open", "active");
        document.body.classList.add("menu-open");

        menuOpen.setAttribute("aria-expanded", "true");
        menuOverlay.setAttribute("aria-hidden", "false");

        // Prevent the page behind the fullscreen menu from scrolling.
        document.documentElement.style.overflow = "hidden";

        menuLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.07}s`;

            // Force the animation to restart if the menu is opened again.
            link.classList.remove("menu-link-visible");
            requestAnimationFrame(() => {
                link.classList.add("menu-link-visible");
            });
        });
    }

    function closeMenu(event) {
        if (event) event.preventDefault();

        menuOverlay.classList.remove("open", "active");
        document.body.classList.remove("menu-open");

        menuOpen.setAttribute("aria-expanded", "false");
        menuOverlay.setAttribute("aria-hidden", "true");

        document.documentElement.style.overflow = "";

        menuLinks.forEach(link => {
            link.style.transitionDelay = "0s";
            link.classList.remove("menu-link-visible");
        });
    }

    menuOpen.addEventListener("click", openMenu);

    if (menuClose) {
        menuClose.addEventListener("click", closeMenu);
    }

    // Clicking a menu item closes the overlay after navigation starts.
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Clicking the empty overlay area also closes it.
    menuOverlay.addEventListener("click", event => {
        if (event.target === menuOverlay) {
            closeMenu(event);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" &&
            menuOverlay.classList.contains("open")) {
            closeMenu();
        }
    });
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".project, .practice-card, .experience-project, .contact-main"
    );

    if (!revealElements.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealElements.forEach(element => {
            element.classList.add("revealed");
        });
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}


/* =========================================================
   EXPERIENCE IMAGE ROTATOR
   ========================================================= */

function initExperienceGallery() {

    const gallery = document.querySelector(".experience-image");
    const current = gallery?.querySelector(".experience-slide-current");
    const next = gallery?.querySelector(".experience-slide-next");

    if (!gallery || !current || !next) return;

    const images = [
        { src: "assets/len+k/len%20(1).jpeg", alt: "LEN+K experience — people and conversations" },
        { src: "assets/len+k/len%20(2).jpeg", alt: "LEN+K experience — a site visit" },
        { src: "assets/len+k/len%20(3).jpeg", alt: "LEN+K experience — a shared moment" },
        { src: "assets/len+k/len%20(4).jpeg", alt: "LEN+K experience — people in conversation" },
        { src: "assets/len+k/len%20(5).jpeg", alt: "LEN+K experience — a personal encounter" }
    ];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    images.forEach(image => {
        const preload = new Image();
        preload.src = image.src;
    });

    let index = 0;
    let timer = null;
    let showingCurrent = true;

    function showNext() {
        const nextIndex = (index + 1) % images.length;
        const image = images[nextIndex];

        if (showingCurrent) {
            next.src = image.src;
            next.alt = image.alt;
            next.setAttribute("aria-hidden", "false");
            current.setAttribute("aria-hidden", "true");

            requestAnimationFrame(() => {
                next.style.opacity = "1";
                current.style.opacity = "0";
            });
        } else {
            current.src = image.src;
            current.alt = image.alt;
            current.setAttribute("aria-hidden", "false");
            next.setAttribute("aria-hidden", "true");

            requestAnimationFrame(() => {
                current.style.opacity = "1";
                next.style.opacity = "0";
            });
        }

        index = nextIndex;
        showingCurrent = !showingCurrent;
    }

    function start() {
        if (timer) return;
        timer = window.setInterval(showNext, 2000);
    }

    function stop() {
        if (!timer) return;
        window.clearInterval(timer);
        timer = null;
    }

    const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting) {
                start();
            } else {
                stop();
            }
        },
        { threshold: 0.15 }
    );

    observer.observe(gallery);

}


/* =========================================================
   PROJECT FILTERS
   ========================================================= */

function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".work-filters button");
    const projects = document.querySelectorAll(".project");

    if (!filterButtons.length || !projects.length) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            projects.forEach(project => {
                const category = project.dataset.category;

                if (filter === "all" || category === filter) {
                    project.style.display = "";

                    requestAnimationFrame(() => {
                        project.classList.remove("filter-hidden");
                    });
                } else {
                    project.classList.add("filter-hidden");

                    setTimeout(() => {
                        if (project.classList.contains("filter-hidden")) {
                            project.style.display = "none";
                        }
                    }, 350);
                }
            });
        });
    });
}


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function initScrollProgress() {
    function updateProgress() {
        const scrollTop = window.scrollY;
        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        if (documentHeight <= 0) return;

        const progress = (scrollTop / documentHeight) * 100;

        document.documentElement.style.setProperty(
            "--progress-width",
            `${progress}%`
        );
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
}


/* =========================================================
   SMOOTH ANCHOR LINKS
   ========================================================= */

function initSmoothLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================================================
   HERO SCROLL ANIMATION
   =========================================================
   Sequence:
   1. Hero opens with JVA centered.
   2. Architect image starts completely hidden.
   3. On scroll, image fades in and moves to the right.
   4. JVA moves from the center to the large left position.
   5. Both stop at the final architectural composition.
   ========================================================= */

function initParallax() {
    const hero = document.querySelector(".hero");

    if (!hero) return;

    const heroSpace = hero.querySelector(".hero-scroll-space");
    const jva = hero.querySelector(".hero-jva");
    const architect = hero.querySelector(".hero-architect");
    const architectImg = hero.querySelector(".architect-frame img");
    const architectFrame = hero.querySelector(".architect-frame");
    const backgroundPhoto = hero.querySelector(".hero-background-photo");
    const studioMarquee = hero.querySelector(".hero-studio-marquee");
    const gridLines = hero.querySelectorAll(".grid-line");
    const coordinates = hero.querySelector(".hero-coordinates");
    const scrollHint = hero.querySelector(".hero-scroll");

    if (!heroSpace || !jva || !architect) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let ticking = false;

    const clamp = (value, min = 0, max = 1) =>
        Math.max(min, Math.min(max, value));

    const smoothstep = value => {
        value = clamp(value);
        return value * value * (3 - 2 * value);
    };

    const mapProgress = (progress, start, end) => {
        if (progress <= start) return 0;
        if (progress >= end) return 1;
        return (progress - start) / (end - start);
    };

    function updateHero() {
        const rect = hero.getBoundingClientRect();

        const totalScroll = Math.max(
            hero.offsetHeight - window.innerHeight,
            1
        );

        const rawProgress = clamp(
            -rect.top / totalScroll
        );

        /* -----------------------------------------
           CLIENT HERO LAYERS
        ----------------------------------------- */

        if (backgroundPhoto) {
            const photoX = -12 + rawProgress * 24;
            backgroundPhoto.style.transform =
                `translate3d(${photoX}%, 0, 0) scale(1.08)`;
        }

        if (studioMarquee) {
            // Travel from completely off-screen right to completely off-screen left.
            // Measure the actual text width so the entire marquee exits the viewport.
            const marqueeWidth =
                (studioMarquee.getBoundingClientRect().width / window.innerWidth) * 100;

            const marqueeTravel = 100 + marqueeWidth + 8;
            const marqueeX = 100 - rawProgress * marqueeTravel;

            studioMarquee.style.transform =
                `translate3d(${marqueeX}vw, 0, 0)`;
        }

        /* -----------------------------------------
           REDUCED MOTION
        ----------------------------------------- */

        if (reducedMotion) {
            jva.style.left = "5vw";
            jva.style.top = "12vh";
            jva.style.transform = "translate3d(0, 0, 0) scale(1)";
            jva.style.opacity = "1";

            architect.style.right = "8vw";
            architect.style.top = "17vh";
            architect.style.transform =
                "translate3d(0, 0, 0) scale(1)";
            architect.style.opacity = "1";

            if (backgroundPhoto) {
                backgroundPhoto.style.transform = "translate3d(0, 0, 0) scale(1.08)";
            }

            if (studioMarquee) {
                studioMarquee.style.transform = "translate3d(0, 0, 0)";
            }

            ticking = false;
            return;
        }

        /* -----------------------------------------
           MAIN TIMING

           Nothing changes immediately.
           The composition begins moving after
           a small amount of scroll.
        ----------------------------------------- */

        const movement = smoothstep(
            mapProgress(rawProgress, 0.06, 0.72)
        );

        /* -----------------------------------------
           JVA

           START:
             centered in viewport

           END:
             exactly returns to the CSS-defined
             architectural left position:
             left: 5vw
             top: 12vh
        ----------------------------------------- */

        const startJvaX = 50;
        const startJvaY = 50;

        const endJvaX = 5;
        const endJvaY = 12;

        const jvaX =
            startJvaX +
            (endJvaX - startJvaX) * movement;

        const jvaY =
            startJvaY +
            (endJvaY - startJvaY) * movement;

        /*
         * At the center we use -50%/-50%.
         * At the final position we use 0/0.
         *
         * This prevents the giant JVA from jumping
         * when the animation starts.
         */

        const centerAmount = 1 - movement;

        const translateX = -50 * centerAmount;
        const translateY = -50 * centerAmount;

        jva.style.left = `${jvaX}vw`;
        jva.style.top = `${jvaY}vh`;

        jva.style.transform =
            `translate3d(${translateX}%, ${translateY}%, 0) scale(1)`;

        jva.style.opacity = "1";

        /* -----------------------------------------
           ARCHITECT IMAGE

           START:
             opacity 0
             slightly displaced

           END:
             CSS position
             right: 8vw
             top: 17vh
             scale 1
        ----------------------------------------- */

        const imageProgress = smoothstep(
            mapProgress(rawProgress, 0.12, 0.70)
        );

        const imageStartX = 5;
        const imageStartY = 2;

        const imageX =
            imageStartX -
            imageStartX * imageProgress;

        const imageY =
            imageStartY -
            imageStartY * imageProgress;

        const imageOpacity = smoothstep(
            mapProgress(rawProgress, 0.16, 0.52)
        );

        architect.style.transform =
            `translate3d(${imageX}vw, ${imageY}vh, 0) scale(1)`;

        architect.style.opacity =
            String(imageOpacity);

        /* -----------------------------------------
           IMAGE ITSELF

           Very subtle movement only while entering.
           Once the image reaches the side it stops.
        ----------------------------------------- */

        if (architectImg) {
            const internalProgress = smoothstep(
                mapProgress(rawProgress, 0.18, 0.65)
            );

            architectImg.style.transform =
                `translate3d(${-internalProgress * 2.5}%, ${-internalProgress * 1.5}%, 0) scale(${1 + internalProgress * 0.035})`;
        }

        /* -----------------------------------------
           FRAME
        ----------------------------------------- */

        if (architectFrame) {
            architectFrame.style.borderRadius = "0px";
        }

        /* -----------------------------------------
           CONSTRUCTION GRID

           Subtle movement. The grid should support
           the composition, not compete with JVA.
        ----------------------------------------- */

        gridLines.forEach((line, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const amount = movement * 1.5 * direction;

            line.style.transform =
                `translate3d(${amount}vw, 0, 0)`;
        });

        /* -----------------------------------------
           COORDINATES
        ----------------------------------------- */

        if (coordinates) {
            const coordinateProgress = smoothstep(
                mapProgress(rawProgress, 0.08, 0.65)
            );

            coordinates.style.opacity =
                String(1 - coordinateProgress * 0.35);
        }

        /* -----------------------------------------
           SCROLL INDICATOR
        ----------------------------------------- */

        if (scrollHint) {
            const hintProgress = smoothstep(
                mapProgress(rawProgress, 0.0, 0.18)
            );

            scrollHint.style.opacity =
                String(1 - hintProgress);
        }

        ticking = false;
    }

    function requestUpdate() {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(updateHero);
    }

    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate
    );

    window.addEventListener(
        "load",
        requestUpdate
    );

    updateHero();
}

/* =========================================================
   JVA — CINEMATIC ARCHITECTURAL MOTION
========================================================= */

function initGlobalMotion() {

    const motionLayer =
        document.querySelector(".global-motion");

    if (!motionLayer) return;


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) return;


    let ticking = false;


    /* -----------------------------------------------------
       MOUSE PARALLAX
    ----------------------------------------------------- */

    let mouseX = 0;
    let mouseY = 0;

    let currentMouseX = 0;
    let currentMouseY = 0;


    window.addEventListener(
        "mousemove",
        event => {

            mouseX =
                (event.clientX / window.innerWidth - 0.5)
                * 2;

            mouseY =
                (event.clientY / window.innerHeight - 0.5)
                * 2;

        },
        { passive: true }
    );


    /* -----------------------------------------------------
       MAIN UPDATE
    ----------------------------------------------------- */

    function updateMotion() {

        const scrollY =
            window.scrollY || window.pageYOffset;


        const pageHeight =
            Math.max(
                document.documentElement.scrollHeight -
                window.innerHeight,
                1
            );


        const progress =
            Math.min(
                Math.max(
                    scrollY / pageHeight,
                    0
                ),
                1
            );

        /*
         * The motion layer is fixed to the viewport.
         * Therefore raw document scroll (which can be several
         * thousand pixels) would throw elements completely
         * off-screen. Convert the full-page progress into a
         * controlled architectural travel distance instead.
         */
        const motionScroll = progress * 1800;


        /* ---------------------------------------------
           SMOOTH MOUSE
        --------------------------------------------- */

        currentMouseX +=
            (mouseX - currentMouseX) * 0.055;

        currentMouseY +=
            (mouseY - currentMouseY) * 0.055;


        /* ---------------------------------------------
           CSS VARIABLES
        --------------------------------------------- */

        motionLayer.style.setProperty(
            "--motion-scroll",
            `${motionScroll}px`
        );


        motionLayer.style.setProperty(
            "--motion-progress",
            progress
        );


        motionLayer.style.setProperty(
            "--motion-x",
            `${currentMouseX * 35}px`
        );


        motionLayer.style.setProperty(
            "--motion-y",
            `${currentMouseY * 25}px`
        );


        /* ---------------------------------------------
           PROJECT IMAGE DEPTH
        --------------------------------------------- */

        const projectImages =
            motionLayer.querySelectorAll(
                ".motion-project img"
            );


        projectImages.forEach(
            (image, index) => {

                const depth =
                    index === 0
                        ? currentMouseX * 7
                        : currentMouseX * -7;

                const vertical =
                    index === 0
                        ? currentMouseY * 5
                        : currentMouseY * -5;


                image.style.transform =
                    `translate3d(
                        ${depth}px,
                        ${vertical}px,
                        0
                    ) scale(1.08)`;

            }
        );


        /* ---------------------------------------------
           POINT MOVEMENT
        --------------------------------------------- */

        const points =
            motionLayer.querySelectorAll(
                ".motion-point"
            );


        points.forEach(
            (point, index) => {

                const direction =
                    index % 2 === 0
                        ? 1
                        : -1;


                const speed =
                    0.035 +
                    index * 0.009;


                const y =
                    motionScroll *
                    speed *
                    direction;


                const x =
                    currentMouseX *
                    (8 + index * 2);


                const scale =
                    1 +
                    Math.sin(
                        motionScroll * 0.002 +
                        index
                    ) * 0.25;


                point.style.transform =
                    `translate3d(
                        ${x}px,
                        ${y}px,
                        0
                    ) scale(${scale})`;

            }
        );


        /* ---------------------------------------------
           CROSSHAIR ROTATION
        --------------------------------------------- */

        const crosshairs =
            motionLayer.querySelectorAll(
                ".motion-crosshair"
            );


        crosshairs.forEach(
            (crosshair, index) => {

                const directions =
                    [
                        -.12,
                        .08,
                        -.10,
                        .13,
                        -.07
                    ];


                const speed =
                    directions[index] || .05;


                const y =
                    motionScroll * speed;


                const rotation =
                    motionScroll *
                    (0.008 + index * 0.002);


                const mouseOffset =
                    currentMouseX *
                    (5 + index);


                crosshair.style.transform =
                    `translate3d(
                        ${mouseOffset}px,
                        ${y}px,
                        0
                    )
                    rotate(${rotation}deg)`;

            }
        );


        /* ---------------------------------------------
           REQUEST NEXT FRAME
        --------------------------------------------- */

        ticking = false;

    }


    /* -----------------------------------------------------
       RAF
    ----------------------------------------------------- */

    function requestUpdate() {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(
            updateMotion
        );

    }


    /* -----------------------------------------------------
       EVENTS
    ----------------------------------------------------- */

    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestUpdate
    );


    window.addEventListener(
        "mousemove",
        requestUpdate,
        { passive: true }
    );


    /* -----------------------------------------------------
       INITIAL
    ----------------------------------------------------- */

    updateMotion();

}

/* =========================================================
   PROJECT IMAGE PARALLAX
   ========================================================= */

function initProjectHover() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const projects = document.querySelectorAll(".project");

    if (!projects.length) return;

    projects.forEach(project => {
        const image = project.querySelector("img");

        if (!image) return;

        project.addEventListener("mousemove", event => {
            const rect = project.getBoundingClientRect();

            if (!rect.width || !rect.height) return;

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const percentX = x / rect.width - 0.5;
            const percentY = y / rect.height - 0.5;

            const moveX = percentX * 14;
            const moveY = percentY * 14;

            image.style.transform =
                `scale(1.06) translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        project.addEventListener("mouseleave", () => {
            image.style.transform =
                "scale(1) translate3d(0, 0, 0)";
        });
    });
}


/* =========================================================
   HEADER HIDE / SHOW
   ========================================================= */

function initHeader() {
    const header = document.querySelector(".topbar");

    if (!header) return;

    let lastScroll = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.scrollY;

        if (currentScroll < 80) {
            header.classList.remove("header-hidden");
            lastScroll = currentScroll;
            ticking = false;
            return;
        }

        if (document.body.classList.contains("menu-open")) {
            header.classList.remove("header-hidden");
            lastScroll = currentScroll;
            ticking = false;
            return;
        }

        if (currentScroll > lastScroll) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;

            ticking = true;
            window.requestAnimationFrame(updateHeader);
        },
        { passive: true }
    );
}


/* =========================================================
   IMAGE LOADING
   ========================================================= */

function initImageLoading() {
    const images = document.querySelectorAll("img");

    images.forEach(image => {
        if (image.complete) {
            image.classList.add("loaded");
        } else {
            image.addEventListener(
                "load",
                () => image.classList.add("loaded"),
                { once: true }
            );

            image.addEventListener(
                "error",
                () => image.classList.add("loaded"),
                { once: true }
            );
        }
    });
}


/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */

function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const buttons = document.querySelectorAll(
        ".contact-main a, .hero-bottom a, .explore-link"
    );

    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener("mousemove", event => {
            const rect = button.getBoundingClientRect();

            const x =
                event.clientX -
                (rect.left + rect.width / 2);

            const y =
                event.clientY -
                (rect.top + rect.height / 2);

            button.style.transform =
                `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform =
                "translate3d(0, 0, 0)";
        });
    });
}


/* =========================================================
   ACTIVE MENU SECTION
   ========================================================= */

function initActiveSections() {
    const sections = document.querySelectorAll("main section[id]");
    const menuLinks = document.querySelectorAll(".menu-link");

    if (!sections.length || !menuLinks.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                menuLinks.forEach(link => {
                    link.classList.remove("current");

                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("current");
                    }
                });
            });
        },
        {
            threshold: 0.25
        }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
}


/* =========================================================
   HERO ENTRANCE
   ========================================================= */

function initHeroAnimation() {
    const heroElements = document.querySelectorAll(
        ".hero-kicker, .hero-title, .hero-description, .hero-scroll"
    );

    if (!heroElements.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroElements.forEach(element => {
            element.classList.add("hero-enter-visible");
        });
        return;
    }

    heroElements.forEach((element, index) => {
        element.classList.add("hero-enter");
        element.style.transitionDelay = `${index * 0.08}s`;
    });

    // Let the intro establish the JVA identity first.
    setTimeout(() => {
        heroElements.forEach(element => {
            element.classList.add("hero-enter-visible");
        });
    }, 900);
}


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function initCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    const follower = document.createElement("div");
    follower.className = "custom-cursor-follower";
    document.body.appendChild(follower);

    let mouseX = 0;
    let mouseY = 0;

    let followerX = 0;
    let followerY = 0;

    document.addEventListener("mousemove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.14;
        followerY += (mouseY - followerY) * 0.14;

        follower.style.transform =
            `translate3d(${followerX}px, ${followerY}px, 0)`;

        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    const interactive = document.querySelectorAll(
        "a, button, .project, .menu-button"
    );

    interactive.forEach(element => {
        element.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });

        element.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });
}


/* =========================================================
   DYNAMIC STYLES
   ========================================================= */

function addDynamicStyles() {
    if (document.getElementById("jva-dynamic-styles")) return;

    const style = document.createElement("style");
    style.id = "jva-dynamic-styles";

    style.textContent = `
        /* HEADER */
        .topbar::before {
            width: var(--progress-width, 0%);
        }

        .topbar {
            transition:
                transform 0.55s cubic-bezier(.22, 1, .36, 1);
        }

        .topbar.header-hidden {
            transform: translateY(-110%);
        }

        /* MENU BUTTON / OVERLAY CLICKABILITY */
        #menuOpen {
            position: relative;
            z-index: 10001;
            pointer-events: auto !important;
            cursor: pointer;
        }

        #menuOverlay {
            z-index: 10000;
        }

        body.menu-open {
            overflow: hidden;
        }

        /* HERO ENTRANCE */
        .hero-enter {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
            transition:
                opacity 0.9s ease,
                transform 1s cubic-bezier(.22, 1, .36, 1);
        }

        .hero-enter-visible {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }

        .hero-jva.hero-enter {
            transform: translate3d(0, 30px, 0);
        }

        .hero-jva.hero-enter-visible {
            transform: translate3d(0, 0, 0);
        }

        .hero-architect.hero-enter {
            transform: translate3d(40px, 30px, 0);
        }

        .hero-architect.hero-enter-visible {
            transform: translate3d(0, 0, 0);
        }

        /* PROJECT FILTERS */
        .project.filter-hidden {
            opacity: 0;
            transform: translate3d(var(--project-scroll-x, 0px), 20px, 0);
            pointer-events: none;
        }

        .project {
            transition:
                opacity 0.35s ease,
                transform 0.5s cubic-bezier(.22, 1, .36, 1);
        }

        /* SCROLL REVEAL */
        .reveal:not(.project) {
            opacity: 0;
            transform: translateY(50px);
            transition:
                opacity 0.9s ease,
                transform 1s cubic-bezier(.22, 1, .36, 1);
        }

        .reveal.revealed:not(.project) {
            opacity: 1;
            transform: translateY(0);
        }

        /* CUSTOM CURSOR */
        .custom-cursor {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--ink);
            pointer-events: none;
            z-index: 99998;
            margin-left: -3px;
            margin-top: -3px;
        }

        .custom-cursor-follower {
            position: fixed;
            width: 32px;
            height: 32px;
            border: 1px solid rgba(33, 25, 20, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99997;
            margin-left: -16px;
            margin-top: -16px;
            transition:
                width 0.25s ease,
                height 0.25s ease,
                margin 0.25s ease,
                border-color 0.25s ease;
        }

        .cursor-hover .custom-cursor-follower {
            width: 52px;
            height: 52px;
            margin-left: -26px;
            margin-top: -26px;
            border-color: var(--ink);
        }

        /* IMAGE LOADING */
        img {
            opacity: 0;
            transition: opacity 0.8s ease;
        }

        img.loaded {
            opacity: 1;
        }

        .hero-architect img {
            opacity: 1;
        }

        /* MENU */
        .menu-link {
            opacity: 0;
            transform: translateY(30px);
            transition:
                opacity 0.7s ease,
                transform 0.8s cubic-bezier(.22, 1, .36, 1);
        }

        .menu-link-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .menu-link.current {
            color: var(--rose);
        }

        /* ACCESSIBILITY */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                scroll-behavior: auto !important;
                transition-duration: 0.01ms !important;
            }

            .hero {
                height: 100vh;
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================================================
   VIEWPORT HEIGHT
   ========================================================= */

function initViewportHeight() {
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;

        document.documentElement.style.setProperty(
            "--vh",
            `${vh}px`
        );
    }

    setViewportHeight();

    window.addEventListener("resize", setViewportHeight);
}


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

function initVisibilityHandling() {
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            document.documentElement.classList.remove("page-hidden");
        }
    });
}


/* =========================================================
   INITIALIZE EVERYTHING
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initJVAIntro();
    initMenu();
    initScrollReveal();
    initExperienceGallery();
    initProjectFilters();
    initScrollProgress();
    initSmoothLinks();
    initParallax();
    initGlobalMotion();
    initProjectHover();
    initProjectScrollMotion();
    initHeader();
    initImageLoading();
    initMagneticButtons();
    initActiveSections();
    initHeroAnimation();
    initCursor();
    addDynamicStyles();
    initViewportHeight();
    initVisibilityHandling();
});


/* =========================================================
   PROJECT SCROLL DIRECTION
   Left projects drift right; right projects drift left.
========================================================= */

function initProjectScrollMotion() {
    const projects = Array.from(document.querySelectorAll(".work-section .project"));

    if (!projects.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let ticking = false;

    function updateProjectMotion() {
        const viewportCenter = window.innerHeight * 0.5;

        projects.forEach((project, index) => {
            if (project.style.display === "none") return;

            const rect = project.getBoundingClientRect();
            const projectCenter = rect.top + rect.height * 0.5;

            /*
             * Projects are deliberately given opposite directions.
             * The closer they get to the viewport centre, the stronger
             * the horizontal travel becomes.
             */
            const distance = projectCenter - viewportCenter;
            const normalized = Math.max(
                -1,
                Math.min(1, distance / (window.innerHeight * 0.9))
            );

            const proximity = 1 - Math.min(1, Math.abs(normalized));
            const direction = index % 2 === 0 ? 1 : -1;

            const shift = direction * proximity * 110;

            project.style.setProperty(
                "--project-scroll-x",
                `${shift.toFixed(2)}px`
            );
        });

        ticking = false;
    }

    function requestProjectMotion() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateProjectMotion);
    }

    window.addEventListener("scroll", requestProjectMotion, { passive: true });
    window.addEventListener("resize", requestProjectMotion);

    updateProjectMotion();
}
