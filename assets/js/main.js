(() => {
  'use strict';

  const settings = window.AIM_REHAB || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionOK = !reducedMotion.matches;
  const mouseFX = motionOK && finePointer.matches;

  // Eases a value pair towards a target on each frame and stops once settled.
  const follow = (apply, ease) => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      const settled = Math.abs(target.x - current.x) < 0.02 && Math.abs(target.y - current.y) < 0.02;
      if (settled) Object.assign(current, target);
      apply(current.x, current.y);
      frame = settled ? 0 : window.requestAnimationFrame(tick);
    };
    return (x, y, jump) => {
      target.x = x;
      target.y = y;
      if (jump) Object.assign(current, target);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
  };

  // Wraps each word of a heading so it can be animated. Text and spacing are unchanged.
  const splitWords = (element) => {
    let index = 0;
    const walk = (node) => Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) { walk(child); return; }
      if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return;
      const fragment = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (!part.trim()) { fragment.appendChild(document.createTextNode(part)); return; }
        const word = document.createElement('span');
        word.className = 'split-word';
        word.style.setProperty('--w', String(index++));
        word.textContent = part;
        fragment.appendChild(word);
      });
      child.replaceWith(fragment);
    });
    walk(element);
  };

  // Scroll reveals. Content stays visible when JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && motionOK) {
    // Two-column sections slide in from opposite sides.
    document.querySelectorAll('.about-grid, .why-grid').forEach((grid) => {
      const [first, second] = grid.children;
      if (first?.classList.contains('reveal')) first.dataset.reveal = 'left';
      if (second?.classList.contains('reveal')) second.dataset.reveal = 'right';
    });
    // Photos are uncovered with a wipe instead of fading with their section.
    document.querySelectorAll('.collage.reveal').forEach((collage) => collage.classList.remove('reveal'));
    document.querySelectorAll('.collage .img-main, .collage .img-small, .why-media, .promise-media .img, .feature-img, .profile-img')
      .forEach((element) => {
        element.classList.remove('reveal');
        element.classList.add('img-reveal');
        if (element.matches('.img-small')) element.style.setProperty('--d', '.3s');
      });
    // Cards in grids and list items rise one after another.
    document.querySelectorAll('.blog-grid, .team-grid, .plans, .stats, .svc-grid, .steps, .values, .info-cards, .plan-notes, .slider-track, .checklist, .feature-pair')
      .forEach((grid) => {
        grid.classList.remove('reveal');
        grid.classList.add('stagger');
        Array.from(grid.children).forEach((child, index) => child.style.setProperty('--i', String(Math.min(index, 8))));
      });
    // Section headings appear word by word. Headings holding links are left whole.
    document.querySelectorAll('main .title, .contact-form h2, .map-card h2, .cta-band h2, .faq-group > h2').forEach((heading) => {
      if (heading.querySelector('a, button')) return;
      splitWords(heading);
      heading.classList.add('split');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .stagger, .img-reveal, .split').forEach((element) => {
      element.classList.add('is-pending');
      observer.observe(element);
    });
  }

  // Hero photo drifts slower than the page on scroll and leans away from the mouse.
  if (motionOK) {
    document.querySelectorAll('.hero, .page-hero').forEach((hero) => {
      const image = hero.querySelector('.hero-media img');
      if (!image) return;
      let shift = 0;
      let mouseX = 0;
      let mouseY = 0;
      let ticking = false;
      const paint = () => { image.style.translate = `${mouseX.toFixed(2)}px ${(shift + mouseY).toFixed(2)}px`; };
      const onScroll = () => {
        ticking = false;
        const box = hero.getBoundingClientRect();
        if (box.bottom < 0) return;
        shift = Math.max(0, -box.top * 0.25);
        paint();
      };
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }, { passive: true });
      if (mouseFX && hero.classList.contains('hero')) {
        const lean = follow((x, y) => { mouseX = x; mouseY = y; paint(); }, 0.06);
        hero.addEventListener('pointermove', (event) => {
          if (event.pointerType !== 'mouse') return;
          const box = hero.getBoundingClientRect();
          lean(((event.clientX - box.left) / box.width - 0.5) * -24, ((event.clientY - box.top) / box.height - 0.5) * -16);
        });
        hero.addEventListener('pointerleave', () => lean(0, 0));
      }
    });
  }

  // Mouse effects: trailing cursor, card tilt and magnetic buttons. Mouse users only.
  if (mouseFX) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor is-hidden';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<div class="cursor-ring"><span class="cursor-label"></span></div><div class="cursor-dot"></div>';
    document.body.appendChild(cursor);
    const ring = cursor.firstElementChild;
    const dot = cursor.lastElementChild;
    const label = ring.firstElementChild;
    const moveRing = follow((x, y) => { ring.style.transform = `translate3d(${x}px, ${y}px, 0)`; }, 0.16);
    const moveDot = follow((x, y) => { dot.style.transform = `translate3d(${x}px, ${y}px, 0)`; }, 0.45);
    const interactive = 'a, button, [role="button"], label, select, summary';
    const labelled = [['.post-card', 'Read'], ['.svc-card', 'Explore']];
    const dark = '.hero, .page-hero, .approach, .plan.featured, .contact-photo, .contact-form, .map-card, .footer-main, .why-media, .cta-band, .side-cta, .drawer-panel';
    document.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const appearing = cursor.classList.contains('is-hidden');
      cursor.classList.remove('is-hidden');
      moveRing(event.clientX, event.clientY, appearing);
      moveDot(event.clientX, event.clientY, appearing);
    }, { passive: true });
    document.addEventListener('pointerover', (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target;
      const card = labelled.find(([selector]) => target.closest(selector));
      if (card) label.textContent = card[1];
      cursor.classList.toggle('has-label', Boolean(card));
      cursor.classList.toggle('is-hover', !card && Boolean(target.closest(interactive)));
      cursor.classList.toggle('is-text', Boolean(target.closest('input, textarea, iframe')));
      cursor.classList.toggle('is-dark', Boolean(target.closest(dark)));
    });
    // The pointer is lost to the browser frame or to the map iframe.
    document.addEventListener('pointerout', (event) => {
      if (!event.relatedTarget || event.relatedTarget.tagName === 'IFRAME') cursor.classList.add('is-hidden');
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    window.addEventListener('blur', () => cursor.classList.add('is-hidden'));

    // Cards tilt gently away from the pointer.
    document.querySelectorAll('.svc-card, .plan, .post-card, .step, .value, .info-card').forEach((card) => {
      const tilt = follow((x, y) => {
        const angle = Math.hypot(x, y);
        card.style.rotate = angle < 0.01 ? '' : `${x.toFixed(3)} ${y.toFixed(3)} 0 ${angle.toFixed(3)}deg`;
      }, 0.12);
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const box = card.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        tilt(-py * 8, px * 8);
      });
      card.addEventListener('pointerleave', () => tilt(0, 0));
    });

    // Buttons lean towards the pointer.
    document.querySelectorAll('.btn, .quote-nav button, .to-top').forEach((button) => {
      const pull = follow((x, y) => {
        button.style.translate = Math.abs(x) + Math.abs(y) < 0.05 ? '' : `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      }, 0.18);
      button.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const box = button.getBoundingClientRect();
        const clamp = (value) => Math.max(-8, Math.min(8, value));
        pull(clamp((event.clientX - box.left - box.width / 2) * 0.25), clamp((event.clientY - box.top - box.height / 2) * 0.35));
      });
      button.addEventListener('pointerleave', () => pull(0, 0));
    });
  }

  // Keep one answer open in each accordion.
  document.querySelectorAll('.acc-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.acc-item');
      const group = button.closest('.accordion');
      if (!item) return;
      const open = !item.classList.contains('is-open');
      group?.querySelectorAll('.acc-item.is-open').forEach((other) => {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.acc-btn')?.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  // Mobile menu, including keyboard focus and Escape to close.
  const drawer = document.querySelector('[data-drawer]');
  let menuOpener;
  const setMenuOpen = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;
    document.body.classList.toggle('no-scroll', open);
    document.querySelectorAll('[data-menu-open]').forEach((button) => {
      button.setAttribute('aria-expanded', String(open));
    });
    if (open) drawer.querySelector('button[data-menu-close]')?.focus();
    else menuOpener?.focus();
  };
  document.querySelectorAll('[data-menu-open]').forEach((button) => {
    button.addEventListener('click', () => {
      menuOpener = button;
      setMenuOpen(true);
    });
  });
  drawer?.querySelectorAll('[data-menu-close], a').forEach((element) => {
    element.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (!drawer?.classList.contains('is-open')) return;
    if (event.key === 'Escape') setMenuOpen(false);
    if (event.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll('a[href], button, input, select, textarea'))
      .filter((element) => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', () => {
    if (desktop.matches && drawer?.classList.contains('is-open')) setMenuOpen(false);
  });

  // Back to top, with a ring that fills as the page is read.
  const toTop = document.querySelector('[data-to-top]');
  toTop?.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" class="to-top-ring" focusable="false" viewBox="0 0 58 58"><circle cx="29" cy="29" r="27" pathLength="100"></circle></svg>');
  const progressRing = toTop?.querySelector('.to-top-ring circle');
  const updateToTop = () => {
    if (!toTop) return;
    toTop.classList.toggle('is-visible', window.scrollY > 700);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    progressRing.style.strokeDashoffset = (100 - progress * 100).toFixed(2);
  };
  window.addEventListener('scroll', updateToTop, { passive: true });
  updateToTop();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0 }));

  // Services carousel. Pause autoplay while the user interacts with it.
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('[data-track]');
    const dots = slider.querySelector('[data-dots]');
    if (!track || !dots) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;
    let pages = 1;
    let timer;
    const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    const current = () => Math.max(0, Math.min(pages - 1, Math.round(track.scrollLeft / (step() || 1))));
    const sync = () => dots.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-current', String(index === current()));
    });
    const go = (index) => track.scrollTo({
      left: index * step(), behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
    const pause = () => window.clearInterval(timer);
    const restart = () => {
      pause();
      if (reducedMotion.matches || pages < 2 || document.hidden || slider.matches(':hover') || slider.contains(document.activeElement)) return;
      timer = window.setInterval(() => go((current() + 1) % pages), 5000);
    };
    const build = () => {
      const perView = Math.max(1, Math.round(track.clientWidth / (step() || 1)));
      pages = Math.max(1, cards.length - perView + 1);
      dots.replaceChildren();
      dots.hidden = pages < 2;
      for (let index = 0; index < pages; index += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Show slide ${index + 1}`);
        button.addEventListener('click', () => { go(index); restart(); });
        dots.appendChild(button);
      }
      sync();
      restart();
    };
    track.addEventListener('scroll', () => window.requestAnimationFrame(sync), { passive: true });
    slider.addEventListener('pointerenter', pause);
    slider.addEventListener('pointerleave', restart);
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', () => window.setTimeout(restart, 0));
    document.addEventListener('visibilitychange', restart);
    reducedMotion.addEventListener('change', restart);
    window.addEventListener('resize', build);
    // Fonts can affect card positions after the initial layout.
    document.fonts?.ready.then(build);
    build();
  });

  // Promise carousel.
  document.querySelectorAll('[data-quotes]').forEach((wrapper) => {
    const slides = Array.from(wrapper.querySelectorAll('.quote-slide'));
    if (!slides.length) return;
    let current = 0;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        const active = position === current;
        slide.classList.toggle('is-active', active);
        if (active) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
      });
    };
    wrapper.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
    wrapper.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));
  });

  // Animate clinic statistics on their first appearance.
  document.querySelectorAll('[data-counters]').forEach((wrapper) => {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    const numbers = wrapper.querySelectorAll('[data-count]');
    numbers.forEach((number) => { number.textContent = '0'; });
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      numbers.forEach((number) => {
        const end = Number(number.dataset.count);
        const suffix = number.dataset.suffix || '';
        const start = performance.now();
        const tick = (time) => {
          const progress = Math.min(1, (time - start) / 1400);
          number.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3))) + (progress === 1 ? suffix : '');
          if (progress < 1) window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    observer.observe(wrapper);
  });

  // Optional hosted form endpoint, with the original email-app fallback.
  document.querySelectorAll('[data-contact-form], [data-callback]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const callback = form.hasAttribute('data-callback');
      const note = callback
        ? form.parentElement.querySelector('[data-callback-note]')
        : form.querySelector('[data-form-note]');
      const data = new FormData(form);
      const subject = `${callback ? 'Call back' : 'Appointment'} request for ${settings.clinic || 'AIM Rehab'}`;
      const endpoint = form.dataset.endpoint || settings.formEndpoint;
      if (endpoint) {
        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        form.setAttribute('aria-busy', 'true');
        note.textContent = 'Sending your request…';
        data.set('_subject', subject);
        try {
          const response = await fetch(endpoint, {
            method: 'POST', headers: { Accept: 'application/json' }, body: data,
          });
          if (!response.ok) throw new Error('The form service did not accept the request.');
          note.textContent = callback
            ? 'Thanks. We will call you back soon.'
            : 'Thank you. Your message is on its way and we will get back to you soon.';
          form.reset();
        } catch {
          note.textContent = 'Sorry, that did not send. Please call or email us instead.';
        } finally {
          button.disabled = false;
          form.removeAttribute('aria-busy');
        }
        return;
      }
      const body = callback ? `Please call me back on ${String(data.get('phone')).trim()}.` : [
        `Name: ${data.get('name')}`,
        `Phone: ${data.get('phone')}`,
        `Email: ${data.get('email') || 'Not given'}`,
        `Service: ${data.get('service') || 'Not sure yet'}`,
        '',
        String(data.get('message') || ''),
      ].join('\n');
      const emails = (settings.emails || ['ah5006154@gmail.com', 'khrram51@gmail.com']).join(',');
      window.location.href = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Your email app should open with your message filled in. Just press send.';
    });
  });
})();
