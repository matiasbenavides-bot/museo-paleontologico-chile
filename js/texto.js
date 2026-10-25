/* ============================================================
   js/texto.js — Cursivas para nombres científicos
   ============================================================
   CR-86c (2026-10-25). Pedido del dueño: «para cualquier nombre científico se
   usan cursiva para definir». Aplica a TODO el sitio, no sólo a una subpágina.

   QUÉ RESUELVE
     El data/ (data/museo.js) guarda texto PLANO y no acepta HTML: así ningún
     texto del museo puede inyectar etiquetas. Para la cursiva se marca el nombre
     con asteriscos en el data:

         "…la resina del *Pinus succinifera*, en tanto que…"

     y este módulo los convierte en <i> en el momento de pintar.

   🔴 EL ORDEN NO ES NEGOCIABLE
     1. Se ESCAPA todo el texto con `esc()`.
     2. SÓLO DESPUÉS se cambian los asteriscos por <i>.

     Si se hiciera al revés (marcar y luego escapar), un `<script>` escrito en el
     data/ sobreviviría como HTML y esto sería una vía de inyección. Al revés, lo
     único que puede aparecer en el resultado es `<i>` y `</i>`, que los escribe
     esta función. Medido con `<script>`, `<img onerror>` y asterisco impar: los
     tres quedan inertes.

   ⚠️ ASTERISCOS IMPARES
     Se convierten por pares. Un `*` sin pareja queda literal: preferible un
     asterisco visible a una etiqueta `<i>` abierta sin cerrar.

   ⚠️ UN NOMBRE PARTIDO EN DOS STRINGS
     El data/ parte los párrafos largos en varios strings concatenados, y un
     mismo nombre puede quedar cortado entre dos:

         "…se le llamó *Carcharodon " +
         "megalodon*, después…"

     Eso es CORRECTO: el par de asteriscos se cierra después de concatenar, y
     esta función recibe el párrafo ya unido, así que lo resuelve bien.

   QUIÉN LO USA
     js/ambar.js · js/amonites.js · js/tiburones.js · js/trilobites.js
     js/cec.js · js/render.js

   Se carga ANTES que esos renders en cada .html:
     <script src="data/museo.js"></script>
     <script src="js/texto.js"></script>      ← este
     <script src="js/<pagina>.js"></script>
   ============================================================ */
(function () {
  "use strict";

  /* Escapa lo mínimo de HTML. Idéntico al `esc` que ya usa cada render. */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Texto plano → HTML seguro con cursivas.
     Uso:  "<p>" + window.TEXTO.conCursivas(p) + "</p>"  */
  function conCursivas(s) {
    return esc(s).replace(/\*([^*]+)\*/g, "<i>$1</i>");
  }

  window.TEXTO = {
    esc: esc,
    conCursivas: conCursivas
  };
})();
