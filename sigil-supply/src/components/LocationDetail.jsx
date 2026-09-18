import { backorderItems, locationSummary } from '../data/hospital.js'
import { formatRelative, formatClock } from '../utils/time.js'
import { ItemsPanel, DeliveriesPanel, OrdersPanel, BackorderPanel } from './panels.jsx'

const TABS = [
  { id: 'items', label: 'Items' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'orders', label: 'Orders' },
  { id: 'backorder', label: 'Backorder' },
]

export default function LocationDetail({ location, tab, onTab }) {
  const summary = locationSummary(location)
  const backorders = backorderItems(location)
  const counts = {
    items: summary.items,
    delivered: location.deliveries.length,
    orders: summary.orders,
    backorder: backorders.length,
  }

  return (
    <>
      <h2 className="screen-title">{location.name}</h2>
      <p className="screen-sub">{location.kind}</p>

      {/* The PAR count itself, up front — who counted, when, and what it found. */}
      <dl className="stats">
        <div className="stat">
          <dt className="field-label">Last PAR count</dt>
          <dd className="stat-value">{formatClock(location.lastCount.at)}</dd>
          <dd className="stat-note">{formatRelative(location.lastCount.at)}</dd>
        </div>
        <div className="stat">
          <dt className="field-label">Counted by</dt>
          <dd className="stat-value">{location.lastCount.handler}</dd>
          <dd className="stat-note">Supply handler</dd>
        </div>
        <div className="stat">
          <dt className="field-label">Items counted</dt>
          <dd className="stat-value">{summary.items}</dd>
          <dd className="stat-note">{summary.belowPar} below PAR</dd>
        </div>
        <div className="stat">
          <dt className="field-label">Needs attention</dt>
          <dd className="stat-value">{summary.attention}</dd>
          <dd className="stat-note">{summary.attention === 0 ? 'Nothing stuck' : 'No substitute yet'}</dd>
        </div>
      </dl>

      <div className="tabs" role="tablist" aria-label="Location views">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={'tab-' + t.id}
            aria-selected={t.id === tab}
            aria-controls="panel"
            className={'tab' + (t.id === tab ? ' is-on' : '')}
            onClick={() => onTab(t.id)}
          >
            {t.label}
            <span className="tab-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="panel" id="panel" role="tabpanel" aria-labelledby={'tab-' + tab}>
        {tab === 'items' && <ItemsPanel location={location} />}
        {tab === 'delivered' && <DeliveriesPanel location={location} />}
        {tab === 'orders' && <OrdersPanel location={location} />}
        {tab === 'backorder' && <BackorderPanel items={backorders} />}
      </div>
    </>
  )
}
