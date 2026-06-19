/* ============================================================
   SUPABASE + EMAILJS INTEGRATION
   Personal Portfolio — Website Editor
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
const SESSION_KEY      = "portfolio_session_id";

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
   Handles heroImage and any future file inputs tagged
   with [data-image-key].
   ============================================================ */
async function uploadAllImages(sessionId) {
  const imageUrls = {};

  // Named image inputs in this template
  const named = {
    heroImage: document.querySelector('input[type="file"][onchange="uploadHeroImage(event)"]'),
    cvFile:    document.querySelector('input[type="file"][onchange="uploadCVFile(event)"]'),
  };

  for (const [key, input] of Object.entries(named)) {
    if (input && input.files && input.files[0]) {
      const url = await uploadImage(input.files[0], key, sessionId);
      if (url) imageUrls[key] = url;
    }
  }

  // Any extra inputs tagged with data-image-key="someKey"
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
   COLLECT ALL EDITOR STATE FROM THE DOM
   Maps every editable element in the Personal Portfolio template.
   ============================================================ */
function collectAllData() {
  const getText  = (id)      => document.getElementById(id)?.innerText?.trim() || "";
  const getStyle = (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const getInline = (id, prop) => document.getElementById(id)?.style?.[prop] || "";

  // Nav links
  const navHome     = getText("navHome");
  const navAbout    = getText("navAbout");
  const navServices = getText("navServices");
  const navWork     = getText("navWork");
  const navContact  = getText("navContact");

  // Services 1–3
  const services = {};
  for (let i = 1; i <= 3; i++) {
    services[i] = {
      title: getText(`serviceTitle${i}`),
      text:  getText(`serviceText${i}`),
    };
  }

  // Projects 1–2
  const projects = {};
  for (let i = 1; i <= 2; i++) {
    projects[i] = {
      title: getText(`projectTitle${i}`),
      text:  getText(`projectText${i}`),
    };
  }

  // About overlay icons/labels
  const aboutBoxes = {};
  for (let i = 1; i <= 3; i++) {
    aboutBoxes[i] = {
      icon:  document.getElementById(`aboutIcon${i}`)?.className || document.getElementById(`aboutIcon${i}`)?.textContent || "",
      label: getText(`aboutLabel${i}`),
    };
  }

  // Footer socials
  const footerSocials = {};
  for (let i = 1; i <= 3; i++) {
    footerSocials[i] = {
      href: document.getElementById(`footerSocial${i}`)?.href || "",
      icon: document.getElementById(`footerIcon${i}`)?.className || "",
    };
  }

  // Computed / inline CSS for key sections
  const nav             = document.querySelector("nav");
  const heroSection     = document.getElementById("heroSection");
  const aboutSection    = document.getElementById("aboutSection");
  const servicesSection = document.getElementById("servicesSection");
  const workSection     = document.getElementById("workSection");
  const contactSection  = document.getElementById("contactSection");
  const footerSection   = document.getElementById("footerSection");
  const heroButton      = document.getElementById("heroButton");

  return {
    // NAVBAR
    navBg:        nav?.style?.backgroundColor  || getStyle("--nav-bg"),
    navTextColor: (document.querySelector("nav a") || {}).style?.color || getStyle("--nav-link-color"),
    navHoverColor: (() => {
      const style = document.getElementById("nav-hover-style");
      const match = style?.innerHTML?.match(/color:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : getStyle("--nav-link-hover");
    })(),
    navHome,
    navAbout,
    navServices,
    navWork,
    navContact,

    // HERO
    heroBg:             heroSection?.style?.background || getStyle("--hero-bg"),
    heroTitle:          getText("heroTitle"),
    heroTitleColor:     document.getElementById("heroTitle")?.style?.color || getStyle("--hero-title-color"),
    heroDescription:    getText("heroDescription"),
    heroDescColor:      document.getElementById("heroDescription")?.style?.color || getStyle("--hero-description-color"),
    heroButtonText:     heroButton?.textContent?.trim() || "",
    heroButtonHref:     heroButton?.getAttribute("href") || "",
    heroButtonBg:       heroButton?.style?.background   || getStyle("--button-bg"),
    heroButtonColor:    heroButton?.style?.color        || getStyle("--button-color"),
    heroButtonHoverBg:  (() => {
      const style = document.getElementById("hero-hover");
      const match = style?.innerHTML?.match(/background:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : getStyle("--button-hover-bg");
    })(),
    heroButtonHoverText: (() => {
      const style = document.getElementById("hero-hover");
      const match = style?.innerHTML?.match(/color:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : "#ffffff";
    })(),
    heroImageSrc: document.getElementById("heroImage")?.src || "",

    // ABOUT
    aboutBg:          aboutSection?.style?.background || getStyle("--about-bg"),
    aboutTitle:       getText("aboutTitle"),
    aboutTitleColor:  document.getElementById("aboutTitle")?.style?.color || getStyle("--about-title-color"),
    aboutDescription: getText("aboutDescription"),
    aboutDescColor:   document.getElementById("aboutDescription")?.style?.color || getStyle("--about-text-color"),
    aboutBoxBg:       (() => {
      const first = document.querySelector(".overlay-item");
      return first?.style?.background || getStyle("--about-card-bg");
    })(),
    aboutBoxTextColor: (() => {
      const first = document.querySelector(".overlay-item p");
      return first?.style?.color || "#555555";
    })(),
    aboutIconColor: (() => {
      const first = document.querySelector(".overlay-item i");
      return first?.style?.color || getStyle("--about-icon-color");
    })(),
    aboutBoxes,

    // SERVICES
    servicesBg:           servicesSection?.style?.background   || getStyle("--services-bg"),
    servicesTitle:        getText("servicesTitle"),
    servicesTitleColor:   document.getElementById("servicesTitle")?.style?.color || getStyle("--services-title-color"),
    servicesCardBg:       (() => {
      const first = document.querySelector(".service-item");
      return first?.style?.background || getStyle("--services-card-bg");
    })(),
    servicesCardTitleColor: (() => {
      const first = document.querySelector(".service-item h3");
      return first?.style?.color || getStyle("--services-card-title-color");
    })(),
    servicesCardTextColor: (() => {
      const first = document.querySelector(".service-item p");
      return first?.style?.color || "#333333";
    })(),
    services,

    // WORK / PORTFOLIO
    workBg:           workSection?.style?.background   || getStyle("--work-bg"),
    workTitle:        getText("workTitle"),
    workTitleColor:   document.getElementById("workTitle")?.style?.color || getStyle("--work-title-color"),
    workCardBg:       (() => {
      const first = document.querySelector(".work-card");
      return first?.style?.background || getStyle("--work-card-bg");
    })(),
    workCardTitleColor: (() => {
      const first = document.querySelector(".work-card h3");
      return first?.style?.color || getStyle("--work-card-title-color");
    })(),
    workCardTextColor: (() => {
      const first = document.querySelector(".work-card p");
      return first?.style?.color || "#333333";
    })(),
    cvTitle:          getText("cvTitle"),
    cvDownloadHref:   document.getElementById("cvDownloadLink")?.getAttribute("href") || "",
    cvDownloadText:   document.getElementById("cvDownloadLink")?.textContent?.trim() || "",
    projects,

    // CONTACT
    contactBg:          contactSection?.style?.background   || getStyle("--contact-bg"),
    contactTitleColor:  document.getElementById("contactTitle")?.style?.color || getStyle("--contact-title-color"),
    contactTitle:       getText("contactTitle"),
    contactDescription: getText("contactDescription"),
    contactDescColor:   document.getElementById("contactDescription")?.style?.color || "#555555",
    contactEmailText:   getText("contactEmailText"),
    contactEmailHref:   document.getElementById("contactEmailLink")?.getAttribute("href") || "",
    contactWhatsappText: getText("contactWhatsappText"),
    contactWhatsappHref: document.getElementById("contactWhatsappLink")?.getAttribute("href") || "",
    contactPhoneText:   getText("contactPhoneText"),
    contactPhoneHref:   document.getElementById("contactPhoneLink")?.getAttribute("href") || "",
    contactBtnBg:       (() => {
      const first = document.querySelector(".contactbtn");
      return first?.style?.background || getStyle("--contact-btn-bg");
    })(),
    contactBtnColor:    (() => {
      const first = document.querySelector(".contactbtn");
      return first?.style?.color || getStyle("--contact-btn-color");
    })(),
    contactBtnHoverBg:  (() => {
      const style = document.getElementById("contact-btn-hover");
      const match = style?.innerHTML?.match(/background:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : getStyle("--contact-btn-hover-bg");
    })(),
    contactBtnHoverText: (() => {
      const style = document.getElementById("contact-btn-hover");
      const match = style?.innerHTML?.match(/color:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : "#ffffff";
    })(),

    // FOOTER
    footerBg:          footerSection?.style?.background || getStyle("--footer-bg"),
    footerTextColor:   footerSection?.style?.color      || getStyle("--footer-color"),
    footerIconColor:   (() => {
      const first = document.querySelector(".footer-socials i");
      return first?.style?.color || "#ffffff";
    })(),
    footerIconHoverColor: (() => {
      const style = document.getElementById("footer-hover");
      const match = style?.innerHTML?.match(/color:\s*(#[0-9a-fA-F]+)/);
      return match ? match[1] : "#d4af37";
    })(),
    footerCopyright:   getText("footerCopyright"),
    footerDescription: getText("footerDescription"),
    footerSocials,
  };
}

/* ============================================================
   APPLY ALL DATA BACK TO THE DOM
   Used by loadDraft() to restore a saved customization.
   ============================================================ */
function applyAllData(data) {
  if (!data) return;

  // ---- NAVBAR ----
  const nav = document.querySelector("nav");
  if (nav) {
    if (data.navBg)        nav.style.backgroundColor = data.navBg;
    if (data.navTextColor) {
      document.querySelectorAll("nav a").forEach(a => a.style.color = data.navTextColor);
    }
    if (data.navHoverColor) setNavHoverColor(data.navHoverColor);
  }
  if (data.navHome)     setNavText("navHome",     data.navHome);
  if (data.navAbout)    setNavText("navAbout",    data.navAbout);
  if (data.navServices) setNavText("navServices", data.navServices);
  if (data.navWork)     setNavText("navWork",     data.navWork);
  if (data.navContact)  setNavText("navContact",  data.navContact);

  // ---- HERO ----
  const heroSection = document.getElementById("heroSection");
  if (heroSection && data.heroBg) heroSection.style.background = data.heroBg;

  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    if (data.heroTitle)      heroTitle.textContent = data.heroTitle;
    if (data.heroTitleColor) heroTitle.style.color = data.heroTitleColor;
  }
  const heroDesc = document.getElementById("heroDescription");
  if (heroDesc) {
    if (data.heroDescription) heroDesc.textContent = data.heroDescription;
    if (data.heroDescColor)   heroDesc.style.color = data.heroDescColor;
  }
  const heroBtn = document.getElementById("heroButton");
  if (heroBtn) {
    if (data.heroButtonText)  heroBtn.textContent  = data.heroButtonText;
    if (data.heroButtonHref)  heroBtn.href         = data.heroButtonHref;
    if (data.heroButtonBg)    heroBtn.style.background = data.heroButtonBg;
    if (data.heroButtonColor) heroBtn.style.color  = data.heroButtonColor;
    if (data.heroButtonHoverBg || data.heroButtonHoverText) {
      setHeroButtonHover(data.heroButtonHoverBg || "#000000", data.heroButtonHoverText || "#ffffff");
    }
  }
  if (data.heroImageSrc) {
    const heroImg = document.getElementById("heroImage");
    if (heroImg) heroImg.src = data.heroImageSrc;
  }

  // ---- ABOUT ----
  const aboutSection = document.getElementById("aboutSection");
  if (aboutSection && data.aboutBg) aboutSection.style.background = data.aboutBg;

  const aboutTitleEl = document.getElementById("aboutTitle");
  if (aboutTitleEl) {
    if (data.aboutTitle)      aboutTitleEl.textContent = data.aboutTitle;
    if (data.aboutTitleColor) aboutTitleEl.style.color = data.aboutTitleColor;
  }
  const aboutDescEl = document.getElementById("aboutDescription");
  if (aboutDescEl) {
    if (data.aboutDescription) aboutDescEl.textContent = data.aboutDescription;
    if (data.aboutDescColor)   aboutDescEl.style.color = data.aboutDescColor;
  }
  if (data.aboutBoxBg)       setAboutBoxBg(data.aboutBoxBg);
  if (data.aboutBoxTextColor) setAboutBoxTextColor(data.aboutBoxTextColor);
  if (data.aboutIconColor)    setAboutIconColor(data.aboutIconColor);

  if (data.aboutBoxes) {
    for (let i = 1; i <= 3; i++) {
      const box = data.aboutBoxes[i];
      if (!box) continue;
      if (box.icon)  setAboutIcon(i, box.icon);
      const labelEl = document.getElementById(`aboutLabel${i}`);
      if (labelEl && box.label) labelEl.textContent = box.label;
    }
  }

  // ---- SERVICES ----
  const servicesSec = document.getElementById("servicesSection");
  if (servicesSec && data.servicesBg) servicesSec.style.background = data.servicesBg;

  const servicesTitleEl = document.getElementById("servicesTitle");
  if (servicesTitleEl) {
    if (data.servicesTitle)      servicesTitleEl.textContent = data.servicesTitle;
    if (data.servicesTitleColor) servicesTitleEl.style.color = data.servicesTitleColor;
  }
  if (data.servicesCardBg)        setServicesCardBg(data.servicesCardBg);
  if (data.servicesCardTitleColor) setServicesCardTitleColor(data.servicesCardTitleColor);
  if (data.servicesCardTextColor)  setServicesCardTextColor(data.servicesCardTextColor);

  if (data.services) {
    for (let i = 1; i <= 3; i++) {
      const svc = data.services[i];
      if (!svc) continue;
      if (svc.title) setServiceTitle(i, svc.title);
      if (svc.text)  setServiceText(i, svc.text);
    }
  }

  // ---- WORK / PORTFOLIO ----
  const workSec = document.getElementById("workSection");
  if (workSec && data.workBg) workSec.style.background = data.workBg;

  const workTitleEl = document.getElementById("workTitle");
  if (workTitleEl) {
    if (data.workTitle)      workTitleEl.textContent = data.workTitle;
    if (data.workTitleColor) workTitleEl.style.color = data.workTitleColor;
  }
  if (data.workCardBg)         setWorkCardBg(data.workCardBg);
  if (data.workCardTitleColor) setWorkCardTitleColor(data.workCardTitleColor);
  if (data.workCardTextColor)  setWorkCardTextColor(data.workCardTextColor);

  if (data.cvTitle) {
    const cvEl = document.getElementById("cvTitle");
    if (cvEl) cvEl.textContent = data.cvTitle;
  }
  if (data.cvDownloadHref || data.cvDownloadText) {
    const cvLink = document.getElementById("cvDownloadLink");
    if (cvLink) {
      if (data.cvDownloadHref) cvLink.href        = data.cvDownloadHref;
      if (data.cvDownloadText) cvLink.textContent = data.cvDownloadText;
    }
  }
  if (data.projects) {
    for (let i = 1; i <= 2; i++) {
      const proj = data.projects[i];
      if (!proj) continue;
      if (proj.title) setProjectTitle(i, proj.title);
      if (proj.text)  setProjectText(i, proj.text);
    }
  }

  // ---- CONTACT ----
  const contactSec = document.getElementById("contactSection");
  if (contactSec && data.contactBg) contactSec.style.background = data.contactBg;

  const contactTitleEl = document.getElementById("contactTitle");
  if (contactTitleEl) {
    if (data.contactTitle)      contactTitleEl.textContent = data.contactTitle;
    if (data.contactTitleColor) contactTitleEl.style.color = data.contactTitleColor;
  }
  const contactDescEl = document.getElementById("contactDescription");
  if (contactDescEl) {
    if (data.contactDescription) contactDescEl.textContent = data.contactDescription;
    if (data.contactDescColor)   contactDescEl.style.color = data.contactDescColor;
  }

  setContactEmailText(data.contactEmailText   || "");
  setContactEmailLink(data.contactEmailHref   || "");
  setContactWhatsappText(data.contactWhatsappText || "");
  setContactWhatsappLink(data.contactWhatsappHref || "");
  setContactPhoneText(data.contactPhoneText   || "");
  setContactPhoneLink(data.contactPhoneHref   || "");

  if (data.contactBtnBg || data.contactBtnColor || data.contactBtnHoverBg || data.contactBtnHoverText) {
    setContactButtonStyle(
      data.contactBtnBg      || "#ff6f61",
      data.contactBtnColor   || "#ffffff",
      data.contactBtnHoverBg  || "#2a3d66",
      data.contactBtnHoverText || "#ffffff"
    );
  }

  // ---- FOOTER ----
  const footerSec = document.getElementById("footerSection");
  if (footerSec) {
    if (data.footerBg)        setFooterBg(data.footerBg);
    if (data.footerTextColor) setFooterTextColor(data.footerTextColor);
  }
  if (data.footerIconColor)      setFooterIconColor(data.footerIconColor);
  if (data.footerIconHoverColor) setFooterIconHoverColor(data.footerIconHoverColor);
  if (data.footerCopyright)  setFooterCopyright(data.footerCopyright.replace(/^©\s*/, ""));
  if (data.footerDescription) setFooterDescription(data.footerDescription);

  if (data.footerSocials) {
    for (let i = 1; i <= 3; i++) {
      const social = data.footerSocials[i];
      if (!social) continue;
      if (social.href) setFooterSocial(i, social.href);
      if (social.icon) setFooterIcon(i, social.icon);
    }
  }
}

/* ============================================================
   BUILD EMAIL BODY
   ============================================================ */
function buildEmailBody(sessionId, data, imageUrls) {
  const serviceLines = Object.entries(data.services || {})
    .map(([i, s]) => `  Service ${i}: "${s.title || "—"}" | "${s.text || "—"}"`)
    .join("\n");

  const projectLines = Object.entries(data.projects || {})
    .map(([i, p]) => `  Project ${i}: "${p.title || "—"}" | "${p.text || "—"}"`)
    .join("\n");

  const aboutBoxLines = Object.entries(data.aboutBoxes || {})
    .map(([i, b]) => `  Box ${i}: Icon="${b.icon || "—"}" | Label="${b.label || "—"}"`)
    .join("\n");

  const socialLines = Object.entries(data.footerSocials || {})
    .map(([i, s]) => `  Social ${i}: href="${s.href || "—"}" | icon="${s.icon || "—"}"`)
    .join("\n");

  const imageLines = Object.keys(imageUrls).length
    ? Object.entries(imageUrls).map(([k, v]) => `  ${k}: ${v}`).join("\n")
    : "  No new images uploaded";

  return `
╔══════════════════════════════════════════╗
   NEW CUSTOMIZATION SUBMITTED
          Personal Portfolio
╚══════════════════════════════════════════╝

SESSION ID : ${sessionId}
SUBMITTED  : ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background   : ${data.navBg}
Text Color   : ${data.navTextColor}
Hover Color  : ${data.navHoverColor}
Links        : Home="${data.navHome}" | About="${data.navAbout}" | Services="${data.navServices}" | Portfolio="${data.navWork}" | Contact="${data.navContact}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.heroBg}
Title             : ${data.heroTitle}
Title Color       : ${data.heroTitleColor}
Description       : ${data.heroDescription}
Description Color : ${data.heroDescColor}
Button Text       : ${data.heroButtonText}
Button Link       : ${data.heroButtonHref}
Button Bg         : ${data.heroButtonBg}
Button Text Color : ${data.heroButtonColor}
Hover Bg          : ${data.heroButtonHoverBg}
Hover Text Color  : ${data.heroButtonHoverText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ABOUT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.aboutBg}
Title             : ${data.aboutTitle}
Title Color       : ${data.aboutTitleColor}
Description       : ${data.aboutDescription}
Description Color : ${data.aboutDescColor}
Box Background    : ${data.aboutBoxBg}
Box Text Color    : ${data.aboutBoxTextColor}
Icon Color        : ${data.aboutIconColor}

About Boxes:
${aboutBoxLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SERVICES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.servicesBg}
Title             : ${data.servicesTitle}
Title Color       : ${data.servicesTitleColor}
Card Background   : ${data.servicesCardBg}
Card Title Color  : ${data.servicesCardTitleColor}
Card Text Color   : ${data.servicesCardTextColor}

${serviceLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PORTFOLIO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.workBg}
Title             : ${data.workTitle}
Title Color       : ${data.workTitleColor}
Card Background   : ${data.workCardBg}
Card Title Color  : ${data.workCardTitleColor}
Card Text Color   : ${data.workCardTextColor}
CV Card Title     : ${data.cvTitle}
CV Download Link  : ${data.cvDownloadHref}

${projectLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CONTACT SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background        : ${data.contactBg}
Title             : ${data.contactTitle}
Title Color       : ${data.contactTitleColor}
Description       : ${data.contactDescription}
Button Bg         : ${data.contactBtnBg}
Button Text Color : ${data.contactBtnColor}
Hover Bg          : ${data.contactBtnHoverBg}
Hover Text Color  : ${data.contactBtnHoverText}
Email Text        : ${data.contactEmailText}
Email Link        : ${data.contactEmailHref}
WhatsApp Text     : ${data.contactWhatsappText}
WhatsApp Link     : ${data.contactWhatsappHref}
Phone Text        : ${data.contactPhoneText}
Phone Link        : ${data.contactPhoneHref}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background     : ${data.footerBg}
Text Color     : ${data.footerTextColor}
Icon Color     : ${data.footerIconColor}
Icon Hover     : ${data.footerIconHoverColor}
Copyright      : ${data.footerCopyright}
Description    : ${data.footerDescription}

Social Icons:
${socialLines}

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
  localStorage.setItem("portfolio_draft", JSON.stringify(data));
  showSaveStatus("Changes Saved!", "#22c55e");
}

/* ============================================================
   LOAD PREVIOUS BUTTON — reads localStorage only
   ============================================================ */
function loadDraft() {
  const raw = localStorage.getItem("portfolio_draft");
  if (!raw) {
    showSaveStatus("No saved draft found!", "#f59e0b");
    return;
  }
  const data = JSON.parse(raw);
  applyAllData(data);
  showSaveStatus("Previous customization loaded ✓", "#22c55e");
}

/* ============================================================
   RESET BUTTON — clears draft, reloads page to defaults
   ============================================================ */
function clearAllData() {
  localStorage.removeItem("portfolio_draft");
  showSaveStatus("Resetting....", "#ef4444");
  setTimeout(() => location.reload(), 600);
}

/* ============================================================
   SUBMIT BUTTON — full flow
   ============================================================ */
async function submitCustomization() {
  const submitBtn = document.getElementById("submitFinalBtn");

  // Disable button to prevent double-submit
  if (submitBtn) submitBtn.disabled = true;

  try {
    showSaveStatus("Uploading images…", "#d4af37");

    const sessionId = getSessionId();
    const data      = collectAllData();

    // 1. Upload all images to Supabase Storage
    const imageUrls = await uploadAllImages(sessionId);

    // 2. Save image rows to customization_images table
    await saveImagesToTable(sessionId, imageUrls);

    // 3. Save all text/color/settings to customizations table
    showSaveStatus("Saving customization…", "#d4af37");
    const row = await saveDataToTable(sessionId, data);

    // 4. Send admin email with full summary
    showSaveStatus("Sending email…", "#d4af37");
    await sendAdminEmail(sessionId, data, imageUrls);

    // 5. Also cache to localStorage for convenience
    localStorage.setItem("portfolio_draft", JSON.stringify(data));

    // 6. Activate WhatsApp button with session ID
    activateWhatsApp(sessionId);

    showSaveStatus(`✅ Submitted! Session ID: ${sessionId}`, "#22c55e");

  } catch (err) {
    console.error("Submit failed:", err);
    showSaveStatus("❌ Submission failed, Please try again later.", "#ef4444");
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
  document.getElementById("saveBtn")
    ?.addEventListener("click", saveDraft);

  document.getElementById("loadPrevBtn")
    ?.addEventListener("click", loadDraft);

  document.getElementById("resetBtn")
    ?.addEventListener("click", clearAllData);

  document.getElementById("submitFinalBtn")
    ?.addEventListener("click", submitCustomization);

  // WhatsApp starts locked until submit succeeds
  const waBtn = document.getElementById("waContactBtn");
  if (waBtn) {
    waBtn.disabled      = true;
    waBtn.style.opacity = "0.4";
    waBtn.style.cursor  = "not-allowed";
    waBtn.title         = "Please Submit Changes First";
  }
});
