const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isLocalhost ? 'http://localhost:9090' : '');

export const STORAGE_KEYS = {
  TOKEN: 'jewellery_token',
  USER: 'jewellery_user',
  REMEMBER_EMAIL: 'jewellery_remember_email',
};

export const THEME = {
  gold: '#D4AF37',
  black: '#121212',
  white: '#FFFFFF',
  cream: '#F5F0E8',
};
