# CR-100 a CR-104 — VISOR DE IMÁGENES POR SECCIÓN

**Fecha:** 2026-11-10 · **Estado:** PUBLICADO en `reptiles.html`
**En vivo:** https://matiasbenavides-bot.github.io/museo-paleontologico-chile/reptiles.html

Referencia técnica completa del visor. Leer esto antes de tocar `js/visor.js`,
`css/secciones/visor.css` o de extenderlo a otra subpágina.

---

## 1. Las órdenes del dueño, literales

1. *«hagamos una interfaz para las imagenes, que puedas seleccionarlas en colecciones
   seccion especifica y verlas de cerca. deslizar y salir cuando quieras llevandote
   a la seccion»*
2. *«aparte poder tocar cada imagen para acercarla»*
3. *«no veo actualizacion ni que deje ver las imagenes de cerca»*
4. *«al hacer click en las imagenes no se seleccionan»*
5. *«en formato celular no deja ver eso»*

**Decisiones que él tomó** (no las tomó el agente):
- **Un botón por sección**, no uno global en la cabecera.
- **A + B** en el zoom: toque amplía **y** arrastre recorre.
- **Clic en la figura → abre el visor en ESA imagen.**

---

## 2. Arquitectura (DEC-084 a DEC-104)

| DEC | Decisión | Por qué |
|---|---|---|
| **DEC-084** | **Un solo** `js/visor.js` + `css/secciones/visor.css` compartidos | El sitio ya arrastra **11 copias** del pintado del footer y `js/reptiles.js` avisa del riesgo. Repetir el patrón 9 veces garantiza desincronización |
| **DEC-085** | El índice se **DERIVA** de `seccion.imagenes[]` en ejecución | Misma regla que el mapeo figura→párrafo (CR-96 costó 4 intentos por escribirlo a mano) |
| **DEC-086** | La capa **no vive en el HTML**: se construye al primer clic | Las figuras ya están; el visor sólo las indexa. Cero cambios de contenido = cero riesgo |
| **DEC-087** | Al cerrar **vuelve a la sección de origen** con el scroll restaurado | Es literalmente el pedido |
| **DEC-088** | Esc · × · clic al fondo · swipe↓ para salir; ‹ › · ← → · swipe↔ para navegar | «deslizar y salir cuando quieras» |
| **DEC-089** | Sin `pie` ni `alt` en el dato → **no inventa texto** | Coherencia con DEC-034 |
| **DEC-104** | Pantalla completa + layout apaisado + aviso de girar | Geometría: imagen 3:1 no llena pantalla vertical |
| **DEC-104b** | `z-index: 0` en el lienzo | Al pasar a `absolute` quedaba encima de los controles |

---

## 3. Integración en una subpágina — son 3 pasos

### Paso 1 — el `<script>`, ANTES del render del capítulo

```html
<script src="js/texto.js"></script>
<script src="js/visor.js"></script>      <!-- ANTES del render -->
<script src="reptiles.js"></script>
```

⚠️ **El orden importa.** `visor.js` debe cargar antes: el render comprueba
`window.VISOR` al pintar. Si va después, no se engancha nada.

### Paso 2 — el CSS ya está global

`css/main.css` tiene `@import url("secciones/visor.css");` — **no hay que tocarlo por página**.

### Paso 3 — 7 renglones en el render del capítulo

```js
if (window.VISOR && window.VISOR.montar) {
  var v = window.VISOR.montar({
    bloque: T,                       // el bloque del capítulo en data/museo.js
    titulo: T.titulo || "Imágenes del capítulo",
    etiqueta: "Ver imágenes"
  });
  if (v) v.pintarTodo(cont);         // botones por sección + figuras clicables
}
```

**Si `visor.js` no carga**, `window.VISOR` no existe, no se pinta ningún botón y la
página queda **exactamente como estaba**. Es opt-in por diseño.

### Qué hace `pintarTodo(cont)`

| Devuelve | Qué pintó |
|---|---|
| `botones` | un botón «Ver imágenes · N» bajo el título de cada sección con figuras |
| `figuras` | cada `<figure>` con imagen se vuelve control (`role=button`, `tabindex=0`, Enter/Espacio) |

---

## 4. API pública

