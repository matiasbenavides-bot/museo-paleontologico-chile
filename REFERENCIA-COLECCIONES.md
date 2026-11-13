# REFERENCIA — grillas de imágenes de las colecciones

**Última actualización:** 2026-11-12 · CR-107 / CR-108 / CR-109 / CR-110

Este documento describe **cómo se pintan las imágenes de las 9 subpáginas de
colección** y qué se puede tocar sin romper el resto. Leerlo antes de cambiar un
`grid-template-columns`, un `max-width` o un `max-height` de figura.

---

## 1. Por qué existe este archivo

Las nueve colecciones se construyeron en nueve momentos distintos (CR-60, CR-83,
CR-85, CR-96, CR-98, CR-99…), cada una con su propio `*-figs` / `*-fig` y su
propia copia de las mismas reglas. El resultado fue **siete copias del mismo
defecto**, y por eso el dueño tuvo que pedir tres veces «las imágenes más
grandes» antes de que se arreglara en todas.

Este documento fija **la regla única**. Si una colección nueva no la sigue, va a
repetir el mismo problema.

---

## 2. El mapa: qué clase usa cada colección

| Colección | Página | Prefijo de figura | Hoja CSS |
|---|---|---|---|
| Trilobites | `trilobites.html` | `tri-fig` / `tri-figs` | `trilobites.css` |
| Ammonites | `amonites.html` | `amo-fig` / `amo-figs` | `amonites.css` |
| Huellas (icnología) | `huellas.html` | `amb-fig` / `amb-figs` ⚠️ | `ambar.css` |
| Dinosaurios en Chile | `dinosaurios-chile.html` | `dch-fig` + `amb-figs` | `dinosaurios-chile.css` |
| Tiburones | `tiburones.html` | `tib-fig` / `tib-figs` | `tiburones.css` |
| Pterosaurios | `pterosaurios.html` | `ptx-fig` + `amb-figs` | `pterosaurios.css` |
| Ámbar | `ambar.html` | `amb-fig` / `amb-figs` | `ambar.css` |
| Dinosaurios (grupo) | `dinosaurios.html` | `amb-fig` / `amb-figs` | `ambar.css` |
| Reptiles marinos | `reptiles.html` | `rpt-fig` / `rpt-figs` | `reptiles.css` |

⚠️ **`amb-figs` la usan SEIS páginas, no tres** (medido: `grep -l amb-figs js/*.js`
→ `ambar`, `huellas`, `dinosaurios`, `dinosaurios-chile`, `pterosaurios`,
`reptiles`). Un cambio en `ambar.css` afecta a **seis capítulos**, no a uno. Es la
trampa clásica del proyecto: un selector de una hoja compartida aplica a toda
página que reuse la clase.

⚠️ **`dinosaurios-chile`, `pterosaurios` y `reptiles` usan `amb-figs` sólo para el
bloque de imágenes `sencillas`**, y su propio prefijo para el resto. Hay que mirar
el render, no suponer.

---

## 3. Las dos reglas que se rompieron y por qué

### 🔴 Regla 1 — el tope de ancho NO puede estrangular el contenedor

**Cuatro hojas** tenían:

```css
max-width: min(100%, clamp(440px, 46vw + 180px, 780px));   /* ✗ */
```

(`trilobites`, `amonites`, `ambar`, `tiburones`.) El contenedor de sección mide
**~1130 px**: con el tope en **780** se tiraba el **31 %** del ancho útil, y todas
las imágenes se pintaban más chicas de lo necesario sin que nada diera error.

```css
max-width: min(100%, clamp(560px, 62vw + 200px, 1040px));  /* ✓ */
```

⚠️ **`dinosaurios-chile`, `pterosaurios` y `reptiles` YA tenían `max-width: 100%`**
(medido: 0 apariciones de `780px` en esas hojas). En ellas el problema era **sólo**
`auto-fit` — no hay que «arreglarles» un tope que nunca tuvieron.

> **Criterio:** el tope existe para que las tarjetas no queden fuera de la
> columna de texto. **1040 px** es el techo razonable; pasar de ahí deja las
> tarjetas desalineadas con la tipografía de la sección.

### 🔴 Regla 2 — `auto-fit` + `minmax` NO fija el número de columnas: lo SUBE

Medido a 1440 px con el contenedor ya en 1040 px:

```
.amb-figs--3  ->  4 columnas   (la clase promete 3)
.amb-figs--2  ->  3 columnas   (la clase promete 2)
.tib-figs--3  ->  4 columnas
```

`auto-fit` reparte **tantas pistas como quepan** según el mínimo del `minmax`.
Con `minmax(230px)` en 1040 px entran cuatro.

⇒ **Las columnas se declaran por RANGO**, que es la regla que el proyecto ya
tenía escrita para la card de C.E.C. En las siete hojas:

