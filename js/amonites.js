/* ============================================================
   MPCH — Subpágina AMMONITES (amonites.html)
   Pinta la página completa desde window.AMMONITES (data/museo.js), la fuente
   única (DEC-005). No hay texto escrito a mano en el HTML.

   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no se reusa js/trilobites.js:
   trilobites.js está envuelto en un IIFE cerrado sobre `window.TRILOBITES` y
   con las clases `.tri-*` incrustadas en el HTML que genera. Parametrizarlo
   obligaba a refactorizar una página ya publicada y verificada (principio de
   mínima intervención). Se repite la parte mínima, igual que curriculum.js y
   trilobites.js repiten la suya.

   🔴 CONSECUENCIA A VIGILAR (ya documentada en trilobites.js): con este archivo
   hay CUATRO copias del pintado del footer (render.js, curriculum.js,
   trilobites.js, este). Si cambia el pie de la portada, hay que cambiarlo en
   los cuatro.

   🔴 DEC-83: esta página NO reusa las clases `.tri-*`. Un selector de una hoja
   compartida aplica a TODA página que reuse la clase — ya pasó con
   `.galeria__foto img` en CR-60e y costó dos intentos en el CSS equivocado.
   Acá el prefijo es `amo-` y la hoja es css/secciones/amonites.css.

   ✅ Sin sección de atributos: las imágenes son del museo, no de Commons.
   `AMMONITES.atribucion` es null y `pintarCreditos()` sale sin pintar.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var M = window.MUSEO;
  var A = window.AMMONITES;
  if (!M || !A) return;

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
    document.title = A.titulo + " — Colecciones | " + M.nombre;

    var et = $("[data-amo-etiqueta]");  if (et) et.textContent = A.etiqueta;
    var ti = $("[data-amo-titulo]");    if (ti) ti.textContent = A.titulo;
    var ba = $("[data-amo-bajada]");    if (ba) ba.textContent = A.bajada;

    var vol = $("[data-amo-volver]");
    if (vol && A.volver) {
      vol.href = A.volver.enlace;
      var txt = $("[data-amo-volver-texto]");
      if (txt) txt.textContent = A.volver.texto;
    }

    var intro = $("[data-amo-intro]");
    if (intro && A.intro) intro.innerHTML = "<p>" + esc(A.intro) + "</p>";
  }

  /* ---------- Índice ----------
     Se arma desde las MISMAS secciones que se pintan abajo, así que no puede
     quedar desincronizado. Solo se listan las de nivel 2: las de nivel 3 son
     subsecciones (los 4 pasos de la fosilización, las depositiones) y saturarían
     el índice. */
  function pintarIndice() {
    var cont = $("[data-amo-indice]");
    if (!cont || !A.secciones) return;
    var principales = A.secciones.filter(function (s) { return s.nivel !== 3; });
    if (principales.length < 3) { cont.remove(); return; }
    cont.innerHTML =
      '<p class="amo-indice__t">En esta página</p>' +
      '<ul class="amo-indice__l">' +
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

     ⚠️ El pie y el crédito van JUNTOS en el mismo <figcaption>. El Word trae
     dos pies con autor nombrado (Dactilioceras; «Ilustración José Lemos Caro»),
     y separar el crédito de la imagen sería atribución falsa. */
  function figurasHTML(imgs) {
    if (!imgs || !imgs.length) return "";
    /* El Word no trae ningún bloque de más de 3 imágenes (medido: máx 3, en
       «Hidrodinámica»), así que con `--2` y `--3` alcanza. Si algún día entra
       una sección con 4, hay que agregar `.amo-figs--4` en el CSS. */
    var n = imgs.length >= 3 ? 3 : imgs.length;
    return '<div class="amo-figs amo-figs--' + n + '">' +
      imgs.map(function (im, k) {
        var pie = im.pie ? esc(im.pie) : "";
        var dim = (im.ancho && im.alto)
          ? ' width="' + im.ancho + '" height="' + im.alto + '"' : "";
        var carga = k === 0 ? ' loading="eager"' : ' loading="lazy"';
        return '<figure class="amo-fig">' +
                 '<span class="amo-fig__marco">' +
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
    var cont = $("[data-amo-secciones]");
    if (!cont || !A.secciones) return;
    cont.innerHTML = A.secciones.map(function (s) {
      /* nivel 3 = subsección (los pasos de la fosilización, las depositiones,
         los bloques de la concha). Se pinta como encabezado menor con su
         filete, igual que `.tri-sec--sub` en trilobites. */
      var sub = s.nivel === 3;
      var cuerpo = (s.parrafos || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      return '<section class="amo-sec' + (sub ? " amo-sec--sub" : "") + ' reveal" id="' + esc(s.id) + '">' +
               '<h' + (sub ? "3" : "2") + ' class="amo-sec__t">' + esc(s.titulo) +
                 '</h' + (sub ? "3" : "2") + '>' +
               cuerpo +
               figurasHTML(s.imagenes) +
             "</section>";
    }).join("");
  }

  /* ---------- Cierre ---------- */
  function pintarCierre() {
    var cont = $("[data-amo-cierre]");
    if (!cont || !A.cierre) return;
    cont.innerHTML = "<p>" + esc(A.cierre.texto) + "</p>" +
      '<a class="btn btn--primario" href="' + esc(A.cierre.enlace) + '">' + esc(A.cierre.boton) +
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
     roto, `window.AMMONITES` no existe y el guard de arriba sale sin pintar —
     el mismo síntoma que en el resto del sitio, que es el correcto. */
  function init() { pintarTodo(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
