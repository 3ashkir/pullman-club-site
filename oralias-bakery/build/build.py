import json, re, pathlib

ROOT = pathlib.Path("/home/user/pullman-club-site/oralias-bakery")
art = json.load(open("/home/user/pullman-club-site/oralias-bakery/build/art.json"))
tiles = json.load(open("/home/user/pullman-club-site/oralias-bakery/build/tiles.json"))

# one set of pennant defs in the document; later buntings reference it
strip_defs = lambda s: re.sub(r"<defs>.*?</defs>", "", s, flags=re.S)
art["bunting_b"] = strip_defs(art["bunting_b"])
art["bunting_foot"] = strip_defs(art["bunting_foot"])
# keep clipPath ids unique between the hero pans and the menu cards
art["hero_pan"] = art["hero_pan"].replace('id="cc', 'id="hc').replace('url(#cc', 'url(#hc')

TEL = "+16122402031"
TEL_DISPLAY = "(612) 240-2031"
ADDR = "590 Marschall Rd, Shakopee, MN 55379"
MAPS = "https://www.google.com/maps/dir/?api=1&amp;destination=Oralia%27s+Bakery%2C+590+Marschall+Rd%2C+Shakopee%2C+MN+55379"

ICON_PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
ICON_PIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
ICON_CLOCK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'

CUT_UP = ('<svg class="cut" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
          '<path d="M0 40 V12 ' + "".join("q25 -16 50 0 " for _ in range(24)) + 'V40 Z"/></svg>')
CUT_DOWN = ('<svg class="cut" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
            '<path d="M0 0 V28 ' + "".join("q25 16 50 0 " for _ in range(24)) + 'V0 Z"/></svg>')

TALAVERA = "url(data:image/svg+xml,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22150%22%20height=%22150%22%20viewBox=%220%200%20150%20150%22><g%20fill=%22none%22%20stroke=%22%23FDF3DF%22%20stroke-width=%222%22><circle%20cx=%2275%22%20cy=%2275%22%20r=%2231%22/><path%20d=%22M75%2014v122M14%2075h122%22/><path%20d=%22M75%2044l13%2019-13%2019-13-19z%22/><circle%20cx=%2275%22%20cy=%2275%22%20r=%229%22/><circle%20cx=%220%22%20cy=%220%22%20r=%2214%22/><circle%20cx=%22150%22%20cy=%220%22%20r=%2214%22/><circle%20cx=%220%22%20cy=%22150%22%20r=%2214%22/><circle%20cx=%22150%22%20cy=%22150%22%20r=%2214%22/></g></svg>)"

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
hours_rows = "\n".join(
    f'      <li data-dow="{(i+1)%7}"><span class="day">{d}</span><span class="time">8:00 am &ndash; 8:00 pm</span></li>'
    for i, d in enumerate(DAYS))

