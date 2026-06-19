// ======================
// EDITOR PANEL TOGGLE + SPECTRUM INIT
// ======================
document.querySelectorAll(".editor-btn").forEach(button => {
    button.addEventListener("click", () => {
        const box = button.parentElement;
        box.classList.toggle("active");

        const icon = button.querySelector("span:last-child");
        if (icon) icon.textContent = box.classList.contains("active") ? "✕" : "☰";

        if (box.classList.contains("active")) {
            $(box).find('input[type="color"]').spectrum({
                type: "component",
                showInput: true,
                preferredFormat: "hex",
                showPalette: true,
                allowEmpty: false,
                change: function (color) {
                    const hex = color.toHexString();
                    $(this).val(hex);
                    this.dispatchEvent(new Event("input", { bubbles: true }));
                }
            });
        }
    });
});

// Shorthand helpers
const root = document.documentElement;
const setVar = (name, val) => { if (val !== undefined && val !== "") root.style.setProperty(name, val); };
const getEl  = (id) => document.getElementById(id);

// ======================
// BODY BACKGROUND
// ======================
getEl("bodyBgPicker")?.addEventListener("input", function () {
    setVar("--body-bg", this.value);
    document.body.style.backgroundColor = this.value;
});

// ======================
// NAV COLORS
// ======================
getEl("navBgPicker")?.addEventListener("input", function () {
    const hex = this.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    setVar("--nav-bg", `rgba(${r}, ${g}, ${b}, 0.85)`);
});

getEl("navTextPicker")?.addEventListener("input", function () {
    setVar("--nav-text", this.value);
});

getEl("navHoverPicker")?.addEventListener("input", function () {
    setVar("--nav-hover", this.value);
});

// ======================
// NAV LINK TEXT
// ======================
const navMap = [
    ["editNavAbout",    "navAbout"],
    ["editNavServices", "navServices"],
    ["editNavWork",     "navWork"],
    ["editNavReviews",  "navReviews"],
    ["editNavContact",  "navContact"]
];
navMap.forEach(([inputId, targetId]) => {
    getEl(inputId)?.addEventListener("input", function () {
        const el = getEl(targetId);
        if (el) el.textContent = this.value;
    });
});

// ======================
// HERO BACKGROUND COLOR
// ======================
getEl("heroBgColor")?.addEventListener("input", function () {
    setVar("--hero-bg-color", this.value);
});

// HERO UPLOAD BUTTON
getEl("heroUploadBtn")?.addEventListener("click", () => {
    getEl("heroBgImage").click();
});

// HERO BACKGROUND IMAGE
getEl("heroBgImage")?.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        setVar("--hero-bg-image", `url(${event.target.result})`);
    };
    reader.readAsDataURL(file);
});

// ======================
// HERO GRADIENT
// ======================
getEl("heroGradient1")?.addEventListener("input", function () {
    setVar("--hero-gradient-1", this.value);
});
getEl("heroGradient2")?.addEventListener("input", function () {
    setVar("--hero-gradient-2", this.value);
});
getEl("heroGradientOpacity")?.addEventListener("input", function () {
    setVar("--hero-gradient-opacity", this.value);
});

