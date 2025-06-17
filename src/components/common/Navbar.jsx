"use client"
import { useEffect, useState } from "react"
import AnimatedButton from "./Button"

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
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className="icon-bar">
              <i className="fas fa-bars"></i>
            </span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/services">
                  <span className="rolling-text">Services</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/works">
                  <span className="rolling-text">Portfolio</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/insights">
                  <span className="rolling-text">Insights</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  <span className="rolling-text">About Us</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  <span className="rolling-text">Contact Us</span>
                </a>
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
          <a className="mobile-logo" href="#">
            <img src="/assets/imgs/logo-light.png" alt="logo" />
          </a>
          <button className="mobile-menu-close" onClick={toggleMobileMenu} aria-label="Close menu">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mobile-menu-content">
          <ul className="mobile-nav">
            <li>
              <a href="/services" onClick={toggleMobileMenu}>
                SERVICES
              </a>
            </li>
            <li>
              <a href="/portfolio-masonry" onClick={toggleMobileMenu}>
                OUR WORK
              </a>
            </li>
            <li>
              <a href="/about" onClick={toggleMobileMenu}>
                ABOUT US
              </a>
            </li>
            <li>
              <a href="/insights" onClick={toggleMobileMenu}>
                INSIGHTS
              </a>
            </li>
            <li>
              <a href="/contact" onClick={toggleMobileMenu}>
                CONTACT US
              </a>
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
          
          :global(.navbar) {
            padding: 1px 0;
          }
          
          :global(.navbar .container) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 50px;
          }

          :global(.navbar .logo) {
            
            display: flex;
            align-items: center;
            margin: 0 0 0 30px;
            padding: 0;
          }

          :global(.navbar .logo img) {
            padding-top: 10px;
            max-height: 40px;
            width: auto;
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

        .mobile-logo 
          padding-top: 10px;
          width: 100%;
          height: auto;
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

        .mobile-nav a {
          color: #fff;
          text-decoration: none;
          font-size: 42px;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .mobile-nav a:hover {
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
          
          .d-lg-block {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-nav a {
            font-size: 32px;
          }
          
          .mobile-cta :global(.btn) {
            width: 100%;
            padding: 15px 20px;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar;