(function () {
  var ENDPOINT = 'https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev/';

  var form = document.getElementById('signup-form');
  var emailEl = document.getElementById('email');
  var btn = document.getElementById('signup-btn');
  var successEl = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');

  function validate(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function show(el) {
    if (!el) return;
    el.style.display = 'block';
    var formRow = form && form.querySelector('input[type="email"]');
    if (form) form.style.display = 'none';
  }

  function clearStatus() {
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (form) form.style.display = 'flex';
  }

  if (!form || !emailEl || !btn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = emailEl.value.trim();

    if (!validate(email)) {
      emailEl.classList.add('err');
      emailEl.focus();
      setTimeout(function () { emailEl.classList.remove('err'); }, 1600);
      return;
    }

    if (errorEl) errorEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var honeypot = form.querySelector('input[name="website"]');

    function done() {
      btn.disabled = false;
      btn.textContent = 'Get early access';
      emailEl.value = '';
      show(successEl);
    }
    function fail() {
      btn.disabled = false;
      btn.textContent = 'Get early access';
      if (successEl) successEl.style.display = 'none';
      if (form) form.style.display = 'flex';
      if (errorEl) errorEl.style.display = 'block';
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        source: 'landing',
        website: honeypot ? honeypot.value : ''
      })
    })
      .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (d) {
        if (d && (d.ok || d.dropped)) done();
        else throw new Error('bad');
      })
      .catch(fail);
  });

  emailEl.addEventListener('input', function () { emailEl.classList.remove('err'); });

  // ---- Reveal-on-scroll ----
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();