import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  Tag,
  Crown,
  Flame,
  RotateCcw
} from 'lucide-react';

export const ShopPage = () => {
  const { categories, formatPrice } = useBoutique();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(
    searchParams.get('featured') === 'true'
      ? 'featured'
      : searchParams.get('newArrival') === 'true'
      ? 'newArrival'
      : searchParams.get('trending') === 'true'
      ? 'trending'
      : searchParams.get('onOffer') === 'true'
      ? 'onOffer'
      : 'all'
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search'));
    if (searchParams.get('category') !== null) setSelectedCategory(searchParams.get('category'));
    if (searchParams.get('featured') === 'true') setSelectedTag('featured');
    else if (searchParams.get('newArrival') === 'true') setSelectedTag('newArrival');
    else if (searchParams.get('trending') === 'true') setSelectedTag('trending');
    else if (searchParams.get('onOffer') === 'true') setSelectedTag('onOffer');
  }, [searchParams]);

  // Fetch products with current filters
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedTag === 'featured') params.append('featured', 'true');
        if (selectedTag === 'newArrival') params.append('newArrival', 'true');
        if (selectedTag === 'trending') params.append('trending', 'true');
        if (selectedTag === 'onOffer') params.append('onOffer', 'true');
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (selectedSize) params.append('size', selectedSize);
        if (selectedColor) params.append('color', selectedColor);
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [search, selectedCategory, selectedTag, minPrice, maxPrice, selectedSize, selectedColor, sortBy]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setSortBy('latest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    (selectedCategory && selectedCategory !== 'all') ||
    selectedTag !== 'all' ||
    minPrice ||
    maxPrice ||
    selectedSize ||
    selectedColor;

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', 'Custom'];
  const popularColors = ['Maroon', 'Red', 'Pink', 'Gold', 'Yellow', 'Green', 'Blue', 'Peach', 'Ivory', 'Black', 'Lavender'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gold-500/20">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-300 bg-gold-500/20 px-3 py-1 rounded-full inline-block">
            Boutique Catalog & Collections
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            Discover Designer Outfits
          </h1>
          <p className="text-xs sm:text-sm text-boutique-200">
            Browse our latest bridal wear, sharara suits, designer blouses, kurtas and custom stitching creations. Order easily via WhatsApp.
          </p>
        </div>
      </div>

      {/* Top Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-boutique-200 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-boutique-500" />
          <input
            type="text"
            placeholder="Search by dress name, fabric, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-boutique-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900 focus:border-transparent bg-boutique-50/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-burgundy-900 text-gold-200'
                : 'bg-boutique-100 text-charcoal hover:bg-boutique-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedTag('featured')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedTag === 'featured'
                ? 'bg-burgundy-900 text-gold-200'
                : 'bg-boutique-100 text-charcoal hover:bg-boutique-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>Featured</span>
          </button>
          <button
            onClick={() => setSelectedTag('newArrival')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'newArrival'
                ? 'bg-burgundy-900 text-gold-200'
                : 'bg-boutique-100 text-charcoal hover:bg-boutique-200'
            }`}
          >
            New In
          </button>
          <button
            onClick={() => setSelectedTag('trending')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedTag === 'trending'
                ? 'bg-burgundy-900 text-gold-200'
                : 'bg-boutique-100 text-charcoal hover:bg-boutique-200'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-500" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setSelectedTag('onOffer')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              selectedTag === 'onOffer'
                ? 'bg-burgundy-900 text-gold-200'
                : 'bg-boutique-100 text-charcoal hover:bg-boutique-200'
            }`}
          >
            <Tag className="w-3 h-3 text-red-500" />
            <span>Offers</span>
          </button>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-boutique-100 hover:bg-boutique-200 text-charcoal px-3 py-2 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '●'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-charcoal">
            <span className="font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-boutique-50 border border-boutique-300 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-burgundy-900"
            >
              <option value="latest">Latest Designs</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Popular / Trending</option>
              <option value="discount_desc">Highest Discount</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-boutique-200 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-boutique-100">
              <span className="font-serif font-bold text-sm text-burgundy-950 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-gold-600" />
                Filter Catalog
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-burgundy-900 hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
                Categories
              </h4>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-burgundy-50 text-burgundy-900 font-bold'
                      : 'text-charcoal-soft hover:bg-boutique-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{totalCount}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.name || selectedCategory === cat.slug
                        ? 'bg-burgundy-50 text-burgundy-900 font-bold'
                        : 'text-charcoal-soft hover:bg-boutique-50'
                    }`}
                  >
                    <span className="truncate pr-1">{cat.name}</span>
                    {cat.productCount > 0 && (
                      <span className="text-[11px] text-boutique-500 bg-boutique-100 px-1.5 py-0.2 rounded-full">
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Presets */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
                Price Range
              </h4>
              <div className="space-y-1.5">
                {[
                  { label: 'Under ₹2,000', min: '', max: '2000' },
                  { label: '₹2,000 - ₹5,000', min: '2000', max: '5000' },
                  { label: '₹5,000 - ₹10,000', min: '5000', max: '10000' },
                  { label: 'Above ₹10,000 (Bridal)', min: '10000', max: '' },
                ].map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMinPrice(range.min);
                      setMaxPrice(range.max);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      minPrice === range.min && maxPrice === range.max
                        ? 'bg-burgundy-50 text-burgundy-900 font-bold'
                        : 'text-charcoal-soft hover:bg-boutique-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
                Filter by Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {standardSizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      selectedSize === s
                        ? 'bg-burgundy-900 text-gold-200 border-burgundy-900'
                        : 'bg-white text-charcoal border-boutique-200 hover:border-burgundy-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
                Filter by Color
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {popularColors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(selectedColor === c ? '' : c)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      selectedColor === c
                        ? 'bg-burgundy-900 text-gold-200 border-burgundy-900'
                        : 'bg-white text-charcoal border-boutique-200 hover:border-burgundy-900'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Chips Bar */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted">
            <span>
              Showing <strong className="text-burgundy-950 font-bold">{products.length}</strong> of {totalCount} designs
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-burgundy-900 hover:underline font-bold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-serif text-sm font-semibold text-charcoal-muted">
                Loading boutique garments...
              </p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-boutique-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-boutique-100 text-boutique-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-burgundy-950">
                No matching garments found
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try resetting the filters or inquire for custom stitching!
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-burgundy-900 text-gold-200 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-burgundy-950 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-boutique-200">
                <h3 className="font-serif font-bold text-base text-burgundy-950">Filter Catalog</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase text-charcoal mb-2">Category</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                      selectedCategory === 'all' ? 'bg-burgundy-50 text-burgundy-900 font-bold' : 'text-charcoal'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                        selectedCategory === cat.name ? 'bg-burgundy-50 text-burgundy-900 font-bold' : 'text-charcoal'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase text-charcoal mb-2">Size</h4>
                <div className="flex flex-wrap gap-1.5">
                  {standardSizes.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSize(selectedSize === s ? '' : s);
                        setMobileFilterOpen(false);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        selectedSize === s
                          ? 'bg-burgundy-900 text-gold-200'
                          : 'bg-white text-charcoal border-boutique-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-boutique-200 space-y-2">
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-boutique-100 text-charcoal py-2.5 rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-burgundy-900 text-gold-200 py-2.5 rounded-xl text-xs font-bold"
              >
                Apply Filters ({products.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
