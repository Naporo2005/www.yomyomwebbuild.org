/* ============================================================
   gym-supabase.js  —  v1
   You Go Feel Am Fitness · Supabase + EmailJS Integration
   Requires: @supabase/supabase-js CDN · EmailJS CDN
   Load AFTER edit__pro__02.js
   ============================================================ */

const SUPABASE_URL     = "https://zwwkrenkookgfbggfapl.supabase.co";
const SUPABASE_ANON    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3d2tyZW5rb29rZ2ZiZ2dmYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTYyMzEsImV4cCI6MjA5NDI5MjIzMX0.B4g-yzWXAmB1tre8dN6ho57-7SBEx1F9yReNutO1J-4";
const EMAILJS_SERVICE  = "service_y7uu2x6";
const EMAILJS_TEMPLATE = "template_ovsdd4e";
const EMAILJS_KEY      = "ifS-MZXz8HjB-GX-s";
const ADMIN_EMAIL      = "0555358325a@gmail.com";
const WA_NUMBER        = "233555358325";
const STORAGE_BUCKET   = "images";
const SESSION_KEY      = "gym_session_id";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ============================================================
   SESSION ID
   ============================================================ */
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "gym_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/* ============================================================
   DOM HELPERS
   ============================================================ */
function _txt(id)  { return (document.getElementById(id)?.textContent || "").trim(); }
function _href(id) { return document.getElementById(id)?.getAttribute("href") || ""; }
function _src(id)  { return document.getElementById(id)?.getAttribute("src")  || ""; }
function _css(v)   { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

/* ============================================================
   COLLECT ALL EDITOR STATE
   ============================================================ */
function collectAllData() {

  /* ── NAVBAR ── */
  const navbar = {
    bg:           _css("--nav-bg"),
    textColor:    _css("--nav-text"),
    hoverColor:   _css("--nav-hover-text"),
    menuIconColor:_css("--menu-icon-color"),
    logoSrc:      _src("site-logo"),
    links: {
      about:        _txt("nav-link-about"),
      programs:     _txt("nav-link-programs"),
      pricing:      _txt("nav-link-pricing"),
      trainers:     _txt("nav-link-trainers"),
      testimonials: _txt("nav-link-testimonials"),
      gallery:      _txt("nav-link-gallery"),
      contact:      _txt("nav-link-contact"),
    },
  };

  /* ── HERO ── */
  const hero = {
    bgImgSrc:      _src("hero-bg-img"),
    overlayColor:  _css("--hero-overlay-color"),
    overlayColor2: _css("--hero-overlay-color2"),
    titleText:     _txt("hero-title"),
    titleColor:    _css("--hero-title-color"),
    descText:      _txt("hero-desc"),
    descColor:     _css("--hero-desc-color"),
    btnText:       _txt("hero-btn"),
    btnHref:       _href("hero-btn"),
    btnBg:         _css("--hero-btn-bg"),
    btnTextColor:  _css("--hero-btn-text"),
    btnHoverBg:    _css("--hero-btn-hover-bg"),
    btnHoverText:  _css("--hero-btn-hover-text"),
  };

  /* ── ABOUT ── */
  const about = {
    bg:         _css("--about-bg"),
    titleColor: _css("--about-title-color"),
    textColor:  _css("--about-text-color"),
    titleText:  _txt("about-title"),
    brandText:  _txt("about-brand"),
    part1:      _txt("about-part1"),
    part2:      _txt("about-part2"),
    imgSrc:     _src("about-img"),
  };

  /* ── PROGRAMS ── */
  const programs = {
    bg:            _css("--programs-bg"),
    cardBg:        _css("--programs-card-bg"),
    titleColor:    _css("--programs-title-color"),
    subtitleColor: _css("--programs-subtitle-color"),
    h3Color:       _css("--programs-h3-color"),
    textColor:     _css("--programs-text-color"),
    listColor:     _css("--programs-list-color"),
    titleText:     _txt("programs-title"),
    subtitleText:  _txt("programs-subtitle"),
    cards: [1,2,3,4].map(n => ({
      title:   _txt("prog-title-" + n),
      desc:    _txt("prog-desc-"  + n),
      feat1:   _txt("prog-list-"  + n + "-1"),
      feat2:   _txt("prog-list-"  + n + "-2"),
      feat3:   _txt("prog-list-"  + n + "-3"),
    })),
  };

  /* ── PRICING ── */
  const pricing = {
    bg:            _css("--pricing-bg"),
    titleColor:    _css("--pricing-title-color"),
    subtitleColor: _css("--pricing-subtitle-color"),
    titleText:     _txt("pricing-title"),
    subtitleText:  _txt("pricing-subtitle"),
    cards: [1,2,3].map(n => ({
      name:         _txt("price-name-"   + n),
      amount:       _txt("price-amount-" + n),
      feat1:        _txt("price-feat-"   + n + "-1"),
      feat2:        _txt("price-feat-"   + n + "-2"),
      feat3:        _txt("price-feat-"   + n + "-3"),
      btnText:      _txt("price-btn-"    + n),
      btnHref:      _href("price-btn-"   + n),
      cardBg:       _css("--price-card"  + n + "-bg"),
      h3Color:      _css("--price-card"  + n + "-h3-color"),
      amountColor:  _css("--price-card"  + n + "-amount-color"),
      listColor:    _css("--price-card"  + n + "-list-color"),
      btnBg:        _css("--price-card"  + n + "-btn-bg"),
      btnText2:     _css("--price-card"  + n + "-btn-text"),
    })),
  };

  /* ── TRAINERS ── */
  const trainers = {
    bg:            _css("--trainers-bg"),
    cardBg:        _css("--trainers-card-bg"),
    titleColor:    _css("--trainers-title-color"),
    subtitleColor: _css("--trainers-subtitle-color"),
    h3Color:       _css("--trainers-h3-color"),
    roleColor:     _css("--trainers-role-color"),
    btnBg:         _css("--trainers-btn-bg"),
    btnText:       _css("--trainers-btn-text"),
    titleText:     _txt("trainers-title"),
    subtitleText:  _txt("trainers-subtitle"),
    cards: [1,2,3,4].map(n => ({
      imgSrc:  _src("trainer-img-"   + n),
      name:    _txt("trainer-name-"  + n),
      role:    _txt("trainer-role-"  + n),
      stars:   _txt("trainer-stars-" + n),
      btnText: _txt("trainer-btn-"   + n),
      btnHref: _href("trainer-btn-"  + n),
    })),
  };

  /* ── TESTIMONIALS ── */
  const testimonials = {
    bg:            _css("--testimonials-bg"),
    cardBg:        _css("--testimonials-card-bg"),
    titleColor:    _css("--testimonials-title-color"),
    subtitleColor: _css("--testimonials-subtitle-color"),
    textColor:     _css("--testimonials-text-color"),
    nameColor:     _css("--testimonials-name-color"),
    titleText:     _txt("testimonials-title"),
    subtitleText:  _txt("testimonials-subtitle"),
    cards: [1,2,3].map(n => ({
      text: _txt("testimonial-text-" + n),
      name: _txt("testimonial-name-" + n),
    })),
  };

  /* ── GALLERY ── */
  const gallery = {
    bg:            _css("--gallery-bg"),
    titleColor:    _css("--gallery-title-color"),
    subtitleColor: _css("--gallery-subtitle-color"),
    titleText:     _txt("gallery-title"),
    subtitleText:  _txt("gallery-subtitle"),
    images: [1,2,3,4,5,6].map(n => ({ src: _src("gallery-img-" + n) })),
  };

  /* ── CONTACT ── */
  const contact = {
    bg:            _css("--contact-bg"),
    cardBg:        _css("--contact-card-bg"),
    titleColor:    _css("--contact-title-color"),
    subtitleColor: _css("--contact-subtitle-color"),
    textColor:     _css("--contact-p-color"),
    iconColor:     _css("--contact-icon-color"),
    titleText:     _txt("contact-title"),
    subtitleText:  _txt("contact-subtitle"),
    emailLabel:    _txt("contact-email-label"),
    emailText:     _txt("contact-email-text"),
    emailHref:     _href("contact-email-link"),
    phoneLabel:    _txt("contact-phone-label"),
    phoneText:     _txt("contact-phone-text"),
    phoneHref:     _href("contact-phone-link"),
    addressLabel:  _txt("contact-address-label"),
    addressText:   _txt("contact-address"),
    hoursLabel:    _txt("contact-hours-label"),
    hoursText:     _txt("contact-hours"),
  };

  /* ── FLOATING BUTTONS ── */
  const floating = {
    waBg:       _css("--float-whatsapp-bg"),
    waColor:    _css("--float-whatsapp-color"),
    waHref:     _href("float-whatsapp"),
    callBg:     _css("--float-call-bg"),
    callColor:  _css("--float-call-color"),
    callHref:   _href("float-call"),
  };

  /* ── FOOTER SOCIAL ── */
  const footer = {
    social: [1,2,3].map(n => ({
      icon: document.getElementById("footer-social-" + n)?.getAttribute("data-icon") || "",
      href: _href("footer-social-" + n),
    })),
    copyright: _txt("footer-copyright"),
  };

  return { navbar, hero, about, programs, pricing, trainers,
           testimonials, gallery, contact, floating, footer };
}

/* ============================================================
   SAVE DRAFT  —  localStorage only
   ============================================================ */
function saveDraft() {
  try {
    localStorage.setItem("gym_draft", JSON.stringify(collectAllData()));
    showStatus("Changes saved ✓", "#22c55e");
  } catch (e) {
    showStatus("Save failed.", "#ef4444");
    console.error("saveDraft:", e);
  }
}

/* ============================================================
   RESET
   ============================================================ */
function clearAllData() {
  localStorage.removeItem("gym_draft");
  showStatus("Resetting…", "#ef4444");
  setTimeout(() => location.reload(), 600);
}

/* ============================================================
   UPLOAD A SINGLE FILE TO SUPABASE STORAGE
   ============================================================ */
async function uploadFile(file, key, sessionId) {
  if (!file) return null;
  const ext  = file.name.split(".").pop();
  const path = sessionId + "/" + key + "." + ext;
  const { data, error } = await _supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });
  if (error) { console.error("Upload failed [" + key + "]:", error.message); return null; }
  return _supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
}

