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

// Lodha Azure: the configurations, sizes, prices, amenities and location are from the developer's
// WhatsApp message (October 2026), reworded here. The developer writes the name as Lodha Azur.
const AZURE_INTRO =
  'Lodha Azure is a lakefront community on the edge of Hulimavu Lake, in Akshayanagar off Bannerghatta Road in South Bengaluru. Ten acres, with 89% of the land left open, give it the calm of a waterfront retreat, and a full clubhouse adds resort-style leisure. Homes are planned around deep sundecks and wide views over the water, from 3 BHK residences up to 4 BHK penthouses.';

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
    area: 'Akshayanagar, Bannerghatta Road',
    line: AZURE_INTRO,
    status: 'available',
    statusLabel: 'Available',
    type: '3, 3.5 & 4 BHK, penthouses',
    size: sqft('1,900–4,000+'),
    price: '₹2.37 Cr onwards*',
    // Renders and aerial composites from the partner's kit (public/gallery/lodha-azure).
    caption: 'Artist’s impression.',
    description: AZURE_INTRO,
    enquire: true,
    // No RERA row: the developer says it is registered, but no number has been supplied yet.
    specs: [
      { label: 'Type', value: '3, 3.5 & 4 BHK, penthouses' },
      { label: 'Unit size', value: sqft('1,900–4,000+') },
      { label: 'Total area', value: '10 acres, 89% open space' },
      { label: 'Setting', value: 'Beside Hulimavu Lake' },
      { label: 'Total units', value: '558' },
      { label: 'Possession', value: '2028–2029 onwards' },
      { label: 'Price', value: '₹2.37 Cr onwards*' },
    ],
    configurations: [
      { type: '3 BHK', size: sqft('1,900–2,150'), price: '₹2.37 Cr onwards*' },
      { type: '3.5 BHK (3 BHK + study)', size: sqft('2,250–2,450'), price: '₹2.75 Cr onwards*' },
      { type: '4 BHK', size: sqft('2,850–3,150'), price: '₹3.50 Cr onwards*' },
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
    // Akshayanagar, off Bannerghatta Road: about 17 km south of the Outer Ring Road point.
    map: { km: 17, bearing: 188, label: 'left' },
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
