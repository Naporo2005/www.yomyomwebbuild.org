/* ============================================================
   SUPABASE + EMAILJS INTEGRATION
   Yomyom Fast Foods — Website Editor
   Same credentials & logic as the Brand Name file.
   Rewritten to match foood.js + HTML template IDs exactly.
   ============================================================ */

/* ============================================================
   CONFIG — ALL CREDENTIALS (unchanged)
   ============================================================ */
const SUPABASE_URL     = "https://zwwkrenkookgfbggfapl.supabase.co";
const SUPABASE_ANON    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3d2tyZW5rb29rZ2ZiZ2dmYXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTYyMzEsImV4cCI6MjA5NDI5MjIzMX0.B4g-yzWXAmB1tre8dN6ho57-7SBEx1F9yReNutO1J-4";
const EMAILJS_SERVICE  = "service_y7uu2x6";
const EMAILJS_TEMPLATE = "template_ovsdd4e";
const EMAILJS_KEY      = "ifS-MZXz8HjB-GX-s";
const ADMIN_EMAIL      = "0555358325a@gmail.com";
const WA_NUMBER        = "233555358325";
const STORAGE_BUCKET   = "images";
const SESSION_KEY      = "yomyom_session_id";

/* ============================================================
   TEMPLATE CONSTANTS
   ============================================================ */
const DISH_COUNT         = 8;   // dish cards
const ABOUT_IMG_COUNT    = 4;   // about gallery images
const ABOUT_POINT_COUNT  = 4;   // bullet points
const STAT_COUNT         = 4;   // stat cards
const HERO_SLIDE_COUNT   = 3;   // hero slides
const SOCIAL_SLOT_COUNT  = 3;   // footer social icons

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
   Reads every relevant <input type="file"> in the editor panel
   and uploads any file the user has selected.

   Image keys:
     logo-img             — navbar logo
     hero-img-1/2/3       — hero slide backgrounds
     about-img-1..4       — about gallery
     dish-img-1..8        — dish card photos
     gallery-img-1..6     — gallery section images
   ============================================================ */
