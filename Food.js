/* ==========================
MOBILE MENU
========================== */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

menuBtn.addEventListener("click", () => {
nav.classList.toggle("active");
});

/* ==========================
CLOSE MENU AFTER CLICK
========================== */

document.querySelectorAll(".nav a").forEach(link => {

link.addEventListener("click", () => {

nav.classList.remove("active");

});

});

/* ==========================
HERO SLIDER
========================== */

const slides =
document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index){

slides.forEach(slide => {

slide.classList.remove("active");

});

slides[index].classList.add("active");

}

function nextSlide(){

currentSlide++;

if(currentSlide >= slides.length){

currentSlide = 0;

}

showSlide(currentSlide);

}

setInterval(nextSlide, 5000);

/* ==========================
WHATSAPP ORDER
========================== */

const whatsappBtn =
document.getElementById("whatsapp-btn");

if(whatsappBtn){

whatsappBtn.addEventListener("click",(e)=>{

e.preventDefault();

const dish =
document.getElementById("dish-select").value;

const qty =
document.getElementById("dish-qty").value;

const phone =
"233000000000";

const message =
`Hello Yomyom Fast Foods,%0A%0AI would like to order:%0A%0A🍽 Dish: ${dish}%0A📦 Quantity: ${qty}%0A`;

window.open(
`https://wa.me/${phone}?text=${message}`,
"_blank"
);

});

}

/* ==========================
BACK TO TOP
========================== */

const backToTop =
document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

if(window.scrollY > 500){

backToTop.style.opacity = "1";
backToTop.style.visibility = "visible";

}else{

backToTop.style.opacity = "0";
backToTop.style.visibility = "hidden";

}

});

backToTop.addEventListener("click",()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

});

/* ==========================
ACTIVE NAV LINK
========================== */

const sections =
document.querySelectorAll("section");

const navLinks =
document.querySelectorAll(".nav a");

window.addEventListener("scroll",()=>{

let current = "";

sections.forEach(section=>{

const sectionTop =
section.offsetTop - 150;

const sectionHeight =
section.clientHeight;

if(window.scrollY >= sectionTop){

current = section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active-link");

if(
link.getAttribute("href")
=== `#${current}`
){

link.classList.add("active-link");

}

});

});

/* ==========================
SCROLL ANIMATION
========================== */

const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:.15
});

document.querySelectorAll(
".dish-card,.stat-card,.contact-item,.about-gallery img"
).forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});

/* ==========================
HEADER SCROLL EFFECT
========================== */

const header =
document.querySelector(".header");

window.addEventListener("scroll",()=>{

if(window.scrollY > 50){

header.style.background =
"rgba(255,255,255,.98)";

header.style.boxShadow =
"0 10px 30px rgba(0,0,0,.08)";

}else{

header.style.background =
"rgba(255,255,255,.95)";

header.style.boxShadow =
"0 10px 30px rgba(0,0,0,.04)";

}

});

/* ==========================
AUTO YEAR
========================== */

const copyright =
document.getElementById("copyright");

if(copyright){

copyright.innerHTML =
`© ${new Date().getFullYear()} Yomyom Fast Foods. All Rights Reserved.`;

}