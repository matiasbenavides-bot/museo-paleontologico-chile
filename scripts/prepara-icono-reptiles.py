#!/usr/bin/env python3
"""CR-98 — Del JPEG del dueño (WhatsApp) al PNG RGBA que la card necesita.

POR QUÉ EXISTE
  El dueño mandó el ícono como JPEG de WhatsApp: 1408x768, NEGRO sobre BLANCO.
  Ese archivo NO sirve tal cual en la card, por dos motivos MEDIDOS:

    a) FONDO BLANCO. El sitio es azul oscuro (#0a2a52 en la card). Un JPEG con
       fondo blanco pinta un parche blanco alrededor del dibujo.

    b) TRAZO DEMASIADO FINO. La caja del ícono mide
       `clamp(58px, 4.6vw, 62px)` -> 62 px en escritorio. Contado POR PÍXELES
       sobre la card real, el JPEG tal cual daba **4 px celestes**, contra
       **39** del trilobite y **271** del ammonite. A 62 px no se leía.

QUÉ HACE
  1. Escala de grises; el negativo es el canal alfa (trazo opaco, papel fuera).
  2. Umbral + ganancia para endurecer el trazo.
  3. MaxFilter(3) para ENGROSARLO (sin esto sigue sin leerse a 62 px).
  4. Pinta el RGB con `#51adc6`, el MISMO celeste de los otros seis íconos
     (verificado: pieza-trilobites.png es exactamente (81,173,198)).
  5. Recorta al contenido, cuadra a 512x512 con 6% de margen, LANCZOS.

USO
  python3 scripts/prepara-icono-pterosaurios.py <entrada.jpeg> [salida.png]

VERIFICACIÓN OBLIGATORIA DESPUÉS
  No basta con mirar el archivo: hay que montarlo en la card REAL y contar
  píxeles del color esperado. Un `naturalWidth` correcto es compatible con un
  ícono invisible. Ver `references/cr98-pterosaurios.md` §2.
"""
import sys
from PIL import Image, ImageFilter
import numpy as np

CELESTE = (81, 173, 198)  # --celeste de la paleta, el de los otros 6 íconos
UMBRAL = 30        # por debajo de esto, transparente
GANANCIA = 1.6     # endurece el trazo
ENGROSAR = 3       # MaxFilter; 1 = sin engrosar
MARGEN = 0.06      # 6% de aire para que no toque el borde de la caja


def preparar(entrada: str, salida: str) -> Image.Image:
    gris = Image.open(entrada).convert("L")
    a = np.array(gris).astype(np.float32)

    alfa = np.clip(255.0 - a, 0, 255)
    alfa[alfa < UMBRAL] = 0
    m = alfa >= UMBRAL
    alfa[m] = np.clip(alfa[m] * GANANCIA, 0, 255)

    al = Image.fromarray(alfa.astype(np.uint8), "L")
    if ENGROSAR > 1:
        al = al.filter(ImageFilter.MaxFilter(ENGROSAR))

    cap = np.array(al)
    rgba = np.dstack([
        np.full_like(cap, CELESTE[0], dtype=np.uint8),
        np.full_like(cap, CELESTE[1], dtype=np.uint8),
        np.full_like(cap, CELESTE[2], dtype=np.uint8),
        cap,
    ])
    img = Image.fromarray(rgba, "RGBA")

    bb = img.split()[3].getbbox()
    if not bb:
        raise SystemExit("ERROR: la imagen no tiene trazo visible (¿está en blanco?)")
    img = img.crop(bb)

    cw, ch = img.size
    lado = max(cw, ch)
    cuadro = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    cuadro.paste(img, ((lado - cw) // 2, (lado - ch) // 2), img)

    m_px = int(lado * MARGEN)
    final = Image.new("RGBA", (lado + 2 * m_px, lado + 2 * m_px), (0, 0, 0, 0))
    final.paste(cuadro, (m_px, m_px), cuadro)
    final = final.resize((512, 512), Image.LANCZOS)

    final.save(salida)
    return final


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    entrada = sys.argv[1]
    salida = sys.argv[2] if len(sys.argv) > 2 else "assets/img/pieza-pterosaurios.png"
    out = preparar(entrada, salida)
    al = np.array(out.split()[3])
    print(f"OK  {salida}  {out.size}  {out.mode}")
    print(f"    cobertura de trazo: {100*(al>40).sum()/al.size:.1f}%")
    print("    ⚠️ FALTA medirlo por píxeles sobre la card real antes de publicar.")
