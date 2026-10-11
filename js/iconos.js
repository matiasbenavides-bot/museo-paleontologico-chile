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

  /* AMMONITE — concha planiespiralada con COSTILLAS y camara de habitacion.
     Segun la fuente (Wikipedia, "Ammonoidea"): "concha fina de aragonito,
     planiespiralada y con una ornamentacion muy marcada, constituida por
     COSTILLAS BIEN DEFINIDAS". Se divide en "fragmocono" (tabicado, con los
     septos) y "camara de habitacion" (la final y de mayor tamano, donde
     vivia el animal). Sin las costillas el dibujo eran 3 circulos y no se
     reconocia como ammonite. */
  ammonite: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* espiral logaritmica: arranca en la abertura y se enrolla al centro */
    '<path d="M45 24c5.5 6 7 14.5 3.5 22.5C44.5 55 34 60 24.5 57.5 14.5 55 7.5 45 9 33.5 10.5 21.5 21 13 32.5 14.5c8.5 1 14.5 8 15 17 .4 7-4.5 12.5-11 13-5.5.4-10.5-3.5-11-9-.4-4.5 3-8.5 7.5-8.7"/>' +
    /* COSTILLAS: la ornamentacion radial caracteristica, marcada en toda
       la vuelta externa de la concha */
    '<path d="M47 18l4.5-3M51.5 26l5-2M53.5 35l5.5-1M51.5 44l5.5 1.5M46 51l4.5 3.5M37.5 55.5l2.5 5M27 55.5l-1 5.5M17.5 51.5l-3.5 4.5M10.5 44l-4.5 2.5M8 34l-5-.5M10 24l-4-2.5M16.5 16l-3-4M26 11.5l-1-4.5"/>' +
    /* abertura de la concha, en el extremo exterior de la espira */
    '<path d="M45 24c-2-3-5.5-4.5-9-4"/>' +
    /* SEPTOS: las suturas internas que tabican el fragmocono */
    '<path d="M46 30l5.2 2M44.5 37l5.5 1M41 43.5l5 3M35.5 48.5l3.5 4.5M28.5 50.5l1.5 5.5"/>' +
    /* camara de habitacion: el tramo final, mas amplio, se marca aparte */
    '<path d="M51.5 33c1.5 6-1 13-6 17"/>' +
    '</svg>',

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

  /* HUESO Y HUEVO DE DINOSAURIO — las dos piezas que expone el museo.
     HUESO: un hueso largo tiene tres partes. La DIAFISIS (cuerpo, la parte
     cilindrica del medio) es MAS ANGOSTA que las dos EPIFISIS (los extremos
     articulares), que se ensanchan en forma de nudillo. Eso es lo que hace
     que un hueso se reconozca como hueso y no como un palo.
     HUEVO: forma ovoide, mas puntiagudo en un extremo. Los huevos fosiles
     de dinosaurio aparecen con la CASCARA AGRIETADA o con la textura de
     cascara conservada, y suelen hallarse en nidos. */
  hueso: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* HUESO largo: diafisis angosta + epifisis ensanchadas en los extremos.
       El contorno define la cintura del hueso en el centro. */
    '<path d="M9 45c-2.5-2-3-5.5-1-7.5 1.5-1.5 3.5-1.5 5 0l1.5 1.5 24-20-1.5-1.5c-1.5-1.5-1.5-3.5 0-5 2-2 5.5-1.5 7.5 1 2 2.5 2 5.5 0 7.5l-1.5 1.5 3 3-1.5 1.5c-2.5 2.5-6.5 2.5-9 0l-22.5 19 1.5 1.5c1.5 1.5 1.5 3.5 0 5-2 2-5.5 1.5-7.5-1z"/>' +
    /* la cintura: las lineas que marcan donde termina el cuerpo del hueso */
    '<path d="M22 33l3.5 3.5M41 19l3.5 3.5"/>' +
    /* HUEVO: ovoide, mas agudo arriba, con la cascara agrietada tipica */
    '<path d="M48 8c4.5 0 8 5 8 11s-3.5 10-8 10-8-4-8-10 3.5-11 8-11z"/>' +
    '<path d="M43 14l2.5 2-1.5 2.5 2.5 2M53 13l-2 2 1.5 2.5-2 2"/>' +
    /* cascara: linea que separa la cascara del interior */
    '<path d="M41.5 21c4.5 2 8.5 2 13 0"/>' +
    '</svg>',

  /* RECONSTRUCCION — esqueleto de dinosaurio montado en sala.
     Estructura real de un esqueleto de teropodo:
       craneo con mandibula y fenestra (la ventana del craneo),
       columna vertebral curvada (cervical -> dorsal -> caudal),
       costillas que bajan de las vertebras dorsales,
       pelvis, y patas con femur, tibia y pie.
     Antes esto era una estrella de 5 puntas, sin ninguna relacion. */
  recon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* CRANEO: largo, con la fenestra (abertura) y la mandibula inferior */
    '<path d="M8 20c0-3.5 2.5-6 6-6l8 .5c3.5.2 5.5 2 6 5l.5 3-6 1-2 5-3-4.5-4-1c-3 0-5.5-1-5.5-3z"/>' +
    '<path d="M15 24c2.5 1.5 5.5 1.5 8 0"/>' +
    /* COLUMNA: cervical curvada hacia arriba, dorsal descendente, caudal */
    '<path d="M28 18c6-3 11-2 15 2 4 3.5 6 9 7 15"/>' +
    /* VERTEBRAS: espinas neurales saliendo de la columna */
    '<path d="M31 15.5l-1-3.5M36 15l-1-3.5M41 17l-1-3.5M45.5 21l-1-3.5M49 26.5l-1-3.5"/>' +
    /* COSTILLAS: bajan de la zona dorsal, curvando hacia la pelvis */
    '<path d="M30 20c1.5 6 1 12-1.5 17M35 21c2 6 2 12 0 17M40 23.5c2.5 5 3 10.5 1.5 15.5M45 27.5c2.5 4.5 3 9 1.5 13"/>' +
    /* PELVIS */
    '<path d="M44 38c3 1.5 4.5 4 4 7M44 38c-2 2-2.5 5-1.5 8"/>' +
    /* PATA: femur, tibia y pie */
    '<path d="M46 39c1 5 1.5 9.5 1 13M45 39c-1.5 4.5-2.5 8.5-2 12.5"/>' +
    '<path d="M42 54h7"/>' +
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