// ======================
// BRAND NAME
// ======================
getEl("editBrandName")?.addEventListener("input", function () {
    const brand = getEl("brandname");
    if (!brand) return;
    const textNode = Array.from(brand.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = this.value + " ";
});

getEl("brandColorPicker")?.addEventListener("input", function () {
    setVar("--hero-title-color", this.value);
});

// ======================
// HERO BADGE
// ======================
const badgeIcons = {
    crown: `<svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18L5 8L9 12L12 6L15 12L19 8L21 18H3Z"/><rect x="3" y="18" width="18" height="2"/></svg>`,
    star: `<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9Z"/></svg>`,
    starh: `<svg width="34" height="34" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9Z"/></svg>`,
    scissors: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="17" r="2.2"/><circle cx="18" cy="17" r="2.2"/><path d="M7.5 8.5L16.5 15.5"/><path d="M7.5 15.5L16.5 8.5"/></svg>`,
    scissors2: `<svg width="50" height="50" viewBox="0 0 64 64"><circle cx="22" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="15"/><circle cx="42" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="15"/><line x1="32" y1="30" x2="22" y2="50" fill="none" stroke="currentColor" stroke-width="15"/><line x1="32" y1="30" x2="42" y2="50" fill="none" stroke="currentColor" stroke-width="15"/><path fill="currentColor" d="M32 30L12 10L14 8L32 28Z"/><path fill="currentColor" d="M32 30L52 10L50 8L32 28Z"/></svg>`,
    fire: `<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2S6 9 6 14A6 6 0 0 0 18 14C18 9 13 2 13 2Z"/></svg>`,
    man1: `<svg width="45" height="34" viewBox="0 0 120 80"><path d="M30 10 L50 10 L100 30 V70 H10 Z" fill="" stroke="currentColor" stroke-width="3"/><path d="M25 10 C25 0, 45 0, 45 10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M110 30 L80 10 L36 30 V70 H110 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M95 10 C53 0, 75 0, 75 10" fill="" stroke="currentColor" stroke-width="3"/></svg>`,
    verified: `<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 5L20 6L18 11L20 16L15 17L12 22L9 17L4 16L6 11L4 6L9 5Z"/><path d="M9.5 12L11 13.5L15 9.5" stroke="white" stroke-width="2" fill="none"/></svg>`,
    verified2: `<svg width="34" height="34" viewBox="0 0 64 64" fill="none"><path d="M12 34 L26 48 L52 18" stroke="currentColor" stroke-width="5"/></svg>`,
    houseBadge: `<svg width="22" height="22" viewBox="0 0 64 64"><path d="M12 28L32 10L52 28V54H12V28Z" fill="none" stroke="currentColor" stroke-width="3"/><rect x="28" y="38" width="8" height="16" fill="none" stroke="currentColor" stroke-width="3"/><line x1="20" y1="44" x2="44" y2="20" stroke="currentColor" stroke-width="3"/></svg>`,
    tm: "™",
    reg: "®"
};

getEl("heroBadgeSelect")?.addEventListener("change", function () {
    const heroBadge = getEl("heroBadge");
    if (heroBadge) heroBadge.innerHTML = badgeIcons[this.value] || "";
});

getEl("heroBadgeColor")?.addEventListener("input", function () {
    setVar("--hero-badge-color", this.value);
});

// ======================
// HERO TEXT PARTS
// ======================
getEl("editHeroPart1")?.addEventListener("input", e => {
    const el = getEl("heroPart1"); if (el) el.textContent = e.target.value;
});
getEl("editHeroPart2")?.addEventListener("input", e => {
    const el = getEl("heroPart2"); if (el) el.textContent = e.target.value;
});
getEl("editHeroPart3")?.addEventListener("input", e => {
    const el = getEl("heroPart3"); if (el) el.textContent = e.target.value;
});

getEl("colorHeroPart1")?.addEventListener("input", function () {
    setVar("--hero-part1-color", this.value);
    const el = getEl("heroPart1"); if (el) el.style.color = this.value;
});
getEl("colorHeroPart2")?.addEventListener("input", function () {
    setVar("--hero-part2-color", this.value);
    const el = getEl("heroPart2"); if (el) el.style.color = this.value;
});
getEl("colorHeroPart3")?.addEventListener("input", function () {
    setVar("--hero-part3-color", this.value);
    const el = getEl("heroPart3"); if (el) el.style.color = this.value;
});

// ======================
// FONTS
// ======================
getEl("fontBrand")?.addEventListener("change", function () { setVar("--font-brand", this.value); });
getEl("fontSlogan")?.addEventListener("change", function () { setVar("--font-slogan", this.value); });
getEl("fontButton")?.addEventListener("change", function () { setVar("--font-button", this.value); });

// ======================
// HERO BUTTON
// ======================
getEl("editHeroBtntext")?.addEventListener("input", function () {
    const btn = getEl("heroBtn"); if (btn) btn.textContent = this.value;
});
getEl("buttonColorPicker")?.addEventListener("input", function () { setVar("--hero-btn-bg", this.value); });
getEl("buttonTextColorPicker")?.addEventListener("input", function () { setVar("--hero-btn-text", this.value); });
getEl("buttonHoverColorPicker")?.addEventListener("input", function () { setVar("--hero-btn-hover-bg", this.value); });
getEl("buttonHoverTextColorPicker")?.addEventListener("input", function () { setVar("--hero-btn-hover-text", this.value); });

// CTA BUTTON DESTINATION
getEl("ctaTargetSelect")?.addEventListener("change", function () {
    const btn = getEl("heroBtn");
    if (btn) btn.setAttribute("href", `#${this.value}Section`);
});

// ======================
// SUP SYMBOLS
// ======================
function bindSup(selectId, inputId, supId) {
    const select = getEl(selectId);
    const input  = getEl(inputId);
    const sup    = getEl(supId);
    if (!sup) return;
    select?.addEventListener("change", function () {
        input.value = "";
        sup.textContent = this.value;
        sup.style.display = this.value ? "inline" : "none";
    });
    input?.addEventListener("input", function () {
        select.value = "";
        sup.textContent = this.value;
        sup.style.display = this.value ? "inline" : "none";
    });
}
bindSup("sup1Select", "sup1Input", "heroSup1");
bindSup("sup2Select", "sup2Input", "heroSup2");

// SUP COLORS — stored as CSS vars
getEl("colorSup1")?.addEventListener("input", function () {
    setVar("--hero-sup1-color", this.value);
    const sup = getEl("heroSup1"); if (sup) sup.style.color = this.value;
});
getEl("colorSup2")?.addEventListener("input", function () {
    setVar("--hero-sup2-color", this.value);
    const sup = getEl("heroSup2"); if (sup) sup.style.color = this.value;
});

// ======================
// ABOUT SECTION
// ======================
const aboutSection   = getEl("aboutSection");
const aboutP1        = getEl("aboutP1");
const aboutP2        = getEl("aboutP2");
const aboutP3        = getEl("aboutP3");
const aboutP1Input   = getEl("aboutP1Input");
const aboutP2Input   = getEl("aboutP2Input");
const aboutP3Input   = getEl("aboutP3Input");

if (aboutP1Input && aboutP1) aboutP1Input.value = aboutP1.innerText;
if (aboutP2Input && aboutP2) aboutP2Input.value = aboutP2.innerText;
if (aboutP3Input && aboutP3) aboutP3Input.value = aboutP3.innerText;

getEl("aboutBgColor")?.addEventListener("input", function () {
    setVar("--about-bg", this.value);
});
getEl("aboutTitleColor")?.addEventListener("input", function () {
    setVar("--about-title-color", this.value);
});
getEl("aboutTextColor")?.addEventListener("input", function () {
    setVar("--about-text-color", this.value);
});

aboutP1Input?.addEventListener("input", () => { if (aboutP1) aboutP1.innerText = aboutP1Input.value; });
aboutP2Input?.addEventListener("input", () => { if (aboutP2) aboutP2.innerText = aboutP2Input.value; });
aboutP3Input?.addEventListener("input", () => { if (aboutP3) aboutP3.innerText = aboutP3Input.value; });

const aboutTitle      = getEl("aboutTitle");
const aboutTitleInput = getEl("aboutTitleInput");

aboutTitleInput?.addEventListener("input", () => {
    if (aboutTitle) aboutTitle.textContent = aboutTitleInput.value;
});

// ABOUT IMAGE
getEl("aboutImgPicker")?.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = getEl("aboutImg");
        if (img) img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// ======================
// SERVICES SECTION
// ======================
getEl("servicesBgPicker")?.addEventListener("input", function () {
    setVar("--services-bg", this.value);
});

function updateService(id) {
    const title = getEl(`inputTitle${id}`).value;
    const desc  = getEl(`inputDesc${id}`).value;
    const price = getEl(`inputPrice${id}`).value;

    getEl(`serviceTitle${id}`).textContent = title;
    getEl(`serviceDesc${id}`).textContent  = desc;
    getEl(`servicePrice${id}`).textContent = price;

    const card   = getEl(`service${id}`);
    const status = getEl(`status${id}`);
    card.classList.remove("hidden-service");
    if (status) { status.textContent = "ON"; status.classList.add("on"); status.classList.remove("off"); }
}

function toggleService(id) {
    const card   = getEl(`service${id}`);
    const status = getEl(`status${id}`);
    const isHidden = card.classList.contains("hidden-service");
    if (isHidden) {
        card.classList.remove("hidden-service");
        if (status) { status.textContent = "ON"; status.classList.add("on"); status.classList.remove("off"); }
    } else {
        card.classList.add("hidden-service");
        if (status) { status.textContent = "OFF"; status.classList.add("off"); status.classList.remove("on"); }
    }
}

function resetService(id) {
    getEl(`serviceTitle${id}`).textContent = "";
    getEl(`serviceDesc${id}`).textContent  = "";
    getEl(`servicePrice${id}`).textContent = "";
    const card = getEl(`service${id}`);
    card.classList.add("hidden-service");
    const status = getEl(`status${id}`);
    if (status) { status.textContent = "OFF"; status.classList.add("off"); status.classList.remove("on"); }
    const ti = getEl(`inputTitle${id}`); const di = getEl(`inputDesc${id}`); const pi = getEl(`inputPrice${id}`);
    if (ti) ti.value = ""; if (di) di.value = ""; if (pi) pi.value = "";
}

function changeServicesHeadingText(text)  { const el = getEl("servicesHeading"); if (el) el.textContent = text; }
function changeServicesHeadingColor(color) { setVar("--services-heading-color", color); }
function changeAllServiceTitleColors(color) { setVar("--service-title-color", color); }
function changeAllServiceDescColors(color)  { setVar("--service-desc-color", color); }
function changeAllServicePriceColors(color) { setVar("--service-price-color", color); }
function changeAllServiceCardBg(color)      { setVar("--service-card-bg", color); }
function changeAllServiceBorderColors(color){ setVar("--service-border-color", color); }

// ======================
// WORK / GALLERY SECTION
// ======================
const workTitle      = getEl("workTitle");
const workText       = getEl("workText");
const workTitleInput = getEl("workTitleInput");
const workTextInput  = getEl("workTextInput");

if (workTitleInput && workTitle) workTitleInput.value = workTitle.textContent;
if (workTextInput  && workText)  workTextInput.value  = workText.textContent;

getEl("workTitleInput")?.addEventListener("input", function () { if (workTitle) workTitle.textContent = this.value; });
getEl("workTextInput")?.addEventListener("input",  function () { if (workText)  workText.textContent  = this.value; });
getEl("workTitleColor")?.addEventListener("input", function () { setVar("--work-title-color", this.value); });
getEl("workTextColor")?.addEventListener("input",  function () { setVar("--work-text-color", this.value); });
getEl("workBgColor")?.addEventListener("input",    function () { setVar("--work-bg", this.value); });

function bindWorkImage(inputId, imageId) {
    getEl(inputId)?.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) { const img = getEl(imageId); if (img) img.src = event.target.result; };
        reader.readAsDataURL(file);
    });
}
bindWorkImage("workImg1", "work1");
bindWorkImage("workImg2", "work2");
bindWorkImage("workImg3", "work3");
bindWorkImage("workImg4", "work4");
bindWorkImage("workImg5", "work5");