async function uploadAllImages(sessionId) {
  const imageUrls = {};

  /* Helper: upload from a single file input by element ID */
  async function tryUpload(inputId, key) {
    const input = document.getElementById(inputId);
    if (input?.files?.[0]) {
      const url = await uploadImage(input.files[0], key, sessionId);
      if (url) imageUrls[key] = url;
    }
  }

  // Logo
  await tryUpload("logo-img-upload", "logo-img");

  // Hero slides
  for (let i = 1; i <= HERO_SLIDE_COUNT; i++) {
    await tryUpload(`hero-img-upload-${i}`, `hero-img-${i}`);
  }

  // About gallery
  for (let i = 1; i <= ABOUT_IMG_COUNT; i++) {
    await tryUpload(`about-img-upload-${i}`, `about-img-${i}`);
  }

  // Dish images
  for (let i = 1; i <= DISH_COUNT; i++) {
    await tryUpload(`dish-img-${i}-upload`, `dish-img-${i}`);
  }

  // Gallery section
  for (let i = 1; i <= 6; i++) {
    await tryUpload(`gallery-img-${i}-upload`, `gallery-img-${i}`);
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
   DOM READ HELPERS
   ============================================================ */
function _val(id)         { return document.getElementById(id)?.value?.trim()       || ""; }
function _text(id)        { return document.getElementById(id)?.innerText?.trim()   || ""; }
function _html(id)        { return document.getElementById(id)?.innerHTML           || ""; }
function _href(id)        { return document.getElementById(id)?.getAttribute("href")|| ""; }
function _src(id)         { return document.getElementById(id)?.getAttribute("src") || ""; }
function _style(id, prop) { return document.getElementById(id)?.style?.[prop]       || ""; }
function _cssVar(name)    { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

/* ============================================================
   COLLECT ALL EDITOR STATE FROM THE DOM
   Maps every editable element in the Yomyom template.
   ============================================================ */
function collectAllData() {

  // ── NAVBAR ───────────────────────────────────────────────────
  const nav = {
    logoSrc:       _src("logo-img"),
    logoText:      _text("logo-text"),
    bg:            _cssVar("--nav-bg"),
    logoColor:     _cssVar("--logo-color"),
    textColor:     _cssVar("--nav-text-color"),
    hoverColor:    _cssVar("--nav-hover-color"),
    menuIconColor: _cssVar("--menu-icon-color"),
    links: {
      home:    { text: _text("nav-home"),    href: _href("nav-home")    },
      about:   { text: _text("nav-about"),   href: _href("nav-about")   },
      dishes:  { text: _text("nav-dishes"),  href: _href("nav-dishes")  },
      order:   { text: _text("nav-order"),   href: _href("nav-order")   },
      contact: { text: _text("nav-contact"), href: _href("nav-contact") },
    },
  };

  // ── HERO (3 slides) ───────────────────────────────────────────
  const hero = { slides: {}, colors: {} };
  for (let i = 1; i <= HERO_SLIDE_COUNT; i++) {
    hero.slides[i] = {
      imgSrc:  _src(`hero-img-${i}`),
      title:   _text(`hero-title-${i}`),
      desc:    _text(`hero-desc-${i}`),
      btnText: _text(`hero-btn-${i}`),
      btnHref: _href(`hero-btn-${i}`),
    };
  }
  hero.colors = {
    titleColor:      _cssVar("--hero-title-color"),
    descColor:       _cssVar("--hero-desc-color"),
    btnBg:           _cssVar("--hero-btn-bg"),
    btnTextColor:    _cssVar("--hero-btn-text-color"),
    overlayRgb:      _cssVar("--hero-overlay-rgb"),
    overlayOpacity:  _cssVar("--hero-overlay-opacity"),
  };

  // ── ABOUT ────────────────────────────────────────────────────
  const about = {
    title:    _text("about-title"),
    subtitle: _text("about-subtitle"),
    heading:  _text("about-heading"),
    text:     _text("about-text"),
    points:   {},
    gallery:  {},
    colors: {
      bg:               _cssVar("--about-bg"),
      titleColor:       _cssVar("--about-title-color"),
      subtitleColor:    _cssVar("--about-subtitle-color"),
      headingColor:     _cssVar("--about-heading-color"),
      textColor:        _cssVar("--about-text-color"),
      bulletBg:         _cssVar("--about-bullet-bg"),
      bulletText:       _cssVar("--about-bullet-text"),
      bulletBorder:     _cssVar("--about-bullet-border"),
      titleUnderline:   _cssVar("--about-title-underline"),
    },
  };
  for (let i = 1; i <= ABOUT_POINT_COUNT; i++) {
    about.points[i] = _text(`about-point-${i}`);
  }
  for (let i = 1; i <= ABOUT_IMG_COUNT; i++) {
    about.gallery[i] = _src(`about-img-${i}`);
  }

  // ── STATS ────────────────────────────────────────────────────
  const stats = {
    cards: {},
    colors: {
      bg:          _cssVar("--stats-bg"),
      cardBg:      _cssVar("--stats-card-bg"),
      numberColor: _cssVar("--stats-number-color"),
      textColor:   _cssVar("--stats-text-color"),
      iconColor:   _cssVar("--stats-icon-color"),
    },
  };
  for (let i = 1; i <= STAT_COUNT; i++) {
    stats.cards[i] = {
      number: _text(`stat-number-${i}`),
      text:   _text(`stat-text-${i}`),
    };
  }

  // ── DISHES (8 cards) ──────────────────────────────────────────
  const dishes = {
    title:    _text("dishes-title"),
    subtitle: _text("dishes-subtitle"),
    cards:    {},
    colors: {
      bg:               _cssVar("--dishes-bg"),
      cardBg:           _cssVar("--dishes-card-bg"),
      titleColor:       _cssVar("--dishes-title-color"),
      subtitleColor:    _cssVar("--dishes-subtitle-color"),
      cardTitleColor:   _cssVar("--dishes-card-title-color"),
      textColor:        _cssVar("--dishes-text-color"),
      priceColor:       _cssVar("--dishes-price-color"),
      borderColor:      _cssVar("--dish-border-color"),
      titleUnderline:   _cssVar("--dishes-title-underline"),
    },
  };
  for (let i = 1; i <= DISH_COUNT; i++) {
    dishes.cards[i] = {
      title:   _text(`dish-title-${i}`),
      desc:    _text(`dish-desc-${i}`),
      price:   _text(`dish-price-${i}`),
      imgSrc:  _src(`dish-img-${i}`),
    };
  }

  // ── ORDER ────────────────────────────────────────────────────
  const orderSelect   = document.getElementById("dish-select");
  const dishOptions   = orderSelect
    ? Array.from(orderSelect.options).map(o => o.textContent.trim()).join(", ")
    : "";

  const order = {
    title:          _text("order-title"),
    subtitle:       _text("order-subtitle"),
    dishLabel:      _text("dish-label"),
    qtyLabel:       _text("qty-label"),
    defaultQty:     document.getElementById("dish-qty")?.value || "1",
    dishOptions,
    whatsapp: {
      href: _href("whatsapp-btn"),
      text: (() => {
        const btn = document.getElementById("whatsapp-btn");
        return btn ? btn.textContent.trim() : "";
      })(),
    },
    call: {
      href: _href("call-btn"),
      text: (() => {
        const btn = document.getElementById("call-btn");
        return btn ? btn.textContent.trim() : "";
      })(),
    },
    colors: {
      bg:              _cssVar("--order-bg"),
      titleColor:      _cssVar("--order-title-color"),
      subtitleColor:   _cssVar("--order-subtitle-color"),
      formBg:          _cssVar("--order-form-bg"),
      labelColor:      _cssVar("--order-label-color"),
      textColor:       _cssVar("--order-text-color"),
      whatsappBg:      _cssVar("--order-whatsapp-bg"),
      whatsappText:    _cssVar("--order-whatsapp-text"),
      callBg:          _cssVar("--order-call-bg"),
      callText:        _cssVar("--order-call-text"),
      titleUnderline:  _cssVar("--order-title-underline"),
    },
  };

  // ── CONTACT ──────────────────────────────────────────────────
  const mapEl = document.getElementById("google-map");
  const contact = {
    title:      _text("contact-title"),
    subtitle:   _text("contact-subtitle"),
    address: {
      label: _text("address-title"),
      text:  _text("address-text"),
    },
    phone: {
      label: _text("phone-title"),
      text:  _text("phone-text"),
    },
    hours: {
      label: _text("hours-title"),
      text:  _text("hours-text"),
    },
    mapSrc: mapEl?.getAttribute("src") || "",
    colors: {
      bg:             _cssVar("--contact-bg"),
      cardBg:         _cssVar("--contact-card-bg"),
      titleColor:     _cssVar("--contact-title-color"),
      subtitleColor:  _cssVar("--contact-subtitle-color"),
      textColor:      _cssVar("--contact-text-color"),
      iconColor:      _cssVar("--contact-icon-color"),
      titleUnderline: _cssVar("--contact-title-underline"),
    },
  };

  // ── FOOTER ───────────────────────────────────────────────────
  const footerAnchors = document.querySelectorAll(".footer-links a");
  const footer = {
    logoText: _text("footer-logo"),
    text:     _text("footer-text"),
    links: {
      home:    footerAnchors[0]?.textContent?.trim() || "",
      about:   footerAnchors[1]?.textContent?.trim() || "",
      dishes:  footerAnchors[2]?.textContent?.trim() || "",
      order:   footerAnchors[3]?.textContent?.trim() || "",
      contact: footerAnchors[4]?.textContent?.trim() || "",
    },
    socials: {
      facebook: _href("facebook-link"),
      tiktok:   _href("tiktok-link"),
      youtube:  _href("youtube-link"),
      snapchat: _href("snapchat-link"),
    },
    copyright: _text("copyright"),
    colors: {
      bg:            _cssVar("--footer-bg"),
      textColor:     _cssVar("--footer-text-color"),
      linkColor:     _cssVar("--footer-link-color"),
      iconHover:     _cssVar("--footer-icon-hover"),
    },
  };

  // ── FLOATING BUTTONS ─────────────────────────────────────────
  const floatingBtns = {
    whatsapp: {
      href: _href("floating-whatsapp"),
      bg:   _cssVar("--float-wa-bg"),
      icon: _cssVar("--float-wa-icon"),
    },
    call: {
      href: _href("floating-call"),
      bg:   _cssVar("--float-call-bg-var"),
      icon: _cssVar("--float-call-icon"),
    },
  };

  return { nav, hero, about, stats, dishes, order, contact, footer, floatingBtns };
}

/* ============================================================
   APPLY ALL DATA BACK TO THE DOM
   Called by loadDraft(). Uses the same DOM setters that
   foood.js uses so every change is consistent.
   ============================================================ */
function applyAllData(data) {
  if (!data) return;

  const root = document.documentElement;
  function setVar(name, value) {
    if (value) root.style.setProperty(name, value);
  }

  // ── NAVBAR ───────────────────────────────────────────────────
  if (data.nav) {
    const n = data.nav;
    if (n.logoSrc)  { const img = document.getElementById("logo-img");   if (img)  img.src = n.logoSrc; }
    if (n.logoText) { const el  = document.getElementById("logo-text");  if (el)   el.textContent = n.logoText; }

    setVar("--nav-bg",         n.bg);
    setVar("--logo-color",     n.logoColor);
    setVar("--nav-text-color", n.textColor);
    setVar("--nav-hover-color",n.hoverColor);
    setVar("--menu-icon-color",n.menuIconColor);

    if (n.links) {
      const map = { home: "nav-home", about: "nav-about", dishes: "nav-dishes", order: "nav-order", contact: "nav-contact" };
      Object.entries(map).forEach(([key, id]) => {
        const link = n.links[key];
        const el   = document.getElementById(id);
        if (!link || !el) return;
        if (link.text) el.textContent     = link.text;
        if (link.href) el.setAttribute("href", link.href);
      });
    }
  }

  // ── HERO ─────────────────────────────────────────────────────
  if (data.hero) {
    const h = data.hero;
    if (h.slides) {
      for (let i = 1; i <= HERO_SLIDE_COUNT; i++) {
        const s = h.slides[i];
        if (!s) continue;
        if (s.imgSrc)  { const img = document.getElementById(`hero-img-${i}`);   if (img)  img.src = s.imgSrc; }
        if (s.title)   { const el  = document.getElementById(`hero-title-${i}`); if (el)   el.textContent = s.title; }
        if (s.desc)    { const el  = document.getElementById(`hero-desc-${i}`);  if (el)   el.textContent = s.desc; }
        if (s.btnHref) { const el  = document.getElementById(`hero-btn-${i}`);   if (el)   el.setAttribute("href", s.btnHref); }
        if (s.btnText) {
          const btn = document.getElementById(`hero-btn-${i}`);
          if (btn) btn.textContent = s.btnText;
        }
      }
    }
    if (h.colors) {
      const c = h.colors;
      setVar("--hero-title-color",    c.titleColor);
      setVar("--hero-desc-color",     c.descColor);
      setVar("--hero-btn-bg",         c.btnBg);
      setVar("--hero-btn-text-color", c.btnTextColor);
      setVar("--hero-overlay-rgb",    c.overlayRgb);
      setVar("--hero-overlay-opacity",c.overlayOpacity);
    }
  }

  // ── ABOUT ────────────────────────────────────────────────────
  if (data.about) {
    const a = data.about;
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setText("about-title",    a.title);
    setText("about-subtitle", a.subtitle);
    setText("about-heading",  a.heading);
    setText("about-text",     a.text);

    if (a.points) {
      for (let i = 1; i <= ABOUT_POINT_COUNT; i++) {
        if (a.points[i]) setText(`about-point-${i}`, a.points[i]);
      }
    }
    if (a.gallery) {
      for (let i = 1; i <= ABOUT_IMG_COUNT; i++) {
        if (a.gallery[i]) { const img = document.getElementById(`about-img-${i}`); if (img) img.src = a.gallery[i]; }
      }
    }
    if (a.colors) {
      const c = a.colors;
      setVar("--about-bg",              c.bg);
      setVar("--about-title-color",     c.titleColor);
      setVar("--about-subtitle-color",  c.subtitleColor);
      setVar("--about-heading-color",   c.headingColor);
      setVar("--about-text-color",      c.textColor);
      setVar("--about-bullet-bg",       c.bulletBg);
      setVar("--about-bullet-text",     c.bulletText);
      setVar("--about-bullet-border",   c.bulletBorder);
      setVar("--about-title-underline", c.titleUnderline);
    }
  }

  // ── STATS ────────────────────────────────────────────────────
  if (data.stats) {
    const s = data.stats;
    if (s.cards) {
      for (let i = 1; i <= STAT_COUNT; i++) {
        const card = s.cards[i];
        if (!card) continue;
        const numEl  = document.getElementById(`stat-number-${i}`);
        const textEl = document.getElementById(`stat-text-${i}`);
        if (numEl  && card.number) numEl.textContent  = card.number;
        if (textEl && card.text)   textEl.textContent  = card.text;
      }
    }
    if (s.colors) {
      const c = s.colors;
      setVar("--stats-bg",           c.bg);
      setVar("--stats-card-bg",      c.cardBg);
      setVar("--stats-number-color", c.numberColor);
      setVar("--stats-text-color",   c.textColor);
      setVar("--stats-icon-color",   c.iconColor);
    }
  }

  // ── DISHES ───────────────────────────────────────────────────
  if (data.dishes) {
    const d = data.dishes;
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setText("dishes-title",    d.title);
    setText("dishes-subtitle", d.subtitle);

    if (d.cards) {
      for (let i = 1; i <= DISH_COUNT; i++) {
        const card = d.cards[i];
        if (!card) continue;
        setText(`dish-title-${i}`, card.title);
        setText(`dish-desc-${i}`,  card.desc);
        setText(`dish-price-${i}`, card.price);
        if (card.imgSrc) { const img = document.getElementById(`dish-img-${i}`); if (img) img.src = card.imgSrc; }
      }
    }
    if (d.colors) {
      const c = d.colors;
      setVar("--dishes-bg",                c.bg);
      setVar("--dishes-card-bg",           c.cardBg);
      setVar("--dishes-title-color",       c.titleColor);
      setVar("--dishes-subtitle-color",    c.subtitleColor);
      setVar("--dishes-card-title-color",  c.cardTitleColor);
      setVar("--dishes-text-color",        c.textColor);
      setVar("--dishes-price-color",       c.priceColor);
      setVar("--dish-border-color",        c.borderColor);
      setVar("--dishes-title-underline",   c.titleUnderline);
    }
  }

  // ── ORDER ────────────────────────────────────────────────────
  if (data.order) {
    const o = data.order;
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setText("order-title",    o.title);
    setText("order-subtitle", o.subtitle);
    setText("dish-label",     o.dishLabel);
    setText("qty-label",      o.qtyLabel);

    if (o.defaultQty) {
      const qtyEl = document.getElementById("dish-qty");
      if (qtyEl) qtyEl.value = o.defaultQty;
    }
    if (o.dishOptions) {
      const selectEl = document.getElementById("dish-select");
      if (selectEl) {
        const opts = o.dishOptions.split(",").map(s => s.trim()).filter(Boolean);
        selectEl.innerHTML = "";
        opts.forEach(opt => {
          const optEl = document.createElement("option");
          optEl.textContent = opt;
          selectEl.appendChild(optEl);
        });
      }
    }
    if (o.whatsapp) {
      const btn = document.getElementById("whatsapp-btn");
      if (btn) {
        if (o.whatsapp.href) btn.setAttribute("href", o.whatsapp.href);
        if (o.whatsapp.text) {
          const icon = btn.querySelector("i");
          btn.textContent = " " + o.whatsapp.text;
          if (icon) btn.prepend(icon);
        }
      }
    }
    if (o.call) {
      const btn = document.getElementById("call-btn");
      if (btn) {
        if (o.call.href) btn.setAttribute("href", o.call.href);
        if (o.call.text) {
          const icon = btn.querySelector("i");
          btn.textContent = " " + o.call.text;
          if (icon) btn.prepend(icon);
        }
      }
    }
    if (o.colors) {
      const c = o.colors;
      setVar("--order-bg",              c.bg);
      setVar("--order-title-color",     c.titleColor);
      setVar("--order-subtitle-color",  c.subtitleColor);
      setVar("--order-form-bg",         c.formBg);
      setVar("--order-label-color",     c.labelColor);
      setVar("--order-text-color",      c.textColor);
      setVar("--order-whatsapp-bg",     c.whatsappBg);
      setVar("--order-whatsapp-text",   c.whatsappText);
      setVar("--order-call-bg",         c.callBg);
      setVar("--order-call-text",       c.callText);
      setVar("--order-title-underline", c.titleUnderline);
    }
  }

  // ── CONTACT ──────────────────────────────────────────────────
  if (data.contact) {
    const con = data.contact;
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setText("contact-title",    con.title);
    setText("contact-subtitle", con.subtitle);
    if (con.address) { setText("address-title", con.address.label); setText("address-text", con.address.text); }
    if (con.phone)   { setText("phone-title",   con.phone.label);   setText("phone-text",   con.phone.text);   }
    if (con.hours)   { setText("hours-title",   con.hours.label);   setText("hours-text",   con.hours.text);   }
    if (con.mapSrc)  { const mapEl = document.getElementById("google-map"); if (mapEl) mapEl.setAttribute("src", con.mapSrc); }

    if (con.colors) {
      const c = con.colors;
      setVar("--contact-bg",              c.bg);
      setVar("--contact-card-bg",         c.cardBg);
      setVar("--contact-title-color",     c.titleColor);
      setVar("--contact-subtitle-color",  c.subtitleColor);
      setVar("--contact-text-color",      c.textColor);
      setVar("--contact-icon-color",      c.iconColor);
      setVar("--contact-title-underline", c.titleUnderline);
    }
  }

  // ── FOOTER ───────────────────────────────────────────────────
  if (data.footer) {
    const f = data.footer;
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setText("footer-logo",  f.logoText);
    setText("footer-text",  f.text);
    setText("copyright",    f.copyright);

    if (f.links) {
      const footerAnchors = document.querySelectorAll(".footer-links a");
      const order = ["home", "about", "dishes", "order", "contact"];
      order.forEach((key, idx) => {
        if (f.links[key] && footerAnchors[idx]) footerAnchors[idx].textContent = f.links[key];
      });
    }
    if (f.socials) {
      const socialMap = { facebook: "facebook-link", tiktok: "tiktok-link", youtube: "youtube-link", snapchat: "snapchat-link" };
      Object.entries(socialMap).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el && f.socials[key]) el.setAttribute("href", f.socials[key]);
      });
    }
    if (f.colors) {
      const c = f.colors;
      setVar("--footer-bg",         c.bg);
      setVar("--footer-text-color", c.textColor);
      setVar("--footer-link-color", c.linkColor);
      setVar("--footer-icon-hover", c.iconHover);
    }
  }

  // ── FLOATING BUTTONS ─────────────────────────────────────────
  if (data.floatingBtns) {
    const fb = data.floatingBtns;
    if (fb.whatsapp) {
      const btn = document.getElementById("floating-whatsapp");
      if (btn && fb.whatsapp.href) btn.setAttribute("href", fb.whatsapp.href);
      setVar("--float-wa-bg",   fb.whatsapp.bg);
      setVar("--float-wa-icon", fb.whatsapp.icon);
    }
    if (fb.call) {
      const btn = document.getElementById("floating-call");
      if (btn && fb.call.href) btn.setAttribute("href", fb.call.href);
      setVar("--float-call-bg-var", fb.call.bg);
      setVar("--float-call-icon",   fb.call.icon);
    }
  }
}

