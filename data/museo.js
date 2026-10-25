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
    /* --- LIBROS: con PORTADA (2026-10-17) ---
       🔴 CAMBIO DE FORMA. Antes era un arreglo de 4 strings (solo títulos).
       Ahora es un arreglo de OBJETOS {titulo, portada}: las portadas que el
       dueño entregó ese día van junto a cada título.

       ⚠️ El cambio de forma lo tolera `js/curriculum.js` (pintarPerfil lee
       `l.titulo` y si no existe usa el string tal cual). NO rompe si otra
       sesión deja un string suelto acá.

       ⚠️ El MAPPING se tomó del NOMBRE DE ARCHIVO que dictó el dueño, no de
       parecido visual: tres de las cinco portadas no decían su título y dos
       eran de dinosaurios. El nombre es la única fuente de verdad que hubo.
       Archivos originales en OneDrive/Desktop/libros; las copias normalizadas
       viven en assets/img/libros/ (520px de ancho los retratos, 900px el
       ilustrado apaisado). NO se sube el original de 2560px.

       5.º LIBRO (2026-10-17): el dueño entregó una QUINTA portada, "Libro
       ilustrado de los dinosaurios y los animales prehistóricos de Chile",
       que NO estaba en el currículum. Él eligió publicarla (opción "a"), así
       que el sitio pasa a decir CINCO libros y se actualizaron las dos metas
       de curriculum.html, que decían "cuatro". La portada de este va apaisada
       (2560x2047 original): entra en su propia fila al final, sin recortar. */
    libros: [
      {
        titulo: "Dinosaurios en Chile y los vertebrados del Mesozoico",
        portada: "assets/img/libros/dinosaurios-vertebrados-mesozoico.jpg",
        alt: "Portada del libro Dinosaurios en Chile y los vertebrados del Mesozoico"
      },
      {
        /* TÍTULO CORREGIDO POR EL DUEÑO (2026-10-17, CR-70).
           Antes decía "Megabestias en Chile y los vertebrados del Cenozoico".
           El dueño corrigió: "Megabestias... no es el nombre correcto, es
           dinosaurios en chile". El libro NO es de megabestias.
           ⚠️ El ARCHIVO de la portada conserva el nombre viejo
           (megabestias-vertebrados-cenozoico.jpg) a propósito: renombrar el
           archivo obligaría a tocar la ruta publicada sin ganar nada. Lo que
           manda es `titulo`; la ruta es sólo dónde vive la imagen. */
        titulo: "Dinosaurios en Chile",
        portada: "assets/img/libros/megabestias-vertebrados-cenozoico.jpg",
        alt: "Portada del libro Dinosaurios en Chile"
      },
      {
        /* TÍTULO CORREGIDO POR EL DUEÑO (2026-10-17, CR-70).
           Antes decía "Dinosaurios y otros animales prehistóricos en Chile".
           El nombre real es "Todo sobre... los dinosaurios y los animales
           prehistóricos de Chile" — el título EMPIEZA con "Todo sobre…".
           ⚠️ El archivo entregado por el dueño se llama "todo sobre.. los
           dinosaurios ...": coincide con su corrección, lo que confirma el
           mapeo. */
        titulo: "Todo sobre… los dinosaurios y los animales prehistóricos de Chile",
        portada: "assets/img/libros/dinosaurios-animales-prehistoricos-chile.jpg",
        alt: "Portada del libro Todo sobre los dinosaurios y los animales prehistóricos de Chile"
      },
      {
        titulo: "Tiburones fósiles de Chile y la fauna fósil de Bahía Inglesa",
        portada: "assets/img/libros/tiburones-fosiles-bahia-inglesa.jpg",
        alt: "Portada del libro Tiburones fósiles de Chile y la fauna fósil de Bahía Inglesa"
      },
      {
        /* Quinto libro, agregado el 2026-10-17. `ancho: true` = portada
           APAISADA (900x720). El render la saca de la grilla de 2 columnas y
           la pinta en una fila propia de ancho completo: si entrara a la
           grilla, quedaría un rectángulo acostado entre cuatro retratos.
           NO se recorta a proporción de libro: recortar una portada es
           inventar el arte del autor. */
        titulo: "Libro ilustrado de los dinosaurios y los animales prehistóricos de Chile",
        portada: "assets/img/libros/libro-ilustrado-dinosaurios-chile.jpg",
        alt: "Portada del libro ilustrado de los dinosaurios y los animales prehistóricos de Chile",
        ancho: true
      }
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
    { icono: "ammonite",  conIcono: true,  arte: "assets/img/pieza-ammonite.png", nombre: "Ammonites",    detalle: "Moluscos cefalópodos con concha en espiral, guías de la era Mesozoica.",
      /* CR-83 (2026-10-20): mismo mecanismo que Trilobites — el dueño pidió que la
         card abra su subpágina. `enlaceTexto` es obligatorio cuando hay `enlace`
         (si falta, el render escribe "Ver más", texto que el dueño no dictó). */
      enlace: "amonites.html", enlaceTexto: "Conocer los ammonites" },
    { icono: "ambar",     conIcono: true,  arte: "assets/img/pieza-ambar.png", nombre: "Ámbar",        detalle: "Resina fósil que conserva organismos con un detalle excepcional.",
      /* CR-86 (2026-10-24): el dueño pidió subpágina propia para el ámbar — mismo
         mecanismo que Trilobites (CR-60), Ammonites (CR-83) y Tiburones (CR-85).
         `enlaceTexto` es OBLIGATORIO cuando hay `enlace`: si falta, el render
         escribe "Ver más", que es texto que NO dictó el dueño. */
      enlace: "ambar.html", enlaceTexto: "Conocer el ámbar" },
    /* CR-85 (2026-10-20): el dueño pidió subpágina propia para los tiburones, así que
       la card ABRE su página — mismo mecanismo que Trilobites (CR-60) y Ammonites
       (CR-83). `enlaceTexto` es OBLIGATORIO cuando hay `enlace`: si falta, el render
       escribe "Ver más", que es texto que NO dictó el dueño. */
    { icono: "tiburon",   conIcono: true,  arte: "assets/img/pieza-tiburones.png", nombre: "Restos de tiburones", detalle: "Dientes y vértebras que reconstruyen la vida de los mares antiguos.",
      enlace: "tiburones.html", enlaceTexto: "Conocer los tiburones" },
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
       existe en la página. */
    /* CR-66 (2026-10-16): acá decía que el ancla `#paleomundo` «NO cambia».
       Es falso y ya no aplica: el ancla SÍ se renombró a `#cec`, porque el
       nombre viejo se retiró por DERECHOS DE AUTOR y el ancla es una URL
       pública (barra del navegador + href de cada enlace compartido).
       ⚠️ Los enlaces viejos siguen funcionando por el `<span id="paleomundo">`
       de compatibilidad al final de la sección `#cec`. */
    titulo: "Exposición escolar itinerante Proyecto C.E.C",
    detalle: "Llevamos la muestra museológica itinerante a los establecimientos educacionales de Santiago, en conjunto con el Centro de Estudios Paleontológicos de Chile. Ver la sección Proyecto C.E.C para el detalle de la muestra.",
    icono: "colegio",
    /* CR-71 (2026-10-17): el enlace a la subpágina se apaga con el interruptor.
       Si `CEC_SUBPAGINA.visible` es false, esta tarjeta se pinta SIN enlace
       (no queda un link muerto a una página rebotada).
       ⚠️ El texto sigue nombrando la sección `#cec` de la portada, que NO se
       oculta: la muestra se sigue contando ahí. */
    enlace: "proyecto-cec.html",
    enlaceTexto: "Ver Proyecto C.E.C"
  }
];

/* --- Nota legal de los servicios profesionales --- */
const SERVICIOS_NOTA =
  "Este trabajo se realiza a través de la alianza con GeoPaleo Ltda., empresa de geólogos y paleontólogos aprobada por el Consejo de Monumentos Nacionales (CMN) para permisos de prospección y excavación, y para estudios en el marco de las exigencias del SEIA.";

/* --- SUBPÁGINA DEL PROYECTO C.E.C: OCULTA DEL PÚBLICO (2026-10-17, CR-71) ---

   El dueño pidió: «borremos c.e.c o quitemos del publico, hare cambios».
   Eligió OCULTAR, no borrar.

   🔓 INTERRUPTOR ÚNICO: `visible: false` ⇒
      · los enlaces que apuntan a `proyecto-cec.html` NO se pintan (ver
        `subpagina`, tarjeta de SERVICIOS y `origen` más abajo);
      · el archivo `proyecto-cec.html` sigue en el repo, pero al abrirlo por
        URL directa NO muestra la subpágina: rebota al inicio (lo hace
        `js/cec.js`, leyendo este mismo interruptor).

   ✅ PARA REACTIVAR: poner `visible: true`. Eso es TODO. No hay nada borrado.

   ⚠️ POR QUÉ OCULTA Y NO BORRA (misma razón que QUIENES_SOMOS): el contenido
   de esa página es material dictado por el dueño (CEC.intro, CEC.relacion,
   publicaciones, actividades, difusión). Borrarla obligaría a volver a pedir
   todo. Y el dueño dijo que HARÁ CAMBIOS: cuando estén, se reemplaza el
   contenido y se prende el interruptor.

   ⚠️ `proyecto-cec.html` está publicada en GitHub Pages: dejar de enlazarla NO
   la saca del público, porque responde igual por URL directa. Por eso el
   archivo NO se borra pero SÍ se hace rebotar. */
