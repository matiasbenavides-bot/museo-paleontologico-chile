/* ============================================================
   MPCH — Subpágina PROYECTO C.E.C (proyecto-cec.html)
   Pinta la página desde window.CEC (data/museo.js), la fuente única (DEC-005).
   El material es del Centro, transcrito por ejes; el agente no redacta prosa
   (regla DEC-034). Acá no hay texto escrito a mano salvo los rótulos de eje.

   ------------------------------------------------------------
   ⚠️ Tercera copia del pintado de marca + footer. Las otras dos son render.js
   (portada) y curriculum.js (subpágina del director). curriculum.js ya
   documenta esta misma consecuencia; se repite acá por la misma razón: son
   IIFEs con pintores privados y refactorizarlos tocaría páginas ya publicadas
   (principio de mínima intervención).
   🔴 CONSECUENCIA A VIGILAR: si cambia el pie de la portada, hay que cambiarlo
   en LOS CUATRO archivos (render.js, curriculum.js, trilobites.js, cec.js).

   ------------------------------------------------------------
   🔴 LO QUE ESTA PÁGINA NO PUBLICA, y no se debe "arreglar" sin autorización:
     1. Ilustraciones de Jorge Aragón Palacios — el material las marca
        «copyrights» y el dueño confirmó que no hay autorización (DEC-027).
     2. `cepchile@gmail.com` — declarado OBSOLETO en el sitio (CR-04).
     3. Nombres de personas de terceros (DEC-041).
     4. Alianzas comerciales y pertenencia institucional (DEC-041).
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var ico = function (n) { return (window.ICONOS && window.ICONOS[n]) || ""; };
  var M = window.MUSEO;
  var C = window.CEC;
  if (!M || !C) return;

  /* ---------- CR-71 (2026-10-17): LA SUBPÁGINA ESTÁ OCULTA ----------
     El dueño pidió «borremos c.e.c o quitemos del publico, hare cambios» y
     eligió OCULTAR (reversible). `CEC_SUBPAGINA.visible = false` hace DOS
     cosas: la portada deja de enlazar acá (lo hace js/render.js) y esta página
     rebota al inicio cuando alguien entra por URL directa o por un enlace
     viejo compartido.

     ⚠️ POR QUE REBOTAR Y NO SOLO DESENLAZAR: el sitio es GitHub Pages y este
     archivo sigue publicado. Dejar de enlazarlo NO lo saca del público: la URL
     responde igual. Si sólo se quitaran los enlaces, la página seguiría
     visible para cualquiera que tuviera el enlace guardado.
     ⚠️ POR QUE `replace` Y NO `href=`: `location.replace` no deja la
     subpágina en el historial, así que el botón "atrás" del visitante no lo
     devuelve a una página que ya no debe verse.
     🔓 PARA REACTIVAR: `CEC_SUBPAGINA.visible: true` en data/museo.js y listo:
     este bloque deja de ejecutarse y la página se pinta normal otra vez. */
  if (window.CEC_SUBPAGINA && window.CEC_SUBPAGINA.visible === false) {
    window.location.replace("index.html");
    return;
  }

  /* ---------- Marca y footer (mismo comportamiento que curriculum.js) ---------- */
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

  /* ---------- Cabecera ---------- */
  function pintarCabeza() {
    document.title = C.titulo + " | " + M.nombre;

    var et = $("[data-cec-etiqueta]"); if (et) et.textContent = C.etiqueta;
    var ti = $("[data-cec-titulo]");   if (ti) ti.textContent = C.titulo;
    var ba = $("[data-cec-bajada]");   if (ba) ba.textContent = C.bajada;

    var vol = $("[data-cec-volver]");
    if (vol && C.volver) {
      vol.href = C.volver.enlace;
      var t = $("[data-cec-volver-texto]");
      if (t) t.textContent = C.volver.texto;
    }

    var intro = $("[data-cec-intro]");
    if (intro) intro.innerHTML = (C.intro || []).map(function (p) {
      return "<p>" + esc(p) + "</p>";
    }).join("");

    /* La relación con el museo. Es la aclaración que el dueño tuvo que dar, así
       que va destacada y NO como nota al pie. */
    /* CR-63: las CIFRAS, para que la página no sea solo texto.
       Los valores salen de CEC.cifras (data/museo.js), textuales del material.
       Se pintan en la cabecera, antes de la intro larga: es lo que da contexto
       de un golpe a quien llega sin saber qué es el Centro. */
    var cif = $("[data-cec-cifras]");
    if (cif) {
      if (C.cifras && C.cifras.length) {
        cif.innerHTML = C.cifras.map(function (c) {
          return '<div class="cec-cifra">' +
                   '<span class="cec-cifra__ico" aria-hidden="true">' + ico(c.icono) + "</span>" +
                   '<span class="cec-cifra__num">' + esc(c.valor) +
                     '<span class="cec-cifra__ud">' + esc(c.unidad) + "</span></span>" +
                   '<span class="cec-cifra__det">' + esc(c.detalle) + "</span>" +
                 "</div>";
        }).join("");
      } else {
        /* CR-72: sin cifras en el data (el Word del dueño no las trae), se RETIRA
           el contenedor. Medido: quedaba como una caja de 1132x0 px, o sea una
           franja vacía que empujaba el resto de la cabecera. */
        cif.remove();
      }
    }

    /* ⚠️ CR-72 (2026-10-17): si NO hay `relacion` en el data, hay que RETIRAR el
       nodo, no dejarlo vacío.
       El div vive en proyecto-cec.html con la clase `glass` (fondo, borde,
       desenfoque). Sin contenido queda una CAJA VACÍA pintada en la página — el
       dueño la vio y la reportó: «hay una card vacia ahi». Con sólo «no pintar
       nada» el hueco se queda. Se quita del DOM.
       Hoy `CEC.relacion` es null porque el Word ya dice en su primera frase
       quién desarrolla el proyecto (Museo + GeoPaleo): repetirlo era decir dos
       veces lo mismo. */
    var rel = $("[data-cec-relacion]");
    if (rel) {
      if (C.relacion) {
        rel.innerHTML =
          '<h2 class="cec-relacion__t">' + esc(C.relacion.titulo) + "</h2>" +
          "<p>" + esc(C.relacion.texto) + "</p>" +
          (C.relacion.nota ? '<p class="cec-relacion__nota">' + esc(C.relacion.nota) + "</p>" : "");
      } else {
        /* Se retira el nodo Y su envoltorio `.cec-cabeza__texto`, que existe
           sólo para darle columna de texto: si quedara, sería otro div vacío. */
        var caja = rel.parentElement;
        if (caja && caja.classList.contains("cec-cabeza__texto") && caja.children.length === 1) {
          caja.remove();
        } else {
          rel.remove();
        }
      }
    }
  }

  /* Título de bloque CON su ícono. El ícono sale de `icono` en el data/, así
     que cada eje tiene el suyo y no se repite el mismo dibujo en los cinco.
     ⚠️ Se usa `aria-hidden` en el ícono: es decorativo, el título ya dice qué es. */
  function tituloBloque(d) {
    return '<h2 class="cec-bloque__t">' +
             (d.icono ? '<span class="cec-bloque__ico" aria-hidden="true">' + ico(d.icono) + "</span>" : "") +
             "<span>" + esc(d.titulo) + "</span>" +
           "</h2>";
  }

  /* ---------- Índice ----------
     Se arma desde la MISMA lista de bloques que se pintan abajo, así que no
     puede quedar desincronizado. */
  /* Los ejes de la página, en orden. Cada uno arrastra su ícono desde el data/,
     así el índice y el título del bloque muestran SIEMPRE el mismo dibujo. */
  function bloques() {
    /* CR-72: la lista se arma sólo con las secciones que EXISTEN en el data.
       Antes estaba escrita a mano con las cinco de siempre, y el Word nuevo no
       trae publicaciones / aves del terror / difusión: el índice habría
       linkeado a anclas inexistentes. */
    var l = [];
    if (C.actividades)      l.push({ id: "actividades",      titulo: C.actividades.titulo,      icono: C.actividades.icono });
    if (C.museoItinerante) l.push({ id: "museo-itinerante", titulo: C.museoItinerante.titulo, icono: C.museoItinerante.icono });
    if (C.establecimientos) l.push({ id: "establecimientos", titulo: C.establecimientos.titulo, icono: C.establecimientos.icono });
    if (C.publicaciones)   l.push({ id: "publicaciones",    titulo: C.publicaciones.titulo,    icono: C.publicaciones.icono });
    if (C.avesDelTerror)   l.push({ id: "aves-del-terror",  titulo: C.avesDelTerror.titulo,    icono: C.avesDelTerror.icono });
    if (C.difusion)        l.push({ id: "difusion",         titulo: C.difusion.titulo,         icono: C.difusion.icono });
    return l;
  }

  function pintarIndice() {
    var cont = $("[data-cec-indice]");
    if (!cont) return;
    cont.innerHTML =
      '<p class="cec-indice__t">En esta página</p>' +
      '<ul class="cec-indice__l">' +
        bloques().map(function (b) {
          return '<li><a href="#' + esc(b.id) + '">' +
                   (b.icono ? '<span class="cec-indice__ico" aria-hidden="true">' + ico(b.icono) + "</span>" : "") +
                   "<span>" + esc(b.titulo) + "</span></a></li>";
        }).join("") +
      "</ul>";
  }

  /* ---------- Bloque: museo itinerante ---------- */
  function htmlItinerante() {
    var d = C.museoItinerante;
    return '<section class="cec-bloque reveal" id="museo-itinerante">' +
      tituloBloque(d) +
      (d.subtitulo ? '<p class="cec-bloque__sub">' + esc(d.subtitulo) + "</p>" : "") +
      d.parrafos.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    "</section>";
  }

  /* ---------- Bloque: actividades ----------
     CR-64 (2026-10-15): el dueño reportó que la página "se ve como si fuera de
     celular" en PC. MEDIDO: cada actividad era una tarjeta de 363px de ancho con
     300-800 caracteres, o sea 537px de texto en una columna angosta; las 10
     tarjetas sumaban 2211px de grilla. Columnas altas y angostas = sensación de
     móvil, aunque la maquetación estuviera bien.

     ⇒ Se pasa de TARJETAS APILADAS a LISTA ESCANEABLE: cada actividad es una
       fila a ancho completo, con el NOMBRE a la izquierda (columna fija) y el
       texto a la derecha. Así el ojo barre la lista de nombres, y quien quiere
       el detalle lo lee en la fila. El texto NO se recorta ni se resume: se
       reacomoda (regla DEC-034: no se reescribe el texto del Centro).
     ⚠️ El número de orden (01, 02...) se agrega para que la lista se pueda
       recorrer de un vistazo. Es un rótulo, no contenido. */
  function htmlActividades() {
    var d = C.actividades;
    return '<section class="cec-bloque reveal" id="actividades">' +
      tituloBloque(d) +
      (d.intro ? '<p class="cec-bloque__intro">' + esc(d.intro) + "</p>" : "") +
      '<ol class="cec-actividades">' +
        d.items.map(function (a, i) {
          return '<li class="cec-actividad">' +
                   '<div class="cec-actividad__cab">' +
                     '<span class="cec-actividad__n" aria-hidden="true">' +
                       (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" +
                     '<h3 class="cec-actividad__t">' + esc(a.titulo) + "</h3>" +
                   "</div>" +
                   '<div class="cec-actividad__cuerpo">' +
                     /* CR-72: el data nuevo trae `texto`; se acepta también
                        `detalle` (forma vieja) para no romper si vuelve. */
                     '<p class="cec-actividad__detalle">' + esc(a.texto || a.detalle || "") + "</p>" +
                     (a.parrafos || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
                     /* CR-73: foto opcional del programa. `loading=lazy` porque
                        están más abajo del pliegue. */
                     (a.foto
                       ? '<figure class="cec-actividad__fig">' +
                           '<img class="cec-actividad__img" src="' + esc(a.foto) + '" alt="' + esc(a.fotoAlt || "") + '" loading="lazy" decoding="async">' +
                         "</figure>"
                       : "") +
                   "</div>" +
                 "</li>";
        }).join("") +
      "</ol>" +
    "</section>";
  }

  /* ---------- Bloque: dónde se ha realizado (CR-72, nuevo) ----------
     El último párrafo del Word del dueño nombra los establecimientos donde el
     proyecto ya se hizo. Se pinta como lista de nombres, no como párrafo
     corrido: es lo que un colegio busca («¿ya fueron a algún lado?»).
     ⚠️ El «etc.» del Word se conserva como nota al pie: el dueño no cerró la
     enumeración y completarla sería inventar establecimientos. */
  function htmlEstablecimientos() {
    var d = C.establecimientos;
    return '<section class="cec-bloque reveal" id="establecimientos">' +
      tituloBloque(d) +
      (d.intro ? '<p class="cec-bloque__intro">' + esc(d.intro) + "</p>" : "") +
      '<ul class="cec-establecimientos">' +
        d.items.map(function (n) {
          return '<li><span class="cec-establecimientos__ico" aria-hidden="true">' +
                   ico(d.icono || "check") + "</span><span>" + esc(n) + "</span></li>";
        }).join("") +
      "</ul>" +
      (d.nota ? '<p class="cec-bloque__nota">' + esc(d.nota) + "</p>" : "") +
      /* CR-73: galería de la muestra en colegios. Va DEBAJO de la lista de
         nombres, no intercalada: el dato primero (¿vinieron a algún lado?), la
         evidencia después. `loading=lazy` en todas. */
      (d.fotos && d.fotos.length
        ? '<div class="cec-galeria">' +
            d.fotos.map(function (f) {
              return '<figure class="cec-galeria__fig">' +
                       '<img class="cec-galeria__img" src="' + esc(f.src) + '" alt="' + esc(f.alt || "") + '" loading="lazy" decoding="async">' +
                     "</figure>";
            }).join("") +
          "</div>"
        : "") +
    "</section>";
  }

  /* ---------- Bloque: publicaciones ----------
     Lista bibliográfica. El orden es el del material: cronológico. */
  function htmlPublicaciones() {
    var d = C.publicaciones;
    return '<section class="cec-bloque reveal" id="publicaciones">' +
      tituloBloque(d) +
      (d.intro ? '<p class="cec-bloque__intro">' + esc(d.intro) + "</p>" : "") +
      /* CR-63: ficha COMPACTA. Antes cada trabajo gastaba 3 <p> (título,
         autores, fuente) y el bloque llegaba a 22 párrafos para 7 artículos,
         inflando el alto. Ahora son 2 líneas: título arriba, y autores y fuente
         en UNA línea separada con un punto medio. El dato es el mismo; lo que
         cambia es cuánto espacio ocupa. */
      '<ol class="cec-pubs">' +
        d.items.map(function (p) {
          return '<li class="cec-pub">' +
                   '<span class="cec-pub__anio">' + esc(p.anio) + "</span>" +
                   '<div class="cec-pub__cuerpo">' +
                     '<span class="cec-pub__titulo">' + esc(p.titulo) + "</span>" +
                     '<span class="cec-pub__meta">' + esc(p.autores) +
                       ' <span class="cec-pub__sep">·</span> ' +
                       '<span class="cec-pub__fuente">' + esc(p.fuente) + "</span></span>" +
                   "</div>" +
                 "</li>";
        }).join("") +
      "</ol>" +
    "</section>";
  }

  /* ---------- Bloque: aves del terror ---------- */
  function htmlAves() {
    var d = C.avesDelTerror;
    return '<section class="cec-bloque reveal" id="aves-del-terror">' +
      tituloBloque(d) +
      (d.subtitulo ? '<p class="cec-bloque__sub">' + esc(d.subtitulo) + "</p>" : "") +
      d.parrafos.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    "</section>";
  }

  /* ---------- Bloque: difusión ---------- */
  function htmlDifusion() {
    var d = C.difusion;
    return '<section class="cec-bloque reveal" id="difusion">' +
      tituloBloque(d) +
      (d.intro ? '<p class="cec-bloque__intro">' + esc(d.intro) + "</p>" : "") +
      '<ul class="cec-medios">' +
        d.items.map(function (m) {
          return "<li>" +
                   '<span class="cec-medio">' + esc(m.medio) + "</span>" +
                   '<span class="cec-medio__detalle">' + esc(m.detalle) + "</span>" +
                 "</li>";
        }).join("") +
      "</ul>" +
    "</section>";
  }

  function pintarBloques() {
    var cont = $("[data-cec-bloques]");
    if (!cont) return;
    /* CR-72 (2026-10-17): cada bloque se pinta SÓLO si su dato existe.
       El Word del dueño no trae publicaciones, difusión ni aves del terror, así
       que esas claves quedaron en `null`. Sin estos guardas, la página
       reventaría al leer `.titulo` de null.
       ⚠️ El orden es el del DOCUMENTO del dueño:
          muestra itinerante -> programas -> la muestra -> dónde se ha realizado
       (antes era otro orden, el del material viejo del Centro). */
    /* ⚠️ ORDEN = el del DOCUMENTO del dueño (CR-72):
         programas (las 5 líneas) -> la muestra -> dónde se ha realizado
       ⚠️ El índice se arma de la MISMA lista (ver `bloques()`), así que estos
       dos órdenes no pueden divergir; si se cambia uno, cambian los dos. */
    cont.innerHTML =
      (C.actividades ? htmlActividades() : "") +
      (C.museoItinerante ? htmlItinerante() : "") +
      (C.establecimientos ? htmlEstablecimientos() : "") +
      (C.publicaciones ? htmlPublicaciones() : "") +
      (C.avesDelTerror ? htmlAves() : "") +
      (C.difusion ? htmlDifusion() : "");
  }

  function pintarCierre() {
    var cont = $("[data-cec-cierre]");
    if (!cont || !C.cierre) return;
    cont.innerHTML = "<p>" + esc(C.cierre.texto) + "</p>" +
      '<a class="btn btn--primario" href="' + esc(C.cierre.enlace) + '">' + esc(C.cierre.boton) +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
  }

  function init() {
    pintarMarca();
    pintarCabeza();
    pintarIndice();
    pintarBloques();
    pintarCierre();
    pintarFooter();
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
