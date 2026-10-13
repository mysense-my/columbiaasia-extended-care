window.SPRINGS={"s15": "linear(0, 0.0107, 0.0387, 0.0788, 0.1271, 0.1803, 0.2361, 0.2926, 0.3486, 0.403, 0.4551, 0.5045, 0.5509, 0.5941, 0.6342, 0.6711, 0.7049, 0.7357, 0.7638, 0.7892, 0.8122, 0.8329, 0.8515, 0.8682, 0.8832, 0.8966, 0.9085, 0.9191, 0.9286, 0.937, 0.9445, 0.9511, 0.957, 0.9621, 0.9667, 0.9708, 0.9743, 0.9775, 0.9802, 0.9827, 0.9848, 0.9867, 0.9884, 0.9898, 0.9911, 0.9922, 0.9932, 0.9941, 0.9948, 0.9955, 0.996, 0.9965, 0.997, 0.9974, 0.9977, 0.998, 0.9983, 0.9985, 0.9987, 0.9989, 1)", "s08b1": "linear(0, 0.03, 0.1024, 0.1973, 0.3007, 0.4037, 0.5008, 0.5887, 0.6662, 0.7327, 0.7889, 0.8355, 0.8735, 0.9042, 0.9285, 0.9476, 0.9623, 0.9736, 0.982, 0.9883, 0.9928, 0.996, 0.9982, 0.9997, 1.0006, 1.0012, 1.0014, 1.0015, 1.0015, 1.0014, 1.0013, 1.0011, 1)", "s08b2": "linear(0, 0.034, 0.1167, 0.2253, 0.3435, 0.4604, 0.5691, 0.6657, 0.7484, 0.817, 0.8724, 0.9158, 0.9487, 0.973, 0.9902, 1.0018, 1.0091, 1.0131, 1.0149, 1.0151, 1.0142, 1.0128, 1.0111, 1.0093, 1.0076, 1.006, 1.0046, 1.0034, 1.0024, 1.0017, 1.0011, 1.0006, 1)", "s04b2": "linear(0, 0.0574, 0.1873, 0.3435, 0.4978, 0.635, 0.7484, 0.8369, 0.9025, 0.9487, 0.9795, 0.9985, 1.0091, 1.0139, 1.0152, 1.0142, 1.0123, 1.0099, 1.0076, 1.0055, 1.0038, 1.0024, 1.0015, 1.0008, 1)", "s06": "linear(0, 0.0575, 0.1803, 0.3208, 0.4551, 0.5729, 0.6711, 0.7501, 0.8122, 0.8601, 0.8966, 0.924, 0.9445, 0.9596, 0.9708, 0.9789, 0.9848, 0.9891, 0.9922, 0.9944, 0.996, 0.9972, 0.998, 0.9986, 1)"};
/* Columbia Asia Extended Care landing page: motion and behaviour.
   Every timing is the HealthOps template's own (Framer source, see _teardown/TEARDOWN.md):
   - reveals: spring 1.5s / bounce 0, hand-staggered delays, IntersectionObserver threshold 0, once
   - headings: per-word blur-up (opacity .001, blur 10px, y 10px), start .5s, +.05s per word
   - menu: spring .6s / 0   - accordion: spring .8s / .2   - drawer: .8s cubic-bezier(.16,1,.3,1)
   - smooth scroll: Lenis 1.0.42, duration 1.0 (0.5 on phones)
   SPRINGS (CSS linear() curves of the same springs) is inlined by build.py. */
