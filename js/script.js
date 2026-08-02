// Stars Pack N Go Destinations — site script

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
