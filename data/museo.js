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
     NO. El dueño ya explicó que miden cosas distintas.

     CR-46 (2026-10-13): el dueño pidió que el hero muestre DOS TEXTOS
     SEPARADOS en vez de la frase unida por coma:
       - línea 1: "Museo Paleontológico de Chile"
       - línea 2: "40 años trayendo el pasado al presente."
     Por eso el lema se guarda ahora en DOS campos (`lema` y `lemaB`). El texto
     sigue siendo exactamente el mismo, sin agregar ni quitar palabras: sólo se
     deja de unir con la coma. `lema` se mantiene con la frase completa como
     respaldo para los <meta> y para cualquier consumidor que espere una cadena
     única. */
  lema: "Museo Paleontológico de Chile, 40 años trayendo el pasado al presente.",
  lemaA: "Museo Paleontológico de Chile",
  lemaB: "40 años trayendo el pasado al presente.",
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

  /* --- Dirección del museo (CR-54d, 2026-10-15) ---

     🔴 ESTO LEVANTA UNA RESTRICCIÓN ANTERIOR. LEER ANTES DE REVERTIR.

     DEC-041 (2026-10-13) decía: "No hay autorización para subir datos personales
     del Museo" — el nombre del Director quedó FUERA del sitio a propósito, y hay
     un marcador de relleno en QUIENES_SOMOS (`Administracion y curacion`) que lo
     documenta. NO se borra ese marcador: sigue siendo cierto para esa sección.

     El 2026-10-15 el dueño AUTORIZÓ lo contrario y lo confirmó dos veces:
       "SI autorizo: el nombre y el curriculum de Juan Castillo Cornejo se
        publican arriba en el hero"
       "si, el me dio el consentimiento, un resumen corto que llegue a una
        subpagina"
     ⇒ El consentimiento es del propio director ("el me dio el consentimiento"),
     no solo del dueño del sitio. Es la autorización que faltaba.

     ⚠️ SI UNA SESIÓN FUTURA VE ESTO Y PIENSA QUE CONTRADICE DEC-041: no es un
     error, es una autorización posterior y explícita. Se registra como DEC-042.
     ⚠️ El texto NO es redacción del agente en ningún caso: son las MISMAS
     palabras que el dueño dictó el 2026-10-12 (guardadas en HANDOFF.md), sin
     agregar ni una frase nueva (regla DEC-034). */
  director: {
    /* El nombre va EXACTO como lo dictó el dueño: mayúsculas sostenidas y sin
       tildes en "CASTILLO CORNEJO" tal cual aparece en su bloque oficial. */
    nombre: "JUAN CASTILLO CORNEJO",
    cargo: "Director y Curador del Museo Paleontológico de Chile",

    /* MINI CURRÍCULUM del hero: 4 líneas cortas, pedido textual del dueño
       ("un resumen corto que llegue a una subpagina"). Es un RESUMEN de lo que
       él dictó, recortado — no prosa nueva. Los 4 libros van en UNA línea. */
    mini: [
      "Diplomado en Paleontología y Patrimonio Paleontológico, Universidad Autónoma de Zacatecas (México).",
      "Diplomado en Diseño y Espacios Expositivos, Universidad Adolfo Ibáñez.",
      "Más de 30 años de exposiciones y cursos de paleontología en Chile."
      /* CR-55g (2026-10-15): el dueño pidió QUITAR de acá la línea "Autor de
         cuatro libros..." — textual: "quita lo de autor de 4 libros en el mini
         curriculum, para hacer espacio".
         ⇒ Sale del MINI del hero, que es un resumen. NO se pierde el dato: los
         cuatro libros siguen publicados, con sus títulos, en la subpágina
         (curriculum.html, desde `libros`). El resumen se acorta, el detalle no.
         ⚠️ Si se repone, que sea por pedido suyo: la lista del hero tiene que
         caber junto al horario y cada línea cuenta. */
    ],

    /* CURRÍCULUM COMPLETO de la subpágina. Las MISMAS palabras del dueño, con los
       mismos datos que ya estaban guardados en HANDOFF:293-308, SIN agregar nada.
       ⚠️ Se conservan GRINPACH y CEPCHILE por la regla de 2026-10-12: en la
       trayectoria de una PERSONA el nombre viejo es HISTORIA, no dato obsoleto,
       y un currículum no se "actualiza". */
    completo: [
      "Diplomado en Paleontología y Patrimonio Paleontológico, Universidad Autónoma de Zacatecas (México).",
      "Diplomado en Diseño y Espacios Expositivos, Universidad Adolfo Ibáñez.",
      "Estudios de Ancient Marine Reptile, Universidad de Alberta (Canadá).",
      "Presidente del Grupo de Investigaciones Paleontológicas de Chile (GRINPACH).",
      "Profesor asesor del Museo Nacional de Historia Natural en \"Juventudes Científicas de Chile\".",
      "Paleontólogo en el Museo de Colchagua (Fundación Cardoen).",
      "Más de 30 años de exposiciones y cursos de paleontología; artículos y ensayos de divulgación; entrevistas en televisión, prensa y revistas.",
      "Profesor del curso \"Paleontología básica, una introducción al estudio de la vida antigua\"; trabajos en terreno."
    ],
    libros: [
      "Dinosaurios en Chile y los vertebrados del Mesozoico",
      "Megabestias en Chile y los vertebrados del Cenozoico",
      "Dinosaurios y otros animales prehistóricos en Chile",
      "Tiburones fósiles de Chile y la fauna fósil de Bahía Inglesa"
    ],

    /* CR-55 (2026-10-15): la SUBPÁGINA con el currículum completo.
       El dueño la pidió textual: "un resumen corto que llegue a una subpagina".
       ⚠️ Es una RUTA, igual que `arte` en las piezas: vive en el data/ y no
       escrita a mano en el render, para que el enlace siga a un solo lugar.
       ⚠️ La subpágina NO trae ninguna frase nueva: repite `completo` y `libros`
       tal cual, que son las palabras del dueño. El sitio pasa de 1 a 2 páginas. */
    /* Retrato. Lo mandó el dueño el 2026-10-15 y autorizó publicarlo
       ("Él la mandó para el sitio: se publica autorizada (igual que el
       currículum)"). Archivo original: 500x522 px, recortado a CUADRADO
       centrado (el encuadre se subió 10px porque la cara está alta) y guardado
       en dos tamaños, porque se usa en dos lugares:
         -160 : la card del hero (el círculo mide ~72px; 160 da margen para 2x)
         -520 : la subpágina, donde va más grande
       ⚠️ NO se sube el original: la foto es de 500px y en la subpágina se vería
       blanda. Si el dueño consigue una de más resolución, se reemplaza el archivo
       y listo: la ruta no cambia. */
    foto: "assets/img/director/director-160.jpg",
    fotoGrande: "assets/img/director/director-520.jpg",

    /* Destino del enlace "Ver el currículum completo" del mini currículum. */
    subpagina: "curriculum.html"
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

/* --- Quiénes somos — MODULO CERRADO (CR-48, 2026-10-13) ---
   El dueño pidió QUITAR la sección del sitio: "el no quiere sacar esa
   informacion por ahora". Sus palabras: "borremos el quienes somos, pero lo
   dejamos como modulo cerrado... por si cambia de opinion hagamoslo asi".

   ⚠️ QUE SIGNIFICA "MODULO CERRADO" ACA — no se borro NADA:
     - El HTML de la sección sigue en el index.html (envuelto, ver abajo).
     - El CSS sigue en css/secciones/somos.css.
     - El render sigue en pintarSomos() de js/render.js.
     - Este contenido completo sigue aca.
   Lo unico que cambia es `QUIENES_SOMOS.visible: false`. El render lo lee y
   esconde la sección, y el CSS la oculta. NADA mas.

   🔓 PARA REACTIVAR: poner `visible: true`. Eso es TODO. (Y si se reactiva,
   revisar que los `pendientes` de abajo sigan vigentes: eran la lista de datos
   que el museo tiene que dictar.)

   ⚠️ POR QUE QUEDO CERRADO Y NO BORRADO: el contenido de esta seccion incluye
   texto institucional que el museo NO autoriza publicar por ahora (pertenencia,
   quienes estan detras, datos personales). Se cierra para no exponerlo, pero se
   conserva porque el dueño dijo que podria cambiar de opinion. BORRARLO haria
   perder trabajo ya dictado y volver a preguntar todo de nuevo. */
const QUIENES_SOMOS = {
  /* 🔓 INTERRUPTOR UNICO: false = seccion oculta en el sitio. true = visible.
     Lo leen pintarSomos() (render.js) y el CSS (.somos--cerrado). */
  visible: false,
  parrafos: [
    "Su muestra ha sido diseñada y estructurada de acuerdo a criterios expuestos por investigadores del área: arquitectos, biólogos, paleontólogos y la asesoría de técnicos museólogos.",
    "Si bien el recinto para esta muestra es pequeño, se han aprovechado todos los espacios para entregar conocimientos y para que los visitantes puedan apreciar piezas paleontológicas de nuestro país y del mundo.",
    "Es el primer museo chileno que centra su muestra en la paleontología y en restos fósiles, que ayudan a comprender la vida pasada de nuestro país y nuestro planeta.",
    "Su principal objetivo apunta a difundir el conocimiento y protección de la paleontología nacional, acercando a la gente a esta ciencia de gran interés para la comunidad, pero de escasa difusión en los medios."
  ],
  mision: "Difundir y proteger el patrimonio paleontológico nacional.",

  /* --- MARCADORES DE RELLENO (CR-47, 2026-10-13) ---
     Pedido del dueño: "en quienes somos pone textos a rellenar para decirle al
     senior que poner ahi o quiere poner ahi".

     Son HUECOS DECLARADOS: lugares donde el museo TIENE que decidir que va, y
     que hasta hoy estaban simplemente ausentes (por eso nadie sabia que
     faltaban). Se pintan VISIBLES en el sitio para que se vea que estan
     pendientes — no se rellenan con prosa del agente (regla DEC-034: reescribir
     copy institucional no es trabajo del agente).

     ⚠️ Cuando el dueño dicte el contenido: se escribe el texto en `valor` y se
     pone `pendiente: false`. Con `pendiente: true` el render lo muestra como
     recuadro de aviso.
     ⚠️ ESTOS MARCADORES NO DEBEN QUEDAR EN LA VERSION PUBLICADA si el museo no
     los quiere mostrar asi: avisar antes de publicar. */
  pendientes: [
    {
      clave: "Pertenece a",
      nota: "FALTA DEFINIR: de quien depende el museo (o si es independiente) y como se declara. El duenio pidio NO publicar la pertenencia hasta autorizarlo.",
      valor: "",
      pendiente: true
    },
    {
      clave: "Quienes estan detras",
      nota: "FALTA DEFINIR: quienes estan detras del museo hoy y con que cargos (la info anterior era obsoleta). El duenio pidio NO publicar datos personales sin autorizacion.",
      valor: "",
      pendiente: true
    },
    {
      clave: "Desde",
      nota: "FALTA CONFIRMAR: los 40 anos son del museo. Falta el ano exacto de inicio, que el duenio nunca indico.",
      valor: "",
      pendiente: true
    },
    {
      clave: "Administracion y curacion",
      /* CR-49 (2026-10-13): RESUELTO EN CONTRA. El duenio mando el bloque oficial
         de servicios encabezado por esta linea textual:
             "No hay autorizacion para subir datos personales del Museo..."
         justo DEBAJO del nombre del Director y curador (Juan Castillo Cornejo).
         => Es una RESTRICCION, no un dato a publicar: el Director NO se publica.
         Interpretacion anterior (creer que "dejalo" lo autorizaba) queda
         SUPERADA. No se agrega ninguna seccion de "Administracion y curacion"
         con su nombre mientras no haya autorizacion explicita.
         ⚠️ No confundir con M.contacto.correos (castillocornejojuan@gmail.com),
         que SI se mantiene: es el canal de consultas del museo, no un perfil. */
      nota: "NO SE PUBLICA: el duenio informo que NO hay autorizacion para subir datos personales del museo. El nombre del Director queda fuera hasta que lo autorice.",
      valor: "",
      pendiente: true
    }
  ]
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
    /* CR-60 (2026-10-15): el dueño pidió que la card de Trilobites ABRA SU SUBPÁGINA.
       `enlace` es el MISMO mecanismo que usan los servicios (js/render.js,
       pintarServicios), así que no se inventó nada: la card se vuelve un <a>.
       ⚠️ `enlaceTexto` es OBLIGATORIO cuando hay `enlace`: si falta, el render pone
       "Ver más" por defecto, que es texto que NO dictó el dueño. */
    { icono: "trilobite", conIcono: true,  arte: "assets/img/pieza-trilobites.png", nombre: "Trilobites",   detalle: "Artrópodos marinos extintos, de los fósiles más representativos del Paleozoico.",
      enlace: "trilobites.html", enlaceTexto: "Conocer los trilobites" },
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
    /* CR-49: PALEOMUNDO ya NO es una tarjeta mas de Servicios — tiene su
       SECCION PROPIA y destacada (#paleomundo, entre Colecciones y Servicios),
       por pedido del dueño. Dejarla aca tambien la duplicaba: el mismo bloque
       aparecia dos veces en la pagina.
       En su lugar queda un servicio que ENLAZA a la seccion, para que quien
       llegue por "Servicios" la encuentre igual. */
    /* CR-54 (2026-10-15): el nombre de la muestra cambió a "Proyecto C.E.C".
       La tarjeta y su enlace se actualizan junto con la sección: si solo se
       cambiara la sección, Servicios seguiría mandando a un nombre que ya no
       existe en la página. El ancla `#paleomundo` NO cambia (ver nota arriba):
       es la coordenada interna del enlace, no texto visible. */
    titulo: "Exposición escolar itinerante Proyecto C.E.C",
    detalle: "Llevamos la muestra museológica itinerante a los establecimientos educacionales de Santiago, en conjunto con el Centro de Estudios Paleontológicos de Chile. Ver la sección Proyecto C.E.C para el detalle de la muestra.",
    icono: "colegio",
    enlace: "#paleomundo",
    enlaceTexto: "Ver Proyecto C.E.C"
  }
];

