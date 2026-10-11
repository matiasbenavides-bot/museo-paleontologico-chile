# HANDOFF — Museo Paleontológico de Chile (MPCH)

Fecha: 2026-10-11 (sesión 2)
Ruta: `/mnt/c/dev/museo-mpch/`
Abrir: doble clic en `index.html` — sitio estático, **sin backend, sin build, sin dependencias**

---

## ESTADO ACTUAL

Funcionando y verificado en navegador headless (CDP), no "debería funcionar":

- 14/14 anchos sin desborde horizontal, de **320px a 2560px**
- 0 errores de consola · 4/4 imágenes cargando · 31 reveals · 6 piezas · 3 servicios
- Menú móvil abre/cierra con toque y con Esc
- Línea de tiempo alineada: desfase **0px** entre puntos y línea
- `node --check` OK en los 4 archivos JS

**Pendiente único: PUBLICAR.** Requiere token de GitHub válido (`gh auth login`).

---

## CORRECCIONES APLICADAS ESTA SESIÓN (CR-01 a CR-08)

| # | Qué | Dónde |
|---|---|---|
| CR-01 | Redundancia de horario: "Hoy estamos de X a Y" repetía horas ya listadas arriba. Ahora solo dice "Abierto ahora" / "Cerrado ahora" | `js/render.js` `pintarHorario()` |
| CR-02 | Línea de tiempo no pasaba por los puntos (25px de desfase) y sangraba 110px por lado | `css/secciones/colecciones.css` |
| CR-03 | 6 SVGs de piezas rediseñados con forma real | `js/iconos.js` |
| CR-04 | `cepchile@gmail.com` eliminado (obsoleto) | `data/museo.js` |
| CR-05 | Teléfono → `+56 9 9349 2714` + botón WhatsApp | `data/museo.js`, `js/render.js` |
| CR-06 | "href enmascarado" — **NO ERA UN BUG**, ver pitfalls | — |
| CR-07 | Sistema responsive fluido con `clamp()` | `css/base/root.css`, `css/secciones/responsive.css` |
| CR-08 | **Menú móvil NUNCA abría** + desborde de 22px por el reveal | `js/animaciones.js`, `css/secciones/animaciones.css` |

---

## BUGS ENCONTRADOS QUE NO ESTABAN EN LA LISTA

### 1. El menú móvil estaba roto en producción (crítico)

`init()` de `animaciones.js` se ejecuta **dos veces**: una en `DOMContentLoaded` y otra en `window.load` (línea 249). Eso hacía que `menu()` registrara **dos listeners** en el mismo botón: el primero abría el menú y el segundo lo cerraba **en el mismo clic**.

**Resultado real:** en un celular, **el menú nunca se abría**. Nadie podía navegar el sitio desde el móvil.

**Fix:** guarda `toggle.dataset.cableado === "1"` en `menu()`.

### 2. Desborde horizontal de 22px en tablet

`.reveal--der` usaba `transform: translateX(46px)`. Un elemento desplazado **con transform fuera de su contenedor SÍ extiende el `scrollWidth`** del documento mientras no se ha revelado.

**Resultado real:** a 834px, 1024px y 1180px, quien cargara la página **sin haber hecho scroll** veía las tarjetas salirse 22px por la derecha.

**Fix:** los reveals ahora animan **solo en eje Y** (`translateY`). Se conserva el efecto y el desborde desaparece de raíz.

### 3. Fondo de ammonites desbordaba hasta 180px

Eran `position: fixed` con `width` en px y offsets negativos (`right: -170px`). Un `fixed` desplazado fuera del viewport **cuenta en el `scrollWidth`**.

**Fix (DEC-016):** contenedor `#fondo-clip` con `position: fixed; inset: 0; overflow: hidden` que los recorta, y tamaños fluidos `min(58vw, 620px)`.

---

## DECISIONES DE ESTA SESIÓN

- **DEC-010** Lema eliminado del sitio (anula DEC-002). El "40 años" contradecía el "más de 20 años" del copy real del museo. Sin lema, no hay contradicción. Reemplazado por "Primer museo chileno dedicado a la paleontología"
- **DEC-011** Teléfono `+56 9 9349 2714`, con WhatsApp (`wa.me` + mensaje prellenado)
- **DEC-012** **PROHIBIDO usar fotos de las piezas.** El jefe del museo pidió que no se pongan: quiere que la gente vaya a verlas en persona. Los SVG redibujados son el mecanismo permanente
- **DEC-013** Línea de tiempo movida del `index.html` a `data/museo.js` (antes violaba DEC-005). Se pinta con `pintarEras()`
- **DEC-014** Estado de horario sin datos redundantes
- **DEC-015** Sistema responsive fluido con `clamp()`; media queries solo para cambios estructurales
- **DEC-016** Fondo con contenedor de recorte
- **DEC-017** Reveals solo en eje Y

