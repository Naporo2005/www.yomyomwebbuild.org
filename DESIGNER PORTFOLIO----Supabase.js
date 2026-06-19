/* ============================================================
   SUPABASE + EMAILJS INTEGRATION
   "Brand Name" Designer Portfolio — Website Editor
   Rewritten to match editor.js + HTML template IDs exactly.
   ============================================================ */

/* ============================================================
   CONFIG — CREDENTIALS (unchanged from original)
   ============================================================ */
const SUPABASE_URL     = "https://zwwkrenkookgfbggfapl.supabase.co";
const SUPABASE_ANON    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3d2tyZW5rb29rZ2ZiZ2dmYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTYyMzEsImV4cCI6MjA5NDI5MjIzMX0.B4g-yzWXAmB1tre8dN6ho57-7SBEx1F9yReNutO1J-4";
const EMAILJS_SERVICE  = "service_y7uu2x6";
const EMAILJS_TEMPLATE = "template_ovsdd4e";
const EMAILJS_KEY      = "ifS-MZXz8HjB-GX-s";
const ADMIN_EMAIL      = "0555358325a@gmail.com";
const WA_NUMBER        = "233555358325";
const STORAGE_BUCKET   = "images";
const SESSION_KEY      = "portfolio_session_id";

/* ============================================================
   CARD CATEGORIES — matches HTML section IDs and editor.js
   ============================================================ */
const CARD_CATEGORIES = [
  "wedding", "naming", "logo", "business",
  "birthday", "citation", "campaign", "tshirt"
];

/* ============================================================
   INIT SUPABASE CLIENT
   ============================================================ */
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ============================================================
   SESSION ID
   Persisted in localStorage so the same user keeps the same ID.
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

  if (error) {
    console.error(`Image upload failed [${imageKey}]:`, error.message);
    return null;
  }

  const { data: pub } = _supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return pub.publicUrl;
}

/* ============================================================
   UPLOAD ALL IMAGES
   Reads every <input type="file"> in the editor panel
   and uploads any file the user has selected.

   Image keys used (matching the editor panel inputs):
     logo-image       — nav logo
     hero-image       — hero background
     about-image      — about section photo
     wedding-card-1 … tshirt-card-4  — portfolio cards (32 total)
   ============================================================ */
async function uploadAllImages(sessionId) {
  const imageUrls = {};

  // --- Logo ---
  const logoInput = document.querySelector(
    '.editor-box input[type="file"][onchange*="uploadLogoImage"]'
  );
  if (logoInput?.files?.[0]) {
    const url = await uploadImage(logoInput.files[0], "logo-image", sessionId);
    if (url) imageUrls["logo-image"] = url;
  }

  // --- Hero background ---
  const heroInput = document.getElementById("heroImageInput");
  if (heroInput?.files?.[0]) {
    const url = await uploadImage(heroInput.files[0], "hero-image", sessionId);
    if (url) imageUrls["hero-image"] = url;
  }

  // --- About image ---
  const aboutInput = document.querySelector(
    '.editor-box input[type="file"][onchange*="uploadAboutImage"]'
  );
  if (aboutInput?.files?.[0]) {
    const url = await uploadImage(aboutInput.files[0], "about-image", sessionId);
    if (url) imageUrls["about-image"] = url;
  }

  // --- Portfolio card images (8 categories × 4 cards) ---
  for (const cat of CARD_CATEGORIES) {
    for (let i = 1; i <= 4; i++) {
      const key      = `${cat}-card-${i}`;
      const selector = `input[type="file"][onchange*="uploadCardImage('${key}'"]`;
      const input    = document.querySelector(selector);
      if (input?.files?.[0]) {
        const url = await uploadImage(input.files[0], key, sessionId);
        if (url) imageUrls[key] = url;
      }
    }
  }

  return imageUrls;
}

/* ============================================================
   SAVE IMAGE URLS TO customization_images TABLE
   ============================================================ */
