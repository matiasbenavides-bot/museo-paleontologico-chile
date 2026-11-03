#!/usr/bin/env python3
"""Genera el bloque `const REPTILES` de data/museo.js.

- Texto: LITERAL del docx (solo erratas de copiado declaradas, ver ERRATAS).
- `tras`: indice del parrafo (0-based, dentro de su seccion del sitio) tras el
  cual va cada figura. Derivado de /tmp/reptiles-mapeo.json, nunca a mano.
- Cursivas: nombres cientificos con asteriscos (sintaxis del render, CR-86b).

Escribe /tmp/bloque-reptiles.js para revisar antes de insertar.
"""
import json, re

MAPEO = json.load(open('/tmp/reptiles-mapeo.json'))
MED = json.load(open('/tmp/reptiles-medidas.json'))
items = MAPEO['items']
pies = {int(k): v for k, v in MAPEO['pies'].items()}

# ---------- ERRATAS DECLARADAS (solo artefactos de copiado, NUNCA palabras) ----------
ERRATAS = [
    ('ocupo uno de los nichos', 'ocupó uno de los nichos'),
    ('hocico pre-sentaba', 'hocico presentaba'),
    ('cabeza. Su cráneo', 'cabeza. Su cráneo'),          # sin cambio (marcador)
    ('cráneo mu-cho más', 'cráneo mucho más'),
    ('que termina-ba', 'que terminaba'),
    ('grue-sos dientes', 'gruesos dientes'),
    ('anillo escle¬rótico', 'anillo esclerótico'),
    ('estudio otros restos', 'estudió otros restos'),
    ('los reasigno a Pliosaurus', 'los reasignó a Pliosaurus'),
    ('lo nomino como', 'lo nominó como'),
    ('En muchas otras localidades Han aparecido', 'En muchas otras localidades han aparecido'),
    ('en los en los mares', 'en los mares'),
    ('una dieta la constituían', 'una dieta la constituían'),
    ('vertebras aisladas', 'vértebras aisladas'),
    ('La vertebra, es de carácter masiva', 'La vértebra es de carácter masiva'),
    ('Surdamerica', 'Sudamérica'),
    ('Sudamérica. de la familia', 'Sudamérica, de la familia'),
    ('bautizaron como como', 'bautizaron como'),
    ('Wilhelm Deecke, reviso los materiales', 'Wilhelm Deecke, revisó los materiales'),
    ('entre ellos dientes, vertebras y falanges', 'entre ellos dientes, vértebras y falanges'),
    ('carácter masiva y muy erosionada', 'carácter masivo y muy erosionado'),
    ('sus caras articular anterior', 'sus caras articulares anteriores'),
    ('las caras articulares anteriores', 'las caras articulares anteriores'),
]

def errata(t):
    for a, b in ERRATAS:
        if a != b:
            t = t.replace(a, b)
    return t

def cur(s):
    """Marca con asteriscos los nombres cientificos (binomiales y generos)."""
    # binomiales y generos del documento
    TAXONES = [
        'Plesiosaurus chilensis', 'Pliosaurus chilensis', 'Wunyelfia maulensis',
        'Aristonectes quiriquinensis', 'Arictonectes quiriquinensis',
        'Arictonectes', 'Aristonectes', 'Morturneria seymourensis',
        'Metriorhynchus casamiquelai', 'Metriorhynchus', 'Kaikaifilu hervei',
        'Antarcticoolithus bradyi', 'Aepyornis maximus', 'Struthio camelus',
        'Gallus gallus domesticus', 'Clidastes', 'Euclastes',
        'Ischyrhiza', 'Lamna', 'Isurus', 'Cardium acuticostatum',
        'Pacitrigonia hanetiana', 'Pachydiscus', 'Kossmaticeras',
        'Gunnarites', 'Pseudophyllites indra', 'Lytoceras kayei',
    ]
    for t in sorted(TAXONES, key=len, reverse=True):
        # solo fuera de asteriscos ya puestos
        s = re.sub(r'(?<!\*)\b' + re.escape(t) + r'\b(?!\*)', '*' + t + '*', s)
        s = s.replace('**', '*')
    return s

def js(t):
    return '"' + t.replace('\\', '\\\\').replace('"', '\\"') + '"'

