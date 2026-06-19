/* ============================================================
   Yy.js  —  Portfolio Editor Logic  (CORRECTED)
   You Go Feel Am Fitness
   Requires: jQuery 3.7.1, Spectrum 1.8.1

   KEY FIXES vs original:
   1. send() now directly manipulates the template DOM instead of
      using postMessage (template is a <div>, not an <iframe>).
   2. Removed the double Spectrum init on hero-overlay-color /
      hero-overlay-color2 (initSpectrum() was overriding the IIFE).
   3. Removed the stray window.addEventListener('message'...) block
      that belonged in the template, not this file.
   4. All element lookups now use getElementById() which works
      because editor and template share the same document.
   ============================================================ */


/* ============================================================
   DIRECT DOM HELPERS  (replaces postMessage / send())
   ============================================================ */

/** Set a CSS custom property on the template's root element */
function setCSSVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

/** Set textContent of a template element by id */
function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

/** Set innerHTML of a template element by id */
function setHTML(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/** Set an attribute on a template element by id */
function setAttr(id, attr, value) {
  var el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

/** Set the src of an img element by id */
function setImg(id, src) {
  var el = document.getElementById(id);
  if (el) el.src = src;
}

/** Update the hero background image while keeping the gradient overlay */
function setHeroBg(src) {
  // Update the visible background img
  var img = document.getElementById('hero-bg-img');
  if (img) img.src = src;

  // Also update the bg-layer so the gradient overlay still renders on top
  var layer = document.getElementById('hero-bg-layer');
  if (layer) {
    layer.style.backgroundImage =
      'linear-gradient(var(--hero-overlay-color), var(--hero-overlay-color2))';
  }
}


/* ============================================================
   SPECTRUM HELPER  —  init one color picker
   ============================================================ */
function initSpectrum(id, cssVar) {
  $('#' + id).spectrum({
    type: 'color',
    showInput: true,
    showInitial: true,
    showAlpha: false,
    preferredFormat: 'hex',
    showPalette: true,
    palette: [
      ['#000000', '#ffffff', '#f8f8f8', '#444444', '#555555'],
      ['#333333', '#dddddd', '#f3f3f3', '#25d366', '#6fa69a']
    ],
    move:   function (color) { setCSSVar(cssVar, color.toHexString()); },
    change: function (color) { setCSSVar(cssVar, color.toHexString()); }
  });
}


/* ============================================================
   INIT ALL SPECTRUM COLOR PICKERS
   NOTE: hero-overlay-color and hero-overlay-color2 are NOT
         initialised here — the IIFE below handles them with
         the extra opacity logic.
   ============================================================ */
$(function () {

  /* ---- NAVBAR ---- */
  initSpectrum('nav-bg-color',     '--nav-bg');
  initSpectrum('nav-text-color',   '--nav-text');
  initSpectrum('nav-hover-color',  '--nav-hover-text');
  initSpectrum('menu-icon-color',  '--menu-icon-color');
  initSpectrum('nav-shadow-color', '--nav-shadow');

  /* ---- HERO (plain color pickers — no opacity) ---- */
  initSpectrum('hero-title-color',    '--hero-title-color');
  initSpectrum('hero-desc-color',     '--hero-desc-color');
  initSpectrum('hero-btn-bg',         '--hero-btn-bg');
  initSpectrum('hero-btn-text-color', '--hero-btn-text');
  initSpectrum('hero-btn-hover-bg',   '--hero-btn-hover-bg');
  initSpectrum('hero-btn-hover-text', '--hero-btn-hover-text');

  /* ---- ABOUT ---- */
  initSpectrum('about-bg-color',    '--about-bg');
  initSpectrum('about-title-color', '--about-title-color');
  initSpectrum('about-text-color',  '--about-text-color');

  /* ---- PROGRAMS ---- */
  initSpectrum('programs-bg-color',       '--programs-bg');
  initSpectrum('programs-card-bg',        '--programs-card-bg');
  initSpectrum('programs-title-color',    '--programs-title-color');
  initSpectrum('programs-subtitle-color', '--programs-subtitle-color');
  initSpectrum('programs-h3-color',       '--programs-h3-color');
  initSpectrum('programs-text-color',     '--programs-text-color');
  initSpectrum('programs-list-color',     '--programs-list-color');

  /* ---- PRICING SECTION ---- */
  initSpectrum('pricing-bg-color',       '--pricing-bg');
  initSpectrum('pricing-title-color',    '--pricing-title-color');
  initSpectrum('pricing-subtitle-color', '--pricing-subtitle-color');

  /* ---- PRICING CARD 1 ---- */
  initSpectrum('price-card1-bg',            '--price-card1-bg');
  initSpectrum('price-card1-h3-color',      '--price-card1-h3-color');
  initSpectrum('price-card1-amount-color',  '--price-card1-amount-color');
  initSpectrum('price-card1-list-color',    '--price-card1-list-color');
  initSpectrum('price-card1-btn-bg',        '--price-card1-btn-bg');
  initSpectrum('price-card1-btn-text',      '--price-card1-btn-text');
  initSpectrum('price-card1-btn-hover-bg',  '--price-card1-btn-hover-bg');
  initSpectrum('price-card1-btn-hover-text','--price-card1-btn-hover-text');

  /* ---- PRICING CARD 2 ---- */
  initSpectrum('price-card2-bg',            '--price-card2-bg');
  initSpectrum('price-card2-h3-color',      '--price-card2-h3-color');
  initSpectrum('price-card2-amount-color',  '--price-card2-amount-color');
  initSpectrum('price-card2-list-color',    '--price-card2-list-color');
  initSpectrum('price-card2-btn-bg',        '--price-card2-btn-bg');
  initSpectrum('price-card2-btn-text',      '--price-card2-btn-text');
  initSpectrum('price-card2-btn-hover-bg',  '--price-card2-btn-hover-bg');
  initSpectrum('price-card2-btn-hover-text','--price-card2-btn-hover-text');

  /* ---- PRICING CARD 3 ---- */
  initSpectrum('price-card3-bg',            '--price-card3-bg');
  initSpectrum('price-card3-h3-color',      '--price-card3-h3-color');
  initSpectrum('price-card3-amount-color',  '--price-card3-amount-color');
  initSpectrum('price-card3-list-color',    '--price-card3-list-color');
  initSpectrum('price-card3-btn-bg',        '--price-card3-btn-bg');
  initSpectrum('price-card3-btn-text',      '--price-card3-btn-text');
  initSpectrum('price-card3-btn-hover-bg',  '--price-card3-btn-hover-bg');
  initSpectrum('price-card3-btn-hover-text','--price-card3-btn-hover-text');

  /* ---- TRAINERS ---- */
  initSpectrum('trainers-bg-color',       '--trainers-bg');
  initSpectrum('trainers-card-bg',        '--trainers-card-bg');
  initSpectrum('trainers-title-color',    '--trainers-title-color');
  initSpectrum('trainers-subtitle-color', '--trainers-subtitle-color');
  initSpectrum('trainers-h3-color',       '--trainers-h3-color');
  initSpectrum('trainers-role-color',     '--trainers-role-color');
  initSpectrum('trainers-btn-bg',         '--trainers-btn-bg');
  initSpectrum('trainers-btn-text',       '--trainers-btn-text');
  initSpectrum('trainers-btn-hover-bg',   '--trainers-btn-hover-bg');
  initSpectrum('trainers-btn-hover-text', '--trainers-btn-hover-text');

  /* ---- TESTIMONIALS ---- */
  initSpectrum('testimonials-bg-color',       '--testimonials-bg');
  initSpectrum('testimonials-card-bg',        '--testimonials-card-bg');
  initSpectrum('testimonials-title-color',    '--testimonials-title-color');
  initSpectrum('testimonials-subtitle-color', '--testimonials-subtitle-color');
  initSpectrum('testimonials-text-color',     '--testimonials-text-color');
  initSpectrum('testimonials-name-color',     '--testimonials-name-color');

  /* ---- GALLERY ---- */
  initSpectrum('gallery-bg-color',       '--gallery-bg');
  initSpectrum('gallery-title-color',    '--gallery-title-color');
  initSpectrum('gallery-subtitle-color', '--gallery-subtitle-color');

  /* ---- CONTACT ---- */
  initSpectrum('contact-bg-color',      '--contact-bg');
  initSpectrum('contact-card-bg-color', '--contact-card-bg');
  initSpectrum('contact-title-color',   '--contact-title-color');
  initSpectrum('contact-subtitle-color','--contact-subtitle-color');
  initSpectrum('contact-text-color',    '--contact-p-color');
  initSpectrum('contact-icon-color',    '--contact-icon-color');

  /* ---- FLOATING BUTTONS ---- */
  initSpectrum('float-whatsapp-bg-input',    '--float-whatsapp-bg');
  initSpectrum('float-call-bg-input',        '--float-call-bg');
  initSpectrum('float-whatsapp-color-input', '--float-whatsapp-color');
  initSpectrum('float-call-color-input',     '--float-call-color');

}); /* end $(function) */


/* ============================================================
   HERO OVERLAY  —  color + opacity → rgba cssVar
   (These two pickers are handled here instead of initSpectrum
    because they need to combine hex colour + range opacity.)
   ============================================================ */
(function () {
  var overlayColor1   = '#000000', overlayOpacity1 = 0.7;
  var overlayColor2   = '#6fa69a', overlayOpacity2 = 0.809;

  function buildRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function updateOverlay1() {
    setCSSVar('--hero-overlay-color', buildRgba(overlayColor1, overlayOpacity1));
  }
  function updateOverlay2() {
    setCSSVar('--hero-overlay-color2', buildRgba(overlayColor2, overlayOpacity2));
  }

  $(function () {
    $('#hero-overlay-color').spectrum({
      type: 'color', showInput: true, showInitial: true,
      preferredFormat: 'hex', showPalette: true,
      palette: [['#000000', '#ffffff', '#6fa69a', '#333333']],
      move:   function (c) { overlayColor1 = c.toHexString(); updateOverlay1(); },
      change: function (c) { overlayColor1 = c.toHexString(); updateOverlay1(); }
    });

    $('#hero-overlay-color2').spectrum({
      type: 'color', showInput: true, showInitial: true,
      preferredFormat: 'hex', showPalette: true,
      palette: [['#000000', '#ffffff', '#6fa69a', '#333333']],
      move:   function (c) { overlayColor2 = c.toHexString(); updateOverlay2(); },
      change: function (c) { overlayColor2 = c.toHexString(); updateOverlay2(); }
    });

    var op1El = document.getElementById('hero-overlay-opacity');
    var op2El = document.getElementById('hero-overlay-opacity2');
    if (op1El) {
      op1El.value = overlayOpacity1;
      op1El.addEventListener('input', function () {
        overlayOpacity1 = parseFloat(this.value);
        updateOverlay1();
      });
    }
    if (op2El) {
      op2El.value = overlayOpacity2;
      op2El.addEventListener('input', function () {
        overlayOpacity2 = parseFloat(this.value);
        updateOverlay2();
      });
    }
  });
})();


/* ============================================================
   TEXT / TEXTAREA INPUTS  —  live update
   ============================================================ */
(function () {

  /* inputId  →  template element id */
  var textMap = {
    /* Navbar */
    'nav-about-text':        'nav-link-about',
    'nav-programs-text':     'nav-link-programs',
    'nav-pricing-text':      'nav-link-pricing',
    'nav-trainers-text':     'nav-link-trainers',
    'nav-testimonials-text': 'nav-link-testimonials',
    'nav-gallery-text':      'nav-link-gallery',
    'nav-contact-text':      'nav-link-contact',

    /* Hero */
    'hero-title-input': 'hero-title',
    'hero-desc-input':  'hero-desc',
    'hero-btn-text':    'hero-btn',

    /* About */
    'about-title-input': 'about-title',
    'about-brand-input': 'about-brand',
    'about-part1-input': 'about-part1',
    'about-part2-input': 'about-part2',

    /* Programs section */
    'programs-title-input':    'programs-title',
    'programs-subtitle-input': 'programs-subtitle',

    /* Program cards */
    'prog-title-1-input':  'prog-title-1',
    'prog-desc-1-input':   'prog-desc-1',
    'prog-list-1-1-input': 'prog-list-1-1',
    'prog-list-1-2-input': 'prog-list-1-2',
    'prog-list-1-3-input': 'prog-list-1-3',
    'prog-title-2-input':  'prog-title-2',
    'prog-desc-2-input':   'prog-desc-2',
    'prog-list-2-1-input': 'prog-list-2-1',
    'prog-list-2-2-input': 'prog-list-2-2',
    'prog-list-2-3-input': 'prog-list-2-3',
    'prog-title-3-input':  'prog-title-3',
    'prog-desc-3-input':   'prog-desc-3',
    'prog-list-3-1-input': 'prog-list-3-1',
    'prog-list-3-2-input': 'prog-list-3-2',
    'prog-list-3-3-input': 'prog-list-3-3',
    'prog-title-4-input':  'prog-title-4',
    'prog-desc-4-input':   'prog-desc-4',
    'prog-list-4-1-input': 'prog-list-4-1',
    'prog-list-4-2-input': 'prog-list-4-2',
    'prog-list-4-3-input': 'prog-list-4-3',

    /* Pricing section */
    'pricing-title-input':    'pricing-title',
    'pricing-subtitle-input': 'pricing-subtitle',

    /* Pricing cards */
    'price-name-1-input':   'price-name-1',
    'price-amount-1-input': 'price-amount-1',
    'price-feat-1-1-input': 'price-feat-1-1',
    'price-feat-1-2-input': 'price-feat-1-2',
    'price-feat-1-3-input': 'price-feat-1-3',
    'price-name-2-input':   'price-name-2',
    'price-amount-2-input': 'price-amount-2',
    'price-feat-2-1-input': 'price-feat-2-1',
    'price-feat-2-2-input': 'price-feat-2-2',
    'price-feat-2-3-input': 'price-feat-2-3',
    'price-name-3-input':   'price-name-3',
    'price-amount-3-input': 'price-amount-3',
    'price-feat-3-1-input': 'price-feat-3-1',
    'price-feat-3-2-input': 'price-feat-3-2',
    'price-feat-3-3-input': 'price-feat-3-3',

    /* Trainers */
    'trainers-title-input':    'trainers-title',
    'trainers-subtitle-input': 'trainers-subtitle',
    'trainer-name-1-input':    'trainer-name-1',
    'trainer-role-1-input':    'trainer-role-1',
    'trainer-stars-1-input':   'trainer-stars-1',
    'trainer-name-2-input':    'trainer-name-2',
    'trainer-role-2-input':    'trainer-role-2',
    'trainer-stars-2-input':   'trainer-stars-2',
    'trainer-name-3-input':    'trainer-name-3',
    'trainer-role-3-input':    'trainer-role-3',
    'trainer-stars-3-input':   'trainer-stars-3',
    'trainer-name-4-input':    'trainer-name-4',
    'trainer-role-4-input':    'trainer-role-4',
    'trainer-stars-4-input':   'trainer-stars-4',

    /* Testimonials */
    'testimonials-title-input':    'testimonials-title',
    'testimonials-subtitle-input': 'testimonials-subtitle',
    'testimonial-text-1-input':    'testimonial-text-1',
    'testimonial-name-1-input':    'testimonial-name-1',
    'testimonial-text-2-input':    'testimonial-text-2',
    'testimonial-name-2-input':    'testimonial-name-2',
    'testimonial-text-3-input':    'testimonial-text-3',
    'testimonial-name-3-input':    'testimonial-name-3',

    /* Gallery */
    'gallery-title-input':    'gallery-title',
    'gallery-subtitle-input': 'gallery-subtitle',

    /* Contact */
    'contact-title-input':         'contact-title',
    'contact-subtitle-input':      'contact-subtitle',
    'contact-email-label-input':   'contact-email-label',
    'contact-email-input':         'contact-email-text',
    'contact-phone-label-input':   'contact-phone-label',
    'contact-phone-input':         'contact-phone-text',
    'contact-address-label-input': 'contact-address-label',
    'contact-address-input':       'contact-address',
    'contact-hours-label-input':   'contact-hours-label',
    'contact-hours-input':         'contact-hours'
  };

  Object.entries(textMap).forEach(function (pair) {
    var inputId  = pair[0];
    var targetId = pair[1];
    var el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', function () {
      setText(targetId, this.value);
    });
  });

})();


