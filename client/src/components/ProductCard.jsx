import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { Heart, MessageCircle, Eye, Sparkles, Scissors, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist, formatPrice, openWhatsApp, setEnquiryProduct, setQuickViewProduct } = useBoutique();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const primaryImage = images[0];
  const secondaryImage = images[1] || images[0];

  const inWishlist = isInWishlist(product.id);
  const originalPrice = product.originalPrice;
  const salePrice = product.salePrice || product.originalPrice;
  const discount = product.discount || (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gold-300/40 hover:border-gold-500 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-boutique-100">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-burgundy-900 text-gold-200 text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gold-500 text-burgundy-950 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
          {product.isNewArrival && !product.isFeatured && (
            <span className="bg-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              New In
            </span>
          )}
          {product.isTrending && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-burgundy-900 text-gold-300 shadow-md scale-110'
              : 'bg-white/80 text-charcoal hover:bg-white hover:text-burgundy-900'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-gold-300 text-gold-300' : ''}`} />
        </button>

        {/* Quick View Button on Image Hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 bg-white/95 hover:bg-white text-charcoal hover:text-burgundy-900 py-2 px-3 rounded-xl text-xs font-semibold shadow-lg flex items-center justify-center gap-1.5 transition-colors backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-boutique-500 mb-0.5 sm:mb-1">
            <Link
              to={`/category/${product.categorySlug}`}
              className="font-bold text-gold-700 hover:text-burgundy-900 uppercase tracking-wider truncate max-w-[120px]"
            >
              {product.category}
            </Link>
            {product.sku && (
              <span className="font-mono text-[9px] sm:text-[10px] text-charcoal-muted bg-boutique-100 px-1 py-0.2 rounded shrink-0">
                {product.sku}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-xs sm:text-base font-bold text-burgundy-950 hover:text-burgundy-700 transition-colors line-clamp-2 leading-tight"
          >
            {product.name}
          </Link>

          {/* Fabric / Material note */}
          {product.fabric && (
            <p className="text-[10px] sm:text-[11px] text-charcoal-muted line-clamp-1 mt-1 hidden sm:block">
              <span className="font-medium text-charcoal-soft">फैब्रिक:</span> {product.fabric}
            </p>
          )}
        </div>

        <div>
          {/* Price Layout: Original -> Offer Price -> Discount */}
          <div className="pt-1.5 sm:pt-2 border-t border-boutique-100 flex items-baseline justify-between gap-1 sm:gap-2">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="font-bold text-sm sm:text-lg text-burgundy-900">
                {formatPrice(salePrice)}
              </span>
              {originalPrice > salePrice && (
                <span className="text-[10px] sm:text-xs text-charcoal-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-[9px] sm:text-[11px] font-extrabold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shrink-0">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 sm:mt-3 pt-1 sm:pt-2">
            <button
              onClick={() => openWhatsApp({ product })}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => setEnquiryProduct(product)}
              className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-1.5 sm:py-2 px-2 rounded-xl text-[11px] sm:text-xs font-semibold hidden sm:flex items-center justify-center gap-1 transition-colors"
              title="Book Fitting or Ask Question"
            >
              <Scissors className="w-3 h-3" />
              <span>Fitting / नाप</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
