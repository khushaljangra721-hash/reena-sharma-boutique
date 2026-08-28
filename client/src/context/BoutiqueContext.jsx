import React, { createContext, useContext, useState, useEffect } from 'react';

const BoutiqueContext = createContext(null);

export const BoutiqueProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    boutiqueName: 'Reena Sharma Boutique',
    tagline: 'Modern Designs. Elegant Styles. Made for You.',
    subTagline: 'Destination for latest dress designs, stylish outfits, cutting & stitching ideas and custom fashion in Mahendragarh, Haryana.',
    logoUrl: '/logo-icon.svg',
    whatsappNumber: '919467830763',
    phoneNumber: '+91 94678 30763',
    email: 'info@reenasharmaboutique.com',
    location: 'Mahendragarh, Haryana 123029, India',
    fullAddress: '748Q+R37, Mahendergarh - Budeen Rd, Mohlla Khatikan, Mahendragarh, Haryana 123029',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=748Q%2BR37,+Mahendergarh+-+Budeen+Rd,+Mohlla+Khatikan,+Mahendragarh,+Haryana+123029&t=&z=16&ie=UTF8&iwloc=&output=embed',
    youtubeUrl: 'https://www.youtube.com/@Rehan09-wtr',
    youtubeHandle: '@Rehan09-wtr',
    instagramUrl: 'https://www.instagram.com/reenasharma_boutique',
    facebookUrl: 'https://www.facebook.com/reenasharmaboutique',
    storeTimings: 'सोमवार – शनिवार: 10:00 AM – 8:30 PM | रविवार: अपॉइंटमेंट अनुसार',
    announcementText: '🌸 राम राम जी! रीना शर्मा बुटीक महेंद्रगढ़ • ऑर्डर व सिलाई के लिए WhatsApp करें 🌸',
    aboutStory: '',
    currencySymbol: '₹',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('rsb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer Authentication state
  const [customer, setCustomer] = useState(null);
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('rsb_customer_token') || null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  // Modal states
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch settings & categories
  const loadInitialData = async () => {
    try {
      const [settingsRes, catRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()).catch(() => ({ settings: {} })),
        fetch('/api/categories').then((r) => r.json()).catch(() => ({ categories: [] })),
      ]);

      if (settingsRes.success && settingsRes.settings) {
        setSettings((prev) => ({ ...prev, ...settingsRes.settings }));
      }
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.error('Error loading boutique data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged in customer profile
  const fetchCustomerProfile = async (token) => {
    if (!token) {
      setCustomer(null);
      setCustomerOrders([]);
      return;
    }
    try {
      const res = await fetch('/api/customer/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setCustomerOrders(data.enquiries || []);
      } else {
        // Token invalid or expired
        localStorage.removeItem('rsb_customer_token');
        setCustomerToken(null);
        setCustomer(null);
      }
    } catch (err) {
      console.error('Error fetching customer profile:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (customerToken) {
      fetchCustomerProfile(customerToken);
    } else {
      setCustomer(null);
    }
  }, [customerToken]);

  // Customer Login
  const customerLogin = async (identifier, password) => {
    const res = await fetch('/api/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('rsb_customer_token', data.token);
      setCustomerToken(data.token);
      setCustomer(data.customer);
      setAuthModalOpen(false);
      return { success: true, message: data.message, customer: data.customer };
    }
    return { success: false, message: data.message || 'Login failed' };
  };

  // Customer Register
  const customerRegister = async (formData) => {
    const res = await fetch('/api/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('rsb_customer_token', data.token);
      setCustomerToken(data.token);
      setCustomer(data.customer);
      setAuthModalOpen(false);
      return { success: true, message: data.message, customer: data.customer };
    }
    return { success: false, message: data.message || 'Registration failed' };
  };

  // Customer Logout
  const customerLogout = () => {
    localStorage.removeItem('rsb_customer_token');
    setCustomerToken(null);
    setCustomer(null);
    setCustomerOrders([]);
  };

  // Update Customer Profile
  const updateCustomerProfile = async (profileData) => {
    if (!customerToken) return { success: false, message: 'Not logged in' };
    const res = await fetch('/api/customer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (data.success && data.customer) {
      setCustomer(data.customer);
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || 'Update failed' };
  };

  // Update Saved Measurements
  const updateCustomerMeasurements = async (measurements) => {
    if (!customerToken) return { success: false, message: 'Not logged in' };
    const res = await fetch('/api/customer/measurements', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ measurements }),
    });
    const data = await res.json();
    if (data.success && data.customer) {
      setCustomer(data.customer);
      return { success: true, message: data.message };
    }
    return { success: false, message: data.message || 'Failed to save measurements' };
  };

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem('rsb_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist:', err);
    }
  }, [wishlist]);

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Price Formatter
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '₹0';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  // WhatsApp Helper function with Customer Name / Measurements auto-attached!
  const openWhatsApp = ({ product, customMessage, selectedSize, selectedColor } = {}) => {
    const rawNumber = settings.whatsappNumber || '919467830763';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    let text = '';
    if (customMessage) {
      text = customMessage;
    } else if (product) {
      const price = product.salePrice || product.originalPrice;
      text = `राम राम ${settings.boutiqueName || 'रीना शर्मा बुटीक'} जी 🙏\n\n`;
      if (customer?.name) {
        text += `👤 ग्राहक का नाम: ${customer.name} (${customer.city || 'हरियाणा'})\n`;
      }
      text += `मुझे यह डिजाइन पसंद आया है:\n\n`;
      text += `👗 ड्रेस: ${product.name}\n`;
      text += `💰 कीमत: ${formatPrice(price)}\n`;
      if (product.category) text += `📁 कैटेगरी: ${product.category}\n`;
      if (product.sku) text += `🏷️ SKU: ${product.sku}\n`;
      if (selectedSize) text += `📏 साइज: ${selectedSize}\n`;
      if (selectedColor) text += `🎨 रंग: ${selectedColor}\n`;

      // If customer has saved measurements, mention it!
      if (customer?.measurements?.bust) {
        text += `\n📐 मेरा नाप: चेस्ट ${customer.measurements.bust}", कमर ${customer.measurements.waist || '-'}", लंबाई ${customer.measurements.kurtiLength || '-'}"`;
      }

      text += `\n\nकृपया इसकी उपलब्धता और सिलाई का समय बताएं।`;
    } else {
      text = `राम राम ${settings.boutiqueName || 'रीना शर्मा बुटीक'} जी 🙏\n\n`;
      if (customer?.name) {
        text += `मैं ${customer.name} बोल रहा/रही हूँ। `;
      }
      text += `मुझे आपके बुटीक के नए डिज़ाइन्स, सूट व सिलाई के बारे में जानकारी चाहिए।`;
    }

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const refreshData = () => {
    loadInitialData();
  };

  return (
    <BoutiqueContext.Provider
      value={{
        settings,
        setSettings,
        categories,
        loading,
        wishlist,
        toggleWishlist,
        isInWishlist,
        formatPrice,
        openWhatsApp,
        enquiryProduct,
        setEnquiryProduct,
        quickViewProduct,
        setQuickViewProduct,
        refreshData,
        customer,
        customerToken,
        customerOrders,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,
        updateCustomerMeasurements,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
};

export const useBoutique = () => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};
