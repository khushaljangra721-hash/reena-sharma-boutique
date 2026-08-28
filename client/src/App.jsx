import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BoutiqueProvider } from './context/BoutiqueContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EnquiryModal } from './components/EnquiryModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AdminLayout } from './components/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { BridalLoungePage } from './pages/BridalLoungePage';
import { OffersPage } from './pages/OffersPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { CustomDesignsPage } from './pages/CustomDesignsPage';
import { VideosPage } from './pages/VideosPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

import { ErrorBoundary } from './components/ErrorBoundary';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for customer-facing pages
const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream pb-14 md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
      <EnquiryModal />
      <QuickViewModal />
      <CustomerAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <BoutiqueProvider>
          <ScrollToTop />
          <Routes>
          {/* Public Customer Pages */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <HomePage />
              </CustomerLayout>
            }
          />
          <Route
            path="/shop"
            element={
              <CustomerLayout>
                <ShopPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/product/:slug"
            element={
              <CustomerLayout>
                <ProductDetailPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/categories"
            element={
              <CustomerLayout>
                <CategoriesPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/category/:slug"
            element={
              <CustomerLayout>
                <CategoryPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/bridal"
            element={
              <CustomerLayout>
                <BridalLoungePage />
              </CustomerLayout>
            }
          />
          <Route
            path="/offers"
            element={
              <CustomerLayout>
                <OffersPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/new-arrivals"
            element={
              <CustomerLayout>
                <NewArrivalsPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/custom-designs"
            element={
              <CustomerLayout>
                <CustomDesignsPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/videos"
            element={
              <CustomerLayout>
                <VideosPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/about"
            element={
              <CustomerLayout>
                <AboutPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <CustomerLayout>
                <ContactPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <CustomerLayout>
                <WishlistPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <CustomerLayout>
                <CustomerProfilePage />
              </CustomerLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <CustomerLayout>
                <PrivacyPolicyPage />
              </CustomerLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <CustomerLayout>
                <TermsPage />
              </CustomerLayout>
            }
          />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/edit/:id" element={<AdminProductFormPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Catch-all */}
          <Route
            path="*"
            element={
              <CustomerLayout>
                <NotFoundPage />
              </CustomerLayout>
            }
          />
          </Routes>
        </BoutiqueProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}
