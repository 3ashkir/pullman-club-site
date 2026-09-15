import pathlib, sys

ROOT = pathlib.Path("/home/user/pullman-club-site/oralias-bakery")
content = (ROOT / "_page.html").read_text()
site = sys.argv[1] if len(sys.argv) > 1 else ""   # canonical base, once the URL is known

TITLE = "Oralia&rsquo;s Bakery | Mexican Panader&iacute;a in Shakopee, MN"
DESC = ("Oralia's Bakery is a Mexican bakery on Marschall Rd in Shakopee, MN - pan dulce, pastries, "
        "and custom cakes for every occasion. Open daily 8am-8pm. Call (612) 240-2031.")
OG_DESC = ("Pan dulce mexicano y pasteles para toda ocasion. A panaderia at 590 Marschall Rd, Shakopee, MN. "
           "Open daily 8am-8pm.")

canon = f'\n<link rel="canonical" href="{site}" />\n<meta property="og:url" content="{site}" />' if site else ""
og_img = f"{site.rstrip('/')}/og.png" if site else "og.png"

JSONLD = """{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Oralia's Bakery",
  "description": "Mexican bakery in Shakopee, Minnesota serving pan dulce, pastries, and custom cakes for special occasions.",
  "servesCuisine": "Mexican",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "590 Marschall Rd",
    "addressLocality": "Shakopee",
    "addressRegion": "MN",
    "postalCode": "55379",
    "addressCountry": "US"
  },
  "telephone": "+1-612-240-2031",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "08:00",
    "closes": "20:00"
  }],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Bakery",
    "itemListElement": [
      {"@type": "OfferCatalog", "name": "Pan dulce"},
      {"@type": "OfferCatalog", "name": "Custom cakes"},
      {"@type": "OfferCatalog", "name": "Pastries"}
    ]
  }
}"""

META = f"""<meta name="description" content="{DESC}" />{canon}
<meta name="theme-color" content="#FBF2DE" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#1C100B" media="(prefers-color-scheme: dark)" />
<meta name="color-scheme" content="light dark" />

<meta property="og:type" content="business.business" />
<meta property="og:site_name" content="Oralia's Bakery" />
<meta property="og:title" content="Oralia's Bakery &mdash; Panader&iacute;a in Shakopee, MN" />
<meta property="og:description" content="{OG_DESC}" />
<meta property="og:image" content="{og_img}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Oralia's Bakery, a Mexican panaderia in Shakopee, Minnesota, under a string of papel picado." />
<meta property="og:locale" content="en_US" />
<meta property="og:locale:alternate" content="es_MX" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Oralia's Bakery &mdash; Panader&iacute;a in Shakopee, MN" />
<meta name="twitter:description" content="{OG_DESC}" />
<meta name="twitter:image" content="{og_img}" />

<meta name="geo.region" content="US-MN" />
<meta name="geo.placename" content="Shakopee, Minnesota" />

<script type="application/ld+json">
{JSONLD}
</script>"""

# --- standalone page (repo / any static host) ---
head_bits, body_bits = content.split("</style>", 1)
head_bits += "</style>"
head_bits = head_bits.replace("<title>Oralia&rsquo;s Bakery</title>", f"<title>{TITLE}</title>", 1)
standalone = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
{META}
{head_bits}
</head>
<body>
{body_bits.strip()}
</body>
</html>
"""
(ROOT / "index.html").write_text(standalone)

# --- artifact build: the platform supplies doctype/head/body ---
artifact = content.replace("</style>", "</style>\n" + META, 1)
(ROOT / "_artifact.html").write_text(artifact)
print("index.html", len(standalone), "| _artifact.html", len(artifact))
