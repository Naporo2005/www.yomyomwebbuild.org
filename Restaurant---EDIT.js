/* ============================================================
   YOMYOM WEBBUILDER — EDITOR ENGINE  (v4)
   Added: per-section accent/border/underline color controls.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

/* ============================================================
   CORE BINDING HELPERS
============================================================ */

function bindText(inputId, targetId) {
  const input  = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;
  input.addEventListener("input", () => { target.textContent = input.value; });
}

function bindAttr(inputId, targetId, attr) {
  const input  = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;
  input.addEventListener("input", () => { target.setAttribute(attr, input.value); });
}

function bindImage(inputId, targetId) {
  const input  = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { target.src = e.target.result; };
    reader.readAsDataURL(file);
  });
}

function bindColor(inputId, cssVar) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const styleTag = document.createElement("style");
  styleTag.id    = "style-" + inputId;
  document.head.appendChild(styleTag);

  function tryInit() {
    if (typeof $.fn.spectrum === "undefined") {
      setTimeout(tryInit, 80);
      return;
    }
    $(input).spectrum({
      preferredFormat : "hex",
      showInput       : true,
      showInitial     : true,
      showAlpha       : false,
      showButtons     : true,
      cancelText      : "Cancel",
      chooseText      : "Choose",
      move: function () {},
      change: function (color) {
        if (!color) return;
        input.value = color.toHexString();
        document.documentElement.style.setProperty(cssVar, input.value);
      },
      hide: function () {}
    });
  }

  tryInit();

  input.addEventListener("input", () => {
    document.documentElement.style.setProperty(cssVar, input.value);
  });
}


