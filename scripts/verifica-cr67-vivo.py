"""CR-67 — verificacion sobre la URL EN VIVO (GitHub Pages).

⚠️ Que el archivo llegue NO es que pinte. Acá se carga la URL publica y se mide el DOM
   ya renderizado: es la unica verificacion que el proyecto acepta como «publicado».

Uso:  .venv/bin/python scripts/verifica-cr67-vivo.py
"""
import json
import time
import urllib.request
from base64 import b64encode
from socket import create_connection
from struct import pack, unpack

URL = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile/index.html"
CDP = "http://127.0.0.1:9222"
ANCHOS = [1440, 390]

MEDIR = r"""
(() => {
  const r = { museo: typeof window.MUSEO !== "undefined",
              itinerante: typeof window.MUSEO_ITINERANTE !== "undefined" };
  const d = document.querySelector(".pm-card__dir");
  r.dir = d ? { nombre: (document.querySelector(".pm-card__dir-nombre")||{}).textContent,
                cargo: (document.querySelector(".pm-card__dir-cargo")||{}).textContent,
                alto: Math.round(d.getBoundingClientRect().height) } : null;
  const o = document.querySelector(".pm-card__origen a");
  r.origen = o ? { texto: o.textContent.trim(), href: o.getAttribute("href") } : null;
  const logo = document.querySelector(".pm-card__logo img");
  r.logo = logo ? Math.round(logo.getBoundingClientRect().width) : -1;
  const sub = document.querySelector(".cec-muestra__enlace a");
  r.subpagina = sub ? sub.getAttribute("href") : null;
  r.secAlto = Math.round((document.querySelector("#cec")||{getBoundingClientRect:()=>({height:-1})}).getBoundingClientRect().height);
  r.desborde = document.documentElement.scrollWidth > window.innerWidth;
  r.errores = window.__errs || 0;
  r.texto = document.body.innerText.length;
  return JSON.stringify(r);
})()
"""


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hp, _, path = url.partition("/")
        host, _, port = hp.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=40)
        key = b64encode(b"mpch-vivo-cr67").decode()
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

    def recv(self, timeout=50):
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
    fallos = []
    for w in ANCHOS:
        cmd("Emulation.setDeviceMetricsOverride",
            {"width": w, "height": 900, "deviceScaleFactor": 1, "mobile": w < 700})
        cmd("Page.navigate", {"url": URL + f"?v={w}"})
        time.sleep(4)
        r = json.loads(cmd("Runtime.evaluate", {"expression": MEDIR,
                                                "returnByValue": True})["result"]["value"])
        print(f"\n===== EN VIVO {w}px =====")
        print(f"  MUSEO={r['museo']} ITINERANTE={r['itinerante']} texto={r['texto']} car "
              f"secAlto={r['secAlto']} logo={r['logo']} desborde={r['desborde']}")
        print(f"  DIRECCION: {json.dumps(r['dir'], ensure_ascii=False)}")
        print(f"  ORIGEN   : {json.dumps(r['origen'], ensure_ascii=False)}")
        print(f"  SUBPAGINA: {r['subpagina']}")
        if not r["museo"]:
            fallos.append(f"{w}: window.MUSEO no existe -> sitio en blanco")
        if not r["dir"] or "JUAN CASTILLO CORNEJO" not in (r["dir"]["nombre"] or ""):
            fallos.append(f"{w}: la direccion NO pinta en vivo")
        if not r["origen"] or r["origen"]["href"] != "proyecto-cec.html#proyecto-cec":
            fallos.append(f"{w}: el enlace del origen NO pinta en vivo")
        if r["desborde"]:
            fallos.append(f"{w}: desborde en vivo")
    # el destino del enlace debe existir en vivo
    try:
        sub = urllib.request.urlopen(URL.replace("index.html", "proyecto-cec.html"),
                                     timeout=20).read().decode("utf-8", "replace")
        ok = 'id="proyecto-cec"' in sub
        print(f"\n  ancla #proyecto-cec presente en la subpagina en vivo: {ok}")
        if not ok:
            fallos.append("la subpagina en vivo no tiene el ancla #proyecto-cec")
    except Exception as e:
        fallos.append(f"no se pudo leer la subpagina: {e}")

    print("\n=========== RESULTADO EN VIVO ===========")
    print("  " + ("TODO OK" if not fallos else "\n  ".join(fallos)))


if __name__ == "__main__":
    main()
