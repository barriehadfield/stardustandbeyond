/* Search page: filters public/search.json (captioned photos + people) in the
   browser. People matches link to their pages; photo matches render as a gallery
   with the shared masonry + PhotoSwipe lightbox. */
import { initMasonry, initLightbox } from "./gallery.js";

var DATA = null, MAXP = 150;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function hilite(text, q) {
  var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
  return esc(text).replace(re, "<mark>$1</mark>");
}
function tile(p, q) {
  var base = "public/images/" + p.k + "/" + p.f;
  return '<figure class="tile"><a class="shot" href="' + base + '.jpg" data-pswp-width="' + p.fw + '" data-pswp-height="' + p.fh + '" data-title="' + esc(p.c) + '">' +
    "<picture><source srcset=\"" + base + "-thumb.webp\" type=\"image/webp\">" +
    '<img src="' + base + '-thumb.jpg" alt="' + esc(p.c) + '" loading="lazy" width="' + p.w + '" height="' + p.h + '"></picture>' +
    "</a><figcaption class=\"cap\">" + hilite(p.c, q) + "</figcaption></figure>";
}

var peopleBox = document.getElementById("people-results");
var photoBox = document.getElementById("photo-results");
var cnt = document.getElementById("rcount");
var input = document.getElementById("q");

function run(q) {
  q = (q || "").trim();
  if (!DATA) return;
  if (q.length < 2) {
    peopleBox.innerHTML = ""; photoBox.innerHTML = "";
    cnt.textContent = "Type a name, place or occasion, or pick a suggestion.";
    return;
  }
  var ql = q.toLowerCase();
  var people = DATA.people.filter(function (p) { return p.display.toLowerCase().indexOf(ql) > -1; })
    .sort(function (a, b) { return b.count - a.count; }).slice(0, 30);
  var photos = DATA.photos.filter(function (p) { return p.c.toLowerCase().indexOf(ql) > -1; });

  peopleBox.innerHTML = people.length
    ? '<p class="sr-label">People <span class="n">' + people.length + "</span></p><div class=\"people-chips\">" +
      people.map(function (p) {
        return '<a href="person.html?p=' + encodeURIComponent(p.slug) + '">' + hilite(p.display, q) + '<span class="c">' + p.count + "</span></a>";
      }).join("") + "</div>"
    : "";

  var shown = photos.slice(0, MAXP);
  photoBox.innerHTML = photos.length
    ? '<p class="sr-label">Photographs <span class="n">' + photos.length + "</span></p><div class=\"grid\">" +
      shown.map(function (p) { return tile(p, q); }).join("") + "</div>" +
      (photos.length > MAXP ? '<p class="rcount">Showing the first ' + MAXP + ". Refine your search to see the rest.</p>" : "")
    : "";

  cnt.textContent = people.length || photos.length
    ? people.length + " people · " + photos.length + " photographs"
    : "No matches for “" + q + "”.";

  initMasonry();
  initLightbox();
}

var t;
input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { run(input.value); setHash(input.value); }, 160); });
[].slice.call(document.querySelectorAll("#suggest button")).forEach(function (b) {
  b.onclick = function () { input.value = b.dataset.q; run(input.value); setHash(input.value); input.focus(); };
});
function setHash(v) { try { history.replaceState(null, "", v ? "#q=" + encodeURIComponent(v) : "search.html"); } catch (e) {} }

fetch("public/search.json")
  .then(function (r) { return r.json(); })
  .then(function (data) {
    DATA = data;
    var m = /[#&]q=([^&]+)/.exec(location.hash);
    if (m) { input.value = decodeURIComponent(m[1].replace(/\+/g, " ")); }
    run(input.value);
    input.focus();
  })
  .catch(function () { cnt.textContent = "Couldn’t load the search index. Please try again."; });