/* ============================================================
   INJECT :root VARIABLES + SELECTOR WIRING
============================================================ */
const rootStyle = document.createElement("style");
rootStyle.textContent = `
  :root {
    --nav-bg:               rgba(255,255,255,.95);
    --logo-color:           #111;
    --nav-text-color:       #111;
    --nav-hover-color:      #ff7a00;
    --menu-icon-color:      #111;
    --nav-shadow:           0 10px 30px rgba(0,0,0,.08);

    --hero-title-color:     #ffffff;
    --hero-desc-color:      #ffffff;
    --hero-btn-bg:          #ff7a00;
    --hero-btn-text-color:  #ffffff;
    --hero-overlay-rgb:     0,0,0;
    --hero-overlay-opacity: 0.75;

    --about-bg:             #ffffff;
    --about-title-color:    #111;
    --about-subtitle-color: #777;
    --about-heading-color:  #111;
    --about-text-color:     #777;
    --about-bullet-bg:      #ffffff;
    --about-bullet-text:    #222;
    --about-bullet-border:  #ff7a00;
    --about-title-underline:#ff7a00;

    --stats-bg:             #fff8f0;
    --stats-number-color:   #111;
    --stats-text-color:     #777;
    --stats-icon-color:     #ff7a00;
    --stats-card-bg:        #ffffff;

    --dishes-bg:            #fafafa;
    --dishes-card-bg:       #ffffff;
    --dishes-title-color:   #111;
    --dishes-subtitle-color:#777;
    --dishes-card-title-color:#111;
    --dishes-text-color:    #777;
    --dishes-price-color:   #ffffff;
    --dish-border-color:    #ff7a00;
    --dishes-title-underline:#ff7a00;

    --order-bg:             #ffffff;
    --order-title-color:    #111;
    --order-subtitle-color: #777;
    --order-form-bg:        #ffffff;
    --order-label-color:    #111;
    --order-text-color:     #222;
    --order-whatsapp-bg:    #25D366;
    --order-whatsapp-text:  #ffffff;
    --order-call-bg:        #ff7a00;
    --order-call-text:      #ffffff;
    --order-title-underline:#ff7a00;

    --contact-bg:           #f8f8f8;
    --contact-card-bg:      #ffffff;
    --contact-title-color:  #111;
    --contact-subtitle-color:#777;
    --contact-text-color:   #777;
    --contact-icon-color:   #ff7a00;
    --contact-title-underline:#ff7a00;

    --footer-bg:            #fef3e8;
    --footer-text-color:    #777;
    --footer-link-color:    #777;
    --footer-icon-hover:    #ff7a00;

    --float-wa-bg:          #25D366;
    --float-wa-icon:        #ffffff;
    --float-call-bg-var:    #ff7a00;
    --float-call-icon:      #ffffff;
  }

  /* ── Navbar ── */
  .header, .nav      { background: var(--nav-bg)         !important; }
  .header            { box-shadow: var(--nav-shadow)      !important; }
  .logo-area h2      { color: var(--logo-color)           !important; }
  .nav a             { color: var(--nav-text-color)       !important; }
  .nav a:hover       { color: var(--nav-hover-color)      !important; }
  .nav a::after      { background: var(--nav-hover-color) !important; }
  .menu-btn          { color: var(--menu-icon-color)      !important; }

  /* ── Hero ── */
  .hero-content h1   { color: var(--hero-title-color)     !important; }
  .hero-content p    { color: var(--hero-desc-color)      !important; }
  .hero-btn          { background: var(--hero-btn-bg)     !important;
                       color: var(--hero-btn-text-color)  !important; }
  .overlay           { background: rgba(var(--hero-overlay-rgb), var(--hero-overlay-opacity)) !important; }

  /* ── About ── */
  #about             { background: var(--about-bg)        !important; }
  #about-title       { color: var(--about-title-color)    !important; }
  #about-subtitle    { color: var(--about-subtitle-color) !important; }
  #about-heading     { color: var(--about-heading-color)  !important; }
  #about-text        { color: var(--about-text-color)     !important; }
  .about-content li  { background: var(--about-bullet-bg)   !important;
                       color: var(--about-bullet-text)      !important;
                       border-left-color: var(--about-bullet-border) !important; }
  #about-title::after{ background: var(--about-title-underline) !important; }

  /* ── Stats ── */
  #stats             { background: var(--stats-bg)        !important; }
  .stat-card         { background: var(--stats-card-bg)   !important; }
  .stat-card h3      { color: var(--stats-number-color)   !important; }
  .stat-card p       { color: var(--stats-text-color)     !important; }
  .stat-card i       { color: var(--stats-icon-color)     !important; }

  /* ── Dishes ── */
  #dishes            { background: var(--dishes-bg)       !important; }
  .dish-card::after  { background: var(--dishes-card-bg)  !important; }
  #dishes-title      { color: var(--dishes-title-color)   !important; }
  #dishes-subtitle   { color: var(--dishes-subtitle-color)!important; }
  .dish-content h3   { color: var(--dishes-card-title-color)!important; }
  .dish-content p    { color: var(--dishes-text-color)    !important; }
  .dish-content span { color: var(--dishes-price-color)   !important; }
  .dish-card::before { background: linear-gradient(90deg,
                         var(--dish-border-color), #ffb703) !important;
                       background-size: 300% 300% !important; }
  #dishes-title::after { background: var(--dishes-title-underline) !important; }

  /* ── Order ── */
  #order             { background: var(--order-bg)        !important; }
  #order-title       { color: var(--order-title-color)    !important; }
  #order-subtitle    { color: var(--order-subtitle-color) !important; }
  .order-form        { background: var(--order-form-bg)   !important; }
  .order-form label  { color: var(--order-label-color)    !important; }
  .whatsapp-btn      { background: var(--order-whatsapp-bg)  !important;
                       color: var(--order-whatsapp-text)     !important; }
  .call-btn          { background: var(--order-call-bg)   !important;
                       color: var(--order-call-text)      !important; }
  #order-title::after{ background: var(--order-title-underline) !important; }

  /* ── Contact ── */
  #contact           { background: var(--contact-bg)      !important; }
  .contact-item      { background: var(--contact-card-bg) !important; }
  #contact-title     { color: var(--contact-title-color)  !important; }
  #contact-subtitle  { color: var(--contact-subtitle-color)!important; }
  .contact-item p    { color: var(--contact-text-color)   !important; }
  .contact-item i    { color: var(--contact-icon-color)   !important; }
  #contact-title::after { background: var(--contact-title-underline) !important; }

  /* ── Footer ── */
  footer             { background: var(--footer-bg)       !important; }
  .footer-brand p,
  .footer-bottom p   { color: var(--footer-text-color)    !important; }
  .footer-links a    { color: var(--footer-link-color)    !important; }
  .social-icons a:hover { background: var(--footer-icon-hover) !important; }

  /* ── Floating buttons ── */
  .whatsapp-float    { background: var(--float-wa-bg)      !important;
                       color: var(--float-wa-icon)         !important; }
  .call-float        { background: var(--float-call-bg-var)!important;
                       color: var(--float-call-icon)       !important; }
`;
document.head.appendChild(rootStyle);