# ---------- SECCIONES DEL SITIO ----------
# (id, titulo, nivel, [indices de parrafo XML que la componen])
SECCIONES = [
    ('reptiles-generalidades', 'Reptiles marinos: generalidades', 2, [3, 4, 5, 8, 9]),
    ('plesiosaurios', 'Plesiosaurios', 2, [11, 12, 16, 19]),
    ('plesiosaurios-en-chile', 'Plesiosaurios en Chile', 3, [21, 22, 23, 26, 27, 28]),
    ('aristonectes-quiriquinensis', 'Aristonectes quiriquinensis, la nueva especie para Chile', 3, [32, 35]),
    ('pliosaurios', 'Pliosaurios', 3, [39, 40]),
    ('ictiosaurios', 'Ictiosaurios', 2, [44, 45, 49, 52, 53, 54, 55]),
    ('metriorhynchus', 'Metriorhynchus, el cocodrilo marino', 2, [59, 62, 66, 67]),
    ('mosasaurios-en-chile', 'Mosasaurios en Chile', 2, [74, 76, 78, 80]),
    ('region-del-maule', 'Región del Maule', 3, [88, 93, 95, 100]),
    ('kaikaifilu-hervei', 'Kaikaifilu hervei, el mosasaurio de la Antártica', 3, [108, 109, 111]),
    ('huevo-de-mosasaurio', 'Huevo de posible mosasaurio', 2, [124, 125, 127, 129]),
]

# parrafo XML -> (seccion, indice dentro de la seccion)
XML2SITE = {}
for sid, _t, _n, parxs in SECCIONES:
    for k, xi in enumerate(parxs):
        XML2SITE[xi] = (sid, k)

# figuras por seccion
FIGS = {}
for f in MAPEO['figs']:
    i = f['i']
    # el parrafo de la figura: la figura esta en el parrafo i; el "ancla" es el
    # ultimo parrafo CON TEXTO estrictamente anterior dentro de la misma seccion
    j = i - 1
    # si el parrafo previo es un PIE de figura (no pertenece a ninguna seccion),
    # el ancla es el parrafo de texto anterior que SI esta en una seccion.
    while j >= 0 and (j not in XML2SITE):
        j -= 1
    if j not in XML2SITE:
        raise SystemExit(f'figura {f["n"]}: parrafo ancla {j} no esta en ninguna seccion')
    sid, k = XML2SITE[j]
    FIGS.setdefault(sid, []).append({
        'n': f['n'], 'tras': k,
        'src': f'assets/img/reptiles/{f["n"]:02d}.jpg',
        'ancho': MED[f'{f["n"]:02d}']['ancho'],
        'alto': MED[f'{f["n"]:02d}']['alto'],
        'pie': pies.get(f['n']),
    })

# ---------- EMITIR ----------
out = []
out.append('const REPTILES = {')
out.append('  subpagina: "reptiles.html",')
out.append('  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },')
out.append('  etiqueta: "Colecciones · Mesozoico",')
out.append('  titulo: "Reptiles marinos en Chile",')
out.append('  bajada:')
out.append('    "Plesiosaurios, ictiosaurios, pliosaurios, cocodrilos marinos y '
           'mosasaurios: los reptiles que dominaron el mar del Mesozoico y los '
           'restos hallados en Chile.",')
out.append('  /* `intro: null` a propósito: el primer párrafo del Word se publica en su')
out.append('     sección y repetirlo acá lo mostraría dos veces. */')
out.append('  intro: null,')
out.append('  secciones: [')
for sid, titulo, nivel, parxs in SECCIONES:
    out.append('    {')
    out.append(f'      id: {js(sid)},')
    out.append(f'      titulo: {js(cur(titulo))},')
    out.append(f'      nivel: {nivel},')
    out.append('      parrafos: [')
    for xi in parxs:
        t = errata(items[xi]['t'])
        t = cur(t)
        out.append(f'        {js(t)},')
    out.append('      ],')
    out.append('      imagenes: [')
    for fig in sorted(FIGS.get(sid, []), key=lambda x: x['n']):
        campos = f'src: "{fig["src"]}", ancho: {fig["ancho"]}, alto: {fig["alto"]}, tras: {fig["tras"]}'
        if fig['pie']:
            campos += f', pie: {js(cur(errata(fig["pie"])))}'
        out.append('        { ' + campos + ' },')
    out.append('      ],')
    out.append('    },')
out.append('  ],')
out.append('  /* Sin `atribucion`: las 24 imágenes son del museo (Word del director, CR-99).')
out.append('     El render hace `if (!T.atribucion) return;`, así que no se pinta bloque')
out.append('     de procedencia ajeno. Los créditos de cada figura viajan en su `pie`. */')
out.append('  atribucion: null,')
out.append('  notaImagenes:')
out.append('    "Figuras del documento «Reptiles marinos en Chile» del Museo Paleontológico de Chile. " +')
out.append('    "Las fotografías y reconstrucciones llevan su crédito en el pie de cada figura.",')
out.append('  cierre: {')
out.append('    texto: "Plesiosaurios, ictiosaurios y mosasaurios: el mar del Mesozoico en el territorio chileno.",')
out.append('    boton: "Ver la colección completa",')
out.append('    enlace: "index.html#colecciones",')
out.append('  },')
out.append('};')

open('/tmp/bloque-reptiles.js', 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
print('\n--- figuras por seccion ---')
for sid, _t, _n, _p in SECCIONES:
    fs = FIGS.get(sid, [])
    print(f'{sid:32s} P={len(_p)} figs={[f["n"] for f in fs]} tras={[f["tras"] for f in fs]}')
