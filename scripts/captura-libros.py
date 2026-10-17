"""Captura PNG del bloque "Libros publicados" del CURRICULUM (MPCH).

⚠️ La captura va al escritorio REAL del dueño: `OneDrive/Desktop/` (NO `Desktop/`).
⚠️ `--screenshot` de Chromium captura la VENTANA, no el elemento: por eso se usa
   `Page.captureScreenshot` con `captureBeyondViewport` y un `clip` explicito del
   rectangulo del bloque. Ese si respeta el clip.
⚠️ Las portadas llevan `loading="lazy"`: antes de capturar hay que forzar la carga
   y esperar `decode()`, o la captura sale con huecos. Un test que no espera la
   imagen no mide la imagen.

Uso:  .venv/bin/python scripts/captura-libros.py [puerto] [ancho] [sufijo]
"""
import base64
import json
import os
import sys
import time
import urllib.request
from base64 import b64encode
from socket import create_connection
from struct import pack, unpack

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8931"
ANCHO = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
SUFIJO = sys.argv[3] if len(sys.argv) > 3 else ""
DEST = "/mnt/c/Users/logic/OneDrive/Desktop/mpch-revision"
CDP = "http://127.0.0.1:9222"


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hostport, _, path = url.partition("/")
        host, _, port = hostport.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=60)
        key = b64encode(b"mpch-captura-libros").decode()
        self.sock.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hostport}\r\nUpgrade: websocket\r\n"
                           f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
                           f"Sec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        assert b"101" in buf.split(b"\r\n")[0], buf.split(b"\r\n")[0]
        self.buf = buf.split(b"\r\n\r\n", 1)[1]

    def _recv(self, n):
        while len(self.buf) < n:
            d = self.sock.recv(1 << 20)
            if not d:
                raise RuntimeError("cerrado")
            self.buf += d
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, txt):
        d = txt.encode()
        h = bytearray([0x81])
        n = len(d)
        if n < 126:
            h.append(0x80 | n)
        elif n < 65536:
            h.append(0x80 | 126); h += pack(">H", n)
        else:
            h.append(0x80 | 127); h += pack(">Q", n)
        m = b"\x11\x22\x33\x44"
        h += m
        self.sock.sendall(bytes(h) + bytes(b ^ m[i % 4] for i, b in enumerate(d)))

    def recv(self, timeout=120):
        self.sock.settimeout(timeout)
        while True:
            b0, b1 = self._recv(2)
            op, ln = b0 & 0x0F, b1 & 0x7F
            if ln == 126:
                ln = unpack(">H", self._recv(2))[0]
            elif ln == 127:
                ln = unpack(">Q", self._recv(8))[0]
            p = self._recv(ln) if ln else b""
            if op == 0x9:
                self.sock.sendall(bytes([0x8A, 0x80, 0x11, 0x22, 0x33, 0x44])); continue
            if op in (0x1, 0x2):
                return p.decode("utf-8", "replace")
            if op == 0x8:
                raise RuntimeError("cerrado por el navegador")


def main():
    tabs = json.loads(urllib.request.urlopen(CDP + "/json", timeout=10).read())
    pags = [t for t in tabs if t.get("type") == "page"]
    ws = WS(pags[0]["webSocketDebuggerUrl"])
    mid = [0]

    def cmd(m, p=None):
        mid[0] += 1
        ws.send(json.dumps({"id": mid[0], "method": m, "params": p or {}}))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == mid[0]:
                if "error" in msg:
                    raise RuntimeError(f"{m}: {msg['error']}")
                return msg.get("result", {})

    cmd("Page.enable"); cmd("Runtime.enable")
    # Alto generoso: el bloque tiene que caber entero en el clip.
    cmd("Emulation.setDeviceMetricsOverride",
        {"width": ANCHO, "height": 1400, "deviceScaleFactor": 1, "mobile": ANCHO < 700})
    cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/curriculum.html?cap={ANCHO}"})
    time.sleep(2.5)

    # 1) Verificar que las 5 portadas EXISTEN y CARGARON antes de capturar.
    estado = json.loads(cmd("Runtime.evaluate", {"returnByValue": True, "awaitPromise": True,
        "expression": """
      (async () => {
        const imgs = [...document.querySelectorAll('.libro__portada')];
        imgs.forEach(i => { i.loading = 'eager'; if (!i.complete) i.src = i.src; });
        await Promise.all(imgs.map(i => i.decode().catch(() => null)));
        await new Promise(r => setTimeout(r, 300));
        return JSON.stringify({
          n: imgs.length,
          ok: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
          rotas: imgs.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src')),
          medidas: imgs.map(i => i.naturalWidth + 'x' + i.naturalHeight)
        });
      })()"""})["result"]["value"])
    print("portadas:", estado)
    assert estado["n"] == 5, f"esperaba 5 portadas, hay {estado['n']}"
    assert estado["ok"] == 5, f"portadas rotas: {estado['rotas']}"

    # 2) Rectangulo del bloque completo (rotulo + grilla), en coords de DOCUMENTO.
    rect = json.loads(cmd("Runtime.evaluate", {"returnByValue": True, "expression": """
      (() => {
        const b = document.querySelectorAll('.perfil__bloque')[1];   // 0=trayectoria, 1=libros
        const r = b.getBoundingClientRect();
        const y = Math.round(r.top + window.scrollY) - 18;
        return JSON.stringify({x: Math.round(r.left + window.scrollX) - 18,
                               y: y,
                               w: Math.round(r.width) + 36,
                               h: Math.round(r.height) + 36});
      })()"""})["result"]["value"])
    print("rect del bloque libros:", rect)

    shot = cmd("Page.captureScreenshot",
               {"format": "png", "captureBeyondViewport": True,
                "clip": {"x": rect["x"], "y": rect["y"], "width": rect["w"],
                         "height": rect["h"], "scale": 1}})
    data = base64.b64decode(shot["data"])
    os.makedirs(DEST, exist_ok=True)
    salida = f"{DEST}/LIBROS-portadas-{ANCHO}{SUFIJO}.png"
    with open(salida, "wb") as f:
        f.write(data)
    print(f"PNG escrito: {salida}  ({len(data) / 1024:.0f} KB, {rect['w']}x{rect['h']})")


if __name__ == "__main__":
    main()
