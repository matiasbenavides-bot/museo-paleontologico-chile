"""CR-67 — sonda de la seccion C.E.C de la PORTADA del MPCH.

Mide lo que el dueño pidio que falte, en la URL EN VIVO del server local:
  1. quien DIRIGE la muestra (nombre + cargo visibles, sin truncar)
  2. el camino al ORIGEN del proyecto
  3. que el "especialista que guia" este VISIBLE y no recortado
y ademas que NO haya regresion: logo intacto, enlace a la subpagina, 0 desborde.

Se conecta por CDP a un Chrome headless ya abierto en el puerto 9222
(WebSocket nativo de Python 3.12, sin dependencias externas: el proyecto es
sin build y sin node_modules, y `ws` de Node NO esta instalado).

Uso:  .venv/bin/python scripts/mide-cr67.py
"""
import json
import sys
import time
import urllib.request
from base64 import b64decode, b64encode
from hashlib import sha1
from socket import create_connection
from struct import pack, unpack

PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
CDP = "http://127.0.0.1:9222"
ANCHOS = [1440, 1280, 1024, 900, 899, 768, 414, 390, 360]

MEDIR = r"""
(() => {
  const r = {};
  const sec = document.querySelector("#cec");
  r.secAlto = sec ? Math.round(sec.getBoundingClientRect().height) : -1;
  const dir = document.querySelector(".pm-card__dir");
  if (!dir) { r.dir = null; }
  else {
    const b = dir.getBoundingClientRect();
    const nom = document.querySelector(".pm-card__dir-nombre");
    const car = document.querySelector(".pm-card__dir-cargo");
    r.dir = {
      w: Math.round(b.width), h: Math.round(b.height),
      nombre: nom ? nom.textContent : "",
      cargo: car ? car.textContent : "",
      nombreCortado: nom ? nom.scrollWidth > nom.clientWidth + 1 : null,
      cargoCortado: car ? car.scrollWidth > car.clientWidth + 1 : null,
      fsNombre: nom ? parseFloat(getComputedStyle(nom).fontSize) : null,
      color: nom ? getComputedStyle(nom).color : null
    };
  }
  const ori = document.querySelector(".pm-card__origen a");
  r.origen = ori ? { texto: ori.textContent.trim(), href: ori.getAttribute("href"),
                     w: Math.round(ori.getBoundingClientRect().width),
                     x: Math.round(ori.getBoundingClientRect().left),
                     cortado: ori.scrollWidth > ori.clientWidth + 1 } : null;
  const pils = [...document.querySelectorAll(".cec-muestra__pildora")].map(p => {
    const v = p.querySelector(".pm-dato__v"), d = p.querySelector(".pm-dato__d");
    return { v: v ? v.textContent : "", d: d ? d.textContent : "",
             vCortado: v ? v.scrollWidth > v.clientWidth + 1 : null,
             dCortado: d ? d.scrollWidth > d.clientWidth + 1 : null,
             alto: Math.round(p.getBoundingClientRect().height) };
  });
  r.pildoras = pils;
  r.especialista = pils.filter(p => /especialista|profesional|gu[ií]a/i.test(p.d + " " + p.v))
                       .map(p => ({ txt: p.v + " | " + p.d, cortado: p.dCortado }));
  r.especialistaVisible = r.especialista.some(e => !e.cortado);
  const logo = document.querySelector(".pm-card__logo img");
  r.logoW = logo ? Math.round(logo.getBoundingClientRect().width) : -1;
  const sub = document.querySelector(".cec-muestra__enlace a");
  r.subpagina = sub ? sub.getAttribute("href") : null;
  r.orden = [".pm-card__logo", ".pm-card__dir", ".pm-card__cabeza", ".pm-card__origen",
             ".cec-muestra__fotos", ".cec-muestra__datos", ".cec-muestra__caja", ".cec-muestra__enlace"]
    .map(s => { const e = document.querySelector(s);
                return s.replace(".pm-card__", "").replace(".cec-muestra__", "") + "@" +
                       (e ? Math.round(e.getBoundingClientRect().top) : "-"); });
  r.ventana = window.innerWidth;
  r.scroll = document.documentElement.scrollWidth;
  r.desborde = r.scroll > r.ventana;
  r.fotos = document.querySelectorAll("#cec .galeria__foto img").length;
  return JSON.stringify(r);
})()
"""


