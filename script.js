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

  /* ── Contact form AJAX submission and feedback ──────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    let feedback = document.getElementById('formSuccessMsg');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.id = 'formSuccessMsg';
      feedback.className = 'form-success';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      feedback.hidden = true;
      contactForm.appendChild(feedback);
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : '';

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      feedback.hidden = true;

      if (!contactForm.reportValidity()) return;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/viscrypta.tech@gmail.com', {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        const result = await response.json();
        if (!response.ok || result.success === false || result.success === 'false') {
          throw new Error(result.message || 'The form could not be submitted.');
        }

        contactForm.reset();
        feedback.textContent = 'Thank You For Submission, We will respond soon to you.';
        feedback.classList.remove('form-error');
        feedback.hidden = false;
        window.setTimeout(() => {
          feedback.hidden = true;
        }, 1800);
      } catch (error) {
        console.error('Contact form submission failed:', error);
        feedback.textContent = 'Sorry, your message could not be sent. Please try again or email us directly.';
        feedback.classList.add('form-error');
        feedback.hidden = false;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.section-heading, .application-card, .feature-card, .price-card, .team-card, .story-aside, .story-copy, .about-content-panel, .architecture, .contact-form, .contact-aside, .cta-band, .portfolio-card'
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
