// ================================
// SPECTRUM HELPER
// ================================
function initSpectrum(selector, callback) {
    $(selector).spectrum({
        type: "color",
        showInput: true,
        showInitial: true,
        showAlpha: false,
        preferredFormat: "hex",
        showPalette: true,
        palette: [
            ["#000000","#ffffff","#ff0000","#00ff00","#0000ff"],
            ["#ffff00","#ff00ff","#00ffff","#ff8800","#8800ff"]
        ],
        move:   function (color) { if (color) callback(color.toHexString()); },
        change: function (color) { if (color) callback(color.toHexString()); }
    });
}

// ================================
// INIT — runs after DOM + jQuery + Spectrum are ready
// ================================
$(function () {

    // ---- BODY BG ----
    initSpectrum("#bodyBgPicker", function (hex) {
        document.documentElement.style.setProperty("--body-bg", hex);
        document.body.style.background = hex;
    });

    // ---- NAVBAR ----
    initSpectrum("#navBgColor",    setNavBg);
    initSpectrum("#navTextColor",  setNavTextColor);
    initSpectrum("#navHoverColor", setNavHoverColor);

    // ---- HERO GRADIENT ----
    initSpectrum("#heroGradientColor1", _updateHeroGradient);
    initSpectrum("#heroGradientColor2", _updateHeroGradient);
    initSpectrum("#heroGradientColor3", _updateHeroGradient);

    // ---- HERO TEXT / BUTTON ----
    initSpectrum("#heroTitleColor", function (hex) { if (heroTitle)       heroTitle.style.color = hex; });
    initSpectrum("#heroDescColor",  function (hex) { if (heroDescription) heroDescription.style.color = hex; });
    initSpectrum("#heroBtnBg",      function (hex) { if (heroButton)      heroButton.style.background = hex; });
    initSpectrum("#heroBtnText",    function (hex) { if (heroButton)      heroButton.style.color = hex; });
    initSpectrum("#heroBtnHoverBg",   _syncHeroBtnHover);
    initSpectrum("#heroBtnHoverText", _syncHeroBtnHover);

    // ---- ABOUT ----
    initSpectrum("#aboutBgColor",      setAboutBg);
    initSpectrum("#aboutTitleColor",   setAboutTitleColor);
    initSpectrum("#aboutDescColor",    setAboutDescriptionColor);
    initSpectrum("#aboutBoxBgColor",   setAboutBoxBg);
    initSpectrum("#aboutBoxTextColor", setAboutBoxTextColor);
    initSpectrum("#aboutIconColor",    setAboutIconColor);

    // ---- SERVICES ----
    initSpectrum("#servicesBgColor",    setServicesBg);
    initSpectrum("#servicesTitleColor", setServicesTitleColor);
    initSpectrum("#servicesCardBg",     setServicesCardBg);
    initSpectrum("#servicesCardTitle",  setServicesCardTitleColor);
    initSpectrum("#servicesCardText",   setServicesCardTextColor);

    // ---- PORTFOLIO / WORK ----
    initSpectrum("#workBgColor",        setWorkBg);
    initSpectrum("#workTitleColor",     setWorkTitleColor);
    initSpectrum("#workCardBg",         setWorkCardBg);
    initSpectrum("#workCardTitleColor", setWorkCardTitleColor);
    initSpectrum("#workCardTextColor",  setWorkCardTextColor);

    // ---- CONTACT ----
    initSpectrum("#contactBgColor",      setContactBg);
    initSpectrum("#contactTitleColor",   setContactTitleColor);
    initSpectrum("#contactDescColor",    setContactDescriptionColor);
    initSpectrum("#contactIconColor",    setContactIconColor);
    initSpectrum("#contactBtnBg",        _syncContactBtn);
    initSpectrum("#contactBtnText",      _syncContactBtn);
    initSpectrum("#contactBtnHoverBg",   _syncContactBtn);
    initSpectrum("#contactBtnHoverText", _syncContactBtn);

    // ---- FOOTER ----
    initSpectrum("#footerBgColor",        setFooterBg);
    initSpectrum("#footerTextColor",      setFooterTextColor);
    initSpectrum("#footerIconColor",      setFooterIconColor);
    initSpectrum("#footerIconHoverColor", setFooterIconHoverColor);

});

