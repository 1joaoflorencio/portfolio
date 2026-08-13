document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Declarado aqui em cima porque o hidePreloader (definido antes da
    // inicialização do Lenis) precisa poder referenciá-lo com segurança.
    let lenis = null;

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    navToggle?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinkItems.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle?.classList.remove('open');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        if (!preloader) return;
        preloader.remove();
        document.body.classList.remove('lock-scroll');
        // overflow:hidden não segura o Lenis; ele precisa ser parado/religado
        if (lenis) lenis.start();
    };

    if (typeof gsap === 'undefined') {
        hidePreloader();
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Scroll suave (Lenis) ----------
       Precisa ser dirigido pelo ticker do GSAP, senão o ScrollTrigger
       dessincroniza do scroll real. */
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        lenis = new Lenis({ duration: 1.1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        document.documentElement.classList.remove('no-js');
    }

    const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
    ) || 76;

    if (lenis) {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href');
                if (!id || id === '#') return;
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                lenis.scrollTo(target, { offset: -navHeight });
            });
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const setActiveLink = (id) => {
        navLinkItems.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
        });
    };

    sections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveLink(section.id),
            onEnterBack: () => setActiveLink(section.id),
        });
    });

    const playHeroIntro = () => {
        gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })
            .fromTo('.nav-inner', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
            .fromTo('.hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.3')
            .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.7')
            .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.7')
            .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
            .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
    };

    if (prefersReducedMotion) {
        hidePreloader();
    } else if (preloader) {
        gsap.set('.nav-inner, .hero-eyebrow, .hero-title, .hero-subtitle, .hero-actions, .scroll-cue', { opacity: 0 });
        document.body.classList.add('lock-scroll');
        if (lenis) lenis.stop();
        const safety = setTimeout(() => {
            hidePreloader();
            playHeroIntro();
        }, 4000);

        gsap.timeline({
            onComplete: () => {
                clearTimeout(safety);
                hidePreloader();
                playHeroIntro();
            },
        })
            .from('.preloader-inner', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' })
            .to('.preloader-bar span', { width: '100%', duration: 1, ease: 'power2.inOut' })
            .set(preloader, { pointerEvents: 'none' })
            .to(preloader, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.2');
    } else {
        playHeroIntro();
    }

    if (prefersReducedMotion) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && canHover) {
        const glowX = gsap.quickTo(cursorGlow, 'x', { duration: 0.6, ease: 'power3' });
        const glowY = gsap.quickTo(cursorGlow, 'y', { duration: 0.6, ease: 'power3' });

        window.addEventListener('mousemove', (e) => {
            cursorGlow.classList.add('active');
            glowX(e.clientX);
            glowY(e.clientY);
        }, { passive: true });

        window.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
    }

    /* ---------- Botões magnéticos ----------
       O deslocamento é limitado: passar de ~15px lê como bug, não como efeito. */
    if (canHover) {
        document.querySelectorAll('.btn').forEach((btn) => {
            const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
            const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
            const reset = () => { xTo(0); yTo(0); };

            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                xTo(gsap.utils.clamp(-14, 14, (e.clientX - r.left - r.width / 2) * 0.3));
                yTo(gsap.utils.clamp(-10, 10, (e.clientY - r.top - r.height / 2) * 0.4));
            });

            btn.addEventListener('mouseleave', reset);
            btn.addEventListener('blur', reset);
        });
    }

    /* ---------- Títulos: revelação mascarada linha a linha ----------
       O texto sobe de trás de um recorte em vez de só surgir — lê como
       tipografia, não como biblioteca de scroll genérica. */
    if (typeof SplitText !== 'undefined') {
        gsap.registerPlugin(SplitText);

        document.querySelectorAll('.section-title').forEach((el) => {
            // sai do fluxo do .reveal para não animar duas vezes
            el.classList.remove('reveal');

            const split = new SplitText(el, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
                yPercent: 110,
                duration: 0.9,
                stagger: 0.04,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
            });
        });
    }

    gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 'top top', end: 'max', scrub: 0.3 },
    });

    gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
        });
    });

});
