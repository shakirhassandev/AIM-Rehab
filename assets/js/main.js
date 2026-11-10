(() => {
  'use strict';

  const settings = window.AIM_REHAB || {};

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

  // Back to top.
  const toTop = document.querySelector('[data-to-top]');
  const updateToTop = () => toTop?.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', updateToTop, { passive: true });
  updateToTop();
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'instant' }));

  // Blog topic filter: shows only the posts in the chosen topic.
  document.querySelectorAll('[data-filter]').forEach((bar) => {
    const cards = Array.from(document.querySelectorAll('.post-card[data-category]'));
    bar.querySelectorAll('button[data-cat]').forEach((button) => {
      button.addEventListener('click', () => {
        const cat = button.dataset.cat;
        bar.querySelectorAll('button[data-cat]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
        cards.forEach((card) => { card.hidden = cat !== 'all' && card.dataset.category !== cat; });
      });
    });
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
      // A phone field with a fixed country code sends the full number.
      const phoneInput = form.querySelector('input[name="phone"][data-prefix]');
      if (phoneInput && data.get('phone')) data.set('phone', `${phoneInput.dataset.prefix} ${String(data.get('phone')).trim()}`);
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
        `Preferred date: ${data.get('date') || 'Any'}`,
        '',
        String(data.get('message') || ''),
      ].join('\n');
      const emails = (settings.emails || ['ah5006154@gmail.com', 'khrram51@gmail.com']).join(',');
      window.location.href = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Your email app should open with your message filled in. Just press send.';
    });
  });
})();
