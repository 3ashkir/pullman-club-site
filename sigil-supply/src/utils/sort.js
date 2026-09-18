import { STATUS } from '../data/parItems.js'

// Most urgent status first; within a status, the freshest update first so the
// feed reads top-down like a running status board.
export function byUrgency(a, b) {
  const rank = STATUS[a.status].rank - STATUS[b.status].rank
  if (rank !== 0) return rank
  return b.updatedAt - a.updatedAt
}

// Splits the feed into the exception section and the routine section.
export function partitionItems(items) {
  const sorted = [...items].sort(byUrgency)
  return {
    attention: sorted.filter((i) => i.exception),
    routine: sorted.filter((i) => !i.exception),
  }
}
