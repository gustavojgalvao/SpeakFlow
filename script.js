/* ================================================
   script.js — Ana Costa English
   ================================================ */

(function () {
  'use strict';

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header scroll shadow ---- */
  const header = document.querySelector('.header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger-btn');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('is-open');
      mainNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mainNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('is-open');
        mainNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Logo: scroll to top + close mobile menu ---- */
  const logoLink = document.querySelector('.header__logo');
  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      // Fecha menu mobile se estiver aberto
      if (hamburger && mainNav && mainNav.classList.contains('is-open')) {
        hamburger.classList.remove('is-open');
        mainNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- FAQ accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn    = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherBtn    = other.querySelector('.faq-item__question');
          const otherAnswer = other.querySelector('.faq-item__answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Toggle this one
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });

  /* ---- Animações GSAP virão no final do arquivo ---- */

  /* ---- Smooth active nav highlight on scroll ---- */
  const sections = document.querySelectorAll('section[id], main > .cta-banner');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) {
        currentId = sec.getAttribute('id') || '';
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        'nav__link--active',
        link.getAttribute('href') === '#' + currentId
      );
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---- WhatsApp float — hide/show based on scroll ---- */
  const floatBtn = document.querySelector('.whatsapp-float');
  let lastScrollY = 0;

  if (floatBtn) {
    window.addEventListener('scroll', function () {
      const currentY = window.scrollY;
      // Hide when scrolling down fast, show otherwise
      if (currentY > lastScrollY + 50) {
        floatBtn.style.transform = 'scale(0.85) translateY(8px)';
        floatBtn.style.opacity   = '0.7';
      } else {
        floatBtn.style.transform = '';
        floatBtn.style.opacity   = '';
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  /* ==============================================
     GSAP ANIMATIONS (Vanilla JS)
     ============================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Usa gsap.context() para facil cleanup se fosse um framework, 
    // e isola o escopo de variáveis.
    const ctx = gsap.context(() => {

      // MatchMedia para lidar com responsividade e prefers-reduced-motion
      let mm = gsap.matchMedia();

      // 1. Acessibilidade: Prefers Reduced Motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Apenas remove a opacidade suavemente sem movimentos espaciais
        gsap.to(".gsap-reveal", {
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1
        });
      });

      // 2. Animações Padrão (Sem reduced motion)
      mm.add("(prefers-reduced-motion: no-preference)", () => {

        // --- PREPARAÇÃO ---
        // Exibe tudo que estava hidden pelo CSS (.gsap-reveal) mas seta opacidade inicial pra 0
        gsap.set(".gsap-reveal", { autoAlpha: 0 });

        // --- HERO SECTION (Page Load) ---
        // Intenção: Coreografia fluida onde o título quebra em linhas, revelando de baixo pra cima,
        // seguido pelos badges e foto (com efeito leve na assinatura "92").
        
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Título dividido em linhas (se SplitType estiver disponível)
        if (typeof SplitType !== 'undefined') {
          const headlineSplit = new SplitType('.hero__headline', { types: 'lines', lineClass: 'split-line' });
          
          gsap.set(headlineSplit.lines, { y: 40, opacity: 0 });
          
          heroTl.to('.hero__headline.gsap-reveal', { autoAlpha: 1, duration: 0.1 })
                .to(headlineSplit.lines, {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.1
                }, "+=0.1");
        } else {
          // Fallback se SplitType falhar
          heroTl.fromTo('.hero__headline.gsap-reveal', 
            { y: 30, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 0.8 }
          );
        }

        // Subtítulo e badge principal fade in up
        heroTl.fromTo(['.hero__badge.gsap-reveal', '.hero__subheadline.gsap-reveal'],
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15 },
          "-=0.4"
        );

        // Foto da professora
        heroTl.fromTo('.hero__visual.gsap-reveal',
          { x: 20, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        );

        // CTAs e trust bar
        heroTl.fromTo(['.hero__ctas.gsap-reveal', '.hero__trust.gsap-reveal', '.social-proof-bar.gsap-reveal', '.hero__badges-text.gsap-reveal'],
          { y: 15, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        );


        // --- SCROLLTRIGGER BATCH: Modalidades / Metodologia / Jornada / Depoimentos ---
        // Intenção: Em vez de timelines individuais para cada card, Batch anima de forma escalonada
        // tudo que tem .gsap-reveal entrando na tela.

        const batchElements = ".gsap-reveal:not(.hero__headline):not(.hero__badge):not(.hero__subheadline):not(.hero__visual):not(.hero__ctas):not(.hero__trust):not(.hero__badges-text):not(.social-proof-bar)";
        
        gsap.set(batchElements, { y: 30, autoAlpha: 0 });

        ScrollTrigger.batch(batchElements, {
          interval: 0.1,
          batchMax: 3,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out", 
            stagger: 0.15,
            overwrite: true
          }),
          start: "top 100%",
          once: true
        });

        // Recalcula todos os triggers após o setup (resolve elementos já no viewport)
        ScrollTrigger.refresh();

        // Fallback de segurança: se após 1.5s algum .gsap-reveal ainda estiver oculto,
        // força a exibição para não deixar nenhum elemento invisível ou bloqueado.
        setTimeout(function () {
          document.querySelectorAll('.gsap-reveal').forEach(function (el) {
            const style = window.getComputedStyle(el);
            if (style.visibility === 'hidden' || parseFloat(style.opacity) < 0.1) {
              gsap.set(el, { autoAlpha: 1, y: 0, clearProps: 'transform' });
            }
          });
        }, 1500);

        // --- ROADMAP ANIMATION ---
        const roadmap = document.querySelector('.roadmap');
        if (roadmap) {
          ScrollTrigger.create({
            trigger: roadmap,
            start: "top 80%",
            onEnter: () => roadmap.classList.add('is-visible'),
            once: true
          });

          gsap.utils.toArray('.roadmap-step').forEach((step) => {
            ScrollTrigger.create({
              trigger: step,
              start: "top 85%",
              onEnter: () => step.classList.add('is-visible'),
              once: true
            });
          });
        }

        // --- PARALLAX EDITORIAL: Sobre a Professora ---
        // Intenção: Movimento sutil das aspas e da foto durante o scroll
        // para dar profundidade de revista, sem quebrar o layout.
        
        // Aspas se movem para cima mais rápido
        if (document.querySelector('.sobre__quote-mark')) {
          gsap.fromTo('.sobre__quote-mark', 
            { y: 30 },
            { 
              y: -50, 
              ease: "none",
              scrollTrigger: {
                trigger: '.sobre',
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }

        // Foto se move levemente pra baixo (efeito parallax inverso às aspas)
        if (document.querySelector('.sobre__photo.gsap-reveal')) {
          gsap.fromTo('.sobre__photo.gsap-reveal', 
            { y: -15 },
            { 
              y: 15, 
              ease: "none",
              scrollTrigger: {
                trigger: '.sobre',
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
        
      }); // fim matchMedia (no-preference)
      
    }); // fim gsap.context()
    
    // Cleanup não é estritamente necessário no Vanilla sem page transitions (SPA), 
    // mas está configurado com gsap.context() caso vire Next.js no futuro.
  }

})();
