"use client"
import { useEffect } from "react"
import AnimatedButton from "../common/Button"
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
        padding: "clamp(5rem, 8vh + 2rem, 12rem) clamp(0.8rem, 3vw + 0.5rem, 60px) clamp(1.5rem, 6vh, 8rem)",
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
          padding: "0 clamp(0.8rem, 2.5vw, 2rem)",
          width: "100%",
        }}
      >
        <div className="row" style={{ margin: 0 }}>
          <div className="col-lg-11" style={{ padding: 0, width: "100%" }}>
            <div
              className="caption"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                gap: "clamp(0.8rem, 2.5vw, 2rem)",
                alignItems: "stretch",
                maxWidth: "1400px",
                margin: "0 auto",
              }}
            >
              {/* Left Content Section with Purple Gradient Background */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  padding: "clamp(1.5rem, 4vw + 0.5rem, 3rem) clamp(1.2rem, 3.5vw, 2.5rem)",
                  color: "white",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "clamp(350px, 50vh, 500px)",
                  aspectRatio: "16/10",
                  maxWidth: "100%",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                  gridColumn: "1 / -1",
                }}
                className="hero-card"
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
                    borderRadius: "clamp(16px, 3vw, 24px)",
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
                      top: "clamp(-0.8rem, -1.5vw, -1.5rem)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "clamp(5px, 1.2vw + 1px, 8px)",
                      height: "clamp(5px, 1.2vw + 1px, 8px)",
                      background: "#fbbf24",
                      borderRadius: "50%",
                    }}
                  ></div>

                  <div>
                    <h1
                      style={{
                        fontSize: "clamp(1.2rem, 4.5vw + 0.5rem, 4.5rem)",
                        fontWeight: "800",
                        lineHeight: "clamp(1.05, 0.95 + 0.1vw, 1.1)",
                        marginBottom: "clamp(0.8rem, 2.5vw, 1.5rem)",
                        letterSpacing: "clamp(-0.01em, -0.02em, -0.02em)",
                        textTransform: "uppercase",
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      <span style={{ display: "block" }}>DESIGN & TECH</span>
                      <span style={{ display: "block" }}>AGENCY HELPING</span>
                      <span style={{ display: "block" }}>BRANDS BECOME</span>
                    </h1>

                    <h2
                      style={{
                        fontSize: "clamp(1.2rem, 4vw + 0.5rem, 4.5rem)",
                        fontWeight: "800",
                        color: "#fbbf24",
                        marginBottom: "clamp(1rem, 3vw, 2rem)",
                        letterSpacing: "clamp(-0.01em, -0.02em, -0.02em)",
                        textTransform: "uppercase",
                        lineHeight: "1",
                      }}
                    >
                      TOP 1%
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "clamp(0.8rem, 2.5vw, 1.5rem)",
                    }}
                    className="bottom-content"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.6rem, 1.8vw, 1rem)",
                        flex: "1 1 auto",
                        minWidth: "clamp(180px, 40vw, 220px)",
                      }}
                    >
                      <div
                        style={{
                          width: "clamp(36px, 6vw + 8px, 48px)",
                          height: "clamp(36px, 6vw + 8px, 48px)",
                          background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "clamp(16px, 3vw + 4px, 24px)",
                          flexShrink: 0,
                        }}
                      >
                        🔥
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "clamp(0.75rem, 1.5vw + 0.2rem, 1rem)",
                            opacity: 0.9,
                            margin: 0,
                            lineHeight: "clamp(1.3, 1.2 + 0.2vw, 1.5)",
                            fontWeight: "400",
                            maxWidth: "200px",
                          }}
                        >
                          <span style={{ display: "block" }}>12 years of design-driven</span>
                          <span style={{ display: "block" }}>development for B2B products</span>
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(0.6rem, 1.8vw, 1rem)",
                        flexShrink: 0,
                        width: "auto",
                      }}
                      className="cta-section"
                    >
                      <div
                        style={{
                          width: "clamp(36px, 6vw + 8px, 48px)",
                          height: "clamp(36px, 6vw + 8px, 48px)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1a1a2e",
                          fontWeight: "bold",
                          fontSize: "clamp(14px, 2.5vw + 4px, 20px)",
                        }}
                      >
                        ⚡
                      </div>
                      <AnimatedButton
                        text="BOOK A CALL"
                        style={{
                          color: "#1a1a2e",
                          fontSize: "clamp(0.7rem, 1.5vw + 0.2rem, 1rem)",
                          padding: "clamp(0.4rem, 1.5vw, 0.75rem) clamp(0.8rem, 2.5vw, 1.5rem)",
                          fontWeight: "600",
                          letterSpacing: "0.025em",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Interface Section */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "clamp(16px, 3vw, 24px)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "clamp(300px, 40vh, 500px)",
                  padding: "clamp(0.8rem, 2.5vw, 1.5rem)",
                  aspectRatio: "4/5",
                  gridColumn: "1 / -1",
                }}
                className="video-card"
              >
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
                    borderRadius: "clamp(16px, 3vw, 24px)",
                    zIndex: 1,
                    opacity: 1,
                  }}
                >
                  <source
                    src="https://elasticbeanstalk-ap-south-1-954976323838.s3.ap-south-1.amazonaws.com/varun/1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Base responsive styles */
        header {
          padding-top: clamp(90px, 15vh, 120px) !important;
        }

