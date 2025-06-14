import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  // Services
  getServices: () => axiosInstance.get('/content/services').catch(() => ({ data: [] })),
  createService: (data) => axiosInstance.post('/content/services', data),
  updateService: (id, data) => axiosInstance.put(`/content/services/${id}`, data),
  deleteService: (id) => axiosInstance.delete(`/content/services/${id}`),

  // Portfolio
  getPortfolio: () => axiosInstance.get('/content/portfolio').catch(() => ({ data: [] })),
  createPortfolioItem: (data) => axiosInstance.post('/content/portfolio', data),
  updatePortfolioItem: (id, data) => axiosInstance.put(`/content/portfolio/${id}`, data),
  deletePortfolioItem: (id) => axiosInstance.delete(`/content/portfolio/${id}`),

  // Team
  getTeam: () => axiosInstance.get('/content/team').catch(() => ({ data: [] })),
  createTeamMember: (data) => axiosInstance.post('/content/team', data),
  updateTeamMember: (id, data) => axiosInstance.put(`/content/team/${id}`, data),
  deleteTeamMember: (id) => axiosInstance.delete(`/content/team/${id}`),

  // Testimonials
  getTestimonials: () => axiosInstance.get('/content/testimonials').catch(() => ({ data: [] })),
  createTestimonial: (data) => axiosInstance.post('/content/testimonials', data),
  updateTestimonial: (id, data) => axiosInstance.put(`/content/testimonials/${id}`, data),
  deleteTestimonial: (id) => axiosInstance.delete(`/content/testimonials/${id}`),
}; 