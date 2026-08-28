// Unified API Base URL & Image URL helper
// All requests route cleanly via local /api (serverless on Vercel & Express on local/production)

export const getApiUrl = (endpoint) => {
  if (!endpoint) return '/api';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return cleanEndpoint;
};

export const getImageUrl = (src) => {
  if (!src) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const clean = src.startsWith('/') ? src : `/${src}`;
  return clean;
};
