"""CR-68 — geometria fina de la card de C.E.C: quien manda el ancho y que desalinea.

Uso:  .venv/bin/python scripts/mide-geometria-cec.py <pagina> <ancho> [selector]
      .venv/bin/python scripts/mide-geometria-cec.py index.html 1440 "#cec"
"""
import json
import sys
import time
import urllib.request
from base64 import b64encode
from socket import create_connection
from struct import pack, unpack

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from mide_cr67_lib import conectar  # noqa: E402


EXPR = r"""
(() => {
  const g = (s) => document.querySelector(s);
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height),
             x: Math.round(b.left), y: Math.round(b.top + window.scrollY),
             r: Math.round(b.right) }; };
  const out = {};
  const card = g(".pm-card");
  if (!card) return JSON.stringify({ error: "sin .pm-card" });
  out.pmCard = r(card);
  out.padre  = { cls: card.parentElement.className, ...r(card.parentElement) };
  out.contenedor = r(document.querySelector(SEL + " .contenedor"));
  const cs = getComputedStyle(card);
  out.cs = { display: cs.display, cols: cs.gridTemplateColumns, gap: cs.columnGap,
             maxWidth: cs.maxWidth, width: cs.width };
  for (const [k, s] of Object.entries({
      logo: ".pm-card__logo", logoImg: ".pm-card__logo img",
      dir: ".pm-card__dir", cabeza: ".pm-card__cabeza", titulo: ".pm-card__titulo",
      origen: ".pm-card__origen", fotos: ".cec-muestra__fotos--destaque",
      datos: ".cec-muestra__datos", caja: ".cec-muestra__caja",
      enlace: ".cec-muestra__enlace" })) out[k] = r(g(s));
  const d = g(".cec-muestra__datos");
  out.datosHijos = d ? [...d.children].map(c => r(c)) : null;
  const ul = g(".cec-muestra__lista");
  out.lista = ul ? { ...r(ul), items: [...ul.children].map(li => r(li)) } : null;
  const fotos = g(".cec-muestra__fotos--destaque");
  if (fotos) {
    const img = fotos.querySelector("img");
    out.fotoImg = img ? { ...r(img), nat: img.naturalWidth + "x" + img.naturalHeight,
                          src: img.getAttribute("src"),
                          ratioNat: Math.round(1000 * img.naturalWidth / img.naturalHeight) / 1000 } : null;
    out.fotoMarco = r(fotos.querySelector(".galeria__foto"));
  }
  // elementos que exceden el contenedor de la card
  const cont = document.querySelector(SEL + " .contenedor");
  const cR = cont.getBoundingClientRect();
  out.exceden = [...document.querySelectorAll(SEL + " *")].filter(e => {
    const b = e.getBoundingClientRect();
    if (b.width < 30 || b.height < 10) return false;
    return b.left < cR.left - 2 || b.right > cR.right + 2;
  }).map(e => ({ cls: (e.className || e.tagName).toString().slice(0, 40),
                 ...r(e) })).slice(0, 25);
  return JSON.stringify(out, null, 1);
})()
"""


def main():
    pag = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    ancho = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
    sel = sys.argv[3] if len(sys.argv) > 3 else "#cec"
    ws, cmd, time = conectar()
    cmd("Emulation.setDeviceMetricsOverride",
        {"width": ancho, "height": 1000, "deviceScaleFactor": 1, "mobile": ancho < 700})
    cmd("Page.navigate", {"url": f"http://localhost:8080/{pag}?gg={ancho}"})
    time.sleep(2.5)
    res = cmd("Runtime.evaluate",
              {"expression": EXPR.replace("SEL", json.dumps(sel)),
               "returnByValue": True})["result"]["value"]
    print(f"### {pag} @ {ancho}px  selector {sel} ###")
    print(res)


if __name__ == "__main__":
    main()
