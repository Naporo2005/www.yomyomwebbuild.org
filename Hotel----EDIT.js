/* ============================================================
   hostel-editor.js  —  v3  (COMPLETE)
   Yomyom Hostel · Editor Wiring
   Requires: jQuery 3.7.1 · Spectrum 1.8.1
   ============================================================ */


/* ============================================================
   DIRECT DOM HELPERS
   ============================================================ */

function setCSSVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setAttr(id, attr, value) {
  var el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setHref(id, value) {
  var el = document.getElementById(id);
  if (el) el.href = value.trim() || '#';
}

function uploadImg(id, event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var el = document.getElementById(id);
    if (el) el.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function uploadVideo(id, event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var el = document.getElementById(id);
    if (el) { el.src = e.target.result; el.load(); }
  };
  reader.readAsDataURL(file);
}

/* Set an icon element to display ANY content the user types —
   text, emoji, or a Font Awesome class like "fas fa-wifi".
   Whatever they type appears directly in the element. */
function setIconContent(id, value) {
  var el = document.getElementById(id);
  if (!el) return;
  var v = value.trim();
  if (!v) return;
  /* Detect if it looks like a FA class string (contains "fa-") */
  if (v.indexOf('fa-') !== -1) {
    /* FA mode: set className, clear textContent */
    el.textContent = '';
    el.className = '';
    v.split(/\s+/).forEach(function(c){ if(c) el.classList.add(c); });
  } else {
    /* Free text / emoji mode: clear classes, set textContent */
    el.className = '';
    el.textContent = v;
    el.style.fontStyle = 'normal';
    el.style.fontSize  = 'inherit';
  }
}

/* Google Map embed by place name / address */
function setMap(id, value) {
  var iframe = document.getElementById(id);
  if (!iframe || !value.trim()) return;
  iframe.style.display = 'block';
  iframe.src =
    'https://maps.google.com/maps?q=' +
    encodeURIComponent(value.trim()) +
    '&output=embed';
  var placeholder = document.querySelector('#contact-map-wrap img');
  if (placeholder) placeholder.style.display = 'none';
}


/* ============================================================
   SPECTRUM HELPER
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
      ['#000000', '#ffffff', '#f8f5ee', '#1a1a2e', '#2a2a45'],
      ['#c9a84c', '#a8873a', '#e8c97a', '#e05c2a', '#25d366']
    ],
    move:   function (color) { setCSSVar(cssVar, color.toHexString()); },
    change: function (color) { setCSSVar(cssVar, color.toHexString()); }
  });
}


/* ============================================================
   HERO OVERLAY  — two-colour gradient with per-colour opacity
   ============================================================ */
var _heroColor1 = 'c9a84c';
var _heroColor2 = '1a1a2e';

function updateHeroOverlay() {
  var op1 = parseFloat(document.getElementById('heroOpacity1').value);
  var op2 = parseFloat(document.getElementById('heroOpacity2').value);

  function rgba(hex, a) {
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  var grad =
    'linear-gradient(160deg, ' +
    rgba(_heroColor1, op1) + ' 0%, ' +
    rgba(_heroColor2, op2) + ' 60%)';

  setCSSVar('--hero-overlay-gradient', grad);
}

(function () {
  $(function () {
    $('#heroOverlayColor1').spectrum({
      type: 'color', showInput: true, showInitial: true,
      preferredFormat: 'hex', showPalette: true,
      palette: [['#c9a84c', '#a8873a', '#ffffff', '#1a1a2e', '#000000']],
      move:   function (c) { _heroColor1 = c.toHex(); updateHeroOverlay(); },
      change: function (c) { _heroColor1 = c.toHex(); updateHeroOverlay(); }
    });

    $('#heroOverlayColor2').spectrum({
      type: 'color', showInput: true, showInitial: true,
      preferredFormat: 'hex', showPalette: true,
      palette: [['#1a1a2e', '#000000', '#2a2a45', '#c9a84c', '#ffffff']],
      move:   function (c) { _heroColor2 = c.toHex(); updateHeroOverlay(); },
      change: function (c) { _heroColor2 = c.toHex(); updateHeroOverlay(); }
    });
  });
})();


/* ============================================================
   INJECT DYNAMIC CSS RULES
   (rules that CSS vars alone can't drive)
   ============================================================ */
(function () {
  var style = document.createElement('style');
  style.textContent =
    /* Hero room button border + hover driven by vars */
    '#hero-room-btn { border-color: var(--hero-room-btn-border-color, #ffffff) !important; }' +
    '#hero-room-btn:hover { background: var(--hero-room-btn-hover-bg, #ffffff) !important;' +
    '  color: var(--hero-room-btn-hover-color, #1a1a2e) !important; }' +
    /* Book-now button hover */
    '#book-now-btn:hover { background: var(--book-btn-hover-bg) !important; }' +
    /* About buttons hover */
    '#about-room-btn:hover, #about-book-btn:hover { opacity: 0.85; }' +
    /* Room btn hover */
    '.room-btn:hover { background: var(--room-btn-hover-bg) !important; }' +
    /* Contact btn hover */
    '#contact-button:hover { background: var(--contact-btn-hover-bg) !important; }';
  document.head.appendChild(style);
})();


/* ============================================================
   SOCIAL ICON ID ALIASES
   ============================================================ */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var socials = document.querySelectorAll('#footer-social-icons .social-icon');
    var ids = ['footer-social-fb', 'footer-social-ig', 'footer-social-tt', 'footer-social-x'];
    socials.forEach(function (el, i) {
      if (ids[i]) el.id = ids[i];
    });
  });
})();


