// Back control + trail. One tap back, always in the same place.
export default function Crumbs({ trail, onNavigate }) {
  if (trail.length < 2) return null
  const back = trail[trail.length - 2]

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <button type="button" className="back" onClick={() => onNavigate(back.to)}>
        <span aria-hidden="true">‹</span> {back.label}
      </button>
      <ol>
        {trail.map((c, i) => (
          <li key={c.label} aria-current={i === trail.length - 1 ? 'page' : undefined}>
            {c.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}