/* ============================================================
   UPLOAD ALL IMAGES
   ============================================================ */
async function uploadAllMedia(sessionId) {
  const urls = {};

  function fi(id) { return document.getElementById(id); }

  /* Logo */
  const logo = fi("nav-logo-upload");
  if (logo?.files?.[0]) {
    const u = await uploadFile(logo.files[0], "site-logo", sessionId);
    if (u) urls["site-logo"] = u;
  }

  /* Hero background */
  const heroBg = fi("hero-bg-upload");
  if (heroBg?.files?.[0]) {
    const u = await uploadFile(heroBg.files[0], "hero-bg", sessionId);
    if (u) urls["hero-bg"] = u;
  }

  /* About image */
  const about = fi("about-img-upload");
  if (about?.files?.[0]) {
    const u = await uploadFile(about.files[0], "about-img", sessionId);
    if (u) urls["about-img"] = u;
  }

  /* Trainer images */
  for (let n = 1; n <= 4; n++) {
    const input = fi("trainer-img-" + n + "-upload");
    if (input?.files?.[0]) {
      const u = await uploadFile(input.files[0], "trainer-img-" + n, sessionId);
      if (u) urls["trainer-img-" + n] = u;
    }
  }

  /* Gallery images */
  for (let n = 1; n <= 6; n++) {
    const input = fi("gallery-img-" + n + "-upload");
    if (input?.files?.[0]) {
      const u = await uploadFile(input.files[0], "gallery-img-" + n, sessionId);
      if (u) urls["gallery-img-" + n] = u;
    }
  }

  return urls;
}