const CEC_SUBPAGINA = { visible: true };

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
const MUSEO_ITINERANTE = {
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
  /* CR-62c (2026-10-15): el dueño reportó que la sección "parece como si fuera
     gratis". Tenía razón: la píldora decía sólo "Costo: a través del Museo", que
     es tan vago que se lee como que no se paga.

     El material que entregó el dueño SÍ trae el dato concreto, textual:
       "no tiene cargo para el establecimiento educacional ya que el costo es de
        cargo del alumno ($ 1000 por alumno) sólo requiriéndose de parte del
        establecimiento educacional que provea de una sala segura y con llave
        que permita mantener la muestra segura y bien resguardada durante los
        días que dure la exposición (2 o tres días)."
     ⇒ Se publica ese dato tal como lo escribió el dueño. NO se inventa precio ni
       condición: el monto y la modalidad son suyos.
     ⚠️ El texto ANTERIOR ("Su costo se realiza a través del Museo") no se borra
       de la historia: lo reemplaza este, que dice lo mismo pero con el monto. */
  /* 🔴 CR-72 (2026-10-17): introSec REESCRITA con el Word del dueño.
     El texto anterior hablaba del «Centro de Estudios Paleontológicos de Chile»
     y del precio por alumno. El Word dice ahora que el proyecto lo desarrollan
     el Museo JUNTO CON GEOPALEO LTDA., y no menciona precio.
     ⇒ Se transcribe el Word: quiénes lo hacen y a quién va dirigida la muestra
       itinerante. NO se agrega ni se quita nada (DEC-034).
     ⚠️ El precio por alumno SE QUITÓ por decisión explícita del dueño
       («si no está en el Word, no va»). Sigue en el historial (daf09df). */
  introSec: "Proyecto desarrollado por el Museo Paleontológico de Chile junto con GeoPaleo Ltda. La muestra museológica itinerante es llevada a los establecimientos educacionales de Santiago y, bajo ciertas circunstancias de financiamiento, también puede ser llevada a las distintas regiones de Chile.",
  /* --- Bloque de contenido: lo que LLEVA la muestra (CR-41) ---
     Titulo e intro abajo son, tambien, redaccion minima de estructura sobre el
     dato del dueño ("la puesta en valor de 25 vitrinas conteniendo..."). */
  titulo: "Qué lleva el Proyecto C.E.C",
  intro: "La muestra consiste en la puesta en valor de 20 vitrinas con:",
  /* --- Píldoras: los datos duros, para leer de un golpe (CR-50) ---
     ⚠️ Son datos TEXTUALES del dueño, no frases del agente:
       - "25 vitrinas"            -> confirmado por el ("si, tiene 25 actualmente")
       - en conjunto con CEPCHILE -> textual de su bloque oficial
       - costo a traves del Museo -> textual ("cuyo costo se realiza a traves del Museo")
       - basica y media           -> textual ("alumnos de ensenanza basica y media")
     Si el dueño quiere otro dato aca, se cambia solo esto. */
  datos: [
    /* CR-72 (2026-10-17): VITRINAS 25 -> 20. El dueño entregó un Word nuevo que
       dice «20 vitrinas» y eligió «reemplaza todo». El 25 venía de una
       confirmación suya anterior (CR-41) y queda SUPERADA por su propio
       documento. Manda el Word. */
    { clave: "20", valor: "vitrinas en exhibición", icono: "museo" },
    { clave: "3 días", valor: "se presenta en el establecimiento", icono: "check" },
    /* 🔴 CR-72: AQUÍ ESTABA EL PRECIO («$1.000 por alumno · sin cargo para el
       establecimiento») Y SE QUITÓ. El Word nuevo no lo menciona, y el dueño
       eligió explícitamente: «si no está en el Word, no va».
       ⚠️ El dato NO se perdió: sigue en el historial (daf09df) y en HANDOFF.
         Si mañana quiere volver a publicarlo, se repone esta línea tal cual.
       ⚠️ Se reemplazó por las REGIONES, que el Word sí dice («bajo ciertas
         circunstancias de financiamiento también puede ser llevada a las
         distintas regiones de Chile») — así el bloque no queda con 3 píldoras. */
    { clave: "Santiago", valor: "y también regiones, según financiamiento", icono: "terreno" },
    { clave: "Para", valor: "enseñanza básica y media", icono: "colegio" }
  ],
  /* 🔴 CR-72: la lista reproduce el CONTENIDO del Word, en su orden.
     Antes decía «fósiles y calcos de fósiles de vertebrados a escala» y no
     mencionaba METEORITOS ni distinguía «reales y réplicas», que es lo que el
     Word del dueño dice ahora. Se transcribe su enumeración, sin inventar
     categorías (DEC-034). */
  items: [
    "Una interesante y hermosa colección de fósiles reales y réplicas",
    "Corales, minerales, meteoritos, insectos y moluscos",
    "Una colección de reconstrucciones paleobiológicas de dinosaurios",
    "Material educativo, pedagógico y didáctico de gran interés especialmente para los alumnos de enseñanza básica y media del sistema educacional chileno."
  ],
  /* CR-61/CR-62c: enlace a la subpágina del Proyecto C.E.C, que reúne el
     detalle completo (quiénes son, publicaciones, actividades, difusión).
     ⚠️ Es texto de RÓTULO (dice a dónde lleva), no prosa nueva: por eso puede
     escribirlo el agente, igual que los títulos de sección de la subpágina. */
  subpagina: { enlace: "proyecto-cec.html", texto: "Ver el Proyecto C.E.C completo", visible: true },
  /* --- De dónde NACE el proyecto (CR-67, 2026-10-16) ---
     El dueño reportó que la sección "describe la muestra pero no dice qué es el
     C.E.C" y pidió tres cosas: de dónde nace el proyecto · quién lo dirige ·
     que hay un especialista guiando.

     ⇒ ALCANCE REAL DE CADA UNA (y por qué NO hay prosa nueva acá):

       1. «De dónde nace»  -> NO es un texto que falte escribir: el origen YA
          está publicado en la subpágina, en `CEC.intro` ("surge del interés de
          personas comprometidas con la Paleontología…") y en `CEC.relacion`.
          Lo que faltaba era el CAMINO. Se resuelve con este enlace rotulado,
          que dice a dónde lleva (misma categoría que "Ver el Proyecto C.E.C
          completo" de más arriba, CR-62c).
          🔴 NO se redacta un párrafo nuevo acá: DEC-034 prohíbe al agente
          escribir copy institucional, y el origen ya tiene su texto aprobado.

       2. «Quién lo dirige» -> el nombre y el cargo de `MUSEO.director`
          (DEC-042 autoriza publicarlos). Lo pinta el render bajo el logo.

       3. «Un especialista guiando» -> YA ESTÁ, y es TEXTUAL del material del
          Centro: el 3er párrafo de `CEC.museoItinerante`. En la portada, la
          tarjeta de `datos` siempre lo dijo ("Contamos con un especialista
          guiando" — verificado en el commit b524765). El texto se acortó DESPUÉS,
          cuando el dueño pidió priorizar el COSTO (CR-62c), y hoy el dato dice
          "La muestra cuenta además con la guía explicativa de dos profesionales".
          ⇒ El hecho sigue publicado; lo que se pierde en celular es la PALABRA
            «especialista». Eso es lo que hay que hacer visible, no un texto nuevo.
          ⚠️ Un valor corto está EN CAPACIDAD de ser recortado por el ellipsis de
          su línea (le pasó a "Museo Paleontológico de Chile" -> "Museo
          Paleontológico de C…"). Por eso el texto de este enlace se acorta.
          ⚠️ El párrafo del dato está escrito con «dos profesionales»: si el
            dueño confirma que es UNO, se corrige ahí (dato suyo, DEC-005). */
  /* 🔴 CR-72 (2026-10-17): EL ENLACE «CÓMO NACE EL C.E.C» SE RETIRA.
     El dueño lo pidió explícitamente: «quita el que dice como nace c.e.c en la
     landing tambien». Era un enlace de la portada hacia la subpágina
     (`proyecto-cec.html#proyecto-cec`), es decir un cuarto camino a la subpágina
     además de los tres que ya apagaba CR-71.
     Hasta acá estaba apagado con `visible: false`; ahora se retira el DATO, que
     es lo definitivo: no vuelve solo si alguien pone el interruptor en true.
     ⚠️ `MUSEO_ITINERANTE.origen` queda en `null` y `js/render.js` salta el bloque
       sin pintar nada (`if (cecSubVisible && p.origen && p.origen.enlace)`), así
       que no queda ni un <div> vacío.
     ⚠️ SI SE QUIERE REPONER: el texto y el destino están en el historial de git
       (`git show 3e2daf6:data/museo.js`). */
  origen: null,
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
    /* 🔴 CR-74 (2026-10-17): SE ELIMINA LA PRIMERA FOTO (`muestra-1`).
       Pedido del dueño: «borremos la primera foto en la seccion museo por
       dentro». En la grilla es la que ocupa la esquina superior izquierda
       (medida: x=69, y=3446, primera de la fila), o sea muestra-1.
       ⚠️ Se retira del data, NO se borra el archivo: `assets/img/galeria/
         muestra-1.jpg` y su `-mini` siguen en el repo. Si vuelve a quererla,
         se repone esta línea y listo.
       ⚠️ La línea original decía:
           { src: "assets/img/galeria/muestra-1.jpg", mini: "...", titulo: "", pie: "" }, */
    { src: "assets/img/galeria/muestra-2.jpg",      mini: "assets/img/galeria/muestra-2-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/muestra-3.jpg",      mini: "assets/img/galeria/muestra-3-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/muestra-4.jpg",      mini: "assets/img/galeria/muestra-4-mini.jpg",      titulo: "", pie: "" },
    { src: "assets/img/galeria/ninos-en-museo.jpg", mini: "assets/img/galeria/ninos-en-museo-mini.jpg", titulo: "", pie: "" }
  ]
};


/* --- ENTIDADES QUE APOYAN EL MUSEO (sección de la portada) ---
   CR-80 (2026-10-19): el dueño entregó «Entidades que apoyan el Museo.docx» y
   pidió una SECCIÓN NUEVA en la portada, antes del pie de página.

   🔴 REGLA QUE MANDA ACÁ — es texto CIENTÍFICO, lo van a leer paleontólogos:
     el `texto` de cada entidad es ÍNTEGRO del Word, sin redactar ni resumir
     (DEC-034). Sólo se aplicaron DOS correcciones, aprobadas por el dueño:
       1. Entidad 2: se quitó un DOBLE ESPACIO («es  una» → «es una»).
       2. Entidad 5: «Libros» → «libros» (mayúscula al medio de una lista).
     ⚠️ NO se tocó nada más. En particular se DEJARON tal cual, a propósito:
       - `GEOPALEO LTDA. es una empresa…` (sin mayúscula tras el punto, como
         lo escribió el museo);
       - `PROYECTO C.E.C. Este Proyecto educacional, está destinado…` (el punto
         corta la frase, pero así está en el Word y es legible);
       - los nombres propios en MAYÚSCULAS, exactos como los dictó el dueño.
     ⇒ Si alguien «mejora» estos párrafos, está introduciendo texto distinto al
       del museo. No lo hagas sin pedido explícito.

   ⚠️ LOS LOGOS salen DEL PROPIO DOCX (word/media/*), copiados byte a byte, sin
     recomprimir y SIN recortar el fondo (regla del proyecto: jamás quitar
     fondos). Son JPEG con fondo propio, por eso en el render van dentro de una
     CAJA BLANCA: sobre el azul del sitio un logo con texto oscuro desaparece.
   ⚠️ RESOLUCIÓN PENDIENTE: los originales del Word miden 415-667 px de ancho.
     Sirven en pantalla pero son flojos en retina. El dueño pedirá versiones
     grandes a cada entidad: cuando lleguen, se REEMPLAZA EL ARCHIVO con el
     mismo nombre y no hay que tocar ni este data ni el CSS.
   ⚠️ `ancho`/`alto` son los REALES de cada archivo (reservan espacio, evitan CLS). */
