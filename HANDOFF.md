# HANDOFF — Museo Paleontológico de Chile (MPCH)

Última actualización: **2026-11-12** (CR-105b → CR-112 — visor en las 9 páginas,
tamaños de imagen en todas las colecciones, tipografía real)

Ruta local: `/mnt/c/dev/museo-mpch/`
**En línea:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/
Repo: https://github.com/matiasbenavides-bot/museo-paleontologico-chile (rama `master`, Pages desde `/`)
Abrir local: doble clic en `index.html` — estático, sin backend, sin build, sin dependencias

> 🆕 **VISOR DE IMÁGENES EN LAS 9 SUBPÁGINAS — 190/190 figuras clicables.**
> Botón «Ver imágenes · N» bajo el título de cada sección **+ clic/tap en cualquier figura**.
> Un toque acerca a 2,4×, arrastrar recorre, Esc/×/swipe↓ sale y **devuelve a la sección**.
> En celular: pantalla completa y, al girar el teléfono, la imagen pasa al **83 % del alto**.
>
> 📘 **Referencia técnica: `REFERENCIA-VISOR.md`** (arquitectura, API, los 9 defectos,
> las 5 trampas de medición y el procedimiento para extenderlo).
> 📋 **Bitácora de la sesión: `BITACORA-2026-11-12.md`** — trae las mediciones, los dos
> errores propios y por qué el criterio del «55 % del nativo» NO se puede cumplir.
> 🧪 **Medidores: `MEDIDORES.md`** — `scripts/salud.py` mide todo el sitio
> (118 comprobaciones). **Exit 0 = sano, exit 1 = roto.**
> 🧱 **Grillas de imágenes: `REFERENCIA-COLECCIONES.md`** — qué clase usa cada
> colección, las dos reglas que se rompieron (tope de ancho y `auto-fit`) y el
> techo real del tamaño. **Leerlo antes de tocar un `grid-template-columns`.**

### Estado numérico medido (2026-11-12)

```
páginas               12
colección             10 cards, 9 con subpágina
visor                 9 subpáginas · 190/190 figuras clicables
grillas de imágenes   7 hojas · columnas por RANGO · máx 2 en escritorio, 1 en celular
tamaños               62 imágenes bajo el 55 % del nativo (antes 82) · peor 21 % (antes 10 %)
desbordes             0 en 12 anchos (320..1920) en las 12 páginas
consola               0 errores en las 12 páginas
tipografía            Cormorant Garamond VARIABLE (300–700) + itálica REAL
salud.py              118/118 TODO OK
verifica-visor-9.py   9/9 OK (control reptiles.html primero)
```

### 🔴 Decisiones de tamaño de imagen — leer antes de «agrandar» nada

El dueño pidió tres veces «más grandes» (CR-107, CR-108, CR-109) y después
«arregla todas las colecciones» (CR-110). **Ya está en el techo del diseño.**

Si en el futuro pide «más grandes» otra vez:

1. **Medir primero** con `scripts/audita-colecciones.py` — dice el % del nativo
   por imagen y si hay desborde.
2. **Subir el ancho de la columna** (ya está en 1040 px, el máximo razonable).
3. **Cuando llegue al techo, la respuesta es el VISOR, no una columna de 1000 px.**
   Forzar el 55 % del nativo en todas exige **una imagen por fila** con altos de
   440–940 px ≈ **14.000 px de scroll** en `huellas.html`. El dueño **eligió A**
   (2 columnas + visor) después de ver esos números.

⚠️ **`auto-fit` + `minmax` NO fija las columnas: las SUBE.** Medido: `.amb-figs--3`
daba 4 y `.amb-figs--2` daba 3. Por eso las columnas se declaran por RANGO
(`scripts/aplica-columnas-por-rango.py`, idempotente).

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
| 5 | **Láminas de baja resolución** — `huellas/10.png` tiene **348 px nativos** y la 4.ª de «tamaño» es `1014×1357`; no se pueden agrandar sin pixelarse. **Es el material, no el CSS.** Si el dueño entrega los originales, se suben | dueño (falta material) |
| 6 | **`css/secciones/animaciones.css` tiene una `}` de más** (72 `{` vs 73 `}`) **desde CR-32b**. El sitio funciona (0 errores de consola en 12 páginas). No se tocó | criterio propio, sin prisa |

