/* ============================================================
   ScrollReveal — Vanilla JS word-by-word scroll animation
   Mirrors the lightswind <ScrollReveal> React component.

   KEY FIX: Uses trigger-based (once) animation instead of
   scrub — so words ALWAYS finish revealing regardless of
   scroll depth or screen size. Works perfectly on mobile too.
   ============================================================ */

(function () {
    'use strict';

    /* ── Config ─────────────────────────────────────────── */
    var BASE_OPACITY  = 0.07;   // starting opacity of each word
    var BLUR_STRENGTH = 6;      // px blur on un-revealed words
    var ENABLE_BLUR   = true;
    var STAGGER_EACH  = 0.045;  // seconds between each word
    var WORD_DURATION = 0.45;   // duration of each word's fade
    var TRIGGER_START = 'top 88%'; // when element enters view

    /* ── splitIntoWordSpans ─────────────────────────────── */
    function splitIntoWordSpans(el) {
        // If element already contains word spans, no need to re-split
        if (el.querySelector('.sr-word')) return false;

        var raw = el.textContent.trim();
        if (!raw) return false;

        el.dataset.srSplit = '1';

        /* Preserve whitespace by splitting on spaces */
        var words = raw.split(/(\s+)/);
        el.innerHTML = words.map(function (chunk) {
            if (/^\s+$/.test(chunk)) return chunk; // keep whitespace as-is
            return '<span class="sr-word">' +
                chunk.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;') +
                '</span>';
        }).join('');
        return true;
    }

    /* ── animateElement ─────────────────────────────────── */
    function animateElement(el) {
        var spans = el.querySelectorAll('.sr-word');
        if (!spans.length) return;

        // Clean up any prior ScrollTrigger attached to this element
        if (el._srTrigger) {
            try { el._srTrigger.kill(); } catch (e) {}
            el._srTrigger = null;
        }

        /* Set every word to dim+blurred initially */
        gsap.set(spans, {
            opacity: BASE_OPACITY,
            filter:  ENABLE_BLUR ? 'blur(' + BLUR_STRENGTH + 'px)' : 'none',
            willChange: 'opacity, filter'
        });

        function playReveal() {
            gsap.to(spans, {
                opacity:  1,
                filter:   ENABLE_BLUR ? 'blur(0px)' : 'none',
                duration: WORD_DURATION,
                ease:     'power2.out',
                stagger: {
                    each: STAGGER_EACH,
                    from: 'start'
                }
            });
        }

        // Check if element is already in the viewport
        var rect = el.getBoundingClientRect();
        var isAlreadyVisible = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

        if (isAlreadyVisible) {
            playReveal();
        } else {
            el._srTrigger = ScrollTrigger.create({
                trigger: el,
                start:   TRIGGER_START,
                once:    true,          // <-- fire once, always finish
                onEnter: playReveal
            });
        }
    }

    /* ── initScrollReveal ───────────────────────────────── */
    function initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initScrollReveal, 150);
            return;
        }

        /* Register plugin just in case it wasn't yet */
        if (gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);

        var els = document.querySelectorAll('.scroll-reveal');
        els.forEach(function (el) {
            var didSplit = splitIntoWordSpans(el);
            if (didSplit !== false) {
                animateElement(el);
            }
        });

        // Recalculate trigger coordinates
        try {
            ScrollTrigger.refresh();
        } catch (e) {}
    }

    /* ── Boot ───────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        /* Scripts at bottom of <body> — DOM already parsed */
        initScrollReveal();
    }

    // Also refresh on window load when images and styles are settled
    window.addEventListener('load', function () {
        setTimeout(initScrollReveal, 100);
    });

    /* Expose so main.js can call after dynamic render */
    window.initScrollReveal = initScrollReveal;

}());
