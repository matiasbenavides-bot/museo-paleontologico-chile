/* ============================================================
   MPCH — Subpágina DINOSAURIOS (dinosaurios.html)
   Pinta la página completa desde window.DINOSAURIOS (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   CR-87 (2026-10-29) — SÉPTIMA subpágina del sitio, después de curriculum.html
   (CR-55), trilobites.html (CR-60), proyecto-cec.html (CR-61), amonites.html
   (CR-83), tiburones.html (CR-85) y ambar.html (CR-86).

   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no se reusa js/ambar.js:
   los seis renders previos están envueltos en un IIFE cerrado sobre su propia
   constante y con sus clases incrustadas en el HTML que generan. Parametrizarlos
   obligaba a refactorizar páginas ya publicadas y verificadas (principio de
   mínima intervención). Se repite la parte mínima, igual que hicieron
   curriculum.js, trilobites.js, amonites.js, tiburones.js y ambar.js con la suya.

   🔴 CONSECUENCIA A VIGILAR (ya documentada en los otros seis): con este archivo
   hay SIETE copias del pintado del footer (render.js, curriculum.js,
   trilobites.js, amonites.js, tiburones.js, ambar.js y este). Si cambia el pie
   de la portada, hay que cambiarlo en los siete.

   🔴 DEC-83: esta página NO reusa las clases `.tri-*`, `.amo-*`, `.tib-*` ni
   `amb-*`... con una excepción MEDIDA y deliberada, ver abajo.

   ------------------------------------------------------------
   🔴 DEC-090 — ESTA PÁGINA SÍ REUSA LAS CLASES `amb-` Y SU HOJA, A PROPÓSITO.

   La regla DEC-83 nació de dos defectos concretos: `.galeria__foto img`
   (CR-60e, recortaba figuras) y `.perfil__libros` (CR-69, pisaba la grilla).
   En los dos casos el selector era de una hoja GENÉRICA del sitio aplicado a
   una página que reusaba la clase.

   Acá el caso es el opuesto y está medido: `css/secciones/ambar.css` no tiene
   UN solo selector sin el prefijo `.amb-` (verificado con grep), así que no
   puede filtrarse a ninguna otra página. Duplicar 211 líneas de CSS para
   renombrar `amb-` a `dino-` habría creado una segunda copia que diverge en la
   primera corrección — el defecto que DEC-83 busca evitar, al revés. Se reusa
   la hoja, y si algún día esas dos páginas necesitan estilos distintos, ese es
   el momento de separar (y se separa con prefijo propio).

   ✅ Sin sección de atributos: las imágenes son del museo, no de Commons.
   `DINOSAURIOS.atribucion` es null y esa sección no se pinta.

   🔴 DEC-82: las 11 figuras van en el ORDEN LITERAL del Word, numeradas 01..11
   por su posición real en word/document.xml. NO reordenar por tamaño ni por
   criterio visual: rompe la correspondencia imagen <-> párrafo.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- Cursivas para nombres científicos (CR-86b → CR-86c) ----------
     Pedido del dueño: «para cualquier nombre científico se usan cursiva».

     🔴 CR-86c: esta función se MOVIÓ a `js/texto.js`, compartida por los seis
     renders del sitio. Antes vivía sólo acá y el mecanismo no existía en
     amonites, tiburones, trilobites, cec ni la portada. La implementación es la
     misma de siempre —escapa primero, sustituye después, y esa asimetría es la
     que la hace segura— pero ahora hay UN solo lugar que mantener.

     Si el módulo no cargó, cae en `esc` puro: el texto se ve sin cursiva pero la
     página NUNCA se rompe. */
  var conCursivas = (window.TEXTO && window.TEXTO.conCursivas) || esc;
  var M = window.MUSEO;
  var T = window.DINOSAURIOS;
  if (!M || !T) return;

  /* ---------- Marca y footer (mismo comportamiento que trilobites.js) ---------- */
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
  }

  /* ---------- Cabecera de la página ---------- */
  function pintarCabeza() {
    document.title = T.titulo + " — Colecciones | " + M.nombre;

    var et = $("[data-amb-etiqueta]");  if (et) et.textContent = T.etiqueta;
    var ti = $("[data-amb-titulo]");    if (ti) ti.textContent = T.titulo;
    var ba = $("[data-amb-bajada]");    if (ba) ba.textContent = T.bajada;

    var vol = $("[data-amb-volver]");
    if (vol && T.volver) {
      vol.href = T.volver.enlace;
      var txt = $("[data-amb-volver-texto]");
      if (txt) txt.textContent = T.volver.texto;
    }

    var intro = $("[data-amb-intro]");
    if (intro && T.intro) intro.innerHTML = "<p>" + esc(T.intro) + "</p>";
  }

  /* ---------- Índice ----------
     Se arma desde las MISMAS secciones que se pintan abajo, así que no puede
     quedar desincronizado. Solo se listan las de nivel 2. */
  function pintarIndice() {
    var cont = $("[data-amb-indice]");
    if (!cont || !T.secciones) return;
    var principales = T.secciones.filter(function (s) { return s.nivel !== 3; });
    if (principales.length < 3) { cont.remove(); return; }
    cont.innerHTML =
      '<p class="amb-indice__t">En esta página</p>' +
      '<ul class="amb-indice__l">' +
        principales.map(function (s) {
          return '<li><a href="#' + esc(s.id) + '">' + conCursivas(s.titulo) + "</a></li>";
        }).join("") +
      "</ul>";
  }

  /* ---------- Figuras ----------
     `ancho`/`alto` van SIEMPRE en el <img>: sin ellos el navegador no reserva
     el espacio y la página salta al cargar (CLS). Los valores salen medidos del
     archivo real y viven en el data/.

     `loading="lazy"` se pone SOLO de la segunda figura en adelante: las
     primeras de cada bloque son las que el usuario ve al entrar. Es la misma
     regla de CR-60d en trilobites.js.

     ⚠️ En este Word NINGUNA figura trae pie de foto, así que `im.pie` viene
     ausente en las 11 y el <figcaption> no se pinta. Es correcto: inventar un pie
     sería atribución falsa. Si el dueño dicta pies, se agregan al data/. */
  var altDe = function (im) { return im.alt ? esc(im.alt) : ""; };

  /* Una figura suelta. `k` sólo decide si se carga de inmediato (eager). */
  function figuraHTML(im, k) {
    var pie = im.pie ? conCursivas(im.pie) : "";
    var dim = (im.ancho && im.alto)
      ? ' width="' + im.ancho + '" height="' + im.alto + '"' : "";
    var carga = k === 0 ? ' loading="eager"' : ' loading="lazy"';
    return '<figure class="amb-fig">' +
             '<span class="amb-fig__marco">' +
               '<img src="' + esc(im.src) + '"' + dim +
                 ' alt="' + altDe(im) + '"' + carga + ' decoding="async">' +
             "</span>" +
             (pie ? "<figcaption><b>" + pie + "</b></figcaption>" : "") +
           "</figure>";
  }

  /* ⚠️ CR-86: en este capítulo el máximo de figuras por sección es TRES
     (sección «De dónde viene» y «La Expo Ámbar»). No hay ninguna de cinco como
     en tiburones, pero se conserva la rama para no divergir del patrón: si el
     dueño agrega más material, se marca solo. */
  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    var n = imgs.length >= 5 ? 5 : (imgs.length >= 3 ? 3 : imgs.length);
    return '<div class="amb-figs amb-figs--' + n + '">' +
      imgs.map(function (im, k) { return figuraHTML(im, k); }).join("") +
    "</div>";
  }

  /* ---------- Secciones ----------
     🔴 CR-86d (2026-10-25) — CADA FIGURA VA PEGADA A SU PÁRRAFO.

     ANTES la sección pintaba todos sus párrafos y DESPUÉS un bloque con todas
     sus imágenes. Con tres imágenes eso se leía como «3 fotos de golpe» al
     final, separadas del texto que las explica.

     El Word no las agrupa así. Medido en word/document.xml, cada imagen vive en
     su propio párrafo, inmediatamente después del párrafo que la precede:

         [01] definición       -> image1
         [03] fosilización     -> image2
         [05] qué atrapa       -> image3
         [07] Europa/América   -> image4 + image5
         [09] (comilla suelta) -> image6
         [10] valor científico -> image7
         [12] artesanía        -> image8
         [14] Expo Ámbar       -> image9 + image10 + image11

     `tras` es el índice (0-based) del párrafo después del cual va la figura. Si
     `tras` viene ausente o fuera de rango, la figura cae al final de la sección
     como antes: este cambio no puede dejar una imagen sin lugar.

     Las imágenes que comparten párrafo en el original (05/06 y 10/11) comparten
     `tras`: se pintan juntas porque JUNTAS VIENEN. Separarlas una por párrafo
     habría inventado un orden que el Word no tiene (DEC-82). */
  function seccionHTML(s) {
    /* nivel 3 = subsección. En este capítulo NO hay ninguna (el Word de ámbar
       no trae ni un subtítulo: es un bloque corrido de 9 párrafos), pero se
       conserva la rama para no divergir del patrón: si el dueño agrega
       subsecciones, se marcan con `nivel: 3` y ya. */
    var sub = s.nivel === 3;
    var parrafos = s.parrafos || [];

    /* Agrupar figuras por el párrafo tras el cual van. */
    var porIndice = {}, sueltas = [];
    (s.imagenes || []).forEach(function (im) {
      if (typeof im.tras === "number" && im.tras >= 0 && im.tras < parrafos.length) {
        (porIndice[im.tras] = porIndice[im.tras] || []).push(im);
      } else {
        sueltas.push(im);
      }
    });

    /* `eager` sólo para la PRIMERA figura de la sección. */
    var primera = true;
    var cuerpo = parrafos.map(function (p, idx) {
      var html = "<p>" + conCursivas(p) + "</p>";
      var grupo = porIndice[idx];
      if (grupo && grupo.length) {
        var gn = grupo.length >= 5 ? 5 : (grupo.length >= 3 ? 3 : grupo.length);
        html += '<div class="amb-figs amb-figs--' + gn + '">' +
          grupo.map(function (im) {
            var h = figuraHTML(im, primera ? 0 : 1);
            primera = false;
            return h;
          }).join("") + "</div>";
      }
      return html;
    }).join("");

    /* Las que no declaran `tras` (o apuntan fuera de rango) al final. */
    if (sueltas.length) {
      cuerpo += '<div class="amb-figs amb-figs--' +
        (sueltas.length >= 5 ? 5 : (sueltas.length >= 3 ? 3 : sueltas.length)) + '">' +
        sueltas.map(function (im) {
          var h = figuraHTML(im, primera ? 0 : 1);
          primera = false;
          return h;
        }).join("") + "</div>";
    }

    return '<section class="amb-sec' + (sub ? " amb-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
             '<h' + (sub ? "3" : "2") + ' class="amb-sec__t">' + conCursivas(s.titulo) +
               '</h' + (sub ? "3" : "2") + '>' +
             cuerpo +
           "</section>";
  }

  function pintarSecciones() {
    var cont = $("[data-amb-secciones]");
    if (!cont || !T.secciones) return;
    cont.innerHTML = T.secciones.map(seccionHTML).join("");
  }

  /* ---------- Cierre ---------- */
  function pintarCierre() {
    var cont = $("[data-amb-cierre]");
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
     roto, `window.DINOSAURIOS` no existe y el guard de arriba sale sin pintar —
     el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
