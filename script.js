// script.js — interactividad: menú, smooth scroll, counters, reveal animations, formulario

document.addEventListener('DOMContentLoaded', () => {
  // NAV TOGGLE
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('active');
  });

  // SMOOTH SCROLL for anchor links (native behavior already set; this ensures offset for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        const headerOffset = 78;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        // close mobile nav
        if (mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          navToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // REVEAL ON SCROLL
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.section, .card, .hero-copy, .hero-media').forEach(el => {
    observer.observe(el);
  });

  // KPI COUNTERS (once when in view)
  const counters = document.querySelectorAll('.kpi-value');
  let countersDone = false;
  function runCounters() {
    if (countersDone) return;
    counters.forEach(c => {
      const target = +c.dataset.target || 0;
      let current = 0;
      const duration = 1500;
      const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 20);
      const increment = Math.ceil(target / (duration / stepTime));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          c.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          c.textContent = current.toLocaleString();
        }
      }, stepTime);
    });
    countersDone = true;
  }

  const kpiSection = document.querySelector('.kpis');
  if (kpiSection) {
    const kpiObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          runCounters();
          kpiObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    kpiObs.observe(kpiSection);
  }

  // CONTACT FORM (fake submit)
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      if (!name || !email || !msg) {
        note.style.color = 'crimson';
        note.textContent = 'Por favor completa todos los campos antes de enviar.';
        return;
      }
      note.style.color = '#7bed9f';
      note.textContent = '✅ Mensaje enviado correctamente. ¡Gracias por participar!';
      form.reset();
      setTimeout(() => note.textContent = '', 4000);
    });
  }
});
