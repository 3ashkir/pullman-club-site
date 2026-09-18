# Sigil Supply — demo dashboard

A read-only status feed for hospital PAR locations. The point of the demo is
status visibility: a nurse or supply tech can see where every item stands
without calling anyone. There are no buttons or actions on routine items.

Sample data only — no backend, no database, no network calls.

## Running it

```
cd sigil-supply
npm install
npm run dev
```

Vite prints a local URL (default http://localhost:5173). `npm run build`
produces a static bundle in `dist/` that can be served from anywhere.

## What the view shows

Every row carries five fields: item name, PAR location, current status, last
updated time, and expected next update (an ETA, a backorder fill date, or a
sign-off deadline).

Statuses, in the order the feed sorts them (most urgent first):

| Status | Meaning |
| --- | --- |
| Backordered | Vendor cannot fill; watch the fill date or substitute |
| Delayed | Shipped but late; revised ETA shown |
| Substitute pending | An alternate item is in play |
| Arriving today | On the truck, ETA today |
| On time | Nothing to watch; next scheduled check shown |

Within a status, the most recently updated item sorts first, so the feed reads
top-down like a running status board.

## Exceptions

Two situations need a human and are pulled into a **Needs attention** section
at the top of the page:

- backordered with no substitute identified
- a substitute waiting on clinical sign-off

They are separated structurally, not by color: their own section and heading, a
heavy left rule on the group, a tinted row background, and an all-caps label on
the row naming the reason. The demo still reads correctly in grayscale or for a
color-blind viewer.

## Filters

`All` / `Needs attention` / `Arriving today`, with live counts. The filter only
changes which sections and rows are visible — nothing is editable.

## Layout

Five-column table on desktop; below 820px each row becomes a stacked card with
field labels. No animation, no imagery.

## Files

```
src/
  main.jsx               React entry point
  App.jsx                page shell, filter state, section layout
  styles.css             all styling (plain CSS, no framework)
  components/
    FilterBar.jsx        All / Needs attention / Arriving today toggle
    ItemList.jsx         table header + row list
    ItemRow.jsx          one supply item
  data/
    parItems.js          20 sample PAR items, status vocabulary, exception reasons
  utils/
    sort.js              urgency sort + exception/routine split
    time.js              relative and clock-time formatting
```

To change what the demo shows, edit `src/data/parItems.js`. Timestamps are
generated relative to page load (`minutesAgo(41)`, `hoursFromNow(3)`), so the
feed always looks current whenever the demo is opened.
