"""Sonda: mide la geometria de la grilla de portadas del curriculum a un ancho dado.

Uso:  .venv/bin/python scripts/mide-libros.py [ancho] [puerto]

⚠️ El override de deviceMetrics se verifica DESPUES de aplicarlo. En esta maquina
   el navegador headless abrio a 780px y siguio ahi aunque se pidieran 1440: si no
   se comprueba `innerWidth`, se mide el ancho equivocado y se diagnostica mal.
"""
import json
import sys
import time
import urllib.request
from base64 import b64encode
from socket import create_connection
from struct import pack, unpack

ANCHO = int(sys.argv[1]) if len(sys.argv) > 1 else 1440
PUERTO = sys.argv[2] if len(sys.argv) > 2 else "8931"
CDP = "http://127.0.0.1:9222"


class WS:
    def __init__(self, url):
        url = url[len("ws://"):]
        hp, _, path = url.partition("/")
        host, _, port = hp.partition(":")
        self.sock = create_connection((host, int(port or 80)), timeout=60)
        self.sock.sendall((f"GET /{path} HTTP/1.1\r\nHost: {hp}\r\nUpgrade: websocket\r\n"
                           f"Connection: Upgrade\r\nSec-WebSocket-Key: {b64encode(b'm').decode()}\r\n"
                           f"Sec-WebSocket-Version: 13\r\n\r\n").encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.buf = buf.split(b"\r\n\r\n", 1)[1]
        self.n = 0

    def _r(self, n):
        while len(self.buf) < n:
            self.buf += self.sock.recv(1 << 20)
        o, self.buf = self.buf[:n], self.buf[n:]
        return o

    def send(self, t):
        d = t.encode()
        h = bytearray([0x81])
        n = len(d)
        if n < 126:
            h.append(0x80 | n)
        elif n < 65536:
            h.append(0x80 | 126); h.extend(pack(">H", n))
        else:
            h.append(0x80 | 127); h.extend(pack(">Q", n))
        m = b"\x11\x22\x33\x44"
        h.extend(m)
        self.sock.sendall(bytes(h) + bytes(b ^ m[i % 4] for i, b in enumerate(d)))

    def recv(self, to=60):
        self.sock.settimeout(to)
        while True:
            b0, b1 = self._r(2)
            op, ln = b0 & 0x0F, b1 & 0x7F
            if ln == 126:
                ln = unpack(">H", self._r(2))[0]
            elif ln == 127:
                ln = unpack(">Q", self._r(8))[0]
            p = self._r(ln) if ln else b""
            if op == 0x9:
                self.sock.sendall(bytes([0x8A, 0x80, 0x11, 0x22, 0x33, 0x44])); continue
            if op in (0x1, 0x2):
                return p.decode("utf-8", "replace")

    def cmd(self, m, p=None):
        self.n += 1
        self.send(json.dumps({"id": self.n, "method": m, "params": p or {}}))
        while True:
            msg = json.loads(self.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError(f"{m}: {msg['error']}")
                return msg.get("result", {})


def main():
    tabs = json.loads(urllib.request.urlopen(CDP + "/json", timeout=10).read())
    ws = WS([t for t in tabs if t.get("type") == "page"][0]["webSocketDebuggerUrl"])
    ws.cmd("Runtime.enable"); ws.cmd("Page.enable")
    ws.cmd("Emulation.setDeviceMetricsOverride",
           {"width": ANCHO, "height": 1400, "deviceScaleFactor": 1, "mobile": ANCHO < 700})
    ws.cmd("Page.navigate", {"url": f"http://localhost:{PUERTO}/curriculum.html?v={time.time()}"})
    time.sleep(2.5)

    expr = """
    (async () => {
      const imgs=[...document.querySelectorAll('.libro__portada')];
      imgs.forEach(i=>{i.loading='eager'; if(!i.complete) i.src=i.src;});
      await Promise.all(imgs.map(i=>i.decode().catch(()=>null)));
      await new Promise(r=>setTimeout(r,250));
      const r=e=>{const b=e.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height)}};
      const ul=document.querySelector('.perfil__libros');
      const bl=[...document.querySelectorAll('.perfil__bloque')];
      return JSON.stringify({
        innerWidth: innerWidth,
        docW: document.documentElement.clientWidth,
        cuerpoCols: getComputedStyle(document.querySelector('.perfil__cuerpo')).gridTemplateColumns,
        ulCols: getComputedStyle(ul).gridTemplateColumns,
        ul: r(ul),
        bloqueLibros: r(bl[1]),
        portadasCargadas: imgs.filter(i=>i.complete&&i.naturalWidth>0).length,
        de: imgs.length,
        items: [...ul.children].map(li=>{
          const m=li.querySelector('.libro__marco'), im=li.querySelector('.libro__portada');
          return {cls:li.className.replace('libro','').trim()||'-',
                  li:r(li), marco:m?r(m):null, img:im?r(im):null};
        })
      }, null, 1);
    })()"""
    out = ws.cmd("Runtime.evaluate", {"returnByValue": True, "awaitPromise": True,
                                     "expression": expr})["result"]["value"]
    print(out)


if __name__ == "__main__":
    main()
