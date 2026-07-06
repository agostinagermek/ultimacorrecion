/*!
* Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav && window.bootstrap) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            responsiveNavItem.classList.add('is-marked');
            window.setTimeout(() => responsiveNavItem.classList.remove('is-marked'), 700);
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const featureIcons = document.querySelectorAll('.interactive-feature-icon');
    featureIcons.forEach((featureIcon) => {
        const markIcon = () => {
            featureIcon.classList.remove('is-marked');
            window.requestAnimationFrame(() => featureIcon.classList.add('is-marked'));
            window.setTimeout(() => featureIcon.classList.remove('is-marked'), 800);
        };

        featureIcon.addEventListener('click', markIcon);
        featureIcon.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                markIcon();
            }
        });
    });

    const rebuildSection = document.querySelector('.hp-rebuild-section');
    const rebuildProduct = document.querySelector('.hp-rebuild-product');
    const rebuildParts = {
        lid: document.querySelector('[data-rebuild-part="lid"]'),
        calibration: document.querySelector('[data-rebuild-part="calibration"]'),
        paper: document.querySelector('[data-rebuild-part="paper"]'),
        base: document.querySelector('[data-rebuild-part="base"]'),
    };
    const rebuildMarkers = document.querySelectorAll('.hp-rebuild-marker[data-rebuild-marker]');

    if (rebuildSection && rebuildProduct) {
        const getRebuildState = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            return isMobile
                ? { closed: { lid: 0, calibration: 0, paper: 0, base: 0 }, open: { lid: "-42%", calibration: "-16%", paper: "11%", base: "41%" } }
                : { closed: { lid: 0, calibration: 0, paper: 0, base: 0 }, open: { lid: "-42%", calibration: "-16%", paper: "11%", base: "41%" } };
        };

        const closeRebuildPopovers = () => {
            rebuildMarkers.forEach((marker) => marker.classList.remove('is-active'));
        };

        const applyRebuildState = (stateName, animate = true) => {
            const state = getRebuildState();
            const target = stateName === 'open' ? state.open : state.closed;
            Object.entries(rebuildParts).forEach(([partName, partElement]) => {
                if (!partElement) {
                    return;
                }
                const y = target[partName] || 0;
                if (window.gsap) {
                    gsap.to(partElement, {
                        x: 0,
                        y,
                        scale: 1,
                        rotation: 0,
                        rotationX: 0,
                        rotationY: 0,
                        duration: animate ? 1.15 : 0,
                        ease: 'power3.inOut',
                        force3D: true,
                    });
                } else {
                    partElement.style.transform = `translate3d(0, ${y}px, 0)`;
                }
            });
            rebuildSection.classList.toggle('is-rebuild-open', stateName === 'open');
            if (stateName !== 'open') {
                closeRebuildPopovers();
            }
        };

        rebuildMarkers.forEach((marker) => {
            marker.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasActive = marker.classList.contains('is-active');
                closeRebuildPopovers();
                if (!wasActive) {
                    marker.classList.add('is-active');
                }
            });
        });

        document.querySelectorAll('[data-mobile-rebuild-info]').forEach((card) => {
            card.addEventListener('click', (event) => {
                event.stopPropagation();
                const targetMarker = document.querySelector(`[data-rebuild-marker="${card.dataset.mobileRebuildInfo}"]`);
                if (!targetMarker) {
                    return;
                }
                const wasActive = targetMarker.classList.contains('is-active');
                closeRebuildPopovers();
                if (!wasActive) {
                    targetMarker.classList.add('is-active');
                }
            });
        });

        rebuildProduct.addEventListener('click', (event) => {
            if (event.target.closest('.hp-rebuild-marker')) {
                return;
            }
            applyRebuildState('open', true);
        });

        rebuildSection.addEventListener('click', (event) => {
            if (!event.target.closest('.hp-rebuild-marker') && rebuildSection.classList.contains('is-rebuild-open')) {
                closeRebuildPopovers();
            }
        });

        applyRebuildState('closed', false);

        let rebuildOpenTimer;
        const rebuildObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                window.clearTimeout(rebuildOpenTimer);
                if (entry.isIntersecting) {
                    rebuildOpenTimer = window.setTimeout(() => applyRebuildState('open', true), 5000);
                }
            });
        }, { threshold: 0.52 });

        rebuildObserver.observe(rebuildSection);
    }

    const revealItems = [];
    const revealSet = new Set();
    const revealSections = document.querySelectorAll([
        '.reference-hero',
        '#features',
        '.product-reference-section',
        '.sticky-notes-section',
        '.creativity-section',
        '.how-it-works',
        'section.cta',
        '#reviews',
        '.site-footer'
    ].join(','));
    const revealGroups = [
        ['.reference-hero-copy', '.reference-hero-art'],
        ['#features .feature-item'],
        ['.product-reference-media', '.product-reference-copy'],
        ['.product-reference-list li'],
        ['.sticky-notes-heading', '.sticky-note'],
        ['.sticky-note-photo'],
        ['.creativity-title', '.creativity-subtitle'],
        ['.glass-creative-card'],
        ['.how-it-works-heading', '.how-step-card'],
        ['.how-step-frame', '.how-step-copy'],
        ['.review-glass-card'],
        ['.cta h2', '.cta .btn'],
        ['.site-footer .row > div'],
        ['.site-footer-bottom']
    ];

    revealSections.forEach((section) => {
        revealItems.push(section);
        section.classList.add('section-reveal');
        if (section.classList.contains('reference-hero')) {
            section.classList.add('is-visible');
        }
    });

    revealGroups.forEach((group) => {
        const groupItems = group.flatMap((selector) => Array.from(document.querySelectorAll(selector)));

        groupItems.forEach((item, index) => {
            if (revealSet.has(item)) {
                return;
            }

            revealSet.add(item);
            revealItems.push(item);
            item.classList.add('reveal-on-scroll');
            item.style.setProperty('--reveal-delay', `${index * 70}ms`);
        });
    });

    const revealVisibleItems = () => {
        const triggerLine = window.innerHeight * 0.92;
        revealItems.forEach((item) => {
            if (item.classList.contains('is-visible')) {
                return;
            }

            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerLine) {
                item.classList.add('is-visible');
            }
        });
    };

    revealVisibleItems();
    window.addEventListener('scroll', revealVisibleItems, { passive: true });
    window.addEventListener('resize', revealVisibleItems);
    window.setTimeout(revealVisibleItems, 250);

    const parallaxBg = document.querySelector('.creativity-parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }, { passive: true });
    }

    const reviewsTrack = document.querySelector('#reviewsTrack');
    const reviewPrev = document.querySelector('.reviews-nav-prev');
    const reviewNext = document.querySelector('.reviews-nav-next');
    const reviewCards = reviewsTrack ? Array.from(reviewsTrack.querySelectorAll('.review-glass-card')) : [];
    let activeReviewIndex = 0;

    const setActiveReview = (nextIndex) => {
        if (!reviewsTrack || !reviewCards.length) {
            return;
        }

        activeReviewIndex = (nextIndex + reviewCards.length) % reviewCards.length;
        reviewCards.forEach((card, index) => card.classList.toggle('is-active', index === activeReviewIndex));
    };

    const scrollReviews = (direction) => {
        if (!reviewsTrack || !reviewCards.length) {
            return;
        }

        setActiveReview(activeReviewIndex + direction);
    };

    setActiveReview(activeReviewIndex);
    reviewPrev?.addEventListener('click', () => scrollReviews(-1));
    reviewNext?.addEventListener('click', () => scrollReviews(1));

    // Glassmorphism IntersectionObserver for steps
    const glassObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                if(entry.target.classList.contains('glass-step-card')) {
                    entry.target.classList.add('glass-visible');
                } else if(entry.target.tagName.toLowerCase() === 'img') {
                    entry.target.classList.add('glass-img-visible');
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-step-card, .how-it-works-visual img').forEach(el => glassObserver.observe(el));

    // ===== Pro Gallery – Entrance Animations =====
    const galleryItems = document.querySelectorAll('.pro-gallery-reveal');
    if (galleryItems.length) {
        const galleryObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    galleryObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        galleryItems.forEach(el => galleryObs.observe(el));
    }

    // ===== Pro Gallery – Lightbox =====
    const lightbox = document.getElementById('proLightbox');
    const lightboxImg = document.getElementById('proLightboxImg');
    const lightboxCounter = document.getElementById('proLightboxCounter');
    const gallerySrcs = [];

    document.querySelectorAll('.pro-gallery-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) gallerySrcs.push(img.src);
    });

    let currentIdx = 0;

    function openLightbox(idx) {
        currentIdx = idx;
        lightboxImg.src = gallerySrcs[currentIdx];
        lightboxImg.alt = document.querySelectorAll('.pro-gallery-item')[currentIdx].querySelector('img').alt;
        lightboxCounter.textContent = (currentIdx + 1) + ' / ' + gallerySrcs.length;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        currentIdx = (currentIdx + dir + gallerySrcs.length) % gallerySrcs.length;
        lightboxImg.src = gallerySrcs[currentIdx];
        lightboxImg.alt = document.querySelectorAll('.pro-gallery-item')[currentIdx].querySelector('img').alt;
        lightboxCounter.textContent = (currentIdx + 1) + ' / ' + gallerySrcs.length;
    }

    document.querySelectorAll('.pro-gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-gallery-idx'), 10);
            openLightbox(idx);
        });
    });

    if (lightbox) {
        lightbox.querySelector('.pro-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.pro-lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.pro-lightbox-next').addEventListener('click', () => navigateLightbox(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }
});
