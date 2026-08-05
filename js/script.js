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

  // Signature pad (used on trip-authorization.html)
  var sigCanvas = document.getElementById('sigPad');
  if (sigCanvas) {
    var ctx = sigCanvas.getContext('2d');
    var drawing = false;
    var hasSignature = false;
    var sigDataInput = document.getElementById('signatureData');
    var sigWarning = document.getElementById('sigWarning');

    // Scale canvas for crisp lines on high-DPI screens while keeping the
    // element's CSS size responsive.
    function resizeCanvas() {
      var ratio = window.devicePixelRatio || 1;
      var rect = sigCanvas.getBoundingClientRect();
      sigCanvas.width = rect.width * ratio;
      sigCanvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0a2e22';
    }
    resizeCanvas();

    function getPos(e) {
      var rect = sigCanvas.getBoundingClientRect();
      var point = e.touches ? e.touches[0] : e;
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      hasSignature = true;
      sigCanvas.classList.add('signed');
      if (sigWarning) sigWarning.style.display = 'none';
      var pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    function end() { drawing = false; }

    sigCanvas.addEventListener('mousedown', start);
    sigCanvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    sigCanvas.addEventListener('touchstart', start, { passive: false });
    sigCanvas.addEventListener('touchmove', move, { passive: false });
    sigCanvas.addEventListener('touchend', end);

    var clearBtn = document.getElementById('sigClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
        hasSignature = false;
        sigCanvas.classList.remove('signed');
        if (sigDataInput) sigDataInput.value = '';
      });
    }

    // Expose a check used by the trip-auth-form submit handler below
    sigCanvas._hasSignature = function () { return hasSignature; };
    sigCanvas._getDataURL = function () { return sigCanvas.toDataURL('image/png'); };
  }

  // Trip Payment Authorization form handling (Formspree AJAX + signature capture)
  var taForm = document.getElementById('trip-auth-form');
  if (taForm) {
    var taSuccessBox = document.querySelector('.form-success');
    var taErrorBox = document.querySelector('.form-error');
    var submittedAtInput = document.getElementById('submitted_at');
    var taSigWarning = document.getElementById('sigWarning');

    taForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (taSuccessBox) taSuccessBox.style.display = 'none';
      if (taErrorBox) taErrorBox.style.display = 'none';

      // Require a drawn signature in addition to the typed name
      if (sigCanvas && !sigCanvas._hasSignature()) {
        if (taSigWarning) taSigWarning.style.display = 'block';
        sigCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (submittedAtInput) submittedAtInput.value = new Date().toString();

      var taSubmitBtn = taForm.querySelector('button[type="submit"]');
      var taOriginalText = taSubmitBtn ? taSubmitBtn.textContent : '';
      if (taSubmitBtn) {
        taSubmitBtn.disabled = true;
        taSubmitBtn.textContent = 'Submitting…';
      }

      var taData = new FormData(taForm);

      // Attach the signature as an actual image file so it shows up in the
      // notification email, in addition to the hidden base64 field.
      if (sigCanvas) {
        var dataUrl = sigCanvas._getDataURL();
        var byteString = atob(dataUrl.split(',')[1]);
        var arrayBuffer = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) arrayBuffer[i] = byteString.charCodeAt(i);
        var sigBlob = new Blob([arrayBuffer], { type: 'image/png' });
        taData.append('signature_file', sigBlob, 'signature.png');
      }

      fetch(taForm.action, {
        method: 'POST',
        body: taData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            window.location.href = 'trip-authorization-confirmation.html';
          } else {
            response.json().then(function (data) {
              if (taErrorBox) {
                taErrorBox.style.display = 'block';
                if (data && data.errors) {
                  taErrorBox.textContent =
                    'Hmm, something needs attention: ' +
                    data.errors.map(function (err) { return err.message; }).join(', ');
                }
                taErrorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          }
        })
        .catch(function () {
          if (taErrorBox) {
            taErrorBox.style.display = 'block';
            taErrorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .finally(function () {
          if (taSubmitBtn) {
            taSubmitBtn.disabled = false;
            taSubmitBtn.textContent = taOriginalText;
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
