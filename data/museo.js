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
  pertenece: "Grupo de Investigaciones Paleontológicas de Chile (GRINPACH)",
  /* DEC-010: lema eliminado del sitio por decisión del museo. */
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

  /* --- Horarios (medido del sitio real) --- */
  horarios: [
    { dias: "Martes a viernes", horas: "10:00 – 17:00 hrs.", abierto: true },
    { dias: "Sábados y domingos", horas: "11:00 – 18:00 hrs.", abierto: true },
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
       Fuente: la lista `horarios` de arriba. */
    abre:    { 1: null, 2: 600, 3: 600, 4: 600, 5: 600,  6: 660, 0: 660 },
    cierra:  { 1: null, 2: 1020, 3: 1020, 4: 1020, 5: 1020, 6: 1080, 0: 1080 },
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

/* --- Quiénes somos (copy real del sitio) --- */
const QUIENES_SOMOS = {
  parrafos: [
    "El Museo Paleontológico de Chile es una entidad perteneciente al Grupo de Investigaciones Paleontológicas de Chile (GRINPACH). Ha sido diseñado y estructurado de acuerdo a criterios expuestos por investigadores de la agrupación: arquitectos, biólogos, paleontólogos y la asesoría de técnicos museólogos.",
    "Si bien el recinto para esta muestra es pequeño, se han aprovechado todos los espacios para entregar conocimientos y para que los visitantes puedan apreciar piezas paleontológicas de nuestro país y del mundo.",
    "Es el primer museo chileno que centra su muestra en la paleontología y en restos fósiles, que ayudan a comprender la vida pasada de nuestro país y nuestro planeta. En su primera etapa expone el resultado de más de 20 años de trabajo del Grupo de Investigaciones Paleontológicas de Chile.",
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

/* --- Servicios (copy real del sitio) --- */
const SERVICIOS = [
  {
    titulo: "Asesoramiento y colaboración museológica",
    detalle: "Apoyo técnico y museológico para instituciones que quieren montar o mejorar sus propias muestras paleontológicas.",
    icono: "museo"
  },
  {
    titulo: "Servicios profesionales",
    detalle: "Monitoreos paleontológicos en terreno, elaboración de estudios de línea de base paleontológica, asesoría y charlas de capacitación a personal especializado de empresas.",
    icono: "terreno",
    destacado: true
  },
  {
    titulo: "Exposición escolar itinerante",
    detalle: "Llevamos la muestra a colegios y establecimientos educacionales, con precios y convenios especiales.",
    icono: "colegio"
  }
];

/* --- Nota legal de los servicios profesionales --- */
const SERVICIOS_NOTA =
  "Este trabajo se realiza a través de la alianza con GeoPaleo Ltda., empresa de geólogos y paleontólogos aprobada por el Consejo de Monumentos Nacionales (CMN) para permisos de prospección y excavación, y para estudios en el marco de las exigencias del SEIA.";

if (typeof window !== "undefined") {
  window.MUSEO = MUSEO; window.QUIENES_SOMOS = QUIENES_SOMOS;
  window.COLECCIONES = COLECCIONES; window.SERVICIOS = SERVICIOS;
  window.SERVICIOS_NOTA = SERVICIOS_NOTA;
}
