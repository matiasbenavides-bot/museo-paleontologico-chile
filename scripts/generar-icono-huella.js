/* Genera el PNG del icono de pieza «huella» a partir del SVG de js/iconos.js.
   El sitio USA el SVG en línea (js/iconos.js); este PNG es sólo para que el
   archivo `assets/img/pieza-huellas.png` que referencia el data exista y el
   validador de recursos no lo marque como faltante.

   Uso:  node scripts/generar-icono-huella.js
*/
const { chromium } = require("playwright-core");
const fs = require("fs");

global.window = {};
require("/mnt/c/dev/museo-mpch/js/iconos.js");
const svg = global.window.ICONOS.huella;

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/home/logicforgex/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome",
  });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  // el celeste del sitio, el mismo que llevan horneado los otros iconos de pieza
  const CELESTE = "#51adc6";
  await page.setContent(
    `<body style="margin:0;background:transparent;display:flex;align-items:center;justify-content:center;width:512px;height:512px">
       <div style="width:440px;height:440px;color:${CELESTE}">${svg.replace('<svg ', '<svg style="width:100%;height:100%" ')}</div>
     </body>`
  );
  await page.waitForTimeout(300);
  await page.locator("div").screenshot({ path: "/mnt/c/dev/museo-mpch/assets/img/pieza-huellas.png", omitBackground: true });
  await browser.close();
  const st = fs.statSync("/mnt/c/dev/museo-mpch/assets/img/pieza-huellas.png");
  console.log("PNG generado:", st.size, "bytes");
})();
