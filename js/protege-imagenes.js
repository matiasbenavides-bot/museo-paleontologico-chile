/* ============================================================
   MPCH — PROTECCIÓN DE IMÁGENES CON AUTORÍA CONFIRMADA
   js/protege-imagenes.js        (CR-128 · DEC-128 · 2026-11-18)
   ============================================================

   QUÉ HACE
   Aplica a las figuras cuyo dato trae `derechos: { autor, aviso }`:
     · un <div class="mpd__velo"> encima de la imagen que absorbe el clic
       derecho, el arrastre y la selección;
     · el bloqueo de «Guardar imagen como…», «Abrir imagen en pestaña nueva»
       y del arrastre al escritorio;
     · los atajos de guardado e impresión: Ctrl/Cmd+S, Ctrl/Cmd+P;
     · un aviso de autoría visible bajo la figura.

   QUÉ **NO** HACE, Y NO PUEDE HACER
   🔴 NO bloquea capturas de pantalla. Lo medido el 2026-11-18 en Chromium:

        API disponibles: oncapture: false · onScreenshot: undefined
                         mediaQuery (capture): false
        Al pulsar PrintScreen el navegador solo emite keydown:PrintScreen

   No existe API, evento ni media query que avise que se tomó una captura.
   El sistema operativo lee los píxeles ANTES que el navegador. Netflix se ve
   negro porque usa DRM de HARDWARE (Widevine/HDCP) con servidor de licencias:
   eso exige backend y licencias pagas, incompatibles con DEC-003 (sitio
   estático, sin backend, sin costo recurrente).

   ⇒ Por eso el aviso dice lo que es cierto («prohibida su reproducción»), y
     NO promete «captura bloqueada», que sería una mentira en la interfaz.
     Si algún día el dueño quiere el efecto negro, la vía es marca de agua o
     baja resolución en pantalla; está documentado en la skill del museo.

   ⚠️ EL VELO NO ROMPE EL VISOR
   `pointer-events` se desactiva en el VELO (nunca en el <img>), y el visor
   (js/visor.js) trabaja sobre su propia capa `.mpv__img`, fuera de las
   figuras. La accesibilidad se conserva: el botón «Ampliar imagen» del visor
   sigue siendo un <button> de verdad, alcanzable por teclado.
   ============================================================ */

