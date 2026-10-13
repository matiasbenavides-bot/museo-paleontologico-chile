/* ============================================================
   MUSEO PALEONTOLÓGICO DE CHILE (MPCH) — Datos del sitio
   Fuente única de verdad. Todo dato editable vive acá:
   cambiar acá = cambiar en todo el sitio.
   DEC-005: los datos NO se escriben en el HTML.
   ============================================================ */

const MUSEO = {
  sigla: "MPCH",
  nombre: "Museo Paleontológico de Chile",
  nombreLargo: "Museo Paleontológico de Chile",
  /* DEC-034 (2026-10-12): GRINPACH quedó OBSOLETO en todo el sitio.
     Dueño, textual: "TODA LA INFORMACION CON GRENPACH ESTA OBSOLETA, SE VOLVIO
     INDEPENDIENTE Y TRABAJA CON LA MUNI". Y precisó: INDEPENDIENTE, con la
     municipalidad como COLABORADOR/socio (sin convenio formal).
     ⚠️ La clave se sigue llamando `pertenece` porque el render la lee así
     (data-marca-pertenece, x2: ficha de Quiénes somos + footer). Cambiar el
     NOMBRE de la clave obligaría a tocar render.js y el HTML sin ganar nada;
     lo que cambia es el TEXTO. */
  /* DEC-041 (2026-10-13): el dueño declaró que la pertenencia institucional, la
     municipalidad exacta y quiénes están detrás NO se publican: "Ninguna de
     estas cosas es relevante para el Museo, solo hay que mostrar por el momento
     el funcionamiento del museo, horarios etc." Y: "No hay autorización para
     subir datos personales del Museo".

     Esta clave NO se borra del data/ (el render la lee con data-marca-pertenece
     x2: ficha de Quiénes somos + footer); lo que cambia es el VALOR: queda
     VACÍA, y el render degrada solo (no pinta la fila si el dato falta).
     ⚠️ NO rellenar con prosa plausible: el dueño detectó una vez texto inventado
     acá (DEC-034). Sacar el dato y dejar el hueco es la acción correcta. */
  pertenece: "",
  /* DEC-041: el aliado institucional del hero se RETIRA por la misma razón
     (nombraba la Municipalidad de Santiago exacta, sin autorización).
     OJO: no confundir con la colaboración real del museo con la muni, que el
     dueño SÍ reconoció — se retira del sitio por no publicarse, no porque sea
     falsa. Si algún día la autoriza, se repone acá. */
  aliado: null,
  /* DEC-033 (2026-10-12): el lema VUELVE, dictado por el dueño:
       "Museo Paleontológico de Chile, 40 años trayendo el pasado al presente."
     Esto levanta DEC-010, que lo había eliminado — pero NO por contradecir el
     copy, como se creía entonces.
     Aclarado por el dueño el 2026-10-12: son DOS cosas distintas.
       - los 40 años  = la edad del MUSEO
       - "más de 20 años" (en QUIENES_SOMOS) = el trabajo del GRUPO en terreno
     Nunca hubo contradicción: el choque era aparente porque los dos números
     hablaban de tiempo. El "más de 20 años" del copy NO se toca.
     ⚠️ Si una sesión futura ve los dos números y piensa que hay que unificarlos:
     NO. El dueño ya explicó que miden cosas distintas. */
  lema: "Museo Paleontológico de Chile, 40 años trayendo el pasado al presente.",
  descripcionCorta:
    "El primer museo chileno que centra su muestra en la paleontología y en los restos fósiles.",

  /* --- Contacto (medido del sitio real, 2026-10-11)
         DEC-011: teléfono actualizado +56 9 9349 2714, con WhatsApp.
         CR-04: cepchile@gmail.com eliminado (obsoleto). --- */
  contacto: {
    telefono: "+56 9 9349 2714",
    telefonoLink: "+56993492714",
    whatsapp: {
      numero: "56993492714",
      url: "https://wa.me/56993492714",
      mensaje: "Hola, quiero consultar por el Museo Paleontológico de Chile."
    },
    correos: ["castillocornejojuan@gmail.com"],
  },

  /* --- Visita --- */
  ubicacion: {
    /* CR-29: direccion REEMPLAZADA por la oficial de Google Maps.
       Fuente: https://maps.app.goo.gl/Bp2RMGB8t2Yo5TNs5 (resuelve al lugar
       "Museo Paleontologico de Chile"). Google declara:
         Av. Viel 1071-1653, Santiago, Region Metropolitana
         coordenadas -33.4623623, -70.6578538
         plus code   G8QR+3V Santiago
       Antes decia "Plaza del Cabildo s/n" — decision del dueño reemplazarla.
       La referencia se conserva porque es la indicacion UTIL para llegar. */
    direccion: "Av. Viel 1071-1653",
    referencia: "Interior del Pueblito del Parque O'Higgins",
    metro: "Metro Estación Parque O'Higgins",
    ciudad: "Santiago, Chile",
    /* CR-29: enlace DIRECTO al lugar (no el acortador goo.gl, que puede caducar).
       El formato search/?api=1&query=lat,lng es el oficial de Google Maps y
       abre el pin del museo, no un punto generico del parque. */
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=-33.4623623,-70.6578538"
  },

  /* --- Créditos de autoría (CR-34) ---
     Pedido del dueño, textual: "PON EN EL FOOTER QUE MATIAS IGNACIO BENAVIDES
     MARAMBIO CREO LA PAGINA, Y BETSABE PAOLA CACERES PAILLALEF", y después
     aclaró: "BETSABE DE ILUSTRADORA".
     => Son DOS ROLES distintos, no dos desarrolladores: el dueño creó el sitio
        y Betsabé hizo las ilustraciones (es la ilustradora de las piezas,
        ver CR-17 y CR-22 — Trilobites y Ammonites son suyos).

     ⚠️ LOS NOMBRES PROPIOS VAN EXACTOS COMO LOS DICTÓ EL DUEÑO: "MATIAS" y
     "BETSABE", SIN TILDES. No se corrigen ni se "mejoran": un nombre propio
     escrito por su dueño manda sobre la ortografía del agente. Ya se cometió
     el error una vez en esta sesión (se escribió "Matías"); no repetirlo.
     Si hace falta una tilde, la pide él. */
  creditos: {
    titulo: "Sitio desarrollado por",
    autores: [
      { nombre: "MATIAS IGNACIO BENAVIDES MARAMBIO", rol: "Creación de la página",
        correo: "matiasbenavidesmarambio@gmail.com" },
      { nombre: "BETSABE PAOLA CACERES PAILLALEF",  rol: "Ilustraciones" }
    ]
  },

  /* --- Horarios (CR-41, 2026-10-13) ---
         CORREGIDOS contra la información oficial que envió el dueño:
           "Horario: de martes a viernes de 11 a 17 horas
            Sábado y domingo de 11 a 19 horas (horario de verano)"
         ⚠️ ANTES DECÍA Mar-Vie 10:00. El museo abre a las 11:00, no a las
         10:00 — el sitio mandaba gente una hora antes a la puerta cerrada.
         El dueño confirmó que el 11:00 es el correcto.

         ⚠️ PENDIENTE ABIERTO (no resuelto, no inventar): el "horario de verano"
         de Sáb-Dom 11-19. El dueño confirmó el tramo pero NO dijo qué horario
         rige fuera de verano. Queda 19:00 como el valor vigente informado.
         → Si el museo informa el horario de invierno, se agrega acá. --- */
  horarios: [
    { dias: "Martes a viernes", horas: "11:00 – 17:00 hrs.", abierto: true },
    { dias: "Sábados y domingos", horas: "11:00 – 19:00 hrs.", abierto: true, nota: "Horario de verano" },
    { dias: "Lunes", horas: "Cerrado", abierto: false }
  ],

  /* --- Estado de apertura (CR-30)
         El dueño reportó que a veces el PARQUE cierra y el visitante no tiene
         cómo saberlo: el sitio decía "Abierto ahora" con seguridad y podía
         estar cerrado.

         RESTRICCIÓN DURA: el sitio NO puede saber si el parque cerró. Es
         estático, sin backend, sin API (DEC-003). Escanear avisos de terceros
         desde el navegador sería (a) un backend encubierto y (b) CORS.

         Lo único honesto es que el estado NO MIENTA: el sitio calcula si la
         persona está DENTRO del horario publicado, no si las puertas están
         abiertas. El texto lo declara, y el enlace de WhatsApp (que sí lo sabe
         el museo) queda a un clic.

         `abre`/`cierra` en minutos desde medianoche: son el dato que CALCULA
         el estado. Antes esas horas estaban escritas a mano dentro de
         render.js — o sea en el código, no en el data/ (violaba DEC-005).
         Ahora el mismo número está en un solo lugar.

         ⚠️ Si el museo informa un horario especial (feriado, cierre puntual),
         se agrega acá como `excepto: ["YYYY-MM-DD"]` con su motivo. */
  estado: {
    aviso: "El horario es de referencia del museo; el Parque O'Higgins puede cerrar por eventos o mantención.",
    mensajeWhatsApp: "Hola, quiero confirmar si el museo está abierto hoy.",
    /* Índice por día de semana: 0=Dom ... 6=Sáb. null = cerrado todo el día.
       Fuente: la lista `horarios` de arriba. CR-41: sincronizado con el horario
       oficial (Mar-Vie abre 11:00 = 660 min; Sáb-Dom cierra 19:00 = 1140 min).
       ⚠️ Si se cambia `horarios`, cambiar TAMBIÉN esto: es el mismo dato en dos
       formas, y si divergen el sitio se contradice solo (dice "abierto" a una
       hora en que el cartel de arriba dice que está cerrado). */
    abre:    { 1: null, 2: 660, 3: 660, 4: 660, 5: 660,  6: 660, 0: 660 },
    cierra:  { 1: null, 2: 1020, 3: 1020, 4: 1020, 5: 1020, 6: 1140, 0: 1140 },
    /* CR-30: fechas SIN atención. Formato YYYY-MM-DD. Vacío = sin cierres informados. */
    excepto: []
  },

  /* --- Línea de tiempo geológica (DEC-013)
         Antes vivía escrita a mano en index.html, violando DEC-005.
         Orden confirmado por el museo: del Cámbrico al Cuaternario. --- */
  eras: [
    { nombre: "Cámbrico",              hace: "~540 Ma",       detalle: "Explosión de vida marina" },
    { nombre: "Ordovícico – Devónico", hace: "~485–359 Ma",    detalle: "Primeros vertebrados y plantas" },
    { nombre: "Carbonífero – Pérmico", hace: "~359–252 Ma",    detalle: "Grandes bosques y anfibios" },
    { nombre: "Mesozoico",             hace: "~252–66 Ma",     detalle: "Era de los dinosaurios" },
    { nombre: "Cuaternario",           hace: "~2,6 Ma – hoy",  detalle: "Los grandes mamíferos y nosotros" }
  ]
};

