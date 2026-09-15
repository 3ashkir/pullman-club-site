import math, re, urllib.parse

def rosette(idx_id="rosette"):
    """Cempasuchil-style marigold rosette: two rings of petals + a cut center."""
    out = [f'<symbol id="{idx_id}" viewBox="-100 -100 200 200">']
    out.append('<g fill="none">')
    # outer petals
    for i in range(16):
        a = i * 22.5
        out.append(f'<ellipse cx="0" cy="-68" rx="13" ry="30" fill="#F0A81C" transform="rotate({a})"/>')
    for i in range(12):
        a = i * 30 + 15
        out.append(f'<ellipse cx="0" cy="-44" rx="12" ry="26" fill="#D2860C" transform="rotate({a})"/>')
    out.append('<circle r="30" fill="#C2502E"/>')
    for i in range(8):
        a = i * 45
        out.append(f'<circle cx="0" cy="-17" r="5.5" fill="#FBF2DE" transform="rotate({a})"/>')
    out.append('<circle r="7" fill="#FBF2DE"/>')
    out.append('</g></symbol>')
    return "".join(out)

PEN_W, PEN_H = 112, 86

def pennant_defs():
    """One papel-picado pennant: rectangle, zigzag hem, punched cuts via mask."""
    zig = "".join(" l-14 18 -14 -18" for _ in range(4))
    body = f'<path d="M0 0 H{PEN_W} V{PEN_H}{zig} Z" mask="url(#pcut)"/>'
    holes = []
    holes.append('<rect x="0" y="-4" width="112" height="112" fill="#fff"/>')
    holes.append('<rect x="14" y="12" width="84" height="3.5" fill="#000"/>')
    holes.append('<circle cx="56" cy="30" r="10" fill="#000"/>')
    holes.append('<circle cx="28" cy="32" r="5" fill="#000"/>')
    holes.append('<circle cx="84" cy="32" r="5" fill="#000"/>')
    holes.append('<path d="M56 46 l13 16 -13 16 -13 -16 Z" fill="#000"/>')
    holes.append('<circle cx="26" cy="58" r="6.5" fill="#000"/>')
    holes.append('<circle cx="86" cy="58" r="6.5" fill="#000"/>')
    holes.append('<rect x="20" y="74" width="72" height="3" fill="#000"/>')
    return ('<defs><mask id="pcut" maskUnits="userSpaceOnUse" x="-2" y="-4" width="116" height="112">'
            + "".join(holes) + '</mask><g id="pennant">' + body + '</g></defs>')

def bunting(width=1500, colors=None, seed=0, cls="", string_color="#6C4A37"):
    """A strung row of pennants sagging along a catenary-ish curve."""
    colors = colors or ["#C2502E", "#F0A81C", "#17858A", "#8E1C22", "#D8397E", "#F3E3C4"]
    step = 122
    n = width // step + 1
    h = 150
    parts = []
    def sag(x):
        t = x / width
        return 10 + 34 * math.sin(math.pi * t) ** 0.85
    d = f'M0 {sag(0):.1f} ' + " ".join(f'L{x} {sag(x):.1f}' for x in range(60, width + 1, 60))
    parts.append(f'<path d="{d}" fill="none" stroke="{string_color}" stroke-width="3" stroke-linecap="round" opacity=".75"/>')
    for i in range(n):
        x = i * step + 6
        y = sag(x + PEN_W / 2) - 2
        c = colors[(i + seed) % len(colors)]
        rot = -3 + ((i * 37 + seed * 13) % 7)
        parts.append(f'<use href="#pennant" x="{x}" y="{y:.1f}" fill="{c}" transform="rotate({rot} {x + PEN_W/2:.0f} {y:.0f})"/>')
    return (f'<svg class="string{cls}" viewBox="0 0 {width} {h}" width="{width}" height="{h}" '
            f'aria-hidden="true" focusable="false">' + pennant_defs() + "".join(parts) + "</svg>")

def concha(topping="#F0A81C", dough="#E0A76A", size=120):
    """Concha: round sweet bread with a scored sugar shell."""
    cx, cy, r = 60, 60, 40
    p = [f'<svg class="art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">']
    p.append(f'<ellipse cx="{cx}" cy="{cy+6}" rx="47" ry="42" fill="{dough}" stroke="currentColor" stroke-width="3.5"/>')
    p.append(f'<clipPath id="cc{topping[1:]}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{topping}" stroke="currentColor" stroke-width="3"/>')
    p.append(f'<g clip-path="url(#cc{topping[1:]})" stroke="currentColor" stroke-width="2.4" fill="none" opacity=".8">')
    for i in range(12):
        a = math.radians(i * 30)
        p.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + 46*math.cos(a):.1f}" y2="{cy + 46*math.sin(a):.1f}"/>')
    for rr in (13, 24, 34):
        p.append(f'<circle cx="{cx}" cy="{cy}" r="{rr}"/>')
    p.append('</g></svg>')
    return "".join(p)