---

## ✅ Lo que se cerró el 2026-11-12

Todo el detalle, con las mediciones y los errores propios, está en
**`BITACORA-2026-11-12.md`**. Resumen:

| CR | Qué | Resultado medido |
|---|---|---|
| **CR-105b** | el visor pasa de 1 a **9 subpáginas** | 190/190 figuras clicables |
| **CR-107** | «Estructura de los trilobites» más grande | 242 → **506 px** |
| **CR-108** | «Huellas fósiles de trilobites» (4 imágenes) | 175 → **506 px** |
| **CR-109** | **todas** las grillas de trilobites bajo el 60 % del nativo | ninguna bajo el 55 % |
| **CR-110** | tamaños en **las 9 colecciones** + desbordes | 82 → **62** imágenes chicas · **0 desbordes** |
| CR-111 | cursiva de nombres científicos **real** | Segoe UI no traía itálica: la sintetizaba |
| CR-112 | el 700 de Cormorant **no era sintético** | la fuente es **VARIABLE** (wght 300→700) |

⚠️ **CR-111 y CR-112 los commiteó una SESIÓN PARALELA**, igual que CR-105/106
(`700e768`, que se llevó dentro la integración de las 8 páginas). Antes de
commitear: `git fetch` + `git log --oneline -3` + `git show --stat` del commit
ajeno. **`git status` limpio no significa que el trabajo sea tuyo.**

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

## Documentos del proyecto

| Archivo | Qué trae | Cuándo leerlo |
|---|---|---|
| **`HANDOFF.md`** | estado, pendientes, riesgos | **siempre, al retomar** |
| `REFERENCIA-COLECCIONES.md` | grillas de imágenes de las 9 colecciones | antes de tocar tamaños/columnas |
| `REFERENCIA-VISOR.md` | arquitectura y API del visor | antes de tocar `js/visor.js` |
| `MEDIDORES.md` | cómo se mide y con qué script | antes de escribir una sonda |
| `BITACORA-2026-11-12.md` | la sesión de los tamaños, con lo que falló | al reproducir un defecto |
| `BITACORA-2026-11-10.md` | el visor, original | contexto del visor |
| `fuentes/` | material del dueño tal como lo entregó | para auditar un texto |

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

## CR-122 (2026-11-13) — DEC-122: los detalles de interfaz

**Bitácora completa: `BITACORA-2026-11-13.md`.** Todo publicado y verificado en vivo.
Árbol limpio.

Nace de «MEJOREMOS LAS ANIMACIONES, AUNQUE SEAN PEQUEÑAS INTERFACES Y DETALLES
MINUSIOSOS» + «VEAMOS SI REVERTIR POR FASES».

| CR | Qué |
|---|---|
| 122a | `}` huérfano en `animaciones.css` (72 `{` vs 73 `}`) — el defecto de fondo |
| 122b | la card **respira** al hover, en vez de `shimmer` infinito duplicado |
| 122c | una luz blanca **cruza** el `<hr class="separador">` una vez |
| 122c2 | el barrido **se ve**: 3 correcciones medidas en píxeles |
| 122e | el CTA deja de destellar solo; brilla al hover/focus |
| 122f | el menú móvil entra **ítem por ítem** (40 ms) |
| 122g | llegar a un ancla **ya no es un salto seco** |
| 122h | `prefers-reduced-motion` apaga **todo**, en archivo propio |

### 🔴 Tres cosas que se pagan caro si se olvidan

- **Un `@keyframes` puede estar vivo y NO verse.** `computed style` decía
  `barridoSeparador 1.6s` mientras la luz no se movía. Se mide el **píxel**.