const ENTIDADES = {
  tituloSec: "Entidades que apoyan el museo",
  bajada: "",
  lista: [
    {
      nombre: "GEOPALEO LTDA.",
      texto:
        "GEOPALEO LTDA. es una empresa que brinda asesoría en Geología y " +
        "Paleontología, orientada al análisis y evaluación de impacto al medioambiente " +
        "relacionado con las áreas de patrimonio, paleontología y Geociencias, constituida " +
        "por un grupo multidisciplinario de geólogos, paleontólogos y otros profesionales " +
        "que ofrecen un servicio oportuno y calificado en relación a la conservación y " +
        "protección del patrimonio paleontológico, natural y cultural de Chile.",
      logo: "assets/img/entidades/geopaleo-ltda.jpg",
      ancho: 574, alto: 173
    },
    {
      nombre: "CENTRO DE ESTUDIOS PALEONTOLÓGICOS DE CHILE",
      texto:
        "El CENTRO DE ESTUDIOS PALEONTOLÓGICOS DE CHILE, es una organización privada, que " +
        "busca desarrollar estrategias que fomenten la difusión del estudio y conservación " +
        "del Patrimonio Paleontológico Nacional. Asimismo, buscamos promover la investigación " +
        "científica a nivel nacional y utilizar la divulgación como una herramienta educativa " +
        "para que la comunidad en general comprenda el valor que tienen los fósiles y su estudio.",
      logo: "assets/img/entidades/centro-estudios-paleontologicos.jpg",
      ancho: 573, alto: 334
    },
    {
      nombre: "GRUPO DE AMIGOS DEL MUSEO PALEONTOLÓGICO",
      texto:
        "GRUPO DE AMIGOS DEL MUSEO PALEONTOLÓGICO, es una comunidad de personas que " +
        "colaboran, con trabajo y recursos tanto en terreno como en el Museo Paleontológico " +
        "de Chile, en las diferentes exposiciones con logística y conocimientos en el área " +
        "museológica.",
      logo: "assets/img/entidades/grupo-amigos-museo.jpg",
      ancho: 415, alto: 337
    },
    {
      nombre: "PROYECTO C.E.C.",
      texto:
        "PROYECTO C.E.C. Este Proyecto educacional, está destinado a promover proyectos " +
        "culturales y educacionales enfocados a la capacitación en áreas de servicios " +
        "paleontológicos y geológicos para empresas, museos, municipalidades o colegios, " +
        "que busquen preparar a personas en estas áreas.",
      logo: "assets/img/entidades/proyecto-cec.jpg",
      ancho: 667, alto: 352
    },
    {
      nombre: "PALEO STORE",
      texto:
        "PALEO STORE, es una tienda virtual de GeoPaleo Ltda. y del Museo Paleontológico " +
        "de Chile, que busca poner a disposición de quien quiera comprar réplicas de " +
        "fósiles, minerales, libros de paleontología, geología y de ciencia en general, " +
        "poleras, juguetes relacionados con el área, etc.",
      logo: "assets/img/entidades/paleo-store.jpg",
      ancho: 602, alto: 229
    }
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
  subpagina: "trilobites.html",
  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },
  etiqueta: "Colecciones · Paleozoico",
  titulo: "Trilobites",
  bajada:
    "Artrópodos marinos extintos, de los fósiles más representativos del Paleozoico.",
  /* 🔴 CR-84 (2026-10-20): `intro: null` a propósito, mismo defecto que en
     AMMONITES y reportado por el dueño en esa página. Este párrafo se publicaba
     DOS veces: acá en la cabecera y otra vez en la sección «¿Qué son los
     trilobites?», que es donde el Word lo pone (bajo su título, con las
     imágenes). El render tolera null (`if (intro && T.intro)`) y la sección
     sigue publicando el texto íntegro. NO se borra contenido: se deja de
     repetirlo. */
  intro: null,

  /* ============================================================
     CR-81 (2026-10-19) — REHECHO DESDE EL WORD DEL MUSEO.

     FUENTE: «Que son los trilobites.docx» (17,6 MB, 38 imágenes).
     El dueño autorizó el uso de TODAS las imágenes:
       «ya se solucionó lo del copyright ya que eran cosas hechas por el mismo».

     🔴 EL ORDEN DE LAS IMÁGENES ES EL DEL WORD, LITERAL.
       Pedido explícito del dueño: «sin cambiar órdenes de imágenes».
       Los archivos se numeran 01..38 según su posición en el documento,
       así que un `01.jpg` significa «primera imagen del Word», no «la más
       linda». NO reordenar por tamaño, por proporción ni por criterio
       visual: rompe la correspondencia imagen ↔ párrafo.

     ⚠️ PROCEDENCIA: al ser material del museo, las figuras YA NO llevan
       `credito` ni entran en creditos.json — ese archivo describía las 15
       imágenes de Wikimedia Commons de la versión anterior. Sigue en disco
       por si se repone alguna, pero NINGUNA de estas 38 lo usa.
     ⚠️ PNG CON ALFA: 25 de las 38 son PNG RGBA. Se conservan en PNG porque
       pasarlas a JPEG RELLENA DE NEGRO lo transparente (error ya cometido
       en CR-60 y revertido). No convertir.
     ⚠️ TEXTO: íntegro del Word, sin redactar (DEC-034).
     ============================================================ */

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
          src: "assets/img/trilobites/word/01.jpg",
          ancho: 533, alto: 800,
          alt: "¿Qué son los trilobites? — imagen 1 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/02.jpg",
          ancho: 900, alto: 900,
          alt: "¿Qué son los trilobites? — imagen 2 del documento del museo"
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
          src: "assets/img/trilobites/word/03.png",
          ancho: 1351, alto: 558,
          alt: "Estructura de los trilobites — imagen 3 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/04.png",
          ancho: 1350, alto: 788,
          alt: "Estructura de los trilobites — imagen 4 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/05.jpg",
          ancho: 1013, alto: 946,
          alt: "Estructura de los trilobites — imagen 5 del documento del museo"
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
        "Triarthrus becki, Trilobites en vista dorsal an: Antena; ca: Cabeza; o: Ojo; s.f: sutura facial;  c.fi: Cara fija;  c.li; Cara libre;  gl: Glabela;  ag: Angulo genal;  pi: Pigidio; hi: Hipostoma; bo: Boca o labrum; ex: Exopodito; en: Endopodito; ep: Epipodito.",
      ],
      imagenes: [
        {
          src: "assets/img/trilobites/word/06.jpg",
          ancho: 971, alto: 790,
          alt: "Locomoción — imagen 6 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/07.png",
          ancho: 649, alto: 1067,
          alt: "Locomoción — imagen 7 del documento del museo"
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
          src: "assets/img/trilobites/word/08.png",
          ancho: 741, alto: 284,
          alt: "Huellas fósiles de trilobites — imagen 8 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/09.jpg",
          ancho: 551, alto: 290,
          alt: "Huellas fósiles de trilobites — imagen 9 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/10.png",
          ancho: 348, alto: 226,
          alt: "Huellas fósiles de trilobites — imagen 10 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/11.png",
          ancho: 1076, alto: 300,
          alt: "Huellas fósiles de trilobites — imagen 11 del documento del museo"
        },
      ],
    },
    {
      id: "anatomia",
      titulo: "Anatomía del trilobite",
      nivel: 2,
      parrafos: [],
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
          src: "assets/img/trilobites/word/12.png",
          ancho: 1394, alto: 601,
          alt: "El cefalón — imagen 12 del documento del museo"
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
      imagenes: [
        {
          src: "assets/img/trilobites/word/13.png",
          ancho: 738, alto: 392,
          alt: "El tórax — imagen 13 del documento del museo"
        },
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
      imagenes: [
        {
          src: "assets/img/trilobites/word/14.png",
          ancho: 763, alto: 324,
          alt: "La zona caudal o pigidio — imagen 14 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/15.png",
          ancho: 800, alto: 383,
          alt: "La zona caudal o pigidio — imagen 15 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/16.png",
          ancho: 644, alto: 431,
          alt: "La zona caudal o pigidio — imagen 16 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/17.png",
          ancho: 454, alto: 275,
          alt: "La zona caudal o pigidio — imagen 17 del documento del museo"
        },
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
          src: "assets/img/trilobites/word/18.png",
          ancho: 748, alto: 346,
          alt: "Muda o ecdisis — imagen 18 del documento del museo"
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
          src: "assets/img/trilobites/word/19.png",
          ancho: 1369, alto: 508,
          alt: "Alimentación en los trilobites — imagen 19 del documento del museo"
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
          src: "assets/img/trilobites/word/20.png",
          ancho: 920, alto: 313,
          alt: "Visión de los trilobites — imagen 20 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/21.png",
          ancho: 890, alto: 285,
          alt: "Visión de los trilobites — imagen 21 del documento del museo"
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
          src: "assets/img/trilobites/word/22.png",
          ancho: 897, alto: 497,
          alt: "Líneas de conga — imagen 22 del documento del museo"
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
          src: "assets/img/trilobites/word/23.png",
          ancho: 1166, alto: 668,
          alt: "Vida en el fondo — imagen 23 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/24.jpg",
          ancho: 800, alto: 600,
          alt: "Vida en el fondo — imagen 24 del documento del museo"
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
          src: "assets/img/trilobites/word/25.png",
          ancho: 1120, alto: 548,
          alt: "Reproducción y apareamiento — imagen 25 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/26.png",
          ancho: 801, alto: 250,
          alt: "Reproducción y apareamiento — imagen 26 del documento del museo"
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
          src: "assets/img/trilobites/word/27.png",
          ancho: 842, alto: 613,
          alt: "Dimorfismo sexual en trilobites — imagen 27 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/28.png",
          ancho: 498, alto: 538,
          alt: "Dimorfismo sexual en trilobites — imagen 28 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/29.png",
          ancho: 499, alto: 487,
          alt: "Dimorfismo sexual en trilobites — imagen 29 del documento del museo"
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
          src: "assets/img/trilobites/word/30.png",
          ancho: 687, alto: 341,
          alt: "Espinas, tubérculos y tridentes — imagen 30 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/31.png",
          ancho: 737, alto: 316,
          alt: "Espinas, tubérculos y tridentes — imagen 31 del documento del museo"
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
          src: "assets/img/trilobites/word/32.png",
          ancho: 831, alto: 411,
          alt: "Enrollamiento de los trilobites — imagen 32 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/33.png",
          ancho: 983, alto: 502,
          alt: "Enrollamiento de los trilobites — imagen 33 del documento del museo"
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
      imagenes: [
        {
          src: "assets/img/trilobites/word/34.png",
          ancho: 621, alto: 451,
          alt: "Desarrollo de los trilobites — imagen 34 del documento del museo"
        },
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
          src: "assets/img/trilobites/word/35.png",
          ancho: 744, alto: 520,
          alt: "Tamaño — imagen 35 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/36.jpg",
          ancho: 720, alto: 720,
          alt: "Tamaño — imagen 36 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/37.png",
          ancho: 351, alto: 467,
          alt: "Tamaño — imagen 37 del documento del museo"
        },
        {
          src: "assets/img/trilobites/word/38.jpg",
          ancho: 1014, alto: 1357,
          alt: "Tamaño — imagen 38 del documento del museo"
        },
      ],
    },
  ],

  /* 🔴 CR-81: la nota de procedencia CAMBIA. La versión anterior decía que
     todas las imágenes eran de Wikimedia Commons y de otras colecciones;
     eso ya es FALSO: las 38 son material del museo. Dejar la nota vieja
     habría sido atribuir al museo lo ajeno y desmentir lo propio. */
  notaImagenes:
    "Las imágenes de esta página son material del Museo Paleontológico de Chile " +
    "y se publican con su autorización.",

  /* CR-81: la sección de créditos de Commons SE RETIRA (queda vacía a propósito).
     `js/trilobites.js` no pinta nada si está vacía. Si vuelve a haber imágenes
     de terceros, se repone acá y se rehace creditos.json. */
  atribucion: null,

  /* ⚠️ CR-82 (2026-10-19): SIN NÚMERO. El dueño corrigió: «debería decir una de
     las piezas del museo, ya que a veces son más piezas o menos». La cantidad
     de piezas CAMBIA, así que escribir «las siete» en el copy queda viejo solo.
     ⇒ No volver a poner un número en este texto. Si se necesita la cifra, se
     deriva de `MUSEO.piezas.length`, nunca se escribe a mano. */
  cierre: {
    texto: "Los trilobites son una de las piezas de la muestra del museo.",
    boton: "Ver la colección completa",
    enlace: "index.html#colecciones"
  }
};