BODY = f"""
<a class="skip" href="#main">Skip to content</a>

<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">{art['rosette']}</svg>

<header class="topbar" id="topbar" data-show="0">
  <span class="mark">Oralia&rsquo;s Bakery</span>
  <a class="btn btn--hot" href="tel:{TEL}">{ICON_PHONE} {TEL_DISPLAY}</a>
</header>

<main id="main">

  <section class="hero" data-par-zone>
    <div class="layer layer--sun" data-par="-90" aria-hidden="true">
      <svg class="rosette rosette-spin" viewBox="-100 -100 200 200" focusable="false"><use href="#rosette" x="-100" y="-100" width="200" height="200"/></svg>
    </div>
    <div class="layer layer--string" data-par="70" aria-hidden="true">
      <div class="string-row sway" style="background-image:{tiles['row_a']}"></div>
      <div class="string-row string-row--b sway sway--b" style="background-image:{tiles['row_b']}"></div>
    </div>

    <div class="wrap hero-content">
      <p class="brandline rise d1">Panader&iacute;a Mexicana <span class="dot"></span> Shakopee, Minnesota</p>
      <h1 class="wordmark rise d2">Oralia<span class="apos">&rsquo;</span>s <span class="two">Bakery</span></h1>
      <div class="rise d3">
        <p class="tagline es">&ldquo;Pan dulce mexicano y pasteles para toda ocasi&oacute;n&rdquo;</p>
        <p class="tagline-en">Mexican sweet bread, and cakes for every occasion.</p>
      </div>
      <p class="status rise d3" id="status" data-open="1"><span class="led"></span><span id="status-text">Open daily, 8am&ndash;8pm</span></p>
      <div class="btn-row rise d4">
        <a class="btn btn--hot" href="tel:{TEL}">{ICON_PHONE} Call {TEL_DISPLAY}</a>
        <a class="btn" href="{MAPS}" target="_blank" rel="noopener">{ICON_PIN} Get directions</a>
      </div>
    </div>

    <div class="layer layer--pan" data-par="-55" aria-hidden="true">{art['hero_pan']}</div>
  </section>

  <div style="color:var(--masa);background:var(--masa)">{CUT_DOWN}</div>

  <section class="band about" id="about">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">The bakery</p>
        <h2>A panader&iacute;a on Marschall Road</h2>
        <p class="lede">Oralia&rsquo;s Bakery is a Mexican bakery in Shakopee, open every day from eight in the morning to eight at night &mdash; pan dulce and pastries out of the case, and custom cakes made to order for whatever you&rsquo;re celebrating.</p>
        <div class="tradition">
          <p>Pan dulce isn&rsquo;t one thing, it&rsquo;s a whole category: soft, barely-sweet breads that panader&iacute;as have turned out by the rack for generations. The ritual travels with it &mdash; a tray, a pair of tongs, and no particular hurry about it.</p>
        </div>
      </div>
      <div class="charola">
        <h3>Good to know</h3>
        <dl class="facts">
          <div><dt>Where</dt><span class="ico">{ICON_PIN}</span><dd><a href="{MAPS}" target="_blank" rel="noopener">590 Marschall Rd<br>Shakopee, MN 55379</a></dd></div>
          <div><dt>Phone</dt><span class="ico">{ICON_PHONE}</span><dd><a href="tel:{TEL}">{TEL_DISPLAY}</a></dd></div>
          <div><dt>Hours</dt><span class="ico">{ICON_CLOCK}</span><dd>Every day, 8:00 am &ndash; 8:00 pm</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <div style="color:var(--band);background:var(--masa)">{CUT_UP}</div>

  <section class="band menu" id="menu" data-par-zone>
    <div class="tile-layer" data-par="90" aria-hidden="true" style="background-image:{TALAVERA}"></div>
    <div class="wrap">
      <p class="eyebrow">What they bake</p>
      <h2>Pan dulce, pasteles,<br>and the rest of the case</h2>
      <p>Three things, done the traditional way.</p>

      <div class="cards">
        <article class="card">
          {art['concha']}
          <h3>Pan Dulce</h3>
          <p class="es-sub">Mexican sweet bread</p>
          <p>The everyday heart of a panader&iacute;a &mdash; soft, gently sweet breads baked for the tray. A couple for the morning, or a boxful for the table.</p>
        </article>
        <article class="card">
          {art['pastel']}
          <h3>Pasteles</h3>
          <p class="es-sub">Custom cakes</p>
          <p>Cakes made to order <em class="es">para toda ocasi&oacute;n</em> &mdash; birthdays, quincea&ntilde;eras, baptisms, graduations. Call to talk through size, flavor, and the day you need it.</p>
        </article>
        <article class="card">
          {art['oreja']}
          <h3>Pastries</h3>
          <p class="es-sub">Reposter&iacute;a</p>
          <p>The rest of the case: pastries to go alongside a coffee, and whatever came out of the oven that day.</p>
        </article>
      </div>

      <div class="menu-note">
        <p>What&rsquo;s on the racks depends on the day. Call ahead to ask what&rsquo;s out, or to start a cake order.</p>
        <a class="btn btn--hot" href="tel:{TEL}">{ICON_PHONE} Call the bakery</a>
      </div>
    </div>
  </section>

  <div style="color:var(--band);background:var(--masa-deep)">{CUT_DOWN}</div>

  <section class="band say" id="reviews" data-par-zone>
    <svg class="rosette-drift r1" data-par="70" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><use href="#rosette" x="-100" y="-100" width="200" height="200"/></svg>
    <svg class="rosette-drift r2" data-par="-60" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><use href="#rosette" x="-100" y="-100" width="200" height="200"/></svg>
    <div class="wrap">
      <p class="eyebrow">Recurring themes in customer feedback</p>
      <h2>What people keep saying</h2>
      <ul class="themes">
        <li class="theme">
          <h3>A hidden gem</h3>
          <p>The description that comes up the most &mdash; the kind of place customers seem a little surprised isn&rsquo;t better known yet.</p>
        </li>
        <li class="theme">
          <h3>Classic Mexican baked goods</h3>
          <p>Feedback points again and again at the traditional side of the baking: the pan dulce and pastries people came looking for.</p>
        </li>
        <li class="theme">
          <h3>The go-to for celebrations</h3>
          <p>Named repeatedly as where people turn when they need dessert for a party, a milestone, or a family event.</p>
        </li>
      </ul>
      <p class="sourced">Summarized from recurring themes in public customer feedback &mdash; paraphrased rather than quoted. Read the reviews in full on the bakery&rsquo;s Google listing.</p>
    </div>
  </section>

  <div style="color:var(--masa);background:var(--masa-deep)">{CUT_UP}</div>

  <section class="band visit" id="visit">
    <div class="wrap">
      <p class="eyebrow">Hours &amp; location</p>
      <h2>Come by any day of the week</h2>

      <div class="visit-grid">
        <div class="ticket">
          <p class="sub">Hours</p>
          <h3>Open every day</h3>
          <ul class="hours" id="hours">
{hours_rows}
          </ul>
          <p class="status" id="status2" data-open="1"><span class="led"></span><span id="status2-text">Open daily, 8am&ndash;8pm</span></p>
        </div>

        <div class="place">
          <h3>Find the bakery</h3>
          <a class="addr" href="{MAPS}" target="_blank" rel="noopener">590 Marschall Rd<br>Shakopee, MN 55379</a>
          <br>
          <a class="tel" href="tel:{TEL}">{TEL_DISPLAY}</a>
          <div class="btn-row">
            <a class="btn btn--hot" href="{MAPS}" target="_blank" rel="noopener">{ICON_PIN} Directions in Google Maps</a>
            <a class="btn" href="tel:{TEL}">{ICON_PHONE} Tap to call</a>
          </div>
          <div class="tilecard">
            <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" focusable="false"><g fill="none" stroke="var(--turquesa)" stroke-width="2"><circle cx="22" cy="22" r="10"/><path d="M22 2v40M2 22h40"/><path d="M22 12l5 7-5 7-5-7z"/></g></svg>
            <p>Tap the address or either button for turn-by-turn directions &mdash; it opens straight into Google Maps.</p>
          </div>
          <p class="meta">Hours and contact details come from the bakery&rsquo;s Google listing. It&rsquo;s worth a quick call before a special trip.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="foot" id="contact">
  <div class="foot-top" aria-hidden="true"><div class="string-row" style="background-image:{tiles['row_foot']}"></div></div>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <h2>Oralia&rsquo;s Bakery</h2>
        <p class="es">Pan dulce mexicano y pasteles para toda ocasi&oacute;n</p>
      </div>
      <div>
        <p class="lbl">Visit</p>
        <address>
          <a href="{MAPS}" target="_blank" rel="noopener">590 Marschall Rd<br>Shakopee, MN 55379</a>
        </address>
      </div>
      <div>
        <p class="lbl">Call</p>
        <address><a href="tel:{TEL}">{TEL_DISPLAY}</a></address>
      </div>
      <div>
        <p class="lbl">Hours</p>
        <p style="color:var(--on-band)">Every day<br>8:00 am &ndash; 8:00 pm</p>
      </div>
    </div>
    <div class="colophon">
      <p>Mexican bakery &amp; panader&iacute;a in Shakopee, Minnesota.</p>
      <p>Call {TEL_DISPLAY} to order a cake.</p>
    </div>
  </div>
</footer>

<script>
(function () {{
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- layered scroll parallax -------------------------------------
     Transform-only (translate3d), rAF-batched, passive listeners.
     Each layer declares its depth in px of travel across the zone. */
  var layers = Array.prototype.slice.call(document.querySelectorAll("[data-par]"));
  var zones = layers.map(function (el) {{ return el.closest("[data-par-zone]") || el.parentNode; }});
  var ticking = false;
  var running = false;

  function scale() {{
    /* gentler travel on phones, where the viewport does more of the work */
    return window.innerWidth < 700 ? 0.55 : 1;
  }}

  function frame() {{
    ticking = false;
    var vh = window.innerHeight, k = scale(), i, el, r, p, y;
    for (i = 0; i < layers.length; i++) {{
      el = layers[i];
      r = zones[i].getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) {{ continue; }}
      p = (vh - r.top) / (vh + r.height);          /* 0 entering -> 1 leaving */
      y = (p - 0.5) * (parseFloat(el.getAttribute("data-par")) || 0) * k;
      el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
    }}
  }}

  function onScroll() {{
    if (!ticking) {{ ticking = true; window.requestAnimationFrame(frame); }}
  }}

  function setParallax(on) {{
    if (on === running) {{ return; }}
    running = on;
    if (on) {{
      layers.forEach(function (el) {{ el.style.willChange = "transform"; }});
      window.addEventListener("scroll", onScroll, {{ passive: true }});
      window.addEventListener("resize", onScroll, {{ passive: true }});
      frame();
    }} else {{
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      layers.forEach(function (el) {{ el.style.transform = ""; el.style.willChange = ""; }});
    }}
  }}
  setParallax(!reduce.matches);
  if (reduce.addEventListener) {{
    reduce.addEventListener("change", function () {{ setParallax(!reduce.matches); }});
  }}

  /* ---- sticky call bar ---- */
  var bar = document.getElementById("topbar");
  var barTick = false;
  function barFrame() {{
    barTick = false;
    bar.setAttribute("data-show", window.scrollY > 520 ? "1" : "0");
  }}
  window.addEventListener("scroll", function () {{
    if (!barTick) {{ barTick = true; window.requestAnimationFrame(barFrame); }}
  }}, {{ passive: true }});
  barFrame();

  /* ---- open / closed, in the bakery's own time zone ---- */
  try {{
    var parts = new Intl.DateTimeFormat("en-US", {{
      timeZone: "America/Chicago", hour12: false,
      weekday: "short", hour: "2-digit", minute: "2-digit"
    }}).formatToParts(new Date());
    var get = function (t) {{
      for (var i = 0; i < parts.length; i++) {{ if (parts[i].type === t) return parts[i].value; }}
      return "";
    }};
    var hh = parseInt(get("hour"), 10), mm = parseInt(get("minute"), 10);
    var mins = hh * 60 + mm;
    var open = mins >= 480 && mins < 1200;                       /* 8:00 - 20:00 */
    var msg;
    if (open) {{
      msg = mins >= 1140 ? "Open now \\u00b7 closes at 8pm" : "Open now \\u00b7 until 8pm";
    }} else {{
      msg = mins < 480 ? "Closed \\u00b7 opens at 8am" : "Closed \\u00b7 opens 8am tomorrow";
    }}
    ["status", "status2"].forEach(function (id) {{
      var n = document.getElementById(id);
      if (!n) return;
      n.setAttribute("data-open", open ? "1" : "0");
      document.getElementById(id + "-text").textContent = msg;
    }});
    var dowNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dow = dowNames.indexOf(get("weekday"));
    if (dow > -1) {{
      var row = document.querySelector('#hours li[data-dow="' + dow + '"]');
      if (row) {{ row.setAttribute("data-today", "1"); }}
    }}
  }} catch (e) {{ /* keep the static "Open daily, 8am-8pm" copy */ }}
}}());
</script>
"""

page = pathlib.Path("/home/user/pullman-club-site/oralias-bakery/_styles.html").read_text()
(ROOT / "_page.html").write_text(page + BODY)
print("body written, total", len((page + BODY).encode()), "bytes")