/* --- Quiénes somos (copy real del sitio) ---
   DEC-041 (2026-10-13): el dueño ordenó ELIMINAR las tres frases que el agente
   había inventado (DEC-034) y que quedaron publicadas:
     - "es una institución independiente, dedicada a la paleontología"
     - "Trabaja en colaboración con la Municipalidad de Santiago"
     - "más de 20 años de investigación en terreno y en sala"
   Sus palabras: "las 3 frases dejalas eliminadas", y antes: "Ninguna de estas
   cosas es relevante para el Museo... solo hay que mostrar por el momento el
   funcionamiento del museo, horarios etc.", "No hay autorización para subir
   datos personales del Museo".

   ⚠️ SE ELIMINAN, NO SE REESCRIBEN. La regla del dueño es explícita: se quita el
   dato y se deja el hueco; no se rellena con prosa plausible. Un agente ya
   inventó texto acá una vez y el dueño lo detectó.
   ⚠️ LO QUE NO SE TOCA: el recinto pequeño, "primer museo chileno", la muestra
   diseñada por investigadores (arquitectos, biólogos, paleontólogos, técnicos
   museólogos) y el objetivo de difusión. Eso es del museo y sigue vigente. */
const QUIENES_SOMOS = {
  parrafos: [
    "Su muestra ha sido diseñada y estructurada de acuerdo a criterios expuestos por investigadores del área: arquitectos, biólogos, paleontólogos y la asesoría de técnicos museólogos.",
    "Si bien el recinto para esta muestra es pequeño, se han aprovechado todos los espacios para entregar conocimientos y para que los visitantes puedan apreciar piezas paleontológicas de nuestro país y del mundo.",
    "Es el primer museo chileno que centra su muestra en la paleontología y en restos fósiles, que ayudan a comprender la vida pasada de nuestro país y nuestro planeta.",
    "Su principal objetivo apunta a difundir el conocimiento y protección de la paleontología nacional, acercando a la gente a esta ciencia de gran interés para la comunidad, pero de escasa difusión en los medios."
  ],
  mision: "Difundir y proteger el patrimonio paleontológico nacional."
};

