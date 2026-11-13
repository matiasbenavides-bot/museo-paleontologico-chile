// Busca PÁRRAFOS REPETIDOS en todas las colecciones de data/museo.js.
//
// Lección (CR-114): las secciones NO viven en COLECCIONES.piezas (ahí sólo hay
// las tarjetas: nombre/enlace/arte/icono). Viven en cada constante de capítulo:
// TRILOBITES, AMMONITES, TIBURONES, AMBAR, DINOSAURIOS, DINOSAURIOS_CHILE,
// PTEROSAURIOS, REPTILES, HUELLAS. Un barrido que mire COLECCIONES encuentra
// CERO y parece "todo limpio" — un falso verde.
const fs = require('fs'), vm = require('vm');

const RUTA = '/mnt/c/dev/museo-mpch/data/museo.js';
const src = fs.readFileSync(RUTA, 'utf8');
const ctx = { window: {}, document: {}, console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);

const NO_SON_CAPITULOS = ['COLECCIONES', 'MUSEO', 'QUIENES_SOMOS', 'SERVICIOS',
  'MUSEO_ITINERANTE', 'GALERIA', 'CEC', 'CEC_SUBPAGINA', 'ENTIDADES',
  'SERVICIOS_NOTA', 'window', 'document', 'console', 'globalThis'];

const norm = s => String(s).replace(/\s+/g, ' ').trim().toLowerCase();
const corto = s => s.length > 92 ? s.slice(0, 92) + '…' : s;

let totalParrafos = 0, repetidos = 0, seccionesVistas = 0;
const capitulos = [];

for (const k of Object.keys(ctx)) {
  if (NO_SON_CAPITULOS.includes(k)) continue;
  const v = ctx[k];
  if (!v || typeof v !== 'object') continue;
  if (!Array.isArray(v.secciones)) { continue; }   // sólo capítulos de verdad
  capitulos.push(k);
  const mapa = new Map();

  (function rec(lista, ruta) {
    if (!Array.isArray(lista)) return;
    for (const s of lista) {
      if (!s || typeof s !== 'object') continue;
      seccionesVistas++;
      const camino = `${ruta} › ${s.titulo || s.id || '(sin título)'}`;
      (s.parrafos || []).forEach((p, i) => {
        totalParrafos++;
        const n = norm(p);
        if (n.length < 40) return;                  // frases cortas: se ignoran
        if (!mapa.has(n)) mapa.set(n, { txt: p, copias: [] });
        mapa.get(n).copias.push(`${camino}  [párrafo ${i}]`);
      });
      if (s.secciones) rec(s.secciones, camino);
    }
  })(v.secciones, k);

  const hits = [...mapa.values()].filter(x => x.copias.length > 1);
  if (hits.length) {
    console.log(`\n=== ${k} ===`);
    for (const h of hits) {
      repetidos++;
      console.log(`  repetido ${h.copias.length}×: "${corto(h.txt)}"`);
      h.copias.forEach(c => console.log(`      ${c}`));
    }
  }
}

console.log(`\n--- CAPÍTULOS REVISADOS (${capitulos.length}) ---`);
console.log('  ' + capitulos.join(', '));
console.log(`  secciones: ${seccionesVistas} · párrafos: ${totalParrafos}`);
console.log(repetidos === 0
  ? '\nRESULTADO: 0 párrafos repetidos'
  : `\nRESULTADO: ${repetidos} párrafo(s) repetido(s)`);
process.exit(repetidos === 0 ? 0 : 1);
