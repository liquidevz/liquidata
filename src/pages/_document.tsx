import { Html, Head, Main, NextScript } from "next/document";
import { structuredData, websiteStructuredData, serviceStructuredData } from "../seo";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Transform your business with cutting-edge data analytics, AI-powered insights, and custom software solutions. Liquidata provides enterprise-grade development services." />
        <meta name="keywords" content="liquidata, data analytics, AI insights, business intelligence, custom software development, web development, mobile apps, hardware solutions, enterprise software, project calculator" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="author" content="Liquidata" />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Liquidata - Custom Software & Hardware Solutions | Data Analytics & AI" />
        <meta property="og:description" content="Transform your business with cutting-edge data analytics, AI-powered insights, and custom software solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://liquidata.com" />
        <meta property="og:site_name" content="Liquidata" />
        <meta property="og:image" content="https://liquidata.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Liquidata - Modern Data Solutions" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@liquidata" />
        <meta name="twitter:creator" content="@liquidata" />
        <meta name="twitter:title" content="Liquidata - Custom Software & Hardware Solutions" />
        <meta name="twitter:description" content="Transform your business with cutting-edge data analytics, AI-powered insights, and custom software solutions." />
        <meta name="twitter:image" content="https://liquidata.com/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/liquidata.svg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://liquidata.com" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceStructuredData),
          }}
        />
      </Head>
      <body className="bg-zinc-950 text-zinc-200 selection:bg-zinc-600">
        <Main />
        <NextScript />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4W3WHHYRT3"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4W3WHHYRT3', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `,
          }}
        />
      </body>
    </Html>
  );
}
