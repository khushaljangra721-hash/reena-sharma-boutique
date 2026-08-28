// Dynamic API Base URL helper
// On Render / Localhost -> uses relative '/api'
// On Vercel -> connects directly to the high-availability live Render backend

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `https://reena-sharma-boutique.onrender.com${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
};