/* Large Desktop and above - maintain original two-column layout */
@media (min-width: 1025px) {
  .caption {
    grid-template-columns: 1.8fr 1fr !important;
    gap: 2rem !important;
  }
  
  .hero-card {
    grid-column: 1 !important;
    aspect-ratio: 4/3 !important;
  }
  
  .video-card {
    grid-column: 2 !important;
    aspect-ratio: 3/4 !important;
  }
}

/* Below 1025px - Single column stacked layout as shown in image */
@media (max-width: 1024px) {
  header {
    padding: clamp(6rem, 8vh, 9rem) clamp(1rem, 3vw, 2.5rem) clamp(3rem, 5vh, 4rem) !important;
    min-height: auto !important;
  }
  
  .caption {
    grid-template-columns: 1fr !important;
    gap: clamp(1.2rem, 3vw, 2rem) !important;
    max-width: 800px !important;
  }
  
  .hero-card {
    grid-column: 1 / -1 !important;
    aspect-ratio: 16/9 !important;
    min-height: clamp(400px, 50vh, 500px) !important;
    padding: clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem) !important;
  }
  
  .video-card {
    grid-column: 1 / -1 !important;
    aspect-ratio: 16/10 !important;
    min-height: clamp(350px, 40vh, 450px) !important;
  }
  
  /* Keep bottom content horizontal on larger tablets */
  .bottom-content {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: clamp(1rem, 2.5vw, 1.5rem) !important;
  }
}

/* Tablet Portrait - adjust spacing and sizing */
@media (max-width: 768px) {
  header {
    padding: clamp(5.5rem, 7vh, 8rem) clamp(1rem, 3vw, 2rem) clamp(2.5rem, 4vh, 3.5rem) !important;
  }
  
  .caption {
    max-width: 600px !important;
    gap: 1.5rem !important;
  }
  
  .hero-card {
    aspect-ratio: 16/10 !important;
    min-height: clamp(380px, 45vh, 450px) !important;
    padding: clamp(1.8rem, 3.5vw, 2.5rem) clamp(1.3rem, 2.5vw, 2rem) !important;
  }
  
  .video-card {
    aspect-ratio: 16/11 !important;
    min-height: clamp(320px, 35vh, 400px) !important;
  }
  
  /* Stack bottom content vertically on smaller tablets */
  .bottom-content {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 1.5rem !important;
  }
  
  .cta-section {
    align-self: stretch !important;
    justify-content: center !important;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  header {
    padding: clamp(5rem, 7vh, 7rem) clamp(0.8rem, 3vw, 1.5rem) clamp(2rem, 3vh, 3rem) !important;
  }
  
  .caption {
    max-width: 100% !important;
    gap: 1.2rem !important;
    padding: 0 0.5rem !important;
  }
  
  .hero-card {
    aspect-ratio: 1/1 !important;
    min-height: clamp(350px, 40vh, 420px) !important;
    padding: clamp(1.5rem, 4vw, 2rem) !important;
  }
  
  .video-card {
    aspect-ratio: 1/1 !important;
    min-height: clamp(300px, 35vh, 380px) !important;
  }
  
  .bottom-content {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 1.3rem !important;
  }
  
  .cta-section {
    align-self: stretch !important;
    justify-content: center !important;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  header {
    padding: clamp(4.5rem, 6vh, 6rem) 0.6rem clamp(1.5rem, 2.5vh, 2.5rem) !important;
  }
  
  .caption {
    gap: 1rem !important;
  }
  
  .hero-card {
    min-height: clamp(320px, 38vh, 380px) !important;
    padding: 1.3rem 1rem !important;
  }
  
  .video-card {
    min-height: clamp(280px, 32vh, 340px) !important;
    padding: 1rem !important;
  }
}

/* Ensure perfect border radius across all devices */
.hero-card,
.video-card,
.hero-card > div:first-child {
  border-radius: clamp(16px, 3vw, 24px) !important;
  overflow: hidden !important;
}

/* Smooth transitions for responsive changes */
.caption,
.hero-card,
.video-card,
.bottom-content {
  transition: all 0.3s ease-in-out;
}

/* Optimize text rendering on all devices */
h1, h2, p {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure proper touch targets on mobile */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}
      `}</style>
    </header>
  )
}

export default Header
