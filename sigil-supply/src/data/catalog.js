// Supply catalog. [name, unit of issue, PAR level]
export const CATALOG = {
  gauze4: ['Sterile Gauze Sponge 4x4, 12-ply', 'pkg', 20],
  gauze2: ['Sterile Gauze Sponge 2x2', 'pkg', 16],
  film475: ['Transparent Film Dressing 4 x 4.75', 'box', 8],
  hydro44: ['Hydrocolloid Dressing 4x4', 'box', 6],
  alginate: ['Silver Alginate Dressing 4x4', 'box', 6],
  npwtsm: ['Negative Pressure Wound Kit, Small', 'kit', 4],
  nonadh: ['Non-Adherent Pad 3x4', 'box', 10],
  ace4: ['Elastic Bandage, 4 in', 'ea', 24],
  foley16: ['Foley Catheter Kit, 16 Fr', 'kit', 10],
  cath14: ['Straight Intermittent Catheter, 14 Fr', 'ea', 20],
  trach: ['Tracheostomy Care Kit', 'kit', 6],
  suction: ['Suction Canister, 1200 mL', 'ea', 12],
  ivkit: ['IV Start Kit with Chlorhexidine', 'kit', 18],
  syringe10: ['Luer-Lock Syringe, 10 mL', 'box', 12],
  syringe3: ['Luer-Lock Syringe, 3 mL', 'box', 12],
  needle21: ['Safety Hypodermic Needle, 21G x 1 in', 'box', 10],
  saline250: ['Sterile Saline Irrigation, 250 mL', 'ea', 24],
  chg26: ['Chlorhexidine Prep Applicator, 26 mL', 'box', 8],
  glovesM: ['Nitrile Exam Gloves, Medium', 'box', 30],
  glovesL: ['Nitrile Exam Gloves, Large', 'box', 24],
  gownL: ['Sterile Surgical Gown, Large', 'ea', 20],
  edta4: ['Blood Collection Tube, EDTA 4 mL', 'pkg', 15],
  feedbag: ['Enteral Feeding Bag Set, 1200 mL', 'ea', 12],
  underpad: ['Underpad 30x36', 'pkg', 20],
  specimen: ['Specimen Container, 120 mL', 'pkg', 15],
  suture30: ['Suture, 3-0 Nylon', 'box', 10],
  mask2: ['Procedure Mask, Level 2', 'box', 20],
  ekg: ['ECG Electrodes, Adult', 'pkg', 12],
  ngtube: ['NG Tube, 16 Fr', 'ea', 8],
  cannula: ['Nasal Cannula, Adult', 'ea', 20],
}

export const STATUS = {
  no_substitute: { label: 'No substitute', rank: 0 },
  substitute: { label: 'Substitute on the way', rank: 1 },
  on_way: { label: 'On the way', rank: 2 },
  low: { label: 'Low', rank: 3 },
  delivered: { label: 'Delivered', rank: 4 },
  on_par: { label: 'On PAR', rank: 5 },
}

// The only thing that still needs a person: backordered with nothing coming.
export const EXCEPTION = 'Backordered — nothing coming'
