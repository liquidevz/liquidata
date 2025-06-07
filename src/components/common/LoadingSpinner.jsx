import React from 'react';

const LoadingSpinner = () => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    },
    logo: {
      width: '150px',
      height: 'auto',
      animation: 'pulse 2s infinite',
    },
    spinner: {
      width: '30px',
      height: '30px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #333333',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.spinnerContainer}>
        <img 
          src="/assets/imgs/logo-dark.png" 
          alt="LiquiData Logo" 
          style={styles.logo}
        />
        <div style={styles.spinner} />
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 