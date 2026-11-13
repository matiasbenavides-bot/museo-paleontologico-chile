# HANDOFF — Museo Paleontológico de Chile (MPCH)

Última actualización: **2026-11-10** (CR-100 → CR-104 — visor de imágenes)

Ruta local: `/mnt/c/dev/museo-mpch/`
**En línea:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/
Repo: https://github.com/matiasbenavides-bot/museo-paleontologico-chile (rama `master`, Pages desde `/`)
Abrir local: doble clic en `index.html` — estático, sin backend, sin build, sin dependencias

> 🆕 **VISOR DE IMÁGENES EN VIVO en `reptiles.html`.**
> Botón «Ver imágenes · N» bajo el título de cada sección **+ clic/tap en cualquier figura**.
> Un toque acerca a 2,4×, arrastrar recorre, Esc/×/swipe↓ sale y **devuelve a la sección**.
> En celular: pantalla completa y, al girar el teléfono, la imagen pasa al **83 % del alto**.
>
> 📘 **Referencia técnica completa: `REFERENCIA-VISOR.md`** (arquitectura, API, los 9 defectos,
> las 5 trampas de medición y el procedimiento para extenderlo).
> 📋 **Bitácora de la sesión: `BITACORA-2026-11-10.md`.**
> 🧪 **Medidores: `MEDIDORES.md`** — un comando (`scripts/salud.py`) mide todo
> el sitio (118 comprobaciones). Base común en `scripts/medir/base.py` con las
> 5 trampas de medición ya resueltas. **Exit 0 = sano, exit 1 = roto.**
>
> ⚠️ **Hoy sólo está en Reptiles marinos.** Extenderlo a las otras 8 subpáginas es mecánico
> (3 pasos, ver `REFERENCIA-VISOR.md` §3) y suma **166 imágenes** más.

### Estado numérico medido (2026-11-10)

```
páginas            12 (+ bitácoras)
colección          10 cards, 9 con subpágina
visor              24 imágenes · 11 secciones · 24 figuras clicables
                   (sólo reptiles.html)
escritorio         0 errores · 0 desborde 360→1440
celular 390×844    abre · 44×44 táctil · toque acerca · swipe sale
celular 844×390    imagen 844×280 = 83 % del alto
no regresión       las 12 páginas: 0 errores, 0 desborde
```

### Archivos del visor

```
js/visor.js                 39 KB   motor, compartido por todos los capítulos
css/secciones/visor.css     19 KB   estilos, prefijo .mpv-
scripts/mide-visor.py       14 KB   medidor con Chromium real
REFERENCIA-VISOR.md         10 KB   esta documentación técnica
```

---

## ⚠️ Publicación: GitHub Pages puede NO servir el commit

**Medido el 2026-11-10:** tras el push de CR-102, lo servido era **exactamente** el commit
anterior (md5 idéntico a `b42b97b`). **320 s** esperando y nada cambió. Un **push vacío**
(`git commit --allow-empty -m "…" && git push`) lo destrabó; publicado a los ~200 s.

**Verificación que sí sirve** (comparar contenido, no esperar a ciegas):

```bash
# ¿lo servido coincide con el commit que acabo de subir?
curl -s "https://matiasbenavides-bot.github.io/museo-paleontologico-chile/js/visor.js"   | md5sum
cd /mnt/c/dev/museo-mpch && git show HEAD:js/visor.js | md5sum
# si el md5 de lo servido == el del commit ANTERIOR → forzar rebuild
```

⚠️ `max-age=600` en la CDN de Pages: `curl` con `?v=$RANDOM` evita falsos negativos por caché.

---

## Pendientes abiertos (reales, medidos)

| # | Pendiente | Dueño de la decisión |
|---|---|---|
| ~~1~~ | ~~Extender el visor a las 8 subpáginas restantes~~ — **HECHO (CR-105b, 2026-11-12)**: las **9 páginas** con el visor, **190/190 figuras clicables**, verificado **en vivo**. Detalle abajo | — |
| 2 | **«Arictonectes» / «Aristonectes»** — el Word usa las dos formas para la misma especie (CR-99). **No se corrigió**: es inconsistencia real del autor | dueño |
| 3 | **«Reconstrucciones»** — única pieza de la colección **sin subpágina**. No hay Word | dueño (falta material) |
| 4 | **«Pterosaur horizont»** — el Word escribe «horizont». Es el nombre propio como circula en la literatura | dueño |

---

## ✅ CR-105b (2026-11-12) — el visor ya está en las 9 páginas

Medido, no estimado. Control primero (`reptiles.html`, el piloto ya aprobado);
si el control falla, ningún veredicto de las páginas nuevas vale.

```
PÁGINA                   FIGURAS  CLICABLES  BOTONES  VISOR
trilobites.html               38         38       18     sí
amonites.html                 30         30       21     sí
huellas.html                  23         23        8     sí
dinosaurios-chile.html        21         21        8     sí
tiburones.html                18         18       11     sí
pterosaurios.html             14         14        6     sí
ambar.html                    11         11        6     sí
dinosaurios.html              11         11        9     sí
reptiles.html (control)       24         24       11     sí
TOTAL                        190        190       --     sí
```

Verificado **contra la URL en vivo** (no local): abrir desde la sección, filtro de
origen, contador `1 / N`, imagen grande cargada (`naturalWidth > 0`), zoom 2,4×,
Esc cierra y **vuelve a la sección con el scroll restaurado**, 0 errores de consola.

### 🔴 El defecto REAL que destapó: `scroll-behavior: smooth` rompía el «volver a la sección»

