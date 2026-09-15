(function () {
  var ENDPOINT = '/api/waitlist';
  var QUEUE_KEY = 'pecounsel_waitlist_queue';

  var form = document.getElementById('signup-form');
  var emailEl = document.getElementById('email');
  var btn = document.getElementById('signup-btn');
  var successEl = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');

  function validate(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function readQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; }
  }
  function saveQueue(list) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function queueEmail(email) {
    var list = readQueue();
    if (list.indexOf(email) === -1) { list.push(email); saveQueue(list); }
  }

  function postEmail(email) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 20000);
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ email: email, source: 'landing', website: '' })
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json().catch(function () { return {}; });
    }).then(function (d) {
      if (!(d && (d.ok || d.dropped))) throw new Error('nok');
    });
  }

  function show(el) { if (el) el.style.display = 'block'; if (form) form.style.display = 'none'; }
  function clearStatus() {
    if (successEl) successEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (form) form.style.display = 'flex';
  }

  if (form && emailEl && btn) {
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

      function done() {
        btn.disabled = false;
        btn.textContent = 'Get early access';
        emailEl.value = '';
        show(successEl);
      }
      function fail() {
        btn.disabled = false;
        btn.textContent = 'Get early access';
        queueEmail(email);
        if (successEl) successEl.style.display = 'none';
        if (form) form.style.display = 'flex';
        if (errorEl) errorEl.style.display = 'block';
      }

      postEmail(email).then(done).catch(fail);
    });

    emailEl.addEventListener('input', function () { emailEl.classList.remove('err'); });
  }

  function flushQueue() {
    var list = readQueue();
    if (!list.length) return;
    var rest = [];
    list.forEach(function (email) {
      postEmail(email)
        .then(function () { saveQueue(rest); })
        .catch(function () { rest.push(email); });
    });
    setTimeout(function () { saveQueue(rest); }, 8000);
  }
  flushQueue();

  // ---- Reveal-on-scroll ----
  var els = document.querySelectorAll('.reveal');
  function revealAll() { els.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: [0, 0.12] });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 1400);
    setTimeout(function () { io.disconnect(); }, 4200);
  } else {
    revealAll();
  }
})();