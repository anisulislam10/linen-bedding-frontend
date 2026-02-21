
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartSidebar from './components/cart/CartSidebar';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Admin Imports
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import ContentManagement from './pages/admin/ContentManagement';
import AdManagement from './pages/admin/AdManagement';
import WishlistManagement from './pages/admin/WishlistManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import ReturnManagement from './pages/admin/ReturnManagement';
import SettingsOverview from './pages/admin/SettingsOverview';
import AdminLogin from './pages/admin/AdminLogin';
import TrackOrder from './pages/TrackOrder';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdDisplayManager from './components/common/AdDisplayManager';
import CookieConsent from './components/common/CookieConsent';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Static Pages
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { isOpen, closeCart, openCart } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && <Header onCartOpen={openCart} />}
      {!isAdminRoute && <CartSidebar isOpen={isOpen} onClose={closeCart} />}
      <AdDisplayManager />
      <CookieConsent />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/track-order" element={<TrackOrder />} />

          {/* Static Pages */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Auth pages */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardOverview />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/inventory" element={<ProductManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/returns" element={<ReturnManagement />} />
              <Route path="/admin/settings" element={<SettingsOverview />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/reviews" element={<ReviewManagement />} />
              <Route path="/admin/ads" element={<AdManagement />} />
              <Route path="/admin/wishlist" element={<WishlistManagement />} />
              <Route path="/admin/testimonials" element={<TestimonialManagement />} />
            </Route>
          </Route>
        </Routes>

      </main>



      {!isAdminRoute && <Footer />}
    </div >
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
