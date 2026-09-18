# Sigil Supply — demo dashboard

A read-only supply status app for hospital PAR locations. The point of the demo
is status visibility: anyone can see where an item stands without calling
materials management. Nothing here is editable — no orders are placed, no
counts are entered.

Sample data only — no backend, no database, no network calls.

## The three taps

```
Areas  →  Locations in that area  →  One location, four tabs
```

1. **Areas** — Med/Surg, Critical Care, Emergency, Perioperative, Clinics &
   Ancillary. Each card shows how many locations and open orders it has, and
   flags anything that needs attention.
2. **Locations** — the PAR rooms in that area, each with its last PAR count
   (when, and which handler did it).
3. **Location** — four tabs:

| Tab | What it answers |
| --- | --- |
| Items | Everything tracked here: on-hand vs PAR, status, what happens next |
| Delivered | What the supply handler stocked, with quantities and times |
| Orders | What the charge nurse ordered, who ordered it, and when it lands |
| Backorder | Backordered items: what the substitute is, or that there isn't one |

Every value on the location screens carries its own label — on hand, PAR level,
shelf, who counted, who ordered, when it lands — so nothing has to be inferred
from position or color. The PAR count sits at the top of each location: the time
it was taken, the handler who took it, how many items were counted, and how many
came up short.

## Statuses

The coordinator handles substitutions directly, so there is no approval or
sign-off state to read. What is left is what is true on the shelf:

| Status | Meaning |
| --- | --- |
| No substitute | Backordered with nothing coming — the only state that needs a person |
| Substitute on the way | Coordinator swapped in an alternate; it is on the shelf or shipping |
| On the way | Ordered and in transit, with the ETA shown |
| Low | Below PAR with nothing ordered yet |
| Delivered | Restocked to PAR within the last six hours |
| On PAR | At or above PAR, nothing pending |

Items sort in that order within a location, so whatever needs watching sits at
the top of the Items tab. "No substitute" items are also counted on the area and
location screens and set apart on the card by a heavier border and a written
reason — never by color alone.

## Running it

```
cd sigil-supply
npm install
npm run dev        # vite dev server, prints a local URL
npm run build      # static bundle in dist/
npm run standalone # regenerates standalone/index.html
```

`standalone/index.html` is the whole demo inlined into one file with no
dependencies — open it by double-clicking, or host it anywhere. It is generated
from the same data, formatting and stylesheet as the React app by
`tools/standalone.mjs`; edit `src/`, then re-run `npm run standalone`.

## Files

```
src/
  main.jsx                 React entry point
  App.jsx                  navigation state: area → location → tab
  styles.css               all styling (plain CSS, no framework)
  components/
    Crumbs.jsx             back control and trail
    AreaGrid.jsx           screen 1
    LocationList.jsx       screen 2
    LocationDetail.jsx     screen 3, tab bar
    panels.jsx             Items / Delivered / Orders / Backorder panels
  data/
    catalog.js             supply catalog, status vocabulary, exception reasons
    hospital.js            16 PAR locations across 5 areas, with items,
                           deliveries and orders
  utils/
    time.js                relative and clock-time formatting
    text.js                plural-aware counts
tools/
  standalone.mjs           builds standalone/index.html from src/
```

To change what the demo shows, edit `src/data/hospital.js`. Items, deliveries
and orders are written as short tuples and expanded by the builders at the top
of that file. Timestamps are generated relative to page load, so the demo always
looks current.