/* ============================================================
   INIT ALL SPECTRUM COLOR PICKERS
   ============================================================ */
$(function () {

  /* ── NAVBAR ── */
  initSpectrum('navBgColor',        '--navbar-bg');
  initSpectrum('navLinkColor',      '--nav-link-color');
  initSpectrum('navLinkHoverColor', '--nav-link-hover-color');
  initSpectrum('bookBtnBg',         '--book-btn-bg');
  initSpectrum('bookBtnColor',      '--book-btn-color');
  initSpectrum('bookBtnHoverBg',    '--book-btn-hover-bg');
  initSpectrum('logoText1Color',    '--logo-text1-color');
  initSpectrum('logoText2Color',    '--logo-text2-color');

  /* ── HERO ── */
  initSpectrum('heroTitleColor',      '--hero-title-color');
  initSpectrum('heroDescColor',       '--hero-desc-color');
  initSpectrum('heroBookBtnBg',       '--hero-book-btn-bg');
  initSpectrum('heroBookBtnColor',    '--hero-book-btn-color');
  initSpectrum('heroBookBtnHoverBg',  '--hero-book-btn-hover-bg');
  initSpectrum('heroRoomBtnColor',    '--hero-room-btn-color');
  initSpectrum('heroRoomBtnBorder',   '--hero-room-btn-border-color');
  initSpectrum('heroRoomBtnHoverBg',  '--hero-room-btn-hover-bg');
  initSpectrum('heroRoomBtnHoverClr', '--hero-room-btn-hover-color');

  /* ── ABOUT ── */
  initSpectrum('aboutBgColor',       '--about-bg');
  initSpectrum('aboutTagBg',         '--about-tag-bg');
  initSpectrum('aboutTagColor',      '--about-tag-color');
  initSpectrum('aboutTitleColor',    '--about-title-color');
  initSpectrum('aboutDescColor',     '--about-desc-color');
  initSpectrum('aboutRoomBtnBg',     '--about-room-btn-bg');
  initSpectrum('aboutRoomBtnColor',  '--about-room-btn-color');
  initSpectrum('aboutBookBtnBg',     '--about-book-btn-bg');
  initSpectrum('aboutBookBtnColor',  '--about-book-btn-color');
  initSpectrum('featureIconColor',   '--feature-icon-color');
  initSpectrum('featureTitleColor',  '--feature-title-color');
  initSpectrum('featureDescColor',   '--feature-desc-color');
  initSpectrum('featureCardBg',      '--feature-card-bg');

  /* ── ROOMS ── */
  initSpectrum('roomsBgColor',      '--rooms-bg');
  initSpectrum('roomsTagBg',        '--rooms-tag-bg');
  initSpectrum('roomsTagColor',     '--rooms-tag-color');
  initSpectrum('roomsTitleColor',   '--rooms-title-color');
  initSpectrum('roomsDescColor',    '--rooms-desc-color');
  initSpectrum('roomCardBg',        '--room-card-bg');
  initSpectrum('roomTitleColor',    '--room-title-color');
  initSpectrum('roomDescColor',     '--room-desc-color');
  initSpectrum('roomPriceColor',    '--room-price-color');
  initSpectrum('roomBadgeBg',       '--room-badge-bg');
  initSpectrum('roomBadgeColor',    '--room-badge-color');
  initSpectrum('roomBtnBg',         '--room-btn-bg');
  initSpectrum('roomBtnColor',      '--room-btn-color');
  initSpectrum('roomBtnHoverBg',    '--room-btn-hover-bg');

  /* ── AMENITIES ── */
  initSpectrum('amenitiesBgColor',    '--amenities-bg');
  initSpectrum('amenitiesTagBg',      '--amenities-tag-bg');
  initSpectrum('amenitiesTagColor',   '--amenities-tag-color');
  initSpectrum('amenitiesTitleColor', '--amenities-title-color');
  initSpectrum('amenitiesDescColor',  '--amenities-desc-color');
  initSpectrum('amenityCardBg',       '--amenity-card-bg');
  initSpectrum('amenityCardBorder',   '--amenity-card-border-color');
  initSpectrum('amenityIconColor',    '--amenity-icon-color');
  initSpectrum('amenityIconWrapBg',   '--amenity-icon-wrap-bg');
  initSpectrum('amenityTitleColor',   '--amenity-title-color');
  initSpectrum('amenityDescColor',    '--amenity-desc-color');

  /* ── BOOKING ── */
  initSpectrum('bookingBgColor',      '--booking-bg');
  initSpectrum('bookingTagBg',        '--booking-tag-bg');
  initSpectrum('bookingTagColor',     '--booking-tag-color');
  initSpectrum('bookingFormBg',       '--booking-form-bg');
  initSpectrum('bookingTitleColor',   '--booking-title-color');
  initSpectrum('bookingDescColor',    '--booking-desc-color');
  initSpectrum('bookingInputBg',      '--booking-input-bg');
  initSpectrum('bookingInputColor',   '--booking-input-color');
  initSpectrum('bookingLabelColor',   '--booking-label-color');
  initSpectrum('bookingSubmitBg',     '--booking-submit-bg');
  initSpectrum('bookingSubmitColor',  '--booking-submit-color');
  initSpectrum('bookingWaBg',         '--booking-wa-bg');
  initSpectrum('bookingWaColor',      '--booking-wa-color');
  initSpectrum('bookingCallBg',       '--booking-call-bg');
  initSpectrum('bookingCallColor',    '--booking-call-color');
  initSpectrum('bookingNoticeBg',     '--booking-notice-bg');
  initSpectrum('bookingNoticeText',   '--booking-notice-text-color');

  /* ── TESTIMONIALS ── */
  initSpectrum('testimonialsBgColor',    '--testimonials-bg');
  initSpectrum('testimonialsTagBg',      '--testimonials-tag-bg');
  initSpectrum('testimonialsTagColor',   '--testimonials-tag-color');
  initSpectrum('testimonialsTitleColor', '--testimonials-title-color');
  initSpectrum('testimonialsDescColor',  '--testimonials-desc-color');
  initSpectrum('testimonialsCardBg',     '--testimonial-card-bg');
  initSpectrum('testimonialsTextColor',  '--testimonial-text-color');
  initSpectrum('testimonialsNameColor',  '--testimonial-name-color');
  initSpectrum('testimonialsStarColor',  '--testimonial-star-color');

  /* ── GALLERY ── */
  initSpectrum('galleryBgColor',    '--gallery-bg');
  initSpectrum('galleryTagBg',      '--gallery-tag-bg');
  initSpectrum('galleryTagColor',   '--gallery-tag-color');
  initSpectrum('galleryTitleColor', '--gallery-title-color');
  initSpectrum('galleryDescColor',  '--gallery-desc-color');

  /* ── CONTACT ── */
  initSpectrum('contactBgColor',       '--contact-bg');
  initSpectrum('contactTagBg',         '--contact-tag-bg');
  initSpectrum('contactTagColor',      '--contact-tag-color');
  initSpectrum('contactTitleColor',    '--contact-title-color');
  initSpectrum('contactDescColor',     '--contact-desc-color');
  initSpectrum('contactInputBg',       '--contact-input-bg');
  initSpectrum('contactInputColor',    '--contact-input-color');
  initSpectrum('contactBtnBg',         '--contact-btn-bg');
  initSpectrum('contactBtnColor',      '--contact-btn-color');
  initSpectrum('contactBtnHoverBg',    '--contact-btn-hover-bg');
  initSpectrum('contactBoxTitleColor', '--contact-box-title-color');
  initSpectrum('contactBoxTextColor',  '--contact-box-text-color');

  /* ── FOOTER ── */
  initSpectrum('footerBgColor',        '--footer-bg');
  initSpectrum('footerLogoColor',      '--footer-logo-color');
  initSpectrum('footerDescColor',      '--footer-desc-color');
  initSpectrum('footerHeadingColor',   '--footer-heading-color');
  initSpectrum('footerLinkColor',      '--footer-link-color');
  initSpectrum('footerLinkHoverColor', '--footer-link-hover-color');
  initSpectrum('footerContactColor',   '--footer-contact-color');
  initSpectrum('socialIconColor',      '--social-icon-color');
  initSpectrum('socialIconHoverColor', '--social-icon-hover-color');
  initSpectrum('footerBottomBg',       '--footer-bottom-bg');
  initSpectrum('footerCopyrightColor', '--footer-copyright-color');

}); /* end $(function) */
