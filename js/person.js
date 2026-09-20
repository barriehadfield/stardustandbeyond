/* People detail page: renders every photo featuring one person, grouped by the
   section it came from. Reads ?p=<slug>, fetches public/people.json (built by
   build-pages.mjs), and reuses the shared masonry + PhotoSwipe lightbox. */
import { initMasonry, initLightbox } from "./gallery.js";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function tile(kind, ph) {
  var base = "public/images/" + kind + "/" + ph.file;
  var title = ph.title || "";
  var alt = title ? esc(title) : "Photograph from Stardust & Beyond";
  var dataTitle = title ? ' data-title="' + esc(title) + '"' : "";
  var cap = title ? '<span class="cap">' + esc(title) + "</span>" : "";
  return '<a class="tile" href="' + base + '.jpg" data-pswp-width="' + ph.fw + '" data-pswp-height="' + ph.fh + '"' + dataTitle + ">" +
    "<picture><source srcset=\"" + base + "-thumb.webp\" type=\"image/webp\">" +
    '<img src="' + base + '-thumb.jpg" alt="' + alt + '" loading="lazy" width="' + ph.w + '" height="' + ph.h + '"></picture>' +
    cap + "</a>";
}

function render(data, slug) {
  var main = document.querySelector("main");
  var person = data.people[slug];

  if (!person) {
    document.title = "Person not found · Stardust & Beyond";
    main.innerHTML = '<div class="page-intro"><div><p class="eyebrow">People</p>' +
      "<h1>Not found</h1><p class=\"sub\">We couldn't find that person. " +
      '<a href="people.html">Back to the index</a>.</p></div></div>';
    return;
  }

  document.title = person.display + " · Stardust & Beyond";

  var html = '<div class="page-intro">' +
    '<div><p class="eyebrow"><a href="people.html">People</a></p>' +
    "<h1>" + esc(person.display) + "</h1></div>" +
    '<span class="count">' + person.count + " photos</span></div>";

  for (var i = 0; i < data.sectionOrder.length; i++) {
    var kind = data.sectionOrder[i];
    var photos = person.sections[kind];
    if (!photos || !photos.length) continue;
    html += '<section class="person-group">' +
      '<h2 class="label">' + esc(data.sectionLabels[kind]) +
      ' <span class="n">' + photos.length + "</span></h2>" +
      '<div class="grid">' + photos.map(function (ph) { return tile(kind, ph); }).join("") + "</div>" +
      "</section>";
  }

  main.innerHTML = html;
  initMasonry();
  initLightbox();
}

var slug = new URLSearchParams(location.search).get("p") || "";
fetch("public/people.json")
  .then(function (r) { return r.json(); })
  .then(function (data) { render(data, slug); })
  .catch(function () {
    document.querySelector("main").innerHTML =
      '<div class="page-intro"><div><h1>Couldn\'t load</h1>' +
      '<p class="sub">Please try again. <a href="people.html">Back to the index</a>.</p></div></div>';
  });
