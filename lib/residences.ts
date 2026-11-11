// Every residence on the page: the project cards, the detail sheet, the map and
// the viewing form all read from this list.
// Lodha Elanza, Lodha Azure and Lodha Haven are real projects, with figures from the partner and
// the sources noted beside each. Check them against Lodha's sales material and RERA filings.

export type ResidenceStatus = 'available' | 'launching' | 'completed';

export type Photo = {
  src: string;
  alt: string;
  /** object-position for landscape crops */
  position?: string;
};

export type Residence = {
  id: string;
  name: string;
  area: string;
  line: string;
  status: ResidenceStatus;
  statusLabel: string;
  /** Configurations on offer, in BHK. */
  type: string;
  /** Unit sizes, in sq ft. */
  size: string;
  /** Starting price; the asterisk refers to PRICE_NOTE. */
  price: string;
  /** Shown over the card photo: whether it is a render or a photograph. */
  caption: string;
  /** A short offer tag shown over the top-right of the card photo. */
  tag?: string;
  description: string;
  /** Shown in the sheet in place of, or beside, the viewing request. */
  note?: { text: string; callOffice?: boolean };
  /** Whether the residence can be chosen in the viewing form. */
  enquire: boolean;
  specs: { label: string; value: string; wide?: boolean }[];
  /** Shown in the sheet as a table under the specifications: each home type with its size and starting price. */
  configurations?: { type: string; size: string; price: string }[];
  photo: Photo;
  /** Shown on the project card instead of photo from 48rem, where the card's photo box is close to square. */
  desktopPhoto?: Photo;
  secondPhoto: Photo;
  /** Shown in the sheet between the specifications and the gallery. */
  paymentPlan?: { title: string; intro: string; schedule: { year: string; share: string }[] };
  /** Shown in the sheet's gallery in place of secondPhoto, when there is more than one. */
  gallery?: (Photo & { width: number; height: number })[];
  /** Shown in the sheet's Location section: where the map is centred, and what is close by. */
  location: { lat: number; lng: number; nearby: { kind: string; name: string; km: number }[] };
  /** Straight-line distance and compass bearing from the Outer Ring Road reference point (13.0278 N, 77.6325 E). */
  map: { km: number; bearing: number; label: 'left' | 'right' };
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

const sqft = (value: string) => `${value} sq ft`;

export const PRICE_NOTE =
  '*Starting price for the smallest home, before stamp duty, registration, GST and other charges. Prices can change without notice.';

// Lodha Elanza: the configurations, unit sizes, prices and site details are from the developer's
// WhatsApp message (October 2026), reworded here. The RERA number, possession and address are from Lodha's project page,
// lodhagroup.com/projects/residential-property-in-bangalore/lodha-elanza-sarjapur-road.
const ELANZA_INTRO =
  'Lodha Elanza is a 19-acre, low-density address on Sarjapur Road, where open space covers most of the land and the towers rise to G+34 floors. Design, craftsmanship and Lodha’s hospitality-led service shape daily life here, from the landscaped grounds to the homes themselves. Choose a 3 BHK Smart, a 3 BHK Luxe or a 3.5 BHK, with an early-bird advantage available on all three.';

// Lodha Azure (Tower F): the partner's copy, configurations, unit sizes, price, area, units and
// possession (October 2026).
const AZURE_INTRO =
  'Introducing Tower F at Lodha Azur, an exclusive collection of premium lake-facing residences crafted for an extraordinary way of life. As the final tower in this distinguished development, it presents a rare opportunity to own a home where breathtaking lake views, exceptional privacy, and expansive living spaces come together in perfect harmony. A coveted address for those who appreciate refined elegance, understated luxury, and the privilege of owning something truly rare.';

// The partner's 20% annual plan (October 2026), supplied for Lodha Azur, Tower F, and applied to
// the other projects at the partner's request: confirm each project's real schedule.
const PAYMENT_PLAN: NonNullable<Residence['paymentPlan']> = {
  title: 'Flexible 20% annual payment plan',
  intro: 'Spread your investment over five years, in five equal annual instalments of 20%.',
  schedule: ['2026', '2027', '2028', '2029', '2030'].map((year) => ({ year, share: '20%' })),
};

// Lodha Haven: the partner's copy, configurations, unit sizes, price, area, units and possession
// (October 2026). The copy says 9.3 acres; the partner's figure for total area is 6 acres.
const HAVEN_INTRO =
  'Welcome to Lodha Haven, where the tranquillity of nature meets the sophistication of urban living. Spanning 9.3 acres in HSR Extension, at the heart of Bengaluru, this exclusive residential enclave features six elegant towers rising G+22 floors, with fewer than 500 residences and 80% open spaces. Immerse yourself in lush, forest-inspired landscapes, unwind at a 20,000 sq. ft. clubhouse, and experience a rare sense of space, privacy, and serenity. A sanctuary crafted for those who seek an extraordinary balance between nature and contemporary luxury.';

export const residences: Residence[] = [
  {
    id: 'lodha-elanza',
    name: 'Lodha Elanza',
    area: 'Sarjapur Road',
    line: ELANZA_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3 & 3.5 BHK',
    size: sqft('1,500–2,300'),
    price: '₹2 Cr onwards*',
    // Renders from the partner's kit (public/gallery/lodha-elanza).
    caption: 'Artist’s impression.',
    tag: 'Early-bird advantage available',
    description: ELANZA_INTRO,
    enquire: true,
    specs: [
      { label: 'Type', value: '3 & 3.5 BHK' },
      { label: 'Unit size', value: sqft('1,500–2,300') },
      { label: 'Total area', value: '19 acres, 80% open space' },
      { label: 'Towers', value: 'G+34 floors, low density' },
      { label: 'Total units', value: '698' },
      { label: 'Possession', value: 'By 2031' },
      { label: 'Price', value: '₹2 Cr onwards*' },
      { label: 'Karnataka RERA', value: 'PRM/KA/RERA/1251/308/PR/191225/008353', wide: true },
    ],
    configurations: [
      { type: '3 BHK Smart', size: sqft('1,500'), price: '₹2 Cr' },
      { type: '3 BHK Luxe', size: sqft('1,900'), price: '₹2.50 Cr' },
      { type: '3.5 BHK', size: sqft('2,300'), price: '₹3.10 Cr' },
    ],
    photo: {
      src: '/gallery/lodha-elanza/terrace.jpg',
      alt: 'A terrace dining table beside a brass balustrade, facing the lake at sunset',
    },
    desktopPhoto: {
      src: '/gallery/lodha-elanza/terrace-lounge.jpg',
      alt: 'A covered terrace lounge with a chandelier, looking out over the lake',
    },
    secondPhoto: {
      src: '/gallery/lodha-elanza/lake-pool-deck.jpg',
      alt: 'A pool deck and cafe tables beside the lake at sunset, with a residential tower behind',
    },
    paymentPlan: PAYMENT_PLAN,
    // Renders from the partner's kit, enlarged 2x and sharpened (public/gallery/lodha-elanza).
    gallery: [
      { src: '/gallery/lodha-elanza/gardens.jpg', width: 1688, height: 1028, alt: 'Landscaped gardens with a daybed under a mature tree at sunset' },
      { src: '/gallery/lodha-elanza/aerial-lake.jpg', width: 1688, height: 1322, alt: 'An aerial view of the lake and wooded shoreline beside the site' },
      { src: '/gallery/lodha-elanza/pool-dusk.jpg', width: 1988, height: 1320, alt: 'The resort-style pool deck at dusk, with a clubhouse draped in greenery and shaded daybeds' },
      { src: '/gallery/lodha-elanza/lake-pool-deck.jpg', width: 1724, height: 996, alt: 'A pool deck and cafe tables beside the lake at sunset, with a residential tower behind' },
      { src: '/gallery/lodha-elanza/restaurant.jpg', width: 2064, height: 1376, alt: 'A clubhouse restaurant with a curved bar, brass chandelier and glass walls onto the trees' },
      { src: '/gallery/lodha-elanza/entrance.jpg', width: 2504, height: 1208, alt: 'The residential entrance lobby, glazed and lit, between planted beds' },
      { src: '/gallery/lodha-elanza/tower-facade.jpg', width: 1844, height: 776, alt: 'The tower facade with curved balconies and a landscaped podium lounge below' },
      { src: '/gallery/lodha-elanza/terrace-lounge.jpg', width: 1386, height: 1340, alt: 'A covered terrace lounge with a chandelier, looking out over the lake' },
      { src: '/gallery/lodha-elanza/living-room.jpg', width: 1896, height: 1010, alt: 'A living and dining room opening to a balcony over the lake at sunset' },
      { src: '/gallery/lodha-elanza/dining-room.jpg', width: 1124, height: 1370, alt: 'A dining room with a marble feature wall and tasselled pendant lights' },
      { src: '/gallery/lodha-elanza/bedroom.jpg', width: 1982, height: 1338, alt: 'A bedroom with a slatted arched headboard and a balcony facing the lake' },
      { src: '/gallery/lodha-elanza/terrace.jpg', width: 2468, height: 1232, alt: 'A terrace dining table beside a brass balustrade, facing the lake at sunset' },
      { src: '/gallery/lodha-elanza/location-map.jpg', width: 2220, height: 1388, alt: 'An illustrated map of the area around Lodha Elanza, showing Outer Ring Road, Sarjapur Road, nearby schools, hospitals and SWIFT City' },
    ],
    // Placeholder: a point on Sarjapur Road and indicative distances. Replace with the project's
    // surveyed pin and drive distances.
    location: {
      lat: 12.883,
      lng: 77.795,
      nearby: [
        { kind: 'Metro', name: 'Kadugodi Tree Park metro', km: 16 },
        { kind: 'Airport', name: 'Kempegowda International Airport', km: 48 },
        { kind: 'School', name: 'Greenwood High International School', km: 6 },
        { kind: 'Hospital', name: 'Columbia Asia Hospital, Sarjapur Road', km: 8 },
        { kind: 'Work', name: 'Wipro campus, Sarjapur Road', km: 10 },
      ],
    },
    // Varthur–Sarjapur Road, Dommasandra: about 24 km south-east of the Outer Ring Road point.
    map: { km: 24, bearing: 132, label: 'right' },
  },
  {
    id: 'lodha-azure',
    name: 'Lodha Azure',
    area: 'Begur, Bannerghatta Road',
    line: AZURE_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3, 3.5 & 4 BHK',
    size: sqft('1,970–3,080'),
    price: '₹2.68 Cr onwards*',
    // The photos are stand-ins, not Lodha Azure. Replace them with renders from Lodha's partner kit.
    caption: 'Representative image.',
    description: AZURE_INTRO,
    enquire: true,
    // No RERA row: the registration number for Tower F has not been supplied yet.
    specs: [
      { label: 'Type', value: '3, 3.5 & 4 BHK' },
      { label: 'Unit size', value: sqft('1,970–3,080') },
      { label: 'Total area', value: '10 acres' },
      { label: 'Total units', value: '558' },
      { label: 'Possession', value: 'Oct 2029' },
      { label: 'Price', value: '₹2.68 Cr onwards*' },
    ],
    photo: {
      src: unsplash('1600566753190-17f0baa2a6c3'),
      alt: 'A villa in timber and white render with a deep overhanging upper floor',
    },
    secondPhoto: {
      src: unsplash('1604014237800-1c9102c219da'),
      alt: 'An open living and dining room whose timber floor continues out onto a covered deck',
    },
    paymentPlan: { ...PAYMENT_PLAN, intro: 'Tower F offers the convenience of spreading your investment over five years.' },
    // Placeholder: a point at Begur and indicative distances.
    location: {
      lat: 12.872,
      lng: 77.622,
      nearby: [
        { kind: 'Metro', name: 'Bommasandra metro (Yellow Line)', km: 12 },
        { kind: 'Airport', name: 'Kempegowda International Airport', km: 55 },
        { kind: 'School', name: 'Orchids The International School, Bannerghatta Road', km: 7 },
        { kind: 'Hospital', name: 'Apollo Hospital, Bannerghatta Road', km: 6 },
        { kind: 'Mall', name: 'Meenakshi Mall, Bannerghatta Road', km: 8 },
      ],
    },
    // Begur, Bannerghatta Road: about 17 km south of the Outer Ring Road point.
    map: { km: 17, bearing: 184, label: 'left' },
  },
  {
    id: 'lodha-haven',
    name: 'Lodha Haven',
    area: 'Hosa Road, Off Sarjapur Road',
    line: HAVEN_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3, 3.5 & 4 BHK',
    size: sqft('1,656–3,429'),
    price: '₹2.40 Cr onwards*',
    // The photos are stand-ins, not Lodha Haven. Replace them with renders from Lodha's partner kit.
    caption: 'Representative image.',
    description: HAVEN_INTRO,
    enquire: true,
    // No RERA row: the registration number has not been supplied yet.
    specs: [
      { label: 'Type', value: '3, 3.5 & 4 BHK' },
      { label: 'Unit size', value: sqft('1,656–3,429') },
      { label: 'Total area', value: '6 acres' },
      { label: 'Total units', value: '452' },
      { label: 'Possession', value: 'Jun 2030' },
      { label: 'Price', value: '₹2.40 Cr onwards*' },
    ],
    photo: {
      src: unsplash('1564078516393-cf04bd966897'),
      alt: 'A double-height living room at dusk with tall windows over the city',
      position: '50% 60%',
    },
    secondPhoto: {
      src: unsplash('1596176530529-78163a4f7af2'),
      alt: 'City lights at dusk seen from a high floor',
    },
    paymentPlan: PAYMENT_PLAN,
    // Placeholder: a point on Hosa Road and indicative distances.
    location: {
      lat: 12.874,
      lng: 77.694,
      nearby: [
        { kind: 'Metro', name: 'Hosa Road metro (Yellow Line)', km: 2 },
        { kind: 'Airport', name: 'Kempegowda International Airport', km: 52 },
        { kind: 'School', name: 'Edify School, Electronic City', km: 6 },
        { kind: 'Hospital', name: 'Narayana Health City, Bommasandra', km: 9 },
        { kind: 'Work', name: 'Electronic City Phase 1', km: 5 },
      ],
    },
    // Hosa Road, off Sarjapur Road: about 18 km south-south-east of the Outer Ring Road point.
    map: { km: 18, bearing: 159, label: 'right' },
  },
];

export const enquirableResidences = residences.filter((r) => r.enquire);

export const isResidenceId = (id: string) => residences.some((r) => r.id === id);