(function () {
  "use strict";

  var AVISO_POR_DEFECTO =
    "Todos los derechos reservados. Prohibida su reproducción sin autorización.";

  /* ------------------------------------------------------------
     1. Índice de imágenes con derechos confirmados.
     Se lee del DATO (fuente única, DEC-005), recorriendo los bloques que
     tengan `secciones`. Así no hay una segunda lista que se desincronice, y
     el dueño marca o desmarca desde data/museo.js, no desde el JS.
     ------------------------------------------------------------ */
  function indiceProtegidas() {
    var mapa = {};
    if (typeof window === "undefined") return mapa;

    Object.keys(window).forEach(function (clave) {
      var B = window[clave];
      if (!B || typeof B !== "object" || !B.secciones) return;
      B.secciones.forEach(function (s) {
        (s.imagenes || []).forEach(function (im) {
          if (!im || !im.src || !im.derechos) return;
          mapa[im.src] = {
            autor: im.derechos.autor || "",
            aviso: im.derechos.aviso || AVISO_POR_DEFECTO
          };
        });
      });
    });
    return mapa;
  }

  /* ------------------------------------------------------------
     2. Marcar una figura.
     El velo va DENTRO del marco, sobre la imagen, pero es `aria-hidden` y no
     captura el foco: un lector de pantalla no lo ve y el teclado lo salta.
     ------------------------------------------------------------ */
  function marcarFigura(fig, datos) {
    if (!fig || fig.getAttribute("data-mpd") === "1") return false;
    var marco = fig.querySelector(".tib-fig__marco, .amo-fig__marco, .tri-fig__marco, .amb-fig__marco, figure > span, figure > div");
    if (!marco) return false;

    fig.setAttribute("data-mpd", "1");

    var velo = document.createElement("span");
    velo.className = "mpd__velo";
    velo.setAttribute("aria-hidden", "true");
    velo.setAttribute("draggable", "false");
    marco.appendChild(velo);

    /* El aviso de autoría va al pie de la figura, no sobre la imagen: sobre la
       imagen taparía el fósil, que es lo que el museo quiere mostrar. */
    var pie = fig.querySelector("figcaption");
    var aviso = document.createElement("p");
    aviso.className = "mpd__aviso";
    aviso.innerHTML = '<span class="mpd__aviso-icono" aria-hidden="true">©</span>' +
      '<span class="mpd__aviso-texto"></span>';
    aviso.querySelector(".mpd__aviso-texto").textContent = datos.aviso;
    if (pie) {
      pie.parentNode.insertBefore(aviso, pie.nextSibling);
    } else {
      fig.appendChild(aviso);
    }

    /* La imagen pierde el arrastre nativo y la selección. NO se toca
       `pointer-events` del <img>: el clic tiene que seguir llegando al velo,
       que es quien decide, y así el visor no se entera de nada. */
    var img = marco.querySelector("img");
    if (img) {
      img.setAttribute("draggable", "false");
      img.classList.add("mpd__img");
    }
    return true;
  }

  /* ------------------------------------------------------------
     3. Recorrido de la página.
     Se llama después de que el capítulo pinte (render/`pintarTodo`), y de
     nuevo tras abrir/cerrar el visor por si repintó nodos.
     ------------------------------------------------------------ */
  var mapaCache = null;

  function aplicar(raiz) {
    if (!mapaCache) mapaCache = indiceProtegidas();
    var objetivo = raiz || document;
    var puestas = 0;

    var figs = objetivo.querySelectorAll("figure");
    Array.prototype.forEach.call(figs, function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;
      var src = img.getAttribute("src");
      if (!src) return;
      /* El `src` del dato es relativo («assets/...») y el del DOM también,
         pero el visor puede haberlo dejado con el prefijo del sitio: se
         compara por la cola de la ruta. */
      var datos = mapaCache[src];
      if (!datos) {
        var claves = Object.keys(mapaCache);
        for (var i = 0; i < claves.length; i++) {
          if (src.slice(-claves[i].length) === claves[i]) { datos = mapaCache[claves[i]]; break; }
        }
      }
      if (datos && marcarFigura(fig, datos)) puestas++;
    });

    return puestas;
  }

  /* ------------------------------------------------------------
     4. Disuasión global.
     Se instala UNA sola vez. Todo el manejo es pasivo cuando el objetivo no
     está protegido: si el usuario hace clic derecho sobre un párrafo, el menú
     del navegador funciona igual que siempre.
     ------------------------------------------------------------ */
  function estaProtegido(nodo) {
    if (!nodo) return false;
    var el = nodo.nodeType === 1 ? nodo : nodo.parentElement;
    if (!el || !el.closest) return false;
    /* En la página: la figura marcada. En el visor: su capa, que sólo lleva
       `data-mpd-vis` mientras se muestra una imagen con autoría confirmada
       (CR-128). Así el clic derecho se cancela también sobre la imagen grande,
       que es la vía más fácil de guardarla. */
    return !!(el.closest('[data-mpd="1"]') || el.closest('[data-mpd-vis="1"]'));
  }

  function instalarDisuasion() {
    if (document.documentElement.getAttribute("data-mpd-listo") === "1") return;
    document.documentElement.setAttribute("data-mpd-listo", "1");

    /* Clic derecho: se cancela SOLO sobre la figura protegida. */
    document.addEventListener("contextmenu", function (e) {
      if (estaProtegido(e.target)) e.preventDefault();
    }, false);

    /* Arrastrar la imagen: se cancela sólo sobre la protegida. */
    document.addEventListener("dragstart", function (e) {
      if (estaProtegido(e.target)) e.preventDefault();
    }, false);

    /* Atajos de guardado / impresión / ver código.
       ⚠️ Ctrl+U y Ctrl+Shift+I NO se bloquean a propósito: ocultar el código
       no protege nada (el archivo se sirve igual) y sí molesta al que estudia
       el sitio. La decisión está documentada en DEC-128. */
    document.addEventListener("keydown", function (e) {
      var mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      var k = (e.key || "").toLowerCase();
      /* Sólo se bloquea si hay alguna figura protegida EN PANTALLA, sea en la
         página o en el visor (CR-128). */
      if (!document.querySelector('[data-mpd="1"], [data-mpd-vis="1"]')) return;
      if (k === "s" || k === "p") e.preventDefault();
    }, false);
  }

  /* ------------------------------------------------------------
     5. Arranque.
     El sitio es estático y sin build: cada capítulo pinta su DOM al cargar.
     Se aplica en `DOMContentLoaded` (ya debería haber pintado) y se reintenta
     una vez en `load` por si algún render es asíncrono (el visor lo es).
     ------------------------------------------------------------ */
  function arrancar() {
    instalarDisuasion();
    var n = aplicar(document);
    if (n) {
      /* Expuesto para las sondas de medición, igual que el resto del sitio. */
      window.MPD = { protegidas: n, mapa: mapaCache, aplicar: aplicar };
    }
    return n;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar, false);
  } else {
    arrancar();
  }
  window.addEventListener("load", function () {
    /* El visor monta su capa en `load`; se re-aplica por si movió figuras. */
    aplicar(document);
  }, false);

  window.MPD = window.MPD || {};
  window.MPD.arrancar = arrancar;
  window.MPD.aplicar = aplicar;
})();
