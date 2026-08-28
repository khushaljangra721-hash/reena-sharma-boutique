import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { getImageUrl } from '../utils/api';
import {
  Heart,
  MessageCircle,
  Scissors,
  Sparkles,
  Share2,
  CheckCircle,
  Truck,
  ShieldCheck,
  Ruler,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { formatPrice, openWhatsApp, setEnquiryProduct, toggleWishlist, isInWishlist, settings } = useBoutique();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [copied, setCopied] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          setSelectedImgIndex(0);
          setSelectedSize(data.product.sizes?.[0] || '');
          setSelectedColor(data.product.colors?.[0] || '');
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm font-semibold text-charcoal-muted">
            Loading design details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-burgundy-950">
          Product Not Found
        </h2>
        <p className="text-sm text-charcoal-muted">
          The requested boutique outfit could not be found or has been moved.
        </p>
        <Link
          to="/shop"
          className="bg-burgundy-900 text-gold-200 px-6 py-2.5 rounded-full text-xs font-bold inline-block"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const inWishlist = isInWishlist(product.id);
  const originalPrice = product.originalPrice;
  const salePrice = product.salePrice || product.originalPrice;
  const discount = product.discount || (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-muted">
        <Link to="/" className="hover:text-burgundy-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-burgundy-900">Collection</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-burgundy-900">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-burgundy-950 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-luxury border border-boutique-200">
            <img
              src={getImageUrl(images[selectedImgIndex] || images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {discount > 0 && (
                <span className="bg-burgundy-900 text-gold-200 text-xs font-extrabold px-3 py-1 rounded-md shadow-md uppercase">
                  {discount}% OFF
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-gold-500 text-burgundy-950 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Featured
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                inWishlist
                  ? 'bg-burgundy-900 text-gold-300'
                  : 'bg-white/90 text-charcoal hover:bg-white hover:text-burgundy-900'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-gold-300' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImgIndex === idx
                      ? 'border-burgundy-900 scale-105 shadow-md'
                      : 'border-boutique-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Garment Details & Actions (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs">
              <Link
                to={`/category/${product.categorySlug}`}
                className="font-bold text-gold-700 uppercase tracking-widest hover:underline"
              >
                {product.category}
              </Link>
              {product.sku && (
                <span className="font-mono text-xs text-charcoal-muted bg-boutique-100 px-2.5 py-1 rounded-md border border-boutique-200">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-burgundy-950 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-boutique-50/80 border border-boutique-200/80 flex items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-charcoal-muted block mb-0.5">Boutique Offer Price:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-burgundy-900">
                  {formatPrice(salePrice)}
                </span>
                {originalPrice > salePrice && (
                  <span className="text-base text-charcoal-muted line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {discount > 0 && (
              <div className="text-right">
                <span className="inline-block bg-green-100 text-green-800 font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full border border-green-300">
                  Save {discount}% OFF
                </span>
                <span className="block text-[10px] text-charcoal-muted mt-0.5">Special Boutique Pricing</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Garment Description
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Fabric & Craftsmanship Details */}
          {product.fabric && (
            <div className="p-4 rounded-2xl bg-white border border-gold-400/40 shadow-sm space-y-1">
              <div className="text-xs font-bold text-burgundy-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Fabric & Material Specifications</span>
              </div>
              <p className="text-xs text-charcoal-soft">{product.fabric}</p>
            </div>
          )}

          {/* Size Selector */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-charcoal">
                  Available Sizes: <strong className="text-burgundy-900">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="text-burgundy-900 hover:underline font-semibold flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5 text-gold-600" />
                  <span>Size & Measurement Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-md scale-105'
                        : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Guide Accordion */}
          {sizeGuideOpen && (
            <div className="p-4 bg-boutique-100 rounded-2xl text-xs space-y-2 border border-boutique-300 animate-in fade-in duration-150">
              <div className="font-bold text-burgundy-950 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-gold-600" />
                <span>Standard Size Chart (Inches):</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] bg-white p-2.5 rounded-xl border border-boutique-200">
                <div className="font-bold text-burgundy-900">Size</div>
                <div className="font-bold text-burgundy-900">Bust</div>
                <div className="font-bold text-burgundy-900">Waist</div>
                <div className="font-bold text-burgundy-900">Hip</div>
                <div>S (36)</div><div>36"</div><div>30"</div><div>38"</div>
                <div>M (38)</div><div>38"</div><div>32"</div><div>40"</div>
                <div>L (40)</div><div>40"</div><div>34"</div><div>42"</div>
                <div>XL (42)</div><div>42"</div><div>36"</div><div>44"</div>
              </div>
              <p className="text-[11px] text-charcoal-muted italic">
                * Need custom measurements or extra margin? Select "Custom Measurement" and mention details on WhatsApp!
              </p>
            </div>
          )}

          {/* Color Selector */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-charcoal">
                Available Colors: <strong className="text-burgundy-900">{selectedColor}</strong>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === c
                        ? 'bg-burgundy-900 text-gold-200 border-burgundy-900 shadow-md scale-105'
                        : 'bg-white text-charcoal border-boutique-300 hover:border-burgundy-900'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-4 space-y-3">
            {/* 1. ORDER ON WHATSAPP BUTTON (Primary Requirement) */}
            <button
              type="button"
              onClick={() => openWhatsApp({ product, selectedSize, selectedColor })}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 animate-whatsapp-glow"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Order on WhatsApp (Instant Booking)</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              {/* 2. Custom Fitting / Enquiry */}
              <button
                type="button"
                onClick={() => setEnquiryProduct(product)}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Scissors className="w-4 h-4" />
                <span>Custom Stitching Inquiry</span>
              </button>

              {/* 3. Share / Copy */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-white hover:bg-boutique-100 text-charcoal border border-boutique-300 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-boutique-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-charcoal-muted">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Quality Fabric Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Free Alteration Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Safe Delivery from Mahendragarh</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Outfits in Same Category */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-boutique-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
              You May Also Like
            </h2>
            <Link
              to={`/category/${product.categorySlug}`}
              className="text-xs sm:text-sm font-bold text-burgundy-900 hover:underline"
            >
              More in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
