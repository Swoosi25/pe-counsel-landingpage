(function () {
  var ENDPOINT = 'https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev/';

  var pairs = [
    ['sub-form', 'sub-email', 'sub-btn', 'sub-note', 'sub-status', 'sub-consent'],
    ['sub-form2', 'sub-email2', 'sub-btn2', 'sub-note2', 'sub-status2', 'sub-consent2']
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
    var consentEl = document.getElementById(pair[5]);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailEl.value.trim();
      if (!validate(email)) {
        emailEl.classList.add('err');
        setStatus(pair, 'Bitte gib eine gültige E-Mail-Adresse ein.', 'err');
        setTimeout(function () { emailEl.classList.remove('err'); }, 1600);
        return;
      }
      if (consentEl && !consentEl.checked) {
        setStatus(pair, 'Bitte stimme der Datenschutzerklärung zu — nur mit deiner Zustimmung können wir dich benachrichtigen.', 'err');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Wird eingetragen…';
      setStatus(pair, '', null);

      function done(text) {
        btn.disabled = false;
        btn.textContent = 'Stay updated';
        emailEl.value = '';
        if (consentEl) consentEl.checked = false;
        setStatus(pair, text, 'ok');
      }
      function fail() {
        btn.disabled = false;
        btn.textContent = 'Stay updated';
        setStatus(pair, 'Ups — das hat nicht geklappt. Bitte versuche es gleich noch einmal.', 'err');
      }

      var honeypot = form.querySelector('input[name="website"]');
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: 'landing',
          consent: !!(consentEl && consentEl.checked),
          website: honeypot ? honeypot.value : ''
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          return r.json();
        })
        .then(function (d) {
          if (d && d.ok) done('Danke — du stehst auf der Liste! Wir melden uns bei Launch.');
          else if (d && d.dropped) done('Danke — du stehst auf der Liste! Wir melden uns bei Launch.');
          else throw new Error('bad');
        })
        .catch(fail);
    });

    emailEl.addEventListener('input', function () { emailEl.classList.remove('err'); });
  }

  pairs.forEach(bind);
})();