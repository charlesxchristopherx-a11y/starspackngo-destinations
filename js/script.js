// Stars Pack N Go Destinations — site script

// OPTIONAL, FREE: paste a Google Apps Script Web App URL here to also copy
// every trip request into a Google Sheet (see google-sheet-setup-guide.md).
// Leave the placeholder as-is to skip this — the site works fine without it.
var SHEET_WEBHOOK_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = navLinks.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      toggle.textContent = expanded ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Inquiry form handling (Formspree AJAX submit with inline success message)
  var form = document.getElementById('inquiry-form');
  if (form) {
    var successBox = document.querySelector('.form-success');
    var errorBox = document.querySelector('.form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (successBox) successBox.style.display = 'none';
      if (errorBox) errorBox.style.display = 'none';

      // Basic required-field check for the traveler-details checkboxes
      var destChecks = form.querySelectorAll('input[name="destinations[]"]:checked');
      var destWarning = document.getElementById('dest-warning');
      if (destChecks.length === 0) {
        if (destWarning) destWarning.style.display = 'block';
        destWarning && destWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else if (destWarning) {
        destWarning.style.display = 'none';
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var data = new FormData(form);

      // Consolidate checkbox groups (fields named "foo[]", e.g. destinations,
      // purpose, cruise_features, hotel_features) into a single clean,
      // comma-separated value. Without this, Shana's email shows several
      // repeated rows for the same question — this makes it one tidy line.
      var groups = {};
      Array.prototype.forEach.call(form.querySelectorAll('input[type="checkbox"]'), function (input) {
        var name = input.getAttribute('name') || '';
        if (name.slice(-2) === '[]' && input.checked) {
          var base = name.slice(0, -2);
          groups[base] = groups[base] || [];
          groups[base].push(input.value);
        }
      });
      Object.keys(groups).forEach(function (base) {
        data.delete(base + '[]');
        data.set(base, groups[base].join(', '));
      });

      // Optional, free: also copy this submission into Shana's Google Sheet
      // (see SHEET_WEBHOOK_URL above). Fire-and-forget — never blocks or
      // fails the main email submission below.
      if (SHEET_WEBHOOK_URL.indexOf('PASTE_YOUR') === -1) {
        var sheetPayload = {};
        data.forEach(function (value, key) { sheetPayload[key] = value; });
        fetch(SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload)
        }).catch(function () { /* non-blocking */ });
      }

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            form.style.display = 'none';
            if (successBox) successBox.style.display = 'block';
            successBox && successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            response.json().then(function (data) {
              if (errorBox) {
                errorBox.style.display = 'block';
                if (data && data.errors) {
                  errorBox.textContent =
                    'Hmm, something needs attention: ' +
                    data.errors.map(function (err) { return err.message; }).join(', ');
                }
              }
            });
          }
        })
        .catch(function () {
          if (errorBox) errorBox.style.display = 'block';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
    });
  }

  // Highlight active nav link based on current page
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });

  // Set footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
