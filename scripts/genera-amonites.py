#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el bloque `const AMMONITES = {...}` para data/museo.js a partir del
Word del museo AMMONITES.docx, respetando el ORDEN del documento.

Regla del proyecto (DEC-034): el texto es INTEGRO del Word, sin redactar.
Este script solo transcribe y estructura; no reescribe una palabra.

Salida: /tmp/amonites-bloque.js  (se inserta a mano en data/museo.js)
"""
import zipfile, re, json, os
from xml.etree import ElementTree as ET

DOCX = '/mnt/c/Users/logic/Downloads/AMMONITES.docx'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def leer_docx():
    z = zipfile.ZipFile(DOCX)
    rels = z.read('word/_rels/document.xml.rels').decode('utf8')
    relmap = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', rels))
    root = ET.fromstring(z.read('word/document.xml'))
    body = root.find('w:body', NS)
    items = []
    for p in body:
        if p.tag.split('}')[1] != 'p':
            continue
        estilo = p.find('.//w:pStyle', NS)
        style = estilo.get('{%s}val' % NS['w']) if estilo is not None else ''
        texto = ''.join(t.text or '' for t in p.iter('{%s}t' % NS['w'])).strip()
        imgs = []
        for blip in p.iter('{%s}blip' % NS['a']):
            rid = blip.get('{%s}embed' % NS['r'])
            tgt = relmap.get(rid, '')
            n = int(re.search(r'(\d+)', os.path.basename(tgt)).group(1))
            imgs.append(n)
        if texto or imgs:
            items.append({'style': style, 'texto': texto, 'imgs': imgs})
    return items


# ---------------------------------------------------------------
# ESTRUCTURA de la página: mismas llaves que TRILOBITES.
# Cada sección es del Word; los títulos son TEXTUALES del Word
# (salvo la capitalización, que el Word trae en minúsculas de título).
# `imgs` = números de imagen del Word, en el orden del documento.
# ---------------------------------------------------------------
SECCIONES = [
    dict(id='subclase', titulo='Subclase Ammonoidea', nivel=2,
         parrafos=[2], imgs=[1, 2],
         pies={1: 'Ammonite Dactilioceras comune, y Ammonite con corte sagital que muestra las cámaras internas.'}),

    # ⚠️ La imagen 3 va SOLA en su sección: el Word le dio un pie propio
    # («Reconstrucción paleobiológica… Ilustración José Lemos Caro») y ese
    # crédito NO puede despegarse de la figura (atribución falsa si se separa).
    # Además es de un autor distinto al resto: merece su bloque, no una tira.
    dict(id='reconstruccion', titulo='Reconstrucción paleobiológica', nivel=3,
         parrafos=[], imgs=[3],
         pies={3: 'Reconstrucción paleobiológica de un Ammonite. Ilustración José Lemos Caro.'}),

    dict(id='fosilizacion', titulo='Proceso de fosilización', nivel=2,
         parrafos=[8], imgs=[]),

    dict(id='fosilizacion-1', titulo='1. El animal muere', nivel=3,
         parrafos=[9], imgs=[4]),
    dict(id='fosilizacion-2', titulo='2. La concha se rellena', nivel=3,
         parrafos=[11], imgs=[5]),
    dict(id='fosilizacion-3', titulo='3. El molde queda protegido', nivel=3,
         parrafos=[13], imgs=[6]),
    dict(id='fosilizacion-4', titulo='4. Molde interno', nivel=3,
         parrafos=[15], imgs=[7]),

    dict(id='deposicion-fondo', titulo='Deposición de fondo', nivel=3,
         parrafos=[20, 21], imgs=[8]),
    dict(id='deposicion-playa', titulo='Deposición de playa', nivel=3,
         parrafos=[24], imgs=[9]),

    dict(id='belleza', titulo='Un grupo atractivo y bello', nivel=2,
         parrafos=[26], imgs=[]),

    dict(id='concha', titulo='La concha', nivel=2,
         parrafos=[29], imgs=[10, 11]),
    dict(id='concha-camaras', titulo='Cámaras y crecimiento', nivel=3,
         parrafos=[31], imgs=[12, 13]),
    dict(id='protoconcha', titulo='Protocono o protoconcha: la ammonitella', nivel=3,
         parrafos=[34, 35], imgs=[14, 15]),

    dict(id='depredacion', titulo='Depredación en ammonites', nivel=2,
         parrafos=[38], imgs=[16, 17]),
    # 🔴 CR-84 (2026-10-20) — CORREGIDO POR EL DUEÑO: «el texto en una imagen está
    # en otro lugar». El Word pone el pie «Marcas del maxilar de Mosasaurus
    # orridus…» DEBAJO de la imagen 18 (body[40]=IMG[18], body[41]=TEXTO), o sea
    # ese texto es el PIE de la imagen 18, no un título de sección.
    # Yo lo había usado como `titulo:` y la imagen 18 quedó SIN su pie, con el
    # texto flotando arriba. Ahora el texto va donde el Word lo puso: al pie.
    # La subsección conserva un título NEUTRO (no se inventa prosa: se nombra la
    # figura), porque la estructura del índice necesita el nodo.
    dict(id='marcas-maxilar', titulo='Una concha mordida', nivel=3,
         parrafos=[], imgs=[18],
         pies={18: 'Marcas del maxilar de Mosasaurus orridus en una concha de Ammonite del genero Placentíceras.'}),
    dict(id='tuberculos', titulo='Tubérculos y espinas', nivel=3,
         parrafos=[43], imgs=[19, 20]),

    dict(id='hidrodinamica', titulo='Hidrodinámica de las conchas', nivel=2,
         parrafos=[46], imgs=[21, 22, 23]),
    # ⚠️ La imagen 24 trae DIBUJADA su propia rotulación (5 palabras sueltas en
    # una fila). El Word no le puso título ni pie: se le da su bloque, SIN texto
    # inventado. NO se transcribe la rotulación: ya está en la imagen y repetirla
    # como párrafo finge un texto que el museo no escribió.
    dict(id='ornamentos', titulo='Ornamentación de la concha', nivel=3,
         parrafos=[], imgs=[24]),

    dict(id='sistema-natatorio', titulo='Sistema natatorio', nivel=2,
         parrafos=[52, 53], imgs=[]),

    dict(id='anatomia', titulo='Anatomía interna del Ammonite', nivel=2,
         parrafos=[55, 56, 57, 58], imgs=[25]),

    dict(id='linea-sutura', titulo='Línea de sutura', nivel=2,
         parrafos=[61], imgs=[26]),

    dict(id='reproduccion', titulo='Reproducción de los Ammonites', nivel=2,
         parrafos=[64], imgs=[27]),

    dict(id='extincion', titulo='Extinción de los ammonites', nivel=2,
         parrafos=[67], imgs=[]),

    dict(id='fosiles-guias', titulo='Ammonites como fósiles guías', nivel=2,
         parrafos=[69], imgs=[28]),

    dict(id='yacimientos', titulo='Yacimientos', nivel=2,
         parrafos=[], imgs=[]),
    dict(id='lo-valdes', titulo='Formación Lo Valdés', nivel=3,
         parrafos=[73, 75, 77], imgs=[29, 30]),
]


def js_str(s):
    """String JS seguro (comillas dobles, escapa lo necesario)."""
    return json.dumps(s, ensure_ascii=False)


def main():
    items = leer_docx()
    # index de textos: se usa el índice del párrafo en el body (los números
    # de arriba son POSICIONES en el body del docx, verificadas con el volcado)
    textos = {}
    for it in items:
        pass
    # volcado posicional: necesitamos el índice de body, así que re-leemos
    z = zipfile.ZipFile(DOCX)
    root = ET.fromstring(z.read('word/document.xml'))
    body = root.find('w:body', NS)
    for i, p in enumerate(body):
        if p.tag.split('}')[1] != 'p':
            continue
        textos[i] = ''.join(t.text or '' for t in p.iter('{%s}t' % NS['w'])).strip()

    import glob
    from PIL import Image
    base = '/mnt/c/dev/museo-mpch/assets/img/amonites/word'

    def dim(n):
        ext = '.png' if os.path.exists('%s/%02d.png' % (base, n)) else '.jpg'
        ruta = '%s/%02d%s' % (base, n, ext)
        w, h = Image.open(ruta).size
        return 'assets/img/amonites/word/%02d%s' % (n, ext), w, h

    out = []
    out.append('/* --- AMMONITES (subpágina propia) ---')
    out.append('   CR-83 (2026-10-20): el dueño entregó el documento «AMMONITES.docx»')
    out.append('   (4,6 MB, 30 imágenes) y pidió agregarlo como la página que se abre')
    out.append('   apretando la card de Ammonites en Colecciones (mismo mecanismo que')
    out.append('   trilobites.html, CR-60).')
    out.append('')
    out.append('   ⚠️ TEXTO: ÍNTEGRO del Word, sin una palabra redactada (DEC-034).')
    out.append('   Solo se separó en secciones y se capitalizaron los títulos que el Word')
    out.append('   trae en minúsculas. NO reescribir: si hay que cambiarlo, lo dicta el dueño.')
    out.append('')
    out.append('   🔴 ORDEN DE IMÁGENES: es el del Word, LITERAL. Los archivos se numeran')
    out.append('   01..30 por su POSICIÓN en el documento, no por nombre ni por tamaño.')
    out.append('   Un `07.jpg` significa «séptima imagen del Word». NO reordenar.')
    out.append('')
    out.append('   ✅ PROCEDENCIA: material del museo, autorizado por el dueño en bloque')
    out.append('   («son autorizadas, todas», 2026-10-19). La ilustración de la imagen 3')
    out.append('   es de José Lemos Caro y se publica con su crédito pegado a la figura,')
    out.append('   tal como el dueño lo autorizó en esta sesión.')
    out.append('')
    out.append('   ⚠️ PNG con alfa se conservan en PNG (pasarlas a JPEG rellena de NEGRO')
    out.append('   lo transparente). Medido: solo 02.png tiene alfa real (1,2 % de')
    out.append('   píxeles transparentes, luminancia media 129 = clara), así que se ve')
    out.append('   sobre el fondo oscuro sin necesidad de fondo blanco.')
    out.append('   ============================================================ */')
    out.append('')
    out.append('const AMMONITES = {')
    out.append('  subpagina: "amonites.html",')
    out.append('  volver: { texto: "Volver a la colección", enlace: "index.html#colecciones" },')
    out.append('  etiqueta: "Colecciones · Mesozoico",')
    out.append('  titulo: "Ammonites",')
    out.append('  bajada:')
    out.append('    ' + js_str('Moluscos cefalópodos con concha en espiral, guías de la era Mesozoica.') + ',')
    out.append('  intro:')
    out.append('    ' + js_str(textos[2]) + ',')
    out.append('')
    out.append('  secciones: [')
    for s in SECCIONES:
        out.append('    {')
        out.append('      id: %s,' % js_str(s['id']))
        out.append('      titulo: %s,' % js_str(s['titulo']))
        out.append('      nivel: %d,' % s['nivel'])
        if s['parrafos']:
            out.append('      parrafos: [')
            for pi in s['parrafos']:
                out.append('        ' + js_str(textos[pi]) + ',')
            out.append('      ],')
        else:
            out.append('      parrafos: [],')
        if s['imgs']:
            out.append('      imagenes: [')
            for n in s['imgs']:
                src, w, h = dim(n)
                pie = s.get('pies', {}).get(n)
                out.append('        {')
                out.append('          src: %s,' % js_str(src))
                out.append('          ancho: %d, alto: %d,' % (w, h))
                alt = 'Ammonites — imagen %d del documento del museo' % n
                out.append('          alt: %s,' % js_str(alt))
                if pie:
                    out.append('          pie: %s,' % js_str(pie))
                out.append('        },')
            out.append('      ],')
        out.append('    },')
    out.append('  ],')
    out.append('')
    out.append('  notaImagenes:')
    out.append('    ' + js_str('Las imágenes de esta página son material del Museo Paleontológico de Chile y se publican con su autorización. La reconstrucción paleobiológica de un ammonite es una ilustración de José Lemos Caro.') + ',')
    out.append('  /* Sin sección de atributos: las imágenes son del museo, no de Commons.')
    out.append('     El render hace `if (!T.atribucion) return;` y no la pinta. */')
    out.append('  atribucion: null,')
    out.append('  cierre: {')
    out.append('    texto: ' + js_str('Los ammonites son una de las piezas de la muestra del museo.') + ',')
    out.append('    boton: ' + js_str('Ver la colección completa') + ',')
    out.append('    enlace: "index.html#colecciones"')
    out.append('  }')
    out.append('};')
    out.append('')

    texto = '\n'.join(out)
    open('/tmp/amonites-bloque.js', 'w', encoding='utf8').write(texto)
    print('escrito /tmp/amonites-bloque.js  (%d lineas, %d chars)' % (texto.count('\n'), len(texto)))
    # reporte de imágenes no usadas
    usadas = sorted({n for s in SECCIONES for n in s['imgs']})
    print('imagenes usadas: %d -> %s' % (len(usadas), usadas))
    faltan = [n for n in range(1, 31) if n not in usadas]
    print('imagenes del Word NO usadas: %s' % (faltan or 'ninguna'))


if __name__ == '__main__':
    main()
