/* People detail page: a person's photographs grouped by section, a portrait header,
   and an interactive "Seen with" constellation. Reads ?p=<slug> from public/people.json
   (built by build-pages.mjs) and reuses the shared masonry + PhotoSwipe lightbox.
   Tapping a node in the constellation travels to that person in place. */
import { initMasonry, initLightbox } from "./gallery.js";

var SVGNS = "http://www.w3.org/2000/svg";
var DATA = null, CURRENT = null;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function tile(kind, ph) {
  var base = "public/images/" + kind + "/" + ph.file;
  var title = ph.title || "";
  var alt = title ? esc(title) : "Photograph from Stardust & Beyond";
  var dataTitle = title ? ' data-title="' + esc(title) + '"' : "";
  var cap = title ? '<figcaption class="cap">' + esc(title) + "</figcaption>" : "";
  return '<figure class="tile"><a class="shot" href="' + base + '.jpg" data-pswp-width="' + ph.fw + '" data-pswp-height="' + ph.fh + '"' + dataTitle + ">" +
    "<picture><source srcset=\"" + base + "-thumb.webp\" type=\"image/webp\">" +
    '<img src="' + base + '-thumb.jpg" alt="' + alt + '" loading="lazy" width="' + ph.w + '" height="' + ph.h + '"></picture>' +
    "</a>" + cap + "</figure>";
}

function firstPhoto(person) {
  for (var i = 0; i < DATA.sectionOrder.length; i++) {
    var k = DATA.sectionOrder[i], ph = person.sections[k];
    if (ph && ph.length) return { kind: k, ph: ph[0] };
  }
  return null;
}

/* draw the constellation once its container has a measured width */
function layoutConstellation(person) {
  var stage = document.getElementById("constellation");
  if (!stage) return;
  var svg = stage.querySelector("svg");
  var W = stage.clientWidth, H = stage.clientHeight, cx = W / 2, cy = H / 2;
  [].slice.call(stage.querySelectorAll(".cnode")).forEach(function (n) { n.remove(); });
  svg.innerHTML = "";
  var links = (person.alsoWith || []).slice(0, W < 540 ? 6 : 9);
  // elliptical spread so wide names use the panel's width and don't collide
  var rx = cx - (W < 540 ? 72 : 150);
  var ry = cy - (W < 540 ? 54 : 66);
  links.forEach(function (a, i) {
    var ang = (-Math.PI / 2) + (i / links.length) * 2 * Math.PI;
    var x = cx + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry;
    var ln = document.createElementNS(SVGNS, "line");
    ln.setAttribute("x1", cx); ln.setAttribute("y1", cy); ln.setAttribute("x2", x); ln.setAttribute("y2", y);
    ln.setAttribute("stroke", "rgba(244,183,64," + Math.min(0.5, 0.12 + a.count / 60) + ")");
    ln.setAttribute("stroke-width", Math.max(1, Math.min(5, a.count / 6)));
    svg.appendChild(ln);
    var node = document.createElement("a");
    node.className = "cnode";
    node.href = "person.html?p=" + encodeURIComponent(a.slug);
    node.dataset.slug = a.slug;
    node.style.left = x + "px"; node.style.top = y + "px";
    node.innerHTML = esc(a.display) + '<span class="c">' + a.count + "</span>";
    stage.appendChild(node);
  });
  var ctr = document.createElement("div");
  ctr.className = "cnode center";
  ctr.style.left = cx + "px"; ctr.style.top = cy + "px";
  ctr.innerHTML = esc(person.display);
  stage.appendChild(ctr);

  // list anyone the star couldn't fit, as links beneath it
  var more = document.getElementById("seen-more");
  if (more) {
    var rest = (person.alsoWith || []).slice(links.length);
    more.innerHTML = rest.length
      ? '<span class="lbl">Also seen with</span> ' + rest.map(function (a) {
          return '<a class="seen-link" data-slug="' + a.slug + '" href="person.html?p=' + encodeURIComponent(a.slug) + '">' + esc(a.display) + "</a>";
        }).join(", ")
      : "";
  }
}

function render(slug) {
  var main = document.querySelector("main");
  var person = DATA.people[slug];
  CURRENT = person || null;

  if (!person) {
    document.title = "Person not found · Stardust & Beyond";
    main.innerHTML = '<div class="page-intro"><div><p class="eyebrow"><a href="people.html">People</a></p>' +
      "<h1>Not found</h1><p class=\"sub\">We couldn't find that person. <a href=\"people.html\">Back to the index</a>.</p></div></div>";
    return;
  }

  document.title = person.display + " · Stardust & Beyond";
  var fp = firstPhoto(person);
  var friends = person.alsoWith ? person.alsoWith.length : 0;

  var html = '<div class="person-head">' +
    (fp ? '<img class="portrait" src="public/images/' + fp.kind + "/" + fp.ph.file + '-thumb.jpg" alt="' + esc(person.display) + '" width="128" height="128">' : "") +
    '<div class="person-head-txt"><p class="eyebrow"><a href="people.html">People</a></p>' +
    "<h1>" + esc(person.display) + "</h1>" +
    '<p class="phead-meta">' + person.count + " photograph" + (person.count === 1 ? "" : "s") +
      (friends ? " · " + friends + " friend" + (friends === 1 ? "" : "s") + " pictured with" : "") +
    "</p></div></div>";

  for (var i = 0; i < DATA.sectionOrder.length; i++) {
    var kind = DATA.sectionOrder[i];
    var photos = person.sections[kind];
    if (!photos || !photos.length) continue;
    html += '<section class="person-group">' +
      '<h2 class="label">' + esc(DATA.sectionLabels[kind]) + ' <span class="n">' + photos.length + "</span></h2>" +
      '<div class="grid">' + photos.map(function (ph) { return tile(kind, ph); }).join("") + "</div></section>";
  }

  if (friends) {
    html += '<section class="also-seen"><h2 class="label">Seen with <span class="n">' + friends + "</span></h2>" +
      '<div class="constellation" id="constellation"><svg aria-hidden="true"></svg><span class="hint">tap a name to travel</span></div>' +
      '<p class="seen-more" id="seen-more"></p></section>';
  }

  main.innerHTML = html;
  layoutConstellation(person);
  initMasonry();
  initLightbox();
}

function navigate(slug) {
  history.pushState({ slug: slug }, "", "person.html?p=" + encodeURIComponent(slug));
  render(slug);
  window.scrollTo(0, 0);
}

/* travel when a constellation node is clicked (but let modified clicks open a tab) */
document.querySelector("main").addEventListener("click", function (e) {
  var a = e.target.closest("a[data-slug]");  // constellation nodes and the overflow list
  if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  navigate(a.dataset.slug);
});
window.addEventListener("popstate", function (e) {
  var s = (e.state && e.state.slug) || new URLSearchParams(location.search).get("p") || "";
  if (DATA) render(s);
});
var rt;
window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (CURRENT) layoutConstellation(CURRENT); }, 150); });

var slug = new URLSearchParams(location.search).get("p") || "";
fetch("public/people.json")
  .then(function (r) { return r.json(); })
  .then(function (data) { DATA = data; render(slug); })
  .catch(function () {
    document.querySelector("main").innerHTML =
      '<div class="page-intro"><div><h1>Couldn\'t load</h1>' +
      '<p class="sub">Please try again. <a href="people.html">Back to the index</a>.</p></div></div>';
  });
