// ============================================================
//  PORTFOLIO EDITOR — editor.js
//  Spectrum.js for all color pickers. No save/load/reset logic.
// ============================================================

// ── Stored hero image (base64) ────────────────────────────────
let _heroImageBase64 = null;
let _heroGradientColor1 = "rgba(0,0,0,1)";
let _heroGradientColor2 = "rgba(0,0,0,1)";
let _heroOpacity = 0.65;

// ── Spectrum helper ───────────────────────────────────────────
function initSpectrum(selector, callback) {
    $(selector).spectrum({
        type: "color",
        showInput: true,
        showInitial: true,
        showAlpha: true,
        preferredFormat: "rgb",
        showPalette: true,
        palette: [
            ["#000000","#111827","#1f2937","#374151","#6b7280","#ffffff"],
            ["#2563eb","#1d4ed8","#3b82f6","#60a5fa","#93c5fd","#dbeafe"],
            ["#ef4444","#dc2626","#f97316","#eab308","#22c55e","#14b8a6"]
        ],
        move:   function(color){ if(color) callback(color.toRgbString()); },
        change: function(color){ if(color) callback(color.toRgbString()); }
    });
}

// ── Generic helpers ───────────────────────────────────────────
function el(id) {
    return document.getElementById(id);
}
function setText(id, value) {
    const e = el(id);
    if (e) e.textContent = value;
}
function setHref(id, value) {
    const e = el(id);
    if (e) e.href = value;
}
function injectStyle(styleId, css) {
    let tag = document.getElementById(styleId);
    if (!tag) {
        tag = document.createElement("style");
        tag.id = styleId;
        document.head.appendChild(tag);
    }
    tag.innerHTML = css;
}

// ── Apply hero background (gradient + image) ──────────────────
function applyHeroBackground() {
    const hero = el("home");
    if (!hero) return;

    // Build rgba strings with current opacity applied
    const c1 = _heroGradientColor1;
    const c2 = _heroGradientColor2;
    const opacity = _heroOpacity;

    // Parse color and inject opacity
    function withOpacity(rgbString, op) {
        // handles both rgb(...) and rgba(...)
        const match = rgbString.match(/[\d.]+/g);
        if (!match) return `rgba(0,0,0,${op})`;
        return `rgba(${match[0]},${match[1]},${match[2]},${op})`;
    }

    const grad = `linear-gradient(${withOpacity(c1, opacity)}, ${withOpacity(c2, opacity)})`;

    if (_heroImageBase64) {
        hero.style.backgroundImage = `${grad}, url('${_heroImageBase64}')`;
    } else {
        // No image uploaded yet — keep the CSS image, just update gradient
        const computed = getComputedStyle(hero).backgroundImage;
        // Extract url(...) part if it exists
        const urlMatch = computed.match(/url\([^)]+\)/);
        if (urlMatch) {
            hero.style.backgroundImage = `${grad}, ${urlMatch[0]}`;
        } else {
            hero.style.backgroundImage = grad;
        }
    }
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
}

// ── Image uploaders ───────────────────────────────────────────

// HERO — uses hidden file input trick so the base64 is stored
function uploadHeroImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        _heroImageBase64 = e.target.result;
        applyHeroBackground();
    };
    reader.readAsDataURL(file);
}

function uploadLogoImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = document.querySelector("#header img");
        if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function uploadAboutImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = document.querySelector("#about-image img");
        if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function uploadCardImage(cardId, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const card = el(cardId);
        if (card) {
            const img = card.querySelector("img");
            if (img) img.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

// ── Nav helpers ───────────────────────────────────────────────
function setNavText(id, value) {
    const e = el(id);
    if (e) e.textContent = value;
}
function setNavHref(id, value) {
    const e = el(id);
    if (e) e.href = value;
}

// ── Colour setters ────────────────────────────────────────────

// NAVBAR
function setNavBg(color) {
    const nav = el("header");
    if (nav) nav.style.backgroundColor = color;
}
function setNavTextColor(color) {
    document.querySelectorAll("#header a").forEach(a => a.style.color = color);
}
function setNavHoverColor(color) {
    injectStyle("nav-hover-style", `#header a:hover { color: ${color} !important; }`);
}

// HERO
function setHeroGradientColor1(color) {
    _heroGradientColor1 = color;
    applyHeroBackground();
}
function setHeroGradientColor2(color) {
    _heroGradientColor2 = color;
    applyHeroBackground();
}
function setHeroOpacity(value) {
    _heroOpacity = parseFloat(value);
    // Update displayed opacity value
    const display = el("opacityDisplay");
    if (display) display.textContent = parseFloat(value).toFixed(2);
    applyHeroBackground();
}

// ABOUT
function setAboutBg(color) {
    const e = el("about");
    if (e) e.style.background = color;
}
function setAboutTitleColor(color) {
    const e = el("about-title");
    if (e) e.style.color = color;
}
function setAboutDescColor(color) {
    const e = el("about-desc");
    if (e) e.style.color = color;
}

// WHAT I DO
function setWhatBg(color) {
    const e = el("what-i-do");
    if (e) e.style.background = color;
}
function setWhatTitleColor(color) {
    const e = el("what-i-do-title");
    if (e) e.style.color = color;
}
function setCaptionBg(color) {
    document.querySelectorAll(".card-caption").forEach(p => p.style.background = color);
}
function setCaptionText(color) {
    document.querySelectorAll(".card-caption").forEach(p => p.style.color = color);
}

// HIRE ME
function setHireBg(color) {
    const e = el("hire-me");
    if (e) e.style.background = color;
}
function setHireTitleColor(color) {
    const e = el("hire-me-title");
    if (e) e.style.color = color;
}
function setHireDescColor(color) {
    const e = el("hire-me-desc");
    if (e) e.style.color = color;
}
function setHireBtnBg(color) {
    const e = el("hire-btn");
    if (e) e.style.background = color;
}
function setHireBtnTextColor(color) {
    const e = el("hire-btn");
    if (e) e.style.color = color;
}

// FOOTER
function setFooterBg(color) {
    const e = el("footer");
    if (e) e.style.background = color;
}
function setFooterTextColor(color) {
    const e = el("footer");
    if (e) e.style.color = color;
}

// ── Init all Spectrum pickers ─────────────────────────────────
$(function () {

    // NAVBAR
    initSpectrum("#navBgColor",    setNavBg);
    initSpectrum("#navTextColor",  setNavTextColor);
    initSpectrum("#navHoverColor", setNavHoverColor);

    // HERO
    initSpectrum("#heroGradientColor1", setHeroGradientColor1);
    initSpectrum("#heroGradientColor2", setHeroGradientColor2);
    initSpectrum("#heroTitleColor", function(color) {
        const e = el("hero-title");
        if (e) e.style.color = color;
    });

    // ABOUT
    initSpectrum("#aboutBgColor",    setAboutBg);
    initSpectrum("#aboutTitleColor", setAboutTitleColor);
    initSpectrum("#aboutDescColor",  setAboutDescColor);

    // WHAT I DO
    initSpectrum("#whatTitleColor",   setWhatTitleColor);
    initSpectrum("#whatBgColor",      setWhatBg);
    initSpectrum("#captionBgColor",   setCaptionBg);
    initSpectrum("#captionTextColor", setCaptionText);

    // HIRE ME
    initSpectrum("#hireBgColor",    setHireBg);
    initSpectrum("#hireTitleColor", setHireTitleColor);
    initSpectrum("#hireDescColor",  setHireDescColor);
    initSpectrum("#hireBtnBg",      setHireBtnBg);
    initSpectrum("#hireBtnText",    setHireBtnTextColor);

    // FOOTER
    initSpectrum("#footerBgColor",   setFooterBg);
    initSpectrum("#footerTextColor", setFooterTextColor);

});
