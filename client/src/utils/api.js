// Dynamic API Base URL & Image URL helper
// On Render / Localhost -> uses relative '/api'
// On Vercel -> connects directly to the live Render backend

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `https://reena-sharma-boutique.onrender.com${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
};

export const getImageUrl = (src) => {
  if (!src) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const clean = src.startsWith('/') ? src : `/${src}`;
  return `https://reena-sharma-boutique.onrender.com${clean}`;
};
