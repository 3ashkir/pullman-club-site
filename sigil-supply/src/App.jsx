import { useMemo, useState } from 'react'
import Crumbs from './components/Crumbs.jsx'
import AreaGrid from './components/AreaGrid.jsx'
import LocationList from './components/LocationList.jsx'
import LocationDetail from './components/LocationDetail.jsx'
import { areas, findArea, findLocation } from './data/hospital.js'
import { formatClock } from './utils/time.js'

// Three screens, three taps: area -> location -> tab.
export default function App() {
  const [view, setView] = useState({ areaId: null, locationId: null, tab: 'items' })
  const loadedAt = useMemo(() => new Date(), [])

  const area = view.areaId ? findArea(view.areaId) : null
  const location = area && view.locationId ? findLocation(view.areaId, view.locationId) : null

  const trail = [{ label: 'Areas', to: { areaId: null, locationId: null, tab: 'items' } }]
  if (area) trail.push({ label: area.name, to: { areaId: area.id, locationId: null, tab: 'items' } })
  if (location) trail.push({ label: location.name, to: { areaId: area.id, locationId: location.id, tab: 'items' } })

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <p className="wordmark">Sigil Supply</p>
          <p className="tagline">Where every item stands, without calling anyone.</p>
        </div>
        <p className="asof">As of {formatClock(loadedAt)} · demo data</p>
      </header>

      <Crumbs trail={trail} onNavigate={setView} />

      <main>
        {!area && <AreaGrid areas={areas} onSelect={(areaId) => setView({ areaId, locationId: null, tab: 'items' })} />}

        {area && !location && (
          <LocationList
            area={area}
            onSelect={(locationId) => setView({ areaId: area.id, locationId, tab: 'items' })}
          />
        )}

        {location && (
          <LocationDetail
            location={location}
            tab={view.tab}
            onTab={(tab) => setView({ ...view, tab })}
          />
        )}
      </main>

      <footer className="colophon">Sample data for demonstration. Times are generated when the page loads.</footer>
    </div>
  )
}