`css/base/base.css:2` tiene `html { scroll-behavior: smooth }`. El `cerrar()` del
visor hacía `window.scrollTo(0, scrollPrevio)` **mientras el body seguía `fixed`**:
el navegador ANIMABA el scroll (~1,75 s, medido: 0 → 501 → 5822 → 7039 → 7461 →
7642 → 7649) y en varias subpáginas quedaba **en 0**. No era el piloto: en
`reptiles.html` funcionaba por casualidad de timing.

**Arreglo:** al restaurar se fuerza `scrollBehavior = "auto"` y se devuelve el valor
previo después. Aplicado en los DOS `scrollTo` de `cerrar()`.

### 🔴 Trampa nueva de medición: el «verde» que no distinguía roto de bueno

La primera prueba negativa **falló**: se inyectó «sin restaurar el scroll» y el
verificador **siguió dando OK**. Causa: `str.replace()` en Python reemplazó **sólo
el fragmento que contenía `scrollTo`**, dejando otro `window.scrollTo(0,
est.scrollPrevio)` intacto más abajo en la misma función. El «defecto inyectado»
no se había inyectado.

⇒ **Al inyectar un defecto, verificar que el archivo quedó roto** (`grep -c` del
símbolo debe dar 0) **antes de fiarse del veredicto**. Y si el roto da el mismo
resultado que el bueno, el que no sirve es el instrumento.

### Scripts nuevos (reutilizables)

```bash
# estado real de las 9 páginas: figuras, clicables, botones, visor, consola
/tmp/venv-docx2/bin/python scripts/control-visor-paginas.py

# verificación funcional completa, con CONTROL primero
/tmp/venv-docx2/bin/python scripts/verifica-visor-9.py
/tmp/venv-docx2/bin/python scripts/verifica-visor-9.py --solo tiburones.html
```

---

## Riesgos abiertos

- 🔴 **Un mapeo figura→párrafo escrito a mano desalinea figuras en silencio.** Se DERIVA de
  `word/document.xml`. Si el dueño reemplaza un Word, **regenerar**, no editar.
- 🔴 **`const` sin `window.X = X` deja la página en blanco sin error de consola.** Ya pasó
  4 veces (CR-71, CR-80, CR-86, CR-96). `node --check` NO lo detecta.
- 🔴 **`est.capa` es `null` al montar el visor** — engancharle listeners ahí mata el render
  completo de la página (CR-100a). Enganchar al `document`.
- ⚠️ **Sesiones paralelas**: antes de editar, `git fetch` + `git rev-list --count HEAD..origin/master`.

---

## Cómo se verifica hoy

```bash
cd /mnt/c/dev/museo-mpch

# 1. sintaxis
node --check data/museo.js && node --check js/visor.js && node --check js/reptiles.js

# 2. el data carga DE VERDAD (atrapa el const sin export)
node -e "global.window={};eval(require('fs').readFileSync('data/museo.js','utf8'));
console.log('REPTILES:',!!window.REPTILES,'| MUSEO:',!!window.MUSEO)"

# 3. el visor completo, contra la URL EN VIVO
/tmp/venv-docx2/bin/python scripts/mide-visor.py   https://matiasbenavides-bot.github.io/museo-paleontologico-chile/reptiles.html
```

Entorno: `python-docx`, `Pillow`, `playwright` **no están en el sistema** (PEP 668):

```bash
uv venv /tmp/venv-docx2 --python 3.12
uv pip install --python /tmp/venv-docx2/bin/python playwright Pillow
```

Chromium: `~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`
⚠️ **No hay `node_modules`**: `scripts/humo-sitio.js` falla por `playwright-core`. Usar Python.

---

## Lo que se cerró en sesiones anteriores (resumen)

| CR | Qué | Commit |
|---|---|---|
| CR-99 | «Reptiles marinos en Chile» (10.ª subpágina) + card + ícono | `0491500` / `5d80f56` |
| CR-98 | «Pterosaurios en Chile» + card e ícono | `8821138` |
| CR-96 | «Dinosaurios en Chile» (restos óseos, 8 especies, 21 figuras) | `4569f99` |
| CR-97 | Retirada la card «Huevos de dinosaurios» (dibujo archivado) | `e6d6c05` |
| **CR-100/101** | **Visor de imágenes por sección (piloto)** | `b42b97b` |
| **CR-102** | **Clic en la figura abre el visor en ESA imagen** | `c7d1c9f` |
| **CR-103/104** | **Celular: 44×44 táctil · pantalla completa · modo apaisado** | `0959e8b` |

---

## Las TRES páginas de dinosaurios NO se confunden

| Página | Qué es | Word fuente |
|---|---|---|
| `dinosaurios.html` | El grupo **Dinosauria**: qué es, sinapomorfías | «Definiendo a los dinosaurios» |
| `huellas.html` | **Icnología**: huellas fósiles y sitios | «Huellas para Pag.» |
| `dinosaurios-chile.html` | **Restos óseos** en Chile, ficha por especie | «Dinosaurios en Chile pag.» |

Son **tres Words distintos** del dueño. No se renombran ni se fusionan.

---

## Decisión de trato que costó una sesión

El dueño escribió *«intercambiemos huevos de dinosaurio por dinosaurios de chile»*. Se midió:
**el Word «nuevo» era MD5 idéntico al ya publicado** y **no había ninguna inversión**.
Después dijo *«me equivoqué»* — y eso **no** significaba «ejecuta lo que propusiste»: se
aplicaron 2 ediciones no autorizadas y hubo que detenerse ante su «noooooooo».

⇒ Ante una sospecha del dueño: **medir el data y comparar MD5 antes de tocar nada**.
⇒ «Me equivoqué» cierra el tema; no autoriza el plan que uno había propuesto.
⇒ **«Al hacer clic no pasa nada» es un reporte válido**: dos veces esta sesión el dueño
tuvo razón y el defecto era real (CR-102 y CR-104).