/* --- PROYECTO C.E.C (subpágina propia) ---
   CR-61 (2026-10-15): el dueño entregó el material de C.E.C (16 años de actividad,
   ~40 bloques) y pidió una SUBPÁGINA propia agrupada por EJES.

   ⚠️ TEXTO: es del material que entregó el dueño, TRANSCRITO Y ORGANIZADO por ejes.
   El agente no redacta prosa (regla DEC-034). Lo único escrito por el agente son
   los títulos de los ejes y las bajadas de una línea, que son rótulos, no contenido.

   ✅ RELACIÓN CON EL MUSEO, aclarada por el dueño el 2026-10-15, textual:
      «nooo, el museo es independiente de la municipalidad, el museo convive con
       varias empresas»
   ⇒ NO hay contradicción con DEC-034 («se volvió independiente»): son DOS EJES
     DISTINTOS. Independiente = independiente DE LA MUNICIPALIDAD; no significa
     «solo». El museo trabaja con varias organizaciones y C.E.C es una de ellas.
   🔴 Si una sesión futura lee «organización privada» y cree que contradice DEC-034:
      no contradice. C.E.C se presenta como entidad COLABORADORA, nunca como dueña
      del museo. El museo conserva su declaración de independencia tal cual.

   🔴 LO QUE NO ENTRA, y por qué:
     1. Ilustraciones de Jorge Aragón Palacios. El material las marca «copyrights»
        y el dueño confirmó el 2026-10-15: «por ahora no hay autorización». Es el
        mismo caso del ÁMBAR (DEC-027), que estaba medido e integrado y se quedó sin
        publicar. Su NOMBRE puede mencionarse como colaborador en el texto; sus
        OBRAS no se publican sin permiso.
     2. `cepchile@gmail.com`. El sitio lo declaró OBSOLETO (CR-04: el museo lo dio de
        baja). El material lo trae como contacto principal, pero publicarlo
        contradiría al sitio. El contacto va por el del museo.
     3. Nombres de personas de terceros: alumnos certificados, profesionales de la
        salud, colaboradores externos. DEC-041: datos personales sin autorización.
        Se conservan instituciones y los autores de los artículos científicos, que
        son públicos con su publicación.
     4. Alianzas comerciales y pertenencia institucional (DEC-041).
*/
const CEC = {
  /* ==================================================================
     PROYECTO C.E.C — CONTENIDO REESCRITO DESDE EL WORD DEL DUEÑO
     (CR-72, 2026-10-17)

     🔴 ESTE BLOQUE REEMPLAZA TODO LO ANTERIOR. El dueño entregó
     `Proyecto CEC.docx` (Descargas, 2026-10-17 22:54) y eligió: «si,
     reemplaza todo». O sea: lo que sigue son SUS palabras, y lo que había
     antes en esta constante se retira.

     ⚠️ LO QUE SE FUE CON EL REEMPLAZO (no se borró por descuido, lo pidió él):
        · `cifras` (16 años, 7 publicaciones, 4 ediciones en Isurus)
        · `titulo` «Centro de Estudios Paleontológicos de Chile» como titular
        · `intro` (2 párrafos del Centro)
        · `publicaciones` (las 7 fichas bibliográficas)
        · `difusion` (DIALNET, La Referencia, STUDOCU, Universidad de Alicante)
        · `avesDelTerror` (4 párrafos de divulgación)
        · `actividades` (las 10 fichas)
     ⚠️ EL ARCHIVO NO SE PIERDE: todo eso sigue en el historial de git. Para
        recuperar cualquier bloque: `git show daf09df:data/museo.js`. Está
        anotado acá para que una sesión futura no crea que se perdió.
     ⚠️ Tampoco se borró el WORD original: vive en Descargas del dueño.

     🔴 CINCO DATOS DEL WORD QUE CONTRADICEN LO PUBLICADO (manda el Word):
        1. VITRINAS: 20, no 25. El 25 venía de una confirmación previa del
           dueño (CR-41) y quedó SUPERADA por su propio documento nuevo.
        2. FÓSILES: «fósiles reales y réplicas» (el sitio decía «fósiles y
           calcos de vertebrados»).
        3. METEORITOS: aparecen en el Word y no estaban en el listado.
        4. GeoPaleo Ltda. pasa a ser CO-DESARROLLADOR del proyecto («El Museo
           Paleontológico de Chile junto con GeoPaleo Ltda., han desarrollado
           un proyecto denominado Proyecto C.E.C.»), no sólo patrocinador.
        5. SE RETIRA EL PRECIO: el Word no menciona el $1.000 por alumno. El
           dueño eligió explícitamente quitarlo («si no está en el Word, no
           va»). ⚠️ Por eso NO hay campo de precio en esta constante, y la
           píldora de precio de la portada también se quita (ver
           MUSEO_ITINERANTE.datos).

     ⚠️ NADA DE ESTO ES REDACCIÓN DEL AGENTE: los textos son los del Word.
        Sólo se separaron en los campos que la página ya sabía pintar
        (DEC-034: el agente no escribe copy institucional).
     ================================================================== */

  /* 🔴 TÍTULO (CR-72b, 2026-10-17). El <h1> es el NOMBRE PROPIO: «Proyecto
     C.E.C», tal como lo dictó el dueño y como se llama en toda la portada.
     ⚠️ ACÁ HABÍA UN ERROR MÍO: puse de título «Proyecto de Cultura, Educación y
       Capacitación», que el Word NO dice así — el Word escribe «Proyecto C.E.C.
       (Proyecto de Cultura, Educación y Capacitación)», o sea el nombre propio
       MÁS su expansión entre paréntesis. Convertir la expansión en titular y
       cambiarle el sustantivo es reescribir material del dueño (DEC-034).
     ⇒ El titular es el nombre; la expansión va en la bajada, que es donde se
       lee. Además el título largo se partía en 3 líneas y desalineaba la
       cabecera (medido: arrancaba en x=69 frente a x=241 del resto). */
  etiqueta: "Cultura, Educación y Capacitación",
  titulo: "Proyecto C.E.C",
  /* La bajada responde las dos preguntas de entrada del colegio: QUÉ es (la
     expansión del nombre, textual del Word, con su paréntesis) y QUIÉN lo hace.
     El Word dice «Proyecto de Cultura, Educación y Capacitación»: se copia tal
     cual, sin cambiarle palabras. */
  bajada: "Proyecto de Cultura, Educación y Capacitación, desarrollado por el Museo Paleontológico de Chile junto con GeoPaleo Ltda.",
  volver: { texto: "Volver al inicio", enlace: "index.html#cec" },

  /* INTRO: el párrafo de apertura del Word, textual, incluido su objetivo.
     ⚠️ El Word dice «proyecto denominado Proyecto C.E.C.» (redundante, pero es
     su redacción): NO se corrige. */
  intro: [
    "El Museo Paleontológico de Chile junto con GeoPaleo Ltda., han desarrollado un proyecto denominado Proyecto C.E.C. (Proyecto de Cultura, Educación y Capacitación), cuyo objetivo es desarrollar programas, educativos como:"
  ],

  /* El Word presenta 5 LÍNEAS DE TRABAJO. Se pintan como el bloque `actividades`,
     con el mismo componente que ya existía (lista escaneable, no tarjetas: ver
     CR-64 sobre el efecto «se ve de celular»).
     ⚠️ LOS TEXTOS SON LOS DEL WORD, en su orden. La única intervención es
     cortar el título de cada línea (lo que va antes de los dos puntos) para que
     la lista se pueda barrer de un vistazo, y dejar el detalle en `texto`.
     Los títulos son palabras del propio Word, no rótulos inventados. */
  actividades: {
    icono: "colegio",
    titulo: "Programas educativos",
    intro: null,
    items: [
      {
        titulo: "Capacitación especializada a personal de empresas",
        texto: "Capacitación especializada a personal de empresas relacionado con el componente paleontológico mediante cursos de capacitación con código SENCE según Norma Chilena 2728 dando posibilidad a las empresas de primera categoría de capacitar a sus empleados y a la vez acceder a franquicias tributarias de capacitación, esto es empresas comerciales, industriales, mineras y otras.",
        /* CR-73: foto que el dueño entregó EN ESTE MISMO LUGAR del Word (va
           justo después de este párrafo), así que respeta su orden. */
        foto: "assets/img/cec/capacitacion-empresas.jpg",
        fotoAlt: "Personal de una empresa en una reunión de capacitación sobre el componente paleontológico"
      },
      {
        titulo: "Cursos básicos y avanzados de Paleontología",
        texto: "Capacitación a través de cursos básicos y avanzados de Paleontología a público general."
      },
      {
        titulo: "Charlas de inducción y divulgación",
        texto: "Charlas de inducción, actividades de divulgación sobre temáticas geológicas y/o paleontológicas."
      },
      {
        titulo: "Propuestas museográficas y exposiciones temáticas",
        texto: "Propuestas museográficas y exposiciones temáticas de geología y/o paleontología a empresas, municipalidades, establecimientos educacionales, sociedades científicas y centros culturales."
      },
      {
        titulo: "Muestra Museológica Itinerante",
        texto: "Muestra Museológica Itinerante la que es llevada a los establecimientos educacionales de Santiago y que bajo ciertas circunstancias de financiamiento también puede ser llevada a las distintas regiones de Chile."
      }
    ]
  },

  /* LA MUESTRA: el bloque que en el Word sigue a la itinerante. Va en su propia
     sección porque es lo que el colegio necesita saber para decidir.
     ⚠️ 20 VITRINAS es el dato del Word y manda sobre el 25 anterior. */
  museoItinerante: {
    icono: "museo",
    /* ⚠️ CR-72: el título NO es "La muestra" (a secas). Ese nombre ya existe en
       la portada como tituloSec de la sección #cec, y repetirlo acá haría que
       dos páginas del mismo sitio titulen distinto la misma cosa. Se usa el
       nombre del Word: «Muestra Museológica Itinerante». */
    titulo: "Muestra Museológica Itinerante",
    subtitulo: "Lo que lleva la exposición",
    parrafos: [
      "La muestra, consiste en la puesta en valor de 20 vitrinas conteniendo una interesante y hermosa colección de fósiles reales y réplicas, corales, minerales, meteoritos, insectos, moluscos y además de una colección de reconstrucciones paleobiológicas de dinosaurios, que hace de esta muestra un material educativo, pedagógico y didáctico de gran interés especialmente para los alumnos de enseñanza básica y media del sistema educacional chileno."
    ]
  },

  /* DÓNDE YA SE HIZO: el último párrafo del Word.
     ⚠️ El Word cierra la lista con «etc.» — se conserva tal cual: él no quiso
     cerrar la enumeración, y completarla sería inventar establecimientos.
     ⚠️ Los nombres van EXACTOS como el Word: «Liceo Tajamar», «Campus College»,
     «Liceo Juan Pablo Duarte», «Complejo Educacional Nido de Águilas»,
     «Liceo María Carvajal». */
  establecimientos: {
    icono: "check",
    titulo: "Dónde se ha realizado",
    intro: "El proyecto ha sido realizado con éxito en diferentes establecimientos educacionales como:",
    items: [
      "Liceo Tajamar",
      "Campus College",
      "Liceo Juan Pablo Duarte",
      "Complejo Educacional Nido de Águilas",
      "Liceo María Carvajal"
    ],
    nota: "Entre otros establecimientos.",
    /* --- FOTOS DE LA MUESTRA EN COLEGIOS (CR-73, 2026-10-17) ---
       Las 5 fotos que cierran el Word del dueño. Él confirmó que tiene
       AUTORIZACIÓN para publicar las caras (DEC-76), incluidas las de menores:
       son la evidencia visual de lo que este bloque afirma («el proyecto se ha
       realizado en establecimientos»), así que van acá y no en la galería
       general del museo.
       ⚠️ Los `alt` los dictó el dueño con el NOMBRE DE CADA ARCHIVO; acá se
         expanden a una frase descriptiva sin inventar contenido: describen lo
         que el propio nombre afirma.
       ⚠️ La 7ª imagen del Word (la portada 400x198) NO se publica: el dueño
         escribió en su nombre «NO ES NECESARIA». */
    fotos: [
      { src: "assets/img/cec/estudiantes-senior-explicando.jpg",
        alt: "Estudiantes escuchando la explicación del especialista frente a la muestra" },
      { src: "assets/img/cec/ninos-visitando-exposicion.jpg",
        alt: "Niños junto al especialista observando las vitrinas de la exposición" },
      { src: "assets/img/cec/exposicion-vitrina-1.jpg",
        alt: "Vitrina de la muestra paleontológica en un establecimiento educacional" },
      { src: "assets/img/cec/exposicion-vitrina-2.jpg",
        alt: "Vitrina con fósiles y réplicas de la exposición itinerante" },
      { src: "assets/img/cec/exposicion-vitrina-3.jpg",
        alt: "Detalle de una vitrina de la muestra en el establecimiento" }
    ]
  },

  /* ⚠️ `relacion` estaba y se retira: el Word ya dice en su PRIMERA frase quién
     desarrolla el proyecto (Museo + GeoPaleo). Repetirlo aparte era decir dos
     veces lo mismo, que es exactamente lo que el dueño marcó en CR-63b. */
  relacion: null,

  /* Sin las secciones que no están en el Word (publicaciones, difusión, aves
     del terror). El render las salta si faltan — ver js/cec.js. */
  publicaciones: null,
  difusion: null,
  avesDelTerror: null,
  alianzas: null,

  cierre: {
    texto: "El Proyecto C.E.C reúne las actividades de educación, divulgación y capacitación que el Museo Paleontológico de Chile y GeoPaleo Ltda. desarrollan en conjunto.",
    boton: "Ver la muestra del museo",
    enlace: "index.html#colecciones"
  }
};

/* --- AMMONITES (subpágina propia) ---
   CR-83 (2026-10-20): el dueño entregó el documento «AMMONITES.docx»
   (4,6 MB, 30 imágenes) y pidió agregarlo como la página que se abre
   apretando la card de Ammonites en Colecciones (mismo mecanismo que
   trilobites.html, CR-60).

   ⚠️ TEXTO: ÍNTEGRO del Word, sin una palabra redactada (DEC-034).
   Solo se separó en secciones y se capitalizaron los títulos que el Word
   trae en minúsculas. NO reescribir: si hay que cambiarlo, lo dicta el dueño.

   🔴 ORDEN DE IMÁGENES: es el del Word, LITERAL. Los archivos se numeran
   01..30 por su POSICIÓN en el documento, no por nombre ni por tamaño.
   Un `07.jpg` significa «séptima imagen del Word». NO reordenar.

   ✅ PROCEDENCIA: material del museo, autorizado por el dueño en bloque
   («son autorizadas, todas», 2026-10-19). La ilustración de la imagen 3
   es de José Lemos Caro y se publica con su crédito pegado a la figura,
   tal como el dueño lo autorizó en esta sesión.

   ⚠️ PNG con alfa se conservan en PNG (pasarlas a JPEG rellena de NEGRO
   lo transparente). Medido: solo 02.png tiene alfa real (1,2 % de
   píxeles transparentes, luminancia media 129 = clara), así que se ve
   sobre el fondo oscuro sin necesidad de fondo blanco.
   ============================================================ */

