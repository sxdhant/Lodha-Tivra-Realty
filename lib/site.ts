// Brand and contact details. The office, phone, WhatsApp and email are the firm's own (October 2026).
// The registration numbers are placeholders: replace them before launch.
export const site = {
  name: 'Lodha Preferred Partner',
  // Replace with your firm's registered name as it should appear in the copyright line.
  legalName: 'Lodha Preferred Partner',
  description:
    'Private viewings and plain advice on Lodha’s luxury residences in Bengaluru, from a Lodha Preferred Partner.',
  logo: {
    original: '/brand/lodha-preferred-partner.png',
    reversed: '/brand/lodha-preferred-partner-reversed.png',
    width: 249,
    height: 126,
  },
  phone: { display: '+91 87098 08869', href: 'tel:+918709808869' },
  // wa.me takes the number in international format, digits only. The message is filled in for the visitor.
  whatsapp: {
    href: `https://wa.me/918709808869?text=${encodeURIComponent('Hello, I would like to know more about Lodha residences in Bengaluru.')}`,
  },
  email: 'admin@tivrarealty.com',
  // Opens a new Gmail message to the firm (the Gmail app on a phone that has it, otherwise the web page).
  gmailHref: `https://mail.google.com/mail/?view=cm&fs=1&to=admin@tivrarealty.com&su=${encodeURIComponent('Enquiry about Lodha residences in Bengaluru')}`,
  office: {
    street: '5, Doddakammanahalli Main Rd',
    area: 'Nobo Nagar, Kalena Agrahara',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin: '560076',
    mapHref: 'https://maps.app.goo.gl/VR3vpyspqRPmtzdMA',
  },
  // Your Karnataka RERA real estate agent registration number.
  reraAgent: 'PRM/KA/RERA/0000/000/AG/000000',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/tivrarealty/' },
    { label: 'Facebook', href: 'https://www.facebook.com/TivraRealty/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tivra-realty/' },
  ],
} as const;

// A WhatsApp chat with the firm, opened with the given message already typed.
export const whatsappHref = (message: string) => `https://wa.me/918709808869?text=${encodeURIComponent(message)}`;
