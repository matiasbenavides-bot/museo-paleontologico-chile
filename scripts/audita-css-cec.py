"""CR-68 — auditoria de CSS de las DOS paginas de C.E.C (portada + subpagina).

⚠️ «Se ven mal algunas partes» es un SINTOMA, no una causa. Antes de tocar una linea de
   CSS hay que MEDIR que esta mal. Esta sonda busca defectos de clase, no de gusto:

   1. desborde horizontal (scrollWidth > innerWidth)
   2. TRUNCAMIENTO silencioso (scrollWidth > clientWidth + 1): el modo de falla de un
      texto de una linea con nowrap + ellipsis — no da error, MIENTE
   3. cajas de la MISMA grilla con alturas distintas
   4. bloques que NO alinean su borde con los vecinos (el defecto clasico de CR-62)
   5. ANCHO DE LINEA < 55 caracteres en escritorio (= «se ve de celular», CR-64)
   6. contraste WCAG AA (< 4,5) del texto sobre su fondo real
   7. elementos que se solapan (rect intersecta rect)

Uso:  .venv/bin/python scripts/audita-css-cec.py
"""
import json
import sys
import time
import urllib.request
from base64 import b64encode
from socket import create_connection
from struct import pack, unpack

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8080"
CDP = "http://127.0.0.1:9222"
ANCHOS = [1440, 1024, 900, 768, 390]
PAGINAS = ["index.html", "proyecto-cec.html"]


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hp, _, path = url.partition("/")
        host, _, port = hp.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=40)
        key = b64encode(b"mpch-audita-cec").decode()
        self.sock.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hp}\r\nUpgrade: websocket\r\n"
                           f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
                           "Sec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.buf = buf.split(b"\r\n\r\n", 1)[1]

    def _r(self, n):
        while len(self.buf) < n:
            d = self.sock.recv(1 << 20)
            if not d:
                raise RuntimeError("cerrado")
            self.buf += d
        o, self.buf = self.buf[:n], self.buf[n:]
        return o

    def send(self, t):
        d = t.encode(); h = bytearray([0x81]); n = len(d)
        if n < 126:
            h.append(0x80 | n)
        elif n < 65536:
            h.append(0x80 | 126); h += pack(">H", n)
        else:
            h.append(0x80 | 127); h += pack(">Q", n)
        m = b"\x11\x22\x33\x44"; h += m
        self.sock.sendall(bytes(h) + bytes(b ^ m[i % 4] for i, b in enumerate(d)))

    def recv(self, timeout=60):
        self.sock.settimeout(timeout)
        while True:
            b0, b1 = self._r(2); op, ln = b0 & 0x0F, b1 & 0x7F
            if ln == 126:
                ln = unpack(">H", self._r(2))[0]
            elif ln == 127:
                ln = unpack(">Q", self._r(8))[0]
            p = self._r(ln) if ln else b""
            if op == 0x9:
                self.sock.sendall(bytes([0x8A, 0x80, 0x11, 0x22, 0x33, 0x44])); continue
            if op in (0x1, 0x2):
                return p.decode("utf-8", "replace")
            if op == 0x8:
                raise RuntimeError("cerrado")


