/* Scott PCS Guide: tiny progressive enhancement (menu, scroll reveal, TOC highlight, back-to-top).
   Everything works without this file. */
(function () {
  "use strict";
  window.pcsReady = true;
  var d = document, root = d.documentElement;

  // Mobile menu: aria-expanded, Esc to close, focus kept inside while open, closes on outside click.
  var btn = d.querySelector(".menu-btn"), nav = d.getElementById("site-nav");
  if (btn && nav) {
    var label = btn.querySelector(".menu-btn__label");
    var setOpen = function (open, focusBtn) {
      btn.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
      else if (focusBtn) btn.focus();
    };
    btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
    d.addEventListener("keydown", function (e) {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") { setOpen(false, true); return; }
      if (e.key === "Tab") {
        var items = [btn].concat([].slice.call(nav.querySelectorAll("a")));
        var i = items.indexOf(d.activeElement), last = items.length - 1;
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[last].focus(); }
        else if (!e.shiftKey && i === last) { e.preventDefault(); items[0].focus(); }
      }
    });
    d.addEventListener("click", function (e) {
      if (btn.getAttribute("aria-expanded") === "true" && !nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    window.matchMedia("(min-width: 68rem)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
  }

  // Scroll reveal (opacity/transform only; CSS skips it under prefers-reduced-motion).
  var els = d.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { root.classList.remove("rv"); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sibs = el.parentNode ? [].slice.call(el.parentNode.children) : [];
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + "ms";
        el.classList.add("is-in");
        setTimeout(function () { el.style.transitionDelay = ""; }, 1200);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  // Table of contents: highlight the section being read.
  var toc = d.querySelectorAll(".toc--side a");
  if (toc.length && "IntersectionObserver" in window) {
    var map = {};
    [].forEach.call(toc, function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        [].forEach.call(toc, function (a) { a.classList.remove("is-active"); });
        var a = map[en.target.id]; if (a) a.classList.add("is-active");
      });
    }, { rootMargin: "-15% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var h = d.getElementById(id); if (h) spy.observe(h); });
  }

  // Back-to-top button appears after scrolling down.
  var top = d.querySelector(".to-top");
  if (top) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { top.classList.toggle("is-on", window.scrollY > 700); ticking = false; });
    }, { passive: true });
  }
})();
