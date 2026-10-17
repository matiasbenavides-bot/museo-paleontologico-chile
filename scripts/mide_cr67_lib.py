"""Libreria minima de CDP para las sondas del MPCH.

⚠️ El proyecto es SIN build y SIN `node_modules`, asi que `require("ws")` de Node NO
   corre: se usa el WebSocket NATIVO de Python contra el Chrome headless que escucha en
   el puerto 9222. Este archivo lo comparten las sondas `mide-cr67.py`,
   `mide-geometria-cec.py` y `captura-cec-secciones.py` — antes cada una lo repetia.
"""
import json

CDP = "http://127.0.0.1:9222"


class WS:
    def __init__(self, url):
        from base64 import b64encode
        from socket import create_connection
        url = url[len("ws://"):]
        hp, _, path = url.partition("/")
        host, _, port = hp.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=60)
        key = b64encode(b"mpch-cdp-lib").decode()
        self.sock.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hp}\r\nUpgrade: websocket\r\n"
                           f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\n"
                           "Sec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        if b"101" not in buf.split(b"\r\n")[0]:
            raise RuntimeError("handshake fallo")
        self.buf = buf.split(b"\r\n\r\n", 1)[1]

    def _recv(self, n):
        while len(self.buf) < n:
            d = self.sock.recv(1 << 20)
            if not d:
                raise RuntimeError("socket cerrado")
            self.buf += d
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, txt):
        from struct import pack
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
        from struct import unpack
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
                self.sock.sendall(bytes([0x8A, 0x80, 0x11, 0x22, 0x33, 0x44]))
                continue
            if op in (0x1, 0x2):
                return p.decode("utf-8", "replace")
            if op == 0x8:
                raise RuntimeError("cerrado por el navegador")


def conectar():
    """Devuelve (ws, cmd). `cmd(metodo, params)` es la llamada CDP con id/espera."""
    import time
    import urllib.request
    tabs = json.loads(urllib.request.urlopen(CDP + "/json", timeout=10).read())
    ws = WS([t for t in tabs if t.get("type") == "page"][0]["webSocketDebuggerUrl"])
    estado = {"i": 0}

    def cmd(method, params=None, timeout=60):
        estado["i"] += 1
        ws.send(json.dumps({"id": estado["i"], "method": method, "params": params or {}}))
        while True:
            msg = json.loads(ws.recv(timeout))
            if msg.get("id") == estado["i"]:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    cmd("Page.enable")
    cmd("Runtime.enable")
    return ws, cmd, time
