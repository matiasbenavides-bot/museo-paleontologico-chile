#!/usr/bin/env python3
"""
CR-126 · Aplica a las 12 paginas los datos que hacen visible el sitio en Google.

PROPOSITO
    Inyectar en el <head> de cada pagina, de forma IDEMPOTENTE:
      · <link rel="canonical">
      · og:url / og:image / og:image:width / og:image:height / og:image:alt
      · og:site_name y twitter:card (summary_large_image)
      · UN bloque JSON-LD con el @graph del museo + la pagina

POR QUE UN SCRIPT Y NO 12 EDICIONES A MANO
    El sitio no tiene generador de <head>: las 12 cabeceras estan escritas a
    mano (medido, CR-126). Tocar 12 archivos a mano se desincroniza en la
    primera correccion. Este script se puede volver a correr sin duplicar
    nada: si la etiqueta ya esta, la REESCRIBE en el mismo lugar.

POR QUE JSON-LD Y NO MICRODATOS
    Es el formato que Google lee hoy, va en un solo bloque y no ensucia el
    HTML visible. Con el, Google puede mostrar horario, direccion, telefono y
    las colecciones como resultado enriquecido.

LO QUE **NO** HACE (a proposito)
    · NO toca <meta name="keywords">: Google lo ignora desde 2009. Decision
      del dueno en CR-126.
    · NO reescribe titulos ni descripciones: ya existen, escritos uno por uno,
      y son mejores que cualquier plantilla.
    · NO inventa datos: horario, telefono, direccion y coordenadas se LEEN de
      data/museo.js, que es la fuente unica del proyecto (DEC-005).

RAIZ URL
    GitHub Pages sirve el sitio desde una SUBCARPETA. Todas las URLs
    canonicas y del sitemap llevan /museo-paleontologico-chile/ o quedan
    apuntando a la raiz de github.io.

USO
    python3 scripts/aplica-seo.py            # aplica
    python3 scripts/aplica-seo.py --revisar  # solo informa, no escribe
"""

import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_URL = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile/"

# Marca el bloque JSON-LD para poder reescribirlo y no duplicarlo.
INI = "<!-- CR-126: datos estructurados (Google). Generado por scripts/aplica-seo.py -->"
FIN = "<!-- /CR-126 -->"

# Pagina -> (tipo schema.org, etiqueta del breadcrumb)
PAGINAS = {
    "index.html":            ("WebPage",        None),
    "amonites.html":         ("CollectionPage", "Ammonites"),
    "ambar.html":            ("CollectionPage", "Ámbar"),
    "curriculum.html":       ("ProfilePage",    "Currículum del director"),
    "dinosaurios-chile.html":("CollectionPage", "Dinosaurios en Chile"),
    "dinosaurios.html":      ("CollectionPage", "Dinosaurios"),
    "huellas.html":          ("CollectionPage", "Huellas de dinosaurios"),
    "proyecto-cec.html":     ("WebPage",        "Proyecto C.E.C"),
    "pterosaurios.html":     ("CollectionPage", "Pterosaurios en Chile"),
    "reptiles.html":         ("CollectionPage", "Reptiles marinos en Chile"),
    "tiburones.html":        ("CollectionPage", "Tiburones"),
    "trilobites.html":       ("CollectionPage", "Trilobites"),
}

# schema.org DayOfWeek. El data usa 0=Dom ... 6=Sab.
DIAS = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
        4: "Thursday", 5: "Friday", 6: "Saturday"}


