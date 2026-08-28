import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoutique } from '../context/BoutiqueContext';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, ArrowLeft, Scissors, MessageCircle, Sparkles } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams();
  const { categories, openWhatsApp } = useBoutique();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const found = categories.find((c) => c.slug === slug);
        setCategory(found || { name: slug.replace(/-/g, ' ').toUpperCase(), slug });

        const res = await fetch(`/api/products?categorySlug=${slug}`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [slug, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-muted">
        <Link to="/" className="hover:text-burgundy-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/categories" className="hover:text-burgundy-900">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-burgundy-950 font-semibold">{category?.name || slug}</span>
      </nav>

      {/* Hero Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white p-8 sm:p-12 shadow-xl border border-gold-500/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Collection</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {category?.name || slug}
          </h1>

          <p className="text-xs sm:text-sm text-boutique-200 leading-relaxed">
            {category?.description || `Explore our latest collection of ${category?.name || slug} with custom stitching and WhatsApp order support.`}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! I want to inquire about custom orders in the "${category?.name || slug}" category.` })}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-charcoal-muted">
          <span>
            Showing <strong className="text-burgundy-950 font-bold">{products.length}</strong> designs in {category?.name}
          </span>
          <Link to="/shop" className="text-burgundy-900 hover:underline font-bold">
            View All Products →
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-burgundy-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm font-semibold text-charcoal-muted">
              Loading category outfits...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-boutique-200 space-y-4">
            <h3 className="font-serif font-bold text-xl text-burgundy-950">
              No products found in {category?.name}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
              We frequently update our inventory. You can also send a custom design photo to get it stitched!
            </p>
            <button
              onClick={() => openWhatsApp({ customMessage: `Hello Reena Sharma Boutique! Do you have any custom ${category?.name} designs available?` })}
              className="bg-[#25D366] text-white font-bold px-6 py-2.5 rounded-full text-xs"
            >
              Ask on WhatsApp
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
