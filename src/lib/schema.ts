import { business } from './business';
import { site } from './site';

type Crumb = { name: string; path: string };
type Faq = { q: string; a: string };

const org = {
  '@type': 'Organization',
  '@id': `${business.url}/#organization`,
  name: business.name,
  url: business.url,
  logo: site.href.abs('/brand/icon-512.png'),
  foundingDate: String(business.founded),
  email: business.email,
  sameAs: business.social,
};

const software = {
  '@type': 'SoftwareApplication',
  '@id': `${business.url}/#software`,
  name: business.name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android (PWA)',
  inLanguage: 'es-MX',
  description: business.tagline,
  publisher: { '@id': org['@id'] },
  offers: [
    { '@type': 'Offer', name: 'Gratis', price: '0', priceCurrency: business.currency },
    { '@type': 'Offer', name: 'Equipo', price: '190', priceCurrency: business.currency, description: 'Por usuario al mes' },
  ],
};

export const buildGraph = (opts: { path: string; title: string; description: string; crumbs: Crumb[]; faqs?: Faq[] }) => {
  const url = site.href.abs(opts.path);
  const graph: Record<string, unknown>[] = [
    org,
    { '@type': 'WebSite', '@id': `${business.url}/#website`, url: business.url, name: business.name, inLanguage: 'es-MX', publisher: { '@id': org['@id'] } },
    software,
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: opts.title, description: opts.description, inLanguage: 'es-MX', isPartOf: { '@id': `${business.url}/#website` } },
  ];
  if (opts.crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: opts.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: site.href.abs(c.path) })),
    });
  }
  if (opts.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: opts.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
};