/* --- Colecciones --- */
const COLECCIONES = {
  rango: "Cámbrico → Cuaternario",
  rangoDetalle:
    "Una muestra que abarca desde el periodo Cámbrico hasta el Cuaternario.",
  /* piezas: cada una lleva `icono` (clave en js/iconos.js) y `conIcono`.
     CR-16: el dueño encargo a una ilustradora los dibujos personalizados de
     las piezas. Hasta que lleguen, SOLO la primera (Trilobites) muestra su
     icono; las demas van solo con texto. Para reactivar una, poner
     conIcono: true y listo — los dibujos siguen en js/iconos.js.

     CR-17: llego el PRIMER dibujo de la ilustradora (Trilobites). Cuando una
     pieza trae `arte`, ese dibujo MANDA sobre el SVG de js/iconos.js; el SVG
     queda solo como respaldo. Los 7 SVG siguen intactos. */
  piezas: [
    { icono: "trilobite", conIcono: true,  arte: "assets/img/pieza-trilobites.png", nombre: "Trilobites",   detalle: "Artrópodos marinos extintos, de los fósiles más representativos del Paleozoico." },
    { icono: "ammonite",  conIcono: true,  arte: "assets/img/pieza-ammonite.png", nombre: "Ammonites",    detalle: "Moluscos cefalópodos con concha en espiral, guías de la era Mesozoica." },
    { icono: "ambar",     conIcono: true,  arte: "assets/img/pieza-ambar.png", nombre: "Ámbar",        detalle: "Resina fósil que conserva organismos con un detalle excepcional." },
    { icono: "tiburon",   conIcono: true,  arte: "assets/img/pieza-tiburones.png", nombre: "Restos de tiburones", detalle: "Dientes y vértebras que reconstruyen la vida de los mares antiguos." },
    { icono: "hueso",     conIcono: true,  arte: "assets/img/pieza-huesos.png", nombre: "Huesos de dinosaurios", detalle: "Fémures, vértebras y costillas que sostienen la reconstrucción del esqueleto." },
    { icono: "huevo",     conIcono: true,  arte: "assets/img/pieza-huevos.png", nombre: "Huevos de dinosaurios", detalle: "Nidadas fósiles con la cáscara conservada, evidencia directa de su reproducción." },
    { icono: "recon",     conIcono: true,  arte: "assets/img/pieza-reconstrucciones.png", nombre: "Reconstrucciones", detalle: "Esqueletos y reconstrucciones que devuelven forma a los fósiles." }
  ]
};

