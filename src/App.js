import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homepage.js';
import BlogDetails from './pages/blog-details';
import Insights from './pages/insights.js';
import HomeDigitalAgency from './pages/home-digital-agency.js';
import HomeModernStudio from './pages/home-modern-studio.js';
import Page404 from './pages/page-404.js';
import PageAbout from './pages/about.js';
import PageContact from './pages/contact.js';
import PageServices from './pages/services.js';
import PortfolioCreativeCarousel from './pages/works.js';
import ProjectDetails from './pages/project-details.js';
import AdminPanel from './pages/admin';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger);
// gsap.config({ trialWarn: false });

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/home-digital-agency" element={<HomeDigitalAgency />} />
        {/* <Route path="/home-main" element={<HomeMain />} /> */}
        <Route path="/home-modern-studio" element={<HomeModernStudio />} />
        <Route path="/page-404" element={<Page404 />} />
        <Route path="/about" element={<PageAbout />} />
        <Route path="/contact" element={<PageContact />} />
        <Route path="/services" element={<PageServices />} />
        <Route
          path="/works"
          element={<PortfolioCreativeCarousel />}
        />
        <Route path="/project-details" element={<ProjectDetails />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/*        
        {/*
         */}
      </Routes>
    </Router>
  );
}

export default App;
