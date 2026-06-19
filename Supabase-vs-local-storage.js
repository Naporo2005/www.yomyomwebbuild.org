/* ============================================================
   SUPABASE + EMAILJS INTEGRATION
   Kurugu's Cuts — Website Editor
   ============================================================ */

/* ============================================================
   CONFIG — ALL CREDENTIALS
   ============================================================ */
const SUPABASE_URL     = "https://zwwkrenkookgfbggfapl.supabase.co";
const SUPABASE_ANON    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3d2tyZW5rb29rZ2ZiZ2dmYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTYyMzEsImV4cCI6MjA5NDI5MjIzMX0.B4g-yzWXAmB1tre8dN6ho57-7SBEx1F9yReNutO1J-4";
const EMAILJS_SERVICE  = "service_y7uu2x6";
const EMAILJS_TEMPLATE = "template_ovsdd4e";
const EMAILJS_KEY      = "ifS-MZXz8HjB-GX-s";
const ADMIN_EMAIL      = "0555358325a@gmail.com";
const WA_NUMBER        = "233555358325";
const STORAGE_BUCKET   = "images";
const SESSION_KEY      = "kurugu_session_id";

/* ============================================================
   INIT SUPABASE CLIENT
   ============================================================ */
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ============================================================
   SESSION ID
   ============================================================ */
function getSessionId() {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

/* ============================================================
   UPLOAD A SINGLE IMAGE TO SUPABASE STORAGE
   ============================================================ */
async function uploadImage(file, imageKey, sessionId) {
    if (!file) return null;
    const ext      = file.name.split(".").pop();
    const filePath = `${sessionId}/${imageKey}.${ext}`;
    const { data, error } = await _supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, { upsert: true });
    if (error) { console.error(`Image upload failed [${imageKey}]:`, error.message); return null; }
    const { data: pub } = _supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
    return pub.publicUrl;
}

/* ============================================================
   UPLOAD ALL IMAGES
   ============================================================ */
async function uploadAllImages(sessionId) {
    const imageUrls = {};
    const named = {
        heroBg:   document.getElementById("heroBgImage"),
        aboutImg: document.getElementById("aboutImgPicker"),
        work1:    document.getElementById("workImg1"),
        work2:    document.getElementById("workImg2"),
        work3:    document.getElementById("workImg3"),
        work4:    document.getElementById("workImg4"),
        work5:    document.getElementById("workImg5"),
    };
    for (const [key, input] of Object.entries(named)) {
        if (input && input.files && input.files[0]) {
            const url = await uploadImage(input.files[0], key, sessionId);
            if (url) imageUrls[key] = url;
        }
    }
    document.querySelectorAll("[data-image-key]").forEach(async (input) => {
        if (input.files && input.files[0]) {
            const key = input.dataset.imageKey;
            if (!imageUrls[key]) {
                const url = await uploadImage(input.files[0], key, sessionId);
                if (url) imageUrls[key] = url;
            }
        }
    });
    return imageUrls;
}

/* ============================================================
   SAVE IMAGES TO customization_images TABLE
   ============================================================ */
async function saveImagesToTable(sessionId, imageUrls) {
    for (const [imageKey, imageUrl] of Object.entries(imageUrls)) {
        const { error } = await _supabase
            .from("customization_images")
            .upsert(
                { session_id: sessionId, image_key: imageKey, image_url: imageUrl },
                { onConflict: "session_id,image_key" }
            );
        if (error) console.error(`Failed to save image row [${imageKey}]:`, error.message);
    }
}

/* ============================================================
   SAVE CUSTOMIZATION DATA TO customizations TABLE
   ============================================================ */
async function saveDataToTable(sessionId, data) {
    const { data: row, error } = await _supabase
        .from("customizations")
        .upsert(
            { session_id: sessionId, data },
            { onConflict: "session_id" }
        )
        .select("id, session_id, created_at")
        .single();
    if (error) throw new Error("Supabase save failed: " + error.message);
    return row;
}

/* ============================================================
   COLLECT ALL EDITOR STATE FROM THE DOM
   Every value is read from CSS variables or DOM content.
   ============================================================ */
