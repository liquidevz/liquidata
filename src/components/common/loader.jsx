'use client';
import React, { useEffect } from 'react';
import gsap from 'gsap';

function LoadingScreen() {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to('.loading-screen', {
      duration: 1,
      opacity: 0,
      display: 'none',
      ease: 'power4.out'
    });
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
