/* Stardush — mobile menu, scroll reveal, and the shared gallery behaviour */
import { initMasonry, initLightbox } from "./gallery.js";

/* ---- Mobile menu ---- */
(function () {
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (!menuBtn || !nav) return;
  var scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);
  var setMenu = function (open) {
    nav.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  scrim.addEventListener("click", function () { setMenu(false); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
})();

/* ---- Row-major masonry (shared) ---- */
initMasonry();

/* ---- Reveal on scroll ---- */
(function () {
  var reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -6% 0px" });
  reveals.forEach(function (el) { io.observe(el); });
})();

/* ---- Lightbox (PhotoSwipe, shared) ---- */
initLightbox();
