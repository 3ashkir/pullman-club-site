export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter supply feed">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          className={'filter' + (f.id === active ? ' is-active' : '')}
          aria-pressed={f.id === active}
          onClick={() => onChange(f.id)}
        >
          {f.label}
          <span className="filter-count">{f.count}</span>
        </button>
      ))}
    </div>
  )
}
