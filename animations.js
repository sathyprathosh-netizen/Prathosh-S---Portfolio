/* ============================================================
   GSAP Animations & Motion Engineering — js/animations.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Text & Image Entrance Animation
    const initHeroAnimation = () => {
        const title = document.getElementById("hero-title");
        const subtitle = document.getElementById("hero-subtitle");
        const portrait = document.getElementById("portrait-img");
        
        const tl = gsap.timeline();

        // Animate Image First
        if(portrait) {
            tl.fromTo(portrait, 
                { scale: 1.1, opacity: 0, filter: "blur(10px)" },
                { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }
            );
        }

        // Animate Main Title
        if(title) {
            tl.fromTo(title, 
                { y: 50, opacity: 0, filter: "blur(8px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "expo.out" },
                "-=1.0" // Overlap with image
            );
        }

        // Animate Subtitle
        if(subtitle) {
            tl.fromTo(subtitle,
                { y: 30, opacity: 0, rotationX: 45 },
                { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "back.out(1.7)" },
                "-=0.8"
            );
        }
    };
    initHeroAnimation();

    // 2. About Section Background Color Shift
    const initAboutShift = () => {
        const aboutSection = document.getElementById("about");
        if(!aboutSection) return;

        gsap.to("body", {
            scrollTrigger: {
                trigger: aboutSection,
                start: "top center",
                end: "bottom center",
                scrub: true,
            },
            backgroundColor: "#1A1A1E", 
            color: "#F5F5F7"
        });
    };
    initAboutShift();

    // 3. Skills Infinite Marquee & Magnetic Pull
    const initMarquees = () => {
        const tracks = document.querySelectorAll('.marquee-track');
        if(!tracks.length) return;

        tracks.forEach((track, index) => {
            gsap.killTweensOf(track);
            let direction = index % 2 === 0 ? -1 : 1;
            
            if(direction === 1) gsap.set(track, { xPercent: -50 });
            else gsap.set(track, { xPercent: 0 });

            const isMobile = window.innerWidth <= 768;
            const duration = isMobile ? 18 : 55;

            const tween = gsap.to(track, {
                xPercent: direction === -1 ? -50 : 0,
                repeat: -1,
                duration: duration, 
                ease: "linear"
            });

            track.addEventListener("mouseenter", () => tween.timeScale(0.3));
            track.addEventListener("mouseleave", () => tween.timeScale(1));
            track.addEventListener("touchstart", () => tween.timeScale(0.3), { passive: true });
            track.addEventListener("touchend", () => tween.timeScale(1), { passive: true });
        });
    };
    window.initMarquees = initMarquees;

    const initMagnetic = () => {
        const magneticItems = document.querySelectorAll('.magnetic-item');
        magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(item, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.6,
                    ease: "power3.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    };
    window.initMagnetic = initMagnetic;

    setTimeout(() => {
        initMarquees();
        initMagnetic();
    }, 500);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.initMarquees) window.initMarquees();
        }, 250);
    }, { passive: true });

    // 4. Portrait Morph & Entrance Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const portraitWrap = document.querySelector('.portrait-wrap');
    if (portraitWrap) {
        observer.observe(portraitWrap);
    }
});
