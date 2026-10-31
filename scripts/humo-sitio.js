/* Sonda de humo para TODAS las páginas del sitio: overflow horizontal, errores
   JS, imágenes rotas y que cada página pinte lo suyo. No mide clases concretas
   (cada subpágina tiene su prefijo), mide el resultado.

   Uso: node scripts/humo-sitio.js <base-url>
*/
const { chromium } = require("playwright-core");

const BASE = process.argv[2] || "http://127.0.0.1:8899";
const PAGS = [
  "index.html", "curriculum.html", "proyecto-cec.html", "trilobites.html",
  "amonites.html", "tiburones.html", "ambar.html", "dinosaurios.html",
];
const ANCHOS = [360, 768, 1280];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/home/logicforgex/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
  });
  const page = await browser.newPage();
  const filas = [];
  for (const p of PAGS) {
    const errores = [];
    const onErr = (e) => errores.push(e.message);
    page.on("pageerror", onErr);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(BASE + "/" + p, { waitUntil: "networkidle" });
    const base = await page.evaluate(() => {
      const imgs = Array.prototype.slice.call(document.querySelectorAll("img"));
      return {
        titulo: document.title.slice(0, 46),
        imgs: imgs.length,
        rotas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        textos: document.body.innerText.trim().length,
        h1: (document.querySelector("h1") || {}).textContent || "",
      };
    });
    const anchos = [];
    for (const w of ANCHOS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(280);
      anchos.push(
        await page.evaluate(() => (document.documentElement.scrollWidth > window.innerWidth + 1 ? "DESBORDE" : "ok"))
      );
    }
    filas.push({ p, ...base, anchos: anchos.join("/"), errores: errores.length });
    page.off("pageerror", onErr);
  }
  console.log("pagina".padEnd(20), "imgs".padStart(5), "rotas".padStart(6), "texto".padStart(7), "360/768/1280".padEnd(18), "errores", "  titulo");
  filas.forEach((f) =>
    console.log(
      f.p.padEnd(20),
      String(f.imgs).padStart(5),
      String(f.rotas).padStart(6),
      String(f.textos).padStart(7),
      f.anchos.padEnd(18),
      String(f.errores).padStart(7),
      " ",
      f.titulo
    )
  );
  /* CR-89: la columna `texto` NO es informativa, es un VEREDICTO. Una página
     servida con 0 caracteres está EN BLANCO aunque el HTTP sea 200 — así se
     publicaron 5 páginas vacías el 2026-10-29 sin que la tabla lo gritara. */
  const rotas = filas.filter((f) => f.textos === 0 || f.rotas > 0 || f.errores > 0 || f.anchos.includes("DESBORDE"));
  if (rotas.length) {
    console.error("\n*** FALLA: " + rotas.length + " página(s) con problema ***");
    rotas.forEach((f) => console.error("   " + f.p + " texto=" + f.textos + " rotas=" + f.rotas + " errores=" + f.errores));
    await browser.close();
    process.exit(1);
  }
  console.log("\nOK: 8/8 páginas con contenido, 0 errores, 0 rotas, 0 desborde");
  await browser.close();
})().catch((e) => { console.error("FALLO:", e.message); process.exit(1); });