// ================================
// SYNC HELPERS (multi-picker reads)
// ================================
function _updateHeroGradient() {
    const get = id => {
        const c = $("#" + id).spectrum("get");
        return c ? c.toHexString() : "#000000";
    };
    setHeroGradient(get("heroGradientColor1"), get("heroGradientColor2"), get("heroGradientColor3"));
}

function _syncHeroBtnHover() {
    const bg   = $("#heroBtnHoverBg").spectrum("get");
    const text = $("#heroBtnHoverText").spectrum("get");
    setHeroButtonHover(
        bg   ? bg.toHexString()   : "#000000",
        text ? text.toHexString() : "#ffffff"
    );
}

function _syncContactBtn() {
    const get = id => {
        const c = $("#" + id).spectrum("get");
        return c ? c.toHexString() : "#000000";
    };
    setContactButtonStyle(
        get("contactBtnBg"),
        get("contactBtnText"),
        get("contactBtnHoverBg"),
        get("contactBtnHoverText")
    );
}

// ================================
// NAVBAR
// ================================
function setNavBg(color) {
    const nav = document.querySelector("nav");
    if (nav) nav.style.backgroundColor = color;
}

function setNavTextColor(color) {
    document.querySelectorAll("nav a").forEach(a => a.style.color = color);
}

function setNavHoverColor(color) {
    let style = document.getElementById("nav-hover-style");
    if (!style) {
        style = document.createElement("style");
        style.id = "nav-hover-style";
        document.head.appendChild(style);
    }
    style.innerHTML = `nav a:hover { color: ${color} !important; }`;
}

function setNavText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ================================
// HERO
// ================================
const heroSection     = document.getElementById("heroSection");
const heroTitle       = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroButton      = document.getElementById("heroButton");
const heroImage       = document.getElementById("heroImage");

function setHeroGradient(c1, c2, c3) {
    if (!heroSection) return;
    heroSection.style.background = `linear-gradient(125deg, ${c1}, ${c2}, ${c3 || "#000000"})`;
}

function uploadHeroImage(event) {
    const file = event.target.files[0];
    if (!file || !heroImage) return;
    const reader = new FileReader();
    reader.onload = e => (heroImage.src = e.target.result);
    reader.readAsDataURL(file);
}

function setHeroButtonHover(bg, color) {
    let style = document.getElementById("hero-hover");
    if (!style) {
        style = document.createElement("style");
        style.id = "hero-hover";
        document.head.appendChild(style);
    }
    style.innerHTML = `#heroButton:hover { background: ${bg} !important; color: ${color} !important; }`;
}

// ================================
// ABOUT
// ================================
const aboutSection     = document.getElementById("aboutSection");
const aboutTitle       = document.getElementById("aboutTitle");
const aboutDescription = document.getElementById("aboutDescription");

function setAboutBg(v)               { if (aboutSection)    aboutSection.style.background = v; }
function setAboutTitle(v)            { if (aboutTitle)       aboutTitle.textContent = v; }
function setAboutTitleColor(v)       { if (aboutTitle)       aboutTitle.style.color = v; }
function setAboutDescription(v)      { if (aboutDescription) aboutDescription.textContent = v; }
function setAboutDescriptionColor(v) { if (aboutDescription) aboutDescription.style.color = v; }
function setAboutBoxBg(v)            { document.querySelectorAll(".overlay-item").forEach(e => e.style.background = v); }
function setAboutBoxTextColor(v)     { document.querySelectorAll(".overlay-item p").forEach(e => e.style.color = v); }
function setAboutIconColor(v)        { document.querySelectorAll(".overlay-item i").forEach(e => e.style.color = v); }

function setAboutIcon(box, value) {
    const el = document.getElementById(`aboutIcon${box}`);
    if (!el) return;
    const trimmed = value.trim();
    if (trimmed.includes(" ") || /^(ph|fa)[-\s]/.test(trimmed)) {
        el.className = trimmed;
        el.textContent = "";
    } else {
        el.className = "";
        el.textContent = trimmed;
    }
}

