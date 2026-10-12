/* ============================================================
   MPCH — Animaciones inmersivas
   Parallax multicapa, reveals escalonados, tilt 3D, barra de
   progreso, timeline geologico que avanza con el scroll y
   contadores. Todo respeta prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var limitar = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- 1. Barra de progreso de lectura ---------- */
  function progreso() {
    var barra = document.querySelector(".progreso");
    if (!barra) return;
    function act() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      barra.style.width = limitar(p, 0, 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", act, { passive: true });
    window.addEventListener("resize", act);
    act();
  }

  /* ---------- 2. Parallax multicapa (rAF + lerp) ---------- */
  function parallax() {
    var capas = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!capas.length || reducido) return;

    var objetivo = 0, actual = 0, corriendo = false;

    function actualizar() {
      actual = lerp(actual, objetivo, 0.12);
      capas.forEach(function (el) {
        var vel = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        var base = el.getAttribute("data-parallax-base") || "translate(-50%,-50%)";
        el.style.transform = base + " translate3d(0," + (actual * vel).toFixed(2) + "px,0)";
      });
      if (Math.abs(actual - objetivo) > 0.4) { requestAnimationFrame(actualizar); }
      else { corriendo = false; }
    }
    window.addEventListener("scroll", function () {
      objetivo = window.scrollY;
      if (!corriendo) { corriendo = true; requestAnimationFrame(actualizar); }
    }, { passive: true });
    actualizar();
  }

  /* ---------- 3. Reveals escalonados ---------- */
  var _obsReveal = null;

  function observarReveals() {
    var pendientes = document.querySelectorAll(".reveal:not(.visible), .fade-in:not(.visible)");
    if (!pendientes.length) return;

    if (!("IntersectionObserver" in window) || reducido) {
      Array.prototype.slice.call(pendientes).forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    if (!_obsReveal) {
      _obsReveal = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          _obsReveal.unobserve(e.target);
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    }
    Array.prototype.slice.call(pendientes).forEach(function (el) { _obsReveal.observe(el); });
  }

  function reveals() {
    /* Escalonado dentro de cada grupo (una sola vez por hijo) */
    Array.prototype.slice.call(document.querySelectorAll("[data-stagger]")).forEach(function (g) {
      Array.prototype.slice.call(g.children).forEach(function (h, i) {
        if (!h.dataset.retraso) {
          h.style.transitionDelay = (i * 85) + "ms";
          h.dataset.retraso = "1";
        }
      });
    });
    observarReveals();
  }

  /* ---------- 4. Tilt 3D en tarjetas ---------- */
  function tilt() {
    if (reducido || window.matchMedia("(hover: none)").matches) return;
    var tarjetas = document.querySelectorAll(".pieza, .servicio, .contacto__card");

    Array.prototype.slice.call(tarjetas).forEach(function (card) {
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var cx = r.width / 2, cy = r.height / 2;
        var rx = ((y - cy) / cy) * -6;
        var ry = ((x - cx) / cx) * 6;
        card.style.transform = "translateY(-6px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        /* Brillo que sigue al cursor */
        card.style.setProperty("--mx", ((x / r.width) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((y / r.height) * 100).toFixed(1) + "%");
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 5. Timeline geologico segun scroll ---------- */
  function timeline() {
    var linea = document.querySelector(".linea");
    if (!linea) return;
    var eras = Array.prototype.slice.call(linea.querySelectorAll(".linea__era"));

    function act() {
      var r = linea.getBoundingClientRect();
      var vh = window.innerHeight;
      /* progreso de 0 a 1 segun la linea atraviesa la pantalla */
      var p = limitar((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      eras.forEach(function (era, i) {
        var umbral = i / eras.length;
        era.classList.toggle("activa", p >= umbral);
      });
      /* CR-32: --prog alimenta `transform: scaleX()` en el CSS, que necesita un
         NUMERO (0..1), no un porcentaje. Con "50%" el navegador descartaba el
         transform y la linea quedaba en matrix(0,...) = invisible siempre.
         Se emite el factor puro; `--progPct` se conserva por si algo mas lo usa. */
      linea.style.setProperty("--prog", p.toFixed(4));
      linea.style.setProperty("--progPct", (p * 100).toFixed(1) + "%");
    }
    window.addEventListener("scroll", act, { passive: true });
    window.addEventListener("resize", act);
    act();
  }

  /* ---------- 6. Cabecera + nav activa ---------- */
  function header() {
    var el = document.querySelector(".header");
    if (!el) return;
    function act() { el.classList.toggle("scrolled", window.scrollY > 60); }
    window.addEventListener("scroll", act, { passive: true });
    act();
  }

  /* ---------- 7. Aurora reactiva al cursor (hero) ---------- */
  function aurora() {
    var hero = document.querySelector(".hero");
    if (!hero || reducido || window.matchMedia("(hover: none)").matches) return;
    var objetivoX = 50, objetivoY = 40, x = 50, y = 40, corriendo = false;

    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      objetivoX = ((e.clientX - r.left) / r.width) * 100;
      objetivoY = ((e.clientY - r.top) / r.height) * 100;
      if (!corriendo) { corriendo = true; requestAnimationFrame(animar); }
    });
    function animar() {
      x = lerp(x, objetivoX, 0.07); y = lerp(y, objetivoY, 0.07);
      hero.style.setProperty("--mx", x.toFixed(2) + "%");
      hero.style.setProperty("--my", y.toFixed(2) + "%");
      if (Math.abs(x - objetivoX) > 0.15 || Math.abs(y - objetivoY) > 0.15) requestAnimationFrame(animar);
      else corriendo = false;
    }
    animar();
  }

  /* ---------- 8. Contadores animados ---------- */
  function contadores() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-contar]"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || reducido) return;

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var fin = parseFloat(el.getAttribute("data-contar")) || 0;
        var ini = 0, t0 = null, dur = 1300;
        function paso(ts) {
          if (!t0) t0 = ts;
          var p = limitar((ts - t0) / dur, 0, 1);
          var suave = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ini + (fin - ini) * suave);
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- 9. Menu movil ---------- */
  function menu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".nav");
    var overlay = document.querySelector(".overlay");
    if (!toggle || !nav) return;

    /* BUG CORREGIDO (CR-09): init() se ejecuta dos veces (DOMContentLoaded y
       load). Sin esta guarda, menu() registraba DOS listeners de click sobre
       el mismo boton: el primero abria el menu y el segundo lo volvia a
       cerrar en el mismo clic, de modo que el menu movil NUNCA se abria.
       La guarda hace que el cableado ocurra una sola vez. */
    if (toggle.dataset.cableado === "1") return;
    toggle.dataset.cableado = "1";

    function cerrar() {
      nav.classList.remove("abierto");
      toggle.classList.remove("abierto");
      toggle.setAttribute("aria-expanded", "false");
      if (overlay) overlay.classList.remove("visible");
      document.body.style.overflow = "";
    }
    function abrir() {
      nav.classList.add("abierto");
      toggle.classList.add("abierto");
      toggle.setAttribute("aria-expanded", "true");
      if (overlay) overlay.classList.add("visible");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("abierto")) cerrar(); else abrir();
    });
    if (overlay) overlay.addEventListener("click", cerrar);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
    Array.prototype.slice.call(nav.querySelectorAll("a")).forEach(function (a) {
      a.addEventListener("click", function () { if (window.innerWidth <= 768) cerrar(); });
    });
  }

  /* ---------- 10. Nav activa ---------- */
  function navActiva() {
    var secciones = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
    var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    if (!secciones.length || !enlaces.length || !("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute("id");
        enlaces.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + id); });
      });
    }, { threshold: 0.2, rootMargin: "-80px 0px -55% 0px" });
    secciones.forEach(function (s) { obs.observe(s); });
  }

  function init() {
    progreso(); parallax(); reveals(); tilt(); timeline();
    header(); aurora(); contadores(); menu(); navActiva();
  }

  document.addEventListener("mpch:pintado", function () { reveals(); tilt(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.addEventListener("load", init);
})();
