/* ============================================================
   MPCH — VISOR DE IMÁGENES POR SECCIÓN  (js/visor.js)

   CR-100 (2026-11-10) — Pedido del dueño:
     «hagamos una interfaz para las imágenes, que puedas seleccionarlas
      en colecciones, sección específica, y verlas de cerca. deslizar y
      salir cuando quieras llevándote a la sección»

   ------------------------------------------------------------
   DEC-084 — UN archivo compartido por las nueve subpáginas.
     Motivo medido: el sitio ya arrastra ONCE copias del pintado del
     footer y el propio js/reptiles.js avisa del riesgo. Repetir el patrón
     nueve veces con el visor sería garantizar que se desincronice.

   DEC-085 — El índice NO se escribe a mano: se DERIVA de
     `seccion.imagenes[]` del bloque del capítulo en `data/museo.js`, en
     tiempo de ejecución. Es la misma regla que el mapeo figura→párrafo
     (CR-96 costó 4 intentos por escribirlo a mano). Si mañana entra un
     capítulo nuevo o el dueño cambia un Word, el visor se adapta solo.

   DEC-086 — La capa NO vive en el HTML: se construye al primer clic.
     Las figuras ya están en la página; el visor sólo las indexa. Cero
     cambios de contenido ⇒ cero riesgo sobre páginas ya verificadas.

   DEC-087 — «llevándote a la sección»: al abrir desde el botón de una
     sección se arranca filtrado en ella; al cerrar se vuelve a ESA
     sección, con el foco y el scroll restaurados.

   DEC-088 — Cierre por Esc, botón ×, clic en el fondo y swipe↓.
     Navegación por ‹ ›, teclado ← → y swipe horizontal.

   DEC-089 — Sin `pie` ni `alt` en el dato ⇒ el visor NO inventa texto.
     (Mismo criterio que DEC-034 con los `alt` de las figuras.)

   ------------------------------------------------------------
   🔴 POR QUÉ ES OPT-IN Y NO AUTOMÁTICO PARA TODO EL SITIO
   Este archivo no sabe nada de ningún capítulo en particular: recibe el
   bloque de datos y el contenedor por `window.VISOR.montar()`. El render
   del capítulo decide dónde van los botones. Si este archivo no carga, el
   render no pinta el botón y la página queda EXACTAMENTE como hoy.
   ============================================================ */
