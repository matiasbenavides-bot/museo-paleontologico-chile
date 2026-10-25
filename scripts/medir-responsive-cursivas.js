/* Verifica overflow horizontal y cursivas a 375 / 768 / 1280 px. */
"use strict";
var { chromium } = require("/tmp/pwtest/node_modules/playwright-core");
var os = require("os");

var PAGS = ["index.html", "amonites.html", "tiburones.html", "trilobites.html",
            "ambar.html", "proyecto-cec.html", "curriculum.html"];
var ANCHOS = [375, 768, 1280];

(async function () {
  var b = await chromium.launch({
    executablePath: os.homedir() + "/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"]
  });
  var p = await b.newPage();
  var fallos = 0;
  for (var a = 0; a < ANCHOS.length; a++) {
    await p.setViewportSize({ width: ANCHOS[a], height: 800 });
    for (var i = 0; i < PAGS.length; i++) {
      await p.goto("http://127.0.0.1:8811/" + PAGS[i], { waitUntil: "load", timeout: 30000 });
      await p.waitForTimeout(300);
      var r = await p.evaluate(function () {
        return {
          sw: document.documentElement.scrollWidth,
          iw: window.innerWidth,
          i: document.querySelectorAll("i").length,
          ast: (document.body.innerText.match(/\*/g) || []).length
        };
      });
      var over = r.sw > r.iw + 1;
      if (over || r.ast > 0) fallos++;
      console.log(String(ANCHOS[a]).padStart(5) + "px  " + PAGS[i].padEnd(20) +
                  "scrollW=" + String(r.sw).padStart(5) + " innerW=" + String(r.iw).padStart(5) +
                  "  <i>=" + String(r.i).padStart(2) +
                  "  ast=" + r.ast + (over ? "   ✘ OVERFLOW" : "   ok"));
    }
    console.log("");
  }
  console.log(fallos === 0 ? "✔ sin overflow y sin asteriscos visibles" : "✘ " + fallos + " problemas");
  await b.close();
})();