AUDITAR = r"""
(() => {
  const out = { desborde: null, truncados: [], alturas: [], alineacion: [], lineas: [],
                contraste: [], solapes: [] };

  out.desborde = document.documentElement.scrollWidth > window.innerWidth
    ? { scroll: document.documentElement.scrollWidth, ventana: window.innerWidth } : null;

  // --- 1. truncamiento silencioso ---
  document.querySelectorAll("*").forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || "").trim();
    if (t.length < 3) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      out.truncados.push({ sel: el.className || el.tagName, txt: t.slice(0, 48),
                           sw: el.scrollWidth, cw: el.clientWidth,
                           ov: cs.textOverflow + "/" + cs.whiteSpace,
                           cut: Math.round(100 * el.clientWidth / el.scrollWidth) });
    }
  });

  // --- 2. cajas hermanas de la MISMA grilla con alturas distintas ---
  const grids = new Set();
  document.querySelectorAll("*").forEach(el => {
    if (getComputedStyle(el).display.includes("grid")) grids.add(el);
  });
  grids.forEach(g => {
    const hijos = [...g.children].filter(c => c.getBoundingClientRect().height > 0);
    if (hijos.length < 2) return;
    const hs = hijos.map(c => Math.round(c.getBoundingClientRect().height));
    const ws = hijos.map(c => Math.round(c.getBoundingClientRect().width));
    if (new Set(hs).size > 1 && g.className && /datos|grid|colec|fotos|serv|lista/.test(g.className)) {
      out.alturas.push({ grid: g.className.toString().slice(0, 60), alturas: hs, anchos: ws });
    }
  });

  // --- 3. alineacion de BORDES entre bloques del mismo contenedor ---
  document.querySelectorAll(".contenedor").forEach(c => {
    const hijos = [...c.children].filter(e => {
      const r = e.getBoundingClientRect();
      return r.height > 40 && r.width > 200;
    });
    if (hijos.length < 2) return;
    const lefts = hijos.map(e => Math.round(e.getBoundingClientRect().left));
    const rights = hijos.map(e => Math.round(e.getBoundingClientRect().right));
    const lUniq = new Set(lefts), rUniq = new Set(rights);
    if (lUniq.size > 2 || rUniq.size > 2) {
      out.alineacion.push({
        cont: (c.parentElement ? c.parentElement.className : "") + " > .contenedor",
        izquierdas: [...new Set(lefts)], derechas: [...new Set(rights)],
        bloques: hijos.map((e, i) => (e.className || e.tagName).toString().slice(0, 28) +
                                      "[" + lefts[i] + "," + rights[i] + "]")
      });
    }
  });

  // --- 4. ancho de LINEA real (CR-64): < 55 car/linea en escritorio = «de celular» ---
  const esEscritorio = window.innerWidth >= 900;
  if (esEscritorio) {
    document.querySelectorAll("p, li, .cec-intro p, .pm-card__intro, .ficha__valor").forEach(p => {
      if (!p.firstChild || p.firstChild.nodeType !== 3) return;
      const r = document.createRange(); r.selectNodeContents(p);
      const rects = r.getClientRects();
      if (!rects.length) return;
      const anchoLinea = Math.max(...[...rects].map(x => x.width));
      const fs = parseFloat(getComputedStyle(p).fontSize);
      const car = Math.round(anchoLinea / (fs * 0.5));
      if (car > 0 && car < 55) {
        out.lineas.push({ txt: (p.textContent || "").trim().slice(0, 40),
                          px: Math.round(anchoLinea), fs: fs, car: car, donde: p.className });
      }
    });
  }

  // --- 5. contraste WCAG AA del texto contra su fondo REAL ---
  function lum(c) {
    const m = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(v => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  }
  function fondoReal(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const p = m[1].split(",").map(Number);
        if (p.length < 4 || p[3] > 0.55) return bg;
      }
      n = n.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  }
  document.querySelectorAll("p, li, h1, h2, h3, a, span, b, .etiqueta").forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || "").trim();
    if (t.length < 2) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.5) return;
    if (/clip|transparent/.test(cs.webkitTextFillColor || "")) return; // texto con degradado
    const col = cs.color, bg = fondoReal(el);
    if (!/^rgb/.test(col) || !/^rgb/.test(bg)) return;
    const L1 = lum(col), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight) || 400;
    const grande = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const min = grande ? 3.0 : 4.5;
    if (ratio < min) {
      out.contraste.push({ txt: t.slice(0, 40), color: col, fondo: bg,
                           ratio: Math.round(ratio * 100) / 100, min: min,
                           fs: Math.round(fs * 10) / 10, fw: fw, donde: el.className });
    }
  });

  // --- 6. solapes entre bloques hermanos ---
  document.querySelectorAll("section, .pm-card > *, .cec-bloque, .cec-cifra").forEach(c => {
    const hijos = [...c.children].filter(e => {
      const s = getComputedStyle(e);
      return e.getBoundingClientRect().height > 10 && s.display !== "none";
    });
    for (let i = 0; i < hijos.length; i++) {
      for (let j = i + 1; j < hijos.length; j++) {
        const a = hijos[i].getBoundingClientRect(), b = hijos[j].getBoundingClientRect();
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (ox > 6 && oy > 6) {
          out.solapes.push({ a: (hijos[i].className || hijos[i].tagName).toString().slice(0, 30),
                             b: (hijos[j].className || hijos[j].tagName).toString().slice(0, 30),
                             ox: Math.round(ox), oy: Math.round(oy) });
        }
      }
    }
  });

  out.altoTotal = document.body.scrollHeight;
  out.ventana = window.innerWidth;
  return JSON.stringify(out);
})()
"""