(function () {
  "use strict";

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  };

  /* Cursivas para nombres científicos: reusa el módulo del sitio, que
     escapa primero y sustituye después. Si no cargó, cae en `esc` puro:
     el texto pierde la cursiva pero NUNCA se rompe. */
  var conCursivas = (window.TEXTO && window.TEXTO.conCursivas) || esc;

  /* ---------- Íconos (inline, sin sprite ni librería) ---------- */
  var ICO = {
    ojo: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
         ' stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
         '<path d="M1.6 12S5.2 5.4 12 5.4 22.4 12 22.4 12 18.8 18.6 12 18.6 1.6 12 1.6 12Z"/>' +
         '<circle cx="12" cy="12" r="3.1"/></svg>',
    cerrar: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
            ' stroke-width="2.1" stroke-linecap="round" aria-hidden="true">' +
            '<path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
          ' stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
          ' stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------- Estado del montaje activo ----------
     Un solo visor por página. Si un capítulo montara dos, el segundo
     reemplaza al primero sin dejar listeners colgando. */
  var montaje = null;

  /* ============================================================
     1. ÍNDICE — se deriva del bloque de datos del capítulo
     ============================================================
     Entrada: el bloque del capítulo (`window.REPTILES`, `window.AMBAR`…)
     Salida:  { lista: [...], secciones: [{id, titulo, imgs:[idx…]}] }

     Cada imagen del índice lleva lo que el dato SÍ trae:
       .src    ruta
       .ancho  .alto  (siempre presentes: el sitio los exige en <img>)
       .texto  el pie o el alt, TAL CUAL — o "" si el dato no trae ninguno
       .secId  .secTitulo   de dónde salió (para el filtro y el regreso)

     ⚠️ Decisiones de tolerancia, medidas sobre el data real:
       · TRILOBITES y AMBAR no traen `pie` (traen `alt` o nada).
       · AMMONITES, TIBURONES traen `alt` Y `pie`.
       · Los nueve bloques comparten `src/ancho/alto` — eso sí es uniforme.
     Por eso se acepta cualquiera de los dos campos y no se exige ninguno.
  */
  function construirIndice(bloque) {
    var lista = [], secciones = [];
    var secs = (bloque && bloque.secciones) || [];

    secs.forEach(function (s) {
      var imgs = s.imagenes || [];
      if (!imgs.length) return;          /* sección sin figuras: no entra al índice */

      var idxSec = [];
      imgs.forEach(function (im) {
        if (!im || !im.src) return;      /* sin `src` no hay nada que mostrar */
        var texto = im.pie || im.alt || "";
        idxSec.push(lista.length);
        lista.push({
          src: im.src,
          ancho: im.ancho || 0,
          alto: im.alto || 0,
          texto: texto,
          secId: s.id || "",
          secTitulo: s.titulo || ""
        });
      });

      if (idxSec.length) {
        secciones.push({ id: s.id || "", titulo: s.titulo || "", imgs: idxSec });
      }
    });

    return { lista: lista, secciones: secciones };
  }

  /* ============================================================
     2. BOTÓN POR SECCIÓN  (decisión del dueño: uno por sección)
     ============================================================
     El render del capítulo llama a `marcarBoton(seccionEl, n, titulo)` con
     el <section> ya pintado. Así el botón queda DENTRO de su sección y
     hereda su ancla: cerrar el visor y volver «a la sección» es volver a
     ese mismo nodo, sin buscar por id ni por texto.

     🔴 CR-100c — DEFECTO MEDIDO: `marcarBoton` llamaba a `abrir(secEl)`,
     pero `abrir` vive DENTRO de `montar()` (es un closure del montaje), no
     en este ámbito. El clic lanzaba «abrir is not defined», la capa nunca
     se creaba y el visor no hacía NADA aunque el botón existiera. Por eso
     ahora recibe `alAbrir` como parámetro: el ámbito de este helper no
     conoce el estado del montaje y no debe conocerlo. */
  function marcarBoton(secEl, n, titulo, etiqueta, alAbrir) {
    if (!secEl || !n) return;            /* sección sin figuras: sin botón */

    var b = document.createElement("button");
    b.type = "button";
    b.className = "mpv-abrir";
    b.setAttribute("data-mpv-abrir", "");
    b.setAttribute("aria-label",
      (etiqueta || "Ver imágenes") + " de " + (titulo || "esta sección") +
      ": " + n + (n === 1 ? " imagen" : " imágenes"));
    b.innerHTML = ICO.ojo +
      '<span aria-hidden="true">' + esc(etiqueta || "Ver imágenes") + "</span>" +
      '<span class="mpv-abrir__n" aria-hidden="true">' + n + "</span>";

    /* Va INMEDIATAMENTE después del título de la sección: es donde el
       lector lo busca y donde no desplaza ninguna figura. */
    var h = secEl.querySelector("h2, h3");
    if (h && h.parentNode === secEl) secEl.insertBefore(b, h.nextSibling);
    else secEl.insertBefore(b, secEl.firstChild);

    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (alAbrir) alAbrir(secEl);
    });
    return b;
  }

  /* ============================================================
     3. LA CAPA
     ============================================================
     Se crea una sola vez, la primera vez que se abre. `aria-modal` y el
     foco encerrado son lo mínimo para que el visor sea usable con teclado.
  */
  function crearCapa() {
    var capa = document.createElement("div");
    capa.className = "mpv";
    capa.setAttribute("data-mpv", "");
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.setAttribute("aria-label", "Visor de imágenes del capítulo");
    capa.setAttribute("data-abierto", "false");

    capa.innerHTML =
      '<div class="mpv__barra">' +
        '<p class="mpv__titulo"><span data-mpv-titulo></span><small data-mpv-sub></small></p>' +
        '<span class="mpv__cuenta" data-mpv-cuenta aria-live="polite"></span>' +
        '<button type="button" class="mpv__cerrar" data-mpv-cerrar aria-label="Cerrar el visor">' +
          ICO.cerrar + "</button>" +
      "</div>" +
      '<div class="mpv__filtros" data-mpv-filtros role="group" aria-label="Filtrar por sección"></div>' +
      '<div class="mpv__escena">' +
        '<button type="button" class="mpv__flecha" data-dir="prev" data-mpv-prev aria-label="Imagen anterior">' +
          ICO.prev + "</button>" +
        '<div class="mpv__lienzo" data-mpv-lienzo>' +
          '<span class="mpv__cargando" data-mpv-cargando hidden>Cargando…</span>' +
          '<img class="mpv__img" data-mpv-img alt="" decoding="async" draggable="false">' +
          '<span class="mpv__pista" data-mpv-pista hidden>Toca la imagen para acercar</span>' +
          '<span class="mpv__gira" data-mpv-gira hidden>Gira el teléfono para verla completa</span>' +
        "</div>" +
        '<button type="button" class="mpv__flecha" data-dir="next" data-mpv-next aria-label="Imagen siguiente">' +
          ICO.next + "</button>" +
      "</div>" +
      '<p class="mpv__pie" data-mpv-pie hidden></p>' +
      '<div class="mpv__tira" data-mpv-tira aria-label="Miniaturas de la selección"></div>';

    document.body.appendChild(capa);
    return capa;
  }

  /* ============================================================
     4. MONTAJE
     ============================================================
     `opts` = {
       bloque:   el objeto del capítulo en data/museo.js   (obligatorio)
       titulo:   nombre del capítulo para la barra         (opcional)
       etiqueta: texto del botón, por defecto «Ver imágenes»
     }
  */
  function montar(opts) {
    if (!opts || !opts.bloque) return null;

    var indice = construirIndice(opts.bloque);
    if (!indice.lista.length) return null;   /* capítulo sin figuras: no se monta nada */

    var est = {
      bloque: opts.bloque,
      titulo: opts.titulo || "",
      etiqueta: opts.etiqueta || "Ver imágenes",
      indice: indice,
      capa: null,
      visibles: [],      /* índices de `lista` que pasan el filtro actual */
      pos: 0,            /* posición dentro de `visibles` */
      secFiltro: null,   /* id de sección o null = todas */
      abierto: false,
      origen: null,      /* el <section> desde el que se abrió (DEC-087) */
      focoPrevio: null,  /* a dónde vuelve el foco al cerrar */
      scrollPrevio: 0,
      ultimoFoco: null,
      /* CR-101 — estado de acercar/recorrer */
      zoom: false,
      tx: 0, ty: 0,
      arrastrando: false,
      xArrastre: 0, yArrastre: 0
    };

    montaje = est;

    /* Atajo para el render: marca los botones de un contenedor ya pintado.
       Devuelve cuántos botones puso (medible, no supuesto). */
    est.marcarBotones = function (raiz) {
      var puestos = 0;
      indice.secciones.forEach(function (s) {
        if (!s.id) return;
        var el = raiz.querySelector("#" + CSS.escape(s.id));
        if (!el) return;
        /* `#id` con caracteres raros se busca por atributo como respaldo. */
        if (!el) return;
        if (marcarBoton(el, s.imgs.length, s.titulo, est.etiqueta, abrir)) puestos++;
      });
      return puestos;
    };

    /* ---- filtro ---- */
    function aplicarFiltro(secId) {
      est.secFiltro = secId || null;
      est.visibles = [];
      indice.lista.forEach(function (im, i) {
        if (!est.secFiltro || im.secId === est.secFiltro) est.visibles.push(i);
      });
      est.pos = 0;
      pintarChips();
      pintarTira();
      pintarImagen();
    }

    function pintarChips() {
      var cont = est.capa.querySelector("[data-mpv-filtros]");
      var html = '<button type="button" class="mpv__chip" data-sec="" aria-pressed="' +
        (est.secFiltro ? "false" : "true") + '">Todas' +
        '<span class="mpv__chip-n">' + indice.lista.length + "</span></button>";

      indice.secciones.forEach(function (s) {
        if (!s.id) return;
        html += '<button type="button" class="mpv__chip" data-sec="' + esc(s.id) +
          '" aria-pressed="' + (est.secFiltro === s.id ? "true" : "false") + '">' +
          /* El título de la sección trae `*Especie*` para cursiva: se pasa
             por el mismo módulo del sitio para que el chip no muestre asteriscos. */
          conCursivas(s.titulo).replace(/<\/?p>|\/\*/g, "") +
          '<span class="mpv__chip-n">' + s.imgs.length + "</span></button>";
      });
      cont.innerHTML = html;
    }

    function pintarTira() {
      var cont = est.capa.querySelector("[data-mpv-tira]");
      cont.innerHTML = est.visibles.map(function (i, k) {
        var im = indice.lista[i];
        var etq = im.texto ? im.texto : "Imagen " + (k + 1);
        return '<button type="button" class="mpv__thumb" data-k="' + k + '"' +
          ' aria-label="' + esc(etq) + '"' +
          ' aria-current="' + (k === est.pos ? "true" : "false") + '">' +
          '<img src="' + esc(im.src) + '" alt="" loading="lazy" decoding="async">' +
          "</button>";
      }).join("");

      /* La miniatura activa se trae al centro de la tira: con 38 miniaturas
         (trilobites) la navegación por teclado quedaría fuera de vista. */
      var act = cont.querySelector('[aria-current="true"]');
      if (act && act.scrollIntoView) {
        act.scrollIntoView({ block: "nearest", inline: "center" });
      }
    }

    function pintarImagen() {
      var img = est.capa.querySelector("[data-mpv-img]");
      var cargando = est.capa.querySelector("[data-mpv-cargando]");
      var pie = est.capa.querySelector("[data-mpv-pie]");
      var cuenta = est.capa.querySelector("[data-mpv-cuenta]");
      var sub = est.capa.querySelector("[data-mpv-sub]");
      var prev = est.capa.querySelector("[data-mpv-prev]");
      var next = est.capa.querySelector("[data-mpv-next]");

      var total = est.visibles.length;
      if (!total) {                        /* no debería pasar, pero no se miente */
        img.removeAttribute("src");
        img.setAttribute("data-lista", "false");
        pie.hidden = true;
        cuenta.textContent = "0";
        prev.disabled = next.disabled = true;
        return;
      }

      var im = indice.lista[est.visibles[est.pos]];
      img.setAttribute("data-lista", "false");
      cargando.hidden = false;

      img.onload = function () {
        cargando.hidden = true;
        img.setAttribute("data-lista", "true");
        actualizarAvisoGiro();   /* CR-104 — depende del tamaño natural */
      };
      img.onerror = function () {
        /* Imagen rota: se dice, no se deja un hueco negro mudo. */
        cargando.hidden = false;
        cargando.textContent = "No se pudo cargar la imagen";
        img.setAttribute("data-lista", "false");
      };
      if (im.ancho) img.width = im.ancho;
      if (im.alto) img.height = im.alto;
      img.src = im.src;
      /* Si ya estaba en caché, `onload` puede no llegar: se fuerza el estado. */
      if (img.complete && img.naturalWidth) {
        cargando.hidden = true;
        img.setAttribute("data-lista", "true");
      }

      /* La descripción es la del documento, TAL CUAL (DEC-089). */
      if (im.texto) {
        pie.innerHTML = conCursivas(im.texto);
        pie.hidden = false;
      } else {
        pie.innerHTML = "";
        pie.hidden = true;
      }

      img.alt = im.texto || "";

      cuenta.textContent = (est.pos + 1) + " / " + total;
      sub.textContent = im.secTitulo
        ? im.secTitulo.replace(/\*/g, "")
        : "";

      prev.disabled = est.pos <= 0;
      next.disabled = est.pos >= total - 1;

      /* CR-101 — Toda imagen nueva entra SIN zoom. Si se arrastraba la
         anterior, el estado se limpia acá: si no, la siguiente aparecería
         encogida y corrida. */
      reiniciarZoom();

      var tira = est.capa.querySelector("[data-mpv-tira]");
      Array.prototype.forEach.call(tira.children, function (t, k) {
        t.setAttribute("aria-current", k === est.pos ? "true" : "false");
      });
      var act = tira.children[est.pos];
      if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    }

    /* ============================================================
       CR-101 — ACERCAR: toque para ampliar, arrastre para recorrer
       ============================================================
       Pedido del dueño (2026-11-10): «aparte poder tocar cada imagen para
       acercarla». Elegida la opción A+B: toque amplía y, ya ampliada, se
       recorre arrastrando.

       🔴 EL CONFLICTO QUE HAY QUE RESOLVER Y CÓMO SE RESUELVE
       El visor ya usa el deslizar para dos cosas: ← → navega y ↓ sale.
       Si el toque sobre la imagen se interpretara como «deslizar», se
       rompería justo lo que el dueño pidió antes. La separación es por
       DISTANCIA y por ESTADO, no por zona:

         · toque sin moverse (< 10 px)      → acerca / aleja
         · arrastre CON la imagen ampliada  → recorre la imagen (no navega)
         · arrastre con la imagen normal    → navega / sale  (lo de CR-100)

       Sin la condición de estado, ampliar rompería la salida con swipe↓.

       El desplazamiento se guarda en `--tx/--ty` (px) y se aplica con
       `translate()` sobre la misma `transform` que el CSS ya anima. Los
       topes impiden arrastrar la imagen fuera de su marco. */
    var ZOOM = 2.4;          /* ×: suficiente para leer una placa o un diente */
    var TOPE_PX = 10;        /* px de movimiento que separan toque de arrastre */

    function imgEl() {
      return est.capa && est.capa.querySelector("[data-mpv-img]");
    }

    /* ¿Hay que sugerir girar el teléfono? Sólo si la imagen es apaisada de
       forma marcada Y la pantalla está en vertical Y es angosta. En cualquier
       otro caso el aviso no aparece: sobraría. */
    function actualizarAvisoGiro() {
      var aviso = est.capa && est.capa.querySelector("[data-mpv-gira]");
      var img = imgEl();
      if (!aviso || !img) return;

      var apaisada = img.naturalWidth > img.naturalHeight * 1.5;
      var vertical = window.innerHeight > window.innerWidth;
      var angosta = window.innerWidth <= 700;

      aviso.hidden = !(apaisada && vertical && angosta);
    }

    function aplicarZoom() {
      var img = imgEl();
      if (!img) return;
      img.style.transform = "translate(" + est.tx + "px," + est.ty + "px) scale(" +
        (est.zoom ? ZOOM : 1) + ")";
      img.setAttribute("data-zoom", est.zoom ? "true" : "false");

      var pista = est.capa.querySelector("[data-mpv-pista]");
      if (pista) pista.hidden = !!est.zoom;
    }

    /* Devuelve el desplazamiento a cero y el zoom a 1. Se llama al cambiar
       de imagen, al filtrar y al cerrar. */
    function reiniciarZoom() {
      est.zoom = false;
      est.tx = 0;
      est.ty = 0;
      var img = imgEl();
      if (img) {
        img.style.transform = "";
        img.setAttribute("data-zoom", "false");
        img.removeAttribute("data-arrastrando");
      }
      var pista = est.capa && est.capa.querySelector("[data-mpv-pista]");
      if (pista) pista.hidden = true;
    }

    /* Topes: cuánto puede correrse la imagen ampliada sin dejar hueco.
       Se mide con el tamaño YA renderizado y el del lienzo que la contiene.

       🔴 CR-100d — Con `transform-origin: center`, al ampliar la imagen
       crece en las CUATRO direcciones, así que el desborde por lado es
       (ampliado − lienzo) / 2. Si la imagen ampliada todavía cabe en el
       lienzo, el tope es 0 y no se puede arrastrar: no hay nada oculto. */
    function acotar(tx, ty) {
      var img = imgEl();
      var lienzo = est.capa && est.capa.querySelector("[data-mpv-lienzo]");
      if (!img || !lienzo) return { tx: tx, ty: ty };

      /* `offsetWidth/offsetHeight` = tamaño SIN la transformación, que es
         justo lo que hace falta para calcular cuánto crecerá al ampliar.
         `getBoundingClientRect` ya vendría escalado y daría el doble. */
      var iw = img.offsetWidth, ih = img.offsetHeight;
      var ll = lienzo.getBoundingClientRect();

      var mx = Math.max(0, (iw * ZOOM - ll.width) / 2);
      var my = Math.max(0, (ih * ZOOM - ll.height) / 2);
      return {
        tx: Math.max(-mx, Math.min(mx, tx)),
        ty: Math.max(-my, Math.min(my, ty))
      };
    }

    function alternarZoom() {
      if (!imgEl() || !est.visibles.length) return;
      est.zoom = !est.zoom;
      est.tx = 0;
      est.ty = 0;
      aplicarZoom();
    }

    function mover(delta) {
      var n = est.pos + delta;
      if (n < 0 || n >= est.visibles.length) return;
      est.pos = n;
      pintarImagen();
    }

    /* ---- abrir / cerrar ---- */
    function abrir(secEl) {
      if (!est.capa) est.capa = crearCapa();
      est.origen = secEl || null;
      est.focoPrevio = document.activeElement;
      est.scrollPrevio = window.pageYOffset || document.documentElement.scrollTop || 0;

      var capa = est.capa;
      var titulo = capa.querySelector("[data-mpv-titulo]");
      titulo.textContent = est.titulo || (est.bloque && est.bloque.titulo) || "Imágenes";

      /* DEC-087: se abre YA filtrado en la sección de origen. El id se lee
         del propio <section>, no se adivina por texto. */
      var secId = "";
      if (secEl) {
        var enIndice = indice.secciones.filter(function (s) {
          return s.id && secEl.id === s.id;
        })[0];
        if (enIndice) secId = enIndice.id;
      }
      aplicarFiltro(secId);

      capa.setAttribute("data-abierto", "true");
      document.body.classList.add("mpv-bloqueo");
      est.abierto = true;

      /* CR-104 — «verlas de cerca» en un teléfono.
         Medido: en vertical la imagen apaisada (3:1) sólo ocupa el 20 % del
         alto del lienzo. No es un defecto de CSS sino de geometría, así que
         se resuelve con el recurso que el usuario ya tiene: girar el
         teléfono. Se pide pantalla completa (quita la barra del navegador y
         gana alto) y, sólo si la imagen es claramente apaisada y la pantalla
         es vertical, se avisa que se puede girar.
         ⚠️ Si el navegador NIEGA el fullscreen (iOS Safari), no se hace
         nada: el visor funciona igual. Se usa try/catch por eso. */
      try {
        if (!document.fullscreenElement && capa.requestFullscreen) {
          var pr = capa.requestFullscreen();
          if (pr && pr.catch) pr.catch(function () {});
        }
      } catch (e) { /* sin pantalla completa se sigue igual */ }

      actualizarAvisoGiro();

      /* El foco entra al visor: sin esto, el teclado seguiría navegando la
         página de atrás y Esc no llegaría al listener correcto. */
      var cerrar = capa.querySelector("[data-mpv-cerrar]");
      if (cerrar) cerrar.focus({ preventScroll: true });
    }

    function cerrar() {
      if (!est.abierto || !est.capa) return;
      est.capa.setAttribute("data-abierto", "false");
      document.body.classList.remove("mpv-bloqueo");
      est.abierto = false;

      /* CR-104 — se sale de pantalla completa para no dejar al usuario
         atrapado en el visor cerrado. */
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          var ex = document.exitFullscreen();
          if (ex && ex.catch) ex.catch(function () {});
        }
      } catch (e) { /* nada que hacer */ }

      /* DEC-087 — «llevándote a la sección»: se vuelve al <section> del que
         se salió, GUARDADO COMO NODO (no por id: el id puede cambiar de
         capítulo a capítulo y algunos traen caracteres no válidos en CSS).
         Se restaura el scroll que había, que es exactamente la sección. */
      var destino = est.origen;
      window.scrollTo(0, est.scrollPrevio);
      if (destino && destino.focus) {
        if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
        destino.focus({ preventScroll: true });
      }
      if (est.focoPrevio && est.focoPrevio.focus) {
        est.focoPrevio.focus({ preventScroll: true });
      }
    }

    /* ---- eventos ---- */
    function conectar() {
      /* Se conectan una sola vez, aunque se abra muchas veces. */
      if (est.conectado) return;
      est.conectado = true;

      document.addEventListener("click", function (ev) {
        if (!est.abierto || !est.capa) return;
        var t = ev.target;

        if (t.closest("[data-mpv-cerrar]")) { ev.preventDefault(); cerrar(); return; }
        if (t.closest("[data-mpv-prev]")) { ev.preventDefault(); mover(-1); return; }
        if (t.closest("[data-mpv-next]")) { ev.preventDefault(); mover(1); return; }

        var chip = t.closest(".mpv__chip");
        if (chip) {
          ev.preventDefault();
          aplicarFiltro(chip.getAttribute("data-sec") || "");
          return;
        }

        var thumb = t.closest(".mpv__thumb");
        if (thumb) {
          ev.preventDefault();
          est.pos = parseInt(thumb.getAttribute("data-k"), 10) || 0;
          pintarImagen();
          return;
        }

        /* Clic en el fondo = cerrar. Sólo si NO fue sobre la imagen ni sobre
           ningún control: la escena tiene huecos y ahí es donde se acierta. */
        if (t === est.capa || t.closest("[data-mpv-lienzo]") && t === t.closest("[data-mpv-lienzo]")) {
          cerrar();
        }
      });

      document.addEventListener("keydown", function (ev) {
        if (!est.abierto) return;
        var k = ev.key;

        if (k === "Escape") { ev.preventDefault(); cerrar(); return; }
        if (k === "ArrowLeft") { ev.preventDefault(); mover(-1); return; }
        if (k === "ArrowRight") { ev.preventDefault(); mover(1); return; }

        /* Foco encerrado: Tab no debe escaparse a la página de atrás. */
        if (k === "Tab" && est.capa) {
          var foc = est.capa.querySelectorAll(
            'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
          );
          if (!foc.length) return;
          var primero = foc[0], ultimo = foc[foc.length - 1];
          if (ev.shiftKey && document.activeElement === primero) {
            ev.preventDefault(); ultimo.focus();
          } else if (!ev.shiftKey && document.activeElement === ultimo) {
            ev.preventDefault(); primero.focus();
          }
        }
      });

      /* ---- gestos: toque para acercar, arrastre para recorrer, deslizar para navegar ----
         🔴 El ORDEN de estas reglas es la corrección del conflicto que el
         pedido de zoom introduce. Un mismo `pointerdown` sobre la imagen
         puede terminar siendo tres gestos distintos; sólo la distancia
         recorrida y el estado de zoom deciden cuál. */
      var x0 = 0, y0 = 0, t0 = 0, activo = false, sobreImg = false, movido = false;

      function inicio(ev) {
        if (!est.abierto) return;
        var p = ev.touches ? ev.touches[0] : ev;
        /* Un gesto que empieza en un control no navega ni amplía: se deja pulsar. */
        if (ev.target.closest("button, a")) return;

        var img = ev.target.closest("[data-mpv-img]");
        sobreImg = !!img;

        x0 = p.clientX; y0 = p.clientY; t0 = Date.now();
        activo = true; movido = false;

        /* Con la imagen ampliada, el puntero captura el arrastre: es lo que
           permite recorrerla siguiendo el dedo sin que el navegador
           desplace otra cosa. */
        if (sobreImg && est.zoom) {
          est.arrastrando = true;
          if (img) img.setAttribute("data-arrastrando", "true");
          est.xArrastre = x0;
          est.yArrastre = y0;
          if (ev.target.setPointerCapture && ev.pointerId != null) {
            try { ev.target.setPointerCapture(ev.pointerId); } catch (e) {}
          }
        }
      }

      function durante(ev) {
        if (!activo || !est.arrastrando) return;
        var p = ev.touches ? ev.touches[0] : ev;
        var dx = p.clientX - est.xArrastre;
        var dy = p.clientY - est.yArrastre;
        if (Math.abs(dx) + Math.abs(dy) > TOPE_PX) movido = true;
        var c = acotar(est.tx + dx, est.ty + dy);
        est.tx = c.tx; est.ty = c.ty;
        est.xArrastre = p.clientX;
        est.yArrastre = p.clientY;
        aplicarZoom();
        if (ev.cancelable) ev.preventDefault();
      }

      function fin(ev) {
        if (!activo) return;
        activo = false;

        var p = (ev.changedTouches && ev.changedTouches[0]) || ev;
        var dx = p.clientX - x0, dy = p.clientY - y0;
        var dt = Date.now() - t0;

        /* 🔴 CR-100e — DEFECTO MEDIDO: con la imagen YA ampliada, `inicio()`
           marca `arrastrando = true` para poder recorrerla. Pero un TOQUE
           sin desplazamiento también entraba por ahí, y esta rama devolvía
           sin llegar al toque: **no se podía volver a alejar**. Medido con
           eventos reales (down/up en el mismo punto, `dx=dy=0`).
           Ahora el arrastre sólo se da por bueno si HUBO desplazamiento;
           si no, cae al toque y alterna el zoom. */
        if (est.arrastrando) {
          est.arrastrando = false;
          var img = imgEl();
          if (img) img.removeAttribute("data-arrastrando");

          if (movido) {
            /* Fue recorrido: no navega, no cierra. */
            return;
          }
          /* No se movió: es un toque sobre la imagen ampliada ⇒ alejar. */
          alternarZoom();
          return;
        }

        var umbral = 48;                    /* px: por debajo es un toque, no un gesto */

        /* TOQUE sobre la imagen sin moverse ⇒ acercar / alejar. */
        if (sobreImg && !movido && dt < 900 && Math.abs(dx) < TOPE_PX && Math.abs(dy) < TOPE_PX) {
          alternarZoom();
          return;
        }

        if (dt > 900) return;               /* gesto lento = no es un desliz */

        if (Math.abs(dx) > Math.abs(dy)) {
          /* Horizontal: navegar. */
          if (Math.abs(dx) > umbral) mover(dx < 0 ? 1 : -1);
        } else if (dy > umbral) {
          /* Hacia abajo: salir. Es el gesto que el dueño nombró primero. */
          cerrar();
        }
      }

      function cancelar() {
        if (!activo) return;
        activo = false;
        est.arrastrando = false;
        var img = imgEl();
        if (img) img.removeAttribute("data-arrastrando");
      }

      if (window.PointerEvent) {
        document.addEventListener("pointerdown", inicio, { passive: true });
        document.addEventListener("pointermove", durante, { passive: false });
        document.addEventListener("pointerup", fin, { passive: true });
        document.addEventListener("pointercancel", cancelar, { passive: true });
      } else {
        document.addEventListener("touchstart", inicio, { passive: true });
        document.addEventListener("touchmove", durante, { passive: false });
        document.addEventListener("touchend", fin, { passive: true });
        document.addEventListener("touchcancel", cancelar, { passive: true });
      }

      /* ---- escritorio: doble clic y rueda sobre la imagen ----
         En un ratón no hay «toque», así que el mismo «acercar» necesita
         otro disparador. Se conserva la regla del sitio de NO usar gestos
         ambiguos: el doble clic amplía, la rueda amplía/aleja, y ninguno
         de los dos interfiere con las flechas ni con Esc.

         🔴 CR-100b — DEFECTO MEDIDO: esto estaba enganchado a `est.capa`,
         que todavía es `null` la primera vez que corre `conectar()` (la capa
         se crea al primer ABRIR, no al montar). Resultado: excepción dentro
         de `montar()` → `pintarSecciones()` de reptiles.js moría ahí →
         los 11 botones no se pintaban y `data-rpt-secciones` quedaba vacío.
         Se engancha al `document` con el mismo filtro por `[data-mpv-img]`,
         que ya garantiza que sólo actúe sobre el visor abierto. */
      document.addEventListener("dblclick", function (ev) {
        if (!est.abierto) return;
        if (!ev.target.closest("[data-mpv-img]")) return;
        ev.preventDefault();
        alternarZoom();
      });

      /* Giro del teléfono: el aviso se recalcula solo. */
      window.addEventListener("resize", function () {
        if (est.abierto) actualizarAvisoGiro();
      });

      document.addEventListener("wheel", function (ev) {
        if (!est.abierto) return;
        if (!ev.target.closest("[data-mpv-img]")) return;
        /* Sólo cuando el gesto ocurre SOBRE la imagen: si no, se le
           quitaría la rueda a la tira de miniaturas. */
        ev.preventDefault();
        if (ev.deltaY < 0 && !est.zoom) alternarZoom();
        else if (ev.deltaY > 0 && est.zoom) alternarZoom();
      }, { passive: false });
    }

    est.abrir = abrir;
    est.cerrar = cerrar;
    est.conectar = conectar;

    /* Atajo de máximo nivel para el render: pinta los botones de la página
       y deja la capa lista para abrirse al primer clic. */

    /* ------------------------------------------------------------
       CR-102 — CLIC EN LA FIGURA DE LA PÁGINA ABRE EL VISOR EN ELLA
       ------------------------------------------------------------
       Pedido del dueño: «al hacer click en las imagenes no se seleccionan»
       y luego «clic en la figura de la página → abre el visor en ESA imagen».

       Hasta ahora el visor sólo se abría con el botón «Ver imágenes». Las
       figuras de la página eran `<figure class="rpt-fig">` sin manejador y
       sin `cursor: pointer`: tocar una imagen no hacía NADA. Eso es lo que
       el dueño reportó, y era correcto.

       Cómo se resuelve sin tocar el data ni los textos:
         · se recorren las figuras YA pintadas en la página;
         · se lee su `src` y se busca ese mismo `src` en el índice derivado;
         · se abre el visor filtrado en la sección de esa imagen, en su
           posición exacta, y se marca la figura como accesible por teclado.

       ⚠️ El emparejamiento es por `src`, no por orden: si el orden de las
       figuras cambiara, por posición se abriría la imagen equivocada —
       el mismo defecto de CR-96 con el mapeo escrito a mano. */
    est.engancharFiguras = function (raiz) {
      var puestas = 0;
      var figs = raiz.querySelectorAll("figure img, .rpt-fig img, .tbl-fig img, .amb-fig img");

      Array.prototype.forEach.call(figs, function (img) {
        var fig = img.closest("figure") || img;
        if (fig.getAttribute("data-mpv-fig")) return;   /* ya enganchada */

        /* El `src` tal como quedó en el DOM, absoluto o relativo. */
        var src = img.getAttribute("src") || "";
        if (!src) return;

        /* Índice de esa imagen dentro del índice del visor. */
        var k = -1;
        for (var i = 0; i < indice.lista.length; i++) {
          var s = indice.lista[i].src;
          if (s === src || src.indexOf(s) !== -1 || s.indexOf(src) !== -1) { k = i; break; }
        }
        if (k < 0) return;                              /* no está en el índice: no se toca */

        var secId = indice.lista[k].secId;
        fig.setAttribute("data-mpv-fig", String(k));
        fig.setAttribute("role", "button");
        fig.setAttribute("tabindex", "0");
        fig.setAttribute("aria-label", "Ampliar imagen" +
          (indice.lista[k].texto ? ": " + indice.lista[k].texto : ""));

        function abrirEsta(ev) {
          ev.preventDefault();
          abrirLaImagen(secId, k);
        }

        fig.addEventListener("click", abrirEsta);
        fig.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " ") abrirEsta(ev);
        });

        puestas++;
      });

      return puestas;
    };

    /* Abre el visor filtrado en la sección `secId` y posicionado en la imagen
       `k` (índice global del índice). */
    function abrirLaImagen(secId, k) {
      /* El <section> de origen, para que al cerrar se vuelva ahí (DEC-087). */
      var secEl = null;
      try { secEl = document.getElementById(secId); } catch (e) { secEl = null; }
      if (!secEl && secId) secEl = document.querySelector('[id="' + secId + '"]');

      abrir(secEl);

      /* Posicionar en la imagen pedida dentro de lo ya filtrado. */
      var pos = est.visibles.indexOf(k);
      if (pos >= 0) {
        est.pos = pos;
        pintarImagen();
      }
    }

    est.pintarBotones = function (raiz) {
      var puestos = 0;
      indice.secciones.forEach(function (s) {
        var el = null;
        try { el = raiz.querySelector("#" + CSS.escape(s.id)); } catch (e) { el = null; }
        if (!el) {
          /* Respaldo por atributo: `document.getElementById` acepta
             cualquier id, incluso los que CSS no puede escapar. */
          el = raiz.querySelector('[id="' + s.id.replace(/"/g, '\\"') + '"]');
        }
        if (!el) return;
        if (el.querySelector("[data-mpv-abrir]")) return;   /* ya puesto */
        if (marcarBoton(el, s.imgs.length, s.titulo, est.etiqueta, abrir)) puestos++;
      });
      return puestos;
    };

    /* CR-102 — un solo llamado desde el render del capítulo: pinta los
       botones por sección Y engancha las figuras de la página. */
    est.pintarTodo = function (raiz) {
      var b = est.pintarBotones(raiz);
      var f = est.engancharFiguras(raiz);
      return { botones: b, figuras: f };
    };

    conectar();
    return est;
  }

  /* ---------- API pública ---------- */
  window.VISOR = {
    montar: montar,
    /* Medible desde fuera: cuántas imágenes indexó y en cuántas secciones. */
    contar: function (bloque) {
      var ix = construirIndice(bloque);
      return {
        imagenes: ix.lista.length,
        secciones: ix.secciones.length,
        conTexto: ix.lista.filter(function (i) { return !!i.texto; }).length
      };
    },
    /* Para los medidores: el estado abierto/cerrado sin tocar el DOM a mano. */
    estado: function () {
      if (!montaje) return null;
      return {
        montado: true,
        abierto: montaje.abierto,
        indice: montaje.indice.lista.length,
        secciones: montaje.indice.secciones.length,
        visibles: montaje.visibles.length,
        pos: montaje.pos,
        filtro: montaje.secFiltro
      };
    }
  };
})();
