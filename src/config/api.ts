/**
 * API Configuration
 * Centralized configuration for all API calls
 */

// Get API URL from environment variable, fallback to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  admin: {
    login: '/api/admin/login',
    calculator: '/api/admin/calculator',
    pricing: '/api/admin/pricing',
    analytics: '/api/admin/calculator/analytics',
  },
  
  // Calculator endpoints
  calculator: {
    config: '/api/calculator',
    calculate: '/api/calculator/calculate',
    steps: '/api/calculator/steps',
  },
  
  // Contact endpoints
  contact: {
    form: '/api/contact-form',
    submissions: '/api/contact-submissions',
  },
  
  // Calculator submissions
  calculatorSubmissions: '/api/calculator-submissions',
  
  // Component management (if you have these endpoints)
  components: '/api/components',
  pages: '/api/pages',
  
  // Health check
  health: '/health',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Fetch wrapper with default configuration
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

// Helper for GET requests
export const apiGet = async (endpoint: string): Promise<any> => {
  const response = await apiRequest(endpoint);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};

// Helper for POST requests
export const apiPost = async (endpoint: string, data: any): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};

// Helper for PUT requests
export const apiPut = async (endpoint: string, data: any): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};

// Helper for DELETE requests
export const apiDelete = async (endpoint: string): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};

// SWR fetcher function
export const fetcher = (url: string) => apiGet(url);

const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  fetcher,
};

export default apiConfig;