/* --- Servicios (copy oficial, CR-41 2026-10-13) ---
   El dueño envió la descripción oficial de lo que ofrece el museo:
     "ofrece charlas de educación, actividades de divulgación sobre temáticas
      geológicas y/o paleontológicas, propuestas museográficas y exposiciones
      temáticas de geología y/o paleontología a empresas, municipalidades,
      establecimientos educacionales, sociedades científicas y centros
      culturales."
   Se amplió el alcance y se listan los destinatarios REALES que él nombró.
   ⚠️ El servicio "Exposición escolar itinerante" se REEMPLAZA por PALEOMUNDO
   (nombre propio de la muestra, dictado por él). Ver nota CEPCHILE abajo. */
const SERVICIOS = [
  {
    titulo: "Charlas y divulgación",
    detalle: "Charlas de educación y actividades de divulgación sobre temáticas geológicas y paleontológicas, para establecimientos educacionales, sociedades científicas y centros culturales.",
    icono: "museo"
  },
  {
    titulo: "Propuestas museográficas y exposiciones",
    detalle: "Diseño de propuestas museográficas y montaje de exposiciones temáticas de geología y paleontología para empresas, municipalidades, establecimientos educacionales, sociedades científicas y centros culturales.",
    icono: "colegio"
  },
  {
    titulo: "Servicios profesionales",
    detalle: "Monitoreos paleontológicos en terreno, elaboración de estudios de línea de base paleontológica, asesoría y charlas de capacitación a personal especializado de empresas.",
    icono: "terreno",
    destacado: true
  },
  {
    /* PALEOMUNDO — muestra museológica itinerante, nombre oficial dictado por
       el dueño. Datos textuales suyos: "en conjunto con el Centro de Estudios
       Paleontológicos de Chile y el Museo Paleontológico de Chile", "25 vitrinas"
       (el pendiente viejo decía 20: el dueño confirmó 25 el 2026-10-13), "llevada
       a los establecimientos educacionales de Santiago", "cuyo costo se realiza
       a través del Museo".
       ⚠️ CEPCHILE SE CONSERVA tal cual: es trayectoria de un proyecto conjunto,
       NO una dependencia vigente. Regla del dueño 2026-10-12: "INFORMACION
       OBSOLETA, PERO RESCATABLE". No volver a preguntar por esto. */
    titulo: "PALEOMUNDO — muestra museológica itinerante",
    detalle: "Muestra itinerante del Museo Paleontológico de Chile, realizada en conjunto con el Centro de Estudios Paleontológicos de Chile, que se lleva a los establecimientos educacionales de Santiago. El costo se realiza a través del Museo.",
    icono: "colegio"
  }
];

