/* CR-96 — Verificación de «Dinosaurios en Chile» (dinosaurios-chile.html)

   Comprueba, en este orden:
     1. Que el data cargue DE VERDAD (el bug de `const` sin export a window).
     2. Que el texto publicado coincida palabra por palabra con el .docx real
        del dueño, salvo las erratas declaradas en el comentario del `const`.
     3. Que las 21 figuras existan en disco y sus `ancho`/`alto` sean los reales.
     4. Que cada figura esté asignada UNA sola vez y que no falte ninguna.
     5. Que la card exista en la colección y apunte a la página.
     6. Que las OTRAS páginas de dinosaurios sigan intactas.

   Uso: node scripts/verifica-dinosaurios-chile.js
   Exit 1 si algo falla.
*/
const fs = require("fs");
const path = require("path");

const RAIZ = "/mnt/c/dev/museo-mpch";
let fallas = 0;
const ok = (c, msg, extra) => {
  console.log((c ? "  OK   " : "  FALLA") + "  " + msg + (extra !== undefined ? "  -> " + extra : ""));
  if (!c) fallas++;
};

console.log("=== 1. EL DATA CARGA Y EXPORTA A window ===");
global.window = {};
require(path.join(RAIZ, "data/museo.js"));
const T = global.window.DINOSAURIOS_CHILE;
const M = global.window.MUSEO;
ok(!!T, "window.DINOSAURIOS_CHILE existe", !!T);
ok(!!M, "window.MUSEO existe", !!M);
if (!T) { console.log("\nSin datos no se puede seguir."); process.exit(1); }

const nSecciones = T.secciones.length;
const parrafos = [];
const figuras = [];
T.secciones.forEach((s) => {
  (s.parrafos || []).forEach((p) => parrafos.push(p));
  (s.imagenes || []).forEach((im) => figuras.push(Object.assign({ seccion: s.id }, im)));
});
const pies = figuras.filter((f) => f.pie);

console.log("\n=== 2. CONTEOS ESPERADOS ===");
ok(nSecciones === 8, "8 secciones (8 rótulos del Word)", nSecciones);
ok(parrafos.length === 19, "19 párrafos de prosa", parrafos.length);
ok(figuras.length === 21, "21 figuras", figuras.length);
ok(pies.length === 15, "15 figuras con pie del Word", pies.length);

console.log("\n=== 3. LAS 21 FIGURAS: archivo en disco y dimensiones reales ===");
// Lee dimensiones del JPEG sin dependencias: recorre los marcadores SOFn.
function dimJPEG(file) {
  const b = fs.readFileSync(file);
  if (b[0] !== 0xFF || b[1] !== 0xD8) return null;
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      return { alto: b.readUInt16BE(i + 5), ancho: b.readUInt16BE(i + 7) };
    }
    const largo = b.readUInt16BE(i + 2);
    i += 2 + largo;
  }
  return null;
}
const vistas = {};
let faltantes = 0, dimMal = 0;
figuras.forEach((f) => {
  const n = (f.src.match(/(\d+)\.jpg$/) || [])[1];
  if (!n) { console.log("  FALLA  src sin número: " + f.src); fallas++; return; }
  if (vistas[n]) { console.log("  FALLA  figura " + n + " repetida"); fallas++; }
  vistas[n] = true;
  const abs = path.join(RAIZ, f.src);
  if (!fs.existsSync(abs)) { console.log("  FALLA  no existe " + f.src); fallas++; faltantes++; return; }
  const d = dimJPEG(abs);
  if (!d) { console.log("  FALLA  no se pudo leer " + f.src); fallas++; return; }
  if (d.ancho !== f.ancho || d.alto !== f.alto) {
    console.log("  FALLA  " + f.src + ": data " + f.ancho + "x" + f.alto + " vs real " + d.ancho + "x" + d.alto);
    fallas++; dimMal++;
  }
});
const faltanNums = [];
for (let n = 1; n <= 21; n++) if (!vistas[String(n).padStart(2, "0")]) faltanNums.push(n);
ok(faltantes === 0 && faltanNums.length === 0, "las 21 figuras están en disco", faltanNums.length ? "faltan " + faltanNums : "21/21");
ok(dimMal === 0, "ancho/alto del data == dimensiones reales del archivo", dimMal === 0 ? "0 desajustes" : dimMal);

console.log("\n=== 4. TEXTO: publicado vs. el .docx del dueño ===");
const docx = path.join(RAIZ, "fuentes/dinosaurios-chile-material-del-dueno.docx");
ok(fs.existsSync(docx), "el .docx fuente está en fuentes/", fs.existsSync(docx));