```js
window.VISOR.montar({bloque, titulo, etiqueta})  // → est (instancia)
  est.pintarTodo(raiz)      // → {botones, figuras}
  est.pintarBotones(raiz)   // → n
  est.engancharFiguras(raiz)// → n
  est.abrir(secEl)
  est.cerrar()

window.VISOR.contar(bloque) // → {imagenes, secciones, conTexto}
window.VISOR.estado()       // → {montado, abierto, indice, secciones, visibles, pos, filtro}
```

`window.VISOR.estado()` es la forma más rápida y fiable de comprobar que el visor
funciona. La usan todos los medidores.

---

## 5. Los 9 defectos que atrapó la medición — no repetirlos

### CR-100a — `est.capa` es `null` al conectar → moría el render ENTERO
`conectar()` enganchaba `dblclick`/`wheel` a `est.capa`, que se crea al **primer ABRIR**.
Excepción dentro de `montar()` → `pintarSecciones()` moría → **los 11 botones no aparecían**.
→ Enganchar al `document` con filtro `[data-mpv-img]`.

### CR-100b — `abrir` no existía en el ámbito de `marcarBoton`
`abrir` es un closure de `montar()`. El clic lanzaba **«abrir is not defined»**: el botón
existía y no hacía nada. → `alAbrir` como parámetro.

### CR-100c — `transform-origin: 0 0` sacaba la imagen de la pantalla
Medido: el centro de una imagen de 1240 px quedaba en **x=1588** con viewport 1440.
No se podía volver a alejar. → **`center center`**.

### CR-100d — Con la imagen ampliada, el toque no alejaba
`inicio()` marcaba `arrastrando=true` y `fin()` volvía por la rama de arrastre **antes**
de llegar al toque. → el arrastre sólo cuenta si **hubo desplazamiento**.

### CR-100e — La imagen ampliada tapaba las flechas ‹ ›
Con 2,4× el `<img>` interceptaba el clic sobre la flecha. → **`overflow: hidden` en el lienzo**.

### CR-102 — Las figuras de la página NO eran clicables
Eran `<figure>` sin manejador y sin `cursor`. Reporte del dueño, correcto.
→ `est.engancharFiguras()`, emparejando **por `src`**, nunca por orden.

### CR-103 — Controles táctiles de 38-40 px
Bajo el mínimo de 44 px (49 CSS-pt en Apple, 48 dp en Android). → **44×44**.

### CR-104 — La imagen sólo usaba el 20 % del alto en vertical
**No era un bug de CSS: era geometría.** Imagen 1240×411 (3:1) en lienzo 390×636:
`min(390/1240, 636/411) = 0,31` → 390×129. → pantalla completa + layout apaisado (83 %).

### CR-104b — El lienzo `absolute` robaba los clics a chips y tira
→ `z-index: 0` en el lienzo; controles en `z-index: 2`.

### 🔴 Y uno de INFRAESTRUCTURA: GitHub Pages no sirvió el commit
Tras el push de CR-102, lo servido era **exactamente** el commit anterior (md5 idéntico a
`b42b97b`). **320 s** esperando, nada. Un **push vacío** (`git commit --allow-empty`) lo
destrabó; publicado a los ~200 s.

> **Regla:** después de publicar, comparar el **md5 de lo servido** contra el commit.
> Si coincide con el commit **anterior**, forzar rebuild.

---

## 6. Trampas de MEDICIÓN (el medidor mintió 5 veces)

| # | Trampa | Qué hacer |
|---|---|---|
| 1 | **`pg.click()` hace `scrollIntoViewIfNeeded()` ANTES del clic.** Medido: desplazó +1414 px **después** de tomar la referencia de scroll | Usar `elemento.click()` del DOM, que no mueve la página |
| 2 | **La `transform` se ANIMA (.32 s).** Leer la escala antes devuelve `1` | Esperar ~1,1 s |
| 3 | **Los reveals del sitio siguen moviendo ~1 s.** Leer el scroll antes da un valor intermedio | Esperar 1,6 s |
| 4 | **`scrollIntoView` en móvil no deja el elemento tocable.** La figura quedaba en `top: 844` (borde inferior) y `elementFromPoint` devolvía `NADA`; el `tap` caía en el vacío | **Verificar** `rect.top >= 0 && rect.bottom <= innerHeight`, reintentando |
| 5 | **`max-height: 100%` no resuelve contra una pista de grid `auto`** | El lienzo necesita altura definida (`position: absolute; inset: 0`) |