/* ============================================================
   NAVBAR
============================================================ */

bindImage("logo-img-upload", "logo-img");
bindText("logo-text-input",  "logo-text");

bindText("nav-home-input",    "nav-home");
bindText("nav-about-input",   "nav-about");
bindText("nav-dishes-input",  "nav-dishes");
bindText("nav-order-input",   "nav-order");
bindText("nav-contact-input", "nav-contact");

bindColor("nav-bg-color",     "--nav-bg");
bindColor("logo-color",       "--logo-color");
bindColor("nav-text-color",   "--nav-text-color");
bindColor("nav-hover-color",  "--nav-hover-color");
bindColor("menu-icon-color",  "--menu-icon-color");
bindColor("nav-shadow-color", "--nav-shadow");


/* ============================================================
   HERO  (3 slides)
============================================================ */

for (let i = 1; i <= 3; i++) {
  bindImage(`hero-img-upload-${i}`, `hero-img-${i}`);
  bindText(`hero-title-input-${i}`, `hero-title-${i}`);
  bindText(`hero-desc-input-${i}`,  `hero-desc-${i}`);
  bindAttr(`hero-btn-link-${i}`,    `hero-btn-${i}`, "href");

  const btnTxtInp = document.getElementById(`hero-btn-text-${i}`);
  const btnTarget = document.getElementById(`hero-btn-${i}`);
  if (btnTxtInp && btnTarget) {
    btnTxtInp.addEventListener("input", () => {
      btnTarget.textContent = btnTxtInp.value;
    });
  }
}

bindColor("hero-title-color",    "--hero-title-color");
bindColor("hero-desc-color",     "--hero-desc-color");
bindColor("hero-btn-bg",         "--hero-btn-bg");
bindColor("hero-btn-text-color", "--hero-btn-text-color");
/* Overlay — color picker sets the RGB, opacity slider sets the alpha.
   Both rebuild the rgba() together so they stay in sync.           */
(function () {
  const colorInp   = document.getElementById("hero-overlay-color");
  const opacityInp = document.getElementById("hero-overlay-opacity");
  if (!colorInp || !opacityInp) return;

  /* Convert #rrggbb → "r,g,b" string for CSS var */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `${r},${g},${b}`;
  }

  function applyOverlay() {
    const rgb     = hexToRgb(colorInp.value || "#000000");
    const opacity = parseFloat(opacityInp.value);
    document.documentElement.style.setProperty("--hero-overlay-rgb",     rgb);
    document.documentElement.style.setProperty("--hero-overlay-opacity", opacity);
  }

  /* Wire opacity range input — live update is fine here */
  opacityInp.addEventListener("input", applyOverlay);

  /* Wire color picker via Spectrum — apply only on Choose */
  function tryInitOverlay() {
    if (typeof $.fn.spectrum === "undefined") { setTimeout(tryInitOverlay, 80); return; }
    $(colorInp).spectrum({
      preferredFormat : "hex",
      showInput       : true,
      showInitial     : true,
      showAlpha       : false,
      showButtons     : true,
      cancelText      : "Cancel",
      chooseText      : "Choose",
      move   : function () {},
      hide   : function () {},
      change : function (color) {
        if (!color) return;
        colorInp.value = color.toHexString();
        applyOverlay();
      }
    });
  }
  tryInitOverlay();
})();


