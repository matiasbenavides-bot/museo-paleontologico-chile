/* Renderiza cada página en Chromium headless y mide las cursivas en el DOM real.
   Uso: node scripts/medir-cursivas-dom.js                                    */
"use strict";
var { chromium } = require("/tmp/pwtest/node_modules/playwright-core");

var PAGINAS = [
  "index.html", "amonites.html", "tiburones.html", "trilobites.html",
  "ambar.html", "proyecto-cec.html", "curriculum.html"
];
var BASE = "http://127.0.0.1:8811/";

(async function () {
  var browser = await chromium.launch({ executablePath: require('os').homedir()+'/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome', args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  var page = await browser.newPage();
  var errores = [];
  page.on("pageerror", function (e) { errores.push(e.message); });
  page.on("console", function (m) { if (m.type() === "error") errores.push("console: " + m.text()); });

  for (var i = 0; i < PAGINAS.length; i++) {
    var p = PAGINAS[i];
    errores.length = 0;
    await page.goto(BASE + p, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(600);

    var r = await page.evaluate(function () {
      var is = [].slice.call(document.querySelectorAll("i"));
      var estilos = {};
      is.forEach(function (e) {
        var fs = getComputedStyle(e).fontStyle;
        estilos[fs] = (estilos[fs] || 0) + 1;
      });
      var txt = document.body.innerText;
      var figs = [].slice.call(document.querySelectorAll("figure"));
      return {
        TEXTO_cargado: typeof window.TEXTO !== "undefined",
        i: is.length,
        textos: is.map(function (e) { return e.textContent; }),
        estilos: estilos,
        asteriscos: (txt.match(/\*/g) || []).length,
        i_literal: txt.indexOf("<i>") >= 0,
        figuras: figs.length,
        figcaption: document.querySelectorAll("figcaption").length,
        alt_vacios: figs.filter(function (f) {
          var im = f.querySelector("img");
          return im && im.getAttribute("alt") === "";
        }).length,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });

    console.log("\n=== " + p);
    console.log("  TEXTO cargado : " + r.TEXTO_cargado);
    console.log("  <i> en DOM    : " + r.i + "   estilos: " + JSON.stringify(r.estilos));
    console.log("  asteriscos    : " + r.asteriscos + "   <i> literal: " + r.i_literal);
    if (r.figuras) {
      console.log("  figuras       : " + r.figuras + "  figcaption: " + r.figcaption +
                  "  alt vacios: " + r.alt_vacios);
    }
    console.log("  overflow-x    : " + r.overflow);
    console.log("  errores JS    : " + (errores.length ? errores.join(" | ") : "ninguno"));
    if (r.textos.length) console.log("  nombres       : " + r.textos.join(", "));
  }

  await browser.close();
})();
