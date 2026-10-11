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

  /* AMMONITE — SVG de linea dibujado por nosotros (CR-14).
     El PNG anterior ("fondo amonnite.png") resulto tener DERECHOS DE AUTOR,
     asi que se elimino del sitio entero. Se reemplaza por este dibujo propio,
     con la misma anatomia que ya habiamos investigado para las otras piezas.

     Fuente: Wikipedia, "Ammonoidea" — "concha fina de aragonito,
     planiespiralada y con una ornamentacion muy marcada, constituida por
     COSTILLAS BIEN DEFINIDAS". La concha se divide en:
       - fragmocono: la parte tabicada, con los SEPTOS que la compartimentan
         y el gollete sifonal que los comunica
       - camara de habitacion: la final y de mayor tamano, donde vivia el
         cuerpo blando (con la corona de tentaculos asomando por la abertura)

     El dibujo: espiral logaritmica que arranca en la abertura (arriba-derecha)
     y se enrolla hacia el centro; costillas radiales en la vuelta externa;
     septos curvos marcando las camaras; abertura con el borde del labio. */
  ammonite: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* espiral logaritmica: arranca en la abertura y se enrolla al centro.
       Cada vuelta es ~40% mas chica que la anterior, que es la proporcion
       real de la concha de un ammonite. */
    '<path d="M44 23c6 6.5 7.5 15.5 3.5 23.5C43.5 54.5 33 59.5 23 57 13 54.5 6.5 44 8 32.5 9.5 21 20 12.5 31.5 14c8.5 1.2 14.5 8 15 17 .4 7.5-4.5 13-11 13.5-5.5.4-10.5-3.5-11-9-.4-4.5 3-8.5 7.5-8.8 3-.2 5.5 1.5 6.2 4"/>' +
    /* COSTILLAS: la ornamentacion radial, la firma del ammonite.
       Van del centro hacia afuera y son mas densas en la vuelta externa. */
    '<path d="M46.5 17.5l4-3.5M51.5 24.5l5-2.5M54 33l5.5-1.5M53 42l5.5 1M48.5 50l4.5 3.5M41 55.5l2.5 5M32 57.5l.5 5.5M22.5 55.5l-2.5 5M14 50l-4 4M8.5 42l-5 2M6.5 32.5l-5.5-.5M9 23l-4.5-3M15 15.5l-3.5-4M23.5 11l-1.5-5"/>' +
    /* SEPTOS: las suturas que tabican el fragmocono. Son curvas, no rectas:
       la interseccion de los septos con la pared dibuja la sutura. */
    '<path d="M46 28c2.5 3 3 8 1 12M40.5 45.5c-3 3.5-8.5 5-13 3.5M20 44c-3.5-2.5-5.5-6.5-6-11"/>' +
    /* ABERTURA: el borde del labio, por donde asomaba el cuerpo blando */
    '<path d="M44 23c-2-3.5-5.5-5.5-9.5-5.5"/>' +
    /* camara de habitacion: la ultima vuelta, mas amplia, marcada aparte */
    '<path d="M51 33c1 7-2.5 15-9 19"/>' +
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

  /* DIENTE DE TIBURON — la pieza del museo son "restos de tiburones" (dientes
     y vertebras), no dientes de dinosaurio.
     Anatomia de un diente fosil de escualo:
       - corona TRIANGULAR y APLANADA (a diferencia del dinosaurio, que es
         conico y grueso). Es lo que la hace una cuchilla cortante.
       - raiz BILOBULADA: las dos ramas que anclan el diente en la encia.
         Es el rasgo que distingue un diente de tiburon de uno de reptil.
       - DENTICULOS: las serraciones de los bordes, mas marcadas en las
         especies cortadoras.
       - esmalte liso en la cara lingual, con la linea que separa corona
         y raiz.
     Correccion de esta version: antes la corona era un triangulo simple sin
     la raiz bilobulada bien formada ni el perfil aplanado del escualo. */
  tiburon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* corona: TRIANGULAR y aplanada, de lados convergentes a la punta.
       El lado izquierdo es el borde cortante anterior. */
    '<path d="M32 4c0 0 1.5 4 3 8 2.5 6.5 4.5 14 4.5 19 0 2-.5 3.5-1.5 4.5L32 39l-6-3.5c-1-1-1.5-2.5-1.5-4.5 0-5 2-12.5 4.5-19C30.5 8 32 4 32 4z"/>' +
    /* denticulos: las serraciones del borde IZQUIERDO (anterior) */
    '<path d="M30 10.5l-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1"/>' +
    /* denticulos del borde DERECHO (posterior) */
    '<path d="M34 10.5l1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1 1.5 1-1.5 1"/>' +
    /* la linea del cuello: donde el esmalte termina y empieza la raiz */
    '<path d="M26 35.5c3.5 2 8.5 2 12 0"/>' +
    /* RAIZ BILOBULADA: las dos ramas divergentes, el rasgo distintivo
       de un diente de tiburon. Cada lobulo se hunde en la encia. */
    '<path d="M26.5 36c-1 5-1.5 11-1 16.5.2 2 2.8 2 3 0l1.5-11"/>' +
    '<path d="M37.5 36c1 5 1.5 11 1 16.5-.2 2-2.8 2-3 0l-1.5-11"/>' +
    /* el canal central entre los dos lobulos de la raiz */
    '<path d="M31.5 38v6"/>' +
    '</svg>',

  /* HUESO — proporciones levantadas del PNG del dueño, midiendo pixeles.
     Del perfil real del archivo (447x447) saque estas medidas:
       - la cintura central mide 93px, o sea el 21% del ancho maximo (447px)
       - NO es una X simple: cada extremo tiene DOS LOBULOS separados por una
         muesca. En y=136 el trazo se parte en CUATRO segmentos
         ([23-74][91-181] ... [265-355][372-423]): dos lobulos por lado.
       - los lobulos son masas REDONDEADAS con muescas entre ellas, no puntas
     Antes lo dibuje con las epifisis desplazadas a esquinas opuestas ("una
     copa mas afuera que la otra", como lo describio el dueño). La forma real
     es simetrica sobre el eje vertical. */
  hueso: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* === CABEZA SUPERIOR: dos lobulos redondeados con muesca al centro === */
    '<path d="M26 4.5c3.5 0 5.5 2.5 5.5 5.5"/>' +
    '<path d="M38 4.5c-3.5 0-5.5 2.5-5.5 5.5"/>' +
    /* contorno externo de la cabeza: se ensancha hacia los costados */
    '<path d="M20.5 9c-3.5 1.5-6 4-6 7.5 0 2.5 1 4.5 2.5 6"/>' +
    '<path d="M43.5 9c3.5 1.5 6 4 6 7.5 0 2.5-1 4.5-2.5 6"/>' +
    /* la muesca central de la cabeza: separa los dos lobulos */
    '<path d="M32 10v3"/>' +
    /* === CINTURA: el cuerpo se estrecha al 21% del ancho, en X === */
    '<path d="M25 22.5C28 27 31 30 31.5 32c.5-2 3.5-5 6.5-9.5"/>' +
    '<path d="M25 41.5C28 37 31 34 31.5 32c.5 2 3.5 5 6.5 9.5"/>' +
    /* === CABEZA INFERIOR: espejo exacto de la superior === */
    '<path d="M20.5 55c-3.5-1.5-6-4-6-7.5 0-2.5 1-4.5 2.5-6"/>' +
    '<path d="M43.5 55c3.5-1.5 6-4 6-7.5 0-2.5-1-4.5-2.5-6"/>' +
    '<path d="M26 59.5c3.5 0 5.5-2.5 5.5-5.5"/>' +
    '<path d="M38 59.5c-3.5 0-5.5-2.5-5.5-5.5"/>' +
    '<path d="M32 54v-3"/>' +
    /* la cintura, marcada: las dos lineas que senalan la parte mas angosta */
    '<path d="M29.5 30.5c1.5 1 3.5 1 5 0M29.5 33.5c1.5-1 3.5-1 5 0"/>' +
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

  /* RECONSTRUCCION — MANDIBULA DE TIRANOSAURIDO.
     Anatomia segun las fuentes consultadas:
       - "grandes dientes maxilares y mandibulares ... extremadamente gruesos,
         a menudo circulares en seccion transversal" (no cuchilla)
       - la dentadura es HOMODONTA: "solo dientes de la misma forma y del
         mismo tamaño" (Wikipedia, "Denticion") — no hay incisivos/caninos
       - "dientes premaxilares en forma de D ... y mas pequenos que el resto"
       - el craneo de Tyrannosaurus "presenta un gran numero de huesos
         fusionados, supliendo la movilidad por una estructura mas maciza"
       - el dentario es el hueso principal de la mandibula inferior; lleva
         los dientes y aloja la fenestra mandibular (la ventana ovalada)
     Mejoras sobre la version anterior: rama mas ALTA y maciza (no un perfil
     plano), dientes conicos homodontos de tamano parejo, sinfisis marcada al
     frente, y los dos procesos (articular y coronoide) separados por la
     escotadura sigmoidea. */
  recon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    /* === DENTARIO: rama mandibular alta y maciza ===
       Borde superior (donde nacen los dientes) y borde inferior, con la
       sinfisis al frente y la rama ascendente atras. */
    '<path d="M4 36c0-3 2-5.5 5.5-5.5h13c2 0 3.5 1 4 3"/>' +
    '<path d="M26.5 33.5c1.5 3 4 5.5 7 7.5 3.5 2.5 7.5 4 11.5 4.5"/>' +
    '<path d="M45 45.5c2.5-.5 4-2.5 4-5.5v-6"/>' +
    /* borde inferior: corre de la sinfisis a la rama */
    '<path d="M4 36c0 4 2.5 7.5 6.5 9l12 5.5c2.5 1 5.5 1.5 8.5 1"/>' +
    /* la SINFISIS: la union de las dos mitades, al frente */
    '<path d="M6.5 33c1 2.5 1 5.5 0 8"/>' +
    /* === FENESTRA MANDIBULAR: la ventana ovalada === */
    '<path d="M30 37c4 0 6.5 2 6.5 4.5S34 46 30 46s-6.5-2-6.5-4.5S26 37 30 37z"/>' +
    /* === PROCESO CORONOIDE (anterior, arriba) y el ARTICULAR (posterior) === */
    '<path d="M36 39c1-3 3-5 5.5-5.5"/>' +
    '<path d="M45 45.5c1.5 1.5 3.5 2 5 1"/>' +
    /* la ESCOTADURA SIGMOIDEA entre ambos procesos */
    '<path d="M42 34c1.5 1 2.5 2 3 3.5"/>' +
    /* === DENTADURA: homodonta, conica, gruesa, inclinada hacia atras.
       El alveolo de cada diente se marca con su raiz dentro del dentario. */
    '<path d="M9 30.5l1-5.5 1.5 5.5M14 30.5l1.2-6.5 1.8 6.5M20 30.5l1.2-7 1.8 7M26 31l1.3-7 1.7 7M32 32l1.3-6.5 1.7 6.5M38 34l1.2-6 1.8 6"/>' +
    /* la linea del dentario de la que nacen los dientes */
    '<path d="M8 30.5c10-1.5 20-1 32 2.5"/>' +
    /* las raices, visibles dentro del hueso */
    '<path d="M10.5 30.5v4M16.5 30.5v4M22.5 31v4M28.5 31.5v4M34.5 31.5v4"/>' +
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
