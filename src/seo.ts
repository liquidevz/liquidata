export const seoConfig = {
  title: 'Liquidata - Custom Software & Hardware Solutions | Data Analytics & AI',
  description: 'Transform your business with Liquidata. Expert custom software development, hardware solutions, data analytics, and AI-powered insights. Get accurate project estimates with our smart calculator.',
  canonical: 'https://liquidata.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://liquidata.com',
    siteName: 'Liquidata',
    title: 'Liquidata - Custom Software & Hardware Solutions',
    description: 'Transform your business with cutting-edge data analytics, AI-powered insights, and custom software solutions.',
    images: [
      {
        url: 'https://liquidata.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Liquidata - Modern Data Solutions',
      },
    ],
  },
  twitter: {
    handle: '@liquidata',
    site: '@liquidata',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#0ea5e9',
    },
    {
      name: 'robots',
      content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    },
    {
      name: 'author',
      content: 'Liquidata',
    },
  ],
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Liquidata',
  url: 'https://liquidata.com',
  logo: 'https://liquidata.com/liquidata.svg',
  description: 'Transform your business with cutting-edge data analytics, AI-powered insights, and custom software and hardware solutions.',
  foundingDate: '2020',
  sameAs: [
    'https://twitter.com/liquidata',
    'https://linkedin.com/company/liquidata',
    'https://facebook.com/liquidata'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://liquidata.com/contact',
    availableLanguage: ['English']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150'
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '5000',
    highPrice: '100000',
    offerCount: '50'
  }
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Liquidata',
  url: 'https://liquidata.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://liquidata.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Software Development',
  provider: {
    '@type': 'Organization',
    name: 'Liquidata'
  },
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software & Hardware Solutions',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Software Development',
          description: 'Tailored software solutions for your business needs'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Data Analytics',
          description: 'Advanced data analytics and business intelligence'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Solutions',
          description: 'AI-powered insights and automation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hardware Solutions',
          description: 'Custom hardware development and integration'
        }
      }
    ]
  }
};

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});