"""DEC-109 — Verifica que la cursiva de los nombres cientificos es REAL.

Lo que distingue una cursiva real de la sintetizada NO es `font-style: italic`
(eso se cumple igual en los dos casos): es que el DIBUJO cambie. Se mide el
ancho de la misma palabra con y sin cursiva; si coincide, el navegador solo
inclino el trazo y la fuente no tiene italica.

Incluye CONTROL NEGATIVO: sobre la misma pagina se mide un <i> forzado a la
fuente del cuerpo (Segoe UI, sin italica). Ahi el ancho DEBE coincidir. Si el
control tambien "difiere", el instrumento miente y el verde no vale.

Uso:  .venv/bin/python scripts/verifica-cursiva-real.py
"""
import os
import sys
import json

PAGS = ["index.html", "trilobites.html", "amonites.html", "tiburones.html",
        "ambar.html", "dinosaurios.html", "dinosaurios-chile.html",
        "pterosaurios.html", "reptiles.html", "huellas.html",
        "proyecto-cec.html", "curriculum.html"]

BASE = "http://127.0.0.1:8099/"

JS = r"""
async () => {
  await document.fonts.ready;
  // Solo los <i>: son los que produce `TEXTO.conCursivas()` desde `*…*` del data.
  // Los <em> se miden aparte porque uno (el del hero, CR-46) es ESTRUCTURA y
  // debe quedarse en `normal` a proposito: contarlo como falla seria un falso
  // positivo del medidor, no un defecto del sitio.
  const it = [...document.querySelectorAll('main i, .contenedor i')];
  const em = [...document.querySelectorAll('main em, .contenedor em')];

  function ancho(el) { return Math.round(el.getBoundingClientRect().width * 100) / 100; }

  // Misma palabra, cursiva vs normal: se clona el nodo y se le quita la cursiva
  const pares = [];
  for (const el of it.slice(0, 12)) {
    const wIt = ancho(el);
    const clon = el.cloneNode(true);
    clon.style.fontStyle = 'normal';
    clon.style.fontFamily = 'inherit';
    clon.style.display = 'inline-block';
    el.after(clon);
    const wNorm = ancho(clon);
    clon.remove();
    pares.push({
      t: el.textContent.trim().slice(0, 26),
      fam: getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, ''),
      estilo: getComputedStyle(el).fontStyle,
      it: wIt, normal: wNorm,
      difiere: Math.abs(wIt - wNorm) > 0.5
    });
  }

  // CONTROL NEGATIVO: la misma medicion forzando Segoe UI (sin italica real)
  let control = null;
  if (it.length) {
    const el = it[0];
    const clon = el.cloneNode(true);
    clon.style.fontFamily = '"Segoe UI", system-ui, sans-serif';
    clon.style.display = 'inline-block';
    clon.style.fontStyle = 'italic';
    el.after(clon);
    const wItSegoe = ancho(clon);
    clon.style.fontStyle = 'normal';
    const wNormSegoe = ancho(clon);
    clon.remove();
    control = {
      t: el.textContent.trim().slice(0, 26),
      it: wItSegoe, normal: wNormSegoe,
      difiere: Math.abs(wItSegoe - wNormSegoe) > 0.5
    };
  }

  const txt = document.body.innerText;
  return {
    total_i: it.length,
    total_em: em.length,
    // Estructural: el <em> del hero (CR-46) tiene que seguir en `normal`.
    // Si aqui saliera `italic`, mi regla de DEC-109 se comio la maquetacion.
    em_estructural: em.map(e => ({
      t: e.textContent.trim().slice(0, 20),
      estilo: getComputedStyle(e).fontStyle
    })),
    pares,
    control,
    asteriscos_visibles: (txt.match(/\*/g) || []).length,
    html_escapado: (document.body.innerHTML.match(/&lt;i&gt;/g) || []).length,
    alt_con_asterisco: [...document.images].filter(i => /\*/.test(i.alt)).length,
    familias: [...new Set(it.map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))],
    caras_italic: [...document.fonts].filter(f => f.style === 'italic')
                    .map(f => `${f.family}|${f.weight}|${f.status}`)
  };
}
"""


def main():
    from playwright.sync_api import sync_playwright
    exe = None
    for v in ["chromium-1248", "chromium-1243"]:
        p = os.path.expanduser(f"~/.cache/ms-playwright/{v}/chrome-linux64/chrome")
        if os.path.exists(p):
            exe = p
            break

    fallos = 0
    with sync_playwright() as pw:
        nav = pw.chromium.launch(executable_path=exe, args=["--no-sandbox", "--disable-dev-shm-usage"])
        for pag in PAGS:
            ctx = nav.new_context(viewport={"width": 1440, "height": 900})
            p = ctx.new_page()
            errores = []
            p.on("pageerror", lambda e: errores.append(str(e)[:90]))
            try:
                p.goto(BASE + pag, wait_until="domcontentloaded", timeout=60000)
                p.wait_for_timeout(900)
                d = p.evaluate(JS)
            except Exception as e:
                print(f"{pag:24} ERROR {str(e)[:70]}")
                fallos += 1
                ctx.close()
                continue

            n = d["total_i"]
            reales = sum(1 for x in d["pares"] if x["difiere"])
            # el control DEBE coincidir (Segoe UI no tiene italica)
            ctrl_ok = d["control"] is None or not d["control"]["difiere"]
            ctrl_txt = "n/a" if d["control"] is None else (
                f"{d['control']['it']}/{d['control']['normal']} {'OK' if ctrl_ok else 'FALLA'}")

            estado = "OK"
            if n and reales == 0:
                estado = "FALLA: la cursiva no cambia el dibujo"
                fallos += 1
            if not ctrl_ok:
                estado = "FALLA: el control negativo tambien diferencia -> el medidor miente"
                fallos += 1
            if d["asteriscos_visibles"] or d["html_escapado"] or d["alt_con_asterisco"]:
                estado = f"FALLA: marcas sin procesar (ast={d['asteriscos_visibles']} esc={d['html_escapado']} alt={d['alt_con_asterisco']})"
                fallos += 1
            if errores:
                estado = f"FALLA: JS error {errores[0]}"
                fallos += 1

            print(f"{pag:24} <i>={n:3}  reales={reales:2}/{min(n,12):2}  "
                  f"control(Segoe)={ctrl_txt:20}  {estado}")
            if n and d["familias"]:
                print(f"{'':24} familia(s) de la cursiva: {', '.join(d['familias'])}")
            est = d.get("em_estructural") or []
            if est:
                malos = [x for x in est if x["estilo"] != "normal"]
                marca = "OK" if not malos else f"REVISAR ({len(malos)} en cursiva)"
                print(f"{'':24} <em> estructural: {len(est)} -> {marca}"
                      + ("" if not malos else " :: " + ", ".join(x['t'] for x in malos[:3])))
                if malos and pag == "index.html":
                    fallos += 1
            ctx.close()
        nav.close()

    print()
    print("RESULTADO:", "TODO OK" if fallos == 0 else f"{fallos} pagina(s) con falla")
    return 0 if fallos == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
