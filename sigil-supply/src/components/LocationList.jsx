import { locationSummary } from '../data/hospital.js'
import { formatRelative } from '../utils/time.js'
import { count, attention } from '../utils/text.js'

export default function LocationList({ area, onSelect }) {
  return (
    <>
      <h2 className="screen-title">{area.name}</h2>
      <p className="screen-sub">{count(area.locations.length, 'PAR location')}</p>
      <ul className="rows-list">
        {area.locations.map((location) => {
          const s = locationSummary(location)
          return (
            <li key={location.id}>
              <button type="button" className="list-row" onClick={() => onSelect(location.id)}>
                <span className="list-main">
                  <span className="list-title">{location.name}</span>
                  <span className="list-sub">
                    Counted {formatRelative(location.lastCount.at)} by {location.lastCount.handler}
                  </span>
                </span>
                <span className="list-side">
                  {s.attention > 0 && <span className="flag">{attention(s.attention)}</span>}
                  <span className="muted">
                    {count(s.items, 'item')} · {count(s.orders, 'order')}
                  </span>
                </span>
                <span className="chev" aria-hidden="true">›</span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