/* ============================================================
   LINK / HREF INPUTS
   ============================================================ */
(function () {

  /* Button TEXT inputs */
  ['price-btn-1-text', 'price-btn-2-text', 'price-btn-3-text',
   'trainer-btn-1-text', 'trainer-btn-2-text', 'trainer-btn-3-text', 'trainer-btn-4-text'
  ].forEach(function (inputId) {
    var targetId = inputId.replace('-text', '');   /* e.g. price-btn-1 */
    var el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', function () {
      setText(targetId, this.value);
    });
  });

  /* Button LINK (href) inputs */
  var hrefMap = {
    'hero-btn-link':      'hero-btn',
    'price-btn-1-link':   'price-btn-1',
    'price-btn-2-link':   'price-btn-2',
    'price-btn-3-link':   'price-btn-3',
    'trainer-btn-1-link': 'trainer-btn-1',
    'trainer-btn-2-link': 'trainer-btn-2',
    'trainer-btn-3-link': 'trainer-btn-3',
    'trainer-btn-4-link': 'trainer-btn-4'
  };

  Object.entries(hrefMap).forEach(function (pair) {
    var inputId  = pair[0];
    var targetId = pair[1];
    var el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', function () {
      setAttr(targetId, 'href', this.value);
    });
  });

  /* Contact email href */
  var emailEl = document.getElementById('contact-email-input');
  if (emailEl) {
    emailEl.addEventListener('input', function () {
      setAttr('contact-email-link', 'href', 'mailto:' + this.value);
    });
  }

  /* Contact phone href */
  var phoneEl = document.getElementById('contact-phone-input');
  if (phoneEl) {
    phoneEl.addEventListener('input', function () {
      setAttr('contact-phone-link', 'href', 'tel:' + this.value);
    });
  }

})();


