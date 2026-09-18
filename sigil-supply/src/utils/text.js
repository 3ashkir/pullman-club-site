// Small wording helpers so counts read like English, not like a database.
export function count(n, singular, plural = singular + 's') {
  return n + ' ' + (n === 1 ? singular : plural)
}

export function attention(n) {
  return n + (n === 1 ? ' needs attention' : ' need attention')
}
