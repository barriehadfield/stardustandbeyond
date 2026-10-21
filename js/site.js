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

/* ---- Updates red dot ----
   Every page carries data-updates="<latest batch date>". We remember the last
   batch a visitor has seen (localStorage, this device) and, until it matches,
   show a red dot on the Updates nav link to point them at new photographs.
   Visiting the Updates page marks the latest batch seen. */
(function () {
  var latest = document.body.getAttribute("data-updates");
  if (!latest) return;
  var KEY = "stardust-updates-seen";
  var onUpdates = document.body.getAttribute("data-page") === "updates.html";
  if (onUpdates) { try { localStorage.setItem(KEY, latest); } catch (e) {} return; }
  var seen = null;
  try { seen = localStorage.getItem(KEY); } catch (e) {}
  if (seen !== latest) {
    document.querySelectorAll('.nav a[href="updates.html"]').forEach(function (a) { a.classList.add("has-new"); });
  }
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
