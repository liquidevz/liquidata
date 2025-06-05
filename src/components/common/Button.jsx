import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function AnimatedButton({ text, onClick, style, href }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      navigate(href);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const ButtonTag = href ? 'a' : 'button';

  return (
    <ButtonTag
      href={href}
      onClick={handleClick}
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
        position: "relative",
        overflow: "hidden",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#fbbf24";
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#fbbf24";
        setIsHovered(false);
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "1.2em",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "translateY(-100%)" : "translateY(0)",
            lineHeight: "1.2",
          }}
        >
          {text}
        </span>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            display: "block",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered
              ? "translate(-50%, -50%)"
              : "translate(-50%, 50%)",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </ButtonTag>
  );
}