/* ============================================================
   SAVE MEDIA URLS  →  customization_images TABLE
   ============================================================ */
async function saveMediaUrls(sessionId, urls) {
  for (const [key, url] of Object.entries(urls)) {
    const { error } = await _supabase
      .from("customization_images")
      .upsert(
        { session_id: sessionId, image_key: key, image_url: url },
        { onConflict: "session_id,image_key" }
      );
    if (error) console.error("saveMediaUrls [" + key + "]:", error.message);
  }
}

/* ============================================================
   SAVE JSON DATA  →  customizations TABLE
   ============================================================ */
async function saveDataToTable(sessionId, data) {
  const { error } = await _supabase
    .from("customizations")
    .upsert(
      { session_id: sessionId, data: data },
      { onConflict: "session_id" }
    );
  if (error) throw new Error("Supabase save failed: " + error.message);
}

/* ============================================================
   BUILD EMAIL BODY
   ============================================================ */
function buildEmailBody(sessionId, data, mediaUrls) {
  function sec(title, lines) { return "\n━━━ " + title + " ━━━\n" + lines.join("\n"); }

  const n  = data.navbar;
  const h  = data.hero;
  const ab = data.about;
  const pr = data.programs;
  const pc = data.pricing;
  const tr = data.trainers;
  const tc = data.testimonials;
  const gl = data.gallery;
  const ct = data.contact;
  const ft = data.footer;

  return [
    "╔═══════════════════════════════════════╗",
    "   NEW CUSTOMIZATION — GYMSITE",
    "╚═══════════════════════════════════════╝",
    "", "Session ID : " + sessionId, "Submitted  : " + new Date().toLocaleString(), "",

    sec("NAVBAR", [
      "Background : " + n.bg,
      "Text Color : " + n.textColor,
      "Links      : " + Object.values(n.links).join(" | "),
    ]),

    sec("HERO", [
      "Title      : " + h.titleText,
      "Desc       : " + h.descText,
      "Button     : " + h.btnText + " → " + h.btnHref,
      "Overlay 1  : " + h.overlayColor,
      "Overlay 2  : " + h.overlayColor2,
    ]),

    sec("ABOUT", [
      "Title      : " + ab.titleText,
      "Brand      : " + ab.brandText,
      "Part 1     : " + ab.part1.substring(0, 80) + "…",
      "Part 2     : " + ab.part2.substring(0, 80) + "…",
    ]),

    sec("PROGRAMS", [
      "Title      : " + pr.titleText,
      ...pr.cards.map((c, i) => "Card " + (i+1) + "     : " + c.title + " | " + c.feat1 + ", " + c.feat2 + ", " + c.feat3),
    ]),

    sec("PRICING", [
      "Title      : " + pc.titleText,
      ...pc.cards.map((c, i) => "Card " + (i+1) + "     : " + c.name + " | " + c.amount + " | Btn: " + c.btnText),
    ]),

    sec("TRAINERS", [
      "Title      : " + tr.titleText,
      ...tr.cards.map((c, i) => "Trainer " + (i+1) + "  : " + c.name + " — " + c.role + " " + c.stars),
    ]),

    sec("TESTIMONIALS", [
      "Title      : " + tc.titleText,
      ...tc.cards.map((c, i) => "Review " + (i+1) + "   : " + c.name + " — " + c.text.substring(0, 60) + "…"),
    ]),

    sec("GALLERY", [
      "Title      : " + gl.titleText,
      ...gl.images.map((img, i) => "Image " + (i+1) + "    : " + (img.src ? img.src.substring(0,60) + "…" : "(none)")),
    ]),

    sec("CONTACT", [
      "Title      : " + ct.titleText,
      "Email      : " + ct.emailText,
      "Phone      : " + ct.phoneText,
      "Address    : " + ct.addressText,
      "Hours      : " + ct.hoursText,
    ]),

    sec("FOOTER SOCIALS", ft.social.map((s, i) =>
      "Icon " + (i+1) + "     : " + s.icon + " → " + s.href
    )),

    sec("UPLOADED FILES", Object.keys(mediaUrls).length
      ? Object.entries(mediaUrls).map(([k, v]) => "  " + k + ": " + v)
      : ["  (no new files uploaded)"]
    ),

  ].join("\n");
}

