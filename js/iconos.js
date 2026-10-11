/* ============================================================
   MPCH — Iconos SVG (trazo, sin dependencias)
   ============================================================ */
const ICONOS = {
  trilobite: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="24" cy="24" rx="10" ry="17"/><path d="M14 15h20M14 21h20M14 27h20M14 33h20"/><path d="M24 7v34"/></svg>',
  ammonite: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M24 8c9 0 16 7 16 16s-7 16-16 16S8 33 8 24 15 8 24 8z"/><path d="M24 15c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z"/><path d="M24 21c2 0 3 1 3 3s-1 3-3 3-3-1-3-3 1-3 3-3z"/></svg>',
  ambar: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5l14 9v20l-14 9-14-9V14z"/><path d="M24 16l6 4v9l-6 4-6-4v-9z"/></svg>',
  tiburon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 30c8-10 22-14 34-10-6 8-20 14-34 10z"/><path d="M20 20l4-9 5 12"/><path d="M12 33l-3 8M20 34l-2 8M28 34l2 8"/></svg>',
  hueso: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14a4 4 0 100-8 4 4 0 000 8zM34 14a4 4 0 100-8 4 4 0 000 8z"/><path d="M12 10l24 28M36 10L12 38"/></svg>',
  recon: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6l4 8 9 1-6 7 2 9-9-4-9 4 2-9-6-7 9-1z"/><path d="M18 36h12M24 34v8"/></svg>',
  museo: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L24 6l18 12"/><path d="M10 20v16M19 20v16M29 20v16M38 20v16"/><path d="M6 40h36"/></svg>',
  terreno: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" transform="translate(0,4)"/><path d="M8 44h32"/></svg>',
  colegio: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20v22h32V20"/><path d="M4 20L24 8l20 12z"/><path d="M18 42V30h12v12"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-6.5 8-12a8 8 0 10-16 0c0 5.5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  metro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/></svg>',
  telefono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/></svg>',
  correo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 7l10 7 10-7"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A8.4 8.4 0 1112 20.4a8.5 8.5 0 01-4.1-1.1L3 21z"/><path d="M8.6 8.2c.3-.1.6 0 .8.3l.9 1.4c.1.3.1.5-.1.7l-.6.6c-.2.2-.2.4-.1.6.5.9 1.3 1.6 2.2 2.1.2.1.5.1.6-.1l.6-.6c.2-.2.4-.3.7-.1l1.4.9c.3.2.4.5.3.8-.2.9-1.1 1.6-2.1 1.5-3-.3-5.6-2.9-5.9-5.9-.1-1 .6-1.9 1.4-2.2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>'
};
if (typeof window !== "undefined") window.ICONOS = ICONOS;
