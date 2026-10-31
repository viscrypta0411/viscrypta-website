document.addEventListener('DOMContentLoaded', () => {

  /* ── Dynamic sticky header on scroll ────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.section-heading, .application-card, .feature-card, .price-card, .team-card, .story-aside, .story-copy, .about-content-panel, .architecture, .contact-form, .contact-aside, .cta-band, .portfolio-card, .deployment-card, .roadmap-row, .engagement-note'
  );
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.transitionDelay = `${(index % 4) * 70}ms`;
      revealObserver.observe(element);
    });
  }

  /* ── Video section reveal ──────────────────────────────── */
  const revealSection = document.querySelector('.video-reveal');
  if (revealSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(revealSection);
  } else if (revealSection) {
    revealSection.classList.add('is-visible');
  }

  /* ── Local video click-to-play facade ─────────────────── */
  document.querySelectorAll('.yt-facade').forEach((facade) => {
    let isPlayed = false;
    const activate = () => {
      if (isPlayed) return;
      const videoSrc = facade.dataset.video;
      if (!videoSrc) return;
      const frame = facade.closest('.video-embed-frame');
      if (!frame) return;

      isPlayed = true;
      const video = document.createElement('video');
      video.src = videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', 'Viscrypta product demo video');

      frame.innerHTML = '';
      frame.appendChild(video);
    };

    facade.addEventListener('click', activate);
    facade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  /* ── Mobile navigation toggle ──────────────────────────── */
  const menuButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    const setMenuOpen = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('is-open');
      navLinks.classList.toggle('is-open', isOpen);
      menuButton.classList.toggle('is-active', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuOpen();
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('click', (event) => {
      if (navLinks.classList.contains('is-open') && !event.target.closest('.site-header')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
  }

});
