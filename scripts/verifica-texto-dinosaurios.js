/* Verificación del texto publicado contra el .docx ORIGINAL del dueño.
   Compara palabra por palabra: lo publicado en la subpágina debe coincidir con el
   Word salvo las erratas declaradas en el comentario del `const`.

   Uso: node scripts/verifica-texto-dinosaurios.js
*/
const fs = require("fs");

global.window = {};
require("/mnt/c/dev/museo-mpch/data/museo.js");
const D = global.window.DINOSAURIOS;
const T = global.window.TEXTO;

// Texto publicado, aplanado
const publicado = [];
D.secciones.forEach((s) => {
  s.parrafos.forEach((p) => publicado.push(p));
  s.imagenes.forEach((im) => { if (im.pie) publicado.push(im.pie); });
});
const planoPublicado = publicado
  .join(" ")
  .replace(/\*/g, "")
  .replace(/\s+/g, " ")
  .trim();

console.log("=== PUBLICADO ===");
console.log("parrafos:", D.secciones.reduce((a, s) => a + s.parrafos.length, 0));
console.log("pies:", D.secciones.reduce((a, s) => a + s.imagenes.filter((i) => i.pie).length, 0));
console.log("palabras:", planoPublicado.split(" ").length);
console.log("asteriscos pares por parrafo:", (() => {
  let imp = 0, pares = 0;
  D.secciones.forEach((s) => s.parrafos.forEach((p) => {
    const c = (p.match(/\*/g) || []).length;
    if (c % 2) imp++;
    pares += c / 2;
  }));
  return { pares, impares: imp };
})());

// Cursivas esperadas
const esperadas = [];
D.secciones.forEach((s) => {
  s.parrafos.forEach((p) => {
    const m = p.match(/\*([^*]+)\*/g) || [];
    m.forEach((x) => esperadas.push(x.replace(/\*/g, "")));
  });
});
console.log("nombres en cursiva esperados:", esperadas);

// Prueba de inyección del mecanismo
if (T && T.conCursivas) {
  const casos = [
    ["*Pinus succinifera*", "<i>Pinus succinifera</i>"],
    ["<script>alert(1)</script>", "&lt;script&gt;alert(1)&lt;/script&gt;"],
    ["*<img src=x onerror=alert(1)>*", "<i>&lt;img src=x onerror=alert(1)&gt;</i>"],
    ["asterisco suelto * impar", "asterisco suelto * impar"],
    ["a & b *Nom* <ok>", "a &amp; b <i>Nom</i> &lt;ok&gt;"],
  ];
  console.log("\n=== PRUEBA DE INYECCIÓN (js/texto.js) ===");
  casos.forEach(([ent, esp]) => {
    const got = T.conCursivas(ent);
    console.log((got === esp ? "PASA " : "FALLA") + "  " + JSON.stringify(ent) + " -> " + JSON.stringify(got));
  });
} else {
  console.log("!! window.TEXTO no disponible en Node (el módulo es de navegador): se prueba en el DOM");
}