def lee_data():
    """Lee data/museo.js con node y devuelve un dict JSON. Fuente unica (DEC-005)."""
    js = (
        "global.window={};require('./data/museo.js');"
        "const M=window.MUSEO;"
        "process.stdout.write(JSON.stringify({"
        "nombre:M.nombre,nombreLargo:M.nombreLargo,sigla:M.sigla,"
        "descripcionCorta:M.descripcionCorta,director:M.director,"
        "ubicacion:M.ubicacion,contacto:M.contacto,horarios:M.horarios,"
        "estado:M.estado}));"
    )
    out = subprocess.run(["node", "-e", js], cwd=RAIZ,
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def minutos_a_hhmm(m):
    return f"{m // 60:02d}:{m % 60:02d}"


def construye_horario(M):
    """
    Deriva openingHoursSpecification de `estado.abre/cierra`, que es el dato
    que YA calcula el estado del sitio. No se escribe a mano: si el dueno
    cambia el horario en el data, esto cambia solo.

    ⚠️ `abre[dia] === null` significa CERRADO todo ese dia (medido: lunes).
    Ese dia NO se declara en JSON-LD: ausencia de horario = cerrado, que es
    exactamente lo que queremos que Google muestre.
    """
    abre, cierra = M["estado"]["abre"], M["estado"]["cierra"]
    grupos = {}   # (abre, cierra) -> [dias]
    for dia in range(7):
        a, c = abre.get(str(dia)), cierra.get(str(dia))
        if a is None or c is None:
            continue
        grupos.setdefault((a, c), []).append(DIAS[dia])
    spec = []
    for (a, c), dias in grupos.items():
        spec.append({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": dias,
            "opens": minutos_a_hhmm(a),
            "closes": minutos_a_hhmm(c),
        })
    return spec


def construye_graph(M, pagina):
    """Un @graph con 4 nodos enlazados por @id. Nada se repite en cada nodo."""
    tipo_pagina, etiqueta = PAGINAS[pagina]
    url = BASE_URL if pagina == "index.html" else BASE_URL + pagina
    museo_id = BASE_URL + "#museo"
    director_id = BASE_URL + "#director"

    u = M["ubicacion"]
    c = M["contacto"]
    d = M["director"]

    # Coordenadas: se sacan del enlace oficial de Google Maps (fuente del data).
    coords = re.search(r"query=(-?[\d.]+),(-?[\d.]+)", u["mapaUrl"])
    lat, lng = (coords.group(1), coords.group(2)) if coords else (None, None)

    museo = {
        "@type": "Museum",
        "@id": museo_id,
        "name": M["nombreLargo"],
        "alternateName": M["sigla"],
        "description": M["descripcionCorta"],
        "url": BASE_URL,
        "image": BASE_URL + "assets/img/og-mpch.jpg",
        "logo": BASE_URL + "assets/img/logo-mpch-placa.png",
        # El telefono se toma del campo `telefono` (formato legible, con +56),
        # NUNCA de `telefonoLink`, que viene enmascarado a proposito.
        "telephone": c["telefono"],
        "email": c["correos"][0] if c.get("correos") else None,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": u["direccion"],
            "addressLocality": "Santiago",
            "addressRegion": "Región Metropolitana",
            "addressCountry": "CL",
        },
        "sameAs": [c["whatsapp"]["url"]] if c.get("whatsapp") else None,
        "employee": {"@id": director_id},
    }
    if lat and lng:
        museo["geo"] = {"@type": "GeoCoordinates",
                        "latitude": float(lat), "longitude": float(lng)}
    spec = construye_horario(M)
    if spec:
        museo["openingHoursSpecification"] = spec

    director = {
        "@type": "Person",
        "@id": director_id,
        # Nombre EXACTO como lo publica curriculum.html (medido: "Juan
        # Castillo Cornejo"). El data lo guarda en MAYÚSCULAS para el pie de
        # créditos; aquí se capitaliza palabra por palabra SIN .title(), que
        # destrozaría apellidos. Si el dueño corrige el nombre en el data,
        # cambia en los dos lados a la vez.
        "name": " ".join(w.capitalize() for w in d["nombre"].split()),
        "jobTitle": d["cargo"],
        "worksFor": {"@id": museo_id},
    }

    web = {
        "@type": "WebSite",
        "@id": BASE_URL + "#sitio",
        "url": BASE_URL,
        "name": M["nombreLargo"],
        "inLanguage": "es-CL",
        "publisher": {"@id": museo_id},
    }

    pag = {
        "@type": tipo_pagina,
        "@id": url + "#pagina",
        "url": url,
        "isPartOf": {"@id": BASE_URL + "#sitio"},
        "about": {"@id": museo_id},
        "inLanguage": "es-CL",
        "primaryImageOfPage": BASE_URL + "assets/img/og-mpch.jpg",
    }
    if etiqueta:
        pag["name"] = etiqueta
        pag["breadcrumb"] = {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1,
                 "name": "Museo Paleontológico de Chile", "item": BASE_URL},
                {"@type": "ListItem", "position": 2,
                 "name": etiqueta, "item": url},
            ],
        }

    graph = {"@context": "https://schema.org", "@graph": [museo, director, web, pag]}

    # Limpieza: los None no se serializan (web es mas chico y no confunde).
    def poda(o):
        if isinstance(o, dict):
            return {k: poda(v) for k, v in o.items() if v is not None}
        if isinstance(o, list):
            return [poda(x) for x in o]
        return o
    return poda(graph)


