// Centralized API Base URL configuration
// Dynamically resolves to VITE_API_URL, or relative origin in production, or http://localhost:5000 in local dev

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? '' 
    : 'http://localhost:5000');
