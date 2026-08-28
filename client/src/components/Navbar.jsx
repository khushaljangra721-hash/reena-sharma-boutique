import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import {
  Menu,
  X,
  Search,
  Heart,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Crown,
  Scissors,
  Home,
  ShoppingBag,
  Tag,
  Info,
  MapPin,
  User
} from 'lucide-react';
import { Youtube } from './Icons';

export const Navbar = () => {
  const { settings, categories, wishlist, openWhatsApp, customer, setAuthModalOpen } = useBoutique();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Full Screen Mobile Drawer (Rendered via React Portal directly into body)
  const renderMobileDrawer = () => {
    if (!mobileMenuOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[999999] flex">
        
        {/* Full-Screen Dark Blur Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Full-Height Side Drawer */}
        <div
          className="relative z-10 bg-cream w-[85%] max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r-2 border-gold-400 animate-in slide-in-from-left duration-250"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Header */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-gold-300 pb-3 bg-white -m-4 p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-burgundy-900 border-2 border-gold-400 flex items-center justify-center p-1 shadow">
                  <img src={settings.logoUrl || '/logo-icon.svg'} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-serif font-bold text-sm text-burgundy-950 block leading-tight">
                    रीना शर्मा बुटीक
                  </span>
                  <span className="text-[10px] text-gold-700 font-bold block">
                    ✨ महेंद्रगढ़ (हरियाणा)
                  </span>
                </div>
              </div>

              {/* Big Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-gold-100 text-burgundy-950 hover:bg-gold-200 transition-colors border border-gold-300 shadow-sm"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5 pt-2 text-sm font-bold">
              {/* Customer Account Button */}
              {customer ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gold-100 border border-gold-400 text-burgundy-950 font-bold"
                >
                  <User className="w-4 h-4 text-burgundy-900" />
                  <span>👤 मेरा नाप व प्रोफाइल ({customer?.name || 'ग्राहक'})</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-burgundy-900 text-gold-200 font-bold text-left shadow-sm"
                >
                  <User className="w-4 h-4 text-gold-400" />
                  <span>👤 ग्राहक लॉगिन / खाता बनाएं</span>
                </button>
              )}

              <Link
                to="/"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-burgundy-900 text-gold-200'
                    : 'text-burgundy-950 hover:bg-gold-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>🏠 होम (Home)</span>
              </Link>

              <Link
                to="/shop"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive('/shop')
                    ? 'bg-burgundy-900 text-gold-200'
                    : 'text-burgundy-950 hover:bg-gold-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>👗 सभी डिज़ाइन्स (Catalog)</span>
              </Link>

              <Link
                to="/videos"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive('/videos')
                    ? 'bg-red-600 text-white'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <Youtube className="w-4 h-4 text-red-600" />
                <span>🎬 YouTube रील्स (@Rehan09-wtr)</span>
              </Link>

              <Link
                to="/custom-designs"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive('/custom-designs')
                    ? 'bg-burgundy-900 text-gold-200'
                    : 'text-burgundy-950 hover:bg-gold-100'
                }`}
              >
                <Scissors className="w-4 h-4 text-gold-600" />
                <span>✂️ कस्टम सिलाई (Tailoring)</span>
              </Link>

              <Link
                to="/offers"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive('/offers')
                    ? 'bg-burgundy-900 text-gold-200'
                    : 'text-burgundy-900 hover:bg-gold-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>🏷️ स्पेशल ऑफर्स %</span>
              </Link>
            </div>

            {/* 6 Core Categories */}
            <div className="pt-3 border-t-2 border-gold-200">
              <div className="text-xs font-black uppercase text-gold-800 tracking-wider mb-2 flex items-center gap-1">
                <span>🌸 मुख्य 6 कैटेगरीज</span>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-charcoal-soft hover:bg-gold-100 hover:text-burgundy-950 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gold-500" />
                      <span>{cat.name}</span>
                    </div>
                    {cat.productCount > 0 && (
                      <span className="text-[10px] text-burgundy-900 font-bold bg-gold-200 px-2 py-0.5 rounded-full">
                        {cat.productCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* About & Contact */}
            <div className="pt-3 border-t-2 border-gold-200 text-xs font-semibold text-charcoal-muted space-y-1.5">
              <Link to="/about" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-burgundy-950 hover:bg-gold-50">
                <Info className="w-3.5 h-3.5" />
                <span>हमारे बारे में (About Us)</span>
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-burgundy-950 hover:bg-gold-50">
                <MapPin className="w-3.5 h-3.5" />
                <span>दुकान का पता व संपर्क (Contact)</span>
              </Link>
            </div>
          </div>

          {/* Bottom WhatsApp Button */}
          <div className="p-4 border-t-2 border-gold-300 bg-white">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-bold shadow-md transition-transform active:scale-95 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp पर बात करें</span>
            </button>
          </div>
        </div>

      </div>,
      document.body
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/95">
        
        {/* 1. Top Greeting Bar */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-gold-500/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="bg-gold-400 text-burgundy-950 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide shrink-0 shadow-sm">
                🙏 राम राम जी
              </span>
              <span className="truncate font-medium text-gold-100 text-[11px] sm:text-xs">
                रीना शर्मा बुटीक, महेंद्रगढ़ (हरियाणा) • YouTube @Rehan09-wtr
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0 text-boutique-200">
              <a
                href="https://www.youtube.com/@Rehan09-wtr?sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white text-red-400 font-bold"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>यूट्यूब चैनल</span>
              </a>
              <span>|</span>
              <a
                href={`tel:${settings.phoneNumber || '+919467830763'}`}
                className="flex items-center gap-1 hover:text-gold-300 font-mono"
              >
                <Phone className="w-3 h-3 text-gold-400" />
                <span>{settings.phoneNumber || '+91 94678 30763'}</span>
              </a>
            </div>

          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div
          className={`transition-all duration-300 border-b ${
            scrolled
              ? 'bg-white/95 shadow-md border-gold-300/60 py-2 sm:py-2.5'
              : 'bg-cream/90 border-gold-200 py-2.5 sm:py-3.5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              
              {/* Left: Prominent Hamburger Button + Brand Logo */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                {/* Prominent Hamburger Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 sm:p-2 rounded-xl border-2 border-gold-400 bg-white text-burgundy-950 shadow-sm hover:bg-gold-50 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Open Navigation Menu"
                  title="मेनू खोलें"
                >
                  <Menu className="w-5 h-5 text-burgundy-950 stroke-[2.5]" />
                </button>

                <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-burgundy-900 to-burgundy-950 border border-gold-400 flex items-center justify-center p-1 shadow group-hover:scale-105 transition-transform shrink-0">
                    <img
                      src={settings.logoUrl || '/logo-icon.svg'}
                      alt={settings.boutiqueName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-serif text-[13px] sm:text-lg md:text-2xl font-bold tracking-tight text-burgundy-950 block leading-tight whitespace-nowrap">
                      {settings.boutiqueName || 'Reena Sharma Boutique'}
                    </span>
                    <span className="hidden sm:block text-[10px] sm:text-xs font-semibold text-gold-700 leading-tight">
                      ✨ हरियाणवी व डिजाइनर सूट बुटीक • महेंद्रगढ़
                    </span>
                    <span className="sm:hidden text-[9px] font-bold text-gold-700 leading-none">
                      महेंद्रगढ़ (हरियाणा)
                    </span>
                  </div>
                </Link>
              </div>

              {/* Center: Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-burgundy-950 bg-gold-200/80 border border-gold-400 font-bold'
                      : 'text-charcoal-soft hover:text-burgundy-900 hover:bg-gold-50'
                  }`}
                >
                  होम (Home)
                </Link>

                <Link
                  to="/shop"
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/shop')
                      ? 'text-burgundy-950 bg-gold-200/80 border border-gold-400 font-bold'
                      : 'text-charcoal-soft hover:text-burgundy-900 hover:bg-gold-50'
                  }`}
                >
                  सभी डिज़ाइन्स
                </Link>

                {/* Categories Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all ${
                      isActive('/category') || isActive('/categories')
                        ? 'text-burgundy-950 bg-gold-200/80 border border-gold-400 font-bold'
                        : 'text-charcoal-soft hover:text-burgundy-900 hover:bg-gold-50'
                    }`}
                  >
                    <span>कैटेगरीज</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {categoriesOpen && (
                    <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gold-400/50 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 border-b border-gold-100 mb-2 flex items-center justify-between">
                        <span>मुख्य 6 कैटेगरीज</span>
                        <Link to="/categories" className="text-burgundy-900 hover:underline text-[11px]">सभी देखें →</Link>
                      </div>
                      <div className="px-2 space-y-1">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-charcoal hover:bg-gold-50 hover:text-burgundy-950 transition-colors"
                          >
                            <span className="font-medium">{cat.name}</span>
                            {cat.productCount > 0 && (
                              <span className="text-[10px] font-bold text-burgundy-900 bg-gold-100 px-2 py-0.5 rounded-full">
                                {cat.productCount} ड्रेसेस
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* YouTube Shorts */}
                <Link
                  to="/videos"
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                    isActive('/videos')
                      ? 'text-red-700 bg-red-50 border border-red-200 font-bold'
                      : 'text-charcoal-soft hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube रील्स</span>
                </Link>

                {/* Custom Stitching */}
                <Link
                  to="/custom-designs"
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all ${
                    isActive('/custom-designs')
                      ? 'text-burgundy-950 bg-gold-200/80 border border-gold-400 font-bold'
                      : 'text-charcoal-soft hover:text-burgundy-900 hover:bg-gold-50'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 text-gold-600" />
                  <span>कस्टम सिलाई</span>
                </Link>
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-1.5 sm:p-2.5 rounded-xl text-charcoal hover:text-burgundy-900 hover:bg-gold-100/50 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <Link
                  to="/wishlist"
                  className="relative p-1.5 sm:p-2.5 rounded-xl text-charcoal hover:text-burgundy-900 hover:bg-gold-100/50 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-burgundy-900 text-gold-200 text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Customer Account / Login Button */}
                {customer ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-gold-100 border border-gold-400 text-burgundy-950 font-bold text-xs hover:bg-gold-200 transition-colors"
                    title="मेरा नाप व प्रोफाइल"
                  >
                    <div className="w-6 h-6 rounded-full bg-burgundy-900 text-gold-200 flex items-center justify-center text-[10px] font-black shrink-0">
                      {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[70px]">
                      {(customer?.name || 'User').split(' ')[0]}
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-gold-300 bg-white text-burgundy-950 font-bold text-xs hover:bg-gold-50 transition-colors flex items-center gap-1 shrink-0"
                    title="ग्राहक लॉगिन"
                  >
                    <User className="w-4 h-4 text-burgundy-900" />
                    <span className="hidden sm:inline">लॉगिन</span>
                  </button>
                )}

                {/* 1-Tap WhatsApp CTA */}
                <button
                  onClick={() => openWhatsApp()}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-1.5 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">WhatsApp पर ऑर्डर</span>
                  <span className="sm:hidden font-bold">WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 3. Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-b border-gold-300 bg-white p-3.5 shadow-lg animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                <input
                  type="text"
                  autoFocus
                  placeholder="सूट, लहंगा, साड़ी ब्लाउज, या फैब्रिक खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border-2 border-gold-300 focus:outline-none focus:border-burgundy-900"
                />
              </div>
              <button
                type="submit"
                className="bg-burgundy-900 text-gold-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow hover:bg-burgundy-950 shrink-0"
              >
                सर्च करें
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-charcoal hover:bg-gold-50 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

      </header>

      {/* Render Mobile Drawer via Portal directly into Body */}
      {renderMobileDrawer()}
    </>
  );
};