/* --- Nota legal de los servicios profesionales --- */
const SERVICIOS_NOTA =
  "Este trabajo se realiza a través de la alianza con GeoPaleo Ltda., empresa de geólogos y paleontólogos aprobada por el Consejo de Monumentos Nacionales (CMN) para permisos de prospección y excavación, y para estudios en el marco de las exigencias del SEIA.";

/* --- Detalle de PALEOMUNDO (CR-41, 2026-10-13) ---
   Contenido de la muestra, textual del dueño: "la puesta en valor de 25 vitrinas
   conteniendo una interesante y hermosa colección de fósiles, calcos de fósiles
   de vertebrados a escala, corales, minerales, insectos, moluscos y además de una
   colección de reconstrucciones paleobiológicas de dinosaurios y cráneos de
   dinosaurios".
   ⚠️ El pendiente guardado decía 20 vitrinas: el dueño CONFIRMÓ 25 el 2026-10-13
   ("si, tiene 25 actualmente"). Manda el 25.
   Vive aparte de SERVICIOS para no saturar la tarjeta; lo pinta el render como
   bloque de detalle. */
const PALEOMUNDO = {
  titulo: "Qué lleva PALEOMUNDO",
  intro: "La muestra consiste en la puesta en valor de 25 vitrinas con:",
  items: [
    "Una colección de fósiles y calcos de fósiles de vertebrados a escala",
    "Corales, minerales, insectos y moluscos",
    "Reconstrucciones paleobiológicas de dinosaurios",
    "Cráneos de dinosaurios",
    "Material educativo, pedagógico y didáctico de gran interés para alumnos de enseñanza básica y media."
  ],
  /* --- Fotos de la muestra itinerante montada en establecimientos ---
     CR-45 (2026-10-13): el dueño pidio moverlas aca, desde Galeria:
       "LA DE LOS EXPOSICION EN ESCUELAS NO DEBEN IR EN GALERIA, SI NO EN
        SERVICIOS ITINERANTES".
     Son las fotos de la itinerante CON estudiantes. Viven en assets/img/galeria/
     porque es la carpeta de fotos del sitio (el nombre de la carpeta no cambia
     por el cambio de seccion).
     ⚠️ `titulo`/`pie` VACIOS a proposito: los escribe el dueño (DEC-034). */
  fotos: [
    { src: "assets/img/galeria/exposicion-escuela-1.jpg", mini: "assets/img/galeria/exposicion-escuela-1-mini.jpg", titulo: "", pie: "" },
    { src: "assets/img/galeria/exposicion-escuela-2.jpg", mini: "assets/img/galeria/exposicion-escuela-2-mini.jpg", titulo: "", pie: "" }
  ]
};

