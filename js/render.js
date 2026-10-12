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

  /* ---------- Marca en header y footer ---------- */
  function pintarMarca() {
    $$("[data-marca-sigla]").forEach(function (el) { el.textContent = M.sigla; });
    $$("[data-marca-nombre]").forEach(function (el) { el.textContent = M.nombre; });
    $$("[data-marca-pertenece]").forEach(function (el) { el.textContent = M.pertenece; });
    $$("[data-marca-lema]").forEach(function (el) { el.textContent = M.lema; });
  }

  /* ---------- Hero ----------
     CR-30: la metrica "Tipos de piezas" estaba escrita a mano en el index.html
     y decia 6 cuando el sitio ya tiene 7 (el hueso y el huevo se separaron en
     CR-27). Ahora el numero sale de COLECCIONES.piezas: no puede volver a
     quedar viejo. Tambien se quita la "flecha" del rango largo, que era el
     caracter que hacia ver rara esa metrica en celular. */
  function pintarHero() {
    var d = $("[data-hero-desc]"); if (d) d.textContent = M.descripcionCorta;
    var r = $("[data-hero-rango]");
    if (r && window.COLECCIONES) {
      /* CR-32: el CSS define .hero__rangoA / .hero__rangoB (ambos display:block,
         dos lineas declaradas) pero este render NUNCA los emitia: solo concatenaba
         el texto, asi que el rango caia en UNA linea y a 768px DESBORDABA su caja
         (medido: el strong de "Cambrico -> Cuaternario" con scrollWidth mayor que
         clientWidth). Se envuelve cada parte en su span para que el CSS pueda
         ponerlas en dos lineas y el rango nunca desborde.
         En escritorio las dos lineas se ven juntas y compactas; en celular el
         ancho de la columna manda y baja solo. */
      var partes = String(window.COLECCIONES.rango).split("\u2192");
      if (partes.length === 2) {
        /* Dos lineas declaradas: "Cámbrico" arriba, "→ Cuaternario" abajo.
           Antes iba todo en un renglon y en celular desbordaba su columna
           (medido: 157px de texto en 90px de caja a 320px). */
        r.innerHTML = '<span class="hero__rangoA">' + esc(partes[0].trim()) + "</span>" +
          '<span class="hero__rangoB"><span class="hero__flecha">\u2192</span>' +
          esc(partes[1].trim()) + "</span>";
      } else {
        r.textContent = window.COLECCIONES.rango;
      }
    }
    var n = $("[data-hero-piezas]");
    if (n && window.COLECCIONES && window.COLECCIONES.piezas) {
      n.textContent = window.COLECCIONES.piezas.length;
    }
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
      fila.innerHTML = '<span class="horario__dias">' + esc(h.dias) + "</span>" +
                       '<span class="horario__horas">' + esc(h.horas) + "</span>";
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

  /* ---------- Quiénes somos ---------- */
  function pintarSomos() {
    var cont = $("[data-somos-parrafos]"); if (cont && window.QUIENES_SOMOS) {
      cont.innerHTML = window.QUIENES_SOMOS.parrafos.map(function (p) {
        return "<p>" + esc(p) + "</p>"; }).join("");
    }
    var mis = $("[data-somos-mision]");
    if (mis && window.QUIENES_SOMOS) mis.textContent = window.QUIENES_SOMOS.mision;
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
      return '<article class="pieza reveal reveal--zoom' +
               (llevaIcono ? '' : ' pieza--sin-ico') + '">' +
               (llevaIcono ? '<div class="pieza__ico">' + (arte || ico(p.icono)) + '</div>' : '') +
               '<h3>' + esc(p.nombre) + '</h3>' +
               '<p>' + esc(p.detalle) + '</p>' +
             '</article>';
    }).join("");
    var det = $("[data-colecciones-rango]");
    if (det) det.textContent = window.COLECCIONES.rangoDetalle;
  }

  /* ---------- Servicios ---------- */
  function pintarServicios() {
    var cont = $("[data-servicios]"); if (!cont || !window.SERVICIOS) return;
    cont.innerHTML = window.SERVICIOS.map(function (s) {
      return '<article class="servicio reveal reveal--zoom' + (s.destacado ? " servicio--destacado" : "") + '">' +
               (s.destacado ? '<span class="servicio__badge">Más solicitado</span>' : "") +
               '<div class="servicio__ico">' + ico(s.icono) + "</div>" +
               "<h3>" + esc(s.titulo) + "</h3>" +
               "<p>" + esc(s.detalle) + "</p>" +
             "</article>";
    }).join("");
    var nota = $("[data-servicios-nota]"); if (nota) {
      nota.innerHTML = ico("check") + "<span>" + esc(window.SERVICIOS_NOTA) + "</span>";
    }
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
      var wa = c.whatsapp.url + (c.whatsapp.mensaje ? "?text=" + encodeURIComponent(c.whatsapp.mensaje) : "");
      html += '<div class="contacto__card reveal reveal--zoom">' + ico("whatsapp") + "<div><h3>WhatsApp</h3>" +
              '<a href="' + esc(wa) + '" target="_blank" rel="noopener">Escribir por WhatsApp</a></div></div>';
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
  }

  /* ---------- Ejecutar ---------- */
  function init() {
    pintarMarca(); pintarHero(); pintarHorario(); pintarEras(); pintarSomos();
    pintarColecciones(); pintarServicios(); pintarVisita();
    pintarContacto(); pintarFooter();
    document.dispatchEvent(new CustomEvent("mpch:pintado"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