def main():
    tabs = json.loads(urllib.request.urlopen(CDP + "/json", timeout=10).read())
    ws = WS([t for t in tabs if t.get("type") == "page"][0]["webSocketDebuggerUrl"])
    i = [0]

    def cmd(m, p=None):
        i[0] += 1
        ws.send(json.dumps({"id": i[0], "method": m, "params": p or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == i[0]:
                if "error" in msg:
                    raise RuntimeError(str(msg["error"]))
                return msg.get("result", {})

    cmd("Page.enable"); cmd("Runtime.enable")

    for pag in PAGINAS:
        print("\n" + "#" * 70)
        print("#  " + pag)
        print("#" * 70)
        for w in ANCHOS:
            cmd("Emulation.setDeviceMetricsOverride",
                {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
            cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/{pag}?a={w}"})
            time.sleep(1.8)
            r = json.loads(cmd("Runtime.evaluate", {"expression": AUDITAR,
                                                    "returnByValue": True})["result"]["value"])
            print(f"\n--- {pag} @ {w}px  (alto={r['altoTotal']}px ventana={r['ventana']}) ---")
            print("  DESBORDE: " + (json.dumps(r["desborde"]) if r["desborde"] else "0"))
            if r["truncados"]:
                print(f"  TRUNCADOS ({len(r['truncados'])}):")
                for t in r["truncados"]:
                    print(f"    · «{t['txt']}»  {t['sw']}px en caja de {t['cw']}px "
                          f"(se ve {t['cut']}%)  [{t['ov']}]  .{t['sel']}")
            if r["alturas"]:
                print(f"  ALTURAS DESIGUALES ({len(r['alturas'])}):")
                for a in r["alturas"]:
                    print(f"    · {a['grid']}: alturas={a['alturas']} anchos={a['anchos']}")
            if r["alineacion"]:
                print(f"  DESALINEADOS ({len(r['alineacion'])}):")
                for a in r["alineacion"]:
                    print(f"    · {a['cont']}: izq={a['izquierdas']} der={a['derechas']}")
                    for b in a["bloques"]:
                        print(f"        {b}")
            if r["lineas"]:
                print(f"  ANCHO DE LINEA CORTO ({len(r['lineas'])}):")
                for l in r["lineas"]:
                    print(f"    · {l['car']} car/linea ({l['px']}px, fs={l['fs']}) «{l['txt']}» .{l['donde']}")
            if r["contraste"]:
                print(f"  CONTRASTE < AA ({len(r['contraste'])}):")
                for c in r["contraste"]:
                    print(f"    · «{c['txt']}» ratio={c['ratio']} (min {c['min']}, fs={c['fs']} "
                          f"fw={c['fw']}) {c['color']} sobre {c['fondo']}  .{c['donde']}")
            if r["solapes"]:
                print(f"  SOLAPES ({len(r['solapes'])}):")
                for s in r["solapes"]:
                    print(f"    · {s['a']} x {s['b']}  solape {s['ox']}x{s['oy']}px")


if __name__ == "__main__":
    main()