const AMMONITES = {
  subpagina: "amonites.html",
  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },
  etiqueta: "Colecciones · Mesozoico",
  titulo: "Ammonites",
  bajada:
    "Moluscos cefalópodos con concha en espiral, guías de la era Mesozoica.",
  /* 🔴 CR-84 (2026-10-20): `intro: null` a propósito. El párrafo del Word se
     publicaba DOS veces: acá en la cabecera y otra vez en la sección
     «Subclase Ammonoidea». El Word lo trae UNA sola vez, y su lugar es la
     sección, bajo su título. El dueño lo reportó: «¿por qué está duplicado
     el primer texto?». El render tolera null (`if (intro && A.intro)`). */
  intro: null,

  secciones: [
    {
      id: "subclase",
      titulo: "Subclase Ammonoidea",
      nivel: 2,
      parrafos: [
        "Subclase Ammonoidea con ejemplares que habitaron todos los mares  desde el periodo Devónico al Cretácico, son los que revisten mayor importancia para los paleontólogos, por ser fósiles que nos permiten fechar los estratos (fósiles guías) Una Subclase de moluscos cefalópodos que se extinguieron a finales del Cretácico hace 65 millones de años. Aparecieron en el Devónico medio hace unos 400 Ma. y fueron muy abundantes, siendo una parte importante en las cadenas tróficas de los mares de la Tierra durante mucho tiempo.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/01.jpg",
          ancho: 489, alto: 475,
          alt: "Ammonites — imagen 1 del documento del museo",
          pie: "Ammonite Dactilioceras comune, y Ammonite con corte sagital que muestra las cámaras internas.",
        },
        {
          src: "assets/img/amonites/word/02.png",
          ancho: 164, alto: 171,
          alt: "Ammonites — imagen 2 del documento del museo",
        },
      ],
    },
    {
      id: "reconstruccion",
      titulo: "Reconstrucción paleobiológica",
      nivel: 3,
      parrafos: [],
      imagenes: [
        {
          src: "assets/img/amonites/word/03.jpg",
          ancho: 1148, alto: 787,
          alt: "Ammonites — imagen 3 del documento del museo",
          pie: "Reconstrucción paleobiológica de un Ammonite. Ilustración José Lemos Caro.",
        },
      ],
    },
    {
      id: "fosilizacion",
      titulo: "Proceso de fosilización",
      nivel: 2,
      parrafos: [
        "El proceso de fosilización es el que permite contar con buenos o malos especímenes para un posterior estudio de una forma de vida del pasado. Esto depende de varios factores, como la rapidez de sepultación, lo fino o grueso de los sedimentos, la alteración del terreno por los movimientos tectónicos, etc. Un excelente ejemplo para mostrar el proceso de fosilización es el de los ammonites, pues son un grupo abundante de invertebrados marinos en el pasado de Chile:",
      ],
    },
    {
      id: "fosilizacion-1",
      titulo: "1. El animal muere",
      nivel: 3,
      parrafos: [
        "1.- El Ammonite vive en su ambiente, muere por alguna causa –como el ataque de algún depredador, como un reptil marino, o por causas naturales. Sus partes blandas son consumidas por carroñeros y las bacterias degradan el cuerpo.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/04.jpg",
          ancho: 631, alto: 429,
          alt: "Ammonites — imagen 4 del documento del museo",
        },
      ],
    },
    {
      id: "fosilizacion-2",
      titulo: "2. La concha se rellena",
      nivel: 3,
      parrafos: [
        "2.- Su concha vacía queda en el fondo o a la orilla del mar, donde es rellenada por barro o sedimentos y recubiertas por el mismo.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/05.jpg",
          ancho: 721, alto: 538,
          alt: "Ammonites — imagen 5 del documento del museo",
        },
      ],
    },
    {
      id: "fosilizacion-3",
      titulo: "3. El molde queda protegido",
      nivel: 3,
      parrafos: [
        "3.- Este molde queda protegido por capas de sedimento, que posteriormente los paleontólogos excavan, para extraer estas valiosas piezas paleontológicas.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/06.jpg",
          ancho: 728, alto: 448,
          alt: "Ammonites — imagen 6 del documento del museo",
        },
      ],
    },
    {
      id: "fosilizacion-4",
      titulo: "4. Molde interno",
      nivel: 3,
      parrafos: [
        "4.- Posteriormente queda un molde interno de la concha, mostrando su estructura.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/07.jpg",
          ancho: 731, alto: 488,
          alt: "Ammonites — imagen 7 del documento del museo",
        },
      ],
    },
    {
      id: "deposicion-fondo",
      titulo: "Deposición de fondo",
      nivel: 3,
      parrafos: [
        "Al morir los Ammonites puede ocurrir que la concha quede con mucho líquido en sus cámaras, provocando que las conchas terminen depositándose en el fondo marino.",
        "Esto se refleja en que quedan depositadas de tal modo que se van agrupando o amontonando unas encima de otras, siendo posible encontrar capas de sedimento con ammonites de diferentes especies.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/08.jpg",
          ancho: 538, alto: 642,
          alt: "Ammonites — imagen 8 del documento del museo",
        },
      ],
    },
    {
      id: "deposicion-playa",
      titulo: "Deposición de playa",
      nivel: 3,
      parrafos: [
        "Al contrario de la deposición de fondo, en la deposición de playa las conchas pueden quedar con gas o aire en su interior haciendo que las conchas floten, y de este modo las corrientes marinas transporten las conchas hasta las playas. En este tipo de fosilización las conchas están aisladas y no se encuentran amontonadas.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/09.jpg",
          ancho: 504, alto: 777,
          alt: "Ammonites — imagen 9 del documento del museo",
        },
      ],
    },
    {
      id: "belleza",
      titulo: "Un grupo atractivo y bello",
      nivel: 2,
      parrafos: [
        "Los ammonites, además de constituir un grupo fósil muy atractivo desde el punto de vista sistemático (se conocen miles de especies) y estratigráfico (son buenos indicadores del tiempo geológico), evidencian además una gran belleza estructural (distribución y forma de la concha), lo cual hace que sean muy apreciados por todos cuantos manifiestan interés por los fósiles.",
      ],
    },
    {
      id: "concha",
      titulo: "La concha",
      nivel: 2,
      parrafos: [
        "La concha es de forma espiral, abierta o cerrada. Está dividida en una serie de cámaras que contienen un líquido llamado “líquido cameral “, que genera gas Nitrógeno. Estas cámaras están separadas por una pared o tabique llamado septo, que se encuentra presente en toda la parte interior de la concha. Estos tabiques son atravesados por un conducto carnoso llamado sifón, al igual que en los nautilos, con la diferencia que en los Ammonites éste pasa por la periferia de la concha.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/10.jpg",
          ancho: 571, alto: 461,
          alt: "Ammonites — imagen 10 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/11.jpg",
          ancho: 440, alto: 416,
          alt: "Ammonites — imagen 11 del documento del museo",
        },
      ],
    },
    {
      id: "concha-camaras",
      titulo: "Cámaras y crecimiento",
      nivel: 3,
      parrafos: [
        "La concha posee varias cámaras internas pequeñas y una grande donde se aloja el animal llamada cámara habitación, a medida que el animal crece se van creando nuevas cámaras, por lo cual cada cámara representa un estado de crecimiento del animal. Estas conchas pueden tener diversos tamaños. Se conocen Ammonites muy pequeños de solo algunos milímetros hasta especies gigantescas que alcanzaron más de tres metros en la especie Pachidiscus y Parapuzosia seppenradensis.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/12.jpg",
          ancho: 486, alto: 552,
          alt: "Ammonites — imagen 12 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/13.jpg",
          ancho: 547, alto: 552,
          alt: "Ammonites — imagen 13 del documento del museo",
        },
      ],
    },
    {
      id: "protoconcha",
      titulo: "Protocono o protoconcha: la ammonitella",
      nivel: 3,
      parrafos: [
        "La parte inicial de la concha de los ammonites es muy pequeña, del orden de 0.5 a 0.8 mm. Se denomina protoconcha y tiene un aspecto globoso. A partir de ella, comienza a desarrollarse la primera vuelta que ya está tabicada. Hacia el final de la primera vuelta todas las especies de ammonite poseen un estrangulamiento debido a que, en este punto, la concha alcanza un mayor grosor. Este estrangulamiento se denomina constricción Nepiónica y ha sido motivo de múltiples estudios e interpretaciones.",
        "La concha también estaba ornamentada con una serie de costillas transversales que podían ser finas o gruesas o una mezcla de las dos. Muchas de estas conchas tenían espinas y tubérculos que la adornaban, sirviéndoles también para defenderse.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/14.jpg",
          ancho: 886, alto: 733,
          alt: "Ammonites — imagen 14 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/15.jpg",
          ancho: 426, alto: 677,
          alt: "Ammonites — imagen 15 del documento del museo",
        },
      ],
    },
    {
      id: "depredacion",
      titulo: "Depredación en ammonites",
      nivel: 2,
      parrafos: [
        "Los primeros ammonites fueron simples, con líneas de sutura poco complicadas, con costillas finas y sin tubérculos, no obstante, con el paso del tiempo surgieron una gran cantidad de depredadores marinos que se alimentaban de ellos, triturando las conchas con sus mandíbulas. Este momento del tiempo Mesozoico, ha sido denominado como la “Revolución marina del Mesozoico”, ya que surgieron los Pliosaurus, Plesiosaurus, Mosasaurus, Ictiosaurus, Cocodrilos marinos y otros, los que convivían a su vez con una gran cantidad de peces trituradores de conchas, como los encontrados en la formación Lo Valdés, del género Lepidotus.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/16.jpg",
          ancho: 582, alto: 702,
          alt: "Ammonites — imagen 16 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/17.jpg",
          ancho: 430, alto: 607,
          alt: "Ammonites — imagen 17 del documento del museo",
        },
      ],
    },
    {
      id: "marcas-maxilar",
      titulo: "Una concha mordida",
      nivel: 3,
      parrafos: [],
      imagenes: [
        {
          src: "assets/img/amonites/word/18.jpg",
          ancho: 967, alto: 386,
          alt: "Ammonites — imagen 18 del documento del museo",
          pie: "Marcas del maxilar de Mosasaurus orridus en una concha de Ammonite del genero Placentíceras.",
        },
      ],
    },
    {
      id: "tuberculos",
      titulo: "Tubérculos y espinas",
      nivel: 3,
      parrafos: [
        "Los Ammonites, desarrollaron una serie de tubérculos y espinas en toda la espiral, lo que impedía que fueran mordidas con facilidad; los tabiques o paredes internas se juntaron más y su forma se complicó ya que sus líneas de suturas presentaban rugosidades o arborización, con la finalidad de aumentar la resistencia de la presión marina, lo que le permitiría bajar a grandes profundidades para arrancar de sus atacantes. Por último, las costillas, que son ornamentos de disposición transversal en las espirales, se hicieron más gruesas y fuertes, lo que aumentaba la resistencia de la concha a las mordeduras de los depredadores.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/19.jpg",
          ancho: 737, alto: 381,
          alt: "Ammonites — imagen 19 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/20.jpg",
          ancho: 361, alto: 416,
          alt: "Ammonites — imagen 20 del documento del museo",
        },
      ],
    },
    {
      id: "hidrodinamica",
      titulo: "Hidrodinámica de las conchas",
      nivel: 2,
      parrafos: [
        "Las conchas de los Ammonites, se comprimieron haciéndose más veloces e hidrodinámicas. Algunos estudios han demostrado que la forma discoidal comprimida de la concha en algunos, se adapta mejor a la natación rápida, todo lo cual concuerda con sus costumbres nectónicas, tales animales debieron ser excelentes nadadores, no así otros como los Ammonites heteromorfos o aquellos que, teniendo concha discoidal, la misma no era comprimida si no globosa y a veces muy ornamentada, lo que indudablemente sería un impedimento para nadar con soltura. Este tipo de animales habrían tenido con seguridad un modo de vida distinta a los nadadores, arrastrándose en el fondo marino o aun viviendo de modo sedentario.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/21.jpg",
          ancho: 206, alto: 528,
          alt: "Ammonites — imagen 21 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/22.jpg",
          ancho: 373, alto: 519,
          alt: "Ammonites — imagen 22 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/23.jpg",
          ancho: 370, alto: 521,
          alt: "Ammonites — imagen 23 del documento del museo",
        },
      ],
    },
    {
      id: "ornamentos",
      titulo: "Ornamentación de la concha",
      nivel: 3,
      parrafos: [],
      imagenes: [
        {
          src: "assets/img/amonites/word/24.jpg",
          ancho: 1353, alto: 351,
          alt: "Ammonites — imagen 24 del documento del museo",
        },
      ],
    },
    {
      id: "sistema-natatorio",
      titulo: "Sistema natatorio",
      nivel: 2,
      parrafos: [
        "Para el desplazamiento vertical, el Ammonites poseía dentro de su concha un apéndice carnoso nacido de su masa visceral, que recorría todas las cámaras llamado sifón, cuya función consistía en ingresar a las cámaras gas nitrógeno lo que  permitía  ascender desde  el fondo  marino; o ingresar  líquido (liquido cameral), a las cámaras para hacerlo descender, sistema que funcionaba por osmosis y que era un efectivo sistema para cambios de nivel en el agua tal como lo hacen los submarinos.",
        "Para el desplazamiento horizontal, el ammonites poseía una estructura muscular al interior del cuerpo junto a todas las partes blandas que recibe el nombre de manto, este se encontraba plegado al interior de la llamada cavidad paleal. El manto era una estructura elástica y flexible que contaba con una serie de músculos tanto radiales como longitudinales, era como una bolsa cuya función era llenarse de líquido, para lo cual dilataba su sistema muscular, una ves llena comprimía los músculos expulsando fuertemente el mismo por un conducto o embudo llamado hiponomio Por el principio de acción y reacción el animal se movía en sentido contrario a la salida del chorro de agua.",
      ],
    },
    {
      id: "anatomia",
      titulo: "Anatomía interna del Ammonite",
      nivel: 2,
      parrafos: [
        "Podemos decir que los ammonites poseían un sistema nervioso muy desarrollado, más que en los otros moluscos y una vista privilegiada con grandes ojos que tal ves le permitía ver en colores.",
        "Cuenta con un pequeño estómago y un ventrículo digestivo que le permitía digerir su alimento y eliminarlo sin problemas dentro de la cavidad del manto donde estaba ubicado el ano, por donde eran expulsados los residuos.",
        "Para alimentarse poseía una boca coronada por un pico corneo de quitina, que le permitía al animal triturar su alimento, estaba formada por dos placas puntiagudas situadas una en la parte superior y la otra en la inferior que encajaban al igual que el pico de los loros.",
        "Para que el alimento llegara a la boca el animal atrapaba su alimento con los tentáculos y los llevaba hasta su orificio bucal. Poseía una rádula para moler su alimento constituida por Peces, Crustáceos, Moluscos etc. El Ammonite poseía para su respiración un sistema branquial eficaz.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/25.jpg",
          ancho: 1355, alto: 723,
          alt: "Ammonites — imagen 25 del documento del museo",
        },
      ],
    },
    {
      id: "linea-sutura",
      titulo: "Línea de sutura",
      nivel: 2,
      parrafos: [
        "Los Ammonites dentro del mismo plan estructural de los Nautilus, se caracterizan por tener tabiques internos los cuales al llegar a la concha externa para formar lo que se denomina Línea de sutura. En algunos Ammonites esta línea de sutura no presenta una mayor complejidad (menos evolucionados), pero en otros existe una sutura muy compleja (más evolucionados), la cual le sirve para darle una mayor resistencia a la concha.  Además, la línea de sutura es un elemento que nos permite identificar a los Ammonites.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/26.jpg",
          ancho: 758, alto: 714,
          alt: "Ammonites — imagen 26 del documento del museo",
        },
      ],
    },
    {
      id: "reproduccion",
      titulo: "Reproducción de los Ammonites",
      nivel: 2,
      parrafos: [
        "Todos los Ammonites son unisexuales, y suelen presentar caracteres sexuales secundarios que afectan la estructura y forma de la concha, la fecundación es interna; en el macho existe entre sus tentáculos, uno que es especial por estar involucrado directamente en la reproducción, llamado hectocótilo, portador de los espermios llamados espermatóforos, en tanto las hembras poseen glándulas nidamentarias, cuyas secreciones es utilizada para aglutinar los huevos. Su apareamiento se producía frontalmente entrelazando sus tentáculos. El hectocótilo se introduce en la cavidad del manto de la hembra y deposita los espermatóforos en la pared de dicha cavidad, en donde tiene lugar la fecundación.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/27.jpg",
          ancho: 777, alto: 543,
          alt: "Ammonites — imagen 27 del documento del museo",
        },
      ],
    },
    {
      id: "extincion",
      titulo: "Extinción de los ammonites",
      nivel: 2,
      parrafos: [
        "Una de las características más notables de los ammonites es su rápida evolución, en otras palabras, su desarrollo filogenético alcanza un rango de entre un millón y dos millones de años, por tanto, muchos ammonites nacían y morían como especie; sin embargo, estos desaparecieron rápidamente producto de la gran catástrofe originada por la caída de un meteorito hace 65 millones de años. La presencia de porciones de Estroncio encontrados en algunas conchas de Ammonites supone una lluvia ácida como consecuencia del roce de este bólido con la atmósfera terrestre.",
      ],
    },
    {
      id: "fosiles-guias",
      titulo: "Ammonites como fósiles guías",
      nivel: 2,
      parrafos: [
        "Desde el punto de vista estratigráfico los ammonites constituyen excelentes fósiles guía que han permitido dividir el Paleozoico a partir del Devónico, y todo el Mesozoico. Se han descrito muchas familias y géneros que se distribuyen de forma variable en unas 7.500 especies y convivieron con los reptiles marinos, peces y otra serie de invertebrados marinos.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/28.jpg",
          ancho: 512, alto: 733,
          alt: "Ammonites — imagen 28 del documento del museo",
        },
      ],
    },
    {
      id: "yacimientos",
      titulo: "Yacimientos",
      nivel: 2,
      parrafos: [],
    },
    {
      id: "lo-valdes",
      titulo: "Formación Lo Valdés",
      nivel: 3,
      parrafos: [
        "La Formación Lo Valdés está constituida por una serie de estratos casi verticales que afloran en la cordillera, y están interrumpidas por una corriente fluvial provocada por el río El Volcán, que los cruza. La edad de la formación ha sido situada en el Jurásico Superior al Cretácico temprano (120 a 140 millones de años, del Titoniano al Hauteriviano), constituida por calizas, lavas submarinas, areniscas y lutitas grises.",
        "Encontramos evidencias de gran actividad volcánica y glacial en el sector. Además, existen varios géneros que representan las formas de vida de Lo Valdés como Trigonias, Euriphylas, Pholadomyas; y ammonites como los géneros Spiticeras, Paracrioceras, Aulacosphinctes, entre muchos otros. Existe también una especie de tamaño grande del género Titanites y vida vertebrada representada por peces del género Lepidotus, y reptiles marinos.",
        "En el sector también encontramos evidencia costera continental como la presencia de rizaduras de arena o ripple marks, que son ondulaciones de la arena producidas por el agua en movimiento en la orilla del mar, ríos o lagos. Otro elemento característico es la presencia de cuarteamientos poligonales que se producen en sectores de sequedad del terreno como producto de una sequía.",
      ],
      imagenes: [
        {
          src: "assets/img/amonites/word/29.jpg",
          ancho: 800, alto: 535,
          alt: "Ammonites — imagen 29 del documento del museo",
        },
        {
          src: "assets/img/amonites/word/30.jpg",
          ancho: 800, alto: 534,
          alt: "Ammonites — imagen 30 del documento del museo",
        },
      ],
    },
  ],

  notaImagenes:
    "Las imágenes de esta página son material del Museo Paleontológico de Chile y se publican con su autorización. La reconstrucción paleobiológica de un ammonite es una ilustración de José Lemos Caro.",
  /* Sin sección de atributos: las imágenes son del museo, no de Commons.
     El render hace `if (!T.atribucion) return;` y no la pinta. */
  atribucion: null,
  cierre: {
    texto: "Los ammonites son una de las piezas de la muestra del museo.",
    boton: "Ver la colección completa",
    enlace: "index.html#colecciones"
  }
};

