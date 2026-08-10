/* ============================================================
   Portfolio Core Script — js/main.js
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. NAVBAR & SCROLL
    ---------------------------------------------------------- */
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');

    /* Desktop scroll effect & active section tracking */
    const navLinksList = document.querySelectorAll('#nav-links a');
    const sectionsList = document.querySelectorAll('section[id], div[id="home"]');

    let isTicking = false;

    function handleNavScroll() {
        if (!isTicking) {
            window.requestAnimationFrame(function () {
                if (navbar) {
                    navbar.classList.toggle('scrolled', window.scrollY > 35);
                }

                // Active link spy
                let currentSectionId = '';
                const scrollPos = window.scrollY + 180;
                
                sectionsList.forEach(function (sec) {
                    const top = sec.offsetTop;
                    const height = sec.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSectionId = sec.getAttribute('id');
                    }
                });

                navLinksList.forEach(function (link) {
                    const href = link.getAttribute('href');
                    if (href === '#' + currentSectionId || (currentSectionId === 'home' && href === '#about' && window.scrollY < 200)) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                isTicking = false;
            });
            isTicking = true;
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
    handleNavScroll();

    /* Mobile Nav Drawer */
    const mobileDrawer   = document.getElementById('mobile-nav-drawer');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const drawerClose    = document.getElementById('mobile-drawer-close');

    function openMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('open');
        if (hamburger) hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerClose)    drawerClose.addEventListener('click', closeMobileDrawer);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileDrawer);

    if (mobileDrawer) {
        mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', closeMobileDrawer);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
            closeMobileDrawer();
        }
    });

    var scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------
       2. REVEAL OBSERVER & COUNT-UP
    ---------------------------------------------------------- */
    function initReveal() {
        var reveals = document.querySelectorAll('.reveal');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Count-up animation for big-num children
                    var nums = entry.target.querySelectorAll('.big-num');
                    nums.forEach(function(num) { countUp(num); });

                    observer.unobserve(entry.target);
                }
            });
        /* rootMargin: no negative bottom — ensures elements at page
           bottom always fire even with limited scroll distance.
           threshold 0.05 = fires as soon as 5% is visible (mobile safe). */
        }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    }

    function countUp(el) {
        var fullText = el.textContent.trim();
        var numMatch = fullText.match(/^([0-9,.]+)(.*)$/);
        if (!numMatch) return;
        
        var targetVal = parseFloat(numMatch[1].replace(/,/g, ''));
        var suffix = numMatch[2] || '';
        if (isNaN(targetVal)) return;

        var duration = 2000;
        var startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = timestamp - startTime;
            var easeOutExpo = function(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
            var easedProgress = easeOutExpo(Math.min(progress / duration, 1));
            
            var currentVal = targetVal * easedProgress;
            var displayVal = numMatch[1].indexOf('.') > -1 ? currentVal.toFixed(1) : Math.floor(currentVal);
            
            el.textContent = displayVal + suffix;

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                el.textContent = fullText;
            }
        }
        requestAnimationFrame(animate);
    }

    /* ----------------------------------------------------------
       3. PERSISTENCE & DATA MODEL
    ---------------------------------------------------------- */
    var STORE_KEY = 'dnova_cms_v2';

    function loadDataObj() {
        var local = {};
        try {
            local = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
        } catch (e) {
            local = {};
        }
        
        var c = window.CMS_CONFIG || {};

        // Merge defaults if fields not present in local
        if (!local.pageTitle && c.site) local.pageTitle = c.site.pageTitle;
        if (!local.metaDescription && c.site) local.metaDescription = c.site.metaDescription;
        if (!local.logoName && c.site) local.logoName = c.site.logoName;
        if (!local.footerText && c.site) local.footerText = c.site.footerText;

        if (!local.heroTitle && c.hero) local.heroTitle = c.hero.title;
        if (!local.heroSubtitle && c.hero) local.heroSubtitle = c.hero.subtitle;

        if (!local.aboutDesc && c.about) local.aboutDesc = c.about.description;
        if (!local.aboutStats && c.about) local.aboutStats = c.about.stats;

        if (!local.skills && c.skills) local.skills = c.skills;
        if (!local.projects && c.projects) local.projects = c.projects;
        if (!local.experience && c.experience) local.experience = c.experience;
        if (!local.education && c.education) local.education = c.education;

        if (!local.resumeDesc && c.resume) local.resumeDesc = c.resume.description;
        if (!local.resumeLabel && c.resume) local.resumeLabel = c.resume.buttonText;
        if (!local.resumeData && c.resume) local.resumeData = c.resume.fileData;
        if (!local.resumeFileName && c.resume) local.resumeFileName = c.resume.fileName;
        
        if (!local.socials && c.socials) local.socials = c.socials;
        if (local.socials && !Array.isArray(local.socials)) {
            var socArr = [];
            if (local.socials.linkedin) socArr.push({ label: 'LinkedIn', url: local.socials.linkedin });
            if (local.socials.github) socArr.push({ label: 'GitHub', url: local.socials.github });
            if (local.socials.leetcode) socArr.push({ label: 'LeetCode', url: local.socials.leetcode });
            if (local.socials.instagram) socArr.push({ label: 'Instagram', url: local.socials.instagram });
            local.socials = socArr;
        }

        // Sanitize every social URL: auto-prefix mailto:, https://, or tel:
        if (Array.isArray(local.socials)) {
            local.socials = local.socials.map(function (s) {
                if (s && s.url) {
                    return { label: s.label, url: sanitizeLinkUrl(s.url) };
                }
                return s;
            });

            // Ensure Mail Me is always in the list (add if missing)
            var hasMailMe = local.socials.some(function (s) {
                return s && s.url && s.url.startsWith('mailto:');
            });
            if (!hasMailMe) {
                local.socials.push({ label: 'Mail Me !', url: 'mailto:prathoshprathosh78@gmail.com' });
            }
        }

        if (!local.portraitSrc && c.portrait) local.portraitSrc = c.portrait.src;

        return local;
    }

    function sanitizeLinkUrl(rawUrl) {
        if (!rawUrl || rawUrl === '#') return '#';
        var url = String(rawUrl).trim();
        if (!url || url === '#') return '#';

        // 1. Check for email address (e.g. prathoshprathosh78@gmail.com or mailto:...)
        if (url.indexOf('@') > -1 && !url.startsWith('http://') && !url.startsWith('https://')) {
            return url.startsWith('mailto:') ? url : 'mailto:' + url;
        }

        // 2. Check for phone number
        if (/^\+?[0-9\s\-()]{7,}$/.test(url) && !url.startsWith('http')) {
            return 'tel:' + url.replace(/\s+/g, '');
        }

        // 3. Check for whatsapp short link (wa.me/...)
        if (url.startsWith('wa.me/')) {
            return 'https://' + url;
        }

        // 4. Web URLs: if missing protocol, add https://
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('#') && !url.startsWith('/')) {
            return 'https://' + url;
        }

        return url;
    }

    function loadSaved() {
        var data = loadDataObj();

        // 1. Site Branding & Browser Title (Prathosh — Premium Portfolio)
        if (data.pageTitle) {
            if (document.title.indexOf('All Projects') > -1) {
                var brand = data.logoName || data.pageTitle.split('—')[0].trim();
                document.title = 'All Projects — ' + brand;
            } else {
                document.title = data.pageTitle;
            }
        }

        // Meta Description tag
        if (data.metaDescription) {
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', data.metaDescription);
        }

        // Navbar & Brand Logo
        if (data.logoName) {
            var logoEls = document.querySelectorAll('#nav-logo, .brand-text, .brand-name, .logo, .mobile-drawer-logo');
            logoEls.forEach(function (el) { el.textContent = data.logoName; });
        }

        // Footer copyright text
        if (data.footerText) {
            var footerEl = document.getElementById('footer-text');
            if (footerEl) footerEl.textContent = data.footerText;
        }

        // 2. Hero Section
        if (data.heroTitle) {
            var ht = document.getElementById('hero-title');
            if (ht) {
                var parts = data.heroTitle.split('\n');
                if (parts.length > 1) {
                    ht.innerHTML = parts.map(function(p, idx) {
                        return idx === 1 ? '<span class="glow-text">' + escHtml(p) + '</span>' : escHtml(p);
                    }).join('<br>');
                } else {
                    ht.textContent = data.heroTitle;
                }
            }
        }

        if (data.heroSubtitle) {
            var hs = document.getElementById('hero-subtitle');
            if (hs) {
                var safeStr = escHtml(data.heroSubtitle);
                if (safeStr.indexOf('Prathosh') > -1) {
                    safeStr = safeStr.replace(/Prathosh/g, '<span>Prathosh</span>');
                }
                hs.innerHTML = safeStr;
            }
        }

        // 3. Portrait image
        if (data.portraitSrc) {
            var portraitEl = document.getElementById('portrait-img') || document.getElementById('hero-portrait');
            if (portraitEl) portraitEl.src = data.portraitSrc;
        }

        // 4. About & Stats
        if (data.aboutDesc) {
            var ad = document.getElementById('about-desc');
            if (ad) ad.textContent = data.aboutDesc;
        }

        if (data.aboutStats && Array.isArray(data.aboutStats)) {
            data.aboutStats.forEach(function (s, i) {
                var numEl = document.getElementById('about-stat' + (i + 1));
                var lblEl = document.getElementById('about-stat' + (i + 1) + '-label');
                var val = s.val || s.num;
                if (numEl && val) numEl.textContent = val;
                if (lblEl && s.label) lblEl.textContent = s.label;
            });
        }

        // 5. Skills list
        if (data.skills && Array.isArray(data.skills)) {
            renderSkills(data.skills);
        }

        // 6. Projects list
        if (data.projects && Array.isArray(data.projects)) {
            renderProjects(data.projects);
        }

        // 7. Education Timeline
        if (data.education && Array.isArray(data.education)) {
            renderTimeline('education-timeline', data.education);
        }

        // 8. Experience Timeline
        if (data.experience && Array.isArray(data.experience)) {
            renderTimeline('experience-timeline', data.experience);
        }

        // 9. Resume & Socials
        updateResumeUI(data);
        updateSocialsUI(data);

        initReveal();

        // Re-init and refresh scroll reveal after dynamic DOM changes
        setTimeout(function () {
            if (window.initScrollReveal) window.initScrollReveal();
        }, 60);
    }

    function updateSocialsUI(data) {
        var socialsList = document.getElementById('socials-list');
        if (!socialsList || !data.socials) return;

        var links = Array.isArray(data.socials) ? data.socials : [];
        if (!Array.isArray(data.socials) && typeof data.socials === 'object') {
            links = Object.keys(data.socials).map(function(k) {
                var name = k.charAt(0).toUpperCase() + k.slice(1);
                return { label: name, url: data.socials[k] };
            });
        }

        var validLinks = links.filter(function(item) {
            return item && item.label && item.label.trim() !== '';
        });

        if (validLinks.length > 0) {
            socialsList.innerHTML = validLinks.map(function(s) {
                var formattedUrl = sanitizeLinkUrl(s.url);
                var isMailto = formattedUrl.startsWith('mailto:');
                var isTel = formattedUrl.startsWith('tel:');
                var targetAttr = (isMailto || isTel || formattedUrl === '#') ? '' : ' target="_blank" rel="noopener noreferrer"';

                return '<a href="' + escHtml(formattedUrl) + '"' + targetAttr + ' class="social-chip magnetic-item">' + escHtml(s.label) + '</a>';
            }).join('');

            if (window.initMagnetic) window.initMagnetic();
        }
    }

    function updateResumeUI(data) {
        var link = document.getElementById('resume-link');
        var view = document.getElementById('resume-view');
        var desc = document.getElementById('resume-desc');
        
        if (data.resumeDesc && desc) {
            desc.textContent = data.resumeDesc;
        }
        if (data.resumeLabel && link) link.textContent = data.resumeLabel;

        var defaultResume = 'Prathosh_S_Web_Developer_Resume.pdf';
        var fileName = data.resumeFileName || defaultResume;

        if (data.resumeData && data.resumeData.startsWith('data:')) {
            if (link) {
                link.href = data.resumeData;
                link.download = fileName;
            }
            if (view) {
                view.href = 'javascript:void(0)';
                view.onclick = function(e) { 
                    e.preventDefault(); 
                    var finalUrl = data.resumeData;
                    if (finalUrl.startsWith('data:')) {
                        finalUrl = finalUrl.replace(/^data:[^;]+;/, 'data:application/pdf;');
                    }
                    window.openResumeModal(finalUrl); 
                };
                view.removeAttribute('target');
                view.removeAttribute('rel');
            }
        } else {
            if (link) {
                link.href = defaultResume;
                link.download = fileName;
            }
            if (view) {
                view.href = 'javascript:void(0)';
                view.onclick = function(e) { 
                    e.preventDefault(); 
                    var fallbackData = (typeof window.DEFAULT_RESUME_DATA !== 'undefined') ? window.DEFAULT_RESUME_DATA : defaultResume;
                    window.openResumeModal(fallbackData); 
                };
                view.removeAttribute('target');
                view.removeAttribute('rel');
            }
        }
    }

    window.openResumeModal = function(url) {
        window.open('resume.html', '_blank');
    };

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1].replace(/\s/g, '')), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    function setInner(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* ----------------------------------------------------------
       4. RENDER UIs
    ---------------------------------------------------------- */
    function renderSkills(arr) {
        var grid = document.getElementById('skills-grid');
        if (!grid) return;
        if (arr.length === 0) {
            grid.innerHTML = '<p style="color:var(--muted); text-align:center;">No skills added yet.</p>';
            return;
        }
        
        var half = Math.ceil(arr.length / 2);
        var firstHalf = arr.slice(0, half);
        var secondHalf = arr.slice(half);
        if (secondHalf.length === 0) secondHalf = [...firstHalf];
        
        var renderRow = function(rowArr) {
            var itemsHtml = rowArr.map(function(s) {
                return '<span class="skill-text-chip marquee-item magnetic-item" data-skill="' + escHtml(s) + '">' + escHtml(s) + '</span>';
            }).join('');
            return itemsHtml + itemsHtml + itemsHtml + itemsHtml + itemsHtml + itemsHtml; 
        };
        
        grid.innerHTML = `
            <div class="marquee-wrapper">
                <div class="marquee-track track-1">
                    ${renderRow(firstHalf)}
                </div>
                <div class="marquee-track track-2">
                    ${renderRow(secondHalf)}
                </div>
            </div>
        `;
        
        if (window.initMarquees) window.initMarquees();
        if (window.initMagnetic) window.initMagnetic();
    }

    function renderProjects(arr) {
        var grid = document.getElementById('projects-grid');
        if (!grid) return;
        if (arr.length === 0) {
            grid.innerHTML = '<p style="color:var(--muted); text-align:center;">No projects added yet.</p>';
            return;
        }
        
        // Show top 3 on homepage, all on projects page
        var isHomepage = document.getElementById('projects-grid') && !document.title.includes('All Projects');
        var displayArr = isHomepage ? arr.slice(0, 3) : arr;
        
        grid.innerHTML = displayArr.map(function (p) {
            var imgSrc = p.img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop';
            var linkUrl = p.link || '';
            // showLink defaults true for backward compat; hide only when explicitly false
            var showLink = p.showLink !== false;
            var linkHtml = (showLink && linkUrl && linkUrl !== '#')
                ? '<a href="' + escHtml(linkUrl) + '" class="project-link" target="_blank" rel="noopener noreferrer">See Live Link &#x2192;</a>'
                : '';
            return '<div class="project-card reveal">' +
                '<div class="project-img-wrap">' +
                    '<img src="' + escHtml(imgSrc) + '" alt="' + escHtml(p.title) + '" loading="lazy">' +
                '</div>' +
                '<div class="project-body">' +
                    '<h3>' + escHtml(p.title) + '</h3>' +
                    '<p class="scroll-reveal">' + escHtml(p.desc) + '</p>' +
                    linkHtml +
                '</div>' +
            '</div>';
        }).join('');
        
        if (window.attachProjectTransitions) window.attachProjectTransitions();
        if (window.initProjectHover) window.initProjectHover();
        if (window.initScrollReveal) window.initScrollReveal();
    }

    function renderTimeline(containerId, arr) {
        var tl = document.getElementById(containerId);
        if (!tl) return;
        if (!arr || arr.length === 0) {
            tl.innerHTML = '';
            tl.style.display = 'none';
            return;
        }
        tl.style.display = 'block';
        // Experience section: never show tags (they're in Skills section)
        var isExperience = containerId === 'experience-timeline';
        tl.innerHTML = arr.map(function (item) {
            // Date: use pill badge style
            var dateHtml = '<span class="tl-date-badge">' + escHtml(item.date) + '</span>';

            // Grade badge (education only)
            var gradeHtml = item.grade
                ? '<div class="tl-grade">' + escHtml(item.grade) + '</div>'
                : '';

            // Tech-stack tags — only show in education, not experience
            var tagsHtml = '';
            if (!isExperience && item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
                tagsHtml = '<div class="tl-tags">' +
                    item.tags.map(function (t) {
                        return '<span class="tl-tag">' + escHtml(t) + '</span>';
                    }).join('') +
                '</div>';
            }

            return '<div class="timeline-item reveal">' +
                '<div class="tl-dot"></div>' +
                '<div class="tl-body">' +
                    dateHtml +
                    '<h3>' + escHtml(item.role) + '</h3>' +
                    '<h4 class="tl-org">' + escHtml(item.org) + '</h4>' +
                    '<p class="scroll-reveal">' + escHtml(item.desc) + '</p>' +
                    tagsHtml +
                    gradeHtml +
                '</div>' +
            '</div>';
        }).join('');
        // Re-init scroll reveal for newly rendered items
        if (window.initScrollReveal) window.initScrollReveal();
    }

    function escHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Expose helpers for storage and external pages
    window.STORE_KEY = STORE_KEY;
    window.loadCMSData = loadDataObj;

    // Initialize on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSaved);
    } else {
        loadSaved();
    }

}());
