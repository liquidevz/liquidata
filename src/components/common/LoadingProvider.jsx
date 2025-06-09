import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleInitialLoad = async () => {
      // Add loading class to body
      document.body.classList.add('loading');
      
      // Function to check if a stylesheet is loaded
      const isStylesheetLoaded = (link) => {
        return new Promise((resolve) => {
          if (!link || link.tagName !== 'LINK') resolve(true);
          if (link.sheet) resolve(true);
          
          link.onload = () => resolve(true);
          link.onerror = () => resolve(false);
        });
      };

      // Wait for critical stylesheets to load
      const criticalStylesheets = [
        document.querySelector('link[href*="plugins.css"]'),
        document.querySelector('link[href*="style.css"]'),
        document.querySelector('link[href*="Poppins"]'),
        document.querySelector('link[href*="Plus+Jakarta+Sans"]')
      ];

      try {
        await Promise.all(criticalStylesheets.map(isStylesheetLoaded));
        
        // Short delay to ensure styles are applied
        setTimeout(() => {
          document.body.classList.remove('loading');
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error loading stylesheets:', error);
        // Remove loading state even if there's an error
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
    const handleRouteChange = () => {
      setIsLoading(true);
      document.body.classList.add('loading');
      
      setTimeout(() => {
        document.body.classList.remove('loading');
        setIsLoading(false);
      }, 200);
    };

    handleRouteChange();
  }, [location]);

  return (
    <>
      {isLoading && (
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      )}
      {children}
    </>
  );
}; 