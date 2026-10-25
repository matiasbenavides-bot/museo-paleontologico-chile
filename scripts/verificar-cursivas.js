/* Verificación de CR-86c — cursivas de nombres científicos en todo el sitio.
   Uso: node scripts/verificar-cursivas.js                                      */
"use strict";
var fs = require("fs");
var path = require("path");

var raiz = path.join(__dirname, "..");
global.window = {};
require(path.join(raiz, "data/museo.js"));
eval(fs.readFileSync(path.join(raiz, "js/texto.js"), "utf8"));

var conCursivas = window.TEXTO.conCursivas;

var paginas = {
  TRILOBITES: window.TRILOBITES,
  AMMONITES: window.AMMONITES,
  TIBURONES: window.TIBURONES,
  AMBAR: window.AMBAR
};

var total = 0, impares = 0, escapados = 0, nombres = [];

Object.keys(paginas).forEach(function (nom) {
  var P = paginas[nom];
  if (!P) { console.log(nom + ": AUSENTE"); return; }
  var n = 0;

  (P.secciones || []).forEach(function (s) {
    (s.parrafos || []).forEach(function (p) {
      var h = conCursivas(p);
      var m = h.match(/<i>([^<]*)<\/i>/g) || [];
      m.forEach(function (x) { nombres.push(nom + " :: " + x.replace(/<\/?i>/g, "")); });
      n += m.length;
      if ((p.match(/\*/g) || []).length % 2) {
        impares++;
        console.log("  ⚠ IMPAR en " + nom + ": " + p.slice(0, 70));
      }
      if (h.indexOf("&lt;i&gt;") >= 0) escapados++;
    });

    (s.imagenes || []).forEach(function (im) {
      if (im.pie) {
        var hp = conCursivas(im.pie);
        n += (hp.match(/<i>/g) || []).length;
      }
    });

    if (s.titulo) {
      n += (conCursivas(s.titulo).match(/<i>/g) || []).length;
    }
  });

  console.log(nom + " → <i>: " + n);
  total += n;
});

console.log("\nTOTAL <i> en el sitio: " + total);
console.log("Párrafos con asterisco impar: " + impares);
console.log("<i> escapados literalmente: " + escapados);

console.log("\n--- Nombres en cursiva (" + nombres.length + ") ---");
nombres.forEach(function (x) { console.log("  " + x); });

console.log("\n--- Prueba de inyección ---");
["<script>alert(1)</script>", "<img src=x onerror=alert(1)>", "*sin cerrar",
 "a *b* c <b>d</b>", "sólo *uno* y otro *suelto"].forEach(function (a) {
  var h = conCursivas(a);
  var peligroso = /<(?!\/?i>)/.test(h);
  console.log((peligroso ? "✘ PELIGROSO" : "✔ inerte") + "  " + JSON.stringify(a) + "  →  " + h);
});
