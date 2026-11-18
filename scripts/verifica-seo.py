#!/usr/bin/env python3
"""
CR-126 · Verifica que el sitio tenga los datos que lo hacen visible en Google.

MIDE, no supone. Contra las 12 paginas del repo:
  · exactamente 1 <link rel="canonical">, con la URL correcta de ESA pagina
  · exactamente 1 og:image, y que el archivo exista en disco
  · og:url == canonical
  · exactamente 1 bloque JSON-LD, PARSEABLE, con @context y @graph de 4 nodos
  · el JSON-LD declara telefono, direccion, coordenadas y horario
  · el telefono del JSON-LD NO es el enmascarado (telefonoLink)
  · robots.txt existe y declara el sitemap
  · sitemap.xml parsea y lista las 12 paginas, todas con lastmod

SALIDA
  exit 0 = todo bien · exit 1 = hay algo roto (imprime que)

USO
  python3 scripts/verifica-seo.py [url_base]
  Con url_base mide contra la URL EN VIVO (recomendado tras publicar).
"""

import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://matiasbenavides-bot.github.io/museo-paleontologico-chile/"

PAGINAS = [
    "index.html", "amonites.html", "ambar.html", "curriculum.html",
    "dinosaurios-chile.html", "dinosaurios.html", "huellas.html",
    "proyecto-cec.html", "pterosaurios.html", "reptiles.html",
    "tiburones.html", "trilobites.html",
]

fallos = []
ok = 0


def falla(msg):
    fallos.append(msg)


def lee(pagina, url_base=None):
    if url_base:
        u = url_base.rstrip("/") + "/" + ("" if pagina == "index.html" else pagina)
        with urllib.request.urlopen(u + "?cb=1", timeout=30) as r:
            return r.read().decode("utf-8")
    with open(os.path.join(RAIZ, pagina), encoding="utf-8") as f:
        return f.read()


def revisa_pagina(pagina, html):
    global ok
    url_esperada = BASE if pagina == "index.html" else BASE + pagina
    antes = len(fallos)

    # --- canonical ---
    canon = re.findall(r'<link rel="canonical" href="([^"]+)"', html)
    if len(canon) != 1:
        falla(f"{pagina}: {len(canon)} canonical (debe ser 1)")
    elif canon[0] != url_esperada:
        falla(f"{pagina}: canonical '{canon[0]}' != '{url_esperada}'")

    # --- og:image ---
    ogimg = re.findall(r'<meta property="og:image" content="([^"]+)"', html)
    if len(ogimg) != 1:
        falla(f"{pagina}: {len(ogimg)} og:image (debe ser 1)")
    else:
        rel = ogimg[0].replace(BASE, "")
        if not os.path.exists(os.path.join(RAIZ, rel)):
            falla(f"{pagina}: og:image apunta a '{rel}', que NO existe en disco")
        if not ogimg[0].startswith("https://"):
            falla(f"{pagina}: og:image no es absoluta")
        for prop, valor in [("og:image:width", "1200"), ("og:image:height", "630")]:
            if f'property="{prop}" content="{valor}"' not in html:
                falla(f"{pagina}: falta {prop}={valor}")

    # --- twitter card ---
    if 'name="twitter:card" content="summary_large_image"' not in html:
        falla(f"{pagina}: falta twitter:card summary_large_image")

    # --- og:url == canonical ---
    ogurl = re.findall(r'<meta property="og:url" content="([^"]+)"', html)
    if len(ogurl) != 1:
        falla(f"{pagina}: {len(ogurl)} og:url (debe ser 1)")
    elif canon and ogurl[0] != canon[0]:
        falla(f"{pagina}: og:url != canonical")

    # --- JSON-LD ---
    bloques = re.findall(r'<script type="application/ld\+json">(.*?)</script>',
                         html, re.S)
    if len(bloques) != 1:
        falla(f"{pagina}: {len(bloques)} bloques JSON-LD (debe ser 1)")
        return
    try:
        ld = json.loads(bloques[0])
    except json.JSONDecodeError as e:
        falla(f"{pagina}: JSON-LD NO parsea: {e}")
        return
    if ld.get("@context") != "https://schema.org":
        falla(f"{pagina}: @context incorrecto")
    graph = ld.get("@graph", [])
    if len(graph) != 4:
        falla(f"{pagina}: @graph tiene {len(graph)} nodos (esperados 4)")
    tipos = {n.get("@type") for n in graph}
    if "Museum" not in tipos:
        falla(f"{pagina}: el @graph no tiene el nodo Museum")
    if "Person" not in tipos:
        falla(f"{pagina}: el @graph no tiene el nodo Person (director)")

    museo = next((n for n in graph if n.get("@type") == "Museum"), {})
    for campo in ["telephone", "address", "geo", "openingHoursSpecification"]:
        if not museo.get(campo):
            falla(f"{pagina}: el Museum no declara '{campo}'")
    tel = museo.get("telephone", "")
    if "*" in tel:
        falla(f"{pagina}: el telefono del JSON-LD sale ENMASCARADO ('{tel}')")

    # la pagina misma debe ser del tipo correcto y apuntar al museo
    pag = next((n for n in graph if str(n.get("@type", "")).endswith("Page")), {})
    if pag.get("url") != url_esperada:
        falla(f"{pagina}: el nodo de pagina apunta a '{pag.get('url')}'")

    if len(fallos) == antes:
        ok += 1


