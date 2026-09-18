import { CATALOG, STATUS } from './catalog.js'
import {
  minutesAgo,
  hoursFromNow,
  laterToday,
  daysFromNow,
  nextRoutineCount,
  formatRelativeShort,
} from '../utils/time.js'

// ---------------------------------------------------------------------------
// Sample data, written as compact tuples and expanded by the builders below.
//
//   item      [sku, onHand, extra?]
//   delivery  [sku, qty, minutesAgo, handler]
//   order     [sku, qty, minutesAgo, orderedBy, etaHours]
//
// `extra` carries anything that is not routine: status, exception, note, and
// the expected next update.
// ---------------------------------------------------------------------------

function buildItem([sku, onHand, extra = {}]) {
  const [name, unit, par] = CATALOG[sku]
  const status = extra.status ?? (onHand < par ? 'low' : 'on_par')
  return {
    sku,
    name,
    unit,
    par,
    onHand,
    status,
    statusLabel: STATUS[status].label,
    rank: STATUS[status].rank,
    exception: status === 'no_substitute',
    note: extra.note ?? null,
    substitute: extra.substitute ?? null,
    next: extra.next ?? { label: 'Next count', at: nextRoutineCount() },
  }
}

function buildDelivery([sku, qty, min, handler]) {
  const [name, unit] = CATALOG[sku]
  return { sku, name, unit, qty, at: minutesAgo(min), handler }
}

function buildOrder([sku, qty, min, orderedBy, etaHours]) {
  const [name, unit] = CATALOG[sku]
  const eta = etaHours <= 12 ? laterToday(etaHours) : hoursFromNow(etaHours)
  return { sku, name, unit, qty, placedAt: minutesAgo(min), orderedBy, eta, sameDay: etaHours <= 12 }
}

// Anything restocked in the last six hours reads as "Delivered" so the shelf
// state and the delivery log never disagree.
const RECENT = 6 * 60 * 60 * 1000

function markDelivered(items, deliveries) {
  return items.map((item) => {
    if (item.status !== 'on_par' && item.status !== 'low') return item
    const drop = deliveries.find((d) => d.sku === item.sku && Date.now() - d.at < RECENT)
    if (!drop) return item
    return {
      ...item,
      onHand: item.par,
      status: 'delivered',
      statusLabel: STATUS.delivered.label,
      rank: STATUS.delivered.rank,
      next: { label: 'Delivered', text: `${formatRelativeShort(drop.at)} by ${drop.handler}` },
    }
  })
}

function loc(id, name, kind, spec) {
  const deliveries = spec.deliveries.map(buildDelivery).sort((a, b) => b.at - a.at)
  const items = markDelivered(spec.items.map(buildItem), deliveries).sort(
    (a, b) => a.rank - b.rank || a.name.localeCompare(b.name),
  )
  return {
    id,
    name,
    kind,
    lastCount: { at: minutesAgo(spec.lastCount[0]), handler: spec.lastCount[1] },
    items,
    deliveries,
    orders: spec.orders.map(buildOrder).sort((a, b) => a.eta - b.eta),
  }
}

