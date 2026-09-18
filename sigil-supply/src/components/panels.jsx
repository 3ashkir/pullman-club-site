import { EXCEPTION } from '../data/catalog.js'
import { formatRelative, formatWhen } from '../utils/time.js'

function nextText(next) {
  return next.text ? next.text : formatWhen(next.at)
}

// Every value on this screen carries its own label — nothing is left to
// guesswork about what a number means.
function Field({ label, children }) {
  return (
    <div className="field">
      <dt className="field-label">{label}</dt>
      <dd className="field-value">{children}</dd>
    </div>
  )
}

function ItemCard({ item }) {
  const short = item.onHand < item.par
  return (
    <li className={'item' + (item.exception ? ' item--exception' : '')}>
      <div className="item-top">
        <h3 className="item-name">{item.name}</h3>
        <span className={'pill pill--' + item.status}>{item.statusLabel}</span>
      </div>

      {item.exception && <p className="exception">{EXCEPTION}</p>}

      <dl className="fields">
        <Field label="On hand">
          {item.onHand} {item.unit}
        </Field>
        <Field label="PAR level">
          {item.par} {item.unit}
        </Field>
        <Field label="Shelf">
          {short ? (
            <span className="short">{item.par - item.onHand} below PAR</span>
          ) : (
            'At PAR'
          )}
        </Field>
        <Field label={item.next.label}>{nextText(item.next)}</Field>
      </dl>

      {item.substitute && (
        <dl className="fields fields--wide">
          <Field label="Substitute">{item.substitute}</Field>
        </dl>
      )}

      {item.note && <p className="item-note">{item.note}</p>}
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
    <ul className="items">
      {location.deliveries.map((d, i) => (
        <li className="item" key={d.sku + i}>
          <div className="item-top">
            <h3 className="item-name">{d.name}</h3>
            <span className="pill pill--delivered">Delivered</span>
          </div>
          <dl className="fields">
            <Field label="Quantity">
              {d.qty} {d.unit}
            </Field>
            <Field label="Delivered">{formatRelative(d.at)}</Field>
            <Field label="Stocked by">{d.handler}</Field>
          </dl>
        </li>
      ))}
    </ul>
  )
}

export function OrdersPanel({ location }) {
  if (location.orders.length === 0) {
    return <p className="empty">No open orders for this location.</p>
  }

  return (
    <ul className="items">
      {location.orders.map((o, i) => (
        <li className="item" key={o.sku + i}>
          <div className="item-top">
            <h3 className="item-name">{o.name}</h3>
            <span className="pill pill--on_way">On the way</span>
          </div>
          <dl className="fields">
            <Field label="Quantity">
              {o.qty} {o.unit}
            </Field>
            <Field label="Ordered by">{o.orderedBy}</Field>
            <Field label="Placed">{formatRelative(o.placedAt)}</Field>
            <Field label={o.sameDay ? 'Arrives' : 'ETA'}>
              <span className={o.sameDay ? 'soon' : undefined}>{formatWhen(o.eta)}</span>
            </Field>
          </dl>
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
