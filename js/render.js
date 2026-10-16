/* ============================================================
   MPCH — Pintado de secciones desde los datos (data/museo.js)
   Si un dato falta, degrada; no rompe.
   ============================================================ */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ico = function (n) { return (window.ICONOS && window.ICONOS[n]) || ""; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  if (!window.MUSEO) { console.error("[MPCH] Falta data/museo.js"); return; }

  var M = window.MUSEO;

  /* ---------- Marca en header y footer ----------
     DEC-041: `M.pertenece` puede venir VACÍO (el dueño no autoriza publicar la
     pertenencia institucional). Si viene vacío, el nodo se OCULTA en vez de
     quedar como una línea en blanco con su separador. */
  function pintarMarca() {
    $$("[data-marca-sigla]").forEach(function (el) { el.textContent = M.sigla; });
    $$("[data-marca-nombre]").forEach(function (el) { el.textContent = M.nombre; });
    $$("[data-marca-pertenece]").forEach(function (el) {
      var v = M.pertenece || "";
      el.textContent = v;
      el.style.display = v ? "" : "none";
    });
    /* CR-46 (2026-10-13): el eslogan va en DOS TEXTOS SEPARADOS tambien en el
       FOOTER (pedido del dueño). Mismo criterio que el hero: se emiten dos
       spans en bloque y el CSS les da la linea. Si el data viniera viejo (sin
       lemaA/lemaB), cae al lema completo. */
    $$("[data-marca-lema]").forEach(function (el) {
      if (M.lemaA && M.lemaB) {
        el.innerHTML = '<span class="footer__lemaA">' + esc(M.lemaA) + "</span>" +
                       '<span class="footer__lemaB">' + esc(M.lemaB) + "</span>";
      } else {
        el.textContent = M.lema;
      }
    });
  }

  /* ---------- Hero ----------
     CR-30: la metrica "Tipos de piezas" estaba escrita a mano en el index.html
     y decia 6 cuando el sitio ya tiene 7 (el hueso y el huevo se separaron en
     CR-27). Ahora el numero sale de COLECCIONES.piezas: no puede volver a
     quedar viejo. Tambien se quita la "flecha" del rango largo, que era el
     caracter que hacia ver rara esa metrica en celular. */
  /* ---------- Mini curriculum del director (CR-55, 2026-10-15) ----------
     El dueño pidió que el mini currículum del director vaya ARRIBA del horario,
     en el hero ("el nombre y el curriculum de Juan Castillo Cornejo se publican
     arriba en el hero"), con un resumen corto y un enlace a una subpágina.

     🔴 ESTE BLOQUE NO INVENTA NI UNA PALABRA. Los datos salen tal cual de
     MUSEO.director (data/museo.js), donde están las MISMAS palabras que el dueño
     dictó. Si `M.director` no existe (data viejo), el contenedor queda vacío y
     el horario sube a su lugar: no se pinta un hueco ni un texto de relleno.

     ⚠️ El <a> a la subpágina sale de `subpagina`, no está escrito acá: la ruta
     es una coordenada del sitio, igual que `arte` en las piezas. */
  function pintarDirector() {
    var cont = $("[data-hero-director]");
    if (!cont) return;

    var d = M.director;
    if (!d || !d.nombre) { cont.innerHTML = ""; return; }

    /* CR-55b (2026-10-15): la card es DELGADA Y ANCHA — una franja horizontal,
       no una tarjeta alta. El dueño lo pidió textual: "que sea una card delgada
       y ancha, menos texto".
       ------------------------------------------------------------
       Layout: 3 columnas en fila (quién es · los datos en línea · el enlace).
       Antes era una columna con el rol, el nombre y una lista vertical de 4
       líneas: eso la hacía alta y angosta, que es lo contrario de lo pedido.

       Y MENOS TEXTO: de cada línea del mini se muestra sólo la parte que
       identifica el logro, separando por la primera coma cuando la hay —
         "Diplomado en Paleontología y Patrimonio Paleontológico, Universidad
          Autónoma de Zacatecas (México)."  ->  "Diplomado en Paleontología y
          Patrimonio Paleontológico"
       ⚠️ NO se inventa texto nuevo: se RECORTA el que el dueño dictó. La versión
       íntegra no se pierde — es la que se publica en la subpágina desde
       `d.completo`. Acá va el resumen y allá el detalle, que es exactamente lo
       que el dueño pidió ("un resumen corto que llegue a una subpagina").
       ⚠️ La viñeta la pone el CSS (`::before`), no el JS: así el HTML emitido
       queda limpio y el punto se alinea con la línea base del texto. */
    function resumen(t) {
      var m = String(t || "").split(",")[0].trim();
      return m.replace(/\.$/, "");
    }

    var html = "";

    /* 1) Quién es: RETRATO + cargo y nombre en la misma línea. La card tiene que
       ser finita de alto, así que la foto va al lado del texto, no encima.
       ⚠️ El retrato es opcional: si `foto` no viene, el bloque se arma igual sin
       el círculo (no queda un hueco vacío). */
    var foto = d.foto
      ? '<img class="hero__director-foto" src="' + esc(d.foto) + '"' +
        ' width="160" height="160" alt="' + esc(d.nombre) + '" loading="lazy" decoding="async">'
      : "";

    html += '<div class="hero__director-quien">' +
              foto +
              '<div class="hero__director-id">' +
                '<span class="hero__director-rol">Director y Curador</span>' +
                '<span class="hero__director-nombre">' + esc(d.nombre) + "</span>" +
              "</div>" +
            "</div>";

    /* 2) Los datos: 4 líneas cortas, una por logro. */
    if (d.mini && d.mini.length) {
      html += '<ul class="hero__director-lista">' +
        d.mini.map(function (t) { return "<li>" + esc(resumen(t)) + "</li>"; }).join("") +
      "</ul>";
    }

    /* 3) El enlace a la subpágina. */
    if (d.subpagina) {
      html += '<a class="hero__director-mas" href="' + esc(d.subpagina) + '">' +
                "Ver el currículum completo" +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
              "</a>";
    }

    cont.innerHTML = html;
  }

  function pintarHero() {
    /* DEC-033: el parrafo del hero AHORA ES EL LEMA (el dueño lo dicto y pidio
       sacarlo del <span class="hero__lema">). Si el dato `lema` existe, manda;
       si no, se cae a `descripcionCorta` para que el hero nunca quede vacio.
       `descripcionCorta` NO se borra del data/: la siguen usando los <meta>
       description / og:description del index.html.

       CR-46 (2026-10-13): el dueño pidio el eslogan en DOS TEXTOS SEPARADOS
       (sin la coma que los unia):
         "Museo Paleontológico de Chile"
         "40 años trayendo el pasado al presente."
       ⚠️ Esto se resuelve ACA y no con un <br> en el HTML: este render pinta el
       nodo con textContent, asi que cualquier HTML escrito en el <p> del
       index.html lo SOBRESCRIBE al cargar. Ya paso una vez en este proyecto
       (ver HANDOFF, DEC-033). Se emiten dos <span> declarados en bloque y el CSS
       .hero__lemaA / .hero__lemaB les da la linea.
       Si `lemaA`/`lemaB` faltaran (data viejo), cae al `lema` completo para que
       el hero nunca quede vacio. */
    var d = $("[data-hero-desc]");
    if (d) {
      if (M.lemaA && M.lemaB) {
        d.innerHTML = '<span class="hero__lemaA">' + esc(M.lemaA) + "</span>" +
                      '<span class="hero__lemaB">' + esc(M.lemaB) + "</span>";
      } else {
        d.textContent = M.lema || M.descripcionCorta;
      }
    }
    var r = $("[data-hero-rango]");
    if (r && window.COLECCIONES) {
      /* CR-43d (2026-10-13): el dueño pidio el rango EN UNA SOLA LINEA:
           "QUE NO SALGA ASI: Cámbrico / →Cuaternario, SI NO ASI: EN UNA SOLA
            LINEA".
         Antes se partia en DOS span (hero__rangoA / hero__rangoB) por CR-32,
         cuando el rango convivia con otras DOS metricas en columnas de ~90px y
         no cabia. Ya no convive con nada: esta solo en la fila, dentro de su
         placa, con todo el ancho disponible. Asi que el corte en dos lineas es
         una restriccion que dejo de existir y se elimina.
         Se sigue usando la flecha con su propio span (hero__flecha), que solo
         cambia el color del separador. El CSS ya declara ahora los span como
         inline. */
      var partes = String(window.COLECCIONES.rango).split("\u2192");
      if (partes.length === 2) {
        r.innerHTML = esc(partes[0].trim()) +
          ' <span class="hero__flecha">\u2192</span> ' +
          esc(partes[1].trim());
      } else {
        r.textContent = window.COLECCIONES.rango;
      }
    }
    /* CR-42 (2026-10-13): aca vivia el pintado de la metrica "Tipos de piezas"
       (escribia COLECCIONES.piezas.length en [data-hero-piezas]) y la del
       aliado institucional ([data-hero-aliado]). El dueño pidio quitar la de
       piezas y la del aliado ya se habia retirado (DEC-041). Ambos nodos se
       eliminaron del index.html, asi que este codigo quedaba MUERTO: calculaba
       y escribia sobre elementos que ya no existen.
       Si algun dia se reponen las metricas, el dato sigue en COLECCIONES.piezas
       y en MUSEO.aliado — no hay que re-inventarlo. */
  }

  /* ---------- Horario + estado abierto/cerrado ----------
     CR-30: el estado decía "Abierto ahora" con seguridad, pero el dueño avisó
     que a veces el PARQUE cierra y nadie se entera. El sitio NO puede saberlo
     (estático, sin backend: DEC-003), así que ahora el estado declara lo que
     realmente sabe: si la persona está DENTRO del horario publicado, no si las
     puertas están abiertas. Y ofrece el canal que sí lo sabe: WhatsApp.

     Las horas de apertura/cierre y el aviso salen de MUSEO.estado (data/), ya
     no están escritas a mano acá (DEC-005). */
  function pintarHorario() {
    var cont = $("[data-horario]"); if (!cont) return;
    cont.innerHTML = "";
    M.horarios.forEach(function (h) {
      var fila = document.createElement("div");
      fila.className = "horario__fila" + (h.abierto ? "" : " cerrado");
      /* CR-41: la fila puede traer `nota` (ej. "Horario de verano", dato oficial
         del dueño para Sab-Dom 11-19). Se pinta como sufijo del tramo, en un
         span propio para que el CSS pueda diferenciarlo de las horas. */
      var nota = h.nota ? ' <small class="horario__nota">(' + esc(h.nota) + ")</small>" : "";
      fila.innerHTML = '<span class="horario__dias">' + esc(h.dias) + "</span>" +
                       '<span class="horario__horas">' + esc(h.horas) + nota + "</span>";
      cont.appendChild(fila);
    });

    /* CR-31: aca vivia TODO el calculo del estado abierto/cerrado (el indicador
       "Cerrado ahora" / "Abierto ahora", su aviso y el boton de confirmar por
       WhatsApp). Se ELIMINO a pedido del dueño: el horario ya esta escrito en la
       lista de arriba, el indicador lo repetia y agregaba ruido. Sin el elemento
       en el HTML, ese codigo quedaba muerto — calculaba una fecha y escribia
       sobre un nodo que ya no existe.
       Si algun dia se quiere recuperar: el dato seguia saliendo de MUSEO.estado
       (abre/cierra en minutos, mas `excepto` para cierres informados). */
  }

  /* ---------- Línea de tiempo geológica (DEC-013) ----------
     Antes estaba escrita a mano en index.html (violaba DEC-005).
     Ahora se pinta desde MUSEO.eras. */
  function pintarEras() {
    var cont = $("[data-linea]"); if (!cont || !M.eras) return;
    cont.innerHTML = M.eras.map(function (e) {
      return '<div class="linea__era">' +
               '<div class="linea__nombre">' + esc(e.nombre) + "</div>" +
               '<div class="linea__hace">' + esc(e.hace) + "</div>" +
               (e.detalle ? '<div class="linea__detalle">' + esc(e.detalle) + "</div>" : "") +
             "</div>";
    }).join("");
  }

  /* ---------- Quiénes somos ----------
     CR-48 (2026-10-13): la seccion quedo como MODULO CERRADO. El dueño pidio
     sacarla del sitio ("el no quiere sacar esa informacion por ahora") pero
     conservarla por si cambia de opinion.
     El interruptor es UNO SOLO: QUIENES_SOMOS.visible en el data/.
       false -> se oculta la seccion completa (y se quita del menu, abajo).
       true  -> vuelve tal cual estaba.
     ⚠️ No se borro nada: el HTML sigue en el index.html, el CSS en somos.css y
     este render sigue pintando todo. Solo se apaga. */
  function pintarSomos() {
    var seccion = document.getElementById("somos");
    var abierta = !window.QUIENES_SOMOS || window.QUIENES_SOMOS.visible !== false;

    /* La seccion ocupa lugar en el menu; si esta cerrada, el enlace tambien
       sale (un enlace a una seccion escondida es un enlace roto). */
    $$('a[href="#somos"]').forEach(function (a) {
      var li = a.closest("li");
      if (li) li.style.display = abierta ? "" : "none";
      else a.style.display = abierta ? "" : "none";
    });
    if (seccion) {
      seccion.style.display = abierta ? "" : "none";
      seccion.classList.toggle("somos--cerrado", !abierta);
      /* El `hidden` del HTML es solo el respaldo anti-parpadeo mientras carga
         el JS. Una vez que el render decide, se limpia: si no, al reactivar
         (visible: true) el atributo seguiría escondiendo la sección. */
      if (abierta) seccion.removeAttribute("hidden");
    }
    if (!abierta) return;   // cerrada: no se pinta su contenido, no hace falta

    var cont = $("[data-somos-parrafos]"); if (cont && window.QUIENES_SOMOS) {
      cont.innerHTML = window.QUIENES_SOMOS.parrafos.map(function (p) {
        return "<p>" + esc(p) + "</p>"; }).join("");
    }
    var mis = $("[data-somos-mision]");
    if (mis && window.QUIENES_SOMOS) mis.textContent = window.QUIENES_SOMOS.mision;

    /* CR-47 (2026-10-13): marcadores de relleno. Son los huecos que el museo
       tiene que llenar (a quien pertenece, quienes estan detras, desde cuando,
       administracion). Hasta hoy esos datos simplemente NO existian en el sitio,
       asi que el hueco era invisible.
       Con `pendiente: true` se pinta un aviso VISIBLE para que se vea que falta.
       Con `pendiente: false` se pinta el `valor` como dato normal, con la misma
       forma que la ficha de al lado.
       ⚠️ No se inventa contenido: o hay `valor` dictado por el duenio, o se
       muestra el aviso de que falta. */
    var pc = $("[data-somos-pendientes]");
    if (pc && window.QUIENES_SOMOS && window.QUIENES_SOMOS.pendientes) {
      pc.innerHTML = window.QUIENES_SOMOS.pendientes.map(function (x) {
        if (x.pendiente) {
          return '<div class="ficha__item ficha__item--falta">' +
                   '<span class="ficha__clave">' + esc(x.clave) + "</span>" +
                   '<span class="ficha__valor ficha__valor--falta">' +
                     esc(x.valor || "⚠ A RELLENAR") + "</span>" +
                   '<span class="ficha__nota">' + esc(x.nota) + "</span>" +
                 "</div>";
        }
        return '<div class="ficha__item">' +
                 '<span class="ficha__clave">' + esc(x.clave) + "</span>" +
                 '<span class="ficha__valor">' + esc(x.valor) + "</span>" +
               "</div>";
      }).join("");
    }
  }

  /* ---------- Colecciones ---------- */
  function pintarColecciones() {
    var cont = $("[data-colecciones]"); if (!cont || !window.COLECCIONES) return;
    cont.innerHTML = window.COLECCIONES.piezas.map(function (p) {
      /* CR-16: el icono es OPCIONAL por pieza (campo conIcono en data/).
         Hoy solo la primera (Trilobites) lo muestra: el dueño encargo a una
         ilustradora los dibujos personalizados del resto. Los SVG siguen en
         js/iconos.js, asi que reactivar una pieza = poner conIcono: true.
         CR-17: si la pieza trae `arte` (dibujo de la ilustradora), ese dibujo
         manda sobre el SVG de respaldo. `arte` guarda la RUTA desde la raiz
         del sitio (assets/img/...).
         El dibujo se integra como <img> NORMAL: ya trae el color celeste y su
         alfa, sin mascara y sin srcset. La version con mask + currentColor se
         descarto porque el icono NO pintaba y costo tres vueltas encontrar la
         causa; un <img> pelado no tiene donde fallar. Sin `sizes` a mano, que
         desajustaba el tamano intrinseco. */
      var arte = p.arte
        ? '<img src="' + esc(p.arte) + '" width="512" height="512"' +
          ' alt="" loading="lazy" decoding="async">'
        : "";
      var llevaIcono = !!arte || (p.conIcono !== false && ico(p.icono));
      /* CR-60 (2026-10-15): una pieza puede traer `enlace` (hoy: Trilobites ->
         trilobites.html). Se reusa EXACTAMENTE el patrón de pintarServicios
         (`enlace` + `enlaceTexto`), que ya estaba resuelto y probado, en vez de
         inventar un mecanismo nuevo.
         ⚠️ El <a> envuelve TODO el contenido de la pieza, no un botto suelto: el
         dueño pidió que se abra "apretando la card". Por eso la clase `pieza--enlace`
         y no `servicio__enlace`.
         ⚠️ `aria-label` lleva el nombre de la pieza: el texto visible dice
         "Conocer los trilobites", que fuera de contexto no identifica la card. */
      var cuerpo = (llevaIcono ? '<div class="pieza__ico">' + (arte || ico(p.icono)) + '</div>' : '') +
                   '<h3>' + esc(p.nombre) + '</h3>' +
                   '<p>' + esc(p.detalle) + '</p>';
      if (p.enlace) {
        return '<article class="pieza pieza--enlace reveal reveal--zoom' +
                 (llevaIcono ? '' : ' pieza--sin-ico') + '">' +
                 '<a class="pieza__a" href="' + esc(p.enlace) + '"' +
                   ' aria-label="' + esc(p.nombre + ": " + (p.enlaceTexto || "Ver más")) + '">' +
                   cuerpo +
                   '<span class="pieza__mas">' + esc(p.enlaceTexto || "Ver más") +
                     '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
                       ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                       '<path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
                   '</span>' +
                 '</a>' +
               '</article>';
      }
      return '<article class="pieza reveal reveal--zoom' +
               (llevaIcono ? '' : ' pieza--sin-ico') + '">' +
               cuerpo +
             '</article>';
    }).join("");
    var det = $("[data-colecciones-rango]");
    if (det) det.textContent = window.COLECCIONES.rangoDetalle;
  }

  /* ---------- Servicios ---------- */
  function pintarServicios() {
    var cont = $("[data-servicios]"); if (!cont || !window.SERVICIOS) return;
    cont.innerHTML = window.SERVICIOS.map(function (s) {
      /* CR-49: un servicio puede traer `enlace` (ej. la tarjeta de la exposicion
         itinerante apunta a la seccion propia #paleomundo). Sin `enlace`, la
         tarjeta queda como siempre. */
      var enlace = s.enlace
        ? '<a class="servicio__enlace" href="' + esc(s.enlace) + '">' +
            esc(s.enlaceTexto || "Ver más") + "</a>"
        : "";
      return '<article class="servicio reveal reveal--zoom' + (s.destacado ? " servicio--destacado" : "") + '">' +
               '<div class="servicio__ico">' + ico(s.icono) + "</div>" +
               "<h3>" + esc(s.titulo) + "</h3>" +
               "<p>" + esc(s.detalle) + "</p>" +
               enlace +
             "</article>";
    }).join("");
    var nota = $("[data-servicios-nota]"); if (nota) {
      nota.innerHTML = ico("check") + "<span>" + esc(window.SERVICIOS_NOTA) + "</span>";
    }
    pintarPaleomundo();
  }

  /* ---------- PALEOMUNDO (CR-41 / CR-49, 2026-10-13) ----------
     Muestra itinerante. CR-49: tiene SECCION PROPIA (#paleomundo, entre
     Colecciones y Servicios) y se destaca, por pedido del dueño. Antes su
     bloque vivia dentro de Servicios.
     Vive en window.PALEOMUNDO (data/). Si el dato no esta, el contenedor queda
     VACIO (no se pinta un encabezado huerfano).

     ⚠️ EL TEXTO ES TEXTUAL DEL DUEÑO. No hay titulares ni prosa del agente:
     el dueño pidio expresamente "no poner titulares". Lo que se pinta son sus
     propias frases (bajada del bloque oficial) y la lista de las 25 vitrinas.
     Titulo y bajada salen de PALEOMUNDO.tituloSec / introSec — si estan vacios,
     los nodos se ocultan en vez de quedar en blanco. */
  function pintarPaleomundo() {
    var cont = $("[data-paleomundo]"); if (!cont) return;
    var p = window.PALEOMUNDO;
    if (!p || !p.items || !p.items.length) { cont.innerHTML = ""; return; }

    /* CR-53 (2026-10-13): el dueño pidió "el titulo centralo y hazlo en una
       card con la imagen incluida". Antes el encabezado (etiqueta + título +
       bajada) vivía fuera, en el contenedor de la sección, y la foto aparte.
       Ahora todo eso forma UNA card: título centrado arriba, la foto adentro,
       y debajo los datos y el detalle.
       ⚠️ El texto sigue siendo el del dueño: `tituloSec` es el nombre oficial y
       `introSec` es textual suyo. No se agrega prosa del agente (DEC-034). */
    var html = '<div class="pm-card reveal">';

    /* CR-56 (2026-10-15): el LOGO de la muestra, ARRIBA de todo — el dueño pidió
       "sumar, pero como logo arriba de esa seccion". Va antes del encabezado, no
       dentro de él: el encabezado está centrado y el logo tiene su propia
       proporción (1000x400).
       ⚠️ NO se toca la foto que ya está en la card (p.fotos): esto SUMA. El
       dueño aclaró "sumar" justamente para no deshacer CR-52, donde pidió que
       quedara UNA sola foto de la expo.
       ⚠️ La imagen va tal cual, sin marco ni placa — decisión del dueño.
       `loading="eager"` NO: va con lazy como el resto de las imágenes del sitio,
       salvo que su sección esté arriba (no lo está). */
    if (p.logo) {
      html += '<figure class="pm-card__logo">' +
                '<img src="' + esc(p.logo) + '" alt="' + esc(p.logoAlt || p.tituloSec) + '" loading="lazy" decoding="async">' +
              "</figure>";
    }

    /* Encabezado centrado dentro de la card.
       CR-54 (2026-10-15): el dueño pidió "en el titulo cambia a todo color azul".
       Se emite un <span> propio (`.pm-card__marca`) para poder pintar SOLO el
       título con el celeste de la paleta, sin tocar la bajada ni la intro — que
       siguen en los colores de texto normales. El nombre completo va como bajada
       porque "Proyecto C.E.C" solo no dice de qué se trata a quien no sabe la
       sigla, y es el nombre que el dueño confirmó textual. */
    html += '<header class="pm-card__cabeza">' +
              '<span class="etiqueta">Muestra itinerante</span>' +
              (p.tituloSec
                ? '<h2 class="pm-card__titulo"><span class="pm-card__marca">' + esc(p.tituloSec) + "</span></h2>"
                : "") +
              (p.subtituloSec ? '<p class="pm-card__bajada">' + esc(p.subtituloSec) + "</p>" : "") +
              (p.introSec ? '<p class="pm-card__intro">' + esc(p.introSec) + "</p>" : "") +
            "</header>";

    /* La imagen, dentro de la misma card. */
    if (p.fotos && p.fotos.length) {
      html += '<div class="paleomundo__fotos paleomundo__fotos--destaque"></div>';
    }

    /* Los datos duros, en TARJETAS (CR-62d).
       Antes eran chips de una línea con anchos desiguales, y el dueño reportó
       que "se ven mal las mini card". Ahora cada dato es una tarjeta pareja:
       ícono, valor grande y detalle debajo. El markup va en dos <span> SEPARADOS
       (`.pm-dato__v` y `.pm-dato__d`) para poder darle a cada parte su tamaño;
       con el <b> suelto dentro de un solo span no había forma de separarlos. */
    if (p.datos && p.datos.length) {
      html += '<div class="paleomundo__datos">' +
        p.datos.map(function (d) {
          return '<span class="paleomundo__pildora">' + ico(d.icono || "check") +
                 '<span class="pm-dato__c">' +
                   '<b class="pm-dato__v">' + esc(d.clave) + "</b>" +
                   '<span class="pm-dato__d">' + esc(d.valor) + "</span>" +
                 "</span></span>";
        }).join("") +
      "</div>";
    }

    /* Lo que lleva la muestra, en tarjetas. */
    html += '<div class="paleomundo__caja">' +
        "<h3>" + esc(p.titulo) + "</h3>" +
        "<p>" + esc(p.intro) + "</p>" +
        '<ul class="paleomundo__lista">' +
          p.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
        "</ul>" +
      "</div>";

    /* CR-62c (2026-10-15): enlace a la subpágina del Proyecto C.E.C. El dueño
       pidió el enlace "con el respectivo link": la sección de la portada es el
       resumen, y el detalle completo vive en `proyecto-cec.html`.
       ⚠️ Se emite como parte del grid (área `enlace`), para que quede debajo de
       las dos columnas y no dentro de una de ellas. */
    if (p.subpagina && p.subpagina.enlace) {
      html += '<div class="paleomundo__enlace">' +
                '<a class="pm-mas" href="' + esc(p.subpagina.enlace) + '">' +
                  esc(p.subpagina.texto || "Ver más") +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
                  ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                  '<path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
                "</a>" +
              "</div>";
    }

    html += "</div>";
    cont.innerHTML = html;

    if (p.fotos && p.fotos.length) {
      pintarFotos(cont.querySelector(".paleomundo__fotos"), p.fotos);
    }
  }

  /* ---------- Galería (CR-44, 2026-10-13) ----------
     Fotos reales del museo. Datos en window.GALERIA.
     CR-45: las fotos de la muestra itinerante YA NO van aca — el dueño las
     movio a Servicios (bloque PALEOMUNDO). Esta galeria pinta SOLO el museo.
     Un campo de texto vacio NO se pinta: si el dueño aun no dicto el titulo de
     una foto, la imagen sale sin el. Nunca se rellena con texto inventado
     (regla DEC-034).
     Las imagenes usan `loading="lazy"` y `decoding="async"`: no conviene
     bloquear el pintado del resto del sitio. */
  function pintarGaleria() {
    var G = window.GALERIA; if (!G) return;

    var intro = $("[data-galeria-intro]");
    if (intro) {
      if (G.intro) { intro.textContent = G.intro; }
      else { intro.style.display = "none"; }   // sin texto, no queda un hueco
    }

    /* Reusa el mismo pintor de fotos que PALEOMUNDO (pintarFotos), para no
       duplicar el HTML de la tarjeta ni el manejo de textos vacios. */
    pintarFotos($("[data-galeria-museo]"), G.museo);
  }

  /* ---------- Pintor de fotos compartido (CR-44/CR-45) ----------
     Lo usan la Galería del museo y el bloque itinerante de Servicios. Cada foto
     trae `mini` (lo que se carga) y `src` (la grande, en data-grande por si
     despues se quiere abrir en grande). Titulo y pie son opcionales: si faltan,
     no se pinta el caption. */
  function pintarFotos(cont, fotos) {
    if (!cont) return;
    if (!fotos || !fotos.length) { cont.innerHTML = ""; return; }
    cont.innerHTML = fotos.map(function (f) {
      var alt = f.titulo || "Museo Paleontológico de Chile";
      var texto = "";
      if (f.titulo || f.pie) {
        texto = '<figcaption class="galeria__texto">' +
          (f.titulo ? '<span class="galeria__titulo">' + esc(f.titulo) + "</span>" : "") +
          (f.pie ? '<span class="galeria__pie">' + esc(f.pie) + "</span>" : "") +
        "</figcaption>";
      }
      return '<figure class="galeria__foto reveal reveal--zoom">' +
               '<img src="' + esc(f.mini || f.src) + '" ' +
                    'data-grande="' + esc(f.src) + '" ' +
                    'alt="' + esc(alt) + '" loading="lazy" decoding="async" ' +
                    'width="700" height="700">' +
               texto +
             "</figure>";
    }).join("");
  }

  /* ---------- Visítanos ---------- */
  function pintarVisita() {
    var u = M.ubicacion, cont = $("[data-ubicacion]"); if (!cont) return;
    cont.innerHTML =
      item("pin",   "Dirección", u.direccion, u.referencia) +
      item("metro", "Cómo llegar", u.metro, u.ciudad);
    function item(i, clave, valor, sub) {
      return '<div class="ubicacion__item"><div>' + ico(i) + "</div><div>" +
        '<div class="ubicacion__clave">' + esc(clave) + "</div>" +
        '<div class="ubicacion__valor">' + esc(valor) +
        (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div></div></div>";
    }
    var mapa = $("[data-mapa-link]"); if (mapa) mapa.href = u.mapaUrl;
  }

  /* ---------- Contacto ---------- */
  function pintarContacto() {
    var cont = $("[data-contacto]"); if (!cont) return;
    var c = M.contacto, html = "";

    if (c.telefono) {
      html += '<div class="contacto__card reveal reveal--zoom">' + ico("telefono") + "<div><h3>Teléfono</h3>" +
              '<a href="tel:' + esc(c.telefonoLink) + '">' + esc(c.telefono) + "</a></div></div>";
    }
    if (c.whatsapp && c.whatsapp.url) {
      /* CR-37: la tarjeta de WhatsApp COMPLETA es el enlace (pedido del dueño:
         "es para apretar en toda la tarjeta"). Antes solo el texto/icono era
         clickeable, asi que tocar la tarjeta no hacia nada.

         Se hace con <a> que envuelve la tarjeta entera, NO con un listener de
         JS: asi funciona aunque falle el JS, el navegador muestra el destino
         al pasar el cursor, y se puede abrir en pestana nueva con el teclado.
         ⚠️ Sin texto visible en el enlace hace falta aria-label, si no un lector
         de pantalla anuncia un enlace vacio. */
      var wa = c.whatsapp.url + (c.whatsapp.mensaje ? "?text=" + encodeURIComponent(c.whatsapp.mensaje) : "");
      html += '<a class="contacto__card contacto__card--link reveal reveal--zoom"' +
              ' href="' + esc(wa) + '" target="_blank" rel="noopener"' +
              ' aria-label="Escribir por WhatsApp">' +
              ico("whatsapp") + "<div><h3>WhatsApp</h3></div></a>";
    }
    if (c.correos && c.correos.length) {
      html += '<div class="contacto__card reveal reveal--zoom">' + ico("correo") + "<div><h3>Correo electrónico</h3>" +
              c.correos.map(function (m) {
                return '<a href="mailto:' + esc(m) + '">' + esc(m) + "</a>"; }).join("") +
              "</div></div>";
    }
    cont.innerHTML = html;
  }

  /* ---------- Pie de página ---------- */
  function pintarFooter() {
    var c = M.contacto, u = M.ubicacion;
    var cont = $("[data-footer-contacto]"); if (cont) {
      cont.innerHTML = "<li>" + esc(u.direccion) + ", " + esc(u.referencia) + "</li>" +
                       (c.telefono ? '<li><a href="tel:' + esc(c.telefonoLink) + '">' + esc(c.telefono) + "</a></li>" : "") +
                       (c.correos && c.correos[0] ? '<li><a href="mailto:' + esc(c.correos[0]) + '">' + esc(c.correos[0]) + "</a></li>" : "");
    }
    var anio = $("[data-anio]"); if (anio) anio.textContent = new Date().getFullYear();

    /* CR-34: creditos de autoria, desde el data/ (DEC-005).
       Son DOS ROLES distintos: el dueño creo el sitio, Betsabe hizo las
       ilustraciones. Cada nombre va con su rol para que no se lean como dos
       desarrolladores. Los nombres se transcriben EXACTOS como los dicto el
       dueño (sin tildes): no se corrigen nombres propios. */
    var cr = $("[data-footer-creditos]");
    if (cr && M.creditos && M.creditos.autores) {
      cr.innerHTML =
        '<span class="creditos__titulo">' + esc(M.creditos.titulo || "Sitio desarrollado por") + "</span>" +
        M.creditos.autores.map(function (a) {
          /* El correo es OPCIONAL por autor: solo el creador del sitio lo trae.
             Va como mailto para poder escribir desde el mismo telefono.
             ⚠️ NO confundir con el correo del MUSEO (M.contacto.correos), que es
             otro distinto y vive en la seccion Contacto. */
          var correo = a.correo
            ? '<a class="creditos__correo" href="mailto:' + esc(a.correo) + '">' +
              esc(a.correo) + "</a>"
            : "";
          return '<span class="creditos__item">' +
                   '<span class="creditos__nombre">' + esc(a.nombre) + "</span>" +
                   '<span class="creditos__rol">' + esc(a.rol) + "</span>" +
                   correo +
                 "</span>";
        }).join("");
    }
  }

  /* ---------- Ejecutar ---------- */
  function init() {
    pintarMarca(); pintarHero(); pintarDirector(); pintarHorario(); pintarEras(); pintarSomos();
    pintarColecciones(); pintarGaleria(); pintarServicios(); pintarVisita();
    pintarContacto(); pintarFooter();
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