/* ============================================================
   ABOUT
============================================================ */

bindText("about-title-input",    "about-title");
bindText("about-subtitle-input", "about-subtitle");
bindText("about-heading-input",  "about-heading");
bindText("about-text-input",     "about-text");

for (let i = 1; i <= 4; i++) {
  bindText(`about-point-${i}-input`, `about-point-${i}`);
  bindImage(`about-img-upload-${i}`, `about-img-${i}`);
}

bindColor("about-bg-color",              "--about-bg");
bindColor("about-title-color",           "--about-title-color");
bindColor("about-subtitle-color",        "--about-subtitle-color");
bindColor("about-heading-color",         "--about-heading-color");
bindColor("about-text-color",            "--about-text-color");
bindColor("about-bullet-bg-color",       "--about-bullet-bg");
bindColor("about-bullet-text-color",     "--about-bullet-text");
bindColor("about-bullet-border-color",   "--about-bullet-border");
bindColor("about-title-underline-color", "--about-title-underline");


/* ============================================================
   STATS
============================================================ */

for (let i = 1; i <= 4; i++) {
  bindText(`stat-number-${i}-input`, `stat-number-${i}`);
  bindText(`stat-text-${i}-input`,   `stat-text-${i}`);
}

bindColor("stats-bg-color",     "--stats-bg");
bindColor("stats-card-bg-color","--stats-card-bg");
bindColor("stats-number-color", "--stats-number-color");
bindColor("stats-text-color",   "--stats-text-color");
bindColor("stats-icon-color",   "--stats-icon-color");


/* ============================================================
   DISHES  (8 cards)
============================================================ */

bindText("dishes-title-input",    "dishes-title");
bindText("dishes-subtitle-input", "dishes-subtitle");

for (let i = 1; i <= 8; i++) {
  bindText(`dish-title-${i}-input`, `dish-title-${i}`);
  bindText(`dish-desc-${i}-input`,  `dish-desc-${i}`);
  bindText(`dish-price-${i}-input`, `dish-price-${i}`);
  bindImage(`dish-img-${i}-upload`, `dish-img-${i}`);
}

bindColor("dishes-bg-color",           "--dishes-bg");
bindColor("dishes-card-bg",            "--dishes-card-bg");
bindColor("dishes-title-color",        "--dishes-title-color");
bindColor("dishes-subtitle-color",     "--dishes-subtitle-color");
bindColor("dishes-card-title-color",   "--dishes-card-title-color");
bindColor("dishes-text-color",         "--dishes-text-color");
bindColor("dishes-price-color",        "--dishes-price-color");
bindColor("dishes-border-color",       "--dish-border-color");
bindColor("dishes-title-underline",    "--dishes-title-underline");


/* ============================================================
   ORDER SECTION
============================================================ */

bindText("order-title-input",      "order-title");
bindText("order-subtitle-input",   "order-subtitle");
bindText("order-dish-label-input", "dish-label");
bindText("order-qty-label-input",  "qty-label");

const defQtyInput = document.getElementById("order-default-qty-input");
const dishQtyEl   = document.getElementById("dish-qty");
if (defQtyInput && dishQtyEl) {
  defQtyInput.addEventListener("input", () => { dishQtyEl.value = defQtyInput.value; });
}

const dishSelectEl  = document.getElementById("dish-select");
const optionsInput  = document.getElementById("order-dish-options-input");
if (optionsInput && dishSelectEl) {
  optionsInput.addEventListener("input", () => {
    const opts = optionsInput.value.split(",").map(s => s.trim()).filter(Boolean);
    dishSelectEl.innerHTML = "";
    opts.forEach(opt => {
      const o = document.createElement("option");
      o.textContent = opt;
      dishSelectEl.appendChild(o);
    });
  });
}

