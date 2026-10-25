/* Mide estilo de cursiva en párrafos, pies y títulos. */
"use strict";
var { chromium } = require("/tmp/pwtest/node_modules/playwright-core");
var os = require("os");

(async function () {
  var b = await chromium.launch({
    executablePath: os.homedir() + "/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  var p = await b.newPage();
  var casos = [
    ["ambar.html", ".amb-sec p i"],
    ["ambar.html", ".amb-sec__t i"],
    ["amonites.html", ".amo-sec p i"],
    ["amonites.html", ".amo-fig figcaption i"],
    ["tiburones.html", ".tib-sec p i"],
    ["tiburones.html", ".tib-fig figcaption i"],
    ["tiburones.html", ".tib-sec__t i"],
    ["trilobites.html", ".tri-sec p i"],
    ["trilobites.html", ".tri-fig figcaption i"]
  ];
  var visto = {};
  for (var i = 0; i < casos.length; i++) {
    var pag = casos[i][0], sel = casos[i][1];
    if (visto[pag] === undefined) {
      await p.goto("http://127.0.0.1:8811/" + pag, { waitUntil: "load", timeout: 30000 });
      await p.waitForTimeout(400);
      visto[pag] = 1;
    }
    var r = await p.evaluate(function (s) {
      var els = [].slice.call(document.querySelectorAll(s));
      return {
        n: els.length,
        estilos: els.map(function (e) { return getComputedStyle(e).fontStyle; })
          .filter(function (v, k, a) { return a.indexOf(v) === k; }),
        muestra: els.slice(0, 2).map(function (e) { return e.textContent; })
      };
    }, sel);
    console.log(pag.padEnd(18) + sel.padEnd(28) + " n=" + r.n +
                "  estilos=" + JSON.stringify(r.estilos) +
                (r.muestra.length ? "  [" + r.muestra.join(" / ") + "]" : ""));
  }
  await b.close();
})();
