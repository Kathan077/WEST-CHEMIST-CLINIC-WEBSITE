const IS_DEV = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  : (process.env.NODE_ENV === 'development');

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (IS_DEV ? 'http://localhost:5000' : 'https://west-chemist-clinic-website.onrender.com');

export const getImageUrl = (img) => {
  if (!img) return '';
  if (typeof img !== 'string') return '';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  if (img.startsWith('/uploads') || img.startsWith('uploads')) {
    const normalizedPath = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${normalizedPath}`;
  }
  return img;
};


