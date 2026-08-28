import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[65vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-luxury border border-boutique-200 space-y-5">
        <div className="w-16 h-16 bg-burgundy-50 text-burgundy-900 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-gold-600" />
        </div>
        <h1 className="font-serif text-5xl font-extrabold text-burgundy-950">404</h1>
        <h2 className="font-serif text-xl font-bold text-charcoal">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          The boutique page you're looking for might have been renamed or is temporarily unavailable.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto bg-burgundy-900 text-gold-200 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-burgundy-950 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto border border-boutique-300 text-charcoal px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-boutique-50 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
