/* Sonda de verificación de una subpágina del MPCH — DOM real, Chromium headless.
   Mide sin suponer: cursivas, asteriscos, figuras, alt, orden en DOM, estructura
   por sección, overflow, errores JS, lazy en dos pasadas y responsive.

   Uso:
     NODE_PATH=/tmp/pwtest/node_modules node scripts/medir-dom.js <url> [prefijo]
*/
const { chromium } = require("playwright-core");

const URL_ = process.argv[2];
const PREF = process.argv[3] || "amb";
const ANCHOS = [360, 375, 414, 768, 1024, 1280];

(async () => {
  let browser;
  for (const ch of [
    process.env.CHROME_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
    "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter(Boolean)) {
    try { browser = await chromium.launch({ executablePath: ch }); break; } catch (e) {}
  }
  if (!browser) { try { browser = await chromium.launch({ channel: "msedge" }); } catch (e) {} }
  if (!browser) { console.error("NO SE PUDO LANZAR CHROMIUM"); process.exit(2); }

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errores = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errores.push("console: " + m.text()); });

  await page.goto(URL_, { waitUntil: "networkidle" });

  const base = await page.evaluate((P) => {
    const q = (s) => Array.prototype.slice.call(document.querySelectorAll(s));
    const figs = q("." + P + "-fig");
    const imgs = q("." + P + "-fig img");
    const parr = q("." + P + "-sec p");
    const vistos = new Set(), dup = [];
    parr.forEach((p) => {
      const t = p.textContent.trim();
      if (vistos.has(t)) dup.push(t.slice(0, 60));
      vistos.add(t);
    });
    const estructura = q("." + P + "-sec").map((s) => {
      const partes = [];
      Array.prototype.forEach.call(s.children, (c) => {
        if (/^H[23]$/.test(c.tagName)) partes.push(c.tagName);
        else if (c.tagName === "P") partes.push("P");
        else if (c.classList.contains(P + "-figs")) {
          partes.push("IMGS(" + c.querySelectorAll("figure").length + ")");
        }
      });
      return {
        id: s.id,
        n: s.querySelectorAll("p").length,
        figuras: s.querySelectorAll("figure").length,
        orden: partes.join(" · "),
      };
    });
    const textoPlano = document.body.innerText;
    return {
      titulo: document.title,
      h1: (document.querySelector("h1") || {}).textContent,
      secciones: q("." + P + "-sec").length,
      parrafos: parr.length,
      figuras: figs.length,
      imgs: imgs.length,
      iRender: q("." + P + "-sec i, ." + P + "-fig figcaption i, ." + P + "-sec__t i").length,
      iItalic: q("." + P + "-sec i, ." + P + "-fig figcaption i, ." + P + "-sec__t i")
        .filter((e) => getComputedStyle(e).fontStyle === "italic").length,
      asteriscosVisibles: (textoPlano.match(/\*/g) || []).length,
      iEscapados: (textoPlano.match(/<i>/g) || []).length,
      altVacios: imgs.filter((i) => i.getAttribute("alt") === "").length,
      altSin: imgs.filter((i) => !i.hasAttribute("alt")).length,
      altConTexto: imgs.filter((i) => (i.getAttribute("alt") || "").length > 0).length,
      figcaption: q("." + P + "-fig figcaption").length,
      ordenDOM: imgs.map((i) => (i.getAttribute("src") || "").split("/").pop()),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      anchoDoc: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
      dup,
      estructura,
      indice: q("." + P + "-indice__l li").length,
      cierre: !!document.querySelector("." + P + "-cierre a"),
    };
  }, PREF);

  // lazy: primera pasada a scrollY 0
  const lazy0 = await page.evaluate((P) => {
    const imgs = Array.prototype.slice.call(document.querySelectorAll("." + P + "-fig img"));
    return {
      total: imgs.length,
      cargadas: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
    };
  }, PREF);

  // segunda pasada: scrollear hasta el fondo
  const lazyFin = await page.evaluate(
    (P) =>
      new Promise((res) => {
        let y = 0;
        const paso = () => {
          y += 700;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(paso, 90);
          else
            setTimeout(() => {
              const imgs = Array.prototype.slice.call(document.querySelectorAll("." + P + "-fig img"));
              res({
                total: imgs.length,
                cargadas: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
                fallidas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
                naturales: imgs.map((i) => i.naturalWidth + "x" + i.naturalHeight),
                declarados: imgs.map((i) => i.getAttribute("width") + "x" + i.getAttribute("height")),
              });
            }, 1200);
        };
        paso();
      }),
    PREF
  );

  // responsive
  const resp = [];
  for (const w of ANCHOS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(350);
    const r = await page.evaluate(
      (P) => {
        const imgs = Array.prototype.slice.call(document.querySelectorAll("." + P + "-fig img"));
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          corte: imgs.filter((i) => i.getBoundingClientRect().width > i.parentElement.getBoundingClientRect().width + 2).length,
          asteriscos: (document.body.innerText.match(/\*/g) || []).length,
        };
      },
      PREF
    );
    resp.push({ ancho: w, ...r });
  }

  const out = { url: URL_, errores, base, lazy0, lazyFin, resp };
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})().catch((e) => {
  console.error("FALLO LA SONDA:", e.message);
  process.exit(1);
});
