/* ============================================================
   MPCH — Subpágina DINOSAURIOS EN CHILE (dinosaurios-chile.html)
   Pinta la página completa desde window.DINOSAURIOS_CHILE
   (data/museo.js), la fuente única (DEC-005). No hay texto escrito a
   mano en el HTML.

   CR-96 (2026-11-02) — OCTAVA subpágina de colección, después de
   curriculum.html (CR-55), trilobites.html (CR-60), proyecto-cec.html
   (CR-61), amonites.html (CR-83), tiburones.html (CR-85), ambar.html
   (CR-86), dinosaurios.html (CR-87) y huellas.html (CR-91).

   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no se reusa js/dinosaurios.js:
   ese render está cerrado sobre su propia constante y sus clases están
   incrustadas en el HTML que genera. Parametrizarlo obligaba a
   refactorizar una página ya publicada y verificada (principio de
   mínima intervención). Se repite la parte mínima, igual que hicieron
   los ocho renders anteriores con la suya.

   🔴 CONSECUENCIA A VIGILAR (ya documentada en los otros ocho): con este
   archivo hay NUEVE copias del pintado del footer. Si cambia el pie de la
   portada, hay que cambiarlo en las nueve.

   ------------------------------------------------------------
   🔴 DEC-083 — PREFIJO PROPIO `dch-`, NO se reusa `amb-`.

   Las otras páginas de dinosaurios (dinosaurios.html, huellas.html)
   reusan las clases `.amb-` por DEC-090, y ahí está bien medido: esa
   hoja no tiene un solo selector global. Acá el requisito es DISTINTO y
   por eso se separa: las figuras de este capítulo necesitan ANCHO
   COMPLETO (reconstrucciones de 1350 px y un mapa de 1882 px de alto),
   y `.amb-figs` limita el bloque a 780 px de ancho. Reusar esa hoja
   dejaría las figuras chicas.

   ✅ Sin sección de atributos propia: las imágenes son del museo, el
   dueño lo confirmó textual el 2026-11-02 («son mias. avanza»).

   🔴 DEC-82: las 21 figuras van en el ORDEN LITERAL del Word, y cada una
   pegada al párrafo que le corresponde (`tras` = índice del párrafo tras
   el cual se pinta). El mapeo se derivó de word/document.xml, no a mano.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- Cursivas para nombres científicos (CR-86b → CR-86c) ----------
     Vive en `js/texto.js`, compartida por los renders del sitio: escapa
     primero, sustituye después, y esa asimetría es la que la hace segura.
     Si el módulo no cargó, cae en `esc` puro: el texto se ve sin cursiva
     pero la página NUNCA se rompe. */
  var conCursivas = (window.TEXTO && window.TEXTO.conCursivas) || esc;
  var M = window.MUSEO;
  var T = window.DINOSAURIOS_CHILE;
  if (!M || !T) return;

  /* ---------- Marca y footer (mismo comportamiento que huellas.js) ---------- */
  function pintarMarca() {
    $$("[data-marca-lema]").forEach(function (el) {
      if (M.lemaA && M.lemaB) {
        el.innerHTML = '<span class="footer__lemaA">' + esc(M.lemaA) + "</span>" +
                       '<span class="footer__lemaB">' + esc(M.lemaB) + "</span>";
      } else {
        el.textContent = M.lema;
      }
    });
    $$("[data-marca-pertenece]").forEach(function (el) {
      if (M.pertenece) { el.textContent = M.pertenece; }
      else { el.style.display = "none"; }
    });
  }

  function pintarFooter() {
    var c = M.contacto, u = M.ubicacion;
    var cont = $("[data-footer-contacto]");
    if (cont) {
      cont.innerHTML = "<li>" + esc(u.direccion) + ", " + esc(u.referencia) + "</li>" +
        (c.telefono ? '<li><a href="tel:' + esc(c.telefonoLink) + '">' + esc(c.telefono) + "</a></li>" : "") +
        (c.correos && c.correos[0] ? '<li><a href="mailto:' + esc(c.correos[0]) + '">' + esc(c.correos[0]) + "</a></li>" : "");
    }
    var anio = $("[data-anio]");
    if (anio) anio.textContent = new Date().getFullYear();

    var cr = $("[data-footer-creditos]");
    if (cr && M.creditos && M.creditos.autores) {
      cr.innerHTML =
        '<span class="creditos__titulo">' + esc(M.creditos.titulo || "Sitio desarrollado por") + "</span>" +
        M.creditos.autores.map(function (a) {
          var correo = a.correo
            ? '<a class="creditos__correo" href="mailto:' + esc(a.correo) + '">' + esc(a.correo) + "</a>"
            : "";
          return '<span class="creditos__item">' +
                   '<span class="creditos__nombre">' + esc(a.nombre) + "</span>" +
                   '<span class="creditos__rol">' + esc(a.rol) + "</span>" +
                   correo +
                 "</span>";
        }).join("");
    }

    /* CR-90 (DEC-092) — derechos de los textos, desde el data (DEC-005).
       Mismo bloque que las otras ocho páginas; si el dato falta, el bloque
       se queda vacío: no hay texto inventado de respaldo. */
    var der = $("[data-footer-derechos]");
    if (der && M.derechos) { der.textContent = M.derechos; }
  }

  /* ---------- Cabecera de la página ---------- */
  function pintarCabeza() {
    document.title = T.titulo + " — Colecciones | " + M.nombre;

    var et = $("[data-dch-etiqueta]");  if (et) et.textContent = T.etiqueta;
    var ti = $("[data-dch-titulo]");    if (ti) ti.textContent = T.titulo;
    var ba = $("[data-dch-bajada]");    if (ba) ba.textContent = T.bajada;

    var vol = $("[data-dch-volver]");
    if (vol && T.volver) {
      vol.href = T.volver.enlace;
      var txt = $("[data-dch-volver-texto]");
      if (txt) txt.textContent = T.volver.texto;
    }

    var intro = $("[data-dch-intro]");
    if (intro && T.intro) intro.innerHTML = "<p>" + esc(T.intro) + "</p>";

    /* CR-94 (DEC-094) — crédito de autoría ARRIBA. La frase vive en el data
       (M.derechosInicio) y es CORTA a propósito; la línea larga del pie no se
       toca. Si el dato falta, el bloque no se pinta. */
    $$("[data-credito-inicio]").forEach(function (el) {
      if (M.derechosInicio) { el.textContent = M.derechosInicio; }
      else { el.style.display = "none"; }
    });
  }

  /* ---------- Índice ----------
     Se arma desde las MISMAS secciones que se pintan abajo, así que no puede
     quedar desincronizado. Solo se listan las de nivel 2; en esta página todas
     las secciones son nivel 3 (los rótulos del Word), así que el índice no se
     pinta: `principales.length < 3` retira el contenedor. Es correcto. */
  function pintarIndice() {
    var cont = $("[data-dch-indice]");
    if (!cont || !T.secciones) return;
    var principales = T.secciones.filter(function (s) { return s.nivel !== 3; });
    if (principales.length < 3) { cont.remove(); return; }
    cont.innerHTML =
      '<p class="dch-indice__t">En esta página</p>' +
      '<ul class="dch-indice__l">' +
        principales.map(function (s) {
          return '<li><a href="#' + esc(s.id) + '">' + conCursivas(s.titulo) + "</a></li>";
        }).join("") +
      "</ul>";
  }

  /* ---------- Figuras ----------
     `ancho`/`alto` van SIEMPRE en el <img>: sin ellos el navegador no reserva
     el espacio y la página salta al cargar (CLS). Los valores salen medidos del
     archivo real y viven en el data/.

     `loading="lazy"` se pone SOLO de la segunda figura en adelante: la primera
     de la página es la que el usuario ve al entrar. */
  var altDe = function (im) { return im.alt ? esc(im.alt) : ""; };

  function figuraHTML(im, k) {
    var pie = im.pie ? conCursivas(im.pie) : "";
    var dim = (im.ancho && im.alto)
      ? ' width="' + im.ancho + '" height="' + im.alto + '"' : "";
    var carga = k === 0 ? ' loading="eager"' : ' loading="lazy"';
    return '<figure class="dch-fig">' +
             '<span class="dch-fig__marco">' +
               '<img src="' + esc(im.src) + '"' + dim +
                 ' alt="' + altDe(im) + '"' + carga + ' decoding="async">' +
             "</span>" +
             (pie ? "<figcaption>" + pie + "</figcaption>" : "") +
           "</figure>";
  }

  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    var n = imgs.length >= 5 ? 5 : (imgs.length >= 3 ? 3 : (imgs.length >= 2 ? 2 : 1));
    return '<div class="dch-figs dch-figs--' + n + '">' +
      imgs.map(function (im, k) { return figuraHTML(im, k); }).join("") +
    "</div>";
  }

  /* ---------- Secciones ----------
     🔴 CR-86d — CADA FIGURA VA PEGADA A SU PÁRRAFO.

     El Word no agrupa las imágenes al final de un tema: medido en
     word/document.xml, cada figura vive en su propio párrafo, inmediatamente
     después del párrafo que la precede. `tras` es el índice (0-based) del
     párrafo después del cual va la figura.

     Si `tras` viene ausente o fuera de rango, la figura cae al final de la
     sección: este render no puede dejar una imagen sin lugar.

     Las figuras que comparten `tras` se pintan JUNTAS porque juntas vienen en
     el original; separarlas inventaría un orden que el Word no tiene (DEC-82). */
  function seccionHTML(s) {
    var sub = s.nivel === 3;
    var parrafos = s.parrafos || [];

    var porIndice = {}, sueltas = [];
    (s.imagenes || []).forEach(function (im) {
      if (typeof im.tras === "number" && im.tras >= 0 && im.tras < parrafos.length) {
        (porIndice[im.tras] = porIndice[im.tras] || []).push(im);
      } else {
        sueltas.push(im);
      }
    });

    /* `eager` sólo para la PRIMERA figura de la página. */
    var primera = true;
    var cuerpo = parrafos.map(function (p, idx) {
      var html = "<p>" + conCursivas(p) + "</p>";
      var grupo = porIndice[idx];
      if (grupo && grupo.length) {
        var gn = grupo.length >= 5 ? 5 : (grupo.length >= 3 ? 3 : (grupo.length >= 2 ? 2 : 1));
        html += '<div class="dch-figs dch-figs--' + gn + '">' +
          grupo.map(function (im) {
            var h = figuraHTML(im, primera ? 0 : 1);
            primera = false;
            return h;
          }).join("") + "</div>";
      }
      return html;
    }).join("");

    if (sueltas.length) {
      cuerpo += figurasHTML(sueltas);
    }

    return '<section class="dch-sec' + (sub ? " dch-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
             '<h' + (sub ? "3" : "2") + ' class="dch-sec__t">' + conCursivas(s.titulo) +
               '</h' + (sub ? "3" : "2") + '>' +
             cuerpo +
           "</section>";
  }

  function pintarSecciones() {
    var cont = $("[data-dch-secciones]");
    if (!cont || !T.secciones) return;
    cont.innerHTML = T.secciones.map(seccionHTML).join("");
  }

  /* ---------- Cierre ---------- */
  function pintarCierre() {
    var cont = $("[data-dch-cierre]");
    if (!cont || !T.cierre) return;
    cont.innerHTML = "<p>" + esc(T.cierre.texto) + "</p>" +
      '<a class="btn btn--primario" href="' + esc(T.cierre.enlace) + '">' + esc(T.cierre.boton) +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
  }

  function pintarTodo() {
    pintarMarca();
    pintarCabeza();
    pintarIndice();
    pintarSecciones();
    pintarCierre();
    pintarFooter();
    /* animaciones.js escucha este evento para re-enganchar los reveals. */
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  /* Sin fetch(): esta página no depende de un JSON externo. Si el data/ está
     roto, `window.DINOSAURIOS_CHILE` no existe y el guard de arriba sale sin
     pintar — el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
