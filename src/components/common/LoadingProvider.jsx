import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const LoadingContext = createContext({
  isLoading: true,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Handle initial page load
  useEffect(() => {
    // Simple timeout for initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second maximum loading time

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  useEffect(() => {
    if (!isLoading) { // Only handle route changes after initial load
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Short timeout for route changes
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div style={{ 
        opacity: isLoading ? 0 : 1,
        visibility: isLoading ? 'hidden' : 'visible',
        transition: 'opacity 0.3s ease-in-out',
        minHeight: '100vh'
      }}>
        {children}
      </div>
      {isLoading && <LoadingSpinner />}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider; 