/* --- SUBPÁGINA ÁMBAR (ambar.html) ---
   CR-86 (2026-10-24) — SEXTA subpágina del sitio, después de curriculum.html
   (CR-55), trilobites.html (CR-60), proyecto-cec.html (CR-61), amonites.html
   (CR-83) y tiburones.html (CR-85).

   FUENTE: «ÁMBAR.docx» (527 KB, 11 imágenes), el Word que el dueño guardó y
   entregó el 2026-10-24. Copiado al repo como `fuentes/ambar-material-del-dueno.docx`
   (MD5 1e034511070805d51d197f18720c6455) porque el original estaba sólo en la
   caché de Office (INetCache\Content.MSO\6E20554C.docx), que Windows borra sola.

   ⚠️ TEXTO: ÍNTEGRO del documento del museo, sin una palabra redactada por el
   agente (regla DEC-034). El Word NO trae jerarquía de títulos: es un solo bloque
   corrido de 9 párrafos. Las secciones de abajo son divisiones por TEMA del propio
   texto, y sus títulos son RÓTULOS, no contenido redactado. Los párrafos van
   literales.

   🔴 ERRATAS DEL ORIGINAL — se corrigen SOLO los artefactos de copiado desde PDF,
   nunca palabras del museo. Medido en este Word:
     1. «partículas de polvo ο pequeños» — la «ο» es la letra GRIEGA ómicron
        (U+03BF), no una «o» latina. Se publica «o».
     2. Un párrafo con un solo carácter `‘` (comilla suelta, resto de un copiado).
        NO se publica: no es contenido.
     3. «defen s a contra los hongos» — espacio espurio dentro de la palabra. Se
        publica «defensa».
     4. «lefttop» — basura de posición de un maquetado copiado. NO se publica.
     5. «región.Al promocionar» — falta el espacio tras el punto. Se publica
        «región. Al promocionar».
   ⚠️ Estas cinco son la MISMA clase de excepción justificada que CR-85b (la
   «deb» de tiburones): son defectos del ORIGINAL, no palabras del museo.

   ✅ IMÁGENES: las 11 del Word, en el ORDEN LITERAL del documento (DEC-82),
   numeradas 01..11 por posición. El dueño autorizó textual el 2026-10-24:
   «autorizadas todas». Es el mismo mecanismo de DEC-012 exceptuada que en
   CR-75/CR-81 para el material del museo. El Word NO trae ni un pie de foto,
   así que NINGUNA figura lleva `pie`: inventarlo sería atribución falsa.

   ⚠️ DEC-027: esta subpágina es justamente el material que «estaba medido e
   integrado y se quedó sin publicar» (comentario de trilobites). Lo que cambió
   es que ahora hay autorización explícita y consta por escrito.

   ✅ Sin sección de atributos: las imágenes son del museo, no de Commons.
   `AMBAR.atribucion` es null y el render no la pinta.
   ============================================================ */
const AMBAR = {
  subpagina: "ambar.html",
  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },
  etiqueta: "Colecciones · Resina fósil",
  titulo: "Ámbar",
  bajada:
    "Resina vegetal fósil que atrapó, hace millones de años, un mundo entero de seres vivos.",
  /* `intro: null` a propósito, igual que TRILOBITES, AMMONITES y TIBURONES
     (CR-84): el primer párrafo ya se publica en su sección («Qué es el ámbar») y
     repetirlo acá lo mostraba DOS veces. El render tolera null
     (`if (intro && T.intro)`). */
  intro: null,

  secciones: [
    {
      id: "que-es",
      titulo: "Qué es el ámbar",
      nivel: 2,
      parrafos: [
        "El ámbar es una resina vegetal fósil, que se genera por la secreción de ciertos árboles " +
          "como las coníferas, que exudaban ésta como defensa contra los hongos, aves e insectos.",
        "Con el tiempo sufrió un proceso de fosilización formando masas irregulares y extensas " +
          "dentro de los estratos de arenisca y pizarras arcillosas.",
      ],
      imagenes: [
        {
          src: "assets/img/ambar/01.jpg",
          ancho: 824, alto: 617,
          /* Sin `pie`: el Word no le pone pie a esta imagen. */
        },
        {
          src: "assets/img/ambar/02.jpg",
          ancho: 819, alto: 475,
        },
        {
          src: "assets/img/ambar/03.jpg",
          ancho: 436, alto: 773,
        },
      ],
    },
    {
      id: "que-atrapa",
      titulo: "Qué quedó atrapado en la resina",
      nivel: 2,
      parrafos: [
        "En muchas ocasiones la resina al escurrir sobre la corteza de troncos y ramas llegó a " +
          "atrapar burbujas de aire, gotas de agua, partículas de polvo o pequeños seres vivos " +
          "como plantas (orquídeas, hongos, musgos, líquenes, semillas y un sinfín de flores " +
          "diminutas), insectos, gusanos y otro tipo de animales que van desde diminutas hormigas, " +
          "arañas, mosquitos, abejas, termitas, mariposas y libélulas, hasta lagartijas, ranas y " +
          "escorpiones y hasta fragmentos de su ADN.",
      ],
      imagenes: [],
    },
    {
      id: "europa-america",
      titulo: "De dónde viene, en Europa y en América",
      nivel: 2,
      parrafos: [
        "En Europa, el ámbar se forma a partir de la resina del *Pinus succinifera*, en tanto que en " +
          "América proviene de la leguminosa *Hymenaea courbaril* conocida en Chiapas (México) como " +
          "Guapiñol y en Nicaragua y República Dominicana como Algarrobo, perteneciente al período " +
          "geológico terciario.",
      ],
      /* 🔴 DEC-82 — ORDEN LITERAL DEL WORD. En el .docx las figuras van pegadas al
         párrafo que las precede, y la numeración 01..11 se asignó por esa posición
         (no por tamaño ni por criterio visual). Medido con el orden real de
         aparición en word/document.xml:
             rId4  -> 01   (tras el párrafo de la definición)
             rId5  -> 02   (tras el de la fosilización)
             rId6  -> 03   (tras el de lo que la resina atrapa)
             rId7  -> 04   ┐ tras el párrafo de Europa/América
             rId8  -> 05   ┘
             rId9  -> 06   (tras un párrafo que sólo trae una comilla suelta)
             rId10 -> 07   (tras el del valor científico)
             rId11 -> 08   (tras el de la artesanía)
             rId12 -> 09   ┐
             rId13 -> 10   ├ al final, tras el de la Expo Ámbar
             rId14 -> 11   ┘
         ⚠️ El párrafo que precede a `06` es un `‘` suelto, basura de copiado desde
         PDF: NO se publica como contenido (no es una palabra del museo). Su imagen
         sí se publica —el dueño autorizó «autorizadas todas»— y queda aquí, pegada
         a su predecesora inmediata. NO moverla de sección ni reordenar: eso es
         justo lo que DEC-82 prohíbe. */
      imagenes: [
        {
          src: "assets/img/ambar/04.jpg",
          ancho: 807, alto: 490,
        },
        {
          src: "assets/img/ambar/05.jpg",
          ancho: 335, alto: 352,
        },
        {
          src: "assets/img/ambar/06.jpg",
          ancho: 720, alto: 394,
        },
      ],
    },
    {
      id: "valor-cientifico",
      titulo: "Por qué importa para la ciencia",
      nivel: 2,
      parrafos: [
        "Estas inclusiones agregan no sólo belleza a una pieza de ámbar sino una gran cantidad de " +
          "información de suma importancia para científicos, pues de esta manera se tiene " +
          "conocimiento de la vida de hace millones de años, disponiendo, incluso, de especies ya " +
          "desaparecidas.",
      ],
      imagenes: [
        {
          src: "assets/img/ambar/07.jpg",
          ancho: 828, alto: 615,
        },
      ],
    },
    {
      id: "artesania",
      titulo: "Del adorno sencillo a la joyería",
      nivel: 2,
      parrafos: [
        "Anteriormente se hacían objetos muy modestos como pulseritas y collares, pero hoy las " +
          "hechuras incluyen combinaciones con plata y jade, obsidiana, turquesa y ónix, entre " +
          "otros materiales; también, varios artesanos se han especializado en la escultura.",
        "Ahora el cliente puede adquirir pulseras, aretes y collares con acabados muy novedosos; " +
          "pisacorbatas, broches, prendedores, mancuernillas, brazaletes, dijes, pipas y hasta " +
          "portacelulares, entre otros adornos.",
      ],
      imagenes: [
        {
          src: "assets/img/ambar/08.jpg",
          ancho: 586, alto: 1138,
        },
      ],
    },
    {
      id: "expo-ambar",
      titulo: "La Expo Ámbar de Chiapas",
      nivel: 2,
      parrafos: [
        "En la ciudad de San Cristóbal de Las Casas, Chiapas, se realiza anualmente en agosto, la " +
          "Expo Ámbar, la cual representa un espacio ideado para mostrar el talento de los " +
          "artesanos chiapanecos.",
        "Busca desarrollar e integrar a los grupos de artesanos chiapanecos en la extracción, " +
          "producción y comercialización del ámbar, fomentando el crecimiento económico, social y " +
          "cultural de la región. Al promocionar de la mejor manera la cultura chiapaneca, a " +
          "través de la joyería del ámbar de excelente calidad, se logra proyectar a México en " +
          "mercados nacionales e internacionales, con gran éxito.",
      ],
      imagenes: [
        {
          src: "assets/img/ambar/09.jpg",
          ancho: 564, alto: 448,
        },
        {
          src: "assets/img/ambar/10.jpg",
          ancho: 570, alto: 432,
        },
        {
          src: "assets/img/ambar/11.jpg",
          ancho: 369, alto: 336,
        },
      ],
    },
  ],

  notaImagenes:
    "Las imágenes de esta página son material del Museo Paleontológico de Chile y se publican con " +
    "su autorización.",
  /* Sin sección de atributos: las imágenes son del museo, no de Commons.
     El render hace `if (!T.atribucion) return;` y no la pinta. */
  atribucion: null,
  cierre: {
    texto: "El ámbar es una de las piezas de la muestra del museo.",
    boton: "Ver la colección completa",
    enlace: "index.html#colecciones"
  }
};

