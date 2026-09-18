import { CATALOG, STATUS } from './catalog.js'
import { minutesAgo, hoursFromNow, laterToday, daysFromNow, nextRoutineCount } from '../utils/time.js'

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
  const status = extra.status ?? 'on_time'
  return {
    sku,
    name,
    unit,
    par,
    onHand,
    status,
    statusLabel: STATUS[status].label,
    rank: STATUS[status].rank,
    exception: extra.exception ?? null,
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

function loc(id, name, kind, spec) {
  return {
    id,
    name,
    kind,
    lastCount: { at: minutesAgo(spec.lastCount[0]), handler: spec.lastCount[1] },
    items: spec.items.map(buildItem).sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name)),
    deliveries: spec.deliveries.map(buildDelivery).sort((a, b) => b.at - a.at),
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
          ['gauze4', 14],
          ['gauze2', 11],
          ['glovesM', 22],
          ['underpad', 16],
          ['saline250', 19],
          ['film475', 2, {
            status: 'substitute_pending',
            exception: 'needs_signoff',
            note: 'Distributor short. Equivalent film dressing is on the shelf but nursing has not signed off on the swap.',
            substitute: 'Adhesive film dressing 4 x 4.75 (alternate brand) — 6 box on hand',
            next: { label: 'Sign-off needed by', at: hoursFromNow(5) },
          }],
          ['ivkit', 9, {
            status: 'arriving_today',
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
          ['gauze4', 17],
          ['glovesL', 20],
          ['ace4', 21],
          ['mask2', 18],
          ['cannula', 16],
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
          ['glovesM', 26],
          ['needle21', 4, {
            status: 'arriving_today',
            note: 'Below PAR — replenishment on the afternoon run.',
            next: { label: 'ETA', at: laterToday(1) },
          }],
          ['syringe3', 10],
          ['gauze2', 13],
          ['ekg', 9],
          ['specimen', 12],
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
            status: 'backordered',
            exception: 'no_substitute',
            note: 'Manufacturer allocation. Nothing equivalent stocked; roughly 4 days of use on hand.',
            next: { label: 'Vendor update', text: 'no date committed' },
          }],
          ['ngtube', 5],
          ['gauze4', 15],
          ['glovesL', 18],
          ['underpad', 14],
          ['saline250', 20],
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
            status: 'delayed',
            note: 'Carrier delay in transit — arriving tomorrow morning instead of today.',
            next: { label: 'Revised ETA', at: hoursFromNow(21) },
          }],
          ['suction', 10],
          ['ivkit', 15],
          ['syringe10', 11],
          ['chg26', 7],
          ['gownL', 16],
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
            status: 'delayed',
            note: 'Short-shipped from the distributor; balance releases this evening.',
            next: { label: 'Revised ETA', at: hoursFromNow(9) },
          }],
          ['ngtube', 6],
          ['suction', 9],
          ['glovesM', 24],
          ['gauze4', 16],
          ['cannula', 18],
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
          ['saline250', 22],
          ['syringe10', 12],
          ['gownL', 19],
          ['ekg', 11],
          ['mask2', 17],
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
            status: 'arriving_today',
            note: 'High use overnight — replenishment on the way.',
            next: { label: 'ETA', at: laterToday(3) },
          }],
          ['gauze4', 18],
          ['ace4', 20],
          ['suture30', 8],
          ['glovesM', 25],
          ['edta4', 13],
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
            status: 'arriving_today',
            note: 'Below PAR after the overnight census.',
            next: { label: 'ETA', at: laterToday(2) },
          }],
          ['needle21', 8],
          ['edta4', 12],
          ['specimen', 14],
          ['mask2', 19],
          ['glovesL', 21],
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
          ['gownL', 18],
          ['gauze4', 19],
          ['suture30', 9],
          ['chg26', 8],
          ['mask2', 20],
        ],
        deliveries: [['gownL', 10, 60, 'T. Alvarez']],
        orders: [],
      }),
      loc('or2', 'OR Core — Suite 2', 'Core room', {
        lastCount: [45, 'T. Alvarez'],
        items: [
          ['chg26', 3, {
            status: 'delayed',
            note: 'Held at receiving for lot verification.',
            next: { label: 'Revised ETA', at: hoursFromNow(6) },
          }],
          ['suture30', 4, {
            status: 'backordered',
            note: 'Approved substitute suture is already stocked at this core — no action needed.',
            substitute: 'Suture, 3-0 polypropylene — 7 box on hand',
            next: { label: 'Fill date', at: daysFromNow(9) },
          }],
          ['gownL', 17],
          ['gauze4', 20],
          ['glovesM', 23],
        ],
        deliveries: [['gauze4', 8, 47, 'T. Alvarez']],
        orders: [['chg26', 6, 300, 'J. Pham, RN', 6]],
      }),
      loc('or4', 'OR Core — Suite 4', 'Core room', {
        lastCount: [100, 'M. Reyes'],
        items: [
          ['suction', 11],
          ['gownL', 20],
          ['saline250', 21],
          ['glovesL', 22],
          ['mask2', 18],
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
            status: 'backordered',
            exception: 'no_substitute',
            note: 'No fill date from the vendor. Nothing equivalent stocked — materials management is sourcing.',
            next: { label: 'Vendor update', text: `expected ${daysFromNow(2).toLocaleDateString([], { month: 'short', day: 'numeric' })}` },
          }],
          ['hydro44', 2, {
            status: 'substitute_pending',
            exception: 'needs_signoff',
            note: 'Alternate brand offered by the distributor — needs wound care review before it can be ordered.',
            substitute: 'Hydrocolloid 4x4 (alternate brand) — quoted, not ordered',
            next: { label: 'Sign-off needed by', at: hoursFromNow(23) },
          }],
          ['npwtsm', 3, {
            status: 'backordered',
            note: 'Approved substitute kit already stocked at this PAR — no action needed.',
            substitute: 'NPWT kit, small (alternate brand) — 4 kit on hand',
            next: { label: 'Fill date', at: daysFromNow(6) },
          }],
          ['nonadh', 9],
          ['gauze4', 15],
          ['film475', 7],
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
          ['ace4', 22],
          ['gauze4', 16],
          ['nonadh', 10],
          ['glovesM', 21],
        ],
        deliveries: [['ace4', 12, 112, 'M. Reyes']],
        orders: [],
      }),
      loc('rehab', 'Rehab — PAR 3', 'Clinic PAR', {
        lastCount: [135, 'T. Alvarez'],
        items: [
          ['cath14', 6, {
            status: 'substitute_pending',
            note: 'Substitute approved by nursing — shipping from an alternate distributor.',
            substitute: 'Intermittent catheter 14 Fr (alternate brand) — approved',
            next: { label: 'Substitute ETA', at: hoursFromNow(20) },
          }],
          ['glovesM', 20],
          ['underpad', 15],
          ['gauze2', 12],
        ],
        deliveries: [['underpad', 6, 138, 'T. Alvarez']],
        orders: [['cath14', 20, 900, 'L. Maher, RN', 20]],
      }),
      loc('lab', 'Lab — Draw Station', 'Draw station', {
        lastCount: [50, 'M. Reyes'],
        items: [
          ['edta4', 9, {
            status: 'arriving_today',
            note: 'Steady draw volume this week; standing order runs daily.',
            next: { label: 'ETA', at: laterToday(4) },
          }],
          ['needle21', 9],
          ['specimen', 13],
          ['glovesM', 19],
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
  const backordered = location.items.filter((i) => i.status === 'backordered')
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
  return location.items.filter((i) => i.status === 'backordered' || i.status === 'substitute_pending')
}
