import raw from '@/content/business.json';
import { z } from 'astro:content';

const schema = z.object({
  name: z.string(),
  legalName: z.string(),
  url: z.string().url(),
  appUrl: z.string().url(),
  founded: z.number(),
  tagline: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string(),
  address: z.string(),
  areaServed: z.string(),
  social: z.array(z.string().url()),
  analytics: z.object({ gtm: z.string(), ga4: z.string() }),
  stats: z.object({ clientsRecorded: z.number(), anchorCustomer: z.string() }),
  currency: z.string(),
  developer: z.object({ name: z.string(), company: z.string(), url: z.string().url() }),
});

const parsed = schema.parse(raw);
const isSet = (v: string) => v.trim() !== '' && v !== 'REPLACE_ME';
const digits = (v: string) => v.replace(/\D/g, '');

export const business = {
  ...parsed,
  appLogin: `${parsed.appUrl}/`,
  appSignup: `${parsed.appUrl}/signup`,
  appPricing: `${parsed.appUrl}/pricing`,
  appSales: `${parsed.appUrl}/contact-sales`,
  hasPhone: isSet(parsed.phone),
  hasWhatsapp: isSet(parsed.whatsapp),
  hasLegalName: isSet(parsed.legalName),
  telHref: isSet(parsed.phone) ? `tel:+${digits(parsed.phone)}` : '',
  waHref: (message = '') =>
    isSet(parsed.whatsapp) ? `https://wa.me/${digits(parsed.whatsapp)}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '',
};
