import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const RevealLinks = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-20 bg-green-300 min-h-screen flex items-center justify-center relative">
      <div className="text-center">
        <h2 className="text-8xl md:text-9xl font-black uppercase leading-none text-black">
          <FlipLink href="#">Instagram</FlipLink>
          <br />
          <div className="relative inline-block">
            <FlipLink href="#">Behance</FlipLink>
            <Eyes mousePosition={mousePosition} />
            <FlipLink href="#">Facebook</FlipLink>
          </div>
          <br />
          <FlipLink href="#">Linkedin</FlipLink>
        </h2>
      </div>
    </section>
  );
};

const Eyes = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const calculateEyeMovement = (eyeRef: React.RefObject<HTMLDivElement>) => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const deltaX = mousePosition.x - eyeCenterX;
    const deltaY = mousePosition.y - eyeCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(30, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 15);
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const leftEyeRef = React.useRef<HTMLDivElement>(null);
  const rightEyeRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-4 z-10">
      <div ref={leftEyeRef} className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 bg-black rounded-full flex items-center justify-center"
          animate={calculateEyeMovement(leftEyeRef)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      </div>
      
      <div ref={rightEyeRef} className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
        <motion.div 
          className="w-16 h-16 bg-black rounded-full flex items-center justify-center"
          animate={calculateEyeMovement(rightEyeRef)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative inline-block overflow-hidden px-2"
    >
      <div>
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" }
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
              delay: 0.025 * i
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 }
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
              delay: 0.025 * i
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};