/* ============================================================
   BUILD EMAIL BODY
   ============================================================ */
function buildEmailBody(sessionId, data, imageUrls) {

  // Dish cards summary
  const dishLines = Object.entries(data.dishes?.cards || {})
    .map(([i, d]) =>
      `    Dish ${i}: "${d.title || "—"}" | ${d.price || "—"} | ${d.desc || "—"}`
    ).join("\n");

  // Stat cards summary
  const statLines = Object.entries(data.stats?.cards || {})
    .map(([i, s]) => `    Stat ${i}: ${s.number || "—"} — ${s.text || "—"}`)
    .join("\n");

  // Hero slides summary
  const heroLines = Object.entries(data.hero?.slides || {})
    .map(([i, s]) =>
      `    Slide ${i}: "${s.title || "—"}" | btn="${s.btnText || "—"}" → ${s.btnHref || "—"}`
    ).join("\n");

  // Image URLs
  const imageLines = Object.keys(imageUrls).length
    ? Object.entries(imageUrls).map(([k, v]) => `  ${k}: ${v}`).join("\n")
    : "  No new images uploaded";

  return `
╔══════════════════════════════════════════╗
   NEW CUSTOMIZATION SUBMITTED
         YOMYOM FAST FOODS
╚══════════════════════════════════════════╝

SESSION ID : ${sessionId}
SUBMITTED  : ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Logo Text    : ${data.nav?.logoText}
Navbar Bg    : ${data.nav?.bg}
Text Color   : ${data.nav?.textColor}
Hover Color  : ${data.nav?.hoverColor}
Home  : "${data.nav?.links?.home?.text}"    → ${data.nav?.links?.home?.href}
About : "${data.nav?.links?.about?.text}"   → ${data.nav?.links?.about?.href}
Dishes: "${data.nav?.links?.dishes?.text}"  → ${data.nav?.links?.dishes?.href}
Order : "${data.nav?.links?.order?.text}"   → ${data.nav?.links?.order?.href}
Contact:"${data.nav?.links?.contact?.text}" → ${data.nav?.links?.contact?.href}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title Color  : ${data.hero?.colors?.titleColor}
Desc Color   : ${data.hero?.colors?.descColor}
Btn Bg       : ${data.hero?.colors?.btnBg}
Overlay RGB  : ${data.hero?.colors?.overlayRgb}
Overlay Opacity: ${data.hero?.colors?.overlayOpacity}
${heroLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ABOUT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title        : ${data.about?.title}
Subtitle     : ${data.about?.subtitle}
Heading      : ${data.about?.heading}
Text         : ${data.about?.text}
Point 1      : ${data.about?.points?.[1]}
Point 2      : ${data.about?.points?.[2]}
Point 3      : ${data.about?.points?.[3]}
Point 4      : ${data.about?.points?.[4]}
Bg Color     : ${data.about?.colors?.bg}
Title Color  : ${data.about?.colors?.titleColor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${statLines}
Section Bg   : ${data.stats?.colors?.bg}
Icon Color   : ${data.stats?.colors?.iconColor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DISHES (${DISH_COUNT} cards)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Section Title: ${data.dishes?.title}
${dishLines}
Section Bg   : ${data.dishes?.colors?.bg}
Border Color : ${data.dishes?.colors?.borderColor}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ORDER SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title        : ${data.order?.title}
WhatsApp Link: ${data.order?.whatsapp?.href}
Call Link    : ${data.order?.call?.href}
Dish Options : ${data.order?.dishOptions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTACT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title        : ${data.contact?.title}
Address      : ${data.contact?.address?.text}
Phone        : ${data.contact?.phone?.text}
Hours        : ${data.contact?.hours?.text}
Map Embed    : ${data.contact?.mapSrc}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Logo Text    : ${data.footer?.logoText}
Description  : ${data.footer?.text}
Copyright    : ${data.footer?.copyright}
Facebook     : ${data.footer?.socials?.facebook}
TikTok       : ${data.footer?.socials?.tiktok}
YouTube      : ${data.footer?.socials?.youtube}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FLOATING BUTTONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp Href: ${data.floatingBtns?.whatsapp?.href}
Call Href    : ${data.floatingBtns?.call?.href}

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
      subject:    `New Yomyom Customization — Session: ${sessionId}`,
      message:    body,
      session_id: sessionId,
    },
    EMAILJS_KEY
  );
}

/* ============================================================
   UNLOCK & SET WHATSAPP CONTACT BUTTON
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
  localStorage.setItem("yomyom_draft", JSON.stringify(data));
  showSaveStatus("Changes Saved!", "#22c55e");
}

/* ============================================================
   LOAD PREVIOUS BUTTON — restores from localStorage
   ============================================================ */
function loadDraft() {
  const raw = localStorage.getItem("yomyom_draft");
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
  localStorage.removeItem("yomyom_draft");
  showSaveStatus("Resetting…", "#ef4444");
  setTimeout(() => location.reload(), 600);
}

/* ============================================================
   SUBMIT BUTTON — full flow:
   1. Upload images  → Supabase Storage
   2. Save image URLs → customization_images table
   3. Save all data  → customizations table
   4. Send summary   → EmailJS
   5. Unlock WhatsApp contact button
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

    localStorage.setItem("yomyom_draft", JSON.stringify(data));

    activateWhatsApp(sessionId);

    showSaveStatus(`✅ Submitted! Session ID: ${sessionId}`, "#22c55e");

  } catch (err) {
    console.error("Submit failed:", err);
    showSaveStatus("❌ Submission failed, try again.", "#ef4444");
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
   BIND BUTTONS ON DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("saveBtn")
    ?.addEventListener("click", saveDraft);

  document.getElementById("resetBtn")
    ?.addEventListener("click", clearAllData);

  document.getElementById("submitFinalBtn")
    ?.addEventListener("click", submitCustomization);

  // WhatsApp contact button locked until a successful submit
  const waBtn = document.getElementById("waContactBtn");
  if (waBtn) {
    waBtn.disabled      = true;
    waBtn.style.opacity = "0.4";
    waBtn.style.cursor  = "not-allowed";
    waBtn.title         = "Complete your submission first to unlock WhatsApp";
  }
});