(function () {
  "use strict";
  var root = document.documentElement;
  var S = window.SPRINGS || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isPhone = function () { return window.matchMedia("(max-width: 809.98px)").matches; };
  var isDesktop = function () { return window.matchMedia("(min-width: 1200px)").matches; };
  var dl = (window.dataLayer = window.dataLayer || []);
  var canAnimate = typeof Element.prototype.animate === "function";
  var ease = function (k, fallback) {
    // linear() needs Chrome 113 / Safari 17.2 / Firefox 112; older browsers get a close cubic-bezier
    return (window.CSS && CSS.supports && CSS.supports("animation-timing-function", "linear(0, 1)")) ? S[k] : fallback;
  };
  var E15 = ease("s15", "cubic-bezier(0.22, 1, 0.36, 1)");
  var E08b2 = ease("s08b2", "cubic-bezier(0.34, 1.3, 0.64, 1)");
  var E06 = ease("s06", "cubic-bezier(0.22, 1, 0.36, 1)");

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: isPhone() ? 0.5 : 1.0 });
    var loop = function (t) { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    // Framer marks scrollable inner elements so Lenis leaves them alone
    document.querySelectorAll(".drawer__bio").forEach(function (el) { el.setAttribute("data-lenis-prevent", "true"); });
  }
  function scrollToTarget(el) {
    var off = -(parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    if (lenis) lenis.scrollTo(el, { offset: off });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset + off, behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------- reveals ---------- */
  function play(el, keyframes, delay, duration, easing) {
    if (!canAnimate || reduce) { el.style.opacity = 1; el.style.filter = "none"; el.style.transform = "none"; return; }
    el.animate(keyframes, { duration: duration || 1500, delay: (delay || 0) * 1000, easing: easing || E15, fill: "both" });
  }
  function reveal(el) {
    var d = parseFloat(el.getAttribute("data-d") || "0");
    var sc = el.getAttribute("data-r-scale");
    var from = el.getAttribute("data-r") === "hero" ? 0.001 : 0;
    if (el.hasAttribute("data-words")) {
      el.style.opacity = 1;
      el.querySelectorAll(".w").forEach(function (w, i) {
        play(w, [{ opacity: 0.001, filter: "blur(10px)", transform: "translateY(10px)" },
                 { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }], d + i * 0.05);
      });
      return;
    }
    play(el, sc ? [{ opacity: from, transform: "scale(" + sc + ")" }, { opacity: 1, transform: "scale(1)" }]
                : [{ opacity: from }, { opacity: 1 }], d);
  }
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-r]"));
  var onMount = revealEls.filter(function (el) { return el.hasAttribute("data-mount"); });
  var inView = revealEls.filter(function (el) { return !el.hasAttribute("data-mount"); });
  // Framer's text effects split and start only once fonts are ready (measured: on a cold load the
  // template's headline words start after the subtitle); everything else starts on mount.
  onMount.forEach(function (el) {
    if (el.hasAttribute("data-words") && document.fonts && document.fonts.ready) document.fonts.ready.then(function () { reveal(el); });
    else reveal(el);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); }
      });
    }, { threshold: 0 });
    inView.forEach(function (el) { io.observe(el); });
  } else {
    inView.forEach(reveal);
  }

  /* ---------- hero slideshow: crossfade every 5s (paused off-screen, in background tabs, and for reduced motion) ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero__img"));
  if (slides.length > 1) {
    var loadSlide = function (img) {
      if (img.getAttribute("data-src")) {
        if (img.getAttribute("data-srcset")) img.srcset = img.getAttribute("data-srcset");
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src"); img.removeAttribute("data-srcset");
      }
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    };
    window.addEventListener("load", function () { slides.slice(1).forEach(loadSlide); });
    var cur = 0, z = 1, slideTimer = null, heroOn = true;
    var HOLD = 5000, FADE = 1200;
    var schedule = function () {
      clearTimeout(slideTimer);
      if (!reduce && heroOn && !document.hidden) slideTimer = setTimeout(nextSlide, HOLD);
    };
    var nextSlide = function () {
      var from = slides[cur], to = slides[(cur + 1) % slides.length];
      loadSlide(to).then(function () {
        to.style.zIndex = ++z;
        to.classList.add("is-on");
        setTimeout(function () { from.classList.remove("is-on"); }, FADE + 50);
        cur = (cur + 1) % slides.length;
        schedule();
      });
    };
    document.addEventListener("visibilitychange", schedule);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { heroOn = en[0].isIntersecting; schedule(); }).observe(document.querySelector(".hero"));
    } else schedule();
  }

  /* ---------- nav: tablet / phone menu ---------- */
  var nav = document.querySelector(".nav");
  var wrap = nav && nav.querySelector(".nav__wrap");
  var burger = nav && nav.querySelector(".burger");
  var menuAnim = null;
  function setMenu(open) {
    if (!wrap || isDesktop()) return;
    var bar = nav.querySelector(".nav__bar").getBoundingClientRect().height;
    var from = wrap.getBoundingClientRect().height;
    if (menuAnim) menuAnim.cancel();
    nav.classList.toggle("is-x", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) nav.classList.add("is-open");
    var to = open ? wrap.scrollHeight : bar;
    if (!canAnimate || reduce) { if (!open) nav.classList.remove("is-open"); return; }
    nav.classList.add("is-anim");
    menuAnim = wrap.animate([{ height: from + "px" }, { height: to + "px" }], { duration: 600, easing: E06 });
    menuAnim.onfinish = function () {
      nav.classList.remove("is-anim");
      if (!open) nav.classList.remove("is-open");
      menuAnim = null;
    };
  }
  if (burger) burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-x")); });
  window.addEventListener("resize", function () {
    if (isDesktop() && nav) { nav.classList.remove("is-open", "is-x", "is-anim"); if (burger) burger.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- in-page links (smooth, close menu, preselect booking picker) ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = id ? document.getElementById(id) : document.body;
    if (!el) return;
    e.preventDefault();
    if (a.hasAttribute("data-need") || a.hasAttribute("data-reason")) preselect(a.getAttribute("data-need"), a.getAttribute("data-reason"));
    if (nav && nav.classList.contains("is-x")) setMenu(false);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    scrollToTarget(el);
  });
  function preselect(need, reason) {
    [["need", need], ["reason", reason]].forEach(function (p) {
      if (!p[1]) return;
      var inp = document.querySelector('input[name="' + p[0] + '"][value="' + p[1] + '"]');
      if (inp) inp.checked = true;
    });
  }

  /* ---------- FAQ accordion (single open) ---------- */
  document.querySelectorAll(".acc").forEach(function (acc) {
    acc.addEventListener("click", function (e) {
      var q = e.target.closest(".acc__q");
      if (!q) return;
      var item = q.closest(".acc__item");
      var open = !item.classList.contains("is-open");
      acc.querySelectorAll(".acc__item.is-open").forEach(function (it) { if (it !== item) toggleItem(it, false); });
      toggleItem(item, open);
    });
  });
  function toggleItem(item, open) {
    var panel = item.querySelector(".acc__panel");
    var from = panel.getBoundingClientRect().height;
    item.classList.toggle("is-open", open);
    item.querySelector(".acc__q").setAttribute("aria-expanded", open ? "true" : "false");
    var to = open ? panel.scrollHeight : 0;
    if (canAnimate && !reduce) panel.animate([{ height: from + "px" }, { height: to + "px" }], { duration: 800, easing: E08b2 });
  }

  /* ---------- team drawer ---------- */
  var drawer = document.querySelector(".drawer");
  var lastFocus = null;
  function openDrawer(id) {
    var tpl = document.getElementById("member-" + id);
    if (!drawer || !tpl) return;
    drawer.querySelector(".drawer__fill").innerHTML = tpl.innerHTML;
    lastFocus = document.activeElement;
    drawer.classList.remove("is-closing");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    root.style.overflow = "hidden";
    if (lenis) lenis.stop();
    if (canAnimate && !reduce) {
      drawer.querySelector(".drawer__backdrop").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
      drawer.querySelector(".drawer__panel").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 50, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
      drawer.querySelector(".drawer__close").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 50, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
    }
    drawer.querySelector(".drawer__close").focus({ preventScroll: true });
  }
  function closeDrawer() {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    var done = function () {
      drawer.classList.remove("is-open", "is-closing");
      drawer.setAttribute("aria-hidden", "true");
      root.style.overflow = "";
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    if (!canAnimate || reduce) return done();
    drawer.classList.add("is-closing");
    drawer.querySelector(".drawer__panel").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "both" });
    drawer.querySelector(".drawer__close").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "both" });
    drawer.querySelector(".drawer__backdrop").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, delay: 50, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "both" }).onfinish = done;
  }
  document.querySelectorAll("[data-member]").forEach(function (card) {
    card.addEventListener("click", function () { openDrawer(card.getAttribute("data-member")); });
  });
  if (drawer) {
    drawer.querySelector(".drawer__close").addEventListener("click", closeDrawer);
    drawer.querySelector(".drawer__content").addEventListener("click", function (e) {
      if (!e.target.closest(".drawer__panel")) closeDrawer();
      if (e.target.closest("a[href^='#']")) closeDrawer();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  }

  /* ---------- booking form ---------- */
  var form = document.getElementById("book-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      dl.push({ event: "form_submit", service: fd.get("need"), reason: fd.get("reason"), patient_location: fd.get("where") });
      // TODO(go-live): post to Columbia Asia's CRM / form endpoint before redirecting.
      window.location.href = form.getAttribute("action") + "?service=" + encodeURIComponent(fd.get("need") || "");
    });
  }

  /* ---------- tracking (GA4 via GTM dataLayer, per the copy deck) ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    var where = (a.closest("[id]") || {}).id || "page";
    if (/wa\.me|api\.whatsapp\.com/.test(href)) dl.push({ event: "whatsapp_click", location: where });
    else if (/^tel:/.test(href)) dl.push({ event: "call_click", location: where });
  });
})();
