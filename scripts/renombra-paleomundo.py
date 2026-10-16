"""renombra-paleomundo.py — saca 'paleomundo' del sitio (CR-66, 2026-10-16).

MOTIVO (dueno): el proyecto se llamaba PALEOMUNDO y se cambio a Proyecto C.E.C
POR DERECHOS DE AUTOR. El nombre viejo seguia vivo en la URL publica
(el ancla `#paleomundo`) y en el codigo.

🔴 DOS TRAMPAS QUE ESTE SCRIPT EVITA (medidas antes de escribir una linea):

 1) COLISION DE CONSTANTES. `data/museo.js` YA tiene `const CEC` (linea 1102,
    la pagina del Centro) y `js/cec.js` lee `window.CEC`. Renombrar
    `PALEOMUNDO -> CEC` habria dejado DOS `const CEC` en el mismo archivo:
    error de sintaxis -> `data/museo.js` no parsea -> SITIO EN BLANCO.
    ⇒ El nombre nuevo es `MUSEO_ITINERANTE`, que describe lo que el bloque ES
      y no colisiona con ninguna constante existente.

 2) REESCRITURA DE LA HISTORIA. Un reemplazo de texto global tambien cambia los
    COMENTARIOS que explican por que se hizo cada cosa. Medido: convertia
      "la CONSTANTE JS se llamaba `PALEOMUNDO`"  ->  "se llamaba `CEC`"   (FALSO)
      "el ancla `#paleomundo` NO cambia"         ->  "el ancla `#cec` NO cambia" (FALSO)
    ⇒ Los comentarios que NOMBRAN el ancestro se PRESERVAN: son la traza.
      Lo que se renombra es CODIGO (identificadores, anclas, clases).

QUE HACE:
  1. Ancla publica `#paleomundo` -> `#cec`   (href, id, JS)
  2. Constante    `PALEOMUNDO`   -> `MUSEO_ITINERANTE`
  3. Funcion      `pintarPaleomundo` -> `pintarMuseoItinerante`
  4. Atributo     `data-paleomundo`  -> `data-museo-itinerante`
  5. Clases CSS   `.paleomundo__*` -> `.cec-muestra__*`, `.paleomundo-sec` -> `.cec-sec`
  6. COMPATIBILIDAD: deja un `<span id="paleomundo">` invisible junto a la
     seccion, para que los enlaces YA COMPARTIDOS sigan saltando.
     Esa es la UNICA aparicion que queda, y va marcada con un comentario.

Uso:  .venv/bin/python scripts/renombra-paleomundo.py [--aplicar]
"""
import os
import re
import sys

# --- codigo: pares (patron, reemplazo). Van del mas especifico al mas general.
CODIGO = [
    # funcion JS
    (r"\bpintarPaleomundo\b", "pintarMuseoItinerante"),
    # constante JS
    (r"\bPALEOMUNDO\b(?=\s*[=.;)\]\},]|\s*$)", "MUSEO_ITINERANTE"),
    (r"\bPALEOMUNDO\b", "MUSEO_ITINERANTE"),
    # atributo de datos
    (r"\bdata-paleomundo\b", "data-museo-itinerante"),
    # clases CSS: primero las variantes largas
    (r"\.paleomundo__", ".cec-muestra__"),
    (r"\.paleomundo--", ".cec-muestra--"),
    (r"\.paleomundo-sec\b", ".cec-sec"),
    (r"\.paleomundo\b(?![-_])", ".cec-muestra"),
    # clases dentro de selectores sin punto (p. ej. dentro de :has())
    (r"\bpaleomundo__", "cec-muestra__"),
    (r"\bpaleomundo-sec\b", "cec-sec"),
    # ⚠️ CLASE EN HTML SIN PUNTO: `class="paleomundo"` no lleva punto, y la regla
    # de arriba (`.paleomundo`) solo cubre CSS. Medido: sin esto, el div del
    # contenedor quedaba con la clase vieja mientras render.js ya buscaba
    # `[data-museo-itinerante]` -> el bloque NO se pintaba y quedaba vacio.
    (r'class="paleomundo"', 'class="cec-muestra"'),
    (r"'paleomundo'", "'cec-muestra'"),
    # ancla publica
    (r"#paleomundo\b", "#cec"),
]

# Archivos donde hay CODIGO que renombrar. Los .md y los comentarios historicos
# NO entran aca: ahi la palabra es traza, no identificador.
ARCHIVOS_CODIGO = [
    "index.html", "curriculum.html", "trilobites.html", "proyecto-cec.html",
    "data/museo.js",
    "js/render.js", "js/animaciones.js", "js/menu.js", "js/cec.js",
    "css/secciones/servicios.css", "css/secciones/galeria.css",
]


