/* Verifica que cada figura quede intercalada tras su párrafo (CR-86d). */
"use strict";
var { chromium } = require("/tmp/pwtest/node_modules/playwright-core");
var os = require("os");

(async function () {
  var b = await chromium.launch({
    executablePath: os.homedir() + "/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  var p = await b.newPage();
  var errores = [];
  p.on("pageerror", function (e) { errores.push(e.message); });
  p.on("console", function (m) { if (m.type() === "error") errores.push(m.text()); });

  await p.goto("http://127.0.0.1:8811/ambar.html", { waitUntil: "load", timeout: 30000 });
  await p.waitForTimeout(700);

  var r = await p.evaluate(function () {
    var secs = [].slice.call(document.querySelectorAll("[data-amb-secciones] > section"));
    var total = 0, detalle = [], orden = [];
    secs.forEach(function (sec) {
      var h = sec.querySelector("h2,h3");
      var hijos = [].slice.call(sec.children).filter(function (e) {
        return /^(H2|H3|P|DIV)$/.test(e.tagName);
      });
      var est = hijos.map(function (e) {
        if (e.tagName === "DIV") {
          var n = e.querySelectorAll("img").length;
          [].slice.call(e.querySelectorAll("img")).forEach(function (im) {
            orden.push(im.getAttribute("src").split("/").pop());
          });
          total += n;
          return "IMGS(" + n + ")";
        }
        return e.tagName;
      });
      detalle.push({ seccion: h ? h.textContent.trim() : "?", estructura: est });
    });
    return {
      detalle: detalle, total: total, orden: orden,
      figuras: document.querySelectorAll("figure").length,
      figcaption: document.querySelectorAll("figcaption").length,
      altVacios: [].slice.call(document.querySelectorAll("figure img")).filter(function (im) {
        return im.getAttribute("alt") === "";
      }).length,
      asteriscos: (document.body.innerText.match(/\*/g) || []).length,
      i: document.querySelectorAll("i").length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  });

  r.detalle.forEach(function (d) {
    console.log("[" + d.seccion + "]");
    console.log("   " + d.estructura.join(" · "));
  });
  console.log("\nFiguras totales : " + r.total + " (esperado 11)");
  console.log("Orden en DOM    : " + r.orden.join(" "));
  console.log("figcaption      : " + r.figcaption + " (esperado 0)");
  console.log("alt vacíos      : " + r.altVacios + " (esperado 11)");
  console.log("asteriscos      : " + r.asteriscos);
  console.log("<i> cursivas    : " + r.i);
  console.log("overflow-x      : " + r.overflow);
  console.log("errores JS      : " + (errores.length ? errores.join(" | ") : "ninguno"));

  var esperado = ["01.jpg","02.jpg","03.jpg","04.jpg","05.jpg","06.jpg",
                  "07.jpg","08.jpg","09.jpg","10.jpg","11.jpg"];
  console.log("\n" + (JSON.stringify(r.orden) === JSON.stringify(esperado)
    ? "✔ ORDEN DEL WORD 01→11 INTACTO" : "✘ ORDEN ALTERADO"));

  await b.close();
})();