- **`git revert` NO revierte un commit del medio** de una cadena que escribe en
  el mismo archivo: se lleva los vecinos (medido: 118 líneas de conflicto).
  Usar `scripts/revierte-bloque-dec122.py B|C|E|F|G|H`.
- **Comentario sin `*/` se come el bloque siguiente.** Va con las llaves:
  verificar `/*` == `*/`, no sólo el balance de `{}`.

### Sondas nuevas

```bash
.venv/bin/python scripts/mide-animaciones-dec122.py [url]   # 15 anchos + disparo + reduced-motion
.venv/bin/python scripts/veredicto-barrido.py               # pausa y fija currentTime
.venv/bin/python scripts/captura-dec122.py                  # PNG al Escritorio para MIRAR
python3 scripts/revierte-bloque-dec122.py --lista           # revertir por fases
```

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

---

## CR-111 … CR-120 (2026-11-12/13) — cursiva, tipografía, contenido y tamaños

**Bitácora completa: `BITACORA-2026-11-12.md` (dos partes: sesión A y sesión B).**
Todo publicado y verificado en vivo. Árbol limpio.

| CR | Qué |
|---|---|
| 111 / DEC-109 | La cursiva de los nombres científicos era **simulada** — Segoe UI no tiene itálica |
| 112 | El peso 700 de Cormorant era **sintético** — la fuente es VARIABLE (`fvar` 300→700) |
| 113 | Quitada la 2ª imagen de «Locomoción» (el párrafo de la ficha NO se toca) |
| 114 | Quitado el párrafo repetido de «Dimorfismo sexual» (venía del Word) |
| 115 | `epidodito` / `Epipodito` es **INTENCIONAL** — no unificar |
| 116 | Las tres piezas de dinosaurios, seguidas (orden del array = orden en pantalla) |
| 117 | En PC, las de 1 por fila pasan a medir como en 2 celdas (506 px) |
| 118 | «¿Qué son los trilobites?» acotada a 700 px (la 2ª es cuadrada, 506×506) |
| 119 | Quitado `"ancho"` en estructura/fondo/reproduccion — era la causa de TODA imagen grande |
| 120 | El pie del maxilar de *Mosasaurus* pasó de la imagen 18 a la 17 |

### 🔴 Lo que hay que saber antes de tocar nada de esto

- **`font-style: italic` computa `italic` TAMBIÉN en una cursiva falsa.** La única medida
  válida es el **ANCHO** con y sin cursiva.
- **El PESO se mide contando TINTA** en canvas, no ancho (el avance no cambia entre pesos).
- **`COLECCIONES.piezas` no tiene secciones** (sólo tarjetas): buscar repetidos ahí da un
  **falso verde**. Usar `scripts/busca-repetidos.js`.
- **`figurasGrandes: "ancho"`** fuerza 1 columna y se salta la regla de CR-110 ⇒ imagen a
  1038 px. Es la causa de toda imagen gigante.
- **`.tri-figs--mas` gana por orden**: una clase nueva sin especificidad **no hace nada**.
- **Al mover objetos de `COLECCIONES.piezas`, `patch`/regex DUPLICA** (dejó 12 de 10).
- **CR-120 DIFIERE del Word a propósito** (criterio del dueño, que vio las fotos).

### Sondas re-ejecutables nuevas

```bash
.venv/bin/python scripts/verifica-cursiva-real.py   # cursiva real, CON control negativo
.venv/bin/python scripts/mide-cursiva-real.py       # diagnóstico de familia/peso/síntesis
node scripts/busca-repetidos.js                     # repetidos en las 9 colecciones
```

### Estado medido (en vivo, 2026-11-13)

```
12/12 páginas HTTP 200 · 0 errores JS · 0 imágenes rotas · 0 desborde · 0 asteriscos
imagen más ancha del sitio: 552 px (0 sobre 600 px en las 9 colecciones)
14/14 anchos sin desborde (320 → 2560 px)
```
