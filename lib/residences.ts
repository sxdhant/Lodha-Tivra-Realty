// Every residence on the page: the project cards, the detail sheet, the map and
// the viewing form all read from this list.
// Lodha Elanza, Lodha Azur and Lodha Haven are real projects, with figures from the partner and
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
  /** Short descriptive labels shown beside the offer tag on the card photo, taken from the description. */
  tags?: string[];
  description: string;
  /** Shown in the sheet in place of, or beside, the viewing request. */
  note?: { text: string; callOffice?: boolean };
  /** Whether the residence can be chosen in the viewing form. */
  enquire: boolean;
  specs: { label: string; value: string; wide?: boolean }[];
  /** Shown in the sheet as a table under the specifications: each home type with its size and starting price. */
  configurations?: { group?: string; type: string; size: string; price: string }[];
  /** Shown under the configurations table, for what the table cannot say on its own. */
  configurationsNote?: string;
  /** Shown in the sheet as a short list of what sets the project apart. */
  highlights?: { title: string; text: string }[];
  photo: Photo;
  /** Shown on the project card instead of photo from 48rem, where the card's photo box is close to square. */
  desktopPhoto?: Photo;
  secondPhoto: Photo;
  /** Shown in the sheet between the specifications and the gallery. */
  paymentPlan?: { title: string; intro: string; schedule: { year: string; share: string }[] };
  /** Shown in the sheet's gallery in place of secondPhoto, when there is more than one. */
  gallery?: (Photo & { width: number; height: number })[];
  /** Shown in the sheet's Location section: where the map is centred, and what is close by. */
  location: { lat: number; lng: number; nearby: { kind: string; name: string; km?: number; time?: string }[] };
  /** Distance in km from the Outer Ring Road, as the partner gave it, and the compass bearing from the reference point (13.0278 N, 77.6325 E). */
  map: { km: number; bearing: number; label: 'left' | 'right' };
};

const sqft = (value: string) => `${value} sq ft`;

export const PRICE_NOTE =
  '*Starting price for the smallest home, before stamp duty, registration, GST and other charges. Prices can change without notice.';

// Lodha Elanza: the configurations, unit sizes, prices and site details are from the developer's
// WhatsApp message (October 2026), reworded here. The RERA number, possession and address are from Lodha's project page,
// lodhagroup.com/projects/residential-property-in-bangalore/lodha-elanza-sarjapur-road.
const ELANZA_INTRO =
  'Lodha Elanza is a 19-acre, low-density address on Sarjapur Road, where open space covers most of the land and the towers rise to G+34 floors. Design, craftsmanship and Lodha’s hospitality-led service shape daily life here, from the landscaped grounds to the homes themselves. Choose a 3 BHK Smart, a 3 BHK Luxe or a 3.5 BHK, with an early-bird advantage available on all three.';

// Lodha Azur: the configurations, sizes, prices, amenities and location are from the developer's
// WhatsApp message (October 2026), reworded here.
const AZUR_INTRO =
  'Lodha Azur is a lakefront community on the edge of Hulimavu Lake, in Akshayanagar off Bannerghatta Road in South Bengaluru. Ten acres, with 89% of the land left open, give it the calm of a waterfront retreat, and a full clubhouse adds resort-style leisure. Homes are planned around deep sundecks and wide views over the water, from 3 BHK residences up to 4 BHK penthouses.';

// The partner's 20% annual plan (October 2026), supplied for Lodha Azur, Tower F, and applied to
// the other projects at the partner's request: confirm each project's real schedule.
const PAYMENT_PLAN: NonNullable<Residence['paymentPlan']> = {
  title: 'Flexible 20% annual payment plan',
  intro: 'Spread your investment over five years, in five equal annual instalments of 20%.',
  schedule: ['2026', '2027', '2028', '2029', '2030'].map((year) => ({ year, share: '20%' })),
};