⚠️ Las cinco habrían hecho «arreglar» código que ya estaba bien.

---

## 7. Cómo se mide

```bash
# Medidor completo (acepta URL): botones, filtro, navegación, zoom, cierre,
# retorno a la sección, 6 anchos, consola. Exit 1 si algo falla.
/tmp/venv-docx2/bin/python scripts/mide-visor.py \
  https://matiasbenavides-bot.github.io/museo-paleontologico-chile/reptiles.html
```

Entorno:
```bash
uv venv /tmp/venv-docx2 --python 3.12
uv pip install --python /tmp/venv-docx2/bin/python playwright Pillow
```
Chromium: `~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`

**Para celular hay que usar contexto táctil real**, no sólo viewport chico:
```python
b.new_context(viewport={"width":390,"height":844},
              is_mobile=True, has_touch=True, device_scale_factor=3)
```
Un viewport angosto sin `has_touch` **miente**: no prueba los gestos.

---

## 8. Comportamiento entregado

```
«Ver imágenes · N» bajo el título de cada sección
o clic/tap en cualquier figura de la página
        ↓
Capa a pantalla completa (pide fullscreen)
  · chips por sección filtran  · tira de miniaturas  · contador n/total
        ↓
Un toque/clic      → acerca a 2,4×
Arrastrar (zoom)   → recorre la imagen
Otro toque         → aleja
Doble clic / rueda → acerca y aleja (escritorio)
        ↓
Esc · × · clic al fondo · swipe↓  → sale
        ↓
VUELVE A LA SECCIÓN DE ORIGEN, con el scroll restaurado
```

**En celular vertical** aparece «Gira el teléfono para verla completa» sólo si la imagen
es apaisada (relación > 1,5). Al girar: chips, tira y pie se ocultan y la imagen pasa al
83 % del alto.

---

## 9. Extenderlo a las otras 8 subpáginas — PENDIENTE

| Página | Imágenes | Página | Imágenes |
|---|---|---|---|
| `trilobites.html` | **38** | `dinosaurios-chile.html` | **21** |
| `amonites.html` | **30** | `tiburones.html` | **18** |
| `huellas.html` | **23** | `pterosaurios.html` | **14** |
| `ambar.html` | **11** | `dinosaurios.html` | **11** |
| **Total** | **166** | *(+ 24 de reptiles = 190)* | |

**Procedimiento por página** (los 3 pasos de §3):
1. `<script src="js/visor.js"></script>` antes del render.
2. Los 7 renglones en la función `pintarSecciones()` (o equivalente) del render.
3. Actualizar las expectativas del medidor y correr.

⚠️ **Particularidades por capítulo** (medidas en el data):
- `TRILOBITES` y `AMBAR`: **no traen `pie`** (traen `alt` o nada). El visor ya lo tolera.
- `AMMONITES` y `TIBURONES`: traen `alt` **y** `pie` — el visor usa `pie` primero.
- Los 9 bloques **sí** comparten `src/ancho/alto`.

⚠️ Al habilitar un capítulo, **sus figuras dejan de ser inertes**: hay que correr el
medidor y la no-regresión de las 12 páginas.

---

## 3b. Estado 2026-11-12 (CR-105b) — las 9 páginas ya lo tienen

Las **9** subpáginas con figuras lo tienen montado; **190/190 figuras clicables**.
Pasos 1 y 2 aplicados por página (el `<script src="js/visor.js">` va **entre**
`texto.js` y el `<script>` del capítulo).

⚠️ **En `amonites.js` el bloque del data es `A`, no `T`** (`var A = window.AMMONITES`).
Copiar el bloque de 7 renglones sin cambiar `bloque: T` deja el visor sin índice.

Verificación: `scripts/verifica-visor-9.py` (control `reptiles.html` primero) y
`scripts/control-visor-paginas.py` (inventario).

🔴 **Y el defecto que apareció al medir:** `cerrar()` hacía `scrollTo` con
`html { scroll-behavior: smooth }` vigente → animaba y dejaba la página en 0 en
varias subpáginas. Ahora `scrollBehavior = "auto"` antes de mover. Detalle en
`HANDOFF.md` §CR-105b.
