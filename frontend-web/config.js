const IS_DEV = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  : (process.env.NODE_ENV === 'development');

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (IS_DEV ? 'http://localhost:5000' : 'https://west-chemist-clinic-website.onrender.com');

export const getImageUrl = (img) => {
  if (!img || typeof img !== 'string') return '';
  if (img.startsWith('data:')) return img;
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

  // If URL contains uploads path (from Multer upload)
  const uploadsIdx = img.indexOf('uploads/');
  if (uploadsIdx !== -1) {
    const relativeUploadPath = img.substring(uploadsIdx);
    return `${normalizedApi}/${relativeUploadPath}`;
  }

  return img;
};

