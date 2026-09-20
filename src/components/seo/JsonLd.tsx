interface OrganizationSchemaProps {
  url?: string;
}

export function OrganizationSchema({ url = 'https://www.webminor.co.uk' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    legalName: 'Able Print Limited',
    vatID: 'GB432542811',
    name: 'WebMinor',
    url,
    logo: `${url}/images/w-mark-768.png`,
    description: 'Web design consultancy building fast, conversion-focused websites for local trades businesses across South West England.',
    foundingDate: '2001',
    founder: {
      '@type': 'Person',
      name: 'Adam Butcher',
      jobTitle: 'Founder & Lead Developer',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 3, Gwel Avon Business Park, Gilston Road',
      addressLocality: 'Saltash',
      addressRegion: 'Cornwall',
      postalCode: 'PL12 6TW',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-1752-845258',
      contactType: 'sales',
      availableLanguage: 'English',
    },
    // Populate with the Facebook, Instagram and Google Business Profile URLs
    // once those profiles exist. Dead URLs here are worse than none.
    sameAs: [],
    areaServed: [
      { '@type': 'City', name: 'Exeter' },
      { '@type': 'City', name: 'Plymouth' },
      { '@type': 'City', name: 'Bristol' },
      { '@type': 'City', name: 'Bath' },
      { '@type': 'City', name: 'Taunton' },
      { '@type': 'City', name: 'Truro' },
      { '@type': 'City', name: 'Torquay' },
      { '@type': 'City', name: 'Bournemouth' },
      { '@type': 'City', name: 'Poole' },
      { '@type': 'City', name: 'Gloucester' },
      { '@type': 'City', name: 'Swindon' },
      { '@type': 'City', name: 'Cheltenham' },
    ],
    knowsAbout: [
      'Web Design',
      'Local SEO',
      'Google Business Profile',
      'Lead Generation',
      'Website Development for Tradespeople',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function ServiceSchema({ name, description, url }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'WebMinor',
      url: 'https://www.webminor.co.uk',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 50.4088,
        longitude: -4.2119,
      },
      geoRadius: '150000',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Butcher',
    jobTitle: 'Founder, Designer & Developer',
    description:
      '25+ years in graphic design and web development. Founder of WebMinor, designing and building every website personally rather than through an agency team.',
    url: 'https://www.webminor.co.uk/about',
    worksFor: {
      '@type': 'Organization',
      name: 'WebMinor',
      url: 'https://www.webminor.co.uk',
    },
    knowsAbout: [
      'Web Design',
      'Graphic Design',
      'Local SEO',
      'Website Development for Tradespeople',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageSchemaProps {
  faqs: { question: string; answer: string }[];
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SpeakableSchemaProps {
  url: string;
  cssSelectors: string[];
}

export function SpeakableSchema({ url, cssSelectors }: SpeakableSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const SITE = 'https://www.webminor.co.uk';

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape `<`; swap it for its unicode form so the
      // payload can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

/** The one real premises. Only for pages about the business itself (home, contact). */
export function LocalBusinessSchema() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE}/#business`,
        name: 'WebMinor',
        description: 'Web design studio based in Saltash, Cornwall.',
        url: SITE,
        image: `${SITE}/images/w-mark-768.png`,
        telephone: '+441752845258',
        email: 'hello@webminor.co.uk',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Unit 3, Gwel Avon Business Park, Gilston Road',
          addressLocality: 'Saltash',
          addressRegion: 'Cornwall',
          postalCode: 'PL12 6TW',
          addressCountry: 'GB',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 50.4088, longitude: -4.2119 },
        // Saturday is by appointment and Sunday closed, so neither is listed.
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '16:30',
          },
        ],
        founder: { '@type': 'Person', name: 'Adam Butcher' },
      }}
    />
  );
}

interface AreaServiceSchemaProps {
  name: string;
  description: string;
  /** Path from the site root, e.g. "/web-design/plymouth". */
  path: string;
  city: string;
  /** Omit when the city is its own county (Bristol). */
  county?: string;
}

/**
 * A service offered in a town where WebMinor has no premises. Google reserves
 * LocalBusiness for a real physical location, so town pages use Service + areaServed.
 */
export function AreaServiceSchema({ name, description, path, city, county }: AreaServiceSchemaProps) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        serviceType: 'Web design',
        url: `${SITE}${path}`,
        provider: { '@type': 'Organization', name: 'WebMinor', url: SITE },
        areaServed: {
          '@type': 'City',
          name: city,
          ...(county && county !== city
            ? { containedInPlace: { '@type': 'AdministrativeArea', name: county } }
            : {}),
        },
      }}
    />
  );
}

/** Trail starts after Home, which is added automatically. */
export function BreadcrumbSchema({ trail }: { trail: { name: string; path: string }[] }) {
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE}${item.path === '/' ? '' : item.path}`,
        })),
      }}
    />
  );
}
