#!/usr/bin/env python3
"""
CR-126b · Convierte el parrafo corrido de localidades en LISTA numerada.

POR QUE UN SCRIPT Y NO EDITAR EL DATA A MANO
    El texto es del Word de Juan Castillo Cornejo. Partirlo a mano en 21
    items invita a perder o cambiar una palabra, y eso sería reescribir el
    texto del autor. Este script PARTE el párrafo por el patrón «N) » y
    verifica al final que la concatenación de los items sea IDÉNTICA al
    original, palabra por palabra (difflib). Si no cuadra, NO escribe.

QUE PRODUCE
    En data/museo.js, la figura del mapa pasa de:
        fichaFiguras: [ "<21 localidades en un solo párrafo>" ]
    a:
        fichaTitulo: "Mapa de las principales localidades con tiburones fósiles en Chile (Mapa Juan Castillo Cornejo)."
        fichaFiguras: [ "1) La Portada y Caleta Herradura de Mejillones, Región de Antofagasta.",
                        "2) Cerro Negro, Región de Antofagasta.", ... ]

    O sea: el título se separa del listado, y el listado queda como un item
    por localidad. El render los pinta como <ol>.

USO
    python3 scripts/parte-localidades.py --revisar   # solo muestra
    python3 scripts/parte-localidades.py             # aplica
"""

import json
import re
import subprocess
import sys
import os
import difflib

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def lee_tiburones():
    js = ("global.window={};require('./data/museo.js');"
          "process.stdout.write(JSON.stringify(window.TIBURONES));")
    out = subprocess.run(["node", "-e", js], cwd=RAIZ,
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def busca_figura_con_ficha(T):
    """Devuelve (seccion, indice) de la figura que trae fichaFiguras."""
    for s in T["secciones"]:
        for i, im in enumerate(s.get("imagenes") or []):
            if im.get("fichaFiguras"):
                return s, i
    return None, None


def parte(texto):
    """
    Parte por el patrón «N) » al inicio de una localidad.

    🔴 NO se usa re.split con un separador que coma el número: el «1)» forma
    parte del texto del Word y tiene que sobrevivir en cada item. Se buscan
    las POSICIONES y se corta ahí, conservando el prefijo.
    """
    # posiciones donde empieza una localidad:  N)  con N de 1 a 99
    posiciones = [(m.start(), int(m.group(1)))
                  for m in re.finditer(r"(?:(?<=\s)|^)(\d{1,2})\)\s", texto)]
    if not posiciones:
        return None, None

    titulo = texto[:posiciones[0][0]].strip()
    items = []
    for k, (pos, num) in enumerate(posiciones):
        fin = posiciones[k + 1][0] if k + 1 < len(posiciones) else len(texto)
        items.append(texto[pos:fin].strip())

    # numeración consecutiva, sin huecos ni repetidos
    numeros = [n for _, n in posiciones]
    esperado = list(range(1, len(numeros) + 1))
    if numeros != esperado:
        return titulo, ("NUMERACION_ROTA", numeros)

    return titulo, items


def main():
    revisar = "--revisar" in sys.argv
    T = lee_tiburones()
    sec, idx = busca_figura_con_ficha(T)
    if sec is None:
        sys.exit("ERROR: no hay ninguna figura con fichaFiguras en TIBURONES")

    im = sec["imagenes"][idx]
    original = " ".join(im["fichaFiguras"])
    titulo, items = parte(original)

    if items is None:
        sys.exit("ERROR: el texto no tiene ninguna localidad numerada")
    if isinstance(items, tuple):
        sys.exit(f"ERROR: numeración rota: {items[1]}")

    print(f"figura       {im['src']}")
    print(f"seccion      {sec['id']}")
    print(f"titulo       {titulo[:90]}...")
    print(f"items        {len(items)}")
    for it in items[:3]:
        print(f"   · {it[:88]}")
    print("   ...")
    print(f"   · {items[-1][:88]}")

    # --- VERIFICACIÓN: cero palabras perdidas ---
    reconstruido = titulo + " " + " ".join(items)
    a = original.split()
    b = reconstruido.split()
    difs = [(tag, " ".join(a[i1:i2]), " ".join(b[j1:j2]))
            for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes()
            if tag != "equal"]
    # la única diferencia admisible es un espacio que se colapsó al unir
    difs_reales = [d for d in difs if d[1] or d[2]]
    print(f"\nverificacion difflib: {len(difs_reales)} diferencias de palabra")
    if difs_reales:
        for d in difs_reales[:10]:
            print("   ✗", d)
        sys.exit("ABORTADO: el texto cambiaría. No se escribe nada.")

    if revisar:
        print("\n(revisar: no se escribió nada)")
        return 0

    im.pop("fichaFiguras", None)
    im["fichaTitulo"] = titulo
    im["fichaLista"] = items

    nuevo = json.dumps(T, ensure_ascii=False, indent=2)
    print("\nOK: 0 palabras cambiadas. Falta escribir el data "
          "(se hace con patch guiado, no volcando JSON).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