export const areas = [
  {
    id: 'medsurg',
    name: 'Med/Surg',
    blurb: 'Clean utility rooms, 3 West through 6 East',
    locations: [
      loc('3west', '3 West — Clean Utility', 'Clean utility', {
        lastCount: [95, 'T. Alvarez'],
        items: [
          ['gauze4', 21],
          ['gauze2', 14],
          ['glovesM', 30],
          ['underpad', 21],
          ['saline250', 24],
          ['film475', 2, {
            status: 'substitute',
            note: 'Distributor short. Coordinator put the equivalent film dressing on the shelf; the rest ships tomorrow.',
            substitute: 'Adhesive film dressing 4 x 4.75 — 6 box on hand now',
            next: { label: 'Substitute ETA', at: hoursFromNow(20) },
          }],
          ['ivkit', 9, {
            status: 'on_way',
            note: 'Ordered by charge nurse this morning.',
            next: { label: 'ETA', at: laterToday(3) },
          }],
        ],
        deliveries: [
          ['gauze4', 8, 96, 'T. Alvarez'],
          ['glovesM', 10, 96, 'T. Alvarez'],
          ['underpad', 6, 1490, 'M. Reyes'],
        ],
        orders: [
          ['ivkit', 6, 190, 'K. Osei, RN', 3],
          ['film475', 4, 2760, 'K. Osei, RN', 30],
        ],
      }),
      loc('4south', '4 South — Clean Utility', 'Clean utility', {
        lastCount: [150, 'T. Alvarez'],
        items: [
          ['nonadh', 8],
          ['gauze4', 21],
          ['glovesL', 24],
          ['ace4', 24],
          ['mask2', 18],
          ['cannula', 20],
        ],
        deliveries: [
          ['nonadh', 4, 152, 'T. Alvarez'],
          ['mask2', 6, 1420, 'M. Reyes'],
        ],
        orders: [['ace4', 12, 320, 'D. Whitfield, RN', 26]],
      }),
      loc('5north', '5 North — Clean Utility', 'Clean utility', {
        lastCount: [70, 'M. Reyes'],
        items: [
          ['glovesM', 30],
          ['needle21', 4, {
            status: 'on_way',
            note: 'Below PAR — replenishment on the afternoon run.',
            next: { label: 'ETA', at: laterToday(1) },
          }],
          ['syringe3', 13],
          ['gauze2', 14],
          ['ekg', 12],
          ['specimen', 16],
        ],
        deliveries: [
          ['glovesM', 12, 72, 'M. Reyes'],
          ['ekg', 4, 1380, 'T. Alvarez'],
        ],
        orders: [['needle21', 8, 140, 'K. Osei, RN', 1]],
      }),
      loc('6east', '6 East — Clean Utility', 'Clean utility', {
        lastCount: [230, 'M. Reyes'],
        items: [
          ['feedbag', 3, {
            status: 'no_substitute',
            note: 'Manufacturer allocation. Nothing equivalent stocked; roughly 4 days of use on hand.',
            next: { label: 'Vendor update', text: 'no date committed' },
          }],
          ['ngtube', 8],
          ['gauze4', 18],
          ['glovesL', 25],
          ['underpad', 20],
          ['saline250', 24],
        ],
        deliveries: [
          ['saline250', 12, 235, 'M. Reyes'],
          ['glovesL', 6, 1500, 'T. Alvarez'],
        ],
        orders: [['ngtube', 6, 400, 'D. Whitfield, RN', 28]],
      }),
    ],
  },
  {
    id: 'critical',
    name: 'Critical Care',
    blurb: 'ICU supply rooms and PACU',
    locations: [
      loc('icua', 'ICU — Supply Room A', 'Supply room', {
        lastCount: [55, 'T. Alvarez'],
        items: [
          ['foley16', 4, {
            status: 'on_way',
            note: 'Carrier delay in transit — arriving tomorrow morning instead of today.',
            next: { label: 'Revised ETA', at: hoursFromNow(21) },
          }],
          ['suction', 10],
          ['ivkit', 18],
          ['syringe10', 12],
          ['chg26', 9],
          ['gownL', 18],
        ],
        deliveries: [
          ['suction', 6, 58, 'T. Alvarez'],
          ['ivkit', 8, 1400, 'M. Reyes'],
        ],
        orders: [['foley16', 8, 610, 'A. Duarte, RN', 21]],
      }),
      loc('icub', 'ICU — Supply Room B', 'Supply room', {
        lastCount: [40, 'T. Alvarez'],
        items: [
          ['trach', 2, {
            status: 'on_way',
            note: 'Short-shipped from the distributor; balance releases this evening.',
            next: { label: 'Revised ETA', at: hoursFromNow(9) },
          }],
          ['ngtube', 8],
          ['suction', 13],
          ['glovesM', 30],
          ['gauze4', 18],
          ['cannula', 21],
        ],
        deliveries: [
          ['gauze4', 6, 44, 'T. Alvarez'],
          ['cannula', 10, 1350, 'M. Reyes'],
        ],
        orders: [['trach', 4, 250, 'A. Duarte, RN', 9]],
      }),
      loc('pacu', 'PACU — Supply Room', 'Supply room', {
        lastCount: [120, 'M. Reyes'],
        items: [
          ['saline250', 24],
          ['syringe10', 12],
          ['gownL', 18],
          ['ekg', 12],
          ['mask2', 20],
        ],
        deliveries: [['saline250', 12, 122, 'M. Reyes']],
        orders: [],
      }),
    ],
  },
  {
    id: 'ed',
    name: 'Emergency',
    blurb: 'ED PAR rooms 1 and 2',
    locations: [
      loc('ed1', 'ED — PAR 1', 'PAR room', {
        lastCount: [35, 'M. Reyes'],
        items: [
          ['ivkit', 11, {
            status: 'on_way',
            note: 'High use overnight — replenishment on the way.',
            next: { label: 'ETA', at: laterToday(3) },
          }],
          ['gauze4', 21],
          ['ace4', 22],
          ['suture30', 10],
          ['glovesM', 31],
          ['edta4', 15],
        ],
        deliveries: [
          ['gauze4', 10, 38, 'M. Reyes'],
          ['suture30', 4, 1320, 'T. Alvarez'],
        ],
        orders: [['ivkit', 10, 120, 'R. Banerjee, RN', 3]],
      }),
      loc('ed2', 'ED — PAR 2', 'PAR room', {
        lastCount: [28, 'M. Reyes'],
        items: [
          ['syringe10', 5, {
            status: 'on_way',
            note: 'Below PAR after the overnight census.',
            next: { label: 'ETA', at: laterToday(2) },
          }],
          ['needle21', 8],
          ['edta4', 16],
          ['specimen', 15],
          ['mask2', 20],
          ['glovesL', 22],
        ],
        deliveries: [
          ['edta4', 8, 30, 'M. Reyes'],
          ['glovesL', 8, 1290, 'T. Alvarez'],
        ],
        orders: [['syringe10', 10, 95, 'R. Banerjee, RN', 2]],
      }),
    ],
  },
  {
    id: 'periop',
    name: 'Perioperative',
    blurb: 'OR core rooms',
    locations: [
      loc('or1', 'OR Core — Suite 1', 'Core room', {
        lastCount: [58, 'T. Alvarez'],
        items: [
          ['gownL', 20],
          ['gauze4', 20],
          ['suture30', 11],
          ['chg26', 6],
          ['mask2', 20],
        ],
        deliveries: [['gownL', 10, 60, 'T. Alvarez']],
        orders: [],
      }),
      loc('or2', 'OR Core — Suite 2', 'Core room', {
        lastCount: [45, 'T. Alvarez'],
        items: [
          ['chg26', 3, {
            status: 'on_way',
            note: 'Held at receiving for lot verification.',
            next: { label: 'Revised ETA', at: hoursFromNow(6) },
          }],
          ['suture30', 4, {
            status: 'substitute',
            note: 'Coordinator swapped in polypropylene suture — already on the shelf here.',
            substitute: 'Suture, 3-0 polypropylene — 7 box on hand now',
            next: { label: 'Original item fills', at: daysFromNow(9) },
          }],
          ['gownL', 21],
          ['gauze4', 20],
          ['glovesM', 28],
        ],
        deliveries: [['gauze4', 8, 47, 'T. Alvarez']],
        orders: [['chg26', 6, 300, 'J. Pham, RN', 6]],
      }),
      loc('or4', 'OR Core — Suite 4', 'Core room', {
        lastCount: [100, 'M. Reyes'],
        items: [
          ['suction', 13],
          ['gownL', 20],
          ['saline250', 24],
          ['glovesL', 22],
          ['mask2', 20],
        ],
        deliveries: [['suction', 6, 102, 'M. Reyes']],
        orders: [],
      }),
    ],
  },
  {
    id: 'clinics',
    name: 'Clinics & Ancillary',
    blurb: 'Wound care, ortho, rehab, lab draw',
    locations: [
      loc('wound', 'Wound Care Clinic', 'Clinic PAR', {
        lastCount: [180, 'M. Reyes'],
        items: [
          ['alginate', 1, {
            status: 'no_substitute',
            note: 'No fill date from the vendor. Nothing equivalent stocked — materials management is sourcing.',
            next: { label: 'Vendor update', text: `expected ${daysFromNow(2).toLocaleDateString([], { month: 'short', day: 'numeric' })}` },
          }],
          ['hydro44', 2, {
            status: 'substitute',
            note: 'Coordinator ordered the alternate brand from the secondary distributor.',
            substitute: 'Hydrocolloid 4x4 (alternate brand) — 4 box ordered',
            next: { label: 'Substitute ETA', at: hoursFromNow(23) },
          }],
          ['npwtsm', 3, {
            status: 'substitute',
            note: 'Coordinator swapped in the alternate kit — on the shelf here now.',
            substitute: 'NPWT kit, small (alternate brand) — 4 kit on hand now',
            next: { label: 'Original item fills', at: daysFromNow(6) },
          }],
          ['nonadh', 10],
          ['gauze4', 21],
          ['film475', 6],
        ],
        deliveries: [
          ['gauze4', 6, 182, 'M. Reyes'],
          ['nonadh', 4, 1460, 'T. Alvarez'],
        ],
        orders: [['hydro44', 4, 1500, 'L. Maher, RN', 40]],
      }),
      loc('ortho', 'Ortho Clinic — PAR 1', 'Clinic PAR', {
        lastCount: [110, 'M. Reyes'],
        items: [
          ['ace4', 24],
          ['gauze4', 21],
          ['nonadh', 10],
          ['glovesM', 28],
        ],
        deliveries: [['ace4', 12, 112, 'M. Reyes']],
        orders: [],
      }),
      loc('rehab', 'Rehab — PAR 3', 'Clinic PAR', {
        lastCount: [135, 'T. Alvarez'],
        items: [
          ['cath14', 6, {
            status: 'substitute',
            note: 'Coordinator ordered the alternate catheter — shipping from the secondary distributor.',
            substitute: 'Intermittent catheter 14 Fr (alternate brand) — 20 ea ordered',
            next: { label: 'Substitute ETA', at: hoursFromNow(20) },
          }],
          ['glovesM', 31],
          ['underpad', 20],
          ['gauze2', 16],
        ],
        deliveries: [['underpad', 6, 138, 'T. Alvarez']],
        orders: [['cath14', 20, 900, 'L. Maher, RN', 20]],
      }),
      loc('lab', 'Lab — Draw Station', 'Draw station', {
        lastCount: [50, 'M. Reyes'],
        items: [
          ['edta4', 9, {
            status: 'on_way',
            note: 'Steady draw volume this week; standing order runs daily.',
            next: { label: 'ETA', at: laterToday(4) },
          }],
          ['needle21', 8],
          ['specimen', 15],
          ['glovesM', 30],
        ],
        deliveries: [['specimen', 8, 52, 'M. Reyes']],
        orders: [['edta4', 15, 60, 'S. Kirby, RN', 4]],
      }),
    ],
  },
]

// --- derived views ---------------------------------------------------------

export function locationSummary(location) {
  const attention = location.items.filter((i) => i.exception)
  const backordered = location.items.filter(
    (i) => i.status === 'no_substitute' || i.status === 'substitute',
  )
  return {
    items: location.items.length,
    attention: attention.length,
    backordered: backordered.length,
    orders: location.orders.length,
    arrivingToday: location.orders.filter((o) => o.sameDay).length,
    belowPar: location.items.filter((i) => i.onHand < i.par).length,
  }
}

export function areaSummary(area) {
  return area.locations.reduce(
    (acc, l) => {
      const s = locationSummary(l)
      acc.locations += 1
      acc.attention += s.attention
      acc.backordered += s.backordered
      acc.orders += s.orders
      return acc
    },
    { locations: 0, attention: 0, backordered: 0, orders: 0 },
  )
}

export function findArea(areaId) {
  return areas.find((a) => a.id === areaId) ?? null
}

export function findLocation(areaId, locationId) {
  return findArea(areaId)?.locations.find((l) => l.id === locationId) ?? null
}

export function backorderItems(location) {
  return location.items.filter(
    (i) => i.status === 'no_substitute' || i.status === 'substitute',
  )
}
