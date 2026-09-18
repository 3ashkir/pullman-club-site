import { backorderItems, locationSummary } from '../data/hospital.js'
import { formatRelative } from '../utils/time.js'
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
      <p className="screen-sub">
        {location.kind} · counted {formatRelative(location.lastCount.at)} by {location.lastCount.handler}
      </p>

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