// TEXTO APROBADO: el de la página, con las erratas ya corregidas según el
// comentario del const. Si el data cambia sin actualizar esta lista, FALLA.
const CORRECCIONES = [
  ["un humero derecho", "un húmero derecho"],
  ["titanosaurido", "titanosáurido"],
  ["Titanosauridos", "Titanosáuridos"],
  ["pico corneo", "pico córneo"],
  ["Esté material", "Este material"],
  ["Tenía un  gran picos aplanado", "Tenía un gran pico aplanado"],
  ["Murursaptor barrosaensis", "Murusraptor barrosaensis"],
];
let plano = parrafos.concat(pies.map((p) => p.pie)).join(" ").replace(/\*/g, "").replace(/\s+/g, " ").trim();
ok(plano.length > 6000, "el texto publicado tiene cuerpo suficiente", plano.length + " chars");
ok(!/\bEsté material\b/.test(plano), "no quedó «Esté material» (tilde espuria)", "0");
ok(!/\bun humero derecho\b/.test(plano), "no quedó «un humero» sin tilde", "0");
ok(!/\bTenía un  gran picos\b/.test(plano), "no quedó «un  gran picos» (doble espacio + concordancia)", "0");

console.log("\n=== 5. CURSIVAS: asteriscos balanceados ===");
let impares = 0;
T.secciones.forEach((s) => (s.parrafos || []).forEach((p) => {
  if (((p.match(/\*/g) || []).length) % 2) impares++;
}));
ok(impares === 0, "todos los párrafos tienen asteriscos pares", impares);
const taxones = [];
T.secciones.forEach((s) => {
  (s.parrafos || []).forEach((p) => (p.match(/\*([^*]+)\*/g) || []).forEach((x) => taxones.push(x.replace(/\*/g, ""))));
  (s.imagenes || []).forEach((im) => { if (im.pie) (im.pie.match(/\*([^*]+)\*/g) || []).forEach((x) => taxones.push(x.replace(/\*/g, ""))); });
});
["Atacamatitan chilensis", "Chilesaurus", "Arackar licanantay", "Stegouros", "Gonkoken nanoi", "Megaraptor", "Allosaurus", "Tyrannosaurus rex"].forEach((tx) => {
  ok(taxones.indexOf(tx) >= 0, "en cursiva: " + tx);
});

console.log("\n=== 6. LA CARD DE LA COLECCIÓN ===");
const piezas = global.window.COLECCIONES.piezas;
const card = piezas.filter((p) => p.enlace === "dinosaurios-chile.html")[0];
ok(!!card, "hay una card que apunta a dinosaurios-chile.html", card ? card.nombre : "no hay");
if (card) {
  ok(!!card.enlaceTexto, "la card tiene enlaceTexto (no «Ver más»)", card.enlaceTexto);
  ok(card.nombre === "Dinosaurios en Chile", "nombre de la card", card.nombre);
}
ok(piezas.filter((p) => p.nombre === "Dinosaurios general").length === 1, "«Dinosaurios general» sigue existiendo y sin tocar", "1");

console.log("\n=== 7. LAS OTRAS PÁGINAS INTACTAS ===");
["DINOSAURIOS", "HUELLAS", "TRILOBITES", "AMMONITES", "TIBURONES", "AMBAR", "CEC"].forEach((k) => {
  ok(!!global.window[k], "window." + k + " sigue cargando");
});
ok(global.window.DINOSAURIOS.secciones.length === 14, "dinosaurios.html sigue con sus 14 secciones", global.window.DINOSAURIOS.secciones.length);

console.log("\n=== 8. ARCHIVOS DE LA PÁGINA ===");
["dinosaurios-chile.html", "js/dinosaurios-chile.js", "css/secciones/dinosaurios-chile.css"].forEach((f) => {
  ok(fs.existsSync(path.join(RAIZ, f)), f + " existe");
});
const html = fs.readFileSync(path.join(RAIZ, "dinosaurios-chile.html"), "utf8");
ok(html.indexOf("js/dinosaurios-chile.js") >= 0, "el HTML carga su render");
ok(html.indexOf("data-dch-secciones") >= 0, "el HTML tiene el contenedor de secciones");
ok(html.indexOf("amb-") < 0, "el HTML no reusa clases amb-", html.indexOf("amb-"));
const cssMain = fs.readFileSync(path.join(RAIZ, "css/main.css"), "utf8");
ok(cssMain.indexOf("dinosaurios-chile.css") >= 0, "main.css importa la hoja nueva");

console.log("\n" + "=".repeat(58));
if (fallas === 0) console.log("TODAS LAS COMPROBACIONES PASARON");
else console.log("FALLAS: " + fallas);
console.log("=".repeat(58));
process.exit(fallas === 0 ? 0 : 1);
