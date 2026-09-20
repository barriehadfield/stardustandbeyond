/* Shared gallery behaviour: row-major masonry sizing + the PhotoSwipe lightbox.
   Used by site.js (the static section pages) and person.js (the dynamic People
   detail page). Both are safe to call after content is injected. */
import PhotoSwipeLightbox from "./vendor/photoswipe/photoswipe-lightbox.esm.js";

/* ---- Row-major masonry ----
   Each .grid is a CSS grid with a small row unit (grid-auto-rows: ROW). Every
   tile spans however many rows its image needs, from the image's intrinsic
   aspect ratio (width/height attributes -> no wait for load). The grid fills
   left-to-right, top-to-bottom, so visual order matches document order while
   keeping full, uncropped photos. DOM order is untouched, so the PhotoSwipe
   swipe sequence stays correct. Re-queries the DOM on each layout so it works
   for grids injected after load. */
var ROW = 8; // px - must match grid-auto-rows in css/style.css
var wired = false;

function layout() {
  document.querySelectorAll(".grid").forEach(function (grid) {
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

export function initMasonry() {
  if (!document.querySelector(".grid")) return;
  layout();
  if (!wired) {
    wired = true;
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(layout, 120); });
    window.addEventListener("load", layout); // re-measure once everything settles
  }
}

/* ---- Lightbox (PhotoSwipe) ---- */
export function initLightbox() {
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
  // (no reflow -> the open/close zoom animation stays anchored to the thumbnail).
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
  return lightbox;
}
