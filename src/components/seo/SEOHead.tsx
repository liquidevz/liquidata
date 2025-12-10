import Head from 'next/head';
import { NextSeo } from 'next-seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
  noindex?: boolean;
}

export default function SEOHead({
  title = 'Liquidata - Modern Data Solutions',
  description = 'Transform your business with cutting-edge data analytics and AI-powered insights. Liquidata provides enterprise-grade data solutions.',
  canonical = 'https://liquidata.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'data analytics, AI insights, business intelligence, data solutions, enterprise software',
  author = 'Liquidata',
  publishedTime,
  modifiedTime,
  structuredData,
  noindex = false,
}: SEOHeadProps) {
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        noindex={noindex}
        openGraph={{
          type: ogType,
          locale: 'en_US',
          url: canonical,
          siteName: 'Liquidata',
          title: title,
          description: description,
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
        twitter={{
          handle: '@liquidata',
          site: '@liquidata',
          cardType: twitterCard,
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          {
            name: 'author',
            content: author,
          },
          {
            name: 'robots',
            content: noindex ? 'noindex,nofollow' : 'index,follow',
          },
          ...(publishedTime ? [{
            property: 'article:published_time',
            content: publishedTime,
          }] : []),
          ...(modifiedTime ? [{
            property: 'article:modified_time',
            content: modifiedTime,
          }] : []),
        ]}
      />
      
      {structuredData && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </Head>
      )}
    </>
  );
}