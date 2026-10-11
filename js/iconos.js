/* ============================================================
   MPCH — Iconos SVG (trazo, sin dependencias)

   CR-10: los 6 iconos de PIEZAS fueron redibujados con anatomia real.
   Los anteriores eran pictogramas abstractos que no representaban la
   pieza: el "hueso" era un aspa, "reconstrucciones" era una estrella de
   5 puntas, y el trilobite era una elipse con rayas. Ahora cada uno
   muestra la forma verdadera del fosil.

   viewBox 0 0 64 64 para tener espacio de detalle.
   stroke-width 1.9, sin relleno, escalable a cualquier tamano.
   ============================================================ */
const ICONOS = {

  /* TRILOBITE — vista dorsal, con la anatomia que define al grupo.
     Segun la fuente (Wikipedia, "Trilobita", seccion Morfologia):
       - "el cuerpo ... dividido en tres tagmas: cefalon, torax y pigidio"
       - "dos surcos longitudinales que dividen el cuerpo en tres lobulos
         claramente delimitados (de donde deriva su nombre): uno central
         (glabela en el cefalon y raquis en el tronco) y dos laterales
         (genas o mejillas en el cefalon y pleuras en el tronco)"
       - "las genas se prolongan por los lados y por detras por DOS PUNTAS
         GENALES"
       - "las genas estan divididas en dos partes por una SUTURA: una gena
         fija interna (fixigena) y una gena movil externa (librigena)"
       - "un par de grandes ojos compuestos"
       - torax de "entre 2 y 40 metameros" articulados; pigidio con
         "metameros fusionados"
     Los surcos axiales son LA razon del nombre del animal: sin ellos el
     dibujo era un elipse generica. Las puntas genales son lo mas visible
     en cualquier fosil real. */
  trilobite: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* cefalon: escudo cefalico con las DOS PUNTAS GENALES prolongandose
       hacia atras y hacia afuera (el rasgo mas reconocible de un trilobite) */
    '<path d="M32 6c5 0 9 1.5 12 4.5l9 12-4 5c-2-1.5-4-3-5.5-5"/>' +
    '<path d="M32 6c-5 0-9 1.5-12 4.5l-9 12 4 5c2-1.5 4-3 5.5-5"/>' +
    /* borde inferior del cefalon */
    '<path d="M20 27c7 3 17 3 24 0"/>' +
    /* glabela: el lobulo CENTRAL del cefalon, entre los dos surcos axiales */
    '<path d="M32 8.5c-4 0-6.5 3.5-6.5 8.5s2.5 8 6.5 8 6.5-3 6.5-8-2.5-8.5-6.5-8.5z"/>' +
    /* LOS DOS SURCOS LONGITUDINALES: separan el lobulo central (raquis)
       de las pleuras laterales. Van de la cabeza a la cola. */
    '<path d="M27 22v22M37 22v22"/>' +
    /* SUTURA FACIAL: divide la gena fija (interna) de la movil (externa) */
    '<path d="M22 16l3 6M42 16l-3 6"/>' +
    /* ojos compuestos, a cada lado de la glabela */
    '<path d="M22.5 13.5c2.5-.9 4.5.2 5.2 2.4M41.5 13.5c-2.5-.9-4.5.2-5.2 2.4"/>' +
    /* torax: metameros articulados, cada uno cruzando los tres lobulos.
       El segmento es continuo: raquis (centro) + pleuras (costados). */
    '<path d="M21 30c7.5 2 14.5 2 22 0"/>' +
    '<path d="M20 36c8 2 16 2 24 0"/>' +
    '<path d="M20.5 42c7.5 2 15.5 2 23 0"/>' +
    /* pleuras: los lobulos laterales se extienden hacia afuera en punta */
    '<path d="M21 30l-4 3M43 30l4 3M20 36l-4.5 3M44 36l4.5 3M20.5 42l-4 3M43.5 42l4 3"/>' +
    /* pigidio: segmentos FUSIONADOS (sin articulacion) + anillo del raquis */
    '<path d="M22 47c6 2.5 14 2.5 20 0"/>' +
    '<path d="M27 25v20M37 25v20"/>' +
    /* borde final redondeado del pigidio */
    '<path d="M22 47c2.5 5 6 7.5 10 7.5s7.5-2.5 10-7.5"/>' +
    '</svg>',

  /* AMMONITE — PNG transparente entregado por el dueño (CR-12).
     El SVG generado no lograba la forma. El dueño entregó "fondo amonnite.png"
     (447x447, trazo negro sobre blanco) con la instruccion "invertir color y
     dejar solo bordes". Convertido a PNG transparente (trazo blanco sobre alfa)
     en assets/img/ammonite-linea.png.
     El tintado se hace por CSS con mask + background-color: currentColor, en
     colecciones.css (.pieza__ico--png). Asi hereda el mismo color que los SVG
     y responde al hover igual que el resto. */
  ammonite: '<span class="ico-png ico-png--ammonite" role="img" aria-label="Ammonite"></span>',

  /* AMBAR — resina fosil con inclusion organica.
     Fuente (Wikipedia, "Ambar"): "resina fosilizada de origen vegetal,
     proveniente principalmente de restos de coniferas"; "transparente o
     translucido"; color "naranja amarronado", "tono miel", "verdoso".
     El contorno de una masa de resina es IRREGULAR: se endurece al caer,
     no forma una gota geometrica. La inclusion es el atractivo de la pieza. */
  ambar: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* contorno irregular, con lobulos y hundimientos propios de la resina */
    '<path d="M30 5c7 0 12 3 16 8 5 5 8 12 7 20-1 9-6 17-13 21-6 4-14 4-20 1-7-4-11-11-11-19 0-7 2-13 6-18C19 12 24 6 30 5z"/>' +
    '<path d="M46 33c3 1 5 4 5 7 0 4-3 7-7 7"/>' +
    /* transparencia: lineas de brillo interno */
    '<path d="M20 18c3-4 7-6 11-6.5M16 28c1-3 3-6 6-8"/>' +
    /* INSECTO incluido: cuerpo segmentado, cabeza con antenas,
       alas plegadas y seis patas. Es lo que da valor a la pieza. */
    '<path d="M31 28c2 0 3.5 1.5 3.5 3.5S33 35 31 35s-3.5-1.5-3.5-3.5S29 28 31 28z"/>' +
    '<path d="M31 25.5v-2.5"/>' +
    '<path d="M29 24l-3.5-3M33 24l3.5-3"/>' +
    '<path d="M27 31.5l-5.5 1.5M26.8 34l-5 4M27.5 36.5l-3 5.5M35 31.5l5.5 1.5M35.2 34l5 4M34.5 36.5l3 5.5"/>' +
    /* alas plegadas sobre el abdomen */
    '<path d="M30 35c-1.5 2.5-1.5 6-.5 9M32 35c1.5 2.5 1.5 6 .5 9"/>' +
    '</svg>',

  /* DIENTE DE TIBURON — la pieza que expone el museo son dientes y vertebras.
     Anatomia correcta: corona triangular, denticulos laterales, raiz
     bilobulada. Es la forma clasica de un diente fosil de escualo. */
  tiburon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* corona: triangulo ancho en la base, punta arriba, con un lado cortante */
    '<path d="M32 5L44 22c1.5 3 1 6-1 7.5L32 34 21 29.5C19 28 18.5 25 20 22L32 5z"/>' +
    /* denticulos: las muescas en los bordes de la corona */
    '<path d="M23 25.5l-3.5 1M20.5 21l-3 .6M26.5 15.5l-2.5-1M41 25.5l3.5 1M43.5 21l3 .6M37.5 15.5l2.5-1"/>' +
    /* raiz bilobulada: las dos ramas que anclan el diente en la encia */
    '<path d="M24 32c-1 6-1.5 12-1 18 1 2 4 2 5 0l3-11"/>' +
    '<path d="M40 32c1 6 1.5 12 1 18-1 2-4 2-5 0l-3-11"/>' +
    /* esmalte: linea de separacion entre corona y raiz */
    '<path d="M22 30.5c7 2.5 13 2.5 20 0"/>' +
    '</svg>',

  /* HUESO — forma levantada del PNG que entrego el dueño.
     El PNG ("huesos ... invertir color y dejar solo bordes") trae un hueso
     VERTICAL y SIMETRICO sobre su eje: dos epifisis (extremos) enfrentadas,
     cada una con DOS LOBULOS tipo nudillo, y una diafisis que se estrecha al
     centro formando una X / reloj de arena. Lo confirme leyendo el mapa de
     pixeles del archivo, no a ojo.
     Antes estaba mal: lo dibuje en diagonal con las epifisis desplazadas a
     esquinas opuestas (una "copa mas afuera que la otra"). Ahora es simetrico.
     El HUEVO ya no va en este icono: el dueño pidio separarlos. */
  hueso: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* extremo SUPERIOR: epifisis con sus dos lobulos enfrentados */
    '<path d="M24 6c3.5 0 6 3 6.5 6.5M40 6c-3.5 0-6 3-6.5 6.5"/>' +
    '<path d="M30.5 12.5c-3 1-5.5 3-7 6M33.5 12.5c3 1 5.5 3 7 6"/>' +
    /* cuerpo: se estrecha hacia la cintura central (la X) */
    '<path d="M23.5 18.5c5 5.5 8 9 8.5 13.5.5-4.5 3.5-8 8.5-13.5"/>' +
    '<path d="M23.5 45.5c5-5.5 8-9 8.5-13.5.5 4.5 3.5 8 8.5 13.5"/>' +
    /* extremo INFERIOR: espejo exacto del superior */
    '<path d="M30.5 51.5c-3-1-5.5-3-7-6M33.5 51.5c3-1 5.5-3 7-6"/>' +
    '<path d="M24 58c3.5 0 6-3 6.5-6.5M40 58c-3.5 0-6-3-6.5-6.5"/>' +
    /* la cintura: marca donde el cuerpo se hace mas angosto */
    '<path d="M28 30.5c1.5 1 3 1 4.5 0M28 33.5c1.5-1 3-1 4.5 0"/>' +
    '</svg>',

  /* HUEVO DE DINOSAURIO — icono PROPIO, separado del hueso (pedido del dueño).
     Forma ovoide con un extremo mas agudo, cascara agrietada y textura de
     cascara fosilizada. Los huevos de dinosaurio aparecen en nidos. */
  huevo: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* contorno ovoide: mas agudo arriba, mas redondo abajo */
    '<path d="M32 7c7.5 0 14 10.5 14 21.5S39.5 50 32 50s-14-10.5-14-21.5S24.5 7 32 7z"/>' +
    /* cascara agrietada: la rotura tipica de un huevo fosil */
    '<path d="M22 27l4 3-2.5 3 4 3-2 3M42 25l-3.5 3 2.5 3-3 3"/>' +
    /* linea de cascara: separa la cascara del interior */
    '<path d="M19.5 35c7.5 3.5 17.5 3.5 25 0"/>' +
    /* el nido: hueco donde se apoya */
    '<path d="M14 51c4 4 10 6 18 6s14-2 18-6"/>' +
    '<path d="M18 55c3.5 2.5 8.5 4 14 4s10.5-1.5 14-4"/>' +
    '</svg>',

  /* RECONSTRUCCION — MANDIBULA DE DINOSAURIO (pedido del dueño).
     Se reemplaza el esqueleto completo por una mandibula, que es lo que el
     museo reconstruye y lo que se reconoce al instante.
     Anatomia de una mandibula de teropodo:
       - rama mandibular alargada y baja
       - la SINFISIS (donde se unen las dos mitades) al frente
       - DENTADURA: dientes conicos y aserrados, todos del mismo tipo
         (homodontos), inclinados hacia atras
       - la FENESTRA MANDIBULAR (abertura ovalada) en la mitad posterior
       - el proceso articular y el proceso coronoide, atras y arriba
       - los dientes siguen la curva de la mandibula: mas grandes al centro */
  recon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* rama mandibular: contorno alargado, bajo, con la sinfisis al frente
       (extremo agudo a la izquierda) y el proceso articular atras */
    '<path d="M7 38c1.5-4 5-6 9.5-6h28c4 0 7 2 8.5 5 .8 1.7.5 3.5-1 4.5-2 1.3-4.5 1.5-7 .8l-31 1.2c-4.5 0-8-2-7.3-5.5z"/>' +
    /* la SINFISIS: la union de las dos mitades, al frente */
    '<path d="M9 35.5c1.5 1.5 3 2.5 5 3"/>' +
    /* FENESTRA MANDIBULAR: la ventana ovalada del hueso */
    '<path d="M39 36c3.5 0 6 1.5 6 3.5S42.5 43 39 43s-6-1.5-6-3.5 2.5-3.5 6-3.5z"/>' +
    /* el proceso articular (atras) y el coronoide (arriba) */
    '<path d="M46 35c1.5-2.5 3.5-3.5 5.5-3M48.5 43c1.5 1.5 3 2 4.5 1.5"/>' +
    /* DENTADURA: dientes conicos, homodontos, inclinados hacia atras.
       Siguen la curva de la mandibula y son mas grandes al centro. */
    '<path d="M11 32l1-5 1.5 5M16 31.5l1.2-6 1.8 6M21.5 31.5l1.3-6.5 1.7 6.5M27 31.5l1.3-7 1.7 7M32.5 31.5l1.3-6.5 1.7 6.5M38 31.5l1.2-6 1.8 6M43 32l1-5 1.5 5"/>' +
    /* el borde superior del dentario, del que nacen los dientes */
    '<path d="M10 32.5c10-2 24-2 34 0"/>' +
    '</svg>',

  /* --- Servicios (no son piezas: quedan como pictogramas funcionales) --- */
  museo: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L24 6l18 12"/><path d="M10 20v16M19 20v16M29 20v16M38 20v16"/><path d="M6 40h36"/></svg>',
  terreno: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" transform="translate(0,4)"/><path d="M8 44h32"/></svg>',
  colegio: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20v22h32V20"/><path d="M4 20L24 8l20 12z"/><path d="M18 42V30h12v12"/></svg>',

  /* --- Interfaz --- */
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-6.5 8-12a8 8 0 10-16 0c0 5.5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  metro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/></svg>',
  telefono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/></svg>',
  correo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 7l10 7 10-7"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A8.4 8.4 0 1112 20.4a8.5 8.5 0 01-4.1-1.1L3 21z"/><path d="M8.6 8.2c.3-.1.6 0 .8.3l.9 1.4c.1.3.1.5-.1.7l-.6.6c-.2.2-.2.4-.1.6.5.9 1.3 1.6 2.2 2.1.2.1.5.1.6-.1l.6-.6c.2-.2.4-.3.7-.1l1.4.9c.3.2.4.5.3.8-.2.9-1.1 1.6-2.1 1.5-3-.3-5.6-2.9-5.9-5.9-.1-1 .6-1.9 1.4-2.2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>'
};
if (typeof window !== "undefined") window.ICONOS = ICONOS;
