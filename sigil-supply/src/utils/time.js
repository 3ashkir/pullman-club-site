// Formatting helpers. Everything is derived from Date objects so the demo
// reads as "live" whenever it is opened.

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

export function minutesAgo(min) {
  return new Date(Date.now() - min * MINUTE)
}

export function hoursFromNow(hrs) {
  return new Date(Date.now() + hrs * HOUR)
}

// Same as hoursFromNow, but never rolls past tonight — used for items whose
// status says "arriving today".
export function laterToday(hrs) {
  const target = hoursFromNow(hrs)
  const endOfDay = new Date()
  endOfDay.setHours(23, 30, 0, 0)
  return target > endOfDay ? endOfDay : target
}

export function daysFromNow(days, hour = 9) {
  const d = new Date(Date.now() + days * 24 * HOUR)
  d.setHours(hour, 0, 0, 0)
  return d
}

// Routine PAR counts run twice a day, at 07:00 and 14:00.
export function nextRoutineCount() {
  const now = new Date()
  for (const hour of [7, 14]) {
    const slot = new Date(now)
    slot.setHours(hour, 0, 0, 0)
    if (slot > now) return slot
  }
  return daysFromNow(1, 7)
}

export function formatClock(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function formatDate(date) {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function isToday(date) {
  const now = new Date()
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

// "14 min ago", "3 hr ago", "Yesterday 4:10 PM"
export function formatRelative(date) {
  const diff = Date.now() - date.getTime()
  if (diff < MINUTE) return 'just now'
  if (diff < HOUR) return `${Math.round(diff / MINUTE)} min ago`
  if (diff < 12 * HOUR) return `${Math.round(diff / HOUR)} hr ago`
  if (isToday(date)) return `today ${formatClock(date)}`
  return `${formatDate(date)} ${formatClock(date)}`
}

// Expected-next-update text: a clock time for today, a date otherwise.
export function formatWhen(date) {
  return isToday(date) ? `today ${formatClock(date)}` : `${formatDate(date)}, ${formatClock(date)}`
}