// ================================
// ICON PICKER — ABOUT
// ================================
const phosphorIcons = [
    "ph-fill ph-facebook-logo",   "ph-fill ph-instagram-logo",
    "ph-fill ph-whatsapp-logo",   "ph-fill ph-tiktok-logo",
    "ph-fill ph-youtube-logo",    "ph-fill ph-envelope-simple",
    "ph-fill ph-graduation-cap",  "ph-fill ph-briefcase",
    "ph-fill ph-wrench",          "ph-fill ph-star",
    "ph-fill ph-heart",           "ph-fill ph-code",
    "ph-fill ph-user",            "ph-fill ph-camera",
    "ph-fill ph-paint-brush", "ph-fill ph-book-open","ph ph-book-open","ph-fill ph-rocket"
];

function openIconPicker(box, event) {
    if (event) event.stopPropagation();
    const picker = document.getElementById("iconPickerModal");
    if (!picker) return;
    picker.innerHTML = "";
    phosphorIcons.forEach(icon => {
        const btn = document.createElement("button");
        btn.className = "icon-btn";
        btn.innerHTML = `<i class="${icon}"></i>`;
        btn.onclick = (e) => {
            e.stopPropagation();
            setAboutIcon(box, icon);
            picker.style.display = "none";
        };
        picker.appendChild(btn);
    });
    picker.style.display = "grid";
}

// ================================
// SERVICES
// ================================
const servicesSection = document.getElementById("servicesSection");
const servicesTitle   = document.getElementById("servicesTitle");

function setServicesBg(v)             { if (servicesSection) servicesSection.style.background = v; }
function setServicesTitle(v)          { if (servicesTitle)   servicesTitle.textContent = v; }
function setServicesTitleColor(v)     { if (servicesTitle)   servicesTitle.style.color = v; }
function setServicesCardBg(v)         { document.querySelectorAll(".service-item").forEach(e => e.style.background = v); }
function setServicesCardTitleColor(v) { document.querySelectorAll(".service-item h3").forEach(e => e.style.color = v); }
function setServicesCardTextColor(v)  { document.querySelectorAll(".service-item p").forEach(e => e.style.color = v); }
function setServiceTitle(i, v)        { const el = document.getElementById(`serviceTitle${i}`); if (el) el.textContent = v; }
function setServiceText(i, v)         { const el = document.getElementById(`serviceText${i}`);  if (el) el.textContent = v; }

// ================================
// WORK / PORTFOLIO
// ================================
const workSection = document.getElementById("workSection");
const workTitle   = document.getElementById("workTitle");

function setWorkBg(v)             { if (workSection) workSection.style.background = v; }
function setWorkTitle(v)          { if (workTitle)   workTitle.textContent = v; }
function setWorkTitleColor(v)     { if (workTitle)   workTitle.style.color = v; }
function setWorkCardBg(v)         { document.querySelectorAll(".work-card").forEach(e => e.style.background = v); }
function setWorkCardTitleColor(v) { document.querySelectorAll(".work-card h3").forEach(e => e.style.color = v); }
function setWorkCardTextColor(v)  { document.querySelectorAll(".work-card p").forEach(e => e.style.color = v); }
function setProjectTitle(i, v)    { const el = document.getElementById(`projectTitle${i}`); if (el) el.textContent = v; }
function setProjectText(i, v)     { const el = document.getElementById(`projectText${i}`);  if (el) el.textContent = v; }

function setCVTitle(v) {
    const el = document.getElementById("cvTitle");
    if (el) el.textContent = v;
}

function uploadCVFile(event) {
    const file = event.target.files[0];
    const link = document.getElementById("cvDownloadLink");
    if (!file || !link) return;
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;
    link.textContent = "Download CV";
}

// ================================
// CONTACT
// ================================
const contactSection     = document.getElementById("contactSection");
const contactTitle       = document.getElementById("contactTitle");
const contactDescription = document.getElementById("contactDescription");

function setContactBg(v)               { if (contactSection)    contactSection.style.background = v; }
function setContactTitleColor(v)       { if (contactTitle)       contactTitle.style.color = v; }
function setContactDescriptionColor(v) { if (contactDescription) contactDescription.style.color = v; }
function setContactTitle(v)            { if (contactTitle)        contactTitle.textContent = v; }
function setContactDescription(v)      { if (contactDescription)  contactDescription.textContent = v; }
function setContactIconColor(v)        { document.querySelectorAll(".contactbtn i").forEach(i => i.style.color = v); }

