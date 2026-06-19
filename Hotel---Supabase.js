/* ============================================================
   hostel-supabase.js  —  v1
   Yomyom Hostel · Supabase + EmailJS Integration
   Requires: @supabase/supabase-js CDN · EmailJS CDN
   Load AFTER hostel-editor.js
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

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "yomyom_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function _txt(id)  { return (document.getElementById(id)?.textContent || "").trim(); }
function _href(id) { return document.getElementById(id)?.getAttribute("href") || ""; }
function _src(id)  { return document.getElementById(id)?.getAttribute("src")  || ""; }
function _css(v)   { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

function collectAllData() {
  const navbar = {
    bg: _css("--navbar-bg"), linkColor: _css("--nav-link-color"),
    linkHover: _css("--nav-link-hover-color"),
    logo1Text: _txt("logo-text-1"), logo1Color: _css("--logo-text1-color"),
    logo2Text: _txt("logo-text-2"), logo2Color: _css("--logo-text2-color"),
    logoHref: _href("logo-link"),
    bookBtnText: _txt("book-now-btn"), bookBtnHref: _href("book-now-btn"),
    bookBtnBg: _css("--book-btn-bg"), bookBtnColor: _css("--book-btn-color"),
    links: [
      { text: _txt("nav-home"),      href: _href("nav-home")      },
      { text: _txt("nav-about"),     href: _href("nav-about")     },
      { text: _txt("nav-rooms"),     href: _href("nav-rooms")     },
      { text: _txt("nav-amenities"), href: _href("nav-amenities") },
      { text: _txt("nav-booking"),   href: _href("nav-booking")   },
      { text: _txt("nav-gallery"),   href: _href("nav-gallery")   },
      { text: _txt("nav-contact"),   href: _href("nav-contact")   },
    ],
  };

  const hero = {
    videoSrc: _src("hero-video"), overlayGradient: _css("--hero-overlay-gradient"),
    titleText: _txt("hero-title"), titleColor: _css("--hero-title-color"),
    descText: _txt("hero-description"), descColor: _css("--hero-desc-color"),
    bookBtnText: _txt("hero-book-btn"), bookBtnHref: _href("hero-book-btn"),
    bookBtnBg: _css("--hero-book-btn-bg"), bookBtnColor: _css("--hero-book-btn-color"),
    roomBtnText: _txt("hero-room-btn"), roomBtnHref: _href("hero-room-btn"),
    roomBtnColor: _css("--hero-room-btn-color"),
  };

  const about = {
    bg: _css("--about-bg"), tagText: _txt("about-tag"),
    tagBg: _css("--about-tag-bg"), tagColor: _css("--about-tag-color"),
    titleText: _txt("about-title"), titleColor: _css("--about-title-color"),
    descText: _txt("about-description"), descColor: _css("--about-desc-color"),
    videoSrc: _src("about-video"),
    roomBtnText: _txt("about-room-btn"), roomBtnHref: _href("about-room-btn"),
    roomBtnBg: _css("--about-room-btn-bg"), roomBtnColor: _css("--about-room-btn-color"),
    bookBtnText: _txt("about-book-btn"), bookBtnHref: _href("about-book-btn"),
    bookBtnBg: _css("--about-book-btn-bg"), bookBtnColor: _css("--about-book-btn-color"),
    featureCardBg: _css("--feature-card-bg"), featureIconColor: _css("--feature-icon-color"),
    features: [1,2,3,4].map(n => ({ title: _txt("feature-title-"+n), desc: _txt("feature-desc-"+n) })),
  };

  const rooms = {
    bg: _css("--rooms-bg"), tagText: _txt("rooms-tag"),
    tagBg: _css("--rooms-tag-bg"), tagColor: _css("--rooms-tag-color"),
    titleText: _txt("rooms-title"), titleColor: _css("--rooms-title-color"),
    descText: _txt("rooms-description"), descColor: _css("--rooms-desc-color"),
    cardBg: _css("--room-card-bg"), roomTitleColor: _css("--room-title-color"),
    roomDescColor: _css("--room-desc-color"), priceColor: _css("--room-price-color"),
    badgeBg: _css("--room-badge-bg"), badgeColor: _css("--room-badge-color"),
    btnBg: _css("--room-btn-bg"), btnColor: _css("--room-btn-color"),
    cards: [1,2,3].map(n => ({
      imageSrc: _src("room-image-"+n), badgeText: _txt("room-badge-"+n),
      titleText: _txt("room-title-"+n), descText: _txt("room-desc-"+n),
      priceText: _txt("room-price-"+n), btnText: _txt("room-btn-"+n), btnHref: _href("room-btn-"+n),
    })),
  };

  const amenityCards = document.querySelectorAll(".amenity-card");
  const amenities = {
    bg: _css("--amenities-bg"), tagText: _txt("amenities-tag"),
    tagBg: _css("--amenities-tag-bg"), tagColor: _css("--amenities-tag-color"),
    titleText: _txt("amenities-title"), titleColor: _css("--amenities-title-color"),
    descText: _txt("amenities-description"), descColor: _css("--amenities-desc-color"),
    cardBg: _css("--amenity-card-bg"), iconWrapBg: _css("--amenity-icon-wrap-bg"),
    iconColor: _css("--amenity-icon-color"),
    cards: Array.from(amenityCards).map(c => ({
      title: (c.querySelector("h3")?.textContent||"").trim(),
      desc:  (c.querySelector("p")?.textContent ||"").trim(),
    })),
  };

  const booking = {
    bg: _css("--booking-bg"), tagText: _txt("booking-tag"),
    tagBg: _css("--booking-tag-bg"), tagColor: _css("--booking-tag-color"),
    titleText: _txt("booking-title"), titleColor: _css("--booking-title-color"),
    descText: _txt("booking-description"), descColor: _css("--booking-desc-color"),
    formBg: _css("--booking-form-bg"), inputBg: _css("--booking-input-bg"),
    labelColor: _css("--booking-label-color"),
    submitText: _txt("booking-submit-btn"), submitBg: _css("--booking-submit-bg"),
    submitColor: _css("--booking-submit-color"),
    waHref: _href("booking-whatsapp-btn"), waBg: _css("--booking-wa-bg"),
    callHref: _href("booking-call-btn"), callBg: _css("--booking-call-bg"),
    noticeText: _txt("booking-notice-text"), noticeBg: _css("--booking-notice-bg"),
  };

  const testCards = document.querySelectorAll(".testimonial-card");
  const testimonials = {
    bg: _css("--testimonials-bg"), tagText: _txt("testimonials-tag"),
    titleText: _txt("testimonials-title"), descText: _txt("testimonials-description"),
    cardBg: _css("--testimonial-card-bg"), textColor: _css("--testimonial-text-color"),
    nameColor: _css("--testimonial-name-color"), starColor: _css("--testimonial-star-color"),
    cards: Array.from(testCards).map(c => ({
      imageSrc: c.querySelector("img")?.getAttribute("src")||"",
      review: (c.querySelector("p")?.textContent   ||"").trim(),
      name:   (c.querySelector("h4")?.textContent  ||"").trim(),
      room:   (c.querySelector("span")?.textContent||"").trim(),
    })),
  };

  const gallery = {
    bg: _css("--gallery-bg"), tagText: _txt("gallery-tag"),
    titleText: _txt("gallery-title"), descText: _txt("gallery-description"),
    videoSrc: _src("gallery-video"),
    videoCaptionTitle: _txt("gallery-video-title"), videoCaptionText: _txt("gallery-video-text"),
    images: [1,2,3,4,5,6,7,8].map(n => ({ src: _src("gallery-image-"+n) })),
  };

  const contact = {
    bg: _css("--contact-bg"), tagText: _txt("contact-tag"),
    titleText: _txt("contact-title"), descText: _txt("contact-description"),
    inputBg: _css("--contact-input-bg"), btnBg: _css("--contact-btn-bg"),
    btnColor: _css("--contact-btn-color"), btnText: _txt("contact-button"),
    addressText: _txt("contact-address-text"), phoneText: _txt("contact-phone-text"),
    emailText: _txt("contact-email-text"),
    mapSrc: document.getElementById("contact-map")?.getAttribute("src")||"",
  };

  const footerLinks = document.querySelectorAll("#footer-links a");
  const footer = {
    bg: _css("--footer-bg"), logoText: _txt("footer-logo-text"),
    logoColor: _css("--footer-logo-color"), descText: _txt("footer-description"),
    descColor: _css("--footer-desc-color"), headingColor: _css("--footer-heading-color"),
    linkColor: _css("--footer-link-color"), contactColor: _css("--footer-contact-color"),
    socialIconColor: _css("--social-icon-color"), bottomBg: _css("--footer-bottom-bg"),
    copyrightColor: _css("--footer-copyright-color"), copyrightText: _txt("footer-copyright"),
    linksTitle: _txt("footer-links-title"), contactTitle: _txt("footer-contact-title"),
    socialTitle: _txt("footer-social-title"), phoneText: _txt("footer-footer-phone"),
    emailText: _txt("footer-footer-email"), addressText: _txt("footer-footer-address"),
    links: Array.from(footerLinks).map(a => ({ text: a.textContent.trim(), href: a.getAttribute("href")||"" })),
    socialHrefs: ["footer-social-fb","footer-social-ig","footer-social-tt","footer-social-x"].map(id => _href(id)),
  };

  return { navbar, hero, about, rooms, amenities, booking, testimonials, gallery, contact, footer };
}

function saveDraft() {
  try {
    localStorage.setItem("yomyom_draft", JSON.stringify(collectAllData()));
    showStatus("Changes saved ✓", "#22c55e");
  } catch (e) {
    showStatus("Save failed.", "#ef4444");
    console.error("saveDraft:", e);
  }
}

function clearAllData() {
  localStorage.removeItem("yomyom_draft");
  showStatus("Resetting…", "#ef4444");
  setTimeout(() => location.reload(), 600);
}

async function uploadFile(file, key, sessionId) {
  if (!file) return null;
  const ext  = file.name.split(".").pop();
  const path = sessionId + "/" + key + "." + ext;
  const { data, error } = await _supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
  if (error) { console.error("Upload failed ["+key+"]:", error.message); return null; }
  return _supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
}

async function uploadAllMedia(sessionId) {
  const urls = {};
  function fi(snippet) { return document.querySelector('input[type="file"][onchange*="'+snippet+'"]'); }

  for (const [key, input] of Object.entries({
    "hero-video":    fi("uploadVideo('hero-video'"),
    "about-video":   fi("uploadVideo('about-video'"),
    "gallery-video": fi("uploadVideo('gallery-video'"),
  })) {
    if (input?.files?.[0]) { const u = await uploadFile(input.files[0], key, sessionId); if (u) urls[key]=u; }
  }

  for (let n=1; n<=3; n++) {
    const key="room-image-"+n, input=fi("uploadImg('"+key+"'");
    if (input?.files?.[0]) { const u=await uploadFile(input.files[0],key,sessionId); if(u) urls[key]=u; }
  }

  for (let n=1; n<=8; n++) {
    const key="gallery-image-"+n, input=fi("uploadImg('"+key+"'");
    if (input?.files?.[0]) { const u=await uploadFile(input.files[0],key,sessionId); if(u) urls[key]=u; }
  }

  const testInputs = document.querySelectorAll('input[type="file"][onchange*="setTestimonialImg"]');
  for (let i=0; i<testInputs.length; i++) {
    if (testInputs[i]?.files?.[0]) {
      const u=await uploadFile(testInputs[i].files[0],"testimonial-"+i,sessionId);
      if(u) urls["testimonial-"+i]=u;
    }
  }
  return urls;
}

async function saveMediaUrls(sessionId, urls) {
  for (const [key, url] of Object.entries(urls)) {
    const { error } = await _supabase.from("customization_images")
      .upsert({ session_id: sessionId, image_key: key, image_url: url }, { onConflict: "session_id,image_key" });
    if (error) console.error("saveMediaUrls ["+key+"]:", error.message);
  }
}

async function saveDataToTable(sessionId, data) {
  const { error } = await _supabase.from("customizations")
    .upsert({ session_id: sessionId, data: data }, { onConflict: "session_id" });
  if (error) throw new Error("Supabase save failed: " + error.message);
}

function buildEmailBody(sessionId, data, mediaUrls) {
  function sec(title, lines) { return "\n━━━ "+title+" ━━━\n"+lines.join("\n"); }
  const n=data.navbar, h=data.hero, ab=data.about, rm=data.rooms;
  const am=data.amenities, bk=data.booking, tc=data.testimonials;
  const gl=data.gallery, ct=data.contact, ft=data.footer;

  return [
    "╔═══════════════════════════════════════╗",
    "   NEW CUSTOMIZATION — YOMYOM HOSTEL",
    "╚═══════════════════════════════════════╝",
    "", "Session ID : "+sessionId, "Submitted  : "+new Date().toLocaleString(), "",
    sec("NAVBAR", [
      "Background : "+n.bg, "Logo       : "+n.logo1Text+" "+n.logo2Text,
      "Book Btn   : "+n.bookBtnText+" → "+n.bookBtnHref,
      ...n.links.map((l,i)=>"Link "+(i+1)+"      : "+l.text+" → "+l.href),
    ]),
    sec("HERO", [
      "Title      : "+h.titleText, "Desc       : "+h.descText,
      "Book Btn   : "+h.bookBtnText+" → "+h.bookBtnHref,
      "Room Btn   : "+h.roomBtnText+" → "+h.roomBtnHref,
      "Overlay    : "+h.overlayGradient,
    ]),
    sec("ABOUT", [
      "Title      : "+ab.titleText, "Desc       : "+ab.descText, "Bg         : "+ab.bg,
      ...ab.features.map((f,i)=>"Feature "+(i+1)+"  : "+f.title+" — "+f.desc),
    ]),
    sec("ROOMS", rm.cards.map((c,i)=>"Card "+(i+1)+"     : "+c.titleText+" | "+c.priceText+" | badge: "+c.badgeText)),
    sec("AMENITIES", am.cards.map((c,i)=>"Card "+(i+1)+"     : "+c.title+" — "+c.desc)),
    sec("BOOKING", [
      "Title      : "+bk.titleText, "WhatsApp   : "+bk.waHref,
      "Call       : "+bk.callHref,  "Notice     : "+bk.noticeText,
    ]),
    sec("TESTIMONIALS", tc.cards.map((c,i)=>"Review "+(i+1)+"   : "+c.name+" ("+c.room+") — "+c.review)),
    sec("GALLERY", [
      "Caption    : "+gl.videoCaptionTitle, "Text       : "+gl.videoCaptionText,
      ...gl.images.map((img,i)=>"Image "+(i+1)+"    : "+(img.src?img.src.substring(0,60)+"…":"(none)")),
    ]),
    sec("CONTACT", [
      "Address    : "+ct.addressText, "Phone      : "+ct.phoneText,
      "Email      : "+ct.emailText,   "Map        : "+ct.mapSrc,
    ]),
    sec("FOOTER", [
      "Logo       : "+ft.logoText, "Phone      : "+ft.phoneText,
      "Email      : "+ft.emailText, "Copyright  : "+ft.copyrightText,
    ]),
    sec("UPLOADED FILES", Object.keys(mediaUrls).length
      ? Object.entries(mediaUrls).map(([k,v])=>"  "+k+": "+v)
      : ["  (no new files uploaded)"]),
  ].join("\n");
}

async function sendEmail(sessionId, data, mediaUrls) {
  await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
    to_email:   ADMIN_EMAIL,
    subject:    "Yomyom Hostel — New Customization | " + sessionId,
    message:    buildEmailBody(sessionId, data, mediaUrls),
    session_id: sessionId,
  }, EMAILJS_KEY);
}

function activateWhatsApp(sessionId) {
  const msg = "Hello! I've finished customising the Yomyom Hostel website.\nMy session ID is: " + sessionId;
  const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  const btn = document.getElementById("waContactBtn");
  if (!btn) return;
  btn.disabled=false; btn.style.opacity="1"; btn.style.cursor="pointer";
  btn.title="Send your session ID via WhatsApp";
  btn.onclick = () => window.open(url, "_blank");
}

async function submitCustomization() {
  const submitBtn = document.getElementById("submitFinalBtn");
  if (submitBtn) submitBtn.disabled = true;
  try {
    showStatus("Uploading media…", "#d4af37");
    const sessionId = getSessionId();
    const data      = collectAllData();
    const mediaUrls = await uploadAllMedia(sessionId);

    showStatus("Saving media URLs…", "#d4af37");
    await saveMediaUrls(sessionId, mediaUrls);

    showStatus("Saving customization data…", "#d4af37");
    await saveDataToTable(sessionId, data);

    showStatus("Sending email…", "#d4af37");
    await sendEmail(sessionId, data, mediaUrls);

    localStorage.setItem("yomyom_draft", JSON.stringify(data));
    activateWhatsApp(sessionId);
    showStatus("Submitted! Session: " + sessionId, "#22c55e");
  } catch (err) {
    console.error("submitCustomization:", err);
    showStatus("Submission failed. Please try again.", "#ef4444");
    if (submitBtn) submitBtn.disabled = false;
  }
}

function showStatus(message, color) {
  const el = document.getElementById("saveStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = color || "#ffffff";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("saveBtn")?.addEventListener("click", saveDraft);
  document.getElementById("resetBtn")?.addEventListener("click", clearAllData);
  document.getElementById("submitFinalBtn")?.addEventListener("click", submitCustomization);

  const waBtn = document.getElementById("waContactBtn");
  if (waBtn) {
    waBtn.disabled=true; waBtn.style.opacity="0.4";
    waBtn.style.cursor="not-allowed";
    waBtn.title="Please submit your changes first";
  }
});
