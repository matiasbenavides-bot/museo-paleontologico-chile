/* ============================================================
   MPCH — Subpágina TRILOBITES (trilobites.html)
   Pinta la página completa desde window.TRILOBITES (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   ------------------------------------------------------------
   ⚠️ Por qué repite el patrón de curriculum.js y no lo importa:
   curriculum.js está envuelto en un IIFE con sus pintores privados. No se
   puede reusar sin refactorizarlo, y refactorizarlo tocaría una página que
   ya está publicada y verificada (principio de mínima intervención). Así que
   este archivo repite la parte mínima —marca, footer— igual que curriculum.js
   repite la suya.
   🔴 CONSECUENCIA A VIGILAR, la misma que ya documenta curriculum.js: hay TRES
   copias del pintado del footer (render.js, curriculum.js, este archivo). Si
   cambia el pie de la portada, hay que cambiarlo en los tres. Son tres páginas
   y comparten cabecera y pie.

   ------------------------------------------------------------
   ✅ LO QUE SÍ VIENE DE LAS FICHAS, no de acá:
   el crédito de cada imagen sale de `assets/img/trilobites/creditos.json`
   (autor, licencia, enlace a Wikimedia Commons). Ese archivo lo genera
   /tmp/trilo/bajar-commons.py consultando la API de Commons. La sección de
   atributos se pinta desde ahí: si cambia una imagen, cambia el crédito solo.
   Se carga con fetch(), que necesita el sitio servido por HTTP. Si el fetch
   falla (p. ej. abriendo el archivo con doble clic, protocolo file://), la
   sección de atributos NO se deja vacía: cae al respaldo escrito en el data/.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  /* CR-86c — Cursivas para nombres científicos.
     `tx` pinta prosa del data/ permitiendo *cursiva* (ver js/texto.js).
     Si el módulo no cargó, cae en `esc` puro: el texto se ve sin cursiva pero
     NUNCA se rompe la página. */
  var tx = (window.TEXTO && window.TEXTO.conCursivas) || esc;

  var M = window.MUSEO;
  var T = window.TRILOBITES;
  if (!M || !T) return;

  /* Las fichas de crédito, indexadas por slug. Se llenan con fetch() más abajo;
     el render funciona igual sin ellas (usa `credito` del data/ como respaldo). */
  var FICHAS = {};

  /* ---------- Marca y footer (idéntico comportamiento a curriculum.js) ---------- */
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
  
    /* CR-90 (2026-10-30) — DERECHOS DE LOS TEXTOS (DEC-092).
        El dueño pidió: «en todos los textos pon derechos del dueño que sería
        Juan Castillo Cornejo por sacar los textos de sus propios libros», y
        después precisó que NO se mencionen los libros: «algo como escrito por
        Juan...». El texto vive en el data/ (DEC-005) y es el MISMO en las 9
        páginas. Va en su propio bloque, arriba del copyright del museo, que no
        se toca. Si el dato falta, el bloque se queda vacío: no hay texto
        inventado de respaldo. */
    var der = $("[data-footer-derechos]");
    if (der && M.derechos) { der.textContent = M.derechos; }
  }

  /* ---------- Cabecera de la página ---------- */
  function pintarCabeza() {
    document.title = T.titulo + " — Colecciones | " + M.nombre;

    var et = $("[data-tri-etiqueta]");  if (et) et.textContent = T.etiqueta;
    var ti = $("[data-tri-titulo]");    if (ti) ti.textContent = T.titulo;
    var ba = $("[data-tri-bajada]");    if (ba) ba.textContent = T.bajada;

    var vol = $("[data-tri-volver]");
    if (vol && T.volver) {
      vol.href = T.volver.enlace;
      var txt = $("[data-tri-volver-texto]");
      if (txt) txt.textContent = T.volver.texto;
    }

    var intro = $("[data-tri-intro]");
    if (intro && T.intro) intro.innerHTML = "<p>" + esc(T.intro) + "</p>";
  }

  /* ---------- Índice ----------
     Se arma desde las MISMAS secciones que se pintan abajo, así que no puede
     quedar desincronizado. Solo se listan las de nivel 2 (las de nivel 3 son
     subsecciones de Anatomía y saturarían el índice). */
  function pintarIndice() {
    var cont = $("[data-tri-indice]");
    if (!cont || !T.secciones) return;
    var principales = T.secciones.filter(function (s) { return s.nivel !== 3; });
    if (principales.length < 3) { cont.remove(); return; }
    cont.innerHTML =
      '<p class="tri-indice__t">En esta página</p>' +
      '<ul class="tri-indice__l">' +
        principales.map(function (s) {
          return '<li><a href="#' + esc(s.id) + '">' + tx(s.titulo) + "</a></li>";
        }).join("") +
      "</ul>";
  }

  /* ---------- Figuras ----------
     `ancho`/`alto` van SIEMPRE en el <img>: sin ellos el navegador no reserva
     el espacio y la página da un salto al cargar (CLS). Los valores salen
     medidos del archivo real, están en el data/.
     CR-60d (2026-10-15): `loading="lazy"` se conserva SOLO de la tercera figura
     en adelante. Medido en celular: con lazy en todas, las últimas (isotelus)
     quedaban sin cargar y su marco se veía vacío. Las dos primeras se cargan
     siempre (`eager`), porque son las que el usuario ve al entrar. */
  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    /* 🔴 CR-81 (2026-10-19): el tope era 3, pero el Word del museo trae un
       bloque de CUATRO imágenes (image14..17, en «La zona caudal o pigidio»).
       Con el tope en 3, la cuarta salía en una fila propia y suelta.
       Ahora se respeta el número real de imágenes del bloque (máximo 4, que es
       lo que existe en el documento). Si algún día un bloque trae 5, hay que
       agregar `.tri-figs--5` en el CSS. */
    var n = imgs.length >= 4 ? 4 : imgs.length;
    return '<div class="tri-figs tri-figs--' + n + '">' +
      imgs.map(function (im, k) {
        var f = FICHAS[im.credito] || {};
        var pie = im.pie ? tx(im.pie) : "";
        var cred = f.autor ? '<span class="tri-fig__cred">' + esc(f.autor) + "</span>" : "";
        var dim = (im.ancho && im.alto)
          ? ' width="' + im.ancho + '" height="' + im.alto + '"' : "";
        var carga = k < 2 ? ' loading="eager"' : ' loading="lazy"';
        return '<figure class="tri-fig">' +
                 '<span class="tri-fig__marco">' +
                   '<img src="' + esc(im.src) + '"' + dim +
                     ' alt="' + esc(im.alt) + '"' + carga + ' decoding="async">' +
                 "</span>" +
                 (pie || cred
                   ? "<figcaption>" + (pie ? "<b>" + pie + "</b>" : "") +
                     (pie && cred ? " " : "") + cred + "</figcaption>"
                   : "") +
               "</figure>";
      }).join("") +
    "</div>";
  }

  /* ---------- Leyenda de los numeros del diagrama (CR-65, 2026-10-16) ----------
     Los SVG vienen de Commons con los numeros DIBUJADOS pero sin los nombres
     (verificado: `<text>` con "1".."10" y ningun nombre). La leyenda los traduce:
     numero -> nombre en espanol + nombre en ingles. Datos en `data/museo.js`.

     🔴 POR QUE ES UNA CARD APARTE Y NO VA EN EL <figcaption> (medido, y el dueno
     lo reporto como «muy grueso»): dentro del pie, la leyenda y la imagen
     comparten la MISMA caja, y el pie llego a medir el 60% de la card en
     celular (418px de pie contra 700px de card a 390px de ancho) — el pie
     terminaba siendo mas grande que la imagen. Como card propia:
       - la figura vuelve a su alto de antes;
       - la leyenda usa el ANCHO COMPLETO de la seccion y despliega sus
         columnas de verdad (medido: 739px de ancho a 1280).
     ⚠️ Va PEGADA a su figura (el dueno lo pidio asi): el cefalon tiene 10 areas
       y el cranidio 3, y hay que poder ver cual leyenda es de cual dibujo.
     ⚠️ Va FUERA del `.tri-figs` (la grilla de figuras), para que no entre como
       una figura mas de la grilla ni herede su ancho acotado. */
  function leyendasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    return imgs.map(function (im) {
      if (!im.leyenda || !im.leyenda.length) return "";
      return '<aside class="tri-leyenda reveal" aria-label="Numeración del diagrama">' +
        '<p class="tri-leyenda__t">Numeración del diagrama</p>' +
        '<ul class="tri-leyenda__lista">' +
          im.leyenda.map(function (it) {
            return "<li>" +
              '<b class="tri-leyenda__n">' + esc(it.n) + "</b>" +
              '<span class="tri-leyenda__es">' + esc(it.es) + "</span>" +
              '<span class="tri-leyenda__en">' + esc(it.en) + "</span>" +
              "</li>";
          }).join("") +
        "</ul>" +
      "</aside>";
    }).join("");
  }

  /* ---------- Secciones ---------- */
  function pintarSecciones() {
    var cont = $("[data-tri-secciones]");
    if (!cont || !T.secciones) return;
    cont.innerHTML = T.secciones.map(function (s) {
      /* Anatomía es un título de grupo sin párrafos: se pinta como encabezado
         de bloque, no como sección con cuerpo. */
      var sub = s.nivel === 3;
      var cuerpo = (s.parrafos || []).map(function (p) { return "<p>" + tx(p) + "</p>"; }).join("");
      return '<section class="tri-sec' + (sub ? " tri-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
               '<h' + (sub ? "3" : "2") + ' class="tri-sec__t">' + tx(s.titulo) +
                 '</h' + (sub ? "3" : "2") + '>' +
               cuerpo +
               figurasHTML(s.imagenes) +
               leyendasHTML(s.imagenes) +
             "</section>";
    }).join("");
  }

  /* ---------- Sección de atributos ----------
     Pedido textual del dueño. Cada imagen con su autor, su licencia y el enlace
     a su ficha en Commons. Se recorren las imágenes REALMENTE usadas por las
     secciones: si una imagen deja de usarse, su crédito desaparece solo. */
  function pintarCreditos() {
    var cont = $("[data-tri-creditos]");
    if (!cont || !T.atribucion) return;

    /* slugs usados, sin repetir, en el orden en que aparecen */
    var vistos = [], orden = [];
    (T.secciones || []).forEach(function (s) {
      (s.imagenes || []).forEach(function (im) {
        if (im.credito && vistos.indexOf(im.credito) === -1) {
          vistos.push(im.credito); orden.push(im.credito);
        }
      });
    });

    var items = orden.map(function (slug) {
      var f = FICHAS[slug];
      if (!f) return "";
      return "<li>" +
               '<span class="tri-creditos__a">' + esc(f.autor || "Autor no declarado") + "</span>" +
               ' <span class="tri-creditos__m">— ' + esc(f.descripcion || f.tituloCommons || slug) + "</span><br>" +
               '<a class="tri-creditos__m" href="' + esc(f.pagina) + '" target="_blank" rel="noopener noreferrer">' +
                 esc(f.tituloCommons || slug) + "</a>" +
               '<span class="tri-creditos__lic">' + esc(f.licencia) + "</span>" +
             "</li>";
    }).join("");

    cont.innerHTML =
      '<h2 class="tri-creditos__t" id="tri-creditos-t">' + esc(T.atribucion.titulo) + "</h2>" +
      (T.atribucion.intro ? '<p class="tri-creditos__m">' + esc(T.atribucion.intro) + "</p>" : "") +
      (T.notaImagenes ? '<p class="tri-creditos__nota">' + esc(T.notaImagenes) + "</p>" : "") +
      (items ? '<ul class="tri-creditos__l">' + items + "</ul>" : "") +
      (T.atribucion.fuente
        ? '<p class="tri-creditos__fuente"><a href="' + esc(T.atribucion.fuente.url) +
          '" target="_blank" rel="noopener noreferrer">' + esc(T.atribucion.fuente.texto) + "</a></p>"
        : "");
  }

  /* ---------- Cierre ---------- */
  function pintarCierre() {
    var cont = $("[data-tri-cierre]");
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
    pintarCreditos();
    pintarCierre();
    pintarFooter();
    /* animaciones.js escucha este evento para re-enganchar los reveals. */
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  /* Las fichas de licencia son un JSON separado. Se carga PRIMERO y luego se
     pinta: si se pintara antes, los créditos saldrían sin autor.
     ⚠️ Si el fetch falla (file://, o el archivo no está), NO se cae la página:
     se pinta sin las fichas y el pie de cada figura queda con lo que traiga el
     data/. Un solo camino de falla, y visible en consola. */
  function init() {
    var listo = false;
    try {
      fetch("assets/img/trilobites/creditos.json")
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (arr) {
          arr.forEach(function (f) { FICHAS[f.slug] = f; });
        })
        .catch(function (e) {
          /* Sin fichas: la página se pinta igual, pero hay que enterarse. */
          console.warn("MPCH: no se pudieron cargar los créditos de las imágenes (" + e.message +
                       "). La sección de atributos queda incompleta.");
        })
        .then(function () { if (!listo) { listo = true; pintarTodo(); } });
    } catch (e) {
      pintarTodo();
      return;
    }
    /* Red de seguridad: si el fetch tarda demasiado, se pinta igual sin fichas
       en vez de dejar la página vacía. */
    setTimeout(function () { if (!listo) { listo = true; pintarTodo(); } }, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
