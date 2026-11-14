#!/usr/bin/env python3
"""
Quita UN bloque de DEC-122 de css/secciones/animaciones.css (o el archivo H
completo) y deja el CSS válido. Es el "revertir por fases" que pidió el dueño.

POR QUÉ NO `git revert`:
  Los siete commits de DEC-122 escriben los bloques EN EL MISMO archivo, uno
  pegado al siguiente. `git revert <sha>` funciona al revés (desde el último),
  pero para un bloque del medio git tiene que alinear un hunk de 19 líneas
  contra un archivo que ya creció 140: elige mal y se lleva también los
  bloques C, D, E y F. Medido: 101 líneas de conflicto al revertir B.

  Este script no adivina: borra EXACTAMENTE desde el comentario del bloque
  hasta la linea anterior al comentario del bloque siguiente. Verifica llaves
  y comentarios ANTES de escribir.

Uso:
  python3 scripts/revierte-bloque-dec122.py B        # quita el bloque B
  python3 scripts/revierte-bloque-dec122.py H        # desactiva el import de H
  python3 scripts/revierte-bloque-dec122.py --lista
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSS = RAIZ / "css/secciones/animaciones.css"
MAIN = RAIZ / "css/main.css"
REDUCED = RAIZ / "css/secciones/animaciones-reduced.css"

# Marca de inicio de cada bloque, tal como quedó escrito
MARCAS = {
    "B": r"/\* --- B\) La card respira al pasar el cursor ---",
    "C": r"/\* --- C\) El separador barre una luz de 1px, una sola vez ---",
    "E": r"/\* --- E\) El CTA deja de brillar solo ---",
    "F": r"/\* --- F\) El menú móvil entra escalonado ---",
    "G": r"/\* --- G\) Llegar a un ancla no es un salto seco ---",
}
# El comentario de cabecera de la sección DEC-122 (no se quita nunca: es el mapa)
CABECERA = r"/\*\s*=+\s*\n\s*DEC-122 — Detalles de interfaz"


def lineas() -> list[str]:
    return CSS.read_text(encoding="utf-8").split("\n")


def verifica(texto: str) -> tuple[bool, str]:
    d = 0
    mn = 0
    for c in texto:
        if c == "{":
            d += 1
        elif c == "}":
            d -= 1
            mn = min(mn, d)
    abre = texto.count("/*")
    cierra = texto.count("*/")
    if d != 0 or mn < 0:
        return False, f"llaves desbalanceadas (balance={d}, min={mn})"
    if abre != cierra:
        return False, f"comentarios sin cerrar (/* ={abre}, */ ={cierra})"
    return True, "ok"


def quita_bloque(clave: str) -> int:
    L = lineas()
    ini = None
    for i, ln in enumerate(L):
        if re.search(MARCAS[clave], ln):
            ini = i
            break
    if ini is None:
        print(f"  bloque {clave}: no está en el archivo (¿ya revertido?)")
        return 0

    # fin = linea anterior al siguiente comentario de bloque, o justo antes de
    # la sección de accesibilidad si no hay más bloques.
    fin = None
    for j in range(ini + 1, len(L)):
        if re.search(r"/\* --- [A-H]\) ", L[j]) or re.search(r"/\* --- Accesibilidad: con movimiento", L[j]):
            fin = j
            break
    if fin is None:
        fin = len(L)
    # recortar líneas en blanco iniciales del bloque siguiente
    while fin > ini and L[fin - 1].strip() == "":
        fin -= 1

    nuevas = L[:ini] + L[fin:]
    texto = "\n".join(nuevas)
    ok, msg = verifica(texto)
    if not ok:
        print(f"  bloque {clave}: ABORTADO — {msg}. El archivo NO se tocó.")
        return 1
    CSS.write_text(texto, encoding="utf-8")
    print(f"  bloque {clave}: quitado de animaciones.css ({fin - ini} líneas) · {msg}")
    return 0


def quita_h() -> int:
    if not REDUCED.exists():
        print("  bloque H: animaciones-reduced.css ya no existe")
        return 0
    txt = MAIN.read_text(encoding="utf-8")
    nuevo = re.sub(
        r"\n/\* H de DEC-122:[^*]*\*/\n@import url\(\"secciones/animaciones-reduced\.css\"\);",
        "",
        txt,
    )
    if nuevo == txt:
        print("  bloque H: el import ya no estaba en main.css")
    else:
        MAIN.write_text(nuevo, encoding="utf-8")
        print("  bloque H: import quitado de main.css")
    REDUCED.unlink()
    print("  bloque H: animaciones-reduced.css borrado")
    return 0


def lista() -> int:
    txt = CSS.read_text(encoding="utf-8")
    print("bloques presentes en animaciones.css:")
    for k, pat in MARCAS.items():
        print(f"  {k}: {'SI' if re.search(pat, txt) else 'no'}")
    print(f"  H: {'SI' if REDUCED.exists() else 'no'} (archivo aparte)")
    ok, msg = verifica(txt)
    print(f"\nestado del CSS: {msg}")
    return 0 if ok else 1


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    arg = sys.argv[1].upper()
    if arg in ("--LISTA", "-L"):
        sys.exit(lista())
    if arg == "H":
        sys.exit(quita_h())
    if arg == "A":
        print("  bloque A no se revierte con este script: es la correccion del\n"
              "  keyframes huerfano. Para deshacerla, git revert e0569bc.")
        sys.exit(2)
    if arg not in MARCAS:
        print(f"bloque desconocido: {arg}. Opciones: {', '.join(MARCAS)}, H")
        sys.exit(2)
    sys.exit(quita_bloque(arg))