```css
@media (min-width: 900px) {
  .X-figs--2, .X-figs--3, .X-figs--4, .X-figs--5 {
    grid-template-columns: repeat(2, minmax(0, 1fr));   /* 508 px c/u */
  }
}
@media (max-width: 899.98px) {
  .X-figs--2, .X-figs--3, .X-figs--4, .X-figs--5 {
    grid-template-columns: 1fr;                          /* ancho completo */
  }
}
```

Script idempotente: **`scripts/aplica-columnas-por-rango.py`**.

---

## 4. Por qué 2 columnas y no 3

No es gusto: es geometría medida.

| columnas dentro de 1040 px | ancho por imagen |
|---|---|
| 4 | 242 px |
| 3 | 330 px |
| **2** | **508 px** |
| 1 | 1040 px |

Con 3 columnas, `huellas/08.jpg` (2448 px nativos) se pintaba a **329 px = 13 %**.
Con 2, a **506 px = 21 %**. Con 1, a 973 px.

**En celular siempre 1 columna**: dos columnas de material ancho y bajo lo dejan
más chico que una sola imagen grande.

---

## 5. 🔴 El techo: qué NO se puede prometer

Para que **todas** las imágenes se pintaran al menos al 55 % de su resolución
nativa haría falta, medido:

| archivo | nativo | ancho para 55 % | alto resultante |
|---|---|---|---|
| huellas 08.jpg | 2448×1705 | **1346 px** | 938 px |
| huellas 22.jpg | 1570×1074 | 864 px | 591 px |
| dino-chile 21.jpg | 1299×879 | 714 px | 483 px |
| pterosaurios 03 | 1332×800 | 733 px | 440 px |

El ancho útil es ~1040 px ⇒ exigir 55 % a todas = **una imagen por fila**, con
altos de 440–940 px, o sea **~14.000 px de scroll** en `huellas.html`.

**No es un defecto de CSS: es el material.** El museo entrega fotos de 2448 px
que en cualquier grilla de 2 columnas quedan al 21 %.

**Decisión del dueño (2026-11-12, «elijo a»):** 2 columnas legibles **+ el
visor** para ver la foto al tamaño real al hacer clic. Con eso el porcentaje deja
de importar: la miniatura es la entrada, no la foto.

---

## 6. Cómo cambiar el tamaño sin romper nada

1. **Medir primero.**
   ```bash
   python3 scripts/audita-colecciones.py --solo <pagina>.html
   ```
   Devuelve el % del nativo **por imagen** y si hay desborde. Sin este número,
   cualquier cambio es a ciegas.

2. **Tocar el ancho de la columna**, no el alto ni el `max-height` de la figura.
   El marco **ya no limita**: en «Estructura» medía 216 px con `max-height` de
   522 px y la imagen pintaba 136 — sobraba capacidad. El techo es el **ancho de
   la columna × la proporción del material**.

3. **Sólo esa sección.** El render acepta una marca **por sección** en
   `data/museo.js`:

   ```js
   figurasGrandes: true,       // grilla ancha (2 columnas)
   figurasGrandes: "ancho",    // una imagen por fila, ancho completo
   ```

   ⚠️ El render compara **el valor real** antes de convertirlo a booleano. Un
   `if (mas)` sobre el string `"ancho"` lo toma como `true` y **pierde la
   clase**: sintaxis válida, cero errores de consola, el cambio no ocurre.

4. **Verificar los 12 anchos.** `scripts/audita-colecciones.py` sin `--solo`.

---

## 7. Lo que NO se toca

- **`css/secciones/galeria.css`** — la usa la portada. Sus reglas
  `aspect-ratio: 1/1` + `object-fit: cover` se filtran a toda `.galeria__foto img`
  del sitio. Si una figura hereda el cuadrado, se neutraliza **desde la página**,
  con más especificidad; la hoja compartida no se toca.
- **`max-height` del marco** (`clamp(280px, 58vh, 620px)`) — existe para que una
  foto vertical no ocupe dos pantallas. No es lo que achica las horizontales.
- **`min-height` del marco** (`clamp(180px, 24vh, 280px)`) — evita que una imagen
  sin cargar (lazy) deje la caja en 0 px. Ese fue un defecto real.
- **`object-fit`** — **sin** él a propósito: `cover` es lo que recortaba
  (CR-60e midió hasta 235 % de recorte en las verticales).

---

## 8. Estado medido al 2026-11-12

```
grillas                 7 hojas · columnas por rango · máx 2 en escritorio
imágenes <55% nativo    62   (antes 82)
peor caso               21 % (huellas/08.jpg, 2448 px)  (antes 10 %)
ancho típico            506 px (2 col) · 973–1111 px (1 col)
desbordes               0 en 12 anchos (320..1920) × 12 páginas
consola                 0 errores en las 12 páginas
```

Detalle de la sesión, con los errores propios:
**`BITACORA-2026-11-12.md`**.