def quita_bloque(html):
    """
    Quita el bloque JSON-LD anterior si existe (para reescribirlo).

    🔴 IDEMPOTENCIA: el regex se lleva UN solo salto de linea pegado al bloque.
    Medido en CR-126: sin el `\\n?` acotado, cada pasada dejaba dos lineas en
    blanco en el <head> y a la tercera corrida ya eran once. Se limpian los
    espacios y el salto de linea que introdujo la pasada anterior, ni uno mas,
    para no comerse el formato del HTML original.
    """
    patron = re.compile(r"\n?" + re.escape(INI) + r".*?" + re.escape(FIN) + r"\n?", re.S)
    return patron.sub("", html)


def inyecta(html, M, pagina):
    html = quita_bloque(html)
    url = BASE_URL if pagina == "index.html" else BASE_URL + pagina
    img = BASE_URL + "assets/img/og-mpch.jpg"

    # 1. quitar las etiquetas que este script administra, si ya estaban.
    #    🔴 El `[ \t]*` final es lo que hace IDEMPOTENTE al script: sin el, cada
    #    pasada se comia el salto de linea de la etiqueta anterior y reponia
    #    dos, y el archivo crecia una linea en blanco por corrida (medido en
    #    CR-126: 2 pasadas = 2 lineas nuevas). Limpiando el espacio sobrante,
    #    la segunda pasada no encuentra nada que cambiar.
    for patron in [
        r'[ \t]*\n?<link rel="canonical"[^>]*>',
        r'[ \t]*\n?<meta property="og:url"[^>]*>',
        r'[ \t]*\n?<meta property="og:site_name"[^>]*>',
        r'[ \t]*\n?<meta property="og:image[^>]*>',
        r'[ \t]*\n?<meta name="twitter:card"[^>]*>',
    ]:
        html = re.sub(patron, "", html)

    bloque = (
        f'\n<link rel="canonical" href="{url}">'
        f'\n<meta property="og:url" content="{url}">'
        f'\n<meta property="og:site_name" content="Museo Paleontológico de Chile">'
        f'\n<meta property="og:image" content="{img}">'
        f'\n<meta property="og:image:width" content="1200">'
        f'\n<meta property="og:image:height" content="630">'
        f'\n<meta property="og:image:alt" content="Museo Paleontológico de Chile — Parque O\'Higgins, Santiago">'
        f'\n<meta name="twitter:card" content="summary_large_image">'
    )

    # 2. el bloque va ANTES del </head>, junto al resto de metadatos
    ld = construye_graph(M, pagina)
    bloque_ld = (
        f"\n{INI}\n<script type=\"application/ld+json\">\n"
        + json.dumps(ld, ensure_ascii=False, indent=2)
        + f"\n</script>\n{FIN}\n"
    )

    # se ancla al cierre de </head>; si no existe, es un error fatal
    if "</head>" not in html:
        raise SystemExit(f"ERROR: {pagina} no tiene </head>")
    return html.replace("</head>", bloque + bloque_ld + "</head>", 1)


def main():
    revisar = "--revisar" in sys.argv
    M = lee_data()
    print(f"data leido · {M['nombreLargo']} · tel {M['contacto']['telefono']}")
    print(f"horario derivado: "
          f"{len(construye_horario(M))} bloque(s) de openingHoursSpecification")

    for pagina in PAGINAS:
        ruta = os.path.join(RAIZ, pagina)
        with open(ruta, encoding="utf-8") as f:
            antes = f.read()
        despues = inyecta(antes, M, pagina)

        # --- comprobaciones antes de escribir ---
        n_canon = despues.count('rel="canonical"')
        n_img = despues.count('property="og:image"')
        n_ld = despues.count('application/ld+json')
        assert n_canon == 1, f"{pagina}: {n_canon} canonical"
        assert n_img == 1, f"{pagina}: {n_img} og:image"
        assert n_ld == 1, f"{pagina}: {n_ld} bloques ld+json"
        # el JSON tiene que ser valido de punta a punta
        m = re.search(r'<script type="application/ld\+json">(.*?)</script>',
                      despues, re.S)
        json.loads(m.group(1))

        if revisar:
            print(f"  {pagina:26s} OK (no escrito)")
            continue
        if despues != antes:
            with open(ruta, "w", encoding="utf-8") as f:
                f.write(despues)
            print(f"  {pagina:26s} escrito  (+{len(despues) - len(antes)} car)")
        else:
            print(f"  {pagina:26s} sin cambios")

    print("\nListo. Verificar: python3 scripts/verifica-seo.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
