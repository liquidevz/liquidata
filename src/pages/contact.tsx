import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { Footer } from "@/components/footer/Footer";
import { PageHeader } from "@/components/utils/PageHeader";
import SEOHead from "@/components/seo/SEOHead";
import { Barlow } from "next/font/google";

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Us - Liquidata"
        description="Get in touch with Liquidata. Contact our team for software and hardware development services."
        keywords="contact, software development, hardware solutions, custom development, business solutions"
      />
      <main className={barlowFont.className}>
        <PageHeader title="Get in Touch" />
        <ContactForm />
        <SocialLinks />
        <Footer />
      </main>
    </>
  );
}

