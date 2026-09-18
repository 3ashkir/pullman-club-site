import { EXCEPTION } from '../data/catalog.js'
import { formatRelative, formatWhen } from '../utils/time.js'

function nextText(next) {
  return next.text ? next.text : formatWhen(next.at)
}

function StatusPill({ item }) {
  return <span className={'pill pill--' + item.status}>{item.statusLabel}</span>
}

function ItemCard({ item }) {
  const short = item.onHand < item.par
  return (
    <li className={'item' + (item.exception ? ' item--exception' : '')}>
      <div className="item-top">
        <span className="item-name">{item.name}</span>
        <StatusPill item={item} />
      </div>

      <div className="item-counts">
        <span className={'count' + (short ? ' count--short' : '')}>
          {item.onHand} of {item.par} {item.unit}
        </span>
        <span className="count-note">{short ? `${item.par - item.onHand} below PAR` : 'at PAR'}</span>
      </div>

      {item.exception && <p className="exception">{EXCEPTION[item.exception]}</p>}
      {item.note && <p className="item-note">{item.note}</p>}
      {item.substitute && (
        <p className="item-sub">
          <span className="field-label">Substitute</span> {item.substitute}
        </p>
      )}

      <p className="item-next">
        <span className="field-label">{item.next.label}</span> {nextText(item.next)}
      </p>
    </li>
  )
}

export function ItemsPanel({ location }) {
  return (
    <ul className="items">
      {location.items.map((item) => (
        <ItemCard key={item.sku} item={item} />
      ))}
    </ul>
  )
}

export function DeliveriesPanel({ location }) {
  if (location.deliveries.length === 0) {
    return <p className="empty">No deliveries logged in the last 48 hours.</p>
  }

  return (
    <>
      <p className="panel-note">
        Last PAR count {formatRelative(location.lastCount.at)} by {location.lastCount.handler}.
      </p>
      <ul className="records">
        {location.deliveries.map((d, i) => (
          <li key={d.sku + i}>
            <span className="record-main">
              <span className="record-title">{d.name}</span>
              <span className="record-sub">Stocked by {d.handler}</span>
            </span>
            <span className="record-side">
              <span className="qty">
                +{d.qty} {d.unit}
              </span>
              <span className="muted">{formatRelative(d.at)}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export function OrdersPanel({ location }) {
  if (location.orders.length === 0) {
    return <p className="empty">No open orders for this location.</p>
  }

  return (
    <ul className="records">
      {location.orders.map((o, i) => (
        <li key={o.sku + i}>
          <span className="record-main">
            <span className="record-title">{o.name}</span>
            <span className="record-sub">
              Ordered by {o.orderedBy} · {formatRelative(o.placedAt)}
            </span>
          </span>
          <span className="record-side">
            <span className="qty">
              {o.qty} {o.unit}
            </span>
            <span className={o.sameDay ? 'eta eta--today' : 'eta'}>
              {o.sameDay ? 'Arrives ' : 'ETA '}
              {formatWhen(o.eta)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function BackorderPanel({ items }) {
  if (items.length === 0) {
    return <p className="empty">Nothing on backorder at this location.</p>
  }

  return (
    <ul className="items">
      {items.map((item) => (
        <ItemCard key={item.sku} item={item} />
      ))}
    </ul>
  )
}