/* --- Nota legal de los servicios profesionales --- */
const SERVICIOS_NOTA =
  "Este trabajo se realiza a través de la alianza con GeoPaleo Ltda., empresa de geólogos y paleontólogos aprobada por el Consejo de Monumentos Nacionales (CMN) para permisos de prospección y excavación, y para estudios en el marco de las exigencias del SEIA.";

/* --- Detalle de la muestra itinerante (CR-41, 2026-10-13) ---
   Contenido de la muestra, textual del dueño: "la puesta en valor de 25 vitrinas
   conteniendo una interesante y hermosa colección de fósiles, calcos de fósiles
   de vertebrados a escala, corales, minerales, insectos, moluscos y además de una
   colección de reconstrucciones paleobiológicas de dinosaurios y cráneos de
   dinosaurios".
   ⚠️ El pendiente guardado decía 20 vitrinas: el dueño CONFIRMÓ 25 el 2026-10-13
   ("si, tiene 25 actualmente"). Manda el 25.
   Vive aparte de SERVICIOS para no saturar la tarjeta; lo pinta el render como
   bloque de detalle.

   🔴 CR-54 (2026-10-15) — LA MUESTRA SE LLAMA AHORA **PROYECTO C.E.C**.
     El dueño, textual: "paleomundo se cambia a proyecto C.E.C, proyecto de
     cultur, educacion y capatizacion". Al pedirle el nombre exacto para publicar
     (regla de nombres propios: se transcriben como los dicta su dueño) eligió:
       "Proyecto C.E.C — Cultura, Educación y Capacitación
        (con la sigla primero, siempre en ese orden)".
     ⇒ PALEOMUNDO queda SUPERADO como nombre visible. No se usa en el sitio.
     ⚠️ CEPCHILE SE CONSERVA: el dueño eligió explícitamente que sigue apareciendo
     donde dice "en conjunto con". Es trayectoria del proyecto, no una dependencia
     vigente (regla 2026-10-12: "información obsoleta, pero rescatable").
     ⚠️ La CONSTANTE JS se llamaba `PALEOMUNDO` y `render.js` la lee así
     (`window.PALEOMUNDO`). Se conserva el nombre de la constante para no tocar el
     render sin ganar nada; lo que cambia es el TEXTO que el dueño ve. El ancla
     `#paleomundo` del HTML también se conserva por el mismo motivo (cambiarla
     obliga a tocar index.html, render y animaciones.js a la vez, y el ancla no
     se ve en pantalla). */
