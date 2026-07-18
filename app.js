/* ============================================================================
   JUNGLÜCK — Konzept-Redesign · app.js
   Aufgabe 1: Bootstrap-Kern (Nav-Scroll, mobiles Menü, State, Reveal, Toast).
   Sektions-Renderer + Shop/Cart/Quickview folgen in Aufgabe 2/3.
   Kein Framework. Robust gegen Hintergrund-Tabs (IO + getBoundingClientRect).
============================================================================ */
(function () {
  "use strict";

  const { PRODUKTE, KATEGORIEN, HAUTTYPEN } = window.JUNGLUECK_DATA;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const euro = (n) => n.toFixed(2).replace(".", ",") + " €";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- STATE */
  const State = {
    cart: [],       // [{id, menge}]
    wishlist: [],   // [id]
    listeners: [],
    on(fn) { this.listeners.push(fn); },
    emit() { this.listeners.forEach((fn) => fn(this)); },
    cartCount() { return this.cart.reduce((s, i) => s + i.menge, 0); },
    cartTotal() {
      return this.cart.reduce((s, i) => {
        const p = PRODUKTE.find((x) => x.id === i.id);
        return s + (p ? p.preis * i.menge : 0);
      }, 0);
    },
    addToCart(id, menge = 1) {
      const row = this.cart.find((i) => i.id === id);
      if (row) row.menge += menge; else this.cart.push({ id, menge });
      this.emit();
    },
    setMenge(id, menge) {
      const row = this.cart.find((i) => i.id === id);
      if (!row) return;
      row.menge = Math.max(0, menge);
      if (row.menge === 0) this.cart = this.cart.filter((i) => i.id !== id);
      this.emit();
    },
    removeFromCart(id) { this.cart = this.cart.filter((i) => i.id !== id); this.emit(); },
    toggleWishlist(id) {
      if (this.wishlist.includes(id)) this.wishlist = this.wishlist.filter((x) => x !== id);
      else this.wishlist.push(id);
      this.emit();
    },
    inWishlist(id) { return this.wishlist.includes(id); },
  };
  window.JUNGLUECK_STATE = State; // für Sektions-Module (A2/A3)

  /* ---------------------------------------------------------- BADGE / ZÄHLER */
  const cartCountEl = $("#cart-count");
  const wishCountEl = $("#wishlist-count");
  function bump(el) {
    if (!el) return;
    el.classList.remove("is-bumped");
    void el.offsetWidth; // reflow, damit Animation neu startet
    el.classList.add("is-bumped");
  }
  State.on((s) => {
    const c = s.cartCount();
    const w = s.wishlist.length;
    if (cartCountEl) {
      const prev = +cartCountEl.dataset.count;
      cartCountEl.dataset.count = c; cartCountEl.textContent = c;
      if (c > prev) bump(cartCountEl);
    }
    if (wishCountEl) {
      const prev = +wishCountEl.dataset.count;
      wishCountEl.dataset.count = w; wishCountEl.textContent = w;
      if (w > prev) bump(wishCountEl);
    }
  });

  /* ---------------------------------------------------------------- TOAST */
  const toastWrap = $("#toast-wrap");
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  function toast(msg, withCheck = true) {
    if (!toastWrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = (withCheck ? CHECK : "") + "<span></span>";
    el.querySelector("span").textContent = msg;
    toastWrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-in"));
    // Fallback ohne rAF (Hintergrund-Tab): sicherstellen, dass es sichtbar wird
    setTimeout(() => el.classList.add("is-in"), 30);
    setTimeout(() => {
      el.classList.remove("is-in");
      setTimeout(() => el.remove(), 360);
    }, 2400);
  }
  window.JUNGLUECK_TOAST = toast;

  /* ------------------------------------------------------- NAV SCROLL-STATE */
  const nav = $("#nav");
  let lastScrolled = null;
  function updateNav() {
    const scrolled = window.scrollY > 40;
    if (scrolled !== lastScrolled) {
      nav.dataset.scrolled = scrolled ? "true" : "false";
      lastScrolled = scrolled;
    }
  }
  // passive scroll-Listener nur für Nav-State-Toggle (kein Per-Frame-Layout)
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ------------------------------------------------------- MOBILES MENÜ */
  const menu = $("#mobile-menu");
  const openMenuBtn = $("#open-menu");
  const closeMenuBtn = $("#close-menu");
  let lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    menu.dataset.open = "true";
    openMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const first = menu.querySelector("a, button");
    if (first) setTimeout(() => first.focus(), 40);
  }
  function closeMenu() {
    menu.dataset.open = "false";
    openMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  openMenuBtn && openMenuBtn.addEventListener("click", openMenu);
  closeMenuBtn && closeMenuBtn.addEventListener("click", closeMenu);
  $$("[data-menu-link]").forEach((a) => a.addEventListener("click", closeMenu));

  // Focus-Trap + Escape im mobilen Menü
  menu && menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key !== "Tab") return;
    const f = $$('a, button', menu).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ----------------------------------------------- REVEAL (IO + Fallback) */
  // Robust gegen Hintergrund-Tabs: IntersectionObserver + Sofort-Check.
  const revealEls = () => $$("[data-reveal]:not(.is-in)");
  function showReveal(el) { el.classList.add("is-in"); }

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls().forEach(showReveal);
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { showReveal(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    // Sofort-Fallback: was schon im Viewport ist, wird direkt gezeigt.
    function scanImmediate() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) showReveal(el);
        else io.observe(el);
      });
    }
    // Öffentliche Hook, damit A2/A3 nach dem Rendern neue Reveals registrieren.
    window.JUNGLUECK_REVEAL = function registerReveals() { scanImmediate(); };
    scanImmediate();
    window.addEventListener("load", scanImmediate);
  }

  /* --------------------------------------------------- SEKTIONS-MODULE HOOK */
  // Aufgabe 2/3 registrieren hier ihre Renderer. Bootstrap ruft sie geordnet auf.
  window.JUNGLUECK_MODULES = window.JUNGLUECK_MODULES || [];
  function runModules() {
    (window.JUNGLUECK_MODULES || []).forEach((mod) => {
      try { typeof mod === "function" && mod({ State, PRODUKTE, KATEGORIEN, HAUTTYPEN, $, $$, euro, toast, prefersReduced }); }
      catch (err) { console.error("[Modul-Fehler]", err); }
    });
    window.JUNGLUECK_REVEAL && window.JUNGLUECK_REVEAL();
  }
  window.JUNGLUECK_RUN = runModules;

  // Shop-Öffnen-Buttons (Overlay-Logik kommt in A3; hier vorbereitet)
  const shopLink = $("#menu-shop-link");
  shopLink && shopLink.addEventListener("click", (e) => e.preventDefault());

  /* --------------------------------------------------------------- INIT */
  document.addEventListener("DOMContentLoaded", runModules);
  if (document.readyState !== "loading") runModules();

  console.log("[JUNGLÜCK] Bootstrap bereit ·", PRODUKTE.length, "Produkte geladen.");
})();
