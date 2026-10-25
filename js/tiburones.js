/* ============================================================
   MPCH — Subpágina TIBURONES (tiburones.html)
   Pinta la página completa desde window.TIBURONES (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no se reusa js/amonites.js:
   amonites.js está envuelto en un IIFE cerrado sobre `window.AMMONITES` y con
   las clases `.tib-*` incrustadas en el HTML que genera. Parametrizarlo
   obligaba a refactorizar una página ya publicada y verificada (principio de
   mínima intervención). Se repite la parte mínima, igual que hicieron
   curriculum.js, trilobites.js y amonites.js con la suya.

   🔴 CONSECUENCIA A VIGILAR (ya documentada en trilobites.js): con este archivo
   hay CINCO copias del pintado del footer (render.js, curriculum.js,
   trilobites.js, amonites.js y este). Si cambia el pie de la portada, hay que
   cambiarlo en las cinco.

   🔴 DEC-83: esta página NO reusa las clases `.tri-*` ni las `.tib-*`. Un
   selector de una hoja compartida aplica a TODA página que reuse la clase — ya
   pasó con `.galeria__foto img` en CR-60e y costó dos intentos en el CSS
   equivocado. Acá el prefijo es `tib-` y la hoja es css/secciones/tiburones.css.

   ✅ Sin sección de atributos: las imágenes son del museo, no de Commons.
   `TIBURONES.atribucion` es null y esa sección no se pinta.
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
  var T = window.TIBURONES;
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

    var et = $("[data-tib-etiqueta]");  if (et) et.textContent = T.etiqueta;
    var ti = $("[data-tib-titulo]");    if (ti) ti.textContent = T.titulo;
    var ba = $("[data-tib-bajada]");    if (ba) ba.textContent = T.bajada;

    var vol = $("[data-tib-volver]");
    if (vol && T.volver) {
      vol.href = T.volver.enlace;
      var txt = $("[data-tib-volver-texto]");
      if (txt) txt.textContent = T.volver.texto;
    }

    var intro = $("[data-tib-intro]");
    if (intro && T.intro) intro.innerHTML = "<p>" + esc(T.intro) + "</p>";
  }

  /* ---------- Índice ----------
     Se arma desde las MISMAS secciones que se pintan abajo, así que no puede
     quedar desincronizado. Solo se listan las de nivel 2. */
  function pintarIndice() {
    var cont = $("[data-tib-indice]");
    if (!cont || !T.secciones) return;
    var principales = T.secciones.filter(function (s) { return s.nivel !== 3; });
    if (principales.length < 3) { cont.remove(); return; }
    cont.innerHTML =
      '<p class="tib-indice__t">En esta página</p>' +
      '<ul class="tib-indice__l">' +
        principales.map(function (s) {
          return '<li><a href="#' + esc(s.id) + '">' + tx(s.titulo) + "</a></li>";
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

     ⚠️ El pie y el crédito van JUNTOS en el mismo <figcaption>. En este Word
     17 de los 18 pies nombran autor (Matías Palma, Juan Castillo, José Lemos
     Caro), así que separar el crédito de la imagen sería atribución falsa. */
  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    /* ⚠️ CR-85: MEDIDO en este Word — la sección de megalodon trae CINCO imágenes
       (en ammonites el máximo era 3, por eso allá alcanzaba con --2/--3). Acá el
       tope sube a 5: sin esto, las cinco caían en una grilla de 3 columnas y
       quedaban 3 + 2 desbalanceadas. El CSS define --1, --2, --3 y --5. */
    var n = imgs.length >= 5 ? 5 : (imgs.length >= 3 ? 3 : imgs.length);
    return '<div class="tib-figs tib-figs--' + n + '">' +
      imgs.map(function (im, k) {
        var pie = im.pie ? tx(im.pie) : "";
        var dim = (im.ancho && im.alto)
          ? ' width="' + im.ancho + '" height="' + im.alto + '"' : "";
        var carga = k === 0 ? ' loading="eager"' : ' loading="lazy"';
        return '<figure class="tib-fig">' +
                 '<span class="tib-fig__marco">' +
                   '<img src="' + esc(im.src) + '"' + dim +
                     ' alt="' + esc(im.alt) + '"' + carga + ' decoding="async">' +
                 "</span>" +
                 (pie ? "<figcaption><b>" + pie + "</b></figcaption>" : "") +
               "</figure>";
      }).join("") +
    "</div>";
  }

  /* ---------- Secciones ---------- */
  function pintarSecciones() {
    var cont = $("[data-tib-secciones]");
    if (!cont || !T.secciones) return;
    cont.innerHTML = T.secciones.map(function (s) {
      /* nivel 3 = subsección. En este capítulo NO hay ninguna (el Word no trae
         subtítulos), pero se conserva la rama para no divergir del patrón: si
         el dueño agrega subsecciones, se marcan con `nivel: 3` y ya. */
      var sub = s.nivel === 3;
      var cuerpo = (s.parrafos || []).map(function (p) { return "<p>" + tx(p) + "</p>"; }).join("");
      return '<section class="tib-sec' + (sub ? " tib-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
               '<h' + (sub ? "3" : "2") + ' class="tib-sec__t">' + tx(s.titulo) +
                 '</h' + (sub ? "3" : "2") + '>' +
               cuerpo +
               figurasHTML(s.imagenes) +
             "</section>";
    }).join("");
  }

  /* ---------- Cierre ---------- */
  function pintarCierre() {
    var cont = $("[data-tib-cierre]");
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
     roto, `window.TIBURONES` no existe y el guard de arriba sale sin pintar —
     el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
