// ─────────────────────────────────────────────────────────────
// Business details used across the whole site.
// Change them here once and every page, the footer and the
// Google structured data update together.
// Anything marked TODO still needs the real value before launch.
// ─────────────────────────────────────────────────────────────
import { SITE_URL } from './site-url.mjs';

export const site = {
  name: 'AIM Rehab',
  url: SITE_URL,
  tagline: 'Prosthetic & Orthotic Clinic',
  description:
    'AIM Rehab is a prosthetic and orthotic clinic. We make and fit artificial limbs, leg braces, spinal braces and custom foot orthotics for adults and children.',

  // TODO: real phone number. `phoneHref` is the same number with no spaces.
  phone: '+92 3XX XXX XXXX',
  phoneHref: 'tel:+923000000000',
  // TODO: WhatsApp number in international format, digits only (e.g. 923001234567).
  whatsapp: '',
  // TODO: real email address.
  email: 'hello@your-domain.com',

  // TODO: real clinic address. Leave `mapUrl` empty if you don't have one yet.
  address: {
    street: 'Clinic street address',
    city: 'City',
    region: '',
    postalCode: '',
    country: 'PK',
  },
  mapUrl: '',

  hours: [
    { days: 'Mon to Sat', time: 'By appointment' },
    { days: 'Sunday', time: 'Closed' },
  ],

  // TODO: add your page links. Empty links are hidden.
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },

  // Optional. Paste a form endpoint (Formspree, Web3Forms, etc.) to receive
  // form messages by email. When empty, the form opens the visitor's email app
  // with the message filled in, addressed to `email` above.
  formEndpoint: '',
};

export const addressLine = [site.address.street, site.address.city].filter(Boolean).join(', ');

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/', children: true },
  { label: 'Team', href: '/team/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];