/* ============================================================
   SEND EMAIL VIA EMAILJS
   ============================================================ */
async function sendEmail(sessionId, data, mediaUrls) {
  await emailjs.send(
    EMAILJS_SERVICE,
    EMAILJS_TEMPLATE,
    {
      to_email:   ADMIN_EMAIL,
      subject:    "You Go Feel Am Fitness — New Customization | " + sessionId,
      message:    buildEmailBody(sessionId, data, mediaUrls),
      session_id: sessionId,
    },
    EMAILJS_KEY
  );
}

/* ============================================================
   UNLOCK WHATSAPP BUTTON
   ============================================================ */
function activateWhatsApp(sessionId) {
  const msg = "Hello! I've finished customising GymSite Template.\nMy session ID is: " + sessionId;
  const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  const btn = document.getElementById("waContactBtn");
  if (!btn) return;
  btn.disabled      = false;
  btn.style.opacity = "1";
  btn.style.cursor  = "pointer";
  btn.title         = "Send your session ID via WhatsApp";
  btn.onclick       = () => window.open(url, "_blank");
}

/* ============================================================
   SUBMIT  —  full pipeline
   ============================================================ */
async function submitCustomization() {
  const submitBtn = document.getElementById("submitFinalBtn");
  if (submitBtn) submitBtn.disabled = true;

  try {
    showStatus("Uploading images…", "#d4af37");
    const sessionId = getSessionId();
    const data      = collectAllData();
    const mediaUrls = await uploadAllMedia(sessionId);

    showStatus("Saving image URLs…", "#d4af37");
    await saveMediaUrls(sessionId, mediaUrls);

    showStatus("Saving customization…", "#d4af37");
    await saveDataToTable(sessionId, data);

    showStatus("Sending email…", "#d4af37");
    await sendEmail(sessionId, data, mediaUrls);

    localStorage.setItem("gym_draft", JSON.stringify(data));
    activateWhatsApp(sessionId);
    showStatus("✅ Submitted! Session: " + sessionId, "#22c55e");

  } catch (err) {
    console.error("submitCustomization:", err);
    showStatus("❌ Submission failed. Please try again.", "#ef4444");
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ============================================================
   STATUS HELPER
   ============================================================ */
function showStatus(message, color) {
  const el = document.getElementById("saveStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = color || "#ffffff";
}

/* ============================================================
   BIND BUTTONS
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("saveBtn")?.addEventListener("click", saveDraft);
  document.getElementById("resetBtn")?.addEventListener("click", clearAllData);
  document.getElementById("submitFinalBtn")?.addEventListener("click", submitCustomization);

  const waBtn = document.getElementById("waContactBtn");
  if (waBtn) {
    waBtn.disabled      = true;
    waBtn.style.opacity = "0.4";
    waBtn.style.cursor  = "not-allowed";
    waBtn.title         = "Please submit your changes first";
  }
});
