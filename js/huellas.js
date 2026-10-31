/* ============================================================
   MPCH — Subpágina HUELLAS (huellas.html)
   Pinta la página completa desde window.HUELLAS (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   CR-91 (2026-10-30) — OCTAVA subpágina del sitio.

   ------------------------------------------------------------
   ⚠️ Clon de js/dinosaurios.js (que a su vez lo es de js/ambar.js). Se repite la
   parte mínima en vez de parametrizar porque los siete renders anteriores están
   cerrados sobre su propia constante y refactorizarlos toca páginas ya
   publicadas (mínima intervención).

   🔴 TRAMPA PAGADA EN CR-87: al clonar una subpágina el `<script src>` se
   olvida y la página pinta los datos de la OTRA. Ya está corregido acá: este
   archivo se llama desde huellas.html y lee window.HUELLAS.

   🔴 CONSECUENCIA A VIGILAR: con este archivo hay OCHO copias del pintado del
   footer (render.js, curriculum.js, trilobites.js, amonites.js, tiburones.js,
   ambar.js, dinosaurios.js y este). Si cambia el pie, hay que cambiarlo en los
   ocho. El bloque de derechos (DEC-092) se agregó a los ocho en CR-90.

   🔴 DEC-090: reusa las clases `.amb-*` y la hoja `css/secciones/ambar.css`,
   cuyos 34 selectores llevan todos el prefijo `.amb-` (medido, sin un solo
   selector global).

   ✅ Sin sección de atributos: las imágenes son del museo y de sus
   colaboradores; los autores van en el pie de cada figura, como en el Word.

   🔴 DEC-82: las 23 figuras van en el ORDEN LITERAL del Word, numeradas 01..23
   por su posición real en word/document.xml.

   ------------------------------------------------------------
   CITA DE APERTURA (CR-91): esta página es la única con `cita` / `citaAutor`.
   El Word abre con una cita del autor firmada por él mismo ([P1] y [P2]); se
   pinta aparte del cuerpo, con el nombre debajo. Si el dato falta, la cita no
   se pinta y la página no se rompe.
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
  var T = window.HUELLAS;
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

    /* CR-91 — cita de apertura, firmada por el autor en el Word.
       Sólo existe en esta página; en las demás `T.cita` es undefined y el
       contenedor se retira para no dejar un hueco. */
    var cita = $("[data-amb-cita]");
    if (cita) {
      if (T.cita) {
        cita.innerHTML =
          '<blockquote class="amb-cita__texto">' + conCursivas(T.cita) + "</blockquote>" +
          (T.citaAutor ? '<p class="amb-cita__autor">' + esc(T.citaAutor) + "</p>" : "");
      } else {
        cita.remove();
      }
    }
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
     roto, `window.HUELLAS` no existe y el guard de arriba sale sin pintar —
     el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
