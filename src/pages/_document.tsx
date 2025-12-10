import { Html, Head, Main, NextScript } from "next/document";
import { structuredData } from "../seo";

export default function Document() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <meta name="description" content="Transform your business with cutting-edge data analytics and AI-powered insights. Liquidata provides enterprise-grade data solutions." />
        <meta name="keywords" content="data analytics, AI insights, business intelligence, data solutions, enterprise software" />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="Liquidata" />
        <meta property="og:title" content="Liquidata - Modern Data Solutions" />
        <meta property="og:description" content="Transform your business with cutting-edge data analytics and AI-powered insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://liquidata.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Liquidata - Modern Data Solutions" />
        <meta name="twitter:description" content="Transform your business with cutting-edge data analytics and AI-powered insights." />
        <link rel="canonical" href="https://liquidata.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className="bg-zinc-950 text-zinc-200 selection:bg-zinc-600">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