/* ============================================================
   FILE / IMAGE INPUTS
   ============================================================ */
(function () {

  var imgMap = {
    'nav-logo-upload':      'site-logo',
    'hero-bg-upload':       '__hero-bg__',    /* special — updates CSS background */
    'about-img-upload':     'about-img',
    'trainer-img-1-upload': 'trainer-img-1',
    'trainer-img-2-upload': 'trainer-img-2',
    'trainer-img-3-upload': 'trainer-img-3',
    'trainer-img-4-upload': 'trainer-img-4',
    'gallery-img-1-upload': 'gallery-img-1',
    'gallery-img-2-upload': 'gallery-img-2',
    'gallery-img-3-upload': 'gallery-img-3',
    'gallery-img-4-upload': 'gallery-img-4',
    'gallery-img-5-upload': 'gallery-img-5',
    'gallery-img-6-upload': 'gallery-img-6'
  };

  Object.entries(imgMap).forEach(function (pair) {
    var inputId  = pair[0];
    var targetId = pair[1];
    var el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('change', function () {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        var src = e.target.result;
        if (targetId === '__hero-bg__') {
          setHeroBg(src);
        } else {
          setImg(targetId, src);
        }
      };
      reader.readAsDataURL(file);
    });
  });

})();


/* ============================================================
   FLOATING BUTTONS  —  links + position
   ============================================================ */