const waOrderBtn   = document.getElementById("whatsapp-btn");
const waTextInput  = document.getElementById("order-whatsapp-text-input");

if (waTextInput && waOrderBtn) {
  waTextInput.addEventListener("input", () => {
    const icon = waOrderBtn.querySelector("i");
    waOrderBtn.textContent = " " + waTextInput.value;
    if (icon) waOrderBtn.prepend(icon);
  });
}

function updateWALink() {
  const number = document.getElementById("order-whatsapp-number-input")?.value || "";
  const msg    = document.getElementById("order-whatsapp-message-input")?.value || "";
  const clean  = number.replace(/\D/g, "");
  if (waOrderBtn)  waOrderBtn.href = `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  const floatWA  = document.getElementById("floating-whatsapp");
  if (floatWA)     floatWA.href    = `https://wa.me/${clean}`;
}
document.getElementById("order-whatsapp-number-input") ?.addEventListener("input", updateWALink);
document.getElementById("order-whatsapp-message-input")?.addEventListener("input", updateWALink);

const callOrderBtn  = document.getElementById("call-btn");
const callTextInput = document.getElementById("order-call-text-input");

if (callTextInput && callOrderBtn) {
  callTextInput.addEventListener("input", () => {
    const icon = callOrderBtn.querySelector("i");
    callOrderBtn.textContent = " " + callTextInput.value;
    if (icon) callOrderBtn.prepend(icon);
  });
}
document.getElementById("order-call-number-input")?.addEventListener("input", e => {
  if (callOrderBtn) callOrderBtn.href = `tel:${e.target.value}`;
  const floatCall = document.getElementById("floating-call");
  if (floatCall)    floatCall.href    = `tel:${e.target.value}`;
});

bindColor("order-bg-color",              "--order-bg");
bindColor("order-title-color",           "--order-title-color");
bindColor("order-subtitle-color",        "--order-subtitle-color");
bindColor("order-form-bg",               "--order-form-bg");
bindColor("order-label-color",           "--order-label-color");
bindColor("order-text-color",            "--order-text-color");
bindColor("order-whatsapp-bg",           "--order-whatsapp-bg");
bindColor("order-whatsapp-text-color",   "--order-whatsapp-text");
bindColor("order-call-bg",               "--order-call-bg");
bindColor("order-call-text-color",       "--order-call-text");
bindColor("order-title-underline",       "--order-title-underline");


/* ============================================================
   CONTACT
============================================================ */

bindText("contact-title-input",         "contact-title");
bindText("contact-subtitle-input",      "contact-subtitle");
bindText("contact-address-label-input", "address-title");
bindText("contact-address-input",       "address-text");
bindText("contact-phone-label-input",   "phone-title");
bindText("contact-phone-input",         "phone-text");
bindText("contact-hours-label-input",   "hours-title");
bindText("contact-hours-input",         "hours-text");
bindAttr("contact-map-input",           "google-map", "src");

bindColor("contact-bg-color",            "--contact-bg");
bindColor("contact-card-bg-color",       "--contact-card-bg");
bindColor("contact-title-color",         "--contact-title-color");
bindColor("contact-subtitle-color",      "--contact-subtitle-color");
bindColor("contact-text-color",          "--contact-text-color");
bindColor("contact-icon-color",          "--contact-icon-color");
bindColor("contact-title-underline",     "--contact-title-underline");


/* ============================================================
   FOOTER
============================================================ */

bindText("footer-logo-input", "footer-logo");
bindText("footer-text-input", "footer-text");

const footerLinkInputs = [
  "footer-home-text",
  "footer-about-text",
  "footer-dishes-text",
  "footer-order-text",
  "footer-contact-text"
];
const footerAnchors = document.querySelectorAll(".footer-links a");
footerLinkInputs.forEach((inputId, idx) => {
  const inp = document.getElementById(inputId);
  if (inp && footerAnchors[idx]) {
    inp.addEventListener("input", () => { footerAnchors[idx].textContent = inp.value; });
  }
});