function collectAllData() {
    const get  = (id)      => document.getElementById(id)?.innerText?.trim()  || "";
    const getH = (id)      => document.getElementById(id)?.innerHTML?.trim()  || "";
    const css  = (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

    // Services 1–11
    const services = {};
    for (let i = 1; i <= 11; i++) {
        services[i] = {
            title:   get(`serviceTitle${i}`),
            desc:    get(`serviceDesc${i}`),
            price:   get(`servicePrice${i}`),
            visible: !document.getElementById(`service${i}`)?.classList.contains("hidden-service"),
        };
    }

    // Testimonials 1–3
    const testimonials = {};
    for (let i = 1; i <= 3; i++) {
        testimonials[i] = {
            name: get(`tName${i}`),
            text: get(`tText${i}`),
        };
    }

    // Per-span slogan colors (stored as inline style since they're per-span)
    const heroPart1El = document.getElementById("heroPart1");
    const heroPart2El = document.getElementById("heroPart2");
    const heroPart3El = document.getElementById("heroPart3");
    const heroSup1El  = document.getElementById("heroSup1");
    const heroSup2El  = document.getElementById("heroSup2");

    return {
        // ── BODY
        bodyBg: css("--body-bg") || document.body.style.backgroundColor || "",

        // ── NAVBAR
        navBg:       css("--nav-bg"),
        navText:     css("--nav-text"),
        navHover:    css("--nav-hover"),
        navAbout:    get("navAbout"),
        navServices: get("navServices"),
        navWork:     get("navWork"),
        navReviews:  get("navReviews"),
        navContact:  get("navContact"),

        // ── HERO
        heroBgColor:         css("--hero-bg-color"),
        heroGradient1:       css("--hero-gradient-1"),
        heroGradient2:       css("--hero-gradient-2"),
        heroGradientOpacity: css("--hero-gradient-opacity"),
        brandName:           get("brandname"),
        brandColor:          css("--hero-title-color"),
        heroBadgeColor:      css("--hero-badge-color"),
        heroPart1:           get("heroPart1"),
        heroPart2:           get("heroPart2"),
        heroPart3:           get("heroPart3"),
        heroPart1Color:      heroPart1El?.style.color || "",
        heroPart2Color:      heroPart2El?.style.color || "",
        heroPart3Color:      heroPart3El?.style.color || "",
        heroSup1:            get("heroSup1"),
        heroSup2:            get("heroSup2"),
        heroSup1Color:       heroSup1El?.style.color  || "",
        heroSup2Color:       heroSup2El?.style.color  || "",
        heroBtnText:         get("heroBtn"),
        heroBtnBg:           css("--hero-btn-bg"),
        heroBtnTextColor:    css("--hero-btn-text"),
        heroBtnHoverBg:      css("--hero-btn-hover-bg"),
        heroBtnHoverText:    css("--hero-btn-hover-text"),
        fontBrand:           css("--font-brand"),
        fontSlogan:          css("--font-slogan"),
        fontButton:          css("--font-button"),

        // ── ABOUT
        aboutBg:         css("--about-bg"),
        aboutTitle:      get("aboutTitle"),
        aboutTitleColor: css("--about-title-color"),
        aboutTextColor:  css("--about-text-color"),
        aboutP1:         get("aboutP1"),
        aboutP2:         get("aboutP2"),
        aboutP3:         get("aboutP3"),

        // ── SERVICES
        servicesBg:           css("--services-bg"),
        servicesHeading:      get("servicesHeading"),
        servicesHeadingColor: css("--services-heading-color"),
        serviceCardBg:        css("--service-card-bg"),
        serviceTitleColor:    css("--service-title-color"),
        serviceDescColor:     css("--service-desc-color"),
        servicePriceColor:    css("--service-price-color"),
        services,

        // ── GALLERY
        workBg:         css("--work-bg"),
        workTitle:      get("workTitle"),
        workTitleColor: css("--work-title-color"),
        workText:       get("workText"),
        workTextColor:  css("--work-text-color"),

        // ── TESTIMONIALS
        testimonialTitle:      get("testimonialTitle"),
        testimonialSectionBg:  css("--testimonial-section-bg"),
        testimonialTitleColor: css("--testimonial-title-color"),
        testimonialCardBg:     css("--testimonial-card-bg"),
        testimonialCardText:   css("--testimonial-card-text"),
        testimonialNameColor:  css("--testimonial-card-name"),
        testimonials,

        // ── CONTACT
        contactBg:         css("--contact-bg"),
        contactTitle:      get("contactTitle"),
        contactTitleColor: css("--contact-title-color"),
        contactText:       getH("contactText"),
        contactTextColor:  css("--contact-text-color"),
        contactInfoColor:  css("--contact-info-color"),
        contactIconColor:  css("--contact-icon-color"),
        contactBtnBg:      css("--contact-btn-bg"),
        contactBtnText:    css("--contact-btn-text"),
        locationText:      get("locationText"),
        phoneText:         get("phoneText"),
        whatsappPhone:     get("whatsappPhoneText"),
        hoursText1:        get("hourstext1"),
        hoursText2:        get("hourstext2"),
        whatsappBtnText:   get("btnText"),
        whatsappLink:      document.getElementById("whatsappLink")?.href || "",

        // ── FOOTER
        footerBg:         css("--footer-bg"),
        footerTextColor:  css("--footer-text-color"),
        footerCopyright:  get("footerCopyright"),
        footerSlogan:     get("footerSlogan1"),
    };
}

/* ============================================================
   BUILD EMAIL BODY
   ============================================================ */
function buildEmailBody(sessionId, data, imageUrls) {
    const serviceLines = Object.entries(data.services)
        .map(([i, s]) =>
            `  Service ${i}: "${s.title || "—"}" | ${s.price || "—"} | ${s.visible ? "ON ✅" : "OFF ❌"}\n    Desc: ${s.desc || "—"}`
        ).join("\n");

    const testimonialLines = Object.entries(data.testimonials)
        .map(([i, t]) => `  #${i}: ${t.name || "—"} — "${t.text || "—"}"`)
        .join("\n");

    const imageLines = Object.keys(imageUrls).length
        ? Object.entries(imageUrls).map(([k, v]) => `  ${k}: ${v}`).join("\n")
        : "  No new images uploaded";

    return `
╔══════════════════════════════════════════╗
   NEW CUSTOMIZATION SUBMITTED
   Kurugu's Cuts Website Editor
╚══════════════════════════════════════════╝

SESSION ID : ${sessionId}
SUBMITTED  : ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background : ${data.navBg}
Text Color : ${data.navText}
Hover Color: ${data.navHover}
Links      : About="${data.navAbout}" | Services="${data.navServices}" | Work="${data.navWork}" | Reviews="${data.navReviews}" | Contact="${data.navContact}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Brand Name    : ${data.brandName}
Brand Color   : ${data.brandColor}
Brand Font    : ${data.fontBrand}
Slogan Line 1 : ${data.heroPart1}  [color: ${data.heroPart1Color}]
Slogan Line 2 : ${data.heroPart2}  [color: ${data.heroPart2Color}]
Slogan Line 3 : ${data.heroPart3}  [color: ${data.heroPart3Color}]
Symbol 1      : ${data.heroSup1}  [color: ${data.heroSup1Color}]
Symbol 2      : ${data.heroSup2}  [color: ${data.heroSup2Color}]
Badge Color   : ${data.heroBadgeColor}
Button Text   : ${data.heroBtnText}
Button Bg     : ${data.heroBtnBg}
Button Text C : ${data.heroBtnTextColor}
Hover Bg      : ${data.heroBtnHoverBg}
Hover Text C  : ${data.heroBtnHoverText}
Gradient 1    : ${data.heroGradient1}
Gradient 2    : ${data.heroGradient2}
Opacity       : ${data.heroGradientOpacity}
Slogan Font   : ${data.fontSlogan}
Button Font   : ${data.fontButton}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ABOUT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background  : ${data.aboutBg}
Title       : ${data.aboutTitle}
Title Color : ${data.aboutTitleColor}
Text Color  : ${data.aboutTextColor}
Paragraph 1 : ${data.aboutP1}
Paragraph 2 : ${data.aboutP2}
Paragraph 3 : ${data.aboutP3}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SERVICES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background : ${data.servicesBg}
Heading    : ${data.servicesHeading}
Card Bg    : ${data.serviceCardBg}

${serviceLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GALLERY SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background : ${data.workBg}
Title      : ${data.workTitle}
Text       : ${data.workText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TESTIMONIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section Bg  : ${data.testimonialSectionBg}
Title       : ${data.testimonialTitle}
Card Bg     : ${data.testimonialCardBg}
${testimonialLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTACT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background      : ${data.contactBg}
Title           : ${data.contactTitle}
Message         : ${data.contactText}
Location        : ${data.locationText}
Phone           : ${data.phoneText}
WhatsApp Display: ${data.whatsappPhone}
WhatsApp Link   : ${data.whatsappLink}
Hours Line 1    : ${data.hoursText1}
Hours Line 2    : ${data.hoursText2}
Button Text     : ${data.whatsappBtnText}
Button Bg       : ${data.contactBtnBg}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background : ${data.footerBg}
Text Color : ${data.footerTextColor}
Copyright  : ${data.footerCopyright}
Slogan     : ${data.footerSlogan}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 UPLOADED IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${imageLines}

══════════════════════════════════════════
`.trim();
}

/* ============================================================
   SEND EMAIL VIA EMAILJS
   ============================================================ */
async function sendAdminEmail(sessionId, data, imageUrls) {
    const body = buildEmailBody(sessionId, data, imageUrls);
    await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
            to_email:   ADMIN_EMAIL,
            subject:    `New Customization — Session: ${sessionId}`,
            message:    body,
            session_id: sessionId,
        },
        EMAILJS_KEY
    );
}

