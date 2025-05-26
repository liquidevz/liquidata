import Lines from '../components/common/Lines';
import ProgressScroll from '../components/common/ProgressScroll';
import Cursor from '../components/common/cusor';
import LoadingScreen from '../components/common/loader';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import Marq2 from '../components/common/Marq2';
import { Helmet } from 'react-helmet';
import Header from '../components/home-main/Header';
import Intro from '../components/home-main/Intro';
import Portfolio from '../components/home-main/Portfolio';
import Services from '../components/home-main/Services';
import Team from '../components/home-main/Team';
import Testimonials from '../components/home-main/Testimonials';
import Clients from '../components/home-main/Clients';
import Feat from '../components/home-main/Feat';
import Marq from '../components/home-main/Marq';
import WOW from 'wowjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';

import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const main = useRef();
  const smoother = useRef();

  useEffect(() => {
    // Initialize WOW.js animations
    if (typeof window !== 'undefined') {
      new WOW.WOW({
        animateClass: 'animated',
        offset: 100,
      }).init();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Liquidata</title>
        <link rel="icon" href="/assets/imgs/favicon.ico" />
        <link rel="shortcut icon" href="/assets/imgs/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/assets/css/plugins.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />

        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&display=swap"
        />
        
        {/* Load GSAP and related scripts in the correct order */}
        <script src="/assets/js/gsap.min.js" />
        <script src="/assets/js/ScrollTrigger.min.js" />
        <script src="/assets/js/ScrollSmoother.min.js" />
        <script src="/assets/js/smoother-script.js" />
        
        {/* Load other scripts after GSAP */}
        <script src="/assets/js/splitting.min.js" defer />
        <script src="/assets/js/isotope.pkgd.min.js" defer />
        <script src="/assets/js/plugins.js" defer />
        <script src="/assets/js/TweenMax.min.js" defer />
        <script src="/assets/js/charming.min.js" defer />
        <script src="/assets/js/countdown.js" defer />
      </Helmet>
      <body>
        <LoadingScreen />
        <Cursor />
        <ProgressScroll />
        <Lines />
        <Navbar />
        <div id="smooth-wrapper" ref={main}>
          <div id="smooth-content">
            <main className="main-bg o-hidden">
              <Header />
              <Intro />
              <Marq />
              <Services />
              <Portfolio />
              <Feat />
              <Team />
              <Testimonials />
              <Clients />
              <Marq2 />
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </>
  );
}