const PALEOMUNDO = {
  /* --- Encabezado de la SECCION PROPIA (CR-49) ---
     ⚠️ SIN TITULARES INVENTADOS. El dueño pidio: "no poner titulares, solo las
     imagenes de la expo y cosas de relleno importantes".
     Por eso:
       - `tituloSec` es el NOMBRE oficial de la muestra, dictado por el mismo.
         CR-54: hoy es "Proyecto C.E.C" (antes "PALEOMUNDO").
       - `introSec` es TEXTUAL suyo, copiada de su bloque oficial sin agregar
         ni cambiar palabras.
     Si el dueño quiere otro texto, se cambia aca y ya. */
  tituloSec: "Proyecto C.E.C",
  /* --- Logo de la muestra (CR-56, 2026-10-15) ---
     El dueño entregó el arte de la muestra (Imagen2b.jpg, 1000x400) y pidió
     sumarlo "como logo arriba de esa seccion".

     🔴 CR-56b (2026-10-15) — LA IMAGEN SE CONVIRTIÓ A PNG CON TRANSPARENCIA.
     El dueño pidió primero "va tal cual" (JPEG, fondo negro) y después pidió
     "hacer el proyecto CEC con gradiente negro a azul para que la imagen combine
     con el fondo". Esas dos cosas son incompatibles: un JPEG no tiene
     transparencia, así que el negro era PINTURA, no vacío, y ningún gradiente
     detrás lo atraviesa. Con el gradiente puesto, el 84% negro de la imagen
     habría seguido siendo un rectángulo negro sobre fondo azul — PEOR que antes.
     ⇒ Autorizado por el dueño ("hazla"), se generó `cec-logo.png` con alfa.

     CÓMO (y por qué así, no recortando el negro):
     El arte es trazo CLARO sobre negro puro, así que la LUMINANCIA es la
     cobertura de tinta (alfa). Pero recortar el negro a secas deja HALO: medido,
     los píxeles de borde tenían luminancia 20 contra 163 del trazo sólido, o sea
     un filo oscuro sucio que se ve sobre azul. La causa es el ruido de JPEG.
     ⇒ Se DESCUENTA el fondo (unpremultiply):  observado = color·alfa + negro·(1−alfa)
        con negro = 0  =>  color = observado / alfa.   Es el caso simple.
     Medido después: la luminancia del borde pasó de **20 a 233** (toma el color
     del trazo) y hay **0 píxeles oscuros con alfa alto**. Sin halo.

     ⚠️ EL JPG ORIGINAL SE CONSERVA en `assets/img/cec-logo.jpg`: no se borra, es
     el archivo que entregó el dueño. Si hay que volver atrás, se revierte esta
     línea y ya. Regla del proyecto: desactivar reversible > borrar.
     ⚠️ Peso: el PNG pesa 215 KB (el JPEG 52 KB). No se reduce a 560px porque la
     card lo muestra a 560px CSS y en pantalla retina eso necesita el doble:
     bajarlo a 560px reales lo haría ver blando en un celular moderno.
     ⚠️ Si algún día hay que aligerarlo, la vía es `pngquant`/paleta, NO volver al
     JPEG: volver al JPEG devuelve el fondo negro y rompe el gradiente. */
  logo: "assets/img/cec-logo.png",
  /* Texto alternativo del logo. Es DESCRIPTIVO del archivo, no copy nuevo:
     la sigla ya está en la sección. Si el dueño quiere otro texto, se cambia
     acá (DEC-005). */
  logoAlt: "Proyecto C.E.C — Cultura, Educación y Capacitación",
  /* CR-54: el nombre COMPLETO para publicar, con la sigla primero. Se usa como
     bajada bajo el titulo, porque "Proyecto C.E.C" solo no dice de que se trata
     a quien no conoce la sigla. Es el nombre que el dueño confirmo, textual. */
  subtituloSec: "Cultura, Educación y Capacitación",
  introSec: "Muestra museológica itinerante que el museo lleva, en conjunto con el Centro de Estudios Paleontológicos de Chile, a los establecimientos educacionales de Santiago. Su costo se realiza a través del Museo.",
  /* --- Bloque de contenido: lo que LLEVA la muestra (CR-41) ---
     Titulo e intro abajo son, tambien, redaccion minima de estructura sobre el
     dato del dueño ("la puesta en valor de 25 vitrinas conteniendo..."). */
  titulo: "Qué lleva el Proyecto C.E.C",
  intro: "La muestra consiste en la puesta en valor de 25 vitrinas con:",
  /* --- Píldoras: los datos duros, para leer de un golpe (CR-50) ---
     ⚠️ Son datos TEXTUALES del dueño, no frases del agente:
       - "25 vitrinas"            -> confirmado por el ("si, tiene 25 actualmente")
       - en conjunto con CEPCHILE -> textual de su bloque oficial
       - costo a traves del Museo -> textual ("cuyo costo se realiza a traves del Museo")
       - basica y media           -> textual ("alumnos de ensenanza basica y media")
     Si el dueño quiere otro dato aca, se cambia solo esto. */
  datos: [
    { clave: "25", valor: "vitrinas en exhibición", icono: "museo" },
    { clave: "En conjunto con", valor: "el Centro de Estudios Paleontológicos de Chile", icono: "check" },
    { clave: "Costo", valor: "a través del Museo", icono: "check" },
    { clave: "Para", valor: "enseñanza básica y media", icono: "colegio" }
  ],
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
    /* CR-52 (2026-10-13): se quitó UNA de las dos fotos por pedido del dueño.
       Primero se sacó la 1ª y el dueño aclaró que era al revés: se queda la
       PRIMERA (exposicion-escuela-1.jpg) y se va la segunda.
       ⚠️ El archivo de la que sale NO se borró de assets/img/galeria/: sigue en
       disco y en el repo, por si la quiere de vuelta. Reactivar = volver a
       agregar acá su línea `{ src: ..., mini: ... }`. Es lo mismo que se hizo
       con las piezas en pausa (CR-16): se deja de usar, no se destruye. */
    { src: "assets/img/galeria/exposicion-escuela-1.jpg", mini: "assets/img/galeria/exposicion-escuela-1-mini.jpg", titulo: "", pie: "" }
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


/* --- TRILOBITES (subpágina propia) ---
   CR-60 (2026-10-15): el dueño entregó el documento «Que son los trilobites.docx»
   (17,6 MB, 38 imágenes) y pidió una SUBPÁGINA que se abra apretando la card de
   Trilobites en Colecciones.

   ⚠️ TEXTO: es ÍNTEGRO del documento del museo, sin una palabra redactada por el
   agente (regla DEC-034). Sólo se separó en secciones y se corrigieron dos errores
   evidentes de tipeo del original (ver `notaTexto` abajo). NO reescribir este texto:
   si hay que cambiarlo, lo dicta el dueño.

   🔴 IMÁGENES: NO son las del documento. Las 38 del docx se descartaron porque NO
   tienen procedencia comprobable: el docx no trae crédito, ni autor, ni licencia en
   ningún punto, y la medición detectó señales de material bajado de terceros (una
   imagen con fondo rosado de página web, otra con fondo azul plano armado, una foto
   en blanco y negro de lámina escaneada, dos láminas ya rotuladas en español).
   Es el mismo caso del ÁMBAR (DEC-027), que estaba medido e integrado y se quedó sin
   publicar. El dueño autorizó el REEMPLAZO por material de Wikimedia Commons con
   licencia verificable.

   ✅ PROCEDENCIA: cada imagen de `assets/img/trilobites/` tiene licencia declarada y
   verificada por API contra Wikimedia Commons (dominio público / CC0 / CC BY / CC BY-SA).
   La ficha completa —autor, licencia y enlace— está en
   `assets/img/trilobites/creditos.json`, y el render la publica como SECCIÓN DE
   ATRIBUTOS al pie de la subpágina (pedido del dueño).

   ⚠️ SON FÓSILES DE OTROS MUSEOS DEL MUNDO (Marruecos, Canadá, Utah, Wisconsin), NO
   piezas de la muestra del MPCH. Ilustran el capítulo, no la vitrina: no choca con
   DEC-012, que prohíbe fotografiar las piezas del museo. No presentarlas nunca como
   parte de la colección propia.
*/
const TRILOBITES = {
  // El nombre de la clave es el mismo que usa MUSEO.director.subpagina.
  subpagina: "trilobites.html",
  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },
  etiqueta: "Colecciones · Paleozoico",
  titulo: "Trilobites",
  bajada:
    "Artrópodos marinos extintos, de los fósiles más representativos del Paleozoico.",
  /* La intro es el PRIMER párrafo del documento, textual. */
  intro:
    "Los trilobites fueron un grupo común de artrópodos marinos paleozoicos, provistos de un caparazón cuticular dorsal mineralizado en carbonatos (exoesqueleto) y fosilizable, la que permitió que tengan gran representación en el registro fósil. Estuvieron presentes durante 300 millones de años en todos los mares y océanos de la era Paleozoica (que va desde hace 541 a 252 millones de años). Desde que aparecen en el Cámbrico Temprano, su diversidad alcanzó valores elevados en el Cámbrico Tardío y Ordovícico, para decrecer durante el Silúrico-Devónico y reducirse aún más en el Paleozoico Tardío (Carbonífero), antes de extinguirse a fines del Pérmico.",

  /* Secciones. `nivel: 2` = sección principal; `nivel: 3` = subsección de Anatomía. */
  secciones: [
    {
      id: "que-son",
      titulo: "¿Qué son los trilobites?",
      nivel: 2,
      parrafos: [
        "Los trilobites fueron un grupo común de artrópodos marinos paleozoicos, provistos de un caparazón cuticular dorsal mineralizado en carbonatos (exoesqueleto) y fosilizable, la que permitió que tengan gran representación en el registro fósil. Estuvieron presentes durante 300 millones de años en todos los mares y océanos de la era Paleozoica (que va desde hace 541 a 252 millones de años). Desde que aparecen en el Cámbrico Temprano, su diversidad alcanzó valores elevados en el Cámbrico Tardío y Ordovícico, para decrecer durante el Silúrico-Devónico y reducirse aún más en el Paleozoico Tardío (Carbonífero), antes de extinguirse a fines del Pérmico.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/cefalon-numerado.svg",
          ancho: 260, alto: 180,
          alt: "Esquema de las áreas del cefalón de un trilobite, con cada zona numerada y rotulada",
          pie: "Las tres regiones del cuerpo: cefalón, tórax y pigidio.",
          credito: "cefalon-numerado"
        },
        {
          src: "assets/img/trilobites/cranidio-numerado.svg",
          ancho: 230, alto: 160,
          alt: "Esquema del cranidio de un trilobite con sus elementos numerados",
          credito: "cranidio-numerado"
        },
      ],
    },
    {
      id: "estructura",
      titulo: "Estructura de los trilobites",
      nivel: 2,
      parrafos: [
        "Los trilobites estaban protegidos por un exoesqueleto dorsal fuertemente calcificado, de simetría bilateral y convexidad variable, que continuaba ventralmente como un doblez marginal angosto. Los trilobites poseen un cuerpo segmentado con un exoesqueleto ovalado o subelíptico en vista dorsal y está dividido longitudinalmente en tres regiones (del latín Tri, tres y lobus, lóbulo = Tres lóbulos). Su exoesqueleto está constituido de cierto número de segmentos a lo largo del cuerpo, un par de surcos axiales divide al exoesqueleto en un lóbulo central (axis, raquis) y dos lóbulos laterales (genas en el céfalo; área o campos pleurales en el tórax-pigidio), a los cuales hace alusión el término «Trilobita o trilobite».",
        "En ambos extremos del cuerpo los segmentos están unidos y forman un escudo, que en el extremo anterior forma la cabeza o cefalón, en tanto que en el extremo posterior forma el escudo caudal o pigidio. En la región intermedia o tórax está constituida por pleuras articuladas, todos los segmentos están separados. Estas tres partes del cuerpo tienen porciones axiales y pleurales, y, por consiguiente, el cuerpo presenta un aspecto transversalmente dividido en tres zonas.",
        "El exoesqueleto dorsal está marcado por un par de surcos o estrías que separan la región axial de las pleurales, las que tienen un relieve interno donde se adhieren los músculos que accionan los miembros locomotores. El exoesqueleto ventral es muy delicado, por ello se ha conservado en raras ocasiones, siendo el lugar en donde se sitúan los apéndices.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/suturas-faciales.jpg",
          ancho: 918, alto: 271,
          alt: "Diagrama de las suturas faciales del cranidio de un trilobite",
          pie: "Las suturas faciales dividen el escudo cefálico en tres piezas.",
          credito: "suturas-faciales"
        },
        {
          src: "assets/img/trilobites/hipostoma.jpg",
          ancho: 3127, alto: 910,
          alt: "Tipos de hipostoma de trilobites según su forma de unión",
          pie: "Tipos de hipostoma, la placa ventral de la boca.",
          credito: "hipostoma"
        },
      ],
    },
    {
      id: "locomocion",
      titulo: "Locomoción",
      nivel: 2,
      parrafos: [
        "Los miembros encargados de la natación reciben el nombre de exopodito y consta de numerosas uniones o coyunturas que proporcionan un soporte a una serie de estructuras duras y aplanadas, como púas, que en gran número forman un eficiente sistema de nado, que le servía para movilizarse en el medio acuático.",
        "En otras ocasiones los trilobites caminaban o reptaban en la superficie del fondo, para lo cuál utilizaban otro miembro locomotor llamado endopodito, que estaba constituido por seis fuertes junturas de material quitinoso y que funcionó como una pata y se situaba por debajo del exopodito.",
        "Por detrás de la base de adherencia de esta pata se sitúa un órgano parecido a una hoja llamado epidodito, que tenía a su cargo la función respiratoria, por lo tanto, funcionaba como una branquia.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/triarthrus.jpg",
          ancho: 984, alto: 1468,
          alt: "Vista ventral de un Triarthrus eatoni con los apéndices conservados",
          pie: "Triarthrus eatoni en vista ventral: exopodito, endopodito y epipodito visibles.",
          credito: "triarthrus"
        },
      ],
    },
    {
      id: "huellas",
      titulo: "Huellas fósiles de trilobites",
      nivel: 2,
      parrafos: [
        "Las huellas fósiles o icnofósiles son parte de la actividad biológica del desenvolvimiento del trilobite en su ambiente. Estas huellas son a lo menos de tres tipos: Cruziana, Diplichnites y Rusophycus. Normalmente se encuentran como contramoldes, en relieve invertido, en la base (cara inferior) en capas de arenisca o cuarcita.",
        "Cruziana se interpreta como pistas fósiles debidas a la locomoción y la alimentación de trilobites en el fondo arenoso.",
        "Diplichnites se interpreta como pistas del desplazamiento rápido sobre la superficie arenosa.",
        "Rusophycus se interpreta como huellas de reposo (cubichnia) o quizás de alimentación.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/cruziana.jpg",
          ancho: 585, alto: 267,
          alt: "Icnofósil Cruziana en arenisca devónica",
          pie: "Cruziana: locomoción y alimentación en el fondo arenoso.",
          credito: "cruziana"
        },
        {
          src: "assets/img/trilobites/diplichnites.jpg",
          ancho: 2000, alto: 1093,
          alt: "Icnofósil Diplichnites sobre superficie arenosa",
          pie: "Diplichnites: desplazamiento rápido sobre la superficie.",
          credito: "diplichnites"
        },
        {
          src: "assets/img/trilobites/rusophycus.jpg",
          ancho: 1889, alto: 1118,
          alt: "Icnofósil Rusophycus en roca ordovícica",
          pie: "Rusophycus: huellas de reposo.",
          credito: "rusophycus"
        },
      ],
    },
    {
      id: "anatomia",
      titulo: "Anatomía del trilobite",
      nivel: 2,
    },
    {
      id: "cefalon",
      titulo: "El cefalón",
      nivel: 3,
      parrafos: [
        "El céfalo (cabeza) o cefalón presenta un contorno variable, subcircular a semielíptico, subtriangular o trapezoidal. La mayoría de las especies posee una región axial elevada, denominada glabela, que está definida anterior y lateralmente por un surco preglabelar y los surcos axiales.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/cefalon-numerado.svg",
          ancho: 260, alto: 180,
          alt: "Esquema de las áreas del cefalón de un trilobite, con cada zona numerada y rotulada",
          credito: "cefalon-numerado"
        },
      ],
    },
    {
      id: "torax",
      titulo: "El tórax",
      nivel: 3,
      parrafos: [
        "Esta es la sección del exoesqueleto es en donde se encuentran los tergitos que es la placa dorsal o porción dorsal de la cubierta de un segmento metamérico (metámero es cada uno de los segmentos que se repiten en ciertos grupos de animales, celomados de simetría bilateral o bilateria), de un artrópodo especialmente en el abdomen), separados. están articulados entre sí para permitir flexibilidad e inserción en el siguiente tergito. El número de segmentos torácicos varía entre dos y hasta cuarenta y dos, con mayor frecuencia en el rango de ocho a quince.",
      ],
    },
    {
      id: "pigidio",
      titulo: "La zona caudal o pigidio",
      nivel: 3,
      parrafos: [
        "La zona caudal o pigidio es un elemento involucrado en el sistema natatorio del trilobite, dando impulso al animal en su desplazamiento, el pigidio al igual que el céfalo, es una placa única, constituida por la fusión de los elementos posteriores.",
        "El contorno del pigidio es generalmente semielíptico, aunque en varios casos adopta otras formas como semicircular, triangular, pentagonal o subcuadrangular. Asimismo, su tamaño relativo varía considerablemente: el trilobite es denominado micropigidio (a), si el pigidio es mucho más pequeño que el céfalo, mesopigidio (b), si ambas placas tienen una tamaño un poco más pequeño o dimensiones similares al cefalón, y macropigidio (c) cuando el pigidio es del mismo tamaño o más grande que el cefalón.",
      ],
    },
    {
      id: "muda",
      titulo: "Muda o ecdisis",
      nivel: 2,
      parrafos: [
        "En el exoesqueleto cefálico de la mayoría de los trilobites, existen simétricamente líneas de debilidad llamadas suturas faciales, que suministraban espacios a partir de los cuales el animal se desprendía del viejo e inservible exoesqueleto, que, una vez fuera del cuerpo se denomina exubio. Las otras placas se encontraban articuladas entre sí, por lo cual era fácil su desprendimiento durante la ecdisis. Las más desarrolladas entre los trilobites fueron las suturas faciales o también llamadas dorsales, que permiten dividir el esqueleto cefálico en tres piezas: Una central llamada cranidio y dos laterales llamadas genas libres o librígenas. Durante la ecdisis, lo normal es que las tres piezas del cefalón se deprendieran por separado del tórax.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/suturas-faciales.jpg",
          ancho: 918, alto: 271,
          alt: "Diagrama de las suturas faciales del cranidio de un trilobite",
          credito: "suturas-faciales"
        },
      ],
    },
    {
      id: "alimentacion",
      titulo: "Alimentación en los trilobites",
      nivel: 2,
      parrafos: [
        "El Trilobites se alimentaba triturando el alimento con los apéndices ubicados a los costados del labrum y llevándolos hasta el orificio bucal, y luego a la zona estomacal. Esto sugiere una alimentación llamada tronco-extremidades, el mecanismo que implica la creación de una corriente de alimentación por un movimiento rítmico de las extremidades, en este caso haciendo que las bases del telopodito transportan las partículas de comida a la boca a través del surco alimentario ventral.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/hipostoma.jpg",
          ancho: 3127, alto: 910,
          alt: "Tipos de hipostoma de trilobites según su forma de unión",
          credito: "hipostoma"
        },
      ],
    },
    {
      id: "vision",
      titulo: "Visión de los trilobites",
      nivel: 2,
      parrafos: [
        "Los ojos de los trilobites estaban compuestos por numerosas lentes de composición calcítica, los  lentes estaban hechos de cristales de calcita, que se sitúan en la línea media del caparazón y a los costados de la glabela y son bastante visibles, éstos presentan formas muy variables, algunas  especies son ciegas habitando zonas del fondo fangoso del mar, en tanto que otras especies tienen ojos durante su estado juvenil, los que luego se atrofian hasta desaparecer en el estado de edad avanzada; sin embargo, la mayoría de las especies poseen un sistema visual bastante eficaz. Los ojos son compuestos y consisten en numerosos lentes llamados omatidios, cada uno de los cuales posee una cornea lisa que puede estar levantada o abollada, insertada en los agujeros redondos o poligonales.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/ojo-holocroal.jpg",
          ancho: 2048, alto: 1536,
          alt: "Ojo holocroal fosilizado de un trilobite con sus lentes de calcita",
          pie: "Ojo holocroal: lentes de calcita conservadas en el fósil.",
          credito: "ojo-holocroal"
        },
      ],
    },
    {
      id: "conga",
      titulo: "Líneas de conga",
      nivel: 2,
      parrafos: [
        "Se han encontrado numerosos ejemplos de abundantes, exoesqueletos de trilobites articulados dispuestos en patrones lineales muy compactos en lugares de esquistos fosilíferos y areniscas de grano fino de la Formación Arenig (Devónico, Floiano) en el sur Marruecos. Estas alineaciones de trilobites son también llamadas “congas”. Los fósiles recientemente descritos capturan grupos de estos animales desfilando por el fondo del océano, tal vez para migrar como grupo o reunirse para aparearse.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/conga.jpg",
          ancho: 5240, alto: 3300,
          alt: "Alineación de trilobites Isotellus conservados en fila",
          pie: "Alineaciones de trilobites, llamadas «congas».",
          credito: "conga"
        },
      ],
    },
    {
      id: "fondo",
      titulo: "Vida en el fondo",
      nivel: 2,
      parrafos: [
        "Los trilobites, por su forma aplanada, por sus ojos en posición dorsal y la dureza y flexibilidad de su caparazón se deduce que la mayoría eran animales bentónicos (Los organismos bentónicos son aquellos que se asocian a cualquier fondo acuático, viven en contacto o en una dependencia directa con el fondo del mar).  Seguramente eran micrófagos, filtrando el barro del fondo en que vivían para obtener el alimento, algunos carecían de apéndices excavadores o prensiles, así como de piezas bucales trituradoras.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/enrollado.jpg",
          ancho: 2893, alto: 3464,
          alt: "Trilobite Drotops armatus enrollado sobre sí mismo",
          pie: "El enrollamiento protege al animal del ataque de predadores.",
          credito: "enrollado"
        },
      ],
    },
    {
      id: "reproduccion",
      titulo: "Reproducción y apareamiento",
      nivel: 2,
      parrafos: [
        "Recientes investigaciones han revelado que existe una diferencia entre machos y hembras del trilobite Olenoides serratus, que podría tratarse de un dimorfismo sexual, ya que el macho al parecer presenta adaptaciones para el apareamiento. Se trata de apéndices funcionalmente especializados, que son extremidades análogas a los ganchos, en los endopoditos 10 y 11, que son utilizados por los machos hembra durante el apareamiento.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/olenoides.jpg",
          ancho: 3020, alto: 3845,
          alt: "Espécimen de Olenoides inflatus del Cámbrico medio",
          pie: "Olenoides: en esta especie se describió el dimorfismo sexual.",
          credito: "olenoides"
        },
      ],
    },
    {
      id: "dimorfismo",
      titulo: "Dimorfismo sexual en trilobites",
      nivel: 2,
      parrafos: [
        "El dimorfismo sexual se refiere a la exhibición de diferencias de apariencia entre machos y hembras de la misma especie, especialmente su tamaño, forma, color u órganos reproductivos sexuales. La mayoría de los artrópodos existentes presentan un fuerte dimorfismo sexual característico entre las especies, especialmente en la forma del cuerpo. Los trilobites exhibieron dimorfismo sexual entre sus especies como los artrópodos existentes, y su estudio es posible dado que los trilobites son uno de los artrópodos marinos extintos más abundantes y antiguos conocidos.",
        "Bajo alturas similares de especies similares, los machos parecen con su cabeza más aguzada (forma de víbora), en tanto que las hembras tienen una forma ligeramente esférica.",
        "Los machos tienen longitudes idénticas en ambas antenas, mientras que las hembras tienen longitudes diferentes.",
        "El cuerpo del macho tiene forma muscular de Hércules o se ve alargado, en tanto que las hembras se aprecian más globoso o gordo. Ejemplo el caso de Crotalocephalus.",
        "El cuerpo del macho tiene los primeros 6 segmentos del tórax tienen una forma pleural recta, mientras que el de la hembra parece ligeramente esférico.",
        "El cuerpo del macho tiene los primeros 6 segmentos del tórax tienen una forma pleural recta, mientras que el de la hembra parece ligeramente esférico.",
        "Los rasgos que diferencian a los morfotipos son diferentes para cada especie, pero incluyen tanto la longitud del pigidio, más corto en los machos, como variaciones en la longitud de algunos segmentos del tórax, presentando las hembras una zona más estrecha en el mismo.",
        "El área del tórax después de los primeros 6 segmentos del macho suele tener forma de “V” y alargarse hasta el final del   pigidio. Las hembras suelen presentar una estructura en forma de “U” con un pigidio más aplanado.",
        "Comparación entre macho (izquierda) y hembra (derecha) de Crotalocephalus gibbus de Alnif, Marruecos; y en B/N, Comparación entre macho (izquierda, 5,40 cm) y hembra (derecha, 5,72 cm) de Sokhretia cf solitaria de Tisserdmine, Erfoud, Marruecos.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/acadoparadoxides.jpg",
          ancho: 5125, alto: 3141,
          alt: "Espécimen de Acadoparadoxides briareus conservado completo",
          pie: "Acadoparadoxides: las diferencias entre morfotipos varían en cada especie.",
          credito: "acadoparadoxides"
        },
      ],
    },
    {
      id: "espinas",
      titulo: "Espinas, tubérculos y tridentes",
      nivel: 2,
      parrafos: [
        "Los trilobites se encontraban entre los invertebrados dominantes en los mares del Paleozoico y exhibían una extraordinaria variedad de morfología exoesquelética, comúnmente tenían protuberancias cefálicas, espinas o bulbos, en su tórax, mostrando una notable variedad de formas. Es probable que su función principal fuera la protección contra depredadores sobre todo en estado de enrollamiento que los haría muy difícil de atacar o para el desplazamiento hidrodinámico. En tanto que otros postulan que eran rasgos sexuales secundarios.",
        "Dentro de estas características existen algunos trilobites que exhiben un tridente frontal muy extraño, que al parecer es una especie de arma. Walliserops trifurcatus llevaba un tridente único y gigante en la cabeza, cuya finalidad ha sido durante mucho tiempo un misterio. Ahora se piensa que se utilizaba para las peleas entre machos que luchaban por el dominio de las hembras.",
        "Walliserops trifurcatus",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/walliserops.jpg",
          ancho: 2310, alto: 3694,
          alt: "Fósil de Walliserops trifurcatus con su tridente frontal",
          pie: "Walliserops trifurcatus y su tridente frontal.",
          credito: "walliserops"
        },
      ],
    },
    {
      id: "enrollamiento",
      titulo: "Enrollamiento de los trilobites",
      nivel: 2,
      parrafos: [
        "Muchos trilobites poseían la capacidad de enrollarse frente a condiciones adversas o para protegerse del ataque de predadores. El exoesqueleto enrollado representa una cápsula parcial o completamente cerrada, con el cefalón y el pigidio en contacto entre sí. Para lograr esta singular disposición es importante el papel que cumplían los extremos de las pleuras, que se imbricaban al nivel de las facetas articulantes para permitir la flexión del tórax.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/enrollado.jpg",
          ancho: 2893, alto: 3464,
          alt: "Trilobite Drotops armatus enrollado sobre sí mismo",
          pie: "El exoesqueleto enrollado forma una cápsula casi cerrada.",
          credito: "enrollado"
        },
      ],
    },
    {
      id: "desarrollo",
      titulo: "Desarrollo de los trilobites",
      nivel: 2,
      parrafos: [
        "Los trilobites tienen un periodo de desarrollo en que el animal sufre diferentes cambios corporales en su ontogenia, el primer estadio de desarrollo después de eclosionar el huevo es conocido como protaspis (A), en este momento los trilobites presentan un perfil circular y sin segmentos libres, la mejilla se encuentra fija y está dividida solo en pleuras, constituyendo una nueva prueba de la segmentación original de la cabeza.",
        "El estadio siguiente se caracteriza por una serie de cambios que lleva al Trilobite desde una condición juvenil a la adulta, la que recibe el nombre de meraspis (B), en esta etapa se produce la formación de las zonas torácicas y pigidial, en tanto que en la cabeza se desarrolla la glabela y la región visual. El último estadio en que los trilobites alcanzan su estado de madurez o adulto se denomina holaspis (C), definiendo en este momento las características que el animal tendrá hasta su muerte.",
      ],
    },
    {
      id: "tamano",
      titulo: "Tamaño",
      nivel: 2,
      parrafos: [
        "Los trilobites, durante su evolución, alcanzaron diversos tamaños, desde aquellos agnostidos de algunos milímetros, hasta aquellos gigantes como Isotelus rex, que alcanzo un tamaño de más de 70 centímetros. Esta diversidad de tamaños sin duda influyo en la forma de vida de estos formidables artrópodos.",
        "Trilobites pequeños, izquierda y grande, Acadoparadoxides briareus",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/isotelus.jpg",
          ancho: 3640, alto: 4340,
          alt: "Isotelus rex, uno de los trilobites más grandes conocidos, expuesto en el Royal Tyrrell Museum",
          pie: "Isotelus rex: más de 70 centímetros de largo.",
          credito: "isotelus"
        },
      ],
    },
  ],

  /* Aviso de procedencia de las imágenes. Se pinta sobre la sección de atributos. */
  notaImagenes:
    "Las imágenes de esta página son de Wikimedia Commons y se reproducen con su licencia. " +
    "Corresponden a fósiles de otras colecciones del mundo: ilustran el capítulo, no forman " +
    "parte de la muestra del Museo Paleontológico de Chile.",

  atribucion: {
    titulo: "Créditos de las imágenes",
    intro:
      "Autor y licencia de cada imagen, según su ficha en Wikimedia Commons.",
    fuente: { texto: "Wikimedia Commons", url: "https://commons.wikimedia.org/" }
  },

  /* Cierre de la subpágina: devuelve al museo, no a un callejón sin salida. */
  cierre: {
    texto: "Los trilobites son una de las siete piezas de la muestra del museo.",
    boton: "Ver la colección completa",
    enlace: "index.html#colecciones"
  }
};

if (typeof window !== "undefined") {
  window.MUSEO = MUSEO; window.QUIENES_SOMOS = QUIENES_SOMOS;
  window.COLECCIONES = COLECCIONES; window.SERVICIOS = SERVICIOS;
  window.SERVICIOS_NOTA = SERVICIOS_NOTA; window.PALEOMUNDO = PALEOMUNDO;
  window.GALERIA = GALERIA; window.TRILOBITES = TRILOBITES;
}
