const IS_LOCAL = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

// Change the 'https://your-backend.onrender.com' to your actual Render backend URL!
export const API_URL = IS_LOCAL 
  ? 'http://localhost:5000' 
  : (process.env.NEXT_PUBLIC_API_URL || 'https://west-chemist-clinic-website.onrender.com');
