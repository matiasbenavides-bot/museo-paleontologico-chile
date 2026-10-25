/* Responsive de ámbar tras CR-86d. */
"use strict";
var { chromium } = require("/tmp/pwtest/node_modules/playwright-core");
var os = require("os");

(async function () {
  var b = await chromium.launch({
    executablePath: os.homedir() + "/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  var p = await b.newPage();
  var anchos = [360, 375, 414, 768, 1024, 1280];
  for (var a = 0; a < anchos.length; a++) {
    await p.setViewportSize({ width: anchos[a], height: 800 });
    await p.goto("http://127.0.0.1:8811/ambar.html", { waitUntil: "load", timeout: 30000 });
    await p.waitForTimeout(600);
    var r = await p.evaluate(function () {
      var figs = [].slice.call(document.querySelectorAll("figure"));
      return {
        sw: document.documentElement.scrollWidth,
        iw: window.innerWidth,
        figs: figs.length,
        // ¿alguna figura más angosta o más alta que su marco?
        recortadas: figs.filter(function (f) {
          var im = f.querySelector("img"), m = f.querySelector(".amb-fig__marco");
          if (!im || !m) return false;
          var a = im.getBoundingClientRect(), b2 = m.getBoundingClientRect();
          return a.width > b2.width + 1.5 || a.height > b2.height + 1.5;
        }).length,
        // ¿alguna figura más ancha que su columna de texto?
        desbordan: figs.filter(function (f) {
          return f.getBoundingClientRect().right > window.innerWidth + 1;
        }).length,
        cargadas: figs.filter(function (f) {
          var im = f.querySelector("img");
          return im && im.complete && im.naturalWidth > 0;
        }).length
      };
    });
    console.log(String(anchos[a]).padStart(5) + "px  scrollW=" + String(r.sw).padStart(5) +
      " innerW=" + String(r.iw).padStart(5) +
      "  figs=" + r.figs + "  cargadas=" + r.cargadas +
      "  recortadas=" + r.recortadas + "  desbordan=" + r.desbordan +
      (r.sw > r.iw + 1 ? "   ✘ OVERFLOW" : "   ok"));
  }
  await b.close();
})();