function setContactButtonStyle(bg, textColor, hoverBg, hoverText) {
    document.querySelectorAll(".contactbtn").forEach(btn => {
        btn.style.background = bg;
        btn.style.color = textColor;
    });
    let style = document.getElementById("contact-btn-hover");
    if (!style) {
        style = document.createElement("style");
        style.id = "contact-btn-hover";
        document.head.appendChild(style);
    }
    style.innerHTML = `.contactbtn:hover { background: ${hoverBg} !important; color: ${hoverText} !important; }`;
}

function setContactEmailText(v)    { const el = document.getElementById("contactEmailText");    if (el) el.textContent = v; }
function setContactEmailLink(v)    { const el = document.getElementById("contactEmailLink");    if (el) el.href = v; }
function setContactWhatsappText(v) { const el = document.getElementById("contactWhatsappText"); if (el) el.textContent = v; }
function setContactWhatsappLink(v) { const el = document.getElementById("contactWhatsappLink"); if (el) el.href = v; }
function setContactPhoneText(v)    { const el = document.getElementById("contactPhoneText");    if (el) el.textContent = v; }
function setContactPhoneLink(v)    { const el = document.getElementById("contactPhoneLink");    if (el) el.href = v; }

// ================================
// FOOTER
// ================================
const footerSection     = document.getElementById("footerSection");
const footerCopyright   = document.getElementById("footerCopyright");
const footerDescription = document.getElementById("footerDescription");

function setFooterBg(v) { if (footerSection) footerSection.style.background = v; }

function setFooterTextColor(v) {
    if (!footerSection) return;
    footerSection.style.color = v;
    footerSection.querySelectorAll("p").forEach(p => p.style.color = v);
}

function setFooterIconColor(v)      { document.querySelectorAll(".footer-socials i").forEach(i => i.style.color = v); }

function setFooterIconHoverColor(v) {
    let style = document.getElementById("footer-hover");
    if (!style) {
        style = document.createElement("style");
        style.id = "footer-hover";
        document.head.appendChild(style);
    }
    style.innerHTML = `.footer-socials a:hover i { color: ${v} !important; }`;
}

function setFooterCopyright(v)   { if (footerCopyright)   footerCopyright.textContent = "©" + v; }
function setFooterDescription(v) { if (footerDescription) footerDescription.textContent = v; }
function setFooterSocial(i, url) { const el = document.getElementById(`footerSocial${i}`); if (el) el.href = url; }
function setFooterIcon(i, icon)  { const el = document.getElementById(`footerIcon${i}`);  if (el) el.className = icon; }

// ================================
// ICON PICKER — FOOTER
// ================================
const footerIcons = [
    "fa-brands fa-facebook-f",     "fa-brands fa-instagram",
    "fa-brands fa-whatsapp",       "fa-brands fa-x-twitter",
    "fa-brands fa-tiktok",         "fa-brands fa-youtube",
    "fa-solid fa-envelope",        "ph-fill ph-facebook-logo",
    "ph-fill ph-instagram-logo",   "ph-fill ph-whatsapp-logo",
    "ph-fill ph-tiktok-logo",      "ph-fill ph-youtube-logo",
    "ph-fill ph-envelope-simple",
    "ph-fill ph-linkedin-logo"
];

function openFooterIconPicker(i, event) {
    if (event) event.stopPropagation();
    const picker = document.getElementById("iconPickerModal");
    if (!picker) return;
    picker.innerHTML = "";
    footerIcons.forEach(icon => {
        const btn = document.createElement("button");
        btn.className = "icon-btn";
        btn.innerHTML = `<i class="${icon}"></i>`;
        btn.onclick = (e) => {
            e.stopPropagation();
            setFooterIcon(i, icon);
            picker.style.display = "none";
        };
        picker.appendChild(btn);
    });
    picker.style.display = "grid";
}

// ================================
// CLOSE ICON PICKER ON OUTSIDE CLICK
// ================================
document.addEventListener("click", (e) => {
    const picker = document.getElementById("iconPickerModal");
    if (picker && picker.style.display === "grid" && !picker.contains(e.target)) {
        picker.style.display = "none";
    }
});