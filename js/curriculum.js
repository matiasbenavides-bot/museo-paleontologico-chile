/* ============================================================
   MPCH — Subpágina del director
   Pinta la ficha desde MUSEO.director (data/museo.js), la fuente única
   (DEC-005). No hay texto escrito a mano en el HTML.
   ------------------------------------------------------------
   ⚠️ Por qué es un archivo aparte y no una copia de render.js:
   render.js está envuelto en un IIFE y sólo busca nodos de LA PORTADA
   (67 selectores con `return` temprano si el nodo no existe). Cargarlo acá
   no rompe —cada pintor sale en silencio— pero arrastraría 490 líneas para
   usar 20. Además `pintarMarca`/`pintarFooter` sí hacen falta acá, así que
   este archivo repite esa parte mínima y deja el resto afuera.
   🔴 CONSECUENCIA A VIGILAR: si cambia el footer de la portada (créditos,
   contacto, año), hay que cambiarlo TAMBIÉN acá. Son las dos únicas páginas
   del sitio y comparten cabecera y pie.
   ============================================================ */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var M = window.MUSEO;
  if (!M) return;

  /* --- Marca: lema, pertenencia y año (mismo comportamiento que la portada) --- */
  function pintarMarca() {
    /* CR-46: el lema va en DOS textos separados, pedido del dueño. Acá el
       footer lo recibe igual que en la portada (dos <span> en bloque). */
    $$("[data-marca-lema]").forEach(function (el) {
      if (M.lemaA && M.lemaB) {
        el.innerHTML = '<span class="footer__lemaA">' + esc(M.lemaA) + "</span>" +
                       '<span class="footer__lemaB">' + esc(M.lemaB) + "</span>";
      } else {
        el.textContent = M.lema;
      }
    });
    /* DEC-041: `pertenece` viene VACÍO. El nodo se oculta en vez de quedar un
       hueco con su separador. No se repone ningún texto de respaldo: si el JS
       no carga, no debe mostrar el dato que no está autorizado. */
    $$("[data-marca-pertenece]").forEach(function (el) {
      if (M.pertenece) { el.textContent = M.pertenece; }
      else { el.style.display = "none"; }
    });
  }

  /* --- Ficha del director --- */
  function pintarPerfil() {
    var d = M.director;
    if (!d) return;

    /* El documento: el <title> se completa con el nombre real, para que la
       pestaña y el resultado de búsqueda digan de quién es la página. */
    document.title = d.nombre + " — Director y Curador | " + M.nombre;

    var nom = $("[data-perfil-nombre]");
    if (nom) nom.textContent = d.nombre;

    var car = $("[data-perfil-cargo]");
    if (car) car.textContent = d.cargo;

    /* Retrato grande (el que va en esta página, no el chico de la card del hero).
       ⚠️ Es opcional: si `fotoGrande` no viene, la imagen se retira del DOM en
       vez de quedar un `<img>` roto o un hueco. El `alt` se llena acá y no en el
       HTML porque el nombre sale del data/ (DEC-005). */
    var foto = $("[data-perfil-foto]");
    if (foto) {
      if (d.fotoGrande) {
        foto.src = d.fotoGrande;
        foto.alt = "Retrato de " + d.nombre;
        foto.setAttribute("width", "520");
        foto.setAttribute("height", "520");
      } else {
        foto.remove();
      }
    }

    var lista = $("[data-perfil-completo]");
    if (lista) {
      lista.innerHTML = (d.completo || []).map(function (t) {
        return "<li>" + esc(t) + "</li>";
      }).join("");
    }

    /* --- Libros publicados: GRILLA DE PORTADAS (2026-10-17) ---
       Antes acá se pintaba una lista de texto con un ícono "check". El dueño
       entregó las portadas de los cinco libros y pidió publicarlas, así que
       cada libro pasa a ser una FIGURA: la portada + el título debajo.

       ⚠️ El data migró de `string[]` a `{titulo, portada, alt, ancho}[]`. Acá
       se leen las DOS formas: si el elemento es un string se usa tal cual y no
       hay portada. Eso deja el render a prueba de una sesión que revierta el
       data a la forma vieja, en vez de imprimir "undefined".

       ⚠️ `ancho: true` marca una portada APAISADA (el libro ilustrado). Esas NO
       entran a la grilla de 2 columnas: van en fila propia al final, con su
       propia clase. Si se mezclaran, quedaría un rectángulo acostado entre
       cuatro retratos y la grilla se vería rota.

       ⚠️ `loading="lazy"` + `width`/`height` declarados: la subpágina no debe
       reservar 0px y saltar cuando las portadas llegan. El aspect-ratio real
       de cada archivo lo pone el CSS con `object-fit`, no hace falta hardcodear
       cada medida en el HTML. */
    var lib = $("[data-perfil-libros]");
    if (lib) {
      var lista = (d.libros || []).map(function (l) {
        var titulo = (typeof l === "string") ? l : (l.titulo || "");
        var portada = (typeof l === "string") ? "" : (l.portada || "");
        var alt = (typeof l === "string") ? ("Portada del libro " + titulo) : (l.alt || ("Portada del libro " + titulo));
        var esAncho = (typeof l === "object" && l && l.ancho === true);

        /* Sin portada: cae al comportamiento viejo (sólo el título). Nunca se
           pinta un <img> con src vacío: eso deja el ícono de imagen rota. */
        var media = portada
          ? '<span class="libro__marco' + (esAncho ? " libro__marco--ancho" : "") + '">' +
              '<img class="libro__portada" src="' + esc(portada) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
            "</span>"
          : "";

        return '<li class="libro' + (esAncho ? " libro--ancho" : "") + (portada ? " libro--con-portada" : "") + '">' +
                 media +
                 '<span class="libro__titulo">' + esc(titulo) + "</span>" +
               "</li>";
      }).join("");

      /* Si NINGÚN libro trae portada (data revertido a string[]), se conserva el
         ícono "check" de antes para que el bloque no se vea a medio hacer. */
      var hayPortadas = (d.libros || []).some(function (l) {
        return typeof l === "object" && l && l.portada;
      });
      lib.className = "perfil__libros" + (hayPortadas ? " perfil__libros--portadas" : "");
      if (!hayPortadas) {
        var ico = (window.ICONOS && window.ICONOS["check"]) || "";
        lista = (d.libros || []).map(function (t) {
          return '<li><span class="perfil__libro-ico" aria-hidden="true">' + ico + "</span>" +
                 "<span>" + esc(typeof t === "string" ? t : t.titulo) + "</span></li>";
        }).join("");
      }
      lib.innerHTML = lista;
    }
  }

  /* --- Footer (contacto, créditos, año) --- */
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

  function init() {
    pintarMarca();
    pintarPerfil();
    pintarFooter();
    /* animaciones.js escucha este evento para re-enganchar los reveals de lo
       que se pintó por JS, igual que en la portada. */
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