class WS:
    """Cliente WebSocket minimo (RFC 6455) — sin dependencias."""

    def __init__(self, url):
        url = url[len("ws://"):]
        hostport, _, path = url.partition("/")
        host, _, port = hostport.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=20)
        key = b64encode(b"cr67-mpch-sonda").decode()
        req = (f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
               f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
               f"Sec-WebSocket-Version: 13\r\n\r\n")
        self.sock.sendall(req.encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        if b"101" not in buf.split(b"\r\n")[0]:
            raise RuntimeError("handshake fallo: " + buf.split(b"\r\n")[0].decode())
        self.buf = buf.split(b"\r\n\r\n", 1)[1]

    def _recv(self, n):
        while len(self.buf) < n:
            d = self.sock.recv(65536)
            if not d:
                raise RuntimeError("socket cerrado")
            self.buf += d
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, txt):
        data = txt.encode()
        head = bytearray([0x81])
        n = len(data)
        if n < 126:
            head.append(0x80 | n)
        elif n < 65536:
            head.append(0x80 | 126); head += pack(">H", n)
        else:
            head.append(0x80 | 127); head += pack(">Q", n)
        mask = b"\x11\x22\x33\x44"
        head += mask
        self.sock.sendall(bytes(head) + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def recv(self, timeout=25):
        self.sock.settimeout(timeout)
        while True:
            b0, b1 = self._recv(2)
            op, ln = b0 & 0x0F, b1 & 0x7F
            if ln == 126:
                ln = unpack(">H", self._recv(2))[0]
            elif ln == 127:
                ln = unpack(">Q", self._recv(8))[0]
            payload = self._recv(ln) if ln else b""
            if op == 0x9:                      # ping -> pong
                self.sock.sendall(bytes([0x8A, 0x80, 0x11, 0x22, 0x33, 0x44]))
                continue
            if op in (0x1, 0x2):
                return payload.decode("utf-8", "replace")
            if op == 0x8:
                raise RuntimeError("cerrado por el navegador")


def resolver_ws():
    tabs = json.loads(urllib.request.urlopen(CDP + "/json", timeout=10).read())
    for t in tabs:
        if t.get("type") == "page":
            return t["webSocketDebuggerUrl"]
    raise RuntimeError("no hay pestaña disponible en el Chrome del puerto 9222")


def main():
    ws = WS(resolver_ws())
    mid = [0]

    def cmd(method, params=None, timeout=25):
        mid[0] += 1
        ws.send(json.dumps({"id": mid[0], "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv(timeout))
            if msg.get("id") == mid[0]:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    cmd("Page.enable")
    cmd("Runtime.enable")
    print(f"CDP OK  ->  midiendo index.html en http://localhost:{PUERTO}\n")

    fallos = []
    for w in ANCHOS:
        cmd("Emulation.setDeviceMetricsOverride",
            {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
        cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/index.html?w={w}"})
        time.sleep(1.6)
        res = cmd("Runtime.evaluate", {"expression": MEDIR, "returnByValue": True},
                  timeout=30)["result"]["value"]
        r = json.loads(res)

        print(f"===== {w}px =====")
        print(f"  ventana={r['ventana']} scroll={r['scroll']} desborde={r['desborde']} "
              f"secAlto={r['secAlto']}px fotos={r['fotos']} logo={r['logoW']}px")
        if r["dir"] is None:
            print("  DIRECCION: !!! NO EXISTE")
            fallos.append(f"{w}px: falta el bloque de direccion")
        else:
            d = r["dir"]
            print(f"  DIRECCION: {d['nombre']} / {d['cargo']}")
            print(f"             caja {d['w']}x{d['h']}px  fs={d['fsNombre']}px  "
                  f"nombreCortado={d['nombreCortado']} cargoCortado={d['cargoCortado']}")
            if d["nombreCortado"]:
                fallos.append(f"{w}px: el NOMBRE del director sale recortado")
            if d["nombre"] != "JUAN CASTILLO CORNEJO":
                fallos.append(f"{w}px: nombre inesperado '{d['nombre']}'")
        print(f"  ORIGEN   : {json.dumps(r['origen'], ensure_ascii=False)}")
        if not r["origen"] or r["origen"]["href"] != "proyecto-cec.html#proyecto-cec":
            fallos.append(f"{w}px: el enlace del origen no apunta al proyecto C.E.C")
        if r["origen"] and r["origen"]["cortado"]:
            fallos.append(f"{w}px: el rotulo del origen sale recortado")
        print(f"  ESPECIALISTA visible={r['especialistaVisible']} -> "
              f"{json.dumps(r['especialista'], ensure_ascii=False)}")
        if not r["especialistaVisible"]:
            fallos.append(f"{w}px: el 'especialista que guia' NO se lee (recortado)")
        print(f"  TARJETAS : " + "  ".join(f"{p['v']}[{p['alto']}px dCort={p['dCortado']}]"
                                           for p in r["pildoras"]))
        print(f"  ORDEN    : " + "  ".join(r["orden"]))
        print(f"  SUBPAGINA: {r['subpagina']}")
        if r["subpagina"] != "proyecto-cec.html":
            fallos.append(f"{w}px: se perdio el enlace a la subpagina")
        if r["desborde"]:
            fallos.append(f"{w}px: DESBORDE horizontal ({r['scroll']} > {r['ventana']})")

    print("\n================ RESULTADO ================")
    if fallos:
        for f in fallos:
            print("  FAIL  " + f)
        print(f"  {len(fallos)} hallazgo(s)")
    else:
        print("  TODO OK en los 9 anchos")


if __name__ == "__main__":
    main()
