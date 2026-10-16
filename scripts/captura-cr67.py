"""CR-67 — captura PNG de la seccion C.E.C de la PORTADA (MPCH).

⚠️ La captura va al escritorio REAL del dueño: `OneDrive/Desktop/` (NO `Desktop/`).
⚠️ `--screenshot` de Chromium captura la VENTANA, no el elemento (lo delato un control
   negativo en CR-65): por eso se usa `Page.captureScreenshot` con `captureBeyondViewport`
   y un `clip` explicito del rectangulo de la seccion. Ese si respeta el clip.

Uso:  .venv/bin/python scripts/captura-cr67.py [puerto] [ancho]
"""
import base64
import json
import sys
import time
import urllib.request
from socket import create_connection
from struct import pack, unpack
from base64 import b64encode

PUERTO = sys.argv[1] if len(sys.argv) > 1 else "8080"
ANCHO = int(sys.argv[2]) if len(sys.argv) > 2 else 1440
DEST = "/mnt/c/Users/logic/OneDrive/Desktop/mpch-revision"
CDP = "http://127.0.0.1:9222"


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hostport, _, path = url.partition("/")
        host, _, port = hostport.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=30)
        key = b64encode(b"mpch-captura-cr67").decode()
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

    def recv(self, timeout=60):
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
    ws = WS([t for t in tabs if t.get("type") == "page"][0]["webSocketDebuggerUrl"])
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
    cmd("Emulation.setDeviceMetricsOverride",
        {"width": ANCHO, "height": 1000, "deviceScaleFactor": 1, "mobile": ANCHO < 700})
    cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/index.html?cap={ANCHO}"})
    time.sleep(2.5)

    # Rectangulo real de la seccion, en coordenadas de DOCUMENTO (no de viewport).
    rect = json.loads(cmd("Runtime.evaluate", {"returnByValue": True, "expression": """
      (() => {
        const s = document.querySelector("#cec").getBoundingClientRect();
        return JSON.stringify({x: 0, y: Math.round(s.top + window.scrollY),
                               w: Math.round(s.width), h: Math.round(s.height)});
      })()"""})["result"]["value"])
    print("rect de la seccion:", rect)

    shot = cmd("Page.captureScreenshot",
               {"format": "png", "captureBeyondViewport": True,
                "clip": {"x": rect["x"], "y": rect["y"], "width": rect["w"],
                         "height": rect["h"], "scale": 1}})
    data = base64.b64decode(shot["data"])
    import os
    os.makedirs(DEST, exist_ok=True)
    salida = f"{DEST}/CR67-cec-portada-{ANCHO}.png"
    with open(salida, "wb") as f:
        f.write(data)
    print(f"PNG escrito: {salida}  ({len(data) / 1024:.0f} KB, {rect['w']}x{rect['h']})")


if __name__ == "__main__":
    main()
