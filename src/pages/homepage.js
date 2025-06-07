import React from 'react';
import Navbar from '../components/common/Navbar';
import Header from '../components/home-main/Header';
import About from '../components/home-main/About';
import Services from '../components/home-main/Services';
import Portfolio from '../components/home-main/Portfolio';
import Testimonials from '../components/home-main/Testimonials';
import Blog from '../components/home-main/Blog';
import Contact from '../components/home-main/Contact';
import Footer from '../components/common/Footer';

function Homepage() {
  return (
    <>
      <Navbar />
      <Header />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
}

export default Homepage;
