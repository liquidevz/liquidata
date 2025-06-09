import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleInitialLoad = () => {
      // Function to check if a stylesheet is loaded
      const isStylesheetLoaded = (link) => {
        try {
          return link.sheet !== null;
        } catch (e) {
          return false;
        }
      };

      // Check if all stylesheets are loaded
      const checkStylesheets = () => {
        const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
        return Array.from(styleLinks).every(isStylesheetLoaded);
      };

      // Function to check loading status
      const checkLoading = () => {
        if (checkStylesheets()) {
          setIsLoading(false);
        } else {
          setTimeout(checkLoading, 100);
        }
      };

      // Start checking
      checkLoading();
    };

    // Handle route changes
    const handleRouteChange = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Initial load
    if (document.readyState === 'complete') {
      handleInitialLoad();
    } else {
      window.addEventListener('load', handleInitialLoad);
    }

    return () => {
      window.removeEventListener('load', handleInitialLoad);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    handleRouteChange();
  }, [location]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return children;
}; 