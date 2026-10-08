// ─────────────────────────────────────────────────────────────
// Business details used across the whole site.
// Change them here once and every page, the footer and the
// Google structured data update together.
// ─────────────────────────────────────────────────────────────
import { SITE_URL } from './site-url.mjs';

const phones = [
  { display: '+92 341 6413289', href: 'tel:+923416413289' },
  { display: '+92 331 5548270', href: 'tel:+923315548270' },
];
const emails = ['ah5006154@gmail.com', 'khrram51@gmail.com'];

export const site = {
  name: 'AIM Rehab',
  url: SITE_URL,
  tagline: 'Prosthetic & Orthotic Clinic in Rawalpindi',
  slogan: 'Advancements in Mobility',
  description:
    'AIM Rehab is a prosthetic and orthotic clinic in Rawalpindi. We make and fit artificial limbs, leg braces, spinal braces and custom foot orthotics for adults and children.',

  // The first phone and email are the main ones. They're used where only one fits.
  phones,
  emails,
  phone: phones[0].display,
  phoneHref: phones[0].href,
  email: emails[0],
  // WhatsApp number in international format, digits only (e.g. 923001234567). Empty hides it.
  whatsapp: '',

  address: {
    street: 'Nelson Medical Complex, Abid Majeed Road',
    area: 'Opposite MH Gate 6, Tench Bhata',
    city: 'Rawalpindi',
    region: 'Punjab',
    postalCode: '46000',
    country: 'PK',
  },
  geo: { lat: 33.5973399, lng: 73.0413231 },
  // Google Maps place for Nelson Medical Complex. `mapEmbed` is the map shown on the site.
  mapUrl: 'https://maps.google.com/?cid=4590295246760578247',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m3!3m2!1m1!4s4590295246760578247!3m1!1sen!5m1!1sen',

  hours: [{ days: 'Monday to Sunday', time: '10 AM to 8 PM' }],
  // The same hours in the format Google reads.
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '10:00',
    closes: '20:00',
  },

  // Add your page links. Empty links are hidden.
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },

  // Optional. Paste a form endpoint (Formspree, Web3Forms, etc.) to receive
  // form messages by email. When empty, the form opens the visitor's email app
  // with the message filled in, addressed to the emails above.
  formEndpoint: '',
};

export const addressLine = [site.address.street, site.address.area, site.address.city].join(', ');
export const mailtoAll = emails.join(',');

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/', children: true },
  { label: 'Team', href: '/team/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];
