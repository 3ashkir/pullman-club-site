// Builds standalone/index.html: the same demo as the React app, inlined into a
// single file with no dependencies, so it can be opened or hosted anywhere.
// Data, formatting and styles are read from src/ — this file only adds a
// plain-DOM view layer that mirrors the React components.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

// Strip module syntax so the shared sources can run as one inline script.
const flatten = (p) =>
  read(p)
    .replace(/^import[\s\S]*?from\s+'[^']+'\n/gm, '')
    .replace(/^export\s+/gm, '')

const data = [
  flatten('src/utils/time.js'),
  flatten('src/utils/text.js'),
  flatten('src/data/catalog.js'),
  flatten('src/data/hospital.js'),
].join('\n')

const view = String.raw`
var state = { areaId: null, locationId: null, tab: 'items' }
var TABS = [
  { id: 'items', label: 'Items' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'orders', label: 'Orders' },
  { id: 'backorder', label: 'Backorder' },
]

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function nextText(next) {
  return next.text ? next.text : formatWhen(next.at)
}

function flag(n) {
  return n > 0 ? '<span class="flag">' + attention(n) + '</span>' : ''
}

function areasScreen() {
  var cards = areas
    .map(function (area) {
      var s = areaSummary(area)
      return (
        '<li><button type="button" class="card" data-area="' + area.id + '">' +
        '<span class="card-head"><span class="card-title">' + esc(area.name) + '</span><span class="chev" aria-hidden="true">›</span></span>' +
        '<span class="card-blurb">' + esc(area.blurb) + '</span>' +
        '<span class="card-meta"><span>' + count(s.locations, 'location') + '</span><span>' + count(s.orders, 'open order') + '</span>' + flag(s.attention) + '</span>' +
        '</button></li>'
      )
    })
    .join('')
  return '<h2 class="screen-title">Areas</h2><p class="screen-sub">Pick an area to see its PAR locations.</p><ul class="cards">' + cards + '</ul>'
}

function locationsScreen(area) {
  var rows = area.locations
    .map(function (l) {
      var s = locationSummary(l)
      return (
        '<li><button type="button" class="list-row" data-location="' + l.id + '">' +
        '<span class="list-main"><span class="list-title">' + esc(l.name) + '</span>' +
        '<span class="list-sub">Counted ' + formatRelative(l.lastCount.at) + ' by ' + esc(l.lastCount.handler) + '</span></span>' +
        '<span class="list-side">' + flag(s.attention) + '<span class="muted">' + s.items + ' items · ' + s.orders + ' orders</span></span>' +
        '<span class="chev" aria-hidden="true">›</span>' +
        '</button></li>'
      )
    })
    .join('')
  return (
    '<h2 class="screen-title">' + esc(area.name) + '</h2>' +
    '<p class="screen-sub">' + count(area.locations.length, 'PAR location') + '</p>' +
    '<ul class="rows-list">' + rows + '</ul>'
  )
}

function field(label, value, cls) {
  return (
    '<div class="field"><dt class="field-label">' + esc(label) + '</dt>' +
    '<dd class="field-value' + (cls ? ' ' + cls : '') + '">' + value + '</dd></div>'
  )
}

function itemCard(item) {
  var short = item.onHand < item.par
  var shelf = short
    ? '<span class="short">' + (item.par - item.onHand) + ' below PAR</span>'
    : 'At PAR'
  return (
    '<li class="item' + (item.exception ? ' item--exception' : '') + '">' +
    '<div class="item-top"><h3 class="item-name">' + esc(item.name) + '</h3>' +
    '<span class="pill pill--' + item.status + '">' + item.statusLabel + '</span></div>' +
    (item.exception ? '<p class="exception">' + esc(EXCEPTION) + '</p>' : '') +
    '<dl class="fields">' +
    field('On hand', item.onHand + ' ' + item.unit) +
    field('PAR level', item.par + ' ' + item.unit) +
    field('Shelf', shelf) +
    field(item.next.label, esc(nextText(item.next))) +
    '</dl>' +
    (item.substitute ? '<dl class="fields fields--wide">' + field('Substitute', esc(item.substitute)) + '</dl>' : '') +
    (item.note ? '<p class="item-note">' + esc(item.note) + '</p>' : '') +
    '</li>'
  )
}

function itemsPanel(location) {
  return '<ul class="items">' + location.items.map(itemCard).join('') + '</ul>'
}

function deliveriesPanel(location) {
  if (location.deliveries.length === 0) return '<p class="empty">No deliveries logged in the last 48 hours.</p>'
  var rows = location.deliveries
    .map(function (d) {
      return (
        '<li class="item"><div class="item-top"><h3 class="item-name">' + esc(d.name) + '</h3>' +
        '<span class="pill pill--delivered">Delivered</span></div>' +
        '<dl class="fields">' +
        field('Quantity', d.qty + ' ' + d.unit) +
        field('Delivered', formatRelative(d.at)) +
        field('Stocked by', esc(d.handler)) +
        '</dl></li>'
      )
    })
    .join('')
  return '<ul class="items">' + rows + '</ul>'
}

function ordersPanel(location) {
  if (location.orders.length === 0) return '<p class="empty">No open orders for this location.</p>'
  var rows = location.orders
    .map(function (o) {
      return (
        '<li class="item"><div class="item-top"><h3 class="item-name">' + esc(o.name) + '</h3>' +
        '<span class="pill pill--on_way">On the way</span></div>' +
        '<dl class="fields">' +
        field('Quantity', o.qty + ' ' + o.unit) +
        field('Ordered by', esc(o.orderedBy)) +
        field('Placed', formatRelative(o.placedAt)) +
        field(o.sameDay ? 'Arrives' : 'ETA', '<span class="' + (o.sameDay ? 'soon' : '') + '">' + formatWhen(o.eta) + '</span>') +
        '</dl></li>'
      )
    })
    .join('')
  return '<ul class="items">' + rows + '</ul>'
}

function backorderPanel(items) {
  if (items.length === 0) return '<p class="empty">Nothing on backorder at this location.</p>'
  return '<ul class="items">' + items.map(itemCard).join('') + '</ul>'
}

function stat(label, value, note) {
  return (
    '<div class="stat"><dt class="field-label">' + esc(label) + '</dt>' +
    '<dd class="stat-value">' + esc(value) + '</dd>' +
    '<dd class="stat-note">' + esc(note) + '</dd></div>'
  )
}

function detailScreen(location) {
  var summary = locationSummary(location)
  var backorders = backorderItems(location)
  var counts = {
    items: location.items.length,
    delivered: location.deliveries.length,
    orders: location.orders.length,
    backorder: backorders.length,
  }
  var tabs = TABS.map(function (t) {
    return (
      '<button type="button" role="tab" id="tab-' + t.id + '" aria-controls="panel" aria-selected="' + (t.id === state.tab) + '"' +
      ' class="tab' + (t.id === state.tab ? ' is-on' : '') + '" data-tab="' + t.id + '">' + t.label +
      '<span class="tab-count">' + counts[t.id] + '</span></button>'
    )
  }).join('')

  var body =
    state.tab === 'items' ? itemsPanel(location)
    : state.tab === 'delivered' ? deliveriesPanel(location)
    : state.tab === 'orders' ? ordersPanel(location)
    : backorderPanel(backorders)

  return (
    '<h2 class="screen-title">' + esc(location.name) + '</h2>' +
    '<p class="screen-sub">' + esc(location.kind) + '</p>' +
    '<dl class="stats">' +
    stat('Last PAR count', formatClock(location.lastCount.at), formatRelative(location.lastCount.at)) +
    stat('Counted by', location.lastCount.handler, 'Supply handler') +
    stat('Items counted', String(summary.items), summary.belowPar + ' below PAR') +
    stat('Needs attention', String(summary.attention), summary.attention === 0 ? 'Nothing stuck' : 'No substitute yet') +
    '</dl>' +
    '<div class="tabs" role="tablist" aria-label="Location views">' + tabs + '</div>' +
    '<div class="panel" id="panel" role="tabpanel" aria-labelledby="tab-' + state.tab + '">' + body + '</div>'
  )
}

function crumbs(area, location) {
  var trail = [{ label: 'Areas', level: 0 }]
  if (area) trail.push({ label: area.name, level: 1 })
  if (location) trail.push({ label: location.name, level: 2 })

  var back = trail.length > 1 ? trail[trail.length - 2] : null
  var html = back
    ? '<button type="button" class="back" data-back="' + back.level + '"><span aria-hidden="true">‹</span> ' + esc(back.label) + '</button>'
    : ''
  html += '<ol>' + trail
    .map(function (c, i) {
      return '<li' + (i === trail.length - 1 ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</li>'
    })
    .join('') + '</ol>'
  return html
}

function render() {
  var area = state.areaId ? findArea(state.areaId) : null
  var location = area && state.locationId ? findLocation(state.areaId, state.locationId) : null

  document.getElementById('crumbs').innerHTML = crumbs(area, location)
  document.getElementById('screen').innerHTML = location ? detailScreen(location) : area ? locationsScreen(area) : areasScreen()
  window.scrollTo({ top: 0 })
}

document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-area], [data-location], [data-tab], [data-back]')
  if (!el) return
  if (el.dataset.area) state = { areaId: el.dataset.area, locationId: null, tab: 'items' }
  else if (el.dataset.location) state = { areaId: state.areaId, locationId: el.dataset.location, tab: 'items' }
  else if (el.dataset.tab) state = { areaId: state.areaId, locationId: state.locationId, tab: el.dataset.tab }
  else if (el.dataset.back === '0') state = { areaId: null, locationId: null, tab: 'items' }
  else if (el.dataset.back === '1') state = { areaId: state.areaId, locationId: null, tab: 'items' }
  render()
})

document.getElementById('asof').textContent = 'As of ' + formatClock(new Date()) + ' · demo data'
render()
`

const html = `<title>Sigil Supply PAR Rooms</title>
<meta charset="utf-8">
<style>
${read('src/styles.css')}</style>

<div class="app">
  <header class="masthead">
    <div>
      <p class="wordmark">Sigil Supply</p>
      <p class="tagline">Where every item stands, without calling anyone.</p>
    </div>
    <p class="asof" id="asof"></p>
  </header>

  <nav class="crumbs" id="crumbs" aria-label="Breadcrumb"></nav>

  <main id="screen"></main>

  <footer class="colophon">Sample data for demonstration. Times are generated when the page loads.</footer>
</div>

<script>
${data}
${view}</script>
`

const out = path.join(root, 'standalone', 'index.html')
fs.writeFileSync(out, html)
console.log('wrote', path.relative(root, out), (html.length / 1024).toFixed(1) + ' KB')
