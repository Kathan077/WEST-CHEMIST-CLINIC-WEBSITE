const IS_DEV = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  : (process.env.NODE_ENV === 'development');

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (IS_DEV ? 'http://localhost:5000' : 'https://west-chemist-clinic-website.onrender.com');