def en_comentario(linea, dentro_bloque=False):
    """True si la linea es comentario (o continuacion de uno).

    ⚠️ TRAMPA MEDIDA: proteger solo las lineas que EMPIEZAN con `//` o `/*` no
    alcanza. Los comentarios de bloque tienen lineas de continuacion sin marca
    (las que el proyecto usa para explicar el por que), y esas se reescribian
    igual — dejando frases que MIENTEN sobre la historia:
        "El servicio se REEMPLAZA por PALEOMUNDO" -> "...por MUSEO_ITINERANTE"
        "(window.PALEOMUNDO). Se conserva el nombre..." -> "...(window.MUSEO...)"
    ⇒ Se pasa `dentro_bloque` para recordar si venimos de un `/*` sin cerrar.
    """
    s = linea.strip()
    if s.startswith("//") or s.startswith("/*") or s.startswith("*") \
       or s.startswith("<!--") or s.startswith("#"):
        return True
    return dentro_bloque


# El id de la seccion y su ancla de compatibilidad se tratan APARTE, porque el
# reemplazo de `#paleomundo` NO toca `id="paleomundo"` (no lleva `#`), y hay que
# dejarlo bien: `id="cec"` + un ancla vieja invisible al lado.
ID_VIEJO = re.compile(r'(\s)id="paleomundo"')
ID_NUEVO = r'\1id="cec"'

# Ancla de compatibilidad: se inserta JUSTO ANTES del cierre de la seccion.
ANCLA_COMPAT = (
    '  <!-- CR-66 (2026-10-16): ancla de COMPATIBILIDAD. El proyecto se llamaba\n'
    '       PALEOMUNDO y cambio de nombre por derechos de autor. Los enlaces YA\n'
    '       COMPARTIDOS (index.html#paleomundo en un WhatsApp o un correo) siguen\n'
    '       apuntando a ese id, y sin esto abririan la pagina SIN saltar a la\n'
    '       seccion, sin ningun error visible. Esta es la UNICA aparicion que queda\n'
    '       de la palabra, es invisible y no se muestra en ningun texto.\n'
    '       ⚠️ NO BORRAR sin revisar cuanta gente tiene enlaces guardados. -->\n'
    '  <span id="paleomundo" aria-hidden="true"></span>\n'
)


def procesar(ruta, aplicar=False):
    orig = open(ruta, encoding="utf-8").read()
    lineas = orig.split("\n")
    nuevas = []
    cambios = 0
    preservados = 0
    dentro_bloque = False

    for ln in lineas:
        # ¿esta linea esta dentro de un comentario de bloque? (estado ANTES)
        estaba_en_bloque = dentro_bloque
        # actualizar el estado para la proxima: abrir/cerrar /* */ y <!-- -->
        sin_strings = re.sub(r'"[^"]*"', '""', ln)
        if sin_strings.count("/*") > sin_strings.count("*/"):
            dentro_bloque = True
        elif "*/" in sin_strings:
            dentro_bloque = False
        if sin_strings.count("<!--") > sin_strings.count("-->"):
            dentro_bloque = True
        elif "-->" in sin_strings:
            dentro_bloque = False

        if "paleomundo" in ln.lower():
            if en_comentario(ln, estaba_en_bloque):
                nuevas.append(ln)
                preservados += 1
                continue
            nueva = ln
            # el ID se cambia antes que el ancla: `id="paleomundo"` no lleva `#`
            nueva, n_id = ID_VIEJO.subn(ID_NUEVO, nueva)
            cambios += n_id
            for pat, rep in CODIGO:
                nueva, n = re.subn(pat, rep, nueva)
                cambios += n
            nuevas.append(nueva)
        else:
            nuevas.append(ln)

    txt = "\n".join(nuevas)

    # Insertar el ancla de compatibilidad justo antes del </section> que sigue
    # al id nuevo. Se hace por texto, una sola vez.
    if 'id="cec"' in txt and 'id="paleomundo"' not in txt.replace(ANCLA_COMPAT, ""):
        i = txt.find('<section class="seccion cec-sec" id="cec">')
        if i != -1:
            j = txt.find("\n  </section>", i)
            if j != -1 and "ancla de COMPATIBILIDAD" not in txt:
                txt = txt[:j] + "\n" + ANCLA_COMPAT + txt[j:]
                cambios += 1

    if aplicar and cambios:
        open(ruta, "w", encoding="utf-8").write(txt)
    return cambios, preservados


def main():
    aplicar = "--aplicar" in sys.argv
    print("=" * 78)
    print("CR-66 · sacar 'paleomundo' del sitio" + ("   [APLICAR]" if aplicar else "   [simular]"))
    print("=" * 78)
    print(f"{'archivo':42s} {'cambios':>8s} {'comentarios preservados':>24s}")
    tot_c = tot_p = 0
    for ruta in ARCHIVOS_CODIGO:
        if not os.path.exists(ruta):
            continue
        c, p = procesar(ruta, aplicar)
        if c or p:
            print(f"  {ruta:40s} {c:8d} {p:24d}")
        tot_c += c
        tot_p += p
    print(f"\n  TOTAL cambios de codigo: {tot_c}")
    print(f"  TOTAL comentarios preservados: {tot_p}")
    if not aplicar:
        print("\n  Nada modificado. Para aplicar: --aplicar")


if __name__ == "__main__":
    main()
