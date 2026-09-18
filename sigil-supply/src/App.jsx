import { useMemo, useState } from 'react'
import FilterBar from './components/FilterBar.jsx'
import ItemList from './components/ItemList.jsx'
import { parItems } from './data/parItems.js'
import { partitionItems } from './utils/sort.js'
import { formatClock } from './utils/time.js'

export default function App() {
  const [filter, setFilter] = useState('all')
  const loadedAt = useMemo(() => new Date(), [])

  const { attention, routine } = useMemo(() => partitionItems(parItems), [])

  const arrivingToday = useMemo(
    () => [...attention, ...routine].filter((i) => i.status === 'arriving_today'),
    [attention, routine],
  )

  const filters = [
    { id: 'all', label: 'All', count: parItems.length },
    { id: 'attention', label: 'Needs attention', count: attention.length },
    { id: 'arriving', label: 'Arriving today', count: arrivingToday.length },
  ]

  const showAttention = filter === 'all' || filter === 'attention'
  const showRoutine = filter === 'all' || filter === 'arriving'
  const routineItems = filter === 'arriving' ? arrivingToday : routine

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Sigil Supply</h1>
          <p className="subhead">
            PAR status feed — read only. No calls required; this is what supply chain sees.
          </p>
        </div>
        <p className="asof">As of {formatClock(loadedAt)} · demo data</p>
      </header>

      <FilterBar filters={filters} active={filter} onChange={setFilter} />

      <main>
        {showAttention && (
          <section className="section section--attention" aria-labelledby="attention-heading">
            <div className="section-head">
              <h2 id="attention-heading">Needs attention</h2>
              <p className="section-note">
                Backordered with no substitute, or a substitute waiting on clinical sign-off.
              </p>
            </div>
            {attention.length > 0 ? (
              <ItemList items={attention} />
            ) : (
              <p className="empty">Nothing needs attention right now.</p>
            )}
          </section>
        )}

        {showRoutine && (
          <section className="section" aria-labelledby="routine-heading">
            <div className="section-head">
              <h2 id="routine-heading">
                {filter === 'arriving' ? 'Arriving today' : 'Routine — sorted by urgency'}
              </h2>
            </div>
            {routineItems.length > 0 ? (
              <ItemList items={routineItems} />
            ) : (
              <p className="empty">No items match this view.</p>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        Sample data for demonstration. Status and times are generated at page load.
      </footer>
    </div>
  )
}
