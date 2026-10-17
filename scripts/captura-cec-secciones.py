"""CR-68 — capturas de las DOS paginas de C.E.C, por SECCION, al escritorio real.

⚠️ Escritorio REAL: `OneDrive/Desktop/` (NO `Desktop/`).
⚠️ `--screenshot` captura la VENTANA, no el elemento: se usa `Page.captureScreenshot` con
   `clip` explicito del rectangulo en coordenadas de DOCUMENTO.

Uso:  .venv/bin/python scripts/captura-cec-secciones.py [puerto]
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

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8080"
DEST = "/mnt/c/Users/logic/OneDrive/Desktop/mpch-revision"
CDP = "http://127.0.0.1:9222"

OBJETIVOS = [
    ("index.html", "#cec", "PORTADA-cec", 1440),
    ("index.html", "#cec", "PORTADA-cec", 390),
    ("proyecto-cec.html", "#proyecto-cec", "SUBPAGINA-cabeza", 1440),
    ("proyecto-cec.html", "#proyecto-cec", "SUBPAGINA-cabeza", 390),
]


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hp, _, path = url.partition("/")
        host, _, port = hp.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=60)
        key = b64encode(b"mpch-cap-cec").decode()
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

    def recv(self, timeout=90):
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
    os.makedirs(DEST, exist_ok=True)

    for pag, sel, nombre, w in OBJETIVOS:
        cmd("Emulation.setDeviceMetricsOverride",
            {"width": w, "height": 1000, "deviceScaleFactor": 1, "mobile": w < 700})
        cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/{pag}?c={w}"})
        time.sleep(2.5)
        rect = json.loads(cmd("Runtime.evaluate", {"returnByValue": True, "expression": f"""
          (() => {{
            const s = document.querySelector("{sel}");
            if (!s) return "null";
            const r = s.getBoundingClientRect();
            return JSON.stringify({{x: 0, y: Math.round(r.top + window.scrollY),
                                    w: Math.round(r.width), h: Math.round(r.height)}});
          }})()"""})["result"]["value"])
        if rect == "null":
            print(f"  !! {pag} no tiene {sel}")
            continue
        shot = cmd("Page.captureScreenshot",
                   {"format": "png", "captureBeyondViewport": True,
                    "clip": {"x": rect["x"], "y": rect["y"], "width": rect["w"],
                             "height": rect["h"], "scale": 1}})
        data = base64.b64decode(shot["data"])
        salida = f"{DEST}/CR68-{nombre}-{w}.png"
        with open(salida, "wb") as f:
            f.write(data)
        print(f"  {nombre} @{w}: {rect['w']}x{rect['h']}  ->  {os.path.basename(salida)} "
              f"({len(data)/1024:.0f} KB)")


if __name__ == "__main__":
    main()
