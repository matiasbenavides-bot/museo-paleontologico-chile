/* ============================================================
   MPCH — Subpágina ÁMBAR (ambar.html)
   Pinta la página completa desde window.AMBAR (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   CR-86 (2026-10-24) — SEXTA subpágina del sitio.

   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no se reusa js/tiburones.js:
   tiburones.js está envuelto en un IIFE cerrado sobre `window.TIBURONES` y con
   las clases `.tib-*` incrustadas en el HTML que genera. Parametrizarlo obligaba
   a refactorizar una página ya publicada y verificada (principio de mínima
   intervención). Se repite la parte mínima, igual que hicieron curriculum.js,
   trilobites.js, amonites.js y tiburones.js con la suya.

   🔴 CONSECUENCIA A VIGILAR (ya documentada en trilobites.js y tiburones.js):
   con este archivo hay SEIS copias del pintado del footer (render.js,
   curriculum.js, trilobites.js, amonites.js, tiburones.js y este). Si cambia el
   pie de la portada, hay que cambiarlo en las seis.

   🔴 DEC-83: esta página NO reusa las clases `.tri-*`, `.amo-*` ni `.tib-*`.
   Un selector de una hoja compartida aplica a TODA página que reuse la clase —
   ya pasó con `.galeria__foto img` en CR-60e y con `.perfil__libros` en CR-69,
   y cada vez costó intentos en el CSS equivocado. Acá el prefijo es `amb-` y la
   hoja es css/secciones/ambar.css.

   ✅ Sin sección de atributos: las imágenes son del museo, no de Commons.
   `AMBAR.atribucion` es null y esa sección no se pinta.

   🔴 DEC-82: las 11 figuras van en el ORDEN LITERAL del Word, numeradas 01..11
   por su posición real en word/document.xml. NO reordenar por tamaño ni por
   criterio visual: rompe la correspondencia imagen <-> párrafo.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- Cursivas para nombres científicos (CR-86b) ----------
     Pedido del dueño: «para cualquier nombre científico se usan cursiva».

     CÓMO FUNCIONA, y por qué así:
       1. El data/ marca el nombre con asteriscos:  `*Pinus succinifera*`
       2. Primero se ESCAPA todo el párrafo con `esc()` — así ningún `<` del
          texto puede colarse como etiqueta.
       3. SÓLO DESPUÉS se cambian los asteriscos por `<i>`.

     🔴 El orden importa y no es negociable. Si se marcara antes de escapar, un
     `<script>` escrito en el data/ sobreviviría como HTML y esto sería una vía de
     inyección. Al revés —escapar y recién entonces sustituir— lo único que puede
     aparecer en el resultado es `<i>` y `</i>`, que los escribe esta función.
     El data/ es de confianza, pero el patrón queda seguro igual.

     ⚠️ Los asteriscos NO pueden anidarse ni quedar sueltos: se convierten por
     pares. Si un párrafo trae un `*` impar, ese queda literal — preferible un
     asterisco visible a una etiqueta abierta sin cerrar. */
  var conCursivas = function (s) {
    return esc(s).replace(/\*([^*]+)\*/g, "<i>$1</i>");
  };
  var M = window.MUSEO;
  var T = window.AMBAR;
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
          return '<li><a href="#' + esc(s.id) + '">' + esc(s.titulo) + "</a></li>";
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
  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    /* ⚠️ CR-86b (2026-10-24): el dueño pidió las 11 fotos SIN descripción. Los
       `alt` que había eran inventados por el agente (no ve las imágenes), así que
       se quitaron del data/. Acá se emite `alt=""`, que marca la figura como
       DECORATIVA: es lo correcto cuando no hay descripción autorizada — ni deja
       un alt inventado ni deja el atributo ausente (obligatorio en HTML).
       🔴 NO reponer descripciones sin que el dueño las dicte.
       Si algún día las dicta, se agregan como `alt:` en el data/ y esta línea
       pasa a usar `esc(im.alt)`. */
    var altDe = function (im) { return im.alt ? esc(im.alt) : ""; };

    /* ⚠️ CR-86: en este capítulo el máximo de figuras por sección es TRES
       (sección «De dónde viene» y «La Expo Ámbar»). No hay ninguna de cinco como
       en tiburones, pero se conserva la rama para no divergir del patrón: si el
       dueño agrega más material, se marca solo. */
    var n = imgs.length >= 5 ? 5 : (imgs.length >= 3 ? 3 : imgs.length);
    var n = imgs.length >= 5 ? 5 : (imgs.length >= 3 ? 3 : imgs.length);
    return '<div class="amb-figs amb-figs--' + n + '">' +
      imgs.map(function (im, k) {
        var pie = im.pie ? esc(im.pie) : "";
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
      }).join("") +
    "</div>";
  }

  /* ---------- Secciones ---------- */
  function pintarSecciones() {
    var cont = $("[data-amb-secciones]");
    if (!cont || !T.secciones) return;
    cont.innerHTML = T.secciones.map(function (s) {
      /* nivel 3 = subsección. En este capítulo NO hay ninguna (el Word de ámbar
         no trae ni un subtítulo: es un bloque corrido de 9 párrafos), pero se
         conserva la rama para no divergir del patrón: si el dueño agrega
         subsecciones, se marcan con `nivel: 3` y ya. */
      var sub = s.nivel === 3;
      var cuerpo = (s.parrafos || []).map(function (p) { return "<p>" + conCursivas(p) + "</p>"; }).join("");
      return '<section class="amb-sec' + (sub ? " amb-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
               '<h' + (sub ? "3" : "2") + ' class="amb-sec__t">' + esc(s.titulo) +
                 '</h' + (sub ? "3" : "2") + '>' +
               cuerpo +
               figurasHTML(s.imagenes) +
             "</section>";
    }).join("");
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
     roto, `window.AMBAR` no existe y el guard de arriba sale sin pintar —
     el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
