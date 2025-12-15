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
import { structuredData } from "@/seo";
import { event } from "@/lib/gtag";
import { Barlow } from "next/font/google";
import { useEffect } from "react";
import { Content } from "@/components/hero/Content";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  useEffect(() => {
    // Track page view
    event({
      action: 'page_view',
      category: 'engagement',
      label: 'home_page',
    });
  }, []);

  return (
    <>
      <SEOHead
        title="Liquidata - Modern Data Solutions & Custom Software Development"
        description="Transform your business with cutting-edge data analytics, AI-powered insights, and custom software solutions. Get accurate project estimates with our smart calculator."
        keywords="data analytics, AI insights, business intelligence, custom software development, web development, mobile apps, project calculator, enterprise solutions"
        structuredData={structuredData}
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