bindColor("footer-bg-color",          "--footer-bg");
bindColor("footer-text-color",        "--footer-text-color");
bindColor("footer-link-color",        "--footer-link-color");
bindColor("footer-icon-hover-color",  "--footer-icon-hover");


/* ============================================================
   SOCIAL ICONS  (footer)
============================================================ */

const socialIconMap = {
  facebook:  "fa-facebook-f",
  instagram: "fa-instagram",
  tiktok:    "fa-tiktok",
  youtube:   "fa-youtube",
  snapchat:  "fa-snapchat",
  twitter:   "fa-x-twitter"
};

const socialSlots = [
  { selectId: "social-1-platform", linkId: "facebook-link", colorId: "social-1-color", linkInput: "social-1-link" },
  { selectId: "social-2-platform", linkId: "tiktok-link",   colorId: "social-2-color", linkInput: "social-2-link" },
  { selectId: "social-3-platform", linkId: "youtube-link",  colorId: "social-3-color", linkInput: "social-3-link" }
];

socialSlots.forEach(slot => {
  const selectEl = document.getElementById(slot.selectId);
  const linkEl   = document.getElementById(slot.linkId);
  const linkInp  = document.getElementById(slot.linkInput);
  const colorInp = document.getElementById(slot.colorId);

  if (selectEl && linkEl) {
    selectEl.addEventListener("change", () => {
      const icon = linkEl.querySelector("i");
      if (icon) icon.className = "fab " + (socialIconMap[selectEl.value] || "fa-link");
    });
  }
  if (linkInp && linkEl) {
    linkInp.addEventListener("input", () => { linkEl.href = linkInp.value; });
  }
  if (colorInp && linkEl) {
    colorInp.addEventListener("input", () => { linkEl.style.color = colorInp.value; });
  }
});


/* ============================================================
   FLOATING BUTTONS
============================================================ */

const floatWABtn   = document.getElementById("floating-whatsapp");
const floatCallBtn = document.getElementById("floating-call");

document.getElementById("float-whatsapp-link-input")
  ?.addEventListener("input", e => { if (floatWABtn)   floatWABtn.href   = e.target.value; });
document.getElementById("float-call-link-input")
  ?.addEventListener("input", e => { if (floatCallBtn) floatCallBtn.href = e.target.value; });

document.getElementById("float-size-input")?.addEventListener("input", e => {
  const sz = e.target.value + "px";
  document.querySelectorAll(".floating-btn").forEach(b => { b.style.width = sz; b.style.height = sz; });
});
document.getElementById("float-icon-size-input")?.addEventListener("input", e => {
  document.querySelectorAll(".floating-btn").forEach(b => { b.style.fontSize = e.target.value + "px"; });
});
document.getElementById("float-position-input")?.addEventListener("change", e => {
  const side = e.target.value;
  document.querySelectorAll(".floating-btn").forEach(b => {
    b.style.right = side === "right" ? "25px" : "";
    b.style.left  = side === "left"  ? "25px" : "";
  });
});
document.getElementById("float-bottom-offset-input")?.addEventListener("input", e => {
  const offset = parseInt(e.target.value) || 20;
  if (floatWABtn)   floatWABtn.style.bottom   = offset + "px";
  if (floatCallBtn) floatCallBtn.style.bottom  = (offset + 75) + "px";
});

bindColor("float-whatsapp-bg",         "--float-wa-bg");
bindColor("float-call-bg",             "--float-call-bg-var");
bindColor("float-whatsapp-icon-color", "--float-wa-icon");
bindColor("float-call-icon-color",     "--float-call-icon");


/* ============================================================
   AUTO SAVE  (every 5 s → localStorage)
============================================================ */

function autoSave() {
  const data = {};
  document.querySelectorAll("input[id], textarea[id], select[id]").forEach(el => {
    if (el.type !== "file") data[el.id] = el.value;
  });
  try { localStorage.setItem("yomyom-builder", JSON.stringify(data)); } catch (e) {}
}
setInterval(autoSave, 5000);

}); /* end DOMContentLoaded */
