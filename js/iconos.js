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

  /* TRILOBITE — vista dorsal.
     Anatomia correcta: cefalon (escudo cefalico) con glabela y ojos,
     torax con segmentos y lobulos pleurales, pigidio (cola) con anillo.
     Simetria bilateral sobre el eje central; los lobulos laterales se
     curvan hacia atras, que es la firma del trilobite. */
  trilobite: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* contorno del cuerpo */
    '<path d="M32 5c7 0 12 4 13 9 .8 4 .8 8 .8 13s0 9-.8 13c-1 5-6 9-13 9s-12-4-13-9c-.8-4-.8-8-.8-13s0-9 .8-13C19 9 25 5 32 5z"/>' +
    /* cefalon: sutura que lo separa del torax */
    '<path d="M19 20c6 2.5 20 2.5 26 0"/>' +
    /* glabela (lobulo central de la cabeza) */
    '<path d="M32 7.5c-3.5 0-5.5 3.5-5.5 7s2 5.5 5.5 5.5 5.5-2 5.5-5.5-2-7-5.5-7z"/>' +
    /* ojos compuestos, a cada lado de la glabela */
    '<path d="M23.5 12.5c1.8-.8 3.2-.4 3.8 1.2M40.5 12.5c-1.8-.8-3.2-.4-3.8 1.2"/>' +
    /* torax: segmentos pleurales (van del eje hacia afuera y atras) */
    '<path d="M32 24v14"/>' +
    '<path d="M20 26c8 1.5 16 1.5 24 0M20 31c8 1.5 16 1.5 24 0M20 36c8 1.5 16 1.5 24 0"/>' +
    /* lobulos pleurales con su curvatura hacia atras, uno por lado por segmento */
    '<path d="M20 26c-2 1.5-3 3-2.5 5M44 26c2 1.5 3 3 2.5 5M20 31c-2 1.5-3 3-2.5 5M44 31c2 1.5 3 3 2.5 5M20.5 36c-1.8 1.4-2.6 2.8-2.2 4.6M43.5 36c1.8 1.4 2.6 2.8 2.2 4.6"/>' +
    /* pigidio (cola) con su anillo y su borde */
    '<path d="M20.5 44c7.5 2 15.5 2 23 0"/>' +
    '<path d="M23 49c5.5 2.5 12.5 2.5 18 0"/>' +
    '</svg>',

  /* AMMONITE — concha en espiral logaritmica con camaras y septos.
     Anatomia correcta: espiral que crece hacia afuera, linea de septos
     (las suturas entre camaras) y abertura en el extremo exterior. */
  ammonite: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* espiral externa: arranca en la abertura (arriba-derecha) y gira hacia el centro */
    '<path d="M47 21c6 6 8 15 4 24-4 9-14 14-24 12C16 55 8 44 9.5 32 11 19 22 10 34 11c9 .7 16 7 17 16 1 7-3.5 13.5-10.5 14.5-6 .9-11.5-3-12.5-9-1-5 2.5-9.5 7.5-10 4-.4 7.5 2.4 7.7 6.4"/>' +
    /* abertura de la concha, en el extremo exterior */
    '<path d="M47 21c-1.5-2.5-4-4.2-6.6-4.6"/>' +
    /* septos: suturas entre camaras, radiando desde el centro */
    '<path d="M46.5 26.5l5.2 4M44 33l6.5 3M39 38.5l6 5M32.5 42l4.5 6.5M25 43.5l2.5 7M18 41.5l.5 7"/>' +
    /* borde exterior de la concha */
    '<path d="M51.5 45.5c-3.5 7.5-11.5 12-19.5 11.5"/>' +
    '</svg>',

  /* AMBAR — resina fosil amorfa con una inclusion (insecto atrapado).
     No es geometrico: la resina tiene borde irregular y brillo interior. */
  ambar: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* contorno irregular de la gota de resina */
    '<path d="M32 6c9 0 17 6 19 16 2 9 1 19-5 26-5 6-13 9-20 6-8-3-13-11-13-20C13 20 20 6 32 6z"/>' +
    /* brillo interior (la resina es translucida) */
    '<path d="M22 20c3-5 8-8 13-8"/>' +
    /* INSECTO atrapado: cuerpo, cabeza, patas y alas */
    '<path d="M32 30c2.5 0 4 2 4 4.5s-1.5 4.5-4 4.5-4-2-4-4.5 1.5-4.5 4-4.5z"/>' +
    '<path d="M32 27.5v-3M28.5 26l-3-3M35.5 26l3-3"/>' +
    /* patas, tres por lado */
    '<path d="M28.5 33l-5 2M28.3 36l-5 5M28.8 39l-3 6M35.5 33l5 2M35.7 36l5 5M35.2 39l3 6"/>' +
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

  /* HUESO Y HUEVO DE DINOSAURIO — las dos piezas en un solo icono,
     porque el museo las expone juntas.
     Hueso: epifisis (extremos) mas anchas que la diafisis (cuerpo).
     Huevo: ovalo con cascara agrietada, propio de un nido fosilizado. */
  hueso: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* HUESO largo, abajo-izquierda: cuerpo mas angosto en el centro */
    '<path d="M8 46c-2.5-2.5-2.5-6 0-8s6-1.5 7.5 1l8-6c-1-2.5.5-5.5 3-6.5s5.5.5 6.5 3l6-4c-1-2.5.5-5.5 3-6.5s5.5.5 6.5 3c2.5 1.5 3.5 4.5 2 7s-4.5 3.5-7 2.5l-6 4c1 2.5-.5 5.5-3 6.5s-5.5-.5-6.5-3l-6 4c1 2.5-.5 5.5-3 6.5s-5.5-.5-6.5-3z"/>' +
    /* HUEVO, arriba-derecha: ovalo */
    '<path d="M46 10c5.5 0 9 4.5 9 10s-4 9.5-9 9.5-9-4-9-9.5 3.5-10 9-10z"/>' +
    /* cascara agrietada */
    '<path d="M41 15l3 2-2 2.5 3 2M51 14l-2.5 2 2 2.5-2.5 2"/>' +
    '</svg>',

  /* RECONSTRUCCION — esqueleto montado en sala, que es lo que hace el museo.
     Anatomia correcta: craneo, columna vertebral con vertebras, costillas
     y patas. Antes esto era una estrella de 5 puntas. */
  recon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    /* craneo, a la izquierda, con mandibula */
    '<path d="M10 22c0-4 3-7 7-7h4c4 0 7 3 7 7v3c0 3-2 5-5 5h-2l-3 4-2-4c-4 0-6-2-6-5z"/>' +
    '<path d="M13 25c2 1.5 5 1.5 7 0"/>' +
    /* columna vertebral: cervical a caudal, con vertebras marcadas */
    '<path d="M28 21c7 1 13 4 18 9s8 11 9 18"/>' +
    '<path d="M33 23.5l-1-4M38 27l-1-4M43 32l-1-4M47.5 38l-1-4M51 45l-1-4"/>' +
    /* costillas, cuatro pares, curvando hacia abajo */
    '<path d="M31 24c1 5 .5 10-2 14M36 27c1.5 5 1 10-1.5 14M41 31c1.5 4.5 1.5 9 0 13M45.5 36c1.5 4 1.5 8.5.5 12"/>' +
    /* pata trasera: femur, tibia y pie */
    '<path d="M50 44c2 4 3 8 3.5 12M48 45c-1 5-1.5 9-1 13"/>' +
    '<path d="M46 58h6"/>' +
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
