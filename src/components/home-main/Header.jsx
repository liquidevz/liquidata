"use client"
import { useEffect } from "react"

import loadBackgroudImages from "../../common/loadBackgroudImages"

function Header() {
  useEffect(() => {
    loadBackgroudImages()
  }, [])

  return (
    <header
      className="main-header bg-img valign"
      data-background="/assets/imgs/background/bg5.jpg"
      data-overlay-dark="7"
      style={{
        background: "#0a0a1a",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "12rem 60px 8rem 60px",
        position: "relative",
      }}
    >
      <div
        className="container ontop"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <div className="row" style={{ margin: 0 }}>
          <div className="col-lg-11" style={{ padding: 0, width: "100%" }}>
            <div
              className="caption"
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr",
                gap: "2rem",
                alignItems: "stretch",
                maxWidth: "1400px",
                margin: "0 auto",
              }}
            >
              {/* Left Content Section with Purple Gradient Background */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  padding: "3rem 2.5rem",
                  color: "white",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "400px",
                  aspectRatio: "16/9",
                  maxWidth: "100%",
                  // Use a solid background as fallback
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                }}
              >
                {/* Background image overlay with proper clipping */}
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    background:
                      "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HaloLAb-2n1awCgam1vSwkhx8AkESxXHMBCcGl.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "24px",
                    zIndex: 1,
                  }}
                />

                {/* Content overlay */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Yellow dot indicator */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-1.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "8px",
                      height: "8px",
                      background: "#fbbf24",
                      borderRadius: "50%",
                    }}
                  ></div>

                  <div>
                    <h1
                      style={{
                        fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                        fontWeight: "800",
                        lineHeight: "1.1",
                        marginBottom: "1.5rem",
                        letterSpacing: "-0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      DESIGN & TECH
                      <br />
                      AGENCY HELPING
                      <br />
                      BRANDS BECOME
                    </h1>

                    <h2
                      style={{
                        fontSize: "clamp(2rem, 4vw, 4.5rem)",
                        fontWeight: "800",
                        color: "#fbbf24",
                        marginBottom: "2rem",
                        letterSpacing: "-0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      TOP 1%
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                      >
                        🔥
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
                            opacity: 0.9,
                            margin: 0,
                            lineHeight: "1.4",
                            fontWeight: "400",
                          }}
                        >
                          12 years of design-driven
                          <br />
                          development for B2B products
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexShrink: 0,
                        width: "auto",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background: "#ffffff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1a1a2e",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        ⚡
                      </div>
                      <button
                        style={{
                          background: "#fbbf24",
                          color: "#1a1a2e",
                          border: "none",
                          padding: "14px 28px",
                          borderRadius: "25px",
                          fontWeight: "700",
                          fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#f59e0b"
                          e.target.style.transform = "translateY(-2px)"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#fbbf24"
                          e.target.style.transform = "translateY(0)"
                        }}
                      >
                        BOOK A CALL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Interface Section */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "24px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "400px",
                  padding: "1.5rem",
                  aspectRatio: "3/4",
                }}
              >
                {/* Header with close button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "#1f2937",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "#10b981",
                        borderRadius: "50%",
                      }}
                    ></div>
                    AGRINEX
                    <div style={{ fontSize: "16px", marginLeft: "auto" }}>☰</div>
                  </div>
                </div>

                {/* Plot info */}
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>Plot of land is AESS</p>
                </div>

                {/* Soil analysis section */}
                <div
                  style={{
                    background: "#d4a574",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    position: "relative",
                    minHeight: "120px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#ef4444",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    CRITICAL
                  </div>
                  <p style={{ fontSize: "12px", color: "#8b5a2b", margin: "0 0 8px 0", fontWeight: "600" }}>
                    Soil analysis
                  </p>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      width: "40px",
                      height: "40px",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "8px solid #d4a574",
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        marginLeft: "2px",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Nutrients section */}
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", margin: "0 0 12px 0" }}>
                    Nutrients level
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { name: "Magn.", value: "58%", color: "#10b981" },
                      { name: "Acidity", value: "68-75", color: "#3b82f6" },
                      { name: "Phosphorus", value: "240-430", color: "#8b5cf6" },
                      { name: "Potassium", value: "70-280", color: "#10b981" },
                      { name: "Organic carbon", value: "68-75", color: "#ef4444" },
                    ].map((nutrient, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "11px",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            background: nutrient.color,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {nutrient.name.charAt(0)}
                        </div>
                        <span style={{ color: "#374151", fontWeight: "500", flex: 1 }}>{nutrient.name}</span>
                        <span style={{ color: "#6b7280" }}>{nutrient.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soil moisture levels */}
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                    Soil moisture levels
                  </h4>
                  <div
                    style={{
                      background: "#1f2937",
                      borderRadius: "8px",
                      padding: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "white", fontSize: "10px" }}>20-30%</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: "4px",
                            height: "16px",
                            background: i <= 3 ? "#10b981" : "#374151",
                            borderRadius: "2px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video overlay for actual video */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "24px",
                    zIndex: 1,
                    opacity: 0, // Hidden by default, will show when video loads
                  }}
                >
                  <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  /* Account for fixed navbar */
  header {
    padding-top: 120px !important;
  }

  /* Desktop - maintain exact original design */
  @media (min-width: 1025px) {
    .caption {
      grid-template-columns: 1.8fr 1fr !important;
      gap: 2rem !important;
    }
  }

  /* Tablet and Mobile - stack vertically with proper heights */
  @media (max-width: 1024px) {
    header {
      padding: 8rem 20px 4rem 20px !important;
      min-height: auto !important;
    }
    
    .container {
      padding: 0 1rem !important;
    }
    
    .caption {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      max-width: 600px !important;
      margin: 0 auto !important;
    }
    
    .caption > div:first-child {
      aspect-ratio: unset !important;
      padding: 2.5rem 2rem !important;
      min-height: 450px !important;
      height: auto !important;
      width: 100% !important;
    }
    
    .caption > div:last-child {
      aspect-ratio: unset !important;
      min-height: 500px !important;
      height: auto !important;
      padding: 1.5rem !important;
      width: 100% !important;
    }
  }
  
  /* Mobile Portrait */
  @media (max-width: 768px) {
    header {
      padding: 7rem 15px 3rem 15px !important;
    }

    header {
      padding-top: 100px !important;
    }
    
    .caption {
      gap: 1.2rem !important;
      max-width: 500px !important;
    }
    
    .caption > div:first-child {
      padding: 2rem 1.5rem !important;
      min-height: 420px !important;
    }
    
    .caption > div:first-child > div:last-child {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1.5rem !important;
    }
    
    .caption > div:last-child {
      padding: 1.3rem !important;
      min-height: 480px !important;
    }
  }
  
  /* Small Mobile */
  @media (max-width: 480px) {
    header {
      padding: 6rem 10px 2.5rem 10px !important;
    }

    header {
      padding-top: 90px !important;
    }
    
    .caption {
      max-width: 400px !important;
      gap: 1rem !important;
    }
    
    .caption > div:first-child {
      padding: 1.8rem 1.2rem !important;
      min-height: 400px !important;
    }
    
    .caption > div:last-child {
      padding: 1.2rem !important;
      min-height: 450px !important;
    }
  }
  
  /* Extra Small Mobile */
  @media (max-width: 360px) {
    header {
      padding: 5.5rem 10px 2rem 10px !important;
    }
    .caption {
      max-width: 340px !important;
    }
    
    .caption > div:first-child {
      padding: 1.5rem 1rem !important;
      min-height: 380px !important;
    }
    
    .caption > div:last-child {
      padding: 1rem !important;
      min-height: 420px !important;
    }
  }

/* Force perfect border radius on purple card */
.caption > div:first-child {
  border-radius: 24px !important;
  overflow: hidden !important;
  position: relative !important;
}

.caption > div:first-child > div:first-child {
  border-radius: 24px !important;
}

/* Ensure all corners are perfectly rounded */
@supports (border-radius: 24px) {
  .caption > div:first-child,
  .caption > div:first-child > div:first-child {
    border-top-left-radius: 24px !important;
    border-top-right-radius: 24px !important;
    border-bottom-left-radius: 24px !important;
    border-bottom-right-radius: 24px !important;
  }
}
`}</style>
    </header>
  )
}

export default Header
