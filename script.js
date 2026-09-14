(function () {
  var ENDPOINT = '';

  var pairs = [
    ['sub-form', 'sub-email', 'sub-btn', 'sub-note', 'sub-status'],
    ['sub-form2', 'sub-email2', 'sub-btn2', 'sub-note2', 'sub-status2']
  ];

  function validate(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setStatus(pair, text, cls) {
    var status = document.getElementById(pair[4]);
    var note = document.getElementById(pair[3]);
    status.textContent = text || '';
    status.className = 'sub-status' + (cls ? ' ' + cls : '');
    if (note) note.style.display = text ? 'none' : '';
  }

  function bind(pair) {
    var form = document.getElementById(pair[0]);
    var emailEl = document.getElementById(pair[1]);
    var btn = document.getElementById(pair[2]);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailEl.value.trim();
      if (!validate(email)) {
        emailEl.classList.add('err');
        setStatus(pair, 'Please enter a valid email address.', 'err');
        setTimeout(function () { emailEl.classList.remove('err'); }, 1600);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Adding you…';
      setStatus(pair, '', null);

      function done(text) {
        btn.disabled = false;
        btn.textContent = 'Stay updated';
        emailEl.value = '';
        setStatus(pair, text, 'ok');
      }
      function fail() {
        btn.disabled = false;
        btn.textContent = 'Stay updated';
        setStatus(pair, 'Something went wrong — please try again.', 'err');
      }

      if (ENDPOINT) {
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, source: 'pecounsel-pre-launch' }) })
          .then(function (r) { if (!r.ok) throw new Error('bad'); done('Thanks — you’re on the list.'); })
          .catch(fail);
      } else {
        try { localStorage.setItem('pecounsel_waitlist', email); } catch (err) {}
        setTimeout(function () { done('Thanks — you’re on the list. See you at launch.'); }, 900);
      }
    });

    emailEl.addEventListener('input', function () { emailEl.classList.remove('err'); });
  }

  pairs.forEach(bind);
})();