def pastel():
    """Two-tier celebration cake with piped scallops and a rosette."""
    p = ['<svg class="art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">']
    p.append('<path d="M14 104 V74 h92 v30 z" fill="#FBF2DE" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>')
    p.append('<path d="M30 74 V46 h60 v28 z" fill="#FBF2DE" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>')
    scal = lambda y, x0, x1, n: '<path d="M' + str(x0) + ' ' + str(y) + ''.join(
        f' a7 7 0 0 0 {(x1-x0)/n:.1f} 0' for _ in range(n)) + '" fill="none" stroke="#D8397E" stroke-width="4" stroke-linecap="round"/>'
    p.append(scal(78, 16, 104, 6))
    p.append(scal(50, 32, 88, 4))
    p.append('<g fill="#17858A">')
    for x in (26, 46, 66, 86):
        p.append(f'<circle cx="{x}" cy="92" r="4"/>')
    p.append('</g>')
    p.append('<g transform="translate(60 40) scale(.17)"><use href="#rosette" x="-100" y="-100" width="200" height="200"/></g>')
    p.append('<path d="M6 104 h108" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>')
    p.append('</svg>')
    return "".join(p)

def oreja():
    """Cuernito: the crescent horn off the pan dulce rack, scored in segments."""
    p = ['<svg class="art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">']
    # crescent body: outer sweep, inner sweep back
    p.append('<path d="M18 92 C4 62 16 26 46 16 C40 30 42 40 50 48 '
             'C62 60 82 60 98 54 C102 78 84 100 56 100 C42 100 28 98 18 92 Z" '
             'fill="#E0A76A" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>')
    # segment scoring across the horn
    for d in ('M34 90 C30 74 32 58 40 46',
              'M50 97 C46 82 46 68 52 58',
              'M68 98 C66 84 68 74 74 66',
              'M85 93 C84 82 86 74 90 68'):
        p.append(f'<path d="{d}" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>')
    # glaze along the outer curve
    p.append('<path d="M20 90 C7 62 18 30 44 19" fill="none" stroke="#F0A81C" stroke-width="5" '
             'stroke-linecap="round" opacity=".85"/>')
    p.append('</svg>')
    return "".join(p)

def hero_pan():
    """Front parallax layer: a concha and an oreja, as if just off the tray."""
    p = ['<svg class="hero-pans" viewBox="0 0 348 262" aria-hidden="true" focusable="false">']
    p.append('<g transform="translate(150 10) scale(1.55)">' + concha("#F0A81C").split('>',1)[1].rsplit('</svg>',1)[0] + '</g>')
    p.append('<g transform="translate(6 96) scale(1.15)">' + concha("#D8397E", "#E8B478").replace('id="cc', 'id="cx').replace('url(#cc', 'url(#cx').split('>',1)[1].rsplit('</svg>',1)[0] + '</g>')
    p.append('<g transform="translate(118 130) scale(1.0)">' + oreja().split('>',1)[1].rsplit('</svg>',1)[0] + '</g>')
    p.append('</svg>')
    return "".join(p)

def bunting_uri(seed=0, string_color="#6C4A37", colors=None):
    """The same row, packaged as a seamless repeat-x background tile."""
    svg = bunting(1200, seed=seed, string_color=string_color, colors=colors)
    svg = svg.replace('<svg class="string"', '<svg xmlns="http://www.w3.org/2000/svg"', 1)
    svg = svg.replace('class="string string--b"', '', 1)
    svg = re.sub(r'<svg (?!xmlns)', '<svg xmlns="http://www.w3.org/2000/svg" ', svg, count=1)
    svg = svg.replace('href="#pennant"', 'href="#pennant"')
    quoted = urllib.parse.quote(svg, safe="/:=<>?;,@&+$-_.!~()[] ")
    return "url('data:image/svg+xml," + quoted + "')"


if __name__ == "__main__":
    import sys, json
    out = {
        "rosette": rosette(),
        "bunting_a": bunting(1500, seed=0),
        "bunting_b": bunting(1500, seed=3, cls=" string--b"),
        "bunting_foot": bunting(1300, seed=1, string_color="#FDF3DF"),
        "concha": concha("#F0A81C"),
        "pastel": pastel(),
        "oreja": oreja(),
        "hero_pan": hero_pan(),
    }
    json.dump(out, open(sys.argv[1], "w"))
    print("ok", {k: len(v) for k, v in out.items()})