// ======================
// TESTIMONIALS SECTION
// ======================
document.addEventListener("DOMContentLoaded", function () {

    // SLIDER
    const slider = getEl("testimonial-slider");
    const cards  = document.querySelectorAll(".card");
    const total  = cards.length;
    let index    = 0;

    function moveSlider() {
        if (index >= total) index = 0;
        if (index < 0)      index = total - 1;
        const cardWidth = cards[0].offsetWidth + 20;
        slider.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
    window.nextSlide = function () { index++; moveSlider(); };
    window.prevSlide = function () { index--; moveSlider(); };
    setInterval(() => { index++; moveSlider(); }, 4000);

    // SECTION COLORS — all via CSS variables
    getEl("testimonialSectionBg")?.addEventListener("input", function () {
        setVar("--testimonial-section-bg", this.value);
    });
    getEl("testimonialTitleColor")?.addEventListener("input", function () {
        setVar("--testimonial-title-color", this.value);
    });
    getEl("testimonialCardBg")?.addEventListener("input", function () {
        setVar("--testimonial-card-bg", this.value);
    });
    getEl("testimonialCardText")?.addEventListener("input", function () {
        setVar("--testimonial-card-text", this.value);
    });
    getEl("testimonialNameColor")?.addEventListener("input", function () {
        setVar("--testimonial-card-name", this.value);
    });

    // SECTION TITLE
    getEl("testimonialTitleInput")?.addEventListener("input", function () {
        const el = getEl("testimonialTitle"); if (el) el.textContent = this.value;
    });

    // INDIVIDUAL CARD TEXT (name + review only — colors are global via vars)
    function getIndex() { return getEl("testimonialIndex").value; }

    getEl("nameInput")?.addEventListener("input", function () {
        const i = getIndex(); const el = getEl(`tName${i}`); if (el) el.textContent = this.value;
    });
    getEl("textInput")?.addEventListener("input", function () {
        const i = getIndex(); const el = getEl(`tText${i}`); if (el) el.textContent = this.value;
    });

    // SLIDER BUTTONS
    getEl("btnBgColor")?.addEventListener("input", function () { setVar("--testimonial-btn-bg", this.value); });
    getEl("btnTextColor")?.addEventListener("input", function () { setVar("--testimonial-btn-text", this.value); });

    // ======================
    // CONTACT SECTION
    // ======================
    getEl("contactBgInput")?.addEventListener("input", function () {
        setVar("--contact-bg", this.value);
    });
    getEl("contactTitleColor")?.addEventListener("input", function () {
        setVar("--contact-title-color", this.value);
    });
    getEl("contactDescColor")?.addEventListener("input", function () {
        setVar("--contact-text-color", this.value);
    });
    getEl("infoTextColorInput")?.addEventListener("input", function () {
        setVar("--contact-info-color", this.value);
    });
    getEl("iconColorInput")?.addEventListener("input", function () {
        setVar("--contact-icon-color", this.value);
    });
    getEl("btnColorInput")?.addEventListener("input", function () {
        setVar("--contact-btn-bg", this.value);
    });
    getEl("btnTextColorInput")?.addEventListener("input", function () {
        setVar("--contact-btn-text", this.value);
    });

    getEl("contactTitleInput")?.addEventListener("input", function () {
        const el = getEl("contactTitle"); if (el) el.textContent = this.value;
    });
    getEl("contactDescInput")?.addEventListener("input", function () {
        const el = getEl("contactText"); if (el) el.innerHTML = this.value;
    });

    // CONTACT INFO TEXT
    const contactInfoMap = [
        ["locationTextInput",    "locationText"],
        ["phoneTextInput",       "phoneText"],
        ["whatsappPhoneTextInput","whatsappPhoneText"],
        ["hoursText1Input",      "hourstext1"],
        ["hoursText2Input",      "hourstext2"],
        ["whatsappTextInput",    "btnText"],
    ];
    contactInfoMap.forEach(([inputId, targetId]) => {
        getEl(inputId)?.addEventListener("input", function () {
            const el = getEl(targetId); if (el) el.textContent = this.value;
        });
    });

    getEl("whatsappInput")?.addEventListener("input", function () {
        const number = this.value.replace(/\D/g, "");
        const link = getEl("whatsappLink");
        if (link) link.href = `https://wa.me/${number}`;
    });

    // ======================
    // FOOTER SECTION
    // ======================
    getEl("footerBgColorInput")?.addEventListener("input", function () {
        setVar("--footer-bg", this.value);
    });
    getEl("footerTextColorInput")?.addEventListener("input", function () {
        setVar("--footer-text-color", this.value);
    });
    getEl("footerCopyrightInput")?.addEventListener("input", function () {
        const el = getEl("footerCopyright"); if (el) el.textContent = "© " + this.value;
    });
    getEl("footerSloganInput")?.addEventListener("input", function () {
        const el = getEl("footerSlogan1"); if (el) el.textContent = this.value;
    });

}); // END DOMContentLoaded


// ============================================================
// APPLY ALL DATA — restores a saved draft back into the live
// preview AND into the editor inputs.
// Called by loadDraft() in the Supabase/localStorage script.
// ============================================================
function applyAllData(data) {
    if (!data) return;

    // Helpers
    const setTxt  = (id, val)  => { const el = getEl(id); if (el && val !== undefined && val !== "") el.textContent = val; };
    const setHtml = (id, val)  => { const el = getEl(id); if (el && val !== undefined && val !== "") el.innerHTML = val; };
    const setVal  = (id, val)  => { const el = getEl(id); if (el && val !== undefined && val !== "") el.value = val; };
    const setInner= (id, val)  => { const el = getEl(id); if (el && val !== undefined) el.innerText = val; };

    // ── BODY ────────────────────────────────────────────────
    if (data.bodyBg) {
        setVar("--body-bg", data.bodyBg);
        document.body.style.backgroundColor = data.bodyBg;
        setVal("bodyBgPicker", data.bodyBg);
    }

    // ── NAVBAR ──────────────────────────────────────────────
    if (data.navBg)    { setVar("--nav-bg",    data.navBg); }
    if (data.navText)  { setVar("--nav-text",  data.navText);  setVal("navTextPicker",  data.navText); }
    if (data.navHover) { setVar("--nav-hover", data.navHover); setVal("navHoverPicker", data.navHover); }

    setTxt("navAbout",    data.navAbout);    setVal("editNavAbout",    data.navAbout);
    setTxt("navServices", data.navServices); setVal("editNavServices", data.navServices);
    setTxt("navWork",     data.navWork);     setVal("editNavWork",     data.navWork);
    setTxt("navReviews",  data.navReviews);  setVal("editNavReviews",  data.navReviews);
    setTxt("navContact",  data.navContact);  setVal("editNavContact",  data.navContact);

    // ── HERO ────────────────────────────────────────────────
    if (data.heroBgColor)         { setVar("--hero-bg-color",         data.heroBgColor);         setVal("heroBgColor",         data.heroBgColor); }
    if (data.heroGradient1)       { setVar("--hero-gradient-1",       data.heroGradient1);       setVal("heroGradient1",       data.heroGradient1); }
    if (data.heroGradient2)       { setVar("--hero-gradient-2",       data.heroGradient2);       setVal("heroGradient2",       data.heroGradient2); }
    if (data.heroGradientOpacity) { setVar("--hero-gradient-opacity", data.heroGradientOpacity); setVal("heroGradientOpacity", data.heroGradientOpacity); }

    // Brand name text node
    if (data.brandName) {
        const brand = getEl("brandname");
        if (brand) {
            const textNode = Array.from(brand.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = data.brandName + " ";
        }
        setVal("editBrandName", data.brandName);
    }
    if (data.brandColor) { setVar("--hero-title-color", data.brandColor); setVal("brandColorPicker", data.brandColor); }

    // Slogan parts + per-span colors
    setTxt("heroPart1", data.heroPart1); setVal("editHeroPart1", data.heroPart1);
    setTxt("heroPart2", data.heroPart2); setVal("editHeroPart2", data.heroPart2);
    setTxt("heroPart3", data.heroPart3); setVal("editHeroPart3", data.heroPart3);

    if (data.heroPart1Color) { const el = getEl("heroPart1"); if (el) el.style.color = data.heroPart1Color; setVal("colorHeroPart1", data.heroPart1Color); }
    if (data.heroPart2Color) { const el = getEl("heroPart2"); if (el) el.style.color = data.heroPart2Color; setVal("colorHeroPart2", data.heroPart2Color); }
    if (data.heroPart3Color) { const el = getEl("heroPart3"); if (el) el.style.color = data.heroPart3Color; setVal("colorHeroPart3", data.heroPart3Color); }

    // Sup symbols
    if (data.heroSup1 !== undefined) {
        const sup = getEl("heroSup1");
        if (sup) { sup.textContent = data.heroSup1; sup.style.display = data.heroSup1 ? "inline" : "none"; }
        if (data.heroSup1Color) { sup.style.color = data.heroSup1Color; setVal("colorSup1", data.heroSup1Color); }
        const sup1Select = getEl("sup1Select"); const sup1Input = getEl("sup1Input");
        if (sup1Select && Array.from(sup1Select.options).some(o => o.value === data.heroSup1)) {
            sup1Select.value = data.heroSup1; if (sup1Input) sup1Input.value = "";
        } else if (sup1Input) { sup1Input.value = data.heroSup1; if (sup1Select) sup1Select.value = ""; }
    }
    if (data.heroSup2 !== undefined) {
        const sup = getEl("heroSup2");
        if (sup) { sup.textContent = data.heroSup2; sup.style.display = data.heroSup2 ? "inline" : "none"; }
        if (data.heroSup2Color) { sup.style.color = data.heroSup2Color; setVal("colorSup2", data.heroSup2Color); }
        const sup2Select = getEl("sup2Select"); const sup2Input = getEl("sup2Input");
        if (sup2Select && Array.from(sup2Select.options).some(o => o.value === data.heroSup2)) {
            sup2Select.value = data.heroSup2; if (sup2Input) sup2Input.value = "";
        } else if (sup2Input) { sup2Input.value = data.heroSup2; if (sup2Select) sup2Select.value = ""; }
    }

    // Badge color
    if (data.heroBadgeColor) { setVar("--hero-badge-color", data.heroBadgeColor); setVal("heroBadgeColor", data.heroBadgeColor); }

    // Hero button
    setTxt("heroBtn", data.heroBtnText); setVal("editHeroBtntext", data.heroBtnText);
    if (data.heroBtnBg)        { setVar("--hero-btn-bg",        data.heroBtnBg);        setVal("buttonColorPicker",          data.heroBtnBg); }
    if (data.heroBtnTextColor) { setVar("--hero-btn-text",      data.heroBtnTextColor); setVal("buttonTextColorPicker",      data.heroBtnTextColor); }
    if (data.heroBtnHoverBg)   { setVar("--hero-btn-hover-bg",  data.heroBtnHoverBg);   setVal("buttonHoverColorPicker",     data.heroBtnHoverBg); }
    if (data.heroBtnHoverText) { setVar("--hero-btn-hover-text",data.heroBtnHoverText); setVal("buttonHoverTextColorPicker", data.heroBtnHoverText); }

    // Fonts
    if (data.fontBrand)  { setVar("--font-brand",  data.fontBrand);  setVal("fontBrand",  data.fontBrand); }
    if (data.fontSlogan) { setVar("--font-slogan", data.fontSlogan); setVal("fontSlogan", data.fontSlogan); }
    if (data.fontButton) { setVar("--font-button", data.fontButton); setVal("fontButton", data.fontButton); }

    // ── ABOUT ───────────────────────────────────────────────
    setTxt("aboutTitle", data.aboutTitle); setVal("aboutTitleInput", data.aboutTitle);
    if (data.aboutBg)        { setVar("--about-bg",         data.aboutBg);        setVal("aboutBgColor",    data.aboutBg); }
    if (data.aboutTitleColor){ setVar("--about-title-color",data.aboutTitleColor); setVal("aboutTitleColor", data.aboutTitleColor); }
    if (data.aboutTextColor) { setVar("--about-text-color", data.aboutTextColor);  setVal("aboutTextColor",  data.aboutTextColor); }

    if (data.aboutP1 !== undefined) { setInner("aboutP1", data.aboutP1); setVal("aboutP1Input", data.aboutP1); }
    if (data.aboutP2 !== undefined) { setInner("aboutP2", data.aboutP2); setVal("aboutP2Input", data.aboutP2); }
    if (data.aboutP3 !== undefined) { setInner("aboutP3", data.aboutP3); setVal("aboutP3Input", data.aboutP3); }

    // ── SERVICES ────────────────────────────────────────────
    setTxt("servicesHeading", data.servicesHeading);
    setVal("servicesHeadingInput", data.servicesHeading);

    if (data.servicesBg)           { setVar("--services-bg",           data.servicesBg);           setVal("servicesBgPicker",         data.servicesBg); }
    if (data.servicesHeadingColor) { setVar("--services-heading-color",data.servicesHeadingColor); setVal("servicesHeadingColorPicker",data.servicesHeadingColor); }
    if (data.serviceCardBg)        { setVar("--service-card-bg",       data.serviceCardBg);        setVal("serviceCardBgPicker",       data.serviceCardBg); }
    if (data.serviceTitleColor)    { setVar("--service-title-color",   data.serviceTitleColor);    setVal("serviceTitleColorPicker",   data.serviceTitleColor); }
    if (data.serviceDescColor)     { setVar("--service-desc-color",    data.serviceDescColor);     setVal("serviceDescColorPicker",    data.serviceDescColor); }
    if (data.servicePriceColor)    { setVar("--service-price-color",   data.servicePriceColor);    setVal("servicePriceColorPicker",   data.servicePriceColor); }

    if (data.services) {
        Object.entries(data.services).forEach(([i, s]) => {
            setTxt(`serviceTitle${i}`, s.title); setVal(`inputTitle${i}`, s.title);
            setTxt(`serviceDesc${i}`,  s.desc);  setVal(`inputDesc${i}`,  s.desc);
            setTxt(`servicePrice${i}`, s.price); setVal(`inputPrice${i}`, s.price);
            const card   = getEl(`service${i}`);
            const status = getEl(`status${i}`);
            if (card) {
                if (s.visible) {
                    card.classList.remove("hidden-service");
                    if (status) { status.textContent = "ON"; status.classList.add("on"); status.classList.remove("off"); }
                } else {
                    card.classList.add("hidden-service");
                    if (status) { status.textContent = "OFF"; status.classList.add("off"); status.classList.remove("on"); }
                }
            }
        });
    }

    // ── GALLERY / WORK ──────────────────────────────────────
    setTxt("workTitle", data.workTitle); setVal("workTitleInput", data.workTitle);
    setTxt("workText",  data.workText);  setVal("workTextInput",  data.workText);
    if (data.workBg)        { setVar("--work-bg",          data.workBg);         setVal("workBgColor",    data.workBg); }
    if (data.workTitleColor){ setVar("--work-title-color", data.workTitleColor);  setVal("workTitleColor", data.workTitleColor); }
    if (data.workTextColor) { setVar("--work-text-color",  data.workTextColor);   setVal("workTextColor",  data.workTextColor); }

    // ── TESTIMONIALS ────────────────────────────────────────
    setTxt("testimonialTitle", data.testimonialTitle); setVal("testimonialTitleInput", data.testimonialTitle);
    if (data.testimonialSectionBg)  { setVar("--testimonial-section-bg",  data.testimonialSectionBg);  setVal("testimonialSectionBg",  data.testimonialSectionBg); }
    if (data.testimonialTitleColor) { setVar("--testimonial-title-color", data.testimonialTitleColor); setVal("testimonialTitleColor",  data.testimonialTitleColor); }
    if (data.testimonialCardBg)     { setVar("--testimonial-card-bg",     data.testimonialCardBg);     setVal("testimonialCardBg",      data.testimonialCardBg); }
    if (data.testimonialCardText)   { setVar("--testimonial-card-text",   data.testimonialCardText);   setVal("testimonialCardText",    data.testimonialCardText); }
    if (data.testimonialNameColor)  { setVar("--testimonial-card-name",   data.testimonialNameColor);  setVal("testimonialNameColor",   data.testimonialNameColor); }

    if (data.testimonials) {
        Object.entries(data.testimonials).forEach(([i, t]) => {
            setTxt(`tName${i}`, t.name);
            setTxt(`tText${i}`, t.text);
        });
        const idxEl = getEl("testimonialIndex");
        if (idxEl) {
            const i = idxEl.value;
            if (data.testimonials[i]) {
                setVal("nameInput", data.testimonials[i].name);
                setVal("textInput", data.testimonials[i].text);
            }
        }
    }

    // ── CONTACT ─────────────────────────────────────────────
    setTxt("contactTitle", data.contactTitle); setVal("contactTitleInput", data.contactTitle);
    if (data.contactText !== undefined) { setHtml("contactText", data.contactText); setVal("contactDescInput", data.contactText); }

    if (data.contactBg)        { setVar("--contact-bg",          data.contactBg);        setVal("contactBgInput",     data.contactBg); }
    if (data.contactTitleColor){ setVar("--contact-title-color", data.contactTitleColor); setVal("contactTitleColor",  data.contactTitleColor); }
    if (data.contactTextColor) { setVar("--contact-text-color",  data.contactTextColor);  setVal("contactDescColor",   data.contactTextColor); }
    if (data.contactInfoColor) { setVar("--contact-info-color",  data.contactInfoColor);  setVal("infoTextColorInput", data.contactInfoColor); }
    if (data.contactIconColor) { setVar("--contact-icon-color",  data.contactIconColor);  setVal("iconColorInput",     data.contactIconColor); }
    if (data.contactBtnBg)     { setVar("--contact-btn-bg",      data.contactBtnBg);      setVal("btnColorInput",      data.contactBtnBg); }
    if (data.contactBtnText)   { setVar("--contact-btn-text",    data.contactBtnText);    setVal("btnTextColorInput",  data.contactBtnText); }

    setTxt("locationText",      data.locationText);  setVal("locationTextInput",      data.locationText);
    setTxt("phoneText",         data.phoneText);     setVal("phoneTextInput",         data.phoneText);
    setTxt("whatsappPhoneText", data.whatsappPhone); setVal("whatsappPhoneTextInput", data.whatsappPhone);
    setTxt("hourstext1",        data.hoursText1);    setVal("hoursText1Input",        data.hoursText1);
    setTxt("hourstext2",        data.hoursText2);    setVal("hoursText2Input",        data.hoursText2);
    setTxt("btnText",           data.whatsappBtnText); setVal("whatsappTextInput",    data.whatsappBtnText);

    if (data.whatsappLink) {
        const link = getEl("whatsappLink");
        if (link) link.href = data.whatsappLink;
        const match = data.whatsappLink.match(/wa\.me\/(\d+)/);
        if (match) setVal("whatsappInput", match[1]);
    }

    // ── FOOTER ──────────────────────────────────────────────
    if (data.footerBg)       { setVar("--footer-bg",         data.footerBg);       setVal("footerBgColorInput",   data.footerBg); }
    if (data.footerTextColor){ setVar("--footer-text-color", data.footerTextColor); setVal("footerTextColorInput", data.footerTextColor); }

    if (data.footerCopyright !== undefined) {
        setTxt("footerCopyright", data.footerCopyright);
        const cleaned = data.footerCopyright.replace(/^©\s*/, "");
        setVal("footerCopyrightInput", cleaned);
    }
    setTxt("footerSlogan1", data.footerSlogan); setVal("footerSloganInput", data.footerSlogan);
}
