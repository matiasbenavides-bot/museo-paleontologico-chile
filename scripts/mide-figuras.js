/* mide-figuras.js — sonda: por que las figuras de trilobites salen recortadas.
   Mide <img> de .tri-fig: natural, pintado, y el recorte real por object-fit.
   Ejecutar:  node scripts/mide-figuras.js [puerto]
   Sin backend: se conecta por CDP al Chrome que ya tenga el usuario. */
const http = require("http");
const PUERTO = process.argv[2] || "8099";

function get(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => res(d));
    }).on("error", rej);
  });
}

(async () => {
  // 1. Leer el CSS SERVIDO (fuente de verdad, no el disco)
  const css = await get(`http://127.0.0.1:${PUERTO}/css/secciones/trilobites.css`);
  const gal = await get(`http://127.0.0.1:${PUERTO}/css/secciones/galeria.css`);

  console.log("=== LO QUE DICE EL CSS SERVIDO ===");
  console.log("trilobites.css tiene CR-60f :", /CR-60f/.test(css));
  console.log("galeria.css  aspect-ratio 1/1:", /aspect-ratio:\s*1\s*\/\s*1/.test(gal));
  console.log("galeria.css  object-fit cover:", /object-fit:\s*cover/.test(gal));

  const m = css.match(/\.tri-fig \.galeria__foto img\s*\{[^}]*\}/);
  console.log("\n=== REGLA QUE NEUTRALIZA EL RECORTE (trilobites.css) ===");
  console.log(m ? m[0].trim() : "  !! NO SE ENCONTRO la regla .tri-fig .galeria__foto img");

  const m2 = css.match(/\.tri-fig__marco img\s*\{[^}]*\}/);
  console.log("\n=== REGLA DE LA IMAGEN DENTRO DEL MARCO ===");
  console.log(m2 ? m2[0].trim() : "  !! NO SE ENCONTRO .tri-fig__marco img");
})().catch((e) => console.error("ERROR:", e.message));