(function () {

  var waLink = document.getElementById('float-whatsapp-link-input');
  if (waLink) {
    waLink.addEventListener('input', function () {
      setAttr('float-whatsapp', 'href', this.value);
    });
  }

  var callLink = document.getElementById('float-call-link-input');
  if (callLink) {
    callLink.addEventListener('input', function () {
      setAttr('float-call', 'href', this.value);
    });
  }

  var posEl = document.getElementById('float-position-input');
  if (posEl) {
    posEl.addEventListener('change', function () {
      var side = this.value;
      document.querySelectorAll('.floating-btn').forEach(function (btn) {
        btn.style.right = (side === 'right') ? '20px' : '';
        btn.style.left  = (side === 'left')  ? '20px' : '';
      });
    });
  }

})();


/* ============================================================
   SOCIAL ICON MAP + SELECT / LINK HANDLERS
   ============================================================ */
var iconMap = {
  facebook:  '<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>',
  instagram: '<path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zM18 6.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1z"/>',
  tiktok:    '<path d="M16 3c.6 2.8 2.3 4.5 5 4.9V11c-2-.1-3.8-.8-5-2v6.5c0 3.6-2.9 6.5-6.5 6.5S3 19.1 3 15.5 5.9 9 9.5 9c.5 0 1 .1 1.5.2V12c-.5-.2-1-.3-1.5-.3-2 0-3.5 1.6-3.5 3.5S7.5 19 9.5 19 13 17.4 13 15.5V3h3z"/>',
  twitter:   '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68z"/>',
  youtube:   '<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5S4.46 3.5 2.62 4.05A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>',
  snapchat:  '<path d="M12 2c4 0 7 3 7 7 0 6-7 13-7 13S5 15 5 9c0-4 3-7 7-7z"/>'
};

function applyIcon(slotId, iconName) {
  var el = document.getElementById(slotId);
  if (!el) return;
  el.innerHTML = '<svg viewBox="0 0 24 24">' + iconMap[iconName] + '</svg>';
  el.setAttribute('data-icon', iconName);
  el.setAttribute('aria-label', iconName);
}

/* Icon selects */
[
  ['icon-1-select', 'footer-social-1'],
  ['icon-2-select', 'footer-social-2'],
  ['icon-3-select', 'footer-social-3']
].forEach(function (pair) {
  var selectId = pair[0];
  var slotId   = pair[1];
  var el = document.getElementById(selectId);
  if (!el) return;
  el.addEventListener('change', function () {
    applyIcon(slotId, this.value);
  });
});

/* Icon link inputs */
[
  ['icon-1-link', 'footer-social-1'],
  ['icon-2-link', 'footer-social-2'],
  ['icon-3-link', 'footer-social-3']
].forEach(function (pair) {
  var inputId = pair[0];
  var slotId  = pair[1];
  var el = document.getElementById(inputId);
  if (!el) return;
  el.addEventListener('input', function () {
    setAttr(slotId, 'href', this.value);
  });
});