/* ============================================================
   UNLOCK & SET WHATSAPP BUTTON
   ============================================================ */
function activateWhatsApp(sessionId) {
    const message = `Hello! I'm done with my website customization. My session ID is: ${sessionId}`;
    const url     = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    const btn     = document.getElementById("waContactBtn");
    if (!btn) return;
    btn.disabled           = false;
    btn.style.opacity      = "1";
    btn.style.cursor       = "pointer";
    btn.title              = "Click to send your ID via WhatsApp";
    btn.onclick            = () => window.open(url, "_blank");
}

/* ============================================================
   SAVE BUTTON — localStorage only
   ============================================================ */
function saveDraft() {
    const data = collectAllData();
    localStorage.setItem("kurugu_draft", JSON.stringify(data));
    showSaveStatus("Saved locally ✓", "#22c55e");
}

/* ============================================================
   LOAD PREVIOUS BUTTON — reads localStorage only
   ============================================================ */
function loadDraft() {
    const raw = localStorage.getItem("kurugu_draft");
    if (!raw) { showSaveStatus("No saved draft found", "#f59e0b"); return; }
    const data = JSON.parse(raw);
    applyAllData(data);   // defined in edittingscript.js
    showSaveStatus("Previous customization loaded ✓", "#22c55e");
}