/* --- SUBPÁGINA TIBURONES (tiburones.html) ---
   CR-85 (2026-10-20) — QUINTA subpágina del sitio, después de curriculum.html
   (CR-55), trilobites.html (CR-60), proyecto-cec.html (CR-61) y amonites.html (CR-83).

   FUENTE: «Este grupo de peces.docx» (3,78 MB, 18 imágenes), el Word que el dueño
   descargó para esta colección. El archivo se llama «Este grupo de peces» y su
   contenido es el capítulo de los seláceos: tiburones, rayas, mantarrayas y quimeras.
   Se publica bajo el título «Tiburones» para quedar a la par de sus hermanas
   (Trilobites, Ammonites), que también se nombran por el grupo, no por el archivo.

   IMAGENES: las 18 se publican. El dueño autorizó EN BLOQUE («arranca las 18»),
   mismo criterio que declaró para trilobites («son autorizadas, todas» / «ya se
   solucionó lo del copyright ya que eran cosas hechas por el mismo») y que la
   galería («EL MUSEO AUTORIZA MOSTRARLA»). DEC-012 queda exceptuada para material
   del museo; la prohibición de material de TERCEROS sin licencia sigue vigente.
   Los pies nombran a Matías Palma y Juan Castillo (equipo del museo) y a José
   Lemos Caro. Si alguno pide retiro, se sacan SOLO sus figuras: cada pie
   identifica su autor, así que el retiro es quirúrgico.

   EL ORDEN DE LAS IMÁGENES ES EL DEL WORD, LITERAL (DEC-82).
     Los archivos van 01..18 según su posición en el documento, no por tamaño ni
     por criterio visual. NO reordenar: rompe la correspondencia imagen-párrafo.

   TODAS SON JPEG RGB, ninguna con alfa: sin el problema de PNG transparente
     que hubo que resolver en trilobites (allí pasar a JPEG rellenaba de negro).

   El Word NO trae jerarquía de títulos: sólo hay tres rótulos en negrita
     («Tiburones fósiles en Chile», «Formación Bahía Inglesa», «Otodus megalodon,
     la Megabestias marina»). Las otras ocho secciones son divisiones por TEMA del
     propio texto, y sus títulos son RÓTULOS, no contenido redactado. Los párrafos
     son transcripción literal del Word, sin reescribir ni corregir.
     Se unieron los 4 cortes de línea duros del Word (frases partidas por salto
     de párrafo): unir NO cambia una palabra, sólo deja de cortar la frase.
   ============================================================ */
