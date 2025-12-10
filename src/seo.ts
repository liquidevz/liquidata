export const seoConfig = {
  title: 'Liquidata - Modern Data Solutions',
  description: 'Transform your business with cutting-edge data analytics and AI-powered insights. Liquidata provides enterprise-grade data solutions.',
  canonical: 'https://liquidata.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://liquidata.com',
    siteName: 'Liquidata',
    title: 'Liquidata - Modern Data Solutions',
    description: 'Transform your business with cutting-edge data analytics and AI-powered insights.',
    images: [
      {
        url: '/og-image.jpg',
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
      content: 'index,follow',
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
  description: 'Transform your business with cutting-edge data analytics and AI-powered insights.',
  sameAs: [
    'https://twitter.com/liquidata',
    'https://linkedin.com/company/liquidata'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://liquidata.com/contact'
  }
};