import { STATUS, EXCEPTION } from '../data/parItems.js'
import { formatRelative, formatWhen } from '../utils/time.js'

function nextUpdateText(next) {
  if (!next) return '—'
  return next.text ? next.text : formatWhen(next.at)
}

export default function ItemRow({ item }) {
  const status = STATUS[item.status]
  const nextLabel = item.next?.label ?? 'Next update'

  return (
    <li className={'row' + (item.exception ? ' row--exception' : '')}>
      <div className="cell cell--item">
        <span className="cell-label">Item</span>
        <span className="item-name">{item.name}</span>
        {item.exception && <span className="exception-tag">{EXCEPTION[item.exception]}</span>}
        {item.note && <span className="item-note">{item.note}</span>}
      </div>

      <div className="cell cell--par">
        <span className="cell-label">PAR location</span>
        {item.par}
      </div>

      <div className="cell cell--status">
        <span className="cell-label">Status</span>
        <span className={'status status--' + item.status}>{status.label}</span>
      </div>

      <div className="cell cell--updated">
        <span className="cell-label">Last updated</span>
        <time dateTime={item.updatedAt.toISOString()}>{formatRelative(item.updatedAt)}</time>
      </div>

      <div className="cell cell--next">
        <span className="cell-label">Expected next update</span>
        <span className="next-label">{nextLabel}</span>{' '}
        <span className="next-value">{nextUpdateText(item.next)}</span>
      </div>
    </li>
  )
}
