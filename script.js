// script.js
// Codex Handoff:
// - data-animate要素はIntersectionObserverでフェード制御。
// - ink-traceはスクロール量で位置と濃度を変化させ、筆致の残像を演出。
// - JS無効時でも主要情報は表示されるようCSSでdisplay:noneは使用していない。変更時はこの方針を維持してください。
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('has-js');

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (menuButton && nav) {
    const toggleNav = () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    };

    menuButton.addEventListener('click', toggleNav);

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          menuButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item, index) => {
    const button = item.querySelector('.faq__question-button');
    const answer = item.querySelector('.faq__answer');
    if (!button || !answer) return;

    const answerId = answer.id || `faq-answer-${index + 1}`;
    answer.id = answerId;
    button.setAttribute('aria-controls', answerId);

    if (index !== 0) {
      answer.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    } else {
      button.setAttribute('aria-expanded', 'true');
    }

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });

  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.25
        }
      );

      animatedElements.forEach((element) => observer.observe(element));
    } else {
      animatedElements.forEach((element) => element.classList.add('is-visible'));
    }
  }

  const inkTrace = document.querySelector('.ink-trace');
  if (inkTrace) {
    const updateInk = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const translateY = -(scrollY * 0.14);
      const sway = Math.sin(scrollY / 520) * 1.1;
      const opacity = Math.min(0.18, 0.1 + scrollY / 3600);
      inkTrace.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${sway}deg)`;
      inkTrace.style.opacity = opacity.toFixed(3);
    };

    updateInk();
    window.addEventListener('scroll', updateInk, { passive: true });
    window.addEventListener('resize', updateInk);
  }
});
