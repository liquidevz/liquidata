import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { Footer } from "@/components/footer/Footer";
import { NavBar } from "@/components/navbar/NavBar";
import { PageHeader } from "@/components/utils/PageHeader";
import { Barlow } from "next/font/google";
import Head from 'next/head';

const barlowFont = Barlow({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - LiquiData</title>
        <meta name="description" content="Get in touch with LiquiData. Contact our team for software and hardware development services." />
        <link rel="canonical" href="https://LiquiData.com/contact" />
      </Head>
      <main className={`${barlowFont.className} bg-[#0a0b0d] min-h-screen relative overflow-hidden`}>
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10">
          {/* <NavBar /> */}
          <PageHeader title="Get in Touch" />
          <ContactForm />
          <SocialLinks />
          <Footer />
        </div>
      </main>
    </>
  );
}

export default Contact;