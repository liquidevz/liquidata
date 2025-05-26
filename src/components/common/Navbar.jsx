"use client"
import { useEffect, useState } from "react"

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
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  function handleDropdownMouseMove(event) {
    event.currentTarget.querySelector(".dropdown-menu")?.classList.add("show")
  }

  function handleDropdownMouseLeave(event) {
    event.currentTarget.querySelector(".dropdown-menu")?.classList.remove("show")
  }

  function handleToggleNav() {
    if (document.querySelector(".navbar .navbar-collapse")?.classList.contains("show")) {
      document.querySelector(".navbar .navbar-collapse")?.classList.remove("show")
    } else if (!document.querySelector(".navbar .navbar-collapse")?.classList.contains("show")) {
      document.querySelector(".navbar .navbar-collapse")?.classList.add("show")
    }
  }

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
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleMobileMenu}
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

          <div className="contact-button">
            <a href="/contact" className="butn butn-sm butn-bg main-colorbg radius-5">
              <span className="text">Let&apos;s contact</span>
            </a>
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
              <a href="/portfolio-masonry" className="active" onClick={toggleMobileMenu}>
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
        /* Mobile Menu Overlay Styles */
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
          position: relative;
        }

        .mobile-logo {
          display: inline-block;
          max-width: 100px;
        }

        .mobile-logo img {
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
          transition: opacity 0.3s ease;
        }

        .mobile-menu-close:hover {
          opacity: 0.7;
        }

        .mobile-menu-content {
          padding: 20px 30px 30px;
          height: calc(100% - 80px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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

        .mobile-nav li:nth-child(1) {
          animation-delay: 0.1s;
        }
        .mobile-nav li:nth-child(2) {
          animation-delay: 0.2s;
        }
        .mobile-nav li:nth-child(3) {
          animation-delay: 0.3s;
        }
        .mobile-nav li:nth-child(4) {
          animation-delay: 0.4s;
        }
        .mobile-nav li:nth-child(5) {
          animation-delay: 0.5s;
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
          letter-spacing: -1px;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .mobile-nav a.active,
        .mobile-nav a:hover {
          color: #c9fd02;
        }

        .mobile-nav a::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 3px;
          background-color: #c9fd02;
          transition: width 0.3s ease;
        }

        .mobile-nav a:hover::after {
          width: 100%;
        }

        .mobile-menu-footer {
          margin-top: auto;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links {
          margin-bottom: 30px;
        }

        .social-label {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
          display: block;
        }

        .social-links a {
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          display: block;
          margin-bottom: 10px;
          transition: color 0.3s ease;
          text-decoration: underline;
        }

        .social-links a:hover {
          color: #c9fd02;
        }

        /* Smooth animation for menu items when closing */
        .mobile-menu-overlay:not(.active) .mobile-nav li {
          animation: fadeOutUp 0.3s ease forwards;
        }

        @keyframes fadeOutUp {
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        /* Adjust navbar toggler for mobile */
        @media (max-width: 991px) {
          .navbar-collapse {
            display: none !important;
          }

          .contact-button {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar
