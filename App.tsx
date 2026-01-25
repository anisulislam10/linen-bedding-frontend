
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
import AdminLogin from './pages/admin/AdminLogin';
import TrackOrder from './pages/TrackOrder';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdDisplayManager from './components/common/AdDisplayManager';


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
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardOverview />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/reviews" element={<ReviewManagement />} />
              <Route path="/admin/content" element={<ContentManagement />} />
              <Route path="/admin/ads" element={<AdManagement />} />
              <Route path="/admin/wishlist" element={<WishlistManagement />} />
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