/* --- GALERÍA (CR-44, 2026-10-13) ---
   Fotos REALES del museo, autorizadas por el dueño: "EL MUSEO AUTORIZA
   MOSTRARLA".

   ⚠️ LAS FOTOS DE LA MUESTRA ITINERANTE **NO VAN ACA** — el dueño lo corrigio
   (CR-45): "LA DE LOS EXPOSICION EN ESCUELAS NO DEBEN IR EN GALERIA, SI NO EN
   SERVICIOS ITINERANTES". Viven en PALEOMUNDO.fotos (mas abajo), que es el
   bloque de la muestra itinerante dentro de Servicios.
   Por eso esta galeria tiene SOLO el bloque del museo.

   ⚠️ IMPORTANTE — PROCEDENCIA: hasta hoy el sitio tenia CERO imagenes de
   terceros (DEC-012 prohibe fotos de piezas sin verificar origen; DEC-027
   repite la regla). Estas son las PRIMERAS fotos del sitio y entran con
   autorizacion explicita del dueño del museo. Si en el futuro llegan mas
   fotos, PREGUNTAR DE DONDE SALIERON antes de publicarlas (la leccion del
   caso del amonite con copyright sigue vigente).

   ⚠️ TEXTOS: los campos `titulo` / `pie` de cada foto estan VACIOS A PROPOSITO.
   Los escribe el dueño. El agente NO redacta copy institucional (regla que
   quedo tras inventar frases en QUIENES_SOMOS, DEC-034). Si un campo va vacio,
   el render muestra la imagen sin ese texto: no rompe, pero NO se rellena solo.

   Las imagenes viven en assets/img/galeria/ (grande + sufijo -mini para la
   grilla). Estan optimizadas: 55-124 KB cada una. */
const GALERIA = {
  /* Intro de la seccion. VACIA = no se pinta (el render la oculta). */
  intro: "",
  museo: [
    { src: "assets/img/galeria/muestra-1.jpg",      mini: "assets/img/galeria/muestra-1-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/muestra-2.jpg",      mini: "assets/img/galeria/muestra-2-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/muestra-3.jpg",      mini: "assets/img/galeria/muestra-3-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/muestra-4.jpg",      mini: "assets/img/galeria/muestra-4-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/ninos-en-museo.jpg", mini: "assets/img/galeria/ninos-en-museo-mini.jpg", titulo: "", pie: "" }
  ]
};

if (typeof window !== "undefined") {
  window.MUSEO = MUSEO; window.QUIENES_SOMOS = QUIENES_SOMOS;
  window.COLECCIONES = COLECCIONES; window.SERVICIOS = SERVICIOS;
  window.SERVICIOS_NOTA = SERVICIOS_NOTA; window.PALEOMUNDO = PALEOMUNDO;
  window.GALERIA = GALERIA;
}
