import { areaSummary } from '../data/hospital.js'
import { count, attention } from '../utils/text.js'

export default function AreaGrid({ areas, onSelect }) {
  return (
    <>
      <h2 className="screen-title">Areas</h2>
      <p className="screen-sub">Pick an area to see its PAR locations.</p>
      <ul className="cards">
        {areas.map((area) => {
          const s = areaSummary(area)
          return (
            <li key={area.id}>
              <button type="button" className="card" onClick={() => onSelect(area.id)}>
                <span className="card-head">
                  <span className="card-title">{area.name}</span>
                  <span className="chev" aria-hidden="true">›</span>
                </span>
                <span className="card-blurb">{area.blurb}</span>
                <span className="card-meta">
                  <span>{count(s.locations, 'location')}</span>
                  <span>{count(s.orders, 'open order')}</span>
                  {s.attention > 0 && <span className="flag">{attention(s.attention)}</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
