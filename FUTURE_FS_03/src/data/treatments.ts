import { Treatment } from '../types';

export const TREATMENTS_DATA: Treatment[] = [
  {
    id: 'hydrafacial-elite',
    name: 'HydraFacial MD® Elite',
    category: 'facial',
    categoryLabel: 'Facial Aesthetics',
    shortDescription: 'Patented vortex-fusion technology for deep cleansing, pain-free extraction, and clinical hydration serums.',
    fullDescription: 'HydraFacial MD is a medical-grade hydra-dermabrasion treatment that merges deep pore extraction with intensive antioxidant and peptide infusion. Ideal for immediate radiant rejuvenation with zero social downtime.',
    duration: '60 mins',
    price: 5499,
    originalPrice: 6999,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Removes deep blackheads & micro-impurities',
      'Infuses hyaluronic acid & antioxidant peptides',
      'Immediate glow without peeling or erythema'
    ],
    recommendedSessions: 'Monthly maintenance'
  },
  {
    id: 'tri-beam-q-switch',
    name: 'Tri-Beam Q-Switched Nd:YAG Laser',
    category: 'laser',
    categoryLabel: 'Laser & Skin',
    shortDescription: 'Precision photoacoustic laser toning for stubborn hyperpigmentation, melasma, and skin clarity.',
    fullDescription: 'Our US-FDA cleared Q-Switched Nd:YAG laser delivers ultrashort nanosecond pulses that shatter unwanted melanin clusters into microscopic particles, naturally eliminated by the body.',
    duration: '45 mins',
    price: 6999,
    originalPrice: 8500,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1512290900672-1f41b5059e1c?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Visibly reduces stubborn melasma & sun spots',
      'Stimulates collagen for refined pore texture',
      'Safe for Indian Fitzpatrick skin types III-V'
    ],
    recommendedSessions: '4–6 sessions, 3 weeks apart'
  },
  {
    id: 'prf-hair-restoration',
    name: 'Platelet-Rich Fibrin (PRF) Hair Therapy',
    category: 'hair',
    categoryLabel: 'Hair Restoration',
    shortDescription: 'Next-generation 100% autologous biological growth factors to reverse thinning and stimulate dormant follicles.',
    fullDescription: 'PRF is superior to standard PRP by releasing sustained platelet growth factors, leukocytes, and stem-cell signaling proteins over 10-14 days to regenerate follicular vascularization.',
    duration: '60 mins',
    price: 8500,
    originalPrice: 10500,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=800&q=80',
    benefits: [
      '100% natural autologous treatment (no additives)',
      'Accelerates hair shaft diameter and density',
      'Performed with medical micro-mesotherapy needles'
    ],
    recommendedSessions: '3–4 sessions spaced 4 weeks apart'
  },
  {
    id: 'soprano-titanium-laser',
    name: 'Alma Soprano Titanium Triple-Wavelength Laser',
    category: 'laser',
    categoryLabel: 'Laser & Skin',
    shortDescription: 'Painless, gold-standard permanent hair reduction powered by simultaneous 755nm, 810nm, and 1064nm wavelengths.',
    fullDescription: 'Equipped with ICE Plus™ continuous contact cooling, Alma Soprano Titanium delivers rapid, comfortable permanent hair reduction across all skin tones and seasons.',
    duration: '30–75 mins',
    price: 4200,
    originalPrice: 5500,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Virtually painless in-motion SHR technology',
      'Effective on coarse and fine hair follicles',
      'Advanced sapphire contact cooling protection'
    ],
    recommendedSessions: '6–8 sessions'
  },
  {
    id: 'profhilo-remodelling',
    name: 'Profhilo® Hyaluronic Bio-Remodelling',
    category: 'antiaging',
    categoryLabel: 'Anti-Aging & Wellness',
    shortDescription: 'High-concentration ultrapure hyaluronic acid injected into 5 BAP points to remodel laxity and deep dermal hydration.',
    fullDescription: 'Unlike conventional dermal fillers that add volume, Profhilo stimulates 4 distinct types of collagen and elastin through slow release of hybridized hyaluronic acid complexes.',
    duration: '45 mins',
    price: 24000,
    originalPrice: 28000,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Bio-stimulates natural collagen and elastin',
      'Restores skin firmness on face, neck, and hands',
      'Natural, non-frozen aesthetic outcome'
    ],
    recommendedSessions: '2 initial sessions 4 weeks apart'
  },
  {
    id: 'carbon-hollywood-peel',
    name: 'Carbon Hollywood Laser Peel',
    category: 'laser',
    categoryLabel: 'Laser & Skin',
    shortDescription: 'Liquid activated carbon laser treatment for instant oil control, refined pores, and photo-ready luminous skin.',
    fullDescription: 'A thin layer of activated medical carbon is applied to absorb sebum and contaminants, followed by laser passes that gently vaporize the carbon along with dead surface cells.',
    duration: '45 mins',
    price: 4500,
    originalPrice: 5500,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Immediate reduction in surface oiliness',
      'Minimizes visible pores and blackheads',
      'Red-carpet ready with zero post-procedure peeling'
    ],
    recommendedSessions: 'Monthly or before key occasions'
  },
  {
    id: 'glutathione-antioxidant-drip',
    name: 'Antioxidant Radiance & IV Wellness Drip',
    category: 'antiaging',
    categoryLabel: 'Anti-Aging & Wellness',
    shortDescription: 'Physician-monitored intravenous infusion of reduced glutathione, high-dose vitamin C, and zinc.',
    fullDescription: 'Delivered directly into the bloodstream for 100% bioavailability, our clinical micronutrient infusion combats oxidative stress, supports liver detoxification, and boosts cellular vitality.',
    duration: '45 mins',
    price: 4800,
    originalPrice: 6000,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Neutralizes cellular free radicals and oxidative stress',
      'Boosts immunological stamina and vitality',
      'Promotes even-toned, luminous complexion from within'
    ],
    recommendedSessions: 'Course of 4–6 sessions'
  },
  {
    id: 'advanced-medical-peel',
    name: 'Bio-Repeel & Mandelic Dermatological Resurfacing',
    category: 'facial',
    categoryLabel: 'Facial Aesthetics',
    shortDescription: 'Two-phase pharmaceutical TCA 35% + AHA blend that exfoliates and biorevitalizes without visible skin shedding.',
    fullDescription: 'Innovative biphasic technology accelerates cellular turnover, reduces active acne blemishes, and lightens post-inflammatory erythema with minimal flaking.',
    duration: '45 mins',
    price: 3800,
    originalPrice: 4800,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    benefits: [
      'Targets active acne micro-cysts and comedones',
      'Calms post-inflammatory hyperpigmentation',
      'Gentle formulation suitable for sensitive complexions'
    ],
    recommendedSessions: '3–5 sessions every 14 days'
  }
];
