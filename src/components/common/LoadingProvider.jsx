import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Handle initial page load
    const handleInitialLoad = () => {
      // Add loading class to body
      document.body.classList.add('loading');
      
      // Ensure all stylesheets are loaded
      const styleSheets = Array.from(document.styleSheets);
      const loadedStyles = styleSheets.every(sheet => {
        try {
          return sheet.cssRules.length > 0;
        } catch (e) {
          return false;
        }
      });

      if (loadedStyles) {
        // Remove loading class and show content
        document.body.classList.remove('loading');
        setIsLoading(false);
      }
    };

    // Handle route changes
    const handleRouteChange = () => {
      setIsLoading(true);
      document.body.classList.add('loading');
      
      // Short timeout to ensure smooth transition
      setTimeout(() => {
        document.body.classList.remove('loading');
        setIsLoading(false);
      }, 200);
    };

    // Add preload class to prevent transition flashes
    document.documentElement.classList.add('preload');
    
    // Initial load handling
    if (document.readyState === 'complete') {
      handleInitialLoad();
    } else {
      window.addEventListener('load', handleInitialLoad);
    }

    // Remove preload class after initial load
    setTimeout(() => {
      document.documentElement.classList.remove('preload');
    }, 300);

    // Cleanup
    return () => {
      window.removeEventListener('load', handleInitialLoad);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    handleRouteChange();
  }, [location]);

  return (
    <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s ease' }}>
      {children}
    </div>
  );
}; 