/* Stardush — mobile menu, scroll reveal, and the PhotoSwipe lightbox */
import PhotoSwipeLightbox from "./vendor/photoswipe/photoswipe-lightbox.esm.js";

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

/* ---- Row-major masonry ----
   The gallery is a CSS grid with a small row unit (grid-auto-rows: ROW). Each
   tile spans however many rows its image needs, computed from the image's
   intrinsic aspect ratio (width/height attributes → no wait for load). Grid fills
   left-to-right, top-to-bottom, so the visual order matches document order while
   keeping full, uncropped photos. DOM order is untouched, so the PhotoSwipe swipe
   sequence stays correct. */
(function () {
  var grids = document.querySelectorAll(".grid");
  if (!grids.length) return;
  var ROW = 8; // px — must match grid-auto-rows in css/style.css

  function layout() {
    grids.forEach(function (grid) {
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      grid.querySelectorAll(".tile").forEach(function (tile) {
        var img = tile.querySelector("img");
        if (!img) return;
        var iw = parseFloat(img.getAttribute("width")) || img.naturalWidth || 1;
        var ih = parseFloat(img.getAttribute("height")) || img.naturalHeight || 1;
        var h = tile.getBoundingClientRect().width * (ih / iw); // caption is absolute
        tile.style.gridRowEnd = "span " + Math.max(1, Math.ceil((h + gap) / ROW));
      });
    });
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(layout, 120); }
  layout();
  window.addEventListener("resize", schedule);
  window.addEventListener("load", layout); // re-measure once everything settles
})();

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

/* ---- Lightbox (PhotoSwipe) ---- */
(function () {
  if (!document.querySelector("main a.tile[data-pswp-width]")) return;

  var lightbox = new PhotoSwipeLightbox({
    gallery: "main",
    children: "a.tile",
    pswpModule: function () { return import("./vendor/photoswipe/photoswipe.esm.js"); },
    bgOpacity: 1,
    wheelToZoom: true,          // desktop: scroll to zoom
    secondaryZoomLevel: 2.5,    // double-tap / click zoom level
    maxZoomLevel: 6,            // allow deep pinch-zoom into the brushwork
    zoom: true,
  });

  // Hide the sticky header while the lightbox is open. On mobile (seen on
  // Chrome Android) a header with backdrop-filter is promoted to its own layer
  // that paints OVER a fixed overlay regardless of z-index, so it covered the
  // top of the image and showed the burger. visibility:hidden keeps layout
  // (no reflow → the open/close zoom animation stays anchored to the thumbnail).
  var root = document.documentElement;
  lightbox.on("beforeOpen", function () { root.classList.add("pswp-open"); });
  lightbox.on("destroy", function () { root.classList.remove("pswp-open"); });

  // Wall-label caption from each tile's data-title
  lightbox.on("uiRegister", function () {
    lightbox.pswp.ui.registerElement({
      name: "caption",
      order: 9,
      isButton: false,
      appendTo: "root",
      onInit: function (el) {
        el.className = "pswp-caption";
        lightbox.pswp.on("change", function () {
          var slide = lightbox.pswp.currSlide;
          var elm = slide && slide.data ? slide.data.element : null;
          var t = elm ? elm.getAttribute("data-title") : "";
          el.innerHTML = t ? "<span>" + t + "</span>" : "";
        });
      },
    });
  });

  lightbox.init();
})();