def revisa_robots():
    ruta = os.path.join(RAIZ, "robots.txt")
    if not os.path.exists(ruta):
        falla("robots.txt NO existe")
        return
    txt = open(ruta, encoding="utf-8").read()
    if f"Sitemap: {BASE}sitemap.xml" not in txt:
        falla("robots.txt no declara el sitemap con URL absoluta")
    if "Disallow: /\n" in txt and "Allow: /\n" not in txt:
        falla("robots.txt bloquea el sitio entero")


def revisa_sitemap():
    ruta = os.path.join(RAIZ, "sitemap.xml")
    if not os.path.exists(ruta):
        falla("sitemap.xml NO existe")
        return
    try:
        raiz = ET.parse(ruta).getroot()
    except ET.ParseError as e:
        falla(f"sitemap.xml NO parsea: {e}")
        return
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = raiz.findall("s:url", ns)
    if len(urls) != len(PAGINAS):
        falla(f"sitemap.xml tiene {len(urls)} URLs, el sitio tiene {len(PAGINAS)} paginas")
    locs = set()
    for u in urls:
        loc = u.find("s:loc", ns)
        lm = u.find("s:lastmod", ns)
        if loc is None:
            falla("sitemap.xml: una URL sin <loc>")
            continue
        locs.add(loc.text)
        if lm is None:
            falla(f"sitemap.xml: {loc.text} sin lastmod")
        elif not re.fullmatch(r"\d{4}-\d{2}-\d{2}", lm.text):
            falla(f"sitemap.xml: lastmod '{lm.text}' no es YYYY-MM-DD")
    for p in PAGINAS:
        esperada = BASE if p == "index.html" else BASE + p
        if esperada not in locs:
            falla(f"sitemap.xml: falta la pagina {p}")


def main():
    url_base = sys.argv[1] if len(sys.argv) > 1 else None
    modo = "EN VIVO" if url_base else "LOCAL"
    print(f"Verificando SEO · {modo}\n")

    revisa_robots()
    revisa_sitemap()

    for p in PAGINAS:
        try:
            revisa_pagina(p, lee(p, url_base))
        except Exception as e:
            falla(f"{p}: no se pudo leer ({e})")

    print(f"paginas OK: {ok}/{len(PAGINAS)}")
    if fallos:
        print(f"\nFALLOS ({len(fallos)}):")
        for f in fallos:
            print("  ✗", f)
        return 1
    print("\nTODO OK: canonical, og:image, twitter, JSON-LD, robots y sitemap.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
