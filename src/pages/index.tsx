import { CTA } from "@/components/cta/CTA";
import { Customers } from "@/components/customers/Customers";
import Carousel from "@/components/features/carousel/Carousel";
import { FeatureGrid } from "@/components/features/grid/FeatureGrid";
import { Stats } from "@/components/features/stats/Stats";
import { Footer } from "@/components/footer/Footer";
import { StandaloneHero } from "@/components/hero/StandaloneHero";
import { Logos } from "@/components/logos/Logos";
import { Pricing } from "@/components/pricing/Pricing";
import SEOHead from "@/components/seo/SEOHead";
import { structuredData, websiteStructuredData, serviceStructuredData } from "@/seo";
import { event } from "@/lib/gtag";
import { Barlow } from "next/font/google";
import { useEffect } from "react";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  useEffect(() => {
    event({
      action: 'page_view',
      category: 'engagement',
      label: 'home_page',
    });
  }, []);

  const combinedStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [structuredData, websiteStructuredData, serviceStructuredData]
  };

  return (
    <>
      <SEOHead
        title="Liquidata - Custom Software & Hardware Solutions | Data Analytics & AI"
        description="Transform your business with Liquidata's cutting-edge data analytics, AI-powered insights, and custom software & hardware solutions. Get accurate project estimates with our smart calculator. Expert development services worldwide."
        keywords="liquidata, custom software development, hardware solutions, data analytics, AI insights, business intelligence, web development, mobile app development, project calculator, enterprise solutions, software consulting, digital transformation"
        canonical="https://liquidata.dev"
        structuredData={combinedStructuredData}
      />
      <main className={barlowFont.className}>
        <StandaloneHero
          announcement="🚀 Let's Build the Future Together"
          title="Custom Software & Hardware Solutions"
          description="From concept to creation, we deliver innovative software and hardware solutions tailored to your business needs."
          buttonText="Get a Quote"
          buttonUrl="/calculator"
          secondaryButtonText="Contact Us"
          secondaryButtonUrl="/contact"
        />
        <Logos />
        <FeatureGrid />
        <Carousel />
        <Customers />
        <Stats />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
