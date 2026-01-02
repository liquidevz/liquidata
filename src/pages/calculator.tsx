import SmartCalculator from "@/components/smart-calculator/SmartCalculator";
import SEOHead from "@/components/seo/SEOHead";
import { breadcrumbStructuredData } from "@/seo";

export default function Calculator() {
  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: 'https://liquidata.dev' },
    { name: 'Calculator', url: 'https://liquidata.dev/calculator' }
  ]);

  return (
    <>
      <SEOHead
        title="Smart Project Calculator - Get Accurate Estimates | Liquidata"
        description="Calculate accurate project estimates for your custom software, web, or mobile app development. Get instant pricing for your next project with Liquidata's smart calculator."
        keywords="project calculator, software cost estimate, development pricing, project estimate, web development cost, mobile app pricing, custom software quote"
        canonical="https://liquidata.dev/calculator"
        structuredData={breadcrumbs}
      />
      <SmartCalculator />
    </>
  );
}