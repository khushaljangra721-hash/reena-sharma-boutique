import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { X, MessageCircle, Heart, Sparkles, Scissors, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, formatPrice, openWhatsApp, setEnquiryProduct, toggleWishlist, isInWishlist } = useBoutique();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const originalPrice = product.originalPrice;
  const salePrice = product.salePrice || product.originalPrice;
  const discount = product.discount || (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);
  const inWishlist = isInWishlist(product.id);

  const handleClose = () => {
    setQuickViewProduct(null);
    setActiveImgIndex(0);
    setSelectedSize('');
    setSelectedColor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold-500/20 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 p-6 bg-boutique-50 flex flex-col justify-between overflow-y-auto">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-inner">
            <img
              src={images[activeImgIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-burgundy-900 text-gold-200 text-xs font-bold px-2.5 py-1 rounded shadow">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImgIndex === idx ? 'border-burgundy-900 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Category & Badges */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gold-700 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium text-[11px] border border-emerald-200">
                  ● In Stock / Custom Stitching
                </span>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-1.5 rounded-full hover:bg-boutique-100 text-charcoal transition-colors"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-burgundy-900 text-burgundy-900' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-950 leading-tight">
              {product.name}
            </h2>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pb-2 border-b border-boutique-200">
              <span className="text-2xl font-extrabold text-burgundy-900">
                {formatPrice(salePrice)}
              </span>
              {originalPrice > salePrice && (
                <span className="text-sm text-charcoal-muted line-through font-medium">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed line-clamp-3">
              {product.description || 'Handcrafted luxury boutique design with fine finishing and personalized fitting options.'}
            </p>

            {/* Fabric Information */}
            {product.fabric && (
              <div className="p-3 bg-boutique-50 rounded-xl text-xs space-y-1 border border-boutique-200">
                <div className="font-bold text-charcoal">✨ Fabric & Embroidery:</div>
                <div className="text-charcoal-soft">{product.fabric}</div>
              </div>
            )}

            {/* Sizes */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div>
                <div className="text-xs font-bold text-charcoal mb-2">Available Sizes:</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === s
                          ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-sm'
                          : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div>
                <div className="text-xs font-bold text-charcoal mb-2">Available Colors:</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedColor === c
                          ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-sm'
                          : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-3">
            <button
              onClick={() => {
                handleClose();
                openWhatsApp({ product, selectedSize, selectedColor });
              }}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleClose();
                  setEnquiryProduct(product);
                }}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Custom Fitting</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={handleClose}
                className="w-full bg-boutique-100 hover:bg-boutique-200 text-burgundy-950 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Full Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
