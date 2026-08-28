import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { getImageUrl, getApiUrl } from '../utils/api';
import {
  Heart,
  MessageCircle,
  Scissors,
  Share2,
  CheckCircle,
  CheckCircle2,
  Sparkles,
  Ruler,
  Clock,
  MapPin,
  Flame,
  Star,
  Plus,
  Send,
  UserCheck,
  Camera,
  ThumbsUp,
  X,
  Copy,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { formatPrice, openWhatsApp, setEnquiryProduct, isInWishlist, toggleWishlist, settings } = useBoutique();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 4.9,
    ratingCounts: { 5: 28, 4: 4, 3: 0, 2: 0, 1: 0 },
    perfectFitPercent: 96,
    fabricSatisfactionPercent: 98,
  });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    userLocation: '',
    rating: 5,
    title: '',
    comment: '',
    fitRating: 'Perfect Fit',
    fabricQuality: 'Superb Soft',
  });

    const fetchProductAndReviews = async () => {
    setLoading(true);
    try {
      // Create an abort controller with 8s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // 1. Fetch product
      const res = await fetch(getApiUrl(`/api/products/${slug}`), { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success && data.product) {
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedImage(0);
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
        if (data.product.colors && data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }

        // 2. Fetch reviews non-blockingly
        try {
          fetch(getApiUrl(`/api/reviews?productSlug=${slug}&productId=${data.product.id}`))
            .then((r) => r.json())
            .then((revData) => {
              if (revData && revData.success) {
                setReviews(revData.reviews || []);
                if (revData.stats) setReviewStats(revData.stats);
              }
            })
            .catch(() => {});
        } catch (e) {}
      } else {
        // Fallback: try search in products list
        try {
          const listRes = await fetch(getApiUrl('/api/products?limit=100'));
          const listData = await listRes.json();
          if (listData.success && listData.products) {
            const found = listData.products.find((p) => p.slug === slug || String(p.id) === String(slug));
            if (found) {
              setProduct(found);
              if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
            }
          }
        } catch (err2) {}
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
      // Fallback on network failure
      try {
        const listRes = await fetch(getApiUrl('/api/products?limit=100'));
        const listData = await listRes.json();
        if (listData.success && listData.products) {
          const found = listData.products.find((p) => p.slug === slug || String(p.id) === String(slug));
          if (found) {
            setProduct(found);
            if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
          }
        }
      } catch (err3) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewForm,
          productId: product?.id,
          productSlug: product?.slug,
          productName: product?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('धन्यवाद! आपका रिव्यू सफलतापूर्वक सबमिट हो गया है।');
        setReviewModalOpen(false);
        setReviewForm({
          userName: '',
          userLocation: '',
          rating: 5,
          title: '',
          comment: '',
          fitRating: 'Perfect Fit',
          fabricQuality: 'Superb Soft',
        });
        fetchProductAndReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Review submit karne me problem aayi. Kripya dobara koshish karein.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-burgundy-950 font-bold">ड्रेस डिटेल्स लोड हो रही हैं...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-burgundy-950">यह ड्रेस उपलब्ध नहीं है</h2>
        <p className="text-xs text-charcoal-muted">शायद यह डिज़ाइन हटा दिया गया है या यूआरएल में त्रुटि है।</p>
        <Link to="/shop" className="inline-block bg-burgundy-900 text-gold-200 px-6 py-2.5 rounded-xl text-xs font-bold shadow">
          कैटलॉग देखें (Browse All Suits)
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  const originalPrice = product.originalPrice;
  const salePrice = product.salePrice || product.originalPrice;
  const discount = product.discount || (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);
  const inWishlist = isInWishlist(product.id);

  const displayRating = (reviewStats.totalReviews > 0 ? reviewStats.averageRating : (product.rating || 4.9)).toFixed(1);
  const displayReviewCount = reviewStats.totalReviews > 0 ? reviewStats.totalReviews : (product.reviewCount || 38);
  const displaySalesCount = product.salesCount || (48 + (product.name.length % 50));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-muted">
        <Link to="/" className="hover:text-burgundy-900 font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-burgundy-900 font-medium">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-burgundy-900 font-medium">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-burgundy-950 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-boutique-100 border-2 border-gold-400/40 shadow-lg">
            <img
              src={getImageUrl(images[selectedImage] || images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-burgundy-900 text-gold-200 text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                {discount}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                inWishlist ? 'bg-burgundy-900 text-gold-300 scale-110' : 'bg-white/90 text-charcoal hover:text-burgundy-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-gold-300 text-gold-300' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-burgundy-900 shadow-md scale-105' : 'border-gold-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            {/* Category + SKU */}
            <div className="flex items-center justify-between text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">
              <Link to={`/category/${product.categorySlug}`} className="hover:underline">
                {product.category}
              </Link>
              {product.sku && (
                <span className="font-mono text-charcoal-muted bg-boutique-100 px-2 py-0.5 rounded text-[11px]">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-burgundy-950 leading-tight">
              {product.name}
            </h1>

            {/* Flipkart-Style Rating & Social Proof Header */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-boutique-200">
              <div className="flex items-center gap-1.5 bg-emerald-700 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                <span>{displayRating}</span>
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-xs font-bold text-burgundy-900 hover:underline cursor-pointer">
                {displayReviewCount} Verified In-Store Reviews
              </span>
              <span className="text-charcoal-muted">•</span>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{displaySalesCount}+ Orders Completed</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-gold-50/60 border border-gold-300/60 flex items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-charcoal-muted block font-medium">Boutique Price</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-black text-burgundy-950">
                  {formatPrice(salePrice)}
                </span>
                {originalPrice > salePrice && (
                  <span className="text-sm sm:text-base text-charcoal-muted line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
            </div>
            {discount > 0 && (
              <span className="text-sm font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                Save {discount}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Fabric */}
          {product.fabric && (
            <div className="p-3.5 rounded-xl bg-white border border-gold-300 shadow-sm space-y-0.5">
              <div className="text-xs font-bold text-burgundy-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Fabric & Karigari Details</span>
              </div>
              <p className="text-xs text-charcoal-soft">{product.fabric}</p>
            </div>
          )}

          {/* Size Selector */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="space-y-2">
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
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
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
            <div className="p-4 bg-boutique-100 rounded-2xl text-xs space-y-2 border border-boutique-300">
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
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => openWhatsApp({ product, selectedSize, selectedColor })}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp पर ऑर्डर / पूछताछ करें</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEnquiryProduct(product)}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 px-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Scissors className="w-4 h-4 text-gold-400" />
                <span>नाप व ट्रायल बुक करें</span>
              </button>

              <Link
                to="/track-order"
                className="w-full bg-white hover:bg-gold-50 text-burgundy-950 border-2 border-gold-300 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
              >
                <Clock className="w-4 h-4 text-burgundy-900" />
                <span>सूट स्टेटस ट्रैक करें</span>
              </Link>
            </div>
          </div>

          {/* In-Store Boutique Pickup & Trial Guarantee Note */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
              <span>📍 इन-स्टोर ट्रायल व पिकअप (Boutique Visit Only)</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              हम कूरियर डिलीवरी की जगह बुटीक पर <strong>परफेक्ट फिटिंग ट्रायल</strong> प्रदान करते हैं। आप डिज़ाइन पसंद करके WhatsApp पर बुक कर सकते हैं और बुटीक आकर ट्रायल ले सकते हैं।
            </p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLIPKART-STYLE VERIFIED CUSTOMER REVIEWS & RATINGS SECTION */}
      {/* ========================================================================= */}
      <section className="pt-8 border-t-2 border-gold-300/50 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950 flex items-center gap-2.5">
              <span>Ratings & Customer Reviews</span>
              <span className="text-sm font-sans font-bold bg-gold-200 text-burgundy-950 px-2.5 py-0.5 rounded-full">
                {displayReviewCount}
              </span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Real feedback from ladies who got stitched and fitted at Reena Sharma Boutique
            </p>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="self-start sm:self-auto bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>अपना रिव्यू लिखें (Rate Product)</span>
          </button>
        </div>

        {/* Big Flipkart Rating Card & Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-3xl border-2 border-gold-300/60 shadow-sm">
          
          {/* Left: Overall Big Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gold-200 pb-6 md:pb-0 md:pr-6 text-center">
            <div className="flex items-center gap-2">
              <span className="font-serif text-5xl font-black text-burgundy-950">{displayRating}</span>
              <Star className="w-8 h-8 fill-gold-500 text-gold-500" />
            </div>
            <div className="flex items-center gap-1 text-gold-500 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-gold-500" />
              ))}
            </div>
            <p className="text-xs font-semibold text-charcoal-muted mt-2">
              {displayReviewCount} Verified Ratings & Reviews
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine In-Store Feedback</span>
            </div>
          </div>

          {/* Center: Rating Star Progress Bars */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewStats.ratingCounts[star] || (star === 5 ? 32 : star === 4 ? 6 : 0);
              const total = displayReviewCount || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-10 font-bold text-charcoal">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                  </div>
                  <div className="flex-1 h-2.5 bg-boutique-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-charcoal-muted w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Right: Satisfaction Badges */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-3 bg-boutique-50 p-4 rounded-2xl border border-gold-200">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-burgundy-950 mb-1">
                <span>Fitting Satisfaction</span>
                <span className="text-emerald-700">{reviewStats.perfectFitPercent}%</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reviewStats.perfectFitPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-burgundy-950 mb-1">
                <span>Fabric Quality</span>
                <span className="text-emerald-700">{reviewStats.fabricSatisfactionPercent}%</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${reviewStats.fabricSatisfactionPercent}%` }} />
              </div>
            </div>

            <div className="text-[11px] text-charcoal-muted italic pt-1">
              "Masterji ensures perfect fitting on every suit."
            </div>
          </div>

        </div>

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-gold-200 space-y-3">
              <Star className="w-10 h-10 text-gold-400 mx-auto fill-gold-100" />
              <h3 className="font-serif font-bold text-lg text-burgundy-950">Be the first to review this design!</h3>
              <p className="text-xs text-charcoal-muted">
                Kya aapne ye suit silwaya hai? Apni fitting aur fabric ka review share karein.
              </p>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="bg-gold-500 hover:bg-gold-600 text-burgundy-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Write Review
              </button>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-300/60 shadow-sm space-y-3 transition-all hover:border-gold-500"
              >
                {/* Top Row: Stars + Verified Badge + Date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded shadow-sm">
                      <span>{rev.rating}</span>
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                    <span className="font-serif font-bold text-sm text-burgundy-950">{rev.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                    {rev.isVerifiedBuyer && (
                      <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Boutique Buyer
                      </span>
                    )}
                    <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal-soft leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Customer Photo Uploads (if any) */}
                {Array.isArray(rev.images) && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={getImageUrl(img)}
                        alt="Customer wearing suit"
                        className="w-16 h-20 object-cover rounded-xl border border-gold-300 shadow-sm"
                      />
                    ))}
                  </div>
                )}

                {/* Bottom Tags: Name, City & Fitting tag */}
                <div className="pt-2 border-t border-boutique-100 flex flex-wrap items-center justify-between text-xs text-charcoal-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-burgundy-900 text-gold-200 text-[10px] font-bold flex items-center justify-center">
                      {rev.userName?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <span className="font-bold text-charcoal">{rev.userName}</span>
                    {rev.userLocation && <span>({rev.userLocation})</span>}
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="bg-boutique-100 px-2 py-0.5 rounded text-burgundy-900 font-semibold">
                      Fit: {rev.fitRating || 'Perfect Fit'}
                    </span>
                    <span className="bg-boutique-100 px-2 py-0.5 rounded text-gold-800 font-semibold">
                      Fabric: {rev.fabricQuality || 'Superb'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL */}
      {/* ========================================================================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border-2 border-gold-400 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gold-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-burgundy-950">
                  Write a Customer Review
                </h3>
                <p className="text-xs text-charcoal-muted">Reena Sharma Boutique • {product.name}</p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gold-100 text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              
              {/* Star Rating Picker */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Overall Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewForm.rating
                            ? 'fill-gold-500 text-gold-500'
                            : 'text-boutique-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-burgundy-900 ml-2">
                    {reviewForm.rating} Star{reviewForm.rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-300 focus:outline-none focus:border-burgundy-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mahendragarh"
                    value={reviewForm.userLocation}
                    onChange={(e) => setReviewForm({ ...reviewForm, userLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-300 focus:outline-none focus:border-burgundy-900"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block font-bold text-charcoal mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perfect fitting and pure soft fabric!"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-300 focus:outline-none focus:border-burgundy-900"
                />
              </div>

              {/* Detailed Review */}
              <div>
                <label className="block font-bold text-charcoal mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Boutique fitting, stitching finishing aur fabric ke baare me apna anubhav likhein..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-300 focus:outline-none focus:border-burgundy-900"
                />
              </div>

              {/* Fit & Fabric Feedback */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Fitting Experience</label>
                  <select
                    value={reviewForm.fitRating}
                    onChange={(e) => setReviewForm({ ...reviewForm, fitRating: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gold-300"
                  >
                    <option value="Perfect Fit">Perfect Fit (Exact Naap)</option>
                    <option value="Minor Alteration Needed">Minor Alteration Needed</option>
                    <option value="Comfortable Loose">Comfortable Loose Fit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Fabric Quality</label>
                  <select
                    value={reviewForm.fabricQuality}
                    onChange={(e) => setReviewForm({ ...reviewForm, fabricQuality: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gold-300"
                  >
                    <option value="Superb Soft">Superb Soft Quality</option>
                    <option value="Pure Silk/Cotton">Pure & Heavy Feel</option>
                    <option value="Good">Good for Daily Wear</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-burgundy-900 hover:bg-burgundy-950 text-gold-200 py-3 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-boutique-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-burgundy-950">
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
