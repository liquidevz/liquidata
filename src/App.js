import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingProvider from './components/common/LoadingProvider';
import Home from './pages/homepage';
import About from './pages/about';
import Contact from './pages/contact';
import PortfolioCreativeCarousel from './pages/works.js';
import Blog from './pages/blog';
import BlogDetails from './pages/blog-details';
import HomeModernStudio from './pages/home-modern-studio';
import HomeDigitalAgency from './pages/home-digital-agency';
import Page404 from './pages/page-404.js';
import PageServices from './pages/services.js';
import ProjectDetails from './pages/project-details.js';
import AdminPanel from './pages/admin';

function App() {
  return (
    <Router>
      <LoadingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio-creative" element={<PortfolioCreativeCarousel />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-details" element={<BlogDetails />} />
          <Route path="/home-modern-studio" element={<HomeModernStudio />} />
          <Route path="/home-digital-agency" element={<HomeDigitalAgency />} />
          <Route path="/page-404" element={<Page404 />} />
          <Route path="/services" element={<PageServices />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </LoadingProvider>
    </Router>
  );
}

export default App;