async function saveImagesToTable(sessionId, imageUrls) {
  for (const [imageKey, imageUrl] of Object.entries(imageUrls)) {
    const { error } = await _supabase
      .from("customization_images")
      .upsert(
        { session_id: sessionId, image_key: imageKey, image_url: imageUrl },
        { onConflict: "session_id,image_key" }
      );

    if (error) {
      console.error(`Failed to save image row [${imageKey}]:`, error.message);
    }
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
   DOM HELPERS
   (mirrors the helpers already in editor.js for consistency)
   ============================================================ */
function _getText(id)      { return document.getElementById(id)?.innerText?.trim() || ""; }
function _getHTML(id)      { return document.getElementById(id)?.innerHTML || ""; }
function _getHref(id)      { return document.getElementById(id)?.getAttribute("href") || ""; }
function _getSrc(id)       { return document.getElementById(id)?.getAttribute("src") || ""; }
function _getStyle(id, p)  { return document.getElementById(id)?.style?.[p] || ""; }
function _getComputedCSS(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

/* ============================================================
   COLLECT ALL EDITOR STATE FROM THE DOM
   Maps every element that editor.js can modify in this template.
   ============================================================ */
function collectAllData() {

  // ── NAV ──────────────────────────────────────────────────────
  const nav = {
    bg:         _getStyle("header", "backgroundColor"),
    textColor:  _getComputedCSS("--nav-text-color"),
    hoverColor: _getComputedCSS("--nav-hover-color"),
    links: {
      home:  { text: _getText("nav-home"),  href: _getHref("nav-home")  },
      about: { text: _getText("nav-about"), href: _getHref("nav-about") },
      what:  { text: _getText("nav-what"),  href: _getHref("nav-what")  },
      hire:  { text: _getText("nav-hire"),  href: _getHref("nav-hire")  },
    },
    logoSrc: document.querySelector("#header img")?.getAttribute("src") || "",
  };

  // ── HERO ─────────────────────────────────────────────────────
  // editor.js stores gradient colours in module-level vars;
  // we read what's actually applied to the element instead.
  const heroEl       = document.getElementById("home");
  const heroTitleEl  = document.getElementById("hero-title");
  const heroStyle    = heroEl ? getComputedStyle(heroEl).backgroundImage : "";

  const hero = {
    title:          _getText("hero-title"),
    titleColor:     _getStyle("hero-title", "color"),
    backgroundImage: heroStyle,          // full resolved background-image string
    gradientColor1: _heroGradientColor1, // read from editor.js global
    gradientColor2: _heroGradientColor2, // read from editor.js global
    opacity:        String(_heroOpacity), // read from editor.js global
  };

  // ── ABOUT ────────────────────────────────────────────────────
  const about = {
    bg:        _getStyle("about", "background"),
    title:     _getText("about-title"),
    titleColor: _getStyle("about-title", "color"),
    desc:      _getText("about-desc"),
    descColor: _getStyle("about-desc", "color"),
    imageSrc:  document.querySelector("#about-image img")?.getAttribute("src") || "",
  };

  // ── WHAT I DO ────────────────────────────────────────────────
  const whatIDo = {
    title:        _getText("what-i-do-title"),
    titleColor:   _getStyle("what-i-do-title", "color"),
    bg:           _getStyle("what-i-do", "background"),
    captionBg:    (() => {
      // caption bg is set inline on all .card-caption elements
      const cap = document.querySelector(".card-caption");
      return cap?.style?.background || "";
    })(),
    captionColor: (() => {
      const cap = document.querySelector(".card-caption");
      return cap?.style?.color || "";
    })(),
  };

  // ── CARD CATEGORIES ──────────────────────────────────────────
  const categories = {};
  CARD_CATEGORIES.forEach((cat) => {
    const cards = {};
    for (let i = 1; i <= 4; i++) {
      const cardEl = document.getElementById(`${cat}-card-${i}`);
      cards[i] = {
        imageSrc: cardEl?.querySelector("img")?.getAttribute("src") || "",
        caption:  _getText(`${cat}-p${i}`),
      };
    }
    categories[cat] = {
      title: _getText(`${cat}-title`),
      cards,
    };
  });

  // ── HIRE ME ──────────────────────────────────────────────────
  const hireMe = {
    bg:           _getStyle("hire-me", "background"),
    title:        _getText("hire-me-title"),
    titleColor:   _getStyle("hire-me-title", "color"),
    desc:         _getText("hire-me-desc"),
    descColor:    _getStyle("hire-me-desc", "color"),
    btnText:      _getText("hire-btn"),
    btnHref:      _getHref("hire-btn"),
    btnBg:        _getStyle("hire-btn", "background"),
    btnTextColor: _getStyle("hire-btn", "color"),
  };

  // ── FOOTER ───────────────────────────────────────────────────
  const footer = {
    bg:        _getStyle("footer", "background"),
    textColor: _getStyle("footer", "color"),
    text:      _getHTML("footer-bottom"),
  };

  return { nav, hero, about, whatIDo, categories, hireMe, footer };
}

/* ============================================================
   APPLY ALL DATA BACK TO THE DOM
   Used by loadDraft() to restore a saved customisation.
   Calls the same setters that editor.js uses so behaviour is
   100 % consistent.
   ============================================================ */
function applyAllData(data) {
  if (!data) return;

  // ── NAV ──────────────────────────────────────────────────────
  if (data.nav) {
    if (data.nav.bg)         setNavBg(data.nav.bg);
    if (data.nav.textColor)  setNavTextColor(data.nav.textColor);
    if (data.nav.hoverColor) setNavHoverColor(data.nav.hoverColor);

    if (data.nav.links) {
      const map = {
        home:  "nav-home",
        about: "nav-about",
        what:  "nav-what",
        hire:  "nav-hire",
      };
      Object.entries(map).forEach(([key, id]) => {
        const link = data.nav.links[key];
        if (!link) return;
        if (link.text) setNavText(id, link.text);
        if (link.href) setNavHref(id, link.href);
      });
    }

    if (data.nav.logoSrc) {
      const logoImg = document.querySelector("#header img");
      if (logoImg) logoImg.src = data.nav.logoSrc;
    }
  }

  // ── HERO ─────────────────────────────────────────────────────
  if (data.hero) {
    if (data.hero.title) setText("hero-title", data.hero.title);

    if (data.hero.titleColor) {
      const e = el("hero-title");
      if (e) e.style.color = data.hero.titleColor;
    }

    // Restore gradient colours + opacity then rebuild background
    if (data.hero.gradientColor1) {
      _heroGradientColor1 = data.hero.gradientColor1;
    }
    if (data.hero.gradientColor2) {
      _heroGradientColor2 = data.hero.gradientColor2;
    }
    if (data.hero.opacity !== undefined) {
      setHeroOpacity(data.hero.opacity);
    } else {
      applyHeroBackground();
    }

    // If a saved background-image string exists (covers the url() part),
    // restore it directly so the image isn't lost on reload.
    if (data.hero.backgroundImage) {
      const heroEl = el("home");
      if (heroEl) {
        heroEl.style.backgroundImage = data.hero.backgroundImage;
        heroEl.style.backgroundSize     = "cover";
        heroEl.style.backgroundPosition = "center";
      }
    }
  }

  // ── ABOUT ────────────────────────────────────────────────────
  if (data.about) {
    if (data.about.bg)         setAboutBg(data.about.bg);
    if (data.about.title)      setText("about-title", data.about.title);
    if (data.about.titleColor) setAboutTitleColor(data.about.titleColor);
    if (data.about.desc)       setText("about-desc", data.about.desc);
    if (data.about.descColor)  setAboutDescColor(data.about.descColor);

    if (data.about.imageSrc) {
      const img = document.querySelector("#about-image img");
      if (img) img.src = data.about.imageSrc;
    }
  }

  // ── WHAT I DO ────────────────────────────────────────────────
  if (data.whatIDo) {
    if (data.whatIDo.title)        setText("what-i-do-title", data.whatIDo.title);
    if (data.whatIDo.titleColor)   setWhatTitleColor(data.whatIDo.titleColor);
    if (data.whatIDo.bg)           setWhatBg(data.whatIDo.bg);
    if (data.whatIDo.captionBg)    setCaptionBg(data.whatIDo.captionBg);
    if (data.whatIDo.captionColor) setCaptionText(data.whatIDo.captionColor);
  }

  // ── CARD CATEGORIES ──────────────────────────────────────────
  if (data.categories) {
    CARD_CATEGORIES.forEach((cat) => {
      const catData = data.categories[cat];
      if (!catData) return;

      if (catData.title) setText(`${cat}-title`, catData.title);

      if (catData.cards) {
        for (let i = 1; i <= 4; i++) {
          const card = catData.cards[i];
          if (!card) continue;
          if (card.imageSrc) {
            const img = document.querySelector(`#${cat}-card-${i} img`);
            if (img) img.src = card.imageSrc;
          }
          if (card.caption) setText(`${cat}-p${i}`, card.caption);
        }
      }
    });
  }

  // ── HIRE ME ──────────────────────────────────────────────────
  if (data.hireMe) {
    if (data.hireMe.bg)           setHireBg(data.hireMe.bg);
    if (data.hireMe.title)        setText("hire-me-title", data.hireMe.title);
    if (data.hireMe.titleColor)   setHireTitleColor(data.hireMe.titleColor);
    if (data.hireMe.desc)         setText("hire-me-desc", data.hireMe.desc);
    if (data.hireMe.descColor)    setHireDescColor(data.hireMe.descColor);
    if (data.hireMe.btnText)      setText("hire-btn", data.hireMe.btnText);
    if (data.hireMe.btnHref)      setHref("hire-btn", data.hireMe.btnHref);
    if (data.hireMe.btnBg)        setHireBtnBg(data.hireMe.btnBg);
    if (data.hireMe.btnTextColor) setHireBtnTextColor(data.hireMe.btnTextColor);
  }

  // ── FOOTER ───────────────────────────────────────────────────
  if (data.footer) {
    if (data.footer.bg)        setFooterBg(data.footer.bg);
    if (data.footer.textColor) setFooterTextColor(data.footer.textColor);
    if (data.footer.text) {
      const footerBottom = document.getElementById("footer-bottom");
      if (footerBottom) footerBottom.innerHTML = data.footer.text;
    }
  }
}

/* ============================================================
   BUILD EMAIL BODY
   ============================================================ */
function buildEmailBody(sessionId, data, imageUrls) {
  const categoryLines = Object.entries(data.categories || {})
    .map(([cat, catData]) => {
      const cardLines = Object.entries(catData.cards || {})
        .map(([i, c]) => `    Card ${i}: caption="${c.caption || "—"}"`)
        .join("\n");
      return `  ${cat.toUpperCase()} — Title: "${catData.title || "—"}"\n${cardLines}`;
    })
    .join("\n\n");

  const imageLines = Object.keys(imageUrls).length
    ? Object.entries(imageUrls).map(([k, v]) => `  ${k}: ${v}`).join("\n")
    : "  No new images uploaded";

  return `
╔══════════════════════════════════════════╗
   NEW CUSTOMIZATION SUBMITTED
        DESIGNER PORTFOLIO
╚══════════════════════════════════════════╝

SESSION ID : ${sessionId}
SUBMITTED  : ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background   : ${data.nav?.bg}
Text Color   : ${data.nav?.textColor}
Hover Color  : ${data.nav?.hoverColor}
Home  : "${data.nav?.links?.home?.text}"  → ${data.nav?.links?.home?.href}
About : "${data.nav?.links?.about?.text}" → ${data.nav?.links?.about?.href}
What  : "${data.nav?.links?.what?.text}"  → ${data.nav?.links?.what?.href}
Hire  : "${data.nav?.links?.hire?.text}"  → ${data.nav?.links?.hire?.href}
Logo  : ${data.nav?.logoSrc}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title          : ${data.hero?.title}
Title Color    : ${data.hero?.titleColor}
Gradient 1     : ${data.hero?.gradientColor1}
Gradient 2     : ${data.hero?.gradientColor2}
Overlay Opacity: ${data.hero?.opacity}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ABOUT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background   : ${data.about?.bg}
Title        : ${data.about?.title}
Title Color  : ${data.about?.titleColor}
Description  : ${data.about?.desc}
Desc Color   : ${data.about?.descColor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT I DO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Heading       : ${data.whatIDo?.title}
Heading Color : ${data.whatIDo?.titleColor}
Background    : ${data.whatIDo?.bg}
Caption Bg    : ${data.whatIDo?.captionBg}
Caption Color : ${data.whatIDo?.captionColor}

${categoryLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HIRE ME SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.hireMe?.bg}
Title             : ${data.hireMe?.title}
Title Color       : ${data.hireMe?.titleColor}
Description       : ${data.hireMe?.desc}
Desc Color        : ${data.hireMe?.descColor}
Button Text       : ${data.hireMe?.btnText}
Button Link       : ${data.hireMe?.btnHref}
Button Bg         : ${data.hireMe?.btnBg}
Button Text Color : ${data.hireMe?.btnTextColor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background   : ${data.footer?.bg}
Text Color   : ${data.footer?.textColor}
Text         : ${data.footer?.text}

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
      subject:    `New Portfolio Customization — Session: ${sessionId}`,
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

  btn.disabled      = false;
  btn.style.opacity = "1";
  btn.style.cursor  = "pointer";
  btn.title         = "Click to send your ID via WhatsApp";
  btn.onclick       = () => window.open(url, "_blank");
}

/* ============================================================
   SAVE BUTTON — localStorage only
   ============================================================ */
function saveDraft() {
  const data = collectAllData();
  localStorage.setItem("portfolio_draft", JSON.stringify(data));
  showSaveStatus("Changes Saved!", "#22c55e");
}

/* ============================================================
   LOAD PREVIOUS BUTTON — restores from localStorage
   ============================================================ */
function loadDraft() {
  const raw = localStorage.getItem("portfolio_draft");
  if (!raw) {
    showSaveStatus("No saved draft found!", "#f59e0b");
    return;
  }
  try {
    const data = JSON.parse(raw);
    applyAllData(data);
    showSaveStatus("Previous customization loaded ✓", "#22c55e");
  } catch (e) {
    showSaveStatus("Failed to load draft.", "#ef4444");
    console.error("loadDraft parse error:", e);
  }
}

/* ============================================================
   RESET BUTTON — clears draft, reloads page to defaults
   ============================================================ */
function clearAllData() {
  localStorage.removeItem("portfolio_draft");
  showSaveStatus("Resetting…", "#ef4444");
  setTimeout(() => location.reload(), 600);
}

/* ============================================================
   SUBMIT BUTTON — full flow:
   1. Upload images to Supabase Storage
   2. Save image URLs to customization_images table
   3. Save all editor data to customizations table
   4. Send summary email via EmailJS
   5. Unlock WhatsApp button
   ============================================================ */
async function submitCustomization() {
  const submitBtn = document.getElementById("submitFinalBtn");
  if (submitBtn) submitBtn.disabled = true;

  try {
    showSaveStatus("Uploading images…", "#d4af37");

    const sessionId = getSessionId();
    const data      = collectAllData();

    const imageUrls = await uploadAllImages(sessionId);

    await saveImagesToTable(sessionId, imageUrls);

    showSaveStatus("Saving customization…", "#d4af37");
    await saveDataToTable(sessionId, data);

    showSaveStatus("Sending email…", "#d4af37");
    await sendAdminEmail(sessionId, data, imageUrls);

    // Keep a local copy so loadDraft() works after submission
    localStorage.setItem("portfolio_draft", JSON.stringify(data));

    activateWhatsApp(sessionId);

    showSaveStatus(`✅ Submitted! Session ID: ${sessionId}`, "#22c55e");

  } catch (err) {
    console.error("Submit failed:", err);
    showSaveStatus("❌ Submission failed,  Please try again later.", "#ef4444");
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ============================================================
   STATUS HELPER
   ============================================================ */
function showSaveStatus(message, color = "#ffffff") {
  const statusEl = document.getElementById("saveStatus");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = color;
}

/* ============================================================
   BIND BUTTONS ON DOM READY
   (The accordion + panel toggle are already bound in the HTML,
    so we only wire the action buttons here.)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn")
    ?.addEventListener("click", saveDraft);

  document.getElementById("loadPrevBtn")
    ?.addEventListener("click", loadDraft);

  document.getElementById("resetBtn")
    ?.addEventListener("click", clearAllData);

  document.getElementById("submitFinalBtn")
    ?.addEventListener("click", submitCustomization);

  // WhatsApp button starts locked until a successful submit
  const waBtn = document.getElementById("waContactBtn");
  if (waBtn) {
    waBtn.disabled      = true;
    waBtn.style.opacity = "0.4";
    waBtn.style.cursor  = "not-allowed";
    waBtn.title         = "Please Submit Changes First";
  }
});
