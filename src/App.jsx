import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './components/common/LoadingProvider';

// Import your components
// ... other imports ...

function App() {
  return (
    <Router>
      <LoadingProvider>
        <Routes>
          {/* Your routes */}
        </Routes>
      </LoadingProvider>
    </Router>
  );
}

export default App; 