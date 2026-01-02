import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { Footer } from "@/components/footer/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { breadcrumbStructuredData } from "@/seo";
import { Barlow } from "next/font/google";
import { motion } from "framer-motion";
import { MaxWidthWrapper } from "@/components/utils/MaxWidthWrapper";
import { HeaderGrid } from "@/components/utils/HeaderGrid";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Contact() {
  const breadcrumbs = breadcrumbStructuredData([
    { name: 'Home', url: 'https://liquidata.dev' },
    { name: 'Contact', url: 'https://liquidata.dev/contact' }
  ]);

  return (
    <>
      <SEOHead
        title="Contact Us - Get in Touch with Liquidata | Software Development Experts"
        description="Contact Liquidata for custom software development, hardware solutions, data analytics, and AI services. Get in touch with our expert team today."
        keywords="contact liquidata, software development inquiry, custom development contact, business solutions, get quote, contact form"
        canonical="https://liquidata.dev/contact"
        structuredData={breadcrumbs}
      />
      <main className={barlowFont.className}>
        <section className="relative pt-32 pb-8 md:pt-40 md:pb-20">
          <HeaderGrid />
          <MaxWidthWrapper className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none mb-8 lg:mb-12"
            >
              Get in Touch
            </motion.h1>
          </MaxWidthWrapper>
        </section>
        <ContactForm />
        <SocialLinks />
        <Footer />
      </main>
    </>
  );
}

