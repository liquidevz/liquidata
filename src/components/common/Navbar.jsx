"use client"
import { useEffect, useState } from "react"
import AnimatedButton from "./Button"
import { Link } from "react-router-dom"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleScroll() {
    const bodyScroll = window.scrollY
    const navbar = document.querySelector(".navbar")
    if (bodyScroll > 300) navbar?.classList.add("nav-scroll")
    else navbar?.classList.remove("nav-scroll")
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  function toggleMobileMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bord blur">
        <div className="container o-hidden">
          <a className="logo icon-img-100" href="/">
            <img src="/assets/imgs/logo-light.png" alt="logo" />
          </a>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation"
            aria-expanded={isMenuOpen}
          >
            <div className="hamburger-box">
              <div className="hamburger-inner"></div>
            </div>
          </button>

          <div className={`collapse navbar-collapse justify-content-center ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/services" className="nav-link">
                  <span className="rolling-text">Services</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/works" className="nav-link">
                  <span className="rolling-text">Portfolio</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/insights" className="nav-link">
                  <span className="rolling-text">Insights</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  <span className="rolling-text">About Us</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  <span className="rolling-text">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop-only button */}
          <div className="d-none d-lg-block">
            <AnimatedButton text="BOOK A CALL" href="/contact" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <Link className="mobile-logo" to="/">
            <img src="/assets/imgs/logo-light.png" alt="logo" />
          </Link>
          <button className="mobile-menu-close" onClick={toggleMobileMenu} aria-label="Close menu">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mobile-menu-content">
          <ul className="mobile-nav">
            <li>
              <Link to="/services" className="mobile-nav-link" onClick={toggleMobileMenu}>
                SERVICES
              </Link>
            </li>
            <li>
              <Link to="/works" className="mobile-nav-link" onClick={toggleMobileMenu}>
                OUR WORK
              </Link>
            </li>
            <li>
              <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
                ABOUT US
              </Link>
            </li>
            <li>
              <Link to="/insights" className="mobile-nav-link" onClick={toggleMobileMenu}>
                INSIGHTS
              </Link>
            </li>
            <li>
              <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
                CONTACT US
              </Link>
            </li>
          </ul>

          {/* Mobile CTA Button */}
          <div className="mobile-cta">
            <AnimatedButton 
              text="BOOK A CALL" 
              href="/contact" 
              onClick={toggleMobileMenu}
              fullWidth
            />
          </div>

          <div className="mobile-menu-footer">
            <div className="social-links">
              <span className="social-label">S:</span>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Behance
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #1a1a1a;
          z-index: 9999;
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
          overflow: hidden;
          display: none;
        }

        @media (max-width: 991px) {
          .mobile-menu-overlay {
            display: block;
          }
        }

        .mobile-menu-overlay.active {
          transform: translateY(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
        }

        .mobile-logo {
          max-width: 100px;
        }

        .mobile-logo img {
          width: 100%;
          height: auto;
        }

        .custom-toggler {
          padding: 15px;
          border: none;
          background: transparent;
          outline: none !important;
          cursor: pointer;
          margin-right: 0;
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hamburger-box {
          width: 30px;
          height: 24px;
          position: relative;
          display: inline-block;
        }

        .hamburger-inner {
          width: 100%;
          height: 2px;
          background-color: #fff;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          transition: background-color 0.2s ease-in-out;
        }

        .hamburger-inner::before,
        .hamburger-inner::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background-color: #fff;
          position: absolute;
          left: 0;
          transition: transform 0.2s ease-in-out;
        }

        .hamburger-inner::before {
          top: -8px;
        }

        .hamburger-inner::after {
          bottom: -8px;
        }

        .custom-toggler[aria-expanded="true"] .hamburger-inner {
          background-color: transparent;
        }

        .custom-toggler[aria-expanded="true"] .hamburger-inner::before {
          transform: translateY(8px) rotate(45deg);
        }

        .custom-toggler[aria-expanded="true"] .hamburger-inner::after {
          transform: translateY(-8px) rotate(-45deg);
        }

        .mobile-menu-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 28px;
          cursor: pointer;
          padding: 10px;
        }

        .mobile-menu-content {
          padding: 20px 30px 30px;
          height: calc(100% - 80px);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .mobile-nav {
          list-style: none;
          padding: 0;
          margin: 0 0 auto 0;
        }

        .mobile-nav li {
          margin-bottom: 25px;
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInDown 0.5s ease forwards;
        }

        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-nav-link {
          color: #fff;
          text-decoration: none;
          font-size: 42px;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .mobile-nav-link:hover {
          color: #c9fd02;
        }

        .mobile-cta {
          padding: 30px 0;
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-footer {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links a {
          color: #fff;
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            display: none !important;
          }

          .navbar-collapse.show {
            display: block !important;
          }

          .d-lg-block {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-nav-link {
            font-size: 32px;
          }

          .mobile-cta :global(.btn) {
            width: 100%;
            padding: 15px 20px;
          }
        }

        .logo {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .logo img {
          max-height: 40px;
          width: auto;
          object-fit: contain;
        }

        @media (max-width: 991px) {
          .logo img {
            max-height: 35px;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar;