import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { Youtube } from './Icons';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { wishlist, customer, setAuthModalOpen } = useBoutique();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-gold-300 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1 px-2">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
            isActive('/') && location.pathname === '/'
              ? 'text-burgundy-950 font-black'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') && location.pathname === '/' ? 'text-burgundy-950 stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">होम</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
            isActive('/shop')
              ? 'text-burgundy-950 font-black'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${isActive('/shop') ? 'text-burgundy-950 stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">कैटलॉग</span>
        </Link>

        {/* YouTube Shorts */}
        <Link
          to="/videos"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
            isActive('/videos')
              ? 'text-red-600 font-black'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Youtube className="w-5 h-5 text-red-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
          </div>
          <span className="text-[10px]">रील्स</span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
            isActive('/wishlist')
              ? 'text-burgundy-950 font-black'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'text-burgundy-900 fill-burgundy-900' : ''}`} />
          <span className="text-[10px]">पसंद</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1 bg-burgundy-900 text-gold-200 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Customer Account / Profile / Login */}
        {customer ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors ${
              isActive('/profile')
                ? 'text-burgundy-950 font-black'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-burgundy-900 text-gold-200 flex items-center justify-center text-[9px] font-black">
              {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-[10px] truncate max-w-[40px]">
              {(customer?.name || 'User').split(' ')[0]}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-burgundy-900 font-bold transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">लॉगिन</span>
          </button>
        )}

      </div>
    </div>
  );
};