---

## PALETA — MEDIDA DEL LOGO (DEC-006, sin cambios)

| Rol | Hex |
|---|---|
| Azul marino (dominante) | `#02153f` |
| Celeste (acento) | `#51adc6` |
| Teal (isotipo) | `#2f7e82` |
| Salmón | `#d26c53` |
| Crema / hueso | `#e8e9e3` |

---

## DATOS CLAVE

- Contacto: **+56 9 9349 2714** · WhatsApp mismo número · correo `castillocornejojuan@gmail.com`
- Ubicación: Plaza del Cabildo s/n, interior Pueblito Parque O'Higgins, Metro Parque O'Higgins
- Horarios: Mar–Vie 10:00–17:00 / Sáb–Dom 11:00–18:00 / Lunes cerrado
- Pertenece a GRINPACH
- Muestra: Cámbrico → Cuaternario. Piezas: trilobites, ammonites, ámbar, tiburones, dinosaurios, reconstrucciones
- Servicios vía GeoPaleo Ltda., aprobada por CMN, estudios SEIA

---

## ESTRUCTURA

```
museo-mpch/
├── index.html
├── css/
│   ├── main.css                  (solo @imports)
│   ├── base/{reset,root,base}.css        ← root.css tiene la ESCALA FLUIDA
│   └── secciones/
│       ├── header, hero, somos, colecciones, servicios, visita, footer
│       ├── fondo-ammonite.css    (DEC-008 + DEC-016)
│       ├── animaciones.css       (DEC-017)
│       └── responsive.css        (estructura + antidesborde)
├── js/
│   ├── iconos.js                 (SVG inline, incluye whatsapp)
│   ├── render.js                 (pinta secciones desde data/)
│   └── animaciones.js            (reveals, parallax, tilt, menu)
├── data/
│   └── museo.js                  (FUENTE ÚNICA DE VERDAD)
└── assets/img/
```

**Regla:** los datos viven en `data/museo.js`, **nunca** en el HTML (DEC-005).

---

## PITFALLS APRENDIDOS (segunda sesión)

- **NO reportar un bug sin medirlo.** Reporté con alarma que el `href` del teléfono estaba enmascarado (`+569****2933`) y que en el celular no se podía llamar. **Era falso.** Al medir los 12 caracteres uno por uno en Unicode, el número estaba limpio. Los asteriscos eran un artefacto de **mi lectura del archivo**, no del archivo. **Verificar antes de alarmar.**
- **`scrollWidth` vs `clientWidth` da falsos positivos.** El criterio correcto de desborde es `scrollWidth > window.innerWidth`, NO `> documentElement.clientWidth`. `clientWidth` descuenta la scrollbar; `scrollWidth` no. Comparar contra clientWidth marca desborde SIEMPRE que haya scrollbar vertical.
- **Chrome headless ignora `--window-size` por debajo de ~500px.** Para medir móvil de verdad hay que usar `Emulation.setDeviceMetricsOverride` con `mobile: true`. Sin eso, se mide un viewport de 500px creyendo que es de 375px.
- **Un `position: fixed` con offset negativo SÍ cuenta en el `scrollWidth`** del documento. La solución es un contenedor `overflow: hidden`, no un offset menor.
- **`transform: translateX()` en un elemento que aún no se revela SÍ ensancha el documento.** Para animaciones de entrada, preferir el eje Y.
- **Un `display: none` en `.nav` + `display: flex` en `.nav.abierto`** es más robusto que `right: -100%` o `translateX(100%)` para menús móviles.
- **`init()` dos veces mata los toggles.** Si una función cablea listeners, necesita una guarda de idempotencia.
- **Los archivos del dueño están en `/mnt/c/Users/logic/Downloads/`** (no `logicforgex`).

---

## PENDIENTES

1. **Publicar en GitHub** (`museo-paleontologico-chile`) — **BLOQUEADO**: el token de `gh` está inválido. Ejecutar `gh auth login -h github.com` antes.
2. Revisar densidad del fondo de ammonites (juicio estético del dueño, sin verificar visualmente).
3. Ajustar intensidad de animaciones si el dueño lo pide.
4. Los 6 SVG son de forma correcta pero **genérica** (sin fotos por DEC-012). Si se quiere más fidelidad, hay que describir pieza por pieza.