/* ============================================================
   RESET BUTTON
   ============================================================ */
function clearAllData() {
    localStorage.removeItem("kurugu_draft");
    showSaveStatus("Resetting…", "#ef4444");
    setTimeout(() => location.reload(), 600);
}

/* ============================================================
   SUBMIT BUTTON — full flow
   ============================================================ */
async function submitCustomization() {
    const submitBtn = document.getElementById("submitFinalBtn");
    if (submitBtn) submitBtn.disabled = true;

    try {
        showSaveStatus("Uploading images…", "#d4af37");
        const sessionId = getSessionId();
        const data      = collectAllData();

        // 1. Upload images
        const imageUrls = await uploadAllImages(sessionId);
        // 2. Save image rows
        await saveImagesToTable(sessionId, imageUrls);
        // 3. Save customization data
        showSaveStatus("Saving customization…", "#d4af37");
        const row = await saveDataToTable(sessionId, data);
        // 4. Send admin email
        showSaveStatus("Sending email…", "#d4af37");
        await sendAdminEmail(sessionId, data, imageUrls);
        // 5. Cache locally
        localStorage.setItem("kurugu_draft", JSON.stringify(data));
        // 6. Unlock WhatsApp button
        activateWhatsApp(sessionId);

        showSaveStatus(`✅ Submitted! Session ID: ${sessionId}`, "#22c55e");

    } catch (err) {
        console.error("Submit failed:", err);
        showSaveStatus("❌ Submission failed. Please try again",  "#ef4444");
        if (submitBtn) submitBtn.disabled = false;
    }
}

/* ============================================================
   STATUS HELPER
   ============================================================ */
function showSaveStatus(message, color = "#ffffff") {
    const el = document.getElementById("saveStatus");
    if (!el) return;
    el.textContent = message;
    el.style.color = color;
}

/* ============================================================
   BIND ALL BUTTONS ON DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveBtn")?.addEventListener("click", saveDraft);
    document.getElementById("loadPrevBtn")?.addEventListener("click", loadDraft);
    document.getElementById("resetBtn")?.addEventListener("click", clearAllData);
    document.getElementById("submitFinalBtn")?.addEventListener("click", submitCustomization);

    // WhatsApp starts locked until submit succeeds
    const waBtn = document.getElementById("waContactBtn");
    if (waBtn) {
        waBtn.disabled      = true;
        waBtn.style.opacity = "0.4";
        waBtn.style.cursor  = "not-allowed";
        waBtn.title         = "Complete your submission first to unlock WhatsApp";
    }
});