// Lodha Haven: the configurations, sizes, prices, handover and amenities are from the developer's
// WhatsApp message (October 2026), reworded here. Sizes are net carpet area.
const HAVEN_INTRO =
  'Lodha Haven is a forest-themed community in HSR Extension, in the core of Bengaluru. Over nine acres of dense, forest-inspired landscape, with 80% of the land left open, surround six towers of G+22 floors that hold fewer than 500 homes, and a 20,000 sq ft clubhouse completes the picture. The latest phase adds 3 BHK homes in Towers D and E, while Phase 1 runs from 3 BHK up to 4.5 BHK with a staff room. Handover is from December 2028.';

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
    tags: ['Low-density living', '19 acres'],
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
    // Varthur–Sarjapur Road, Dommasandra: 13 km from the Outer Ring Road, to the south-east.
    map: { km: 13, bearing: 132, label: 'right' },
  },
  {
    id: 'lodha-azure',
    name: 'Lodha Azur',
    area: 'Akshayanagar, Bannerghatta Road',
    line: AZUR_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3, 3.5 & 4 BHK, penthouses',
    size: sqft('1,900–4,000+'),
    price: '₹2.5 Cr onwards*',
    // Renders and aerial composites from the partner's kit (public/gallery/lodha-azure).
    caption: 'Artist’s impression.',
    tags: ['Lakefront living', '89% open space'],
    description: AZUR_INTRO,
    enquire: true,
    // No RERA row: the developer says it is registered, but no number has been supplied yet.
    specs: [
      { label: 'Type', value: '3, 3.5 & 4 BHK, penthouses' },
      { label: 'Unit size', value: sqft('1,900–4,000+') },
      { label: 'Total area', value: '10 acres, 89% open space' },
      { label: 'Setting', value: 'Beside Hulimavu Lake' },
      { label: 'Total units', value: '558' },
      { label: 'Possession', value: '2028–2029 onwards' },
      { label: 'Price', value: '₹2.5 Cr onwards*' },
    ],
    configurations: [
      { type: '3 BHK', size: sqft('1,900–2,150'), price: '₹2.5 Cr onwards*' },
      { type: '3.5 BHK (3 BHK + study)', size: sqft('2,250–2,450'), price: '₹2.75 Cr onwards*' },
      { type: '4 BHK', size: sqft('2,850–3,150'), price: '₹4 Cr onwards*' },
      { type: '4 BHK penthouse / duplex', size: sqft('4,000+'), price: 'On request' },
    ],
    configurationsNote: 'Prices depend on the floor, the tower and whether the home faces the lake.',
    highlights: [
      {
        title: 'The residences',
        text: 'Sundecks six to eight feet deep, double-height entrance lobbies, imported flooring and long views across the lake.',
      },
      {
        title: 'Club Palladio',
        text: 'A heated indoor pool and an outdoor Olympic-size pool, Café Azur, a gym, a yoga pavilion and sports courts, with a woodland trail along the lake and a park for pets.',
      },
      {
        title: 'Getting around',
        text: 'About ten minutes from the upcoming Hulimavu station on the Pink Line metro, with quick routes to NICE Road, Electronic City, Kalyani Magnum, Royal Meenakshi Mall, the Fortis and Apollo hospitals and IIM Bangalore.',
      },
    ],
    photo: {
      src: '/gallery/lodha-azure/terrace.jpg',
      alt: 'A lake-view terrace with a swing seat, lounge chairs and a filigree balustrade at sunset',
    },
    desktopPhoto: {
      src: '/gallery/lodha-azure/tower.jpg',
      alt: 'The tower rising beside the lake, with trees along the far bank',
      // A tall picture in a squarer box: favour the upper part, where the tower and its crown are.
      position: 'center 35%',
    },
    secondPhoto: {
      src: '/gallery/lodha-azure/clubhouse.jpg',
      alt: 'The clubhouse, a columned white pavilion beside a swimming pool and palms at dusk',
    },
    paymentPlan: { ...PAYMENT_PLAN, intro: 'Tower F offers the convenience of spreading your investment over five years.' },
    // Renders and aerial composites from the partner's kit, enlarged 2x and sharpened (public/gallery/lodha-azure).
    gallery: [
      { src: '/gallery/lodha-azure/aerial-lake.jpg', width: 2560, height: 1562, alt: 'An aerial view of the tower beside a large lake, with the city beyond' },
      { src: '/gallery/lodha-azure/aerial-tower.jpg', width: 2560, height: 1440, alt: 'An aerial view of the tower and landscaped gardens beside the lake' },
      { src: '/gallery/lodha-azure/tower.jpg', width: 1656, height: 2090, alt: 'The tower rising beside the lake, with trees along the far bank' },
      { src: '/gallery/lodha-azure/arrival.jpg', width: 2000, height: 960, alt: 'A drive-in arrival court with a cobbled circle, an arched colonnade and a glazed lobby' },
      { src: '/gallery/lodha-azure/clubhouse.jpg', width: 2500, height: 1406, alt: 'The clubhouse, a columned white pavilion beside a swimming pool and palms at dusk' },
      { src: '/gallery/lodha-azure/terrace.jpg', width: 1974, height: 1000, alt: 'A lake-view terrace with a swing seat, lounge chairs and a filigree balustrade at sunset' },
    ],
    // Placeholder: an approximate point by Hulimavu Lake, Akshayanagar, and indicative distances.
    location: {
      lat: 12.875,
      lng: 77.61,
      nearby: [
        { kind: 'Metro', name: 'Hulimavu metro (Pink Line, upcoming)', time: 'About 10 min' },
        { kind: 'Airport', name: 'Kempegowda International Airport', km: 55 },
        { kind: 'School', name: 'Orchids The International School, Bannerghatta Road', km: 7 },
        { kind: 'Hospital', name: 'Apollo Hospital, Bannerghatta Road', km: 6 },
        { kind: 'Mall', name: 'Royal Meenakshi Mall, Bannerghatta Road', km: 8 },
      ],
    },
    // Akshayanagar, off Bannerghatta Road: 7 km from the Outer Ring Road, to the south.
    map: { km: 7, bearing: 188, label: 'left' },
  },
  {
    id: 'lodha-haven',
    name: 'Lodha Haven',
    area: 'Hosa Road, Off Sarjapur Road',
    line: HAVEN_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3, 3.5 & 4.5 BHK',
    size: sqft('1,076–2,225'),
    price: '₹2.4 Cr onwards*',
    // Renders from the partner's kit (public/gallery/lodha-haven).
    caption: 'Artist’s impression.',
    tag: 'Phase 2 · Latest launch',
    tags: ['Forest-inspired landscape', '80% open space'],
    description: HAVEN_INTRO,
    enquire: true,
    // No RERA row: the registration number has not been supplied yet.
    specs: [
      { label: 'Type', value: '3, 3.5 & 4.5 BHK' },
      { label: 'Unit size', value: sqft('1,076–2,225') + ', net carpet area' },
      { label: 'Total area', value: '9.3 acres, 80% open space' },
      { label: 'Towers', value: '6 towers, G+22 floors' },
      { label: 'Total units', value: 'Fewer than 500' },
      { label: 'Clubhouse', value: sqft('20,000') },
      { label: 'Possession', value: 'Dec 2028' },
      { label: 'Price', value: '₹2.4 Cr onwards*' },
    ],
    configurations: [
      { group: 'Phase 2 · latest launch', type: 'Tower D · 3 BHK + study', size: sqft('1,361'), price: 'Avg. ₹2.9 Cr' },
      { group: 'Phase 2 · latest launch', type: 'Tower D · 3 BHK', size: sqft('1,372'), price: 'Avg. ₹2.9 Cr' },
      { group: 'Phase 2 · latest launch', type: 'Tower E · 3 BHK', size: sqft('1,379'), price: 'Avg. ₹2.9 Cr' },
      { group: 'Phase 1', type: '3 BHK', size: sqft('1,076'), price: '₹2.4 Cr onwards' },
      { group: 'Phase 1', type: '3.5 BHK', size: sqft('1,352'), price: '₹3.1 Cr onwards' },
      { group: 'Phase 1', type: '3.5 BHK Luxe', size: sqft('1,598'), price: '₹3.6 Cr onwards' },
      { group: 'Phase 1', type: '4.5 BHK + staff room', size: sqft('2,225'), price: '₹5 Cr onwards' },
    ],
    configurationsNote: 'Sizes are net carpet area. Phase 2 prices are the average agreement value; Phase 1 prices exclude registration and maintenance.',
    highlights: [
      {
        title: 'A forest to live in',
        text: 'The landscape is planned as a dense forest, so homes look out on mature greenery, with 80% of the 9.3 acres left open.',
      },
      {
        title: 'Low-density towers',
        text: 'Six towers of G+22 floors share the land and hold fewer than 500 homes in all.',
      },
      {
        title: 'Clubhouse',
        text: 'A 20,000 sq ft clubhouse serves the whole community.',
      },
    ],
    photo: {
      src: '/gallery/lodha-haven/podium-pool.jpg',
      alt: 'A pool deck at dusk below a curved tower whose terraces are draped in greenery',
      // A wide picture in a squarer box: keep the tower's curve and the pool in view.
      position: '30% center',
    },
    secondPhoto: {
      src: '/gallery/lodha-haven/treehouse.jpg',
      alt: 'A treehouse reached by a rope bridge among old trees, with a couple strolling along a garden path',
    },
    paymentPlan: PAYMENT_PLAN,
    // Renders from the partner's kit, enlarged 2x and sharpened (public/gallery/lodha-haven).
    gallery: [
      { src: '/gallery/lodha-haven/treehouse.jpg', width: 2186, height: 1274, alt: 'A treehouse reached by a rope bridge among old trees, with a couple strolling along a garden path' },
      { src: '/gallery/lodha-haven/aerial-gardens.jpg', width: 2126, height: 1280, alt: 'An aerial view from a balcony over forest-like gardens, a pool and timber pavilions' },
      { src: '/gallery/lodha-haven/podium-pool.jpg', width: 2190, height: 1262, alt: 'A pool deck at dusk below a curved tower whose terraces are draped in greenery' },
      { src: '/gallery/lodha-haven/tower-lake.jpg', width: 1286, height: 792, alt: 'A twin-tower residence rising above a still lake at sunset' },
      { src: '/gallery/lodha-haven/lounge.jpg', width: 1652, height: 1374, alt: 'A double-height lounge with a ring chandelier, a curved sofa and tall plants' },
      { src: '/gallery/lodha-haven/restaurant.jpg', width: 1614, height: 1292, alt: 'A clubhouse restaurant with ring chandeliers, timber panelling and marble-topped tables' },
      { src: '/gallery/lodha-haven/gym.jpg', width: 1604, height: 1184, alt: 'A gym with a green running track, mirrored columns and glass walls onto the trees' },
      { src: '/gallery/lodha-haven/living-room.jpg', width: 2166, height: 1280, alt: 'A living and dining room with a wide window over the lake at sunset' },
      { src: '/gallery/lodha-haven/bedroom-balcony.jpg', width: 2172, height: 1256, alt: 'A bedroom opening to a balcony with a swing seat above the lake' },
      { src: '/gallery/lodha-haven/balcony-window.jpg', width: 1616, height: 1302, alt: 'An open balcony door framing green treetops, with a pouffe and potted plants' },
      { src: '/gallery/lodha-haven/area-map.jpg', width: 2340, height: 1760, alt: 'An illustrated map of the area around Lodha Haven on Hosa Road, with nearby schools, hospitals, tech parks and Choodasandra Lake' },
    ],
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
    // Hosa Road, off Sarjapur Road: 5 km from the Outer Ring Road, to the south-south-east.
    map: { km: 5, bearing: 159, label: 'left' },
  },
];

export const enquirableResidences = residences.filter((r) => r.enquire);

export const isResidenceId = (id: string) => residences.some((r) => r.id === id);