const TIBURONES = {
  subpagina: "tiburones.html",
  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },
  etiqueta: "Colecciones · Cenozoico",
  titulo: "Tiburones",
  bajada:
    "Peces cartilaginosos que han surcado los mares desde el Devónico hasta hoy.",
  /* `intro: null` a propósito, igual que en TRILOBITES y AMMONITES (CR-84):
     el primer párrafo del Word ya se publica en su sección («¿Qué son los
     seláceos?»), y repetirlo acá lo mostraba DOS veces. El render tolera null
     (`if (intro && T.intro)`). */
  intro: null,

  secciones: [
    {
      id: "que-son",
      titulo: "¿Qué son los seláceos?",
      nivel: 2,
      parrafos: [
        "Este grupo de peces, conocidos como seláceos (Selachii), son los más grandes depredadores " +
          "marinos de la clase Chondrichthyes y de la Subclase: Elasmobranchiide. El grupo ha " +
          "evolucionado y desarrollado desde el periodo Devónico hasta la actualidad, dividiéndose en " +
          "tres grupos: escualos (tiburones en general), las mantas y las rayas, más un grupo de peces " +
          "cartilaginosos de aguas profundas llamados quimeras. Este grupo es muy conocido en la " +
          "actualidad, por su más fiel representante, el Tiburón Blanco.",
        "No podemos asegurar cual es el antecesor directo de los selacios, sin embargo puede " +
          "considerarse a Cladoselache como el posible ancestro de muchos, sino de todos los peces de " +
          "este tipo.",
        "Los tiburones fósiles, tuvieron una amplia distribución geográfica, presentando diversas y " +
          "raras formas desde el Devónico al Carbonífero. Ya hacia finales del Mesozoico aparecen en " +
          "definitiva los tiburones como hoy los conocemos, apareciendo también en este periodo las " +
          "Mantarrayas y las Rayas, que son selacios de cuerpo aplanado con grandes aletas que le " +
          "permiten un nado con movimientos ondulatorios.",
        /* CR-85b (2026-10-20): el Word trae «a lo largo DEB su territorio» — una
           letra de más («deb»). El dueño lo detectó al leer la página publicada
           y pidió corregirlo. Excepción justificada a la regla de transcribir
           literal: es una ERRATA del original, no una palabra del museo. */
        "Chile posee a lo largo de su territorio varios sitios con presencia de tiburones fósiles. " +
          "Sin embargo, el sitio de mayor importancia sea el de la Formación Bahía Inglesa, en la",
        "III región, cercana a la ciudad de Caldera. En este lugar aparecen fósiles de varios " +
          "tiburones como Isurus, Carcharias, Lamna, Otodus, etc., todos ellos asociados a mamíferos " +
          "marinos que eran su fuente de alimentación.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/01.jpg",
          ancho: 639, alto: 822,
          alt: "Ilustración: esqueleto de un tiburón, vista lateral",
          /* Sin `pie`: el Word no le pone pie a esta ilustración. */
        },
        {
          src: "assets/img/tiburones/word/02.jpg",
          ancho: 711, alto: 830,
          alt: "Ilustración: reconstrucción del esqueleto completo de un tiburón",
          /* Sin `pie`: el Word no le pone pie a esta ilustración. */
        },
        {
          src: "assets/img/tiburones/word/03.jpg",
          ancho: 744, alto: 539,
          alt: "Esqueleto de la cabeza de un tiburón",
          pie: "Esqueleto de la cabeza de un tiburón (Ilustración José Lemos)."
        },
      ],
    },
    {
      id: "conservacion",
      titulo: "Por qué se conservan tan poco",
      nivel: 2,
      parrafos: [
        "El registro fósil ha preservado los dientes y vértebras, el resto por ser material " +
          "cartilaginoso es consumido por bacterias y carroñeros, no preservándose en el registro. Los " +
          "tiburones ocupan de preferencia zonas de aguas cálidas, por tanto la aparición de tiburones " +
          "en los estratos fosilíferos indicaría que en el momento en que murieron habitaban un mar " +
          "cálido, como fue el caso de las costas miocénicas de Chile.",
        "Sin embargo, los esqueletos cartilaginosos de los tiburones tienen un inconveniente, cuando " +
          "el tiburón muere, se descomponen con mayor rapidez que el hueso dificultando y a veces " +
          "impidiendo, la labor de los paleontólogos que rara vez encuentran esqueletos fosilizados " +
          "completos de este animal. Entre los restos óseos no cartilaginosos que podemos encontrar " +
          "están: dientes, vértebras y espinas presentes en las aletas dorsales de algunas especies.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/04.jpg",
          ancho: 1171, alto: 383,
          alt: "Vértebra cóncava de tiburón con el dibujo de los anillos concéntricos",
          pie: "Vértebra cóncava de tiburón y dibujo de los anillos concéntricos."
        },
        {
          src: "assets/img/tiburones/word/05.jpg",
          ancho: 1351, alto: 383,
          alt: "Reconstrucción del esqueleto completo de un tiburón",
          pie: "Reconstrucción del esqueleto completo de un tiburón (Ilustración Matías Palma)."
        },
      ],
    },
    {
      id: "dientes",
      titulo: "Dientes que nunca se acaban",
      nivel: 2,
      parrafos: [
        "Muchos animales mueren al perder sus dientes, puesto que ya no pueden comer. Así ocurre con " +
          "los elefantes, las focas y otras especies, pero esto no ocurre con los tiburones que nunca " +
          "se quedan sin ellos. Sus mandíbulas disponen de cuatro a seis corridas de dientes, una " +
          "detrás de la otra. Un tiburón puede llegar a tener hasta 300 dientes en la boca a la vez, y " +
          "todos ellos pueden ser reemplazados por otros de mayor tamaño conforme el tiburón va " +
          "madurando. Es por esta razón la cantidad de dientes fósiles presentes en formaciones " +
          "paleontológicas, es muy abundante como es el caso de muchas formaciones fosilíferas en el " +
          "planeta, y Chile no es la excepción en sus diferentes formaciones, sobre todo en la " +
          "Formación Bahía Inglesa detallada en este libro.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/06.jpg",
          ancho: 1351, alto: 360,
          alt: "Dientes fósiles de diversos tiburones",
          pie: "Dientes de diversos tiburones conservados como fósiles: de izquierda a derecha Megalolamna, " +
           "Notorynchus, Carcharodon (tiburón blanco), Galeorhinus y Otodus megalodon; la proporción no " +
           "es exacta (Ilustración Matías Palma)."
        },
      ],
    },
    {
      id: "respiracion",
      titulo: "Respiración por branquias",
      nivel: 2,
      parrafos: [
        "Todo organismo vivo necesita oxígeno para sobrevivir, los peces incluidos los tiburones por " +
          "ejemplo absorben el oxígeno del agua a través  de las branquias, y la sangre lo transporta " +
          "hasta las células distribuidas por todo el cuerpo, ya que el oxígeno es el que da vida a las " +
          "células de estos. Los seres humanos absorben el oxígeno del aire a través de los pulmones, " +
          "mientras que los tiburones lo absorben del agua a través de las branquias.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/07.jpg",
          ancho: 1195, alto: 676,
          alt: "Sistema respiratorio de un tiburón",
          pie: "Sistema respiratorio de un tiburón (Ilustración Matías Palma)."
        },
      ],
    },
    {
      id: "electrorrecepcion",
      titulo: "Electrorrecepción: las ampollas de Lorenzini",
      nivel: 2,
      parrafos: [
        "El increíble sentido del tiburón, denominado electrorrecepción, le permite detectar los " +
          "débiles impulsos eléctricos que emiten los animales. Este asombroso sentido ayuda al tiburón " +
          "a localizar ciertas presas que no podría encontrar con los otros sentidos.",
        "El gel que esta al interior de las ampollas es una sustancia basada en la glicoproteína con " +
          "la misma resistencia que el agua marina, y tiene propiedades eléctricas similares a un " +
          "semiconductor, permitiéndole esencialmente percibir los cambios de temperatura a una señal " +
          "eléctrica que podría ser utilizada para detectar gradientes de temperatura.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/08.jpg",
          ancho: 1095, alto: 402,
          alt: "Ampollas de Lorenzini",
          pie: "Ampollas de Lorenzini (Ilustración Matías Palma)."
        },
      ],
    },
    {
      id: "linea-lateral",
      titulo: "La línea lateral",
      nivel: 2,
      parrafos: [
        "Los tiburones tienen por otra parte, un conjunto de células sensoriales que se ubican a los " +
          "costados del cuerpo del tiburón, por lo que se conoce como línea lateral. Los canales de la " +
          "línea lateral están formados por unas células con diminutas protuberancias filiformes, " +
          "denominados cilios, que conectan con miles de fibras nerviosas que conducen los impulsos al " +
          "cerebro del tiburón. (Un investigador contó unas 6.000 fibras sensoriales que se dirigían de " +
          "la línea lateral al cerebro de una pintarroja). Este es un sentido interno conformado por un " +
          "conjunto de células nerviosas que le permite detectar las vibraciones en el agua. En " +
          "Carcharodon carcharias o tiburón blanco, estas células llegan a seis mil, repartidas a lo " +
          "largo del flanco del animal, lo que se ha convertido en el principal sentido que utilizan " +
          "para encontrar a sus presas en el agua, así como la ubicación de otros tiburones que pueden " +
          "estar en la zona. Tal vez en Otodus megalodon el número de células le eleve a los dieciocho " +
          "mil o a los veinte mil.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/09.jpg",
          ancho: 1057, alto: 441,
          alt: "Cuerpo de un tiburón mostrando la línea lateral",
          pie: "Cuerpo de un tiburón mostrando la posición de la línea de células laterales (Ilustración " +
           "Matías Palma)."
        },
      ],
    },
    {
      id: "vision",
      titulo: "Visión y membrana nictitante",
      nivel: 2,
      parrafos: [
        /* CR-85b: el Word trae «la visión DE DE los tiburones» — «de» repetido.
           Segunda errata del original corregida junto con «a lo largo deb». */
        "Los órganos de la visión de los tiburones, pueden percibirse pequeños o grandes debido a " +
          "que estos se dilatan, dependiendo de la cantidad de luz presente en su entorno. También " +
          "estos están en muchas especies de tiburón cubiertas por una membrana a modo de párpado que " +
          "les protege este órgano durante el ataque de algún depredador o cuando este ataca a su " +
          "presa, llamada membrana nictitante.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/10.jpg",
          ancho: 1219, alto: 567,
          alt: "Membrana nictitante cubriendo el ojo de un tiburón",
          pie: "Membrana nictitante que cubre el ojo de algunos tiburones (Ilustración Matías Palma)."
        },
      ],
    },
    {
      id: "camuflaje",
      titulo: "Camuflaje",
      nivel: 2,
      parrafos: [
        "Los tiburones recurren al camuflaje para sorprender a sus presas al cazar. Por lo general, " +
          "los tiburones presentan una coloración oscura por encima, en la zona dorsal, y más clara por " +
          "debajo, en la parte ventral. Las presas o depredadores no siempre los ven cuando miran hacia " +
          "abajo gracias a la oscuridad que emerge del fondo oceánico. Cuando la presa o depredador " +
          "mira hacia arriba, el vientre claro de los tiburones se funde con la superficie del océano " +
          "iluminada por el sol, con lo que también logran pasar inadvertidos. De forma similar, los " +
          "tiburones que prefieren el fondo oceánico para vivir se confunden a la perfección con el " +
          "lecho marino.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/11.jpg",
          ancho: 1129, alto: 515,
          alt: "Coloración dorsal oscura y ventral clara de un tiburón",
          pie: "Color del tiburón, oscuro arriba y claro abajo para camuflarse en su ambiente (Ilustración " +
           "Matías Palma)."
        },
      ],
    },
    {
      id: "fosiles-chile",
      titulo: "Tiburones fósiles en Chile",
      nivel: 2,
      parrafos: [
        "Los tiburones fósiles en Chile, que han sido estudiados, tienen una amplia distribución " +
          "geográfica y temporal, ya que han sido encontrados en muchos lugares del país, como la " +
          "formación Navidad, la formación Bahía Inglesa, el extremo Austral y la Antártica entre otras " +
          "zonas, y han estado presentes desde el Triásico hasta el presente.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/12.jpg",
          ancho: 473, alto: 1102,
          alt: "Mapa de localidades con tiburones fósiles en Chile",
          pie: "Mapa de las principales localidades con tiburones fósiles en Chile (Mapa Juan Castillo " +
           "Cornejo). 1) La Portada y Caleta Herradura de Mejillones, Región de Antofagasta. 2) Cerro " +
           "Negro, Región de Antofagasta. 3) Punta del Viento, Región de Antofagasta. 4) La Coipa, " +
           "Región de Atacama. 5) Caldera, Región de Atacama, Bahía Inglesa. 6) Coquimbo, Región de " +
           "Coquimbo. 7) Horcón, Región de Valparaíso. 8) Algarrobo, Región de Valparaíso. 9) Lo Abarca, " +
           "Región de Valparaíso. 10) Navidad-Matanzas, Región de O'Higgins. 11) Lo Valdés, Región " +
           "Metropolitana. 12) Punta Topocalma. 13) Caleta Loanco, Región del Maule. 14) Distintas " +
           "localidades en la costa de la Región del Biobío. 15) Cerro San Miguel, Talcahuano. 16) Isla " +
           "de Chiloé, Región de los Lagos. 17) Región de Aysén. 18) Sierra Baguales, Región de " +
           "Magallanes. 19) Cerro Dorotea, Puerto Natales, Región de Magallanes. 20) Río de Las Minas, " +
           "Península de Brunswick, Región de Magallanes. 21) Isla de James Ross e Isla Marambio, " +
           "territorio Antártico."
        },
      ],
    },
    {
      id: "bahia-inglesa",
      titulo: "Formación Bahía Inglesa",
      nivel: 2,
      parrafos: [
        "El sitio fosilífero de Bahía Inglesa, es la formación con vertebrados más importante del " +
          "país, ubicada en las costas de la III región, cercano al pueblo de caldera, aproximadamente " +
          "a 718 Km. de Santiago. La zona se caracteriza por presentar sedimentos con una inusual " +
          "concentración de restos óseos, sobre todo en la zona denominada fosforita y los dedos. Estos " +
          "restos se encuentran casi superficiales de entre 20 centímetros a un metro de profundidad, " +
          "no es exagerado decir que, en algunas zonas de la formación, hay que caminar con cuidado " +
          "para no pisar los fósiles.",
        "La geología de la Formación Bahía Inglesa consiste en una secuencia de sedimentos " +
          "fosilíferos marinos litorales, con depósitos de coquinas, areniscas, intercaladas con " +
          "diatomitas, fosforitas y, ocasionalmente, cenizas; consiste en sedimentos heterogéneos, que " +
          "en menor proporción contiene brechas y conglomerados, depositados entre el Mioceno Medio y " +
          "el Plioceno, en un entorno marino costero. Está dividido en tres unidades sedimentarias o " +
          "miembros: Miembro del Morro, Miembro Bonebed Bahía Inglesa, y Miembro del Lechero.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/13.jpg",
          ancho: 1350, alto: 1012,
          alt: "Vista panorámica del sector fosilífero de Bahía Inglesa",
          pie: "Vista panorámica del sector fosilífero de Bahía Inglesa (Foto Juan Castillo)."
        },
      ],
    },
    {
      id: "megalodon",
      titulo: "Otodus megalodon, la megabestia marina",
      nivel: 2,
      parrafos: [
        "Este gran tiburón ha tenido a lo largo del tiempo diversas clasificaciones, por ejemplo, se " +
          "creyó que era pariente directo del tiburón blanco, por lo que se le llamó Carcharodon " +
          "megalodon, después paso a llamarse Carcharocles megalodon, sin embargo, recientes " +
          "investigaciones lo ubican en la familia Otodontidae, quedando nominado como Otodus " +
          "megalodon.",
        "Otodus megalodon, con un tamaño de entre 14 a más de 20 metros, fue el pez más grande de los " +
          "océanos del mundo, un temible tiburón que, como ningún otro animal, puede llevar el justo " +
          "apelativo de megabestia, con un peso que oscilaba entre los 14 y los 37 mil ki¬los (de 14 a " +
          "37 toneladas). Hay que imaginarse al megalodon como un tiburón blanco, (aunque no son " +
          "parientes directos), pero tres veces más grande y masivo, características que lo " +
          "convirtieron en el cazador más feroz de los mares durante el Mioceno Superior y el Plioceno, " +
          "de 15 a 5 millones de años, ya que su fuerza de mordedura superaba en mucho a la del T. Rex.",
        "Sus fauces alojaban aproximadamente de 260 a 270 dientes acerrados, siendo los más grandes " +
          "de unos 20 centímetros, transformándose así, en el mayor depredador marino de todos los " +
          "tiempos.",
        "El megalodon depredaba ballenas, pinnípedos, aves como Pelagornis y otros animales. Su " +
          "cuerpo era masivo y fusiforme, lo que le permitía desplazarse como un verdadero torpedo. " +
          "Esto sumado a una serie de elementos sensoriales, con los que podía detectar su presa a " +
          "mucha distancia y olfatear su sangre a muchos kilómetros, lo hacía un inminente peligro para " +
          "cualquier animal. Su hocico abierto abarcaba más de 2,5 metros, siendo su único competidor " +
          "el Leviatán, un cetáceo odontoceto del grupo de los cachalotes.",
        "Su hocico abierto abarcaba más de 2,5 metros, siendo su único competidor el Leviatán, un " +
          "cetáceo odontoceto del grupo de los cachalotes.",
        "Debido a que su cuerpo es cartilaginoso, el megalodon presenta dificultades en su " +
          "preservación como fósil, por lo que sólo se han conservado algunas partes de su cuerpo, unas " +
          "cuantas vértebras, pero principalmente sus dientes, a partir de los cuales se puede " +
          "extrapolar su medida.",
        "La distribución es amplia, encontrándose en varias partes del mundo. En Chile lo hemos " +
          "encontrado principalmente en Bahía Inglesa, pero también Juan Castillo, ha encontrado restos " +
          "en la VI Región, específicamente en la Formación Navidad y publicado en la Revista Isurus de " +
          "España.",
      ],
      imagenes: [
        {
          src: "assets/img/tiburones/word/14.jpg",
          ancho: 1100, alto: 883,
          alt: "Diente de Megalodon adulto",
          pie: "Diente de Megalodon adulto depositado en el Museo Paleontológico de Caldera (Foto Juan " +
           "Castillo)."
        },
        {
          src: "assets/img/tiburones/word/15.jpg",
          ancho: 909, alto: 621,
          alt: "Diente de Otodus megalodon in situ en Bahía Inglesa",
          pie: "Diente de Otodus megalodon in situ, Bahía Inglesa, III Región."
        },
        {
          src: "assets/img/tiburones/word/16.jpg",
          ancho: 492, alto: 609,
          alt: "Otodus megalodon juvenil atacando a un Odobenocetops",
          pie: "Otodus megalodon juvenil atacando a un Odobenocetops, en los mares de Bahía Inglesa " +
           "(Ilustración de José Lemos Caro)."
        },
        {
          src: "assets/img/tiburones/word/17.jpg",
          ancho: 625, alto: 821,
          alt: "Otodus megalodon juvenil atacando a un Thalassocnus",
          pie: "Otodus megalodon juvenil atacando a un Thalassocnus, en los mares de Bahía Inglesa " +
           "(Ilustración de José Lemos Caro)."
        },
        {
          src: "assets/img/tiburones/word/18.jpg",
          ancho: 772, alto: 1057,
          alt: "Otodus megalodon juvenil atacando a un Pelagornis",
          pie: "Otodus megalodon juvenil atacando a un Pelagornis."
        },
      ],
    },
  ],

  /* Nota de procedencia: mismo criterio que trilobites y ammonites. El material
     es del museo y lleva el crédito de sus autores en el pie de cada figura. */
  notaImagenes:
    "Las imágenes de esta página son material del Museo Paleontológico de Chile " +
    "y se publican con su autorización. El crédito de cada autor va en el pie " +
    "de su figura.",
  /* Sin sección de atribución: no hay material de Wikimedia ni de terceros sin
     licencia. El render hace `if (!T.atribucion) return;` y no la pinta. */
  atribucion: null,
  cierre: {
    texto: "Los tiburones son una de las piezas de la muestra del museo.",
    boton: "Ver la colección completa",
    enlace: "index.html#colecciones"
  }
};

if (typeof window !== "undefined") {
  window.MUSEO = MUSEO; window.QUIENES_SOMOS = QUIENES_SOMOS;
  /* CR-71: el interruptor de la subpágina tiene que viajar al `window` igual
     que el resto: `const` en el ámbito del archivo NO crea propiedad global, y
     sin esta línea `window.CEC_SUBPAGINA` es undefined y los enlaces no se
     apagan (defecto medido, no supuesto). */
  window.CEC_SUBPAGINA = CEC_SUBPAGINA;
  window.COLECCIONES = COLECCIONES; window.SERVICIOS = SERVICIOS;
  window.SERVICIOS_NOTA = SERVICIOS_NOTA; window.MUSEO_ITINERANTE = MUSEO_ITINERANTE;
  window.GALERIA = GALERIA; window.TRILOBITES = TRILOBITES; window.CEC = CEC;
  window.AMMONITES = AMMONITES;
  window.TIBURONES = TIBURONES;
  /* CR-86: misma trampa documentada en CR-71 y CR-80 — `const` en el ámbito del
     archivo NO crea propiedad global, así que sin esta línea `window.AMBAR` es
     undefined y ambar.js sale por el guard sin pintar nada (página en blanco).
     Se vio al medir: `node -e` daba «Cannot read properties of undefined». */
  window.AMBAR = AMBAR;
  /* CR-80: `const` no crea propiedad global — sin esta línea ENTIDADES es
     undefined en el render (misma trampa que documentó CR-71 con CEC_SUBPAGINA). */
  window.ENTIDADES = ENTIDADES;
}
