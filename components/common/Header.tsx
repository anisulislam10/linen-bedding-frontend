
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, ArrowRight, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';

import { productService } from '../../services/productService';
import { contentService } from '../../services/contentService';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

const Header: React.FC<{ onCartOpen: () => void }> = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [categories, setCategories] = useState<string[]>(['All']);
  const [headerConfig, setHeaderConfig] = useState({ topBarText: '', announcementEnabled: true });
  const [siteSettings, setSiteSettings] = useState<{ siteName: string; logoUrl: string }>({ siteName: 'Avenly by Huma', logoUrl: '' });
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productService.getCategories();
        const catNames = ['All', ...cats.map((c: any) => c.name)];
        setCategories(catNames);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };

    const fetchSettings = async () => {
      try {
        const content = await contentService.getContent('home_page');
        if (content) {
          if (content.siteSettings) {
            setSiteSettings({
              siteName: content.siteSettings.siteName || 'Avenly by Huma',
              logoUrl: content.siteSettings.logoUrl || ''
            });
            if (content.siteSettings.siteName) document.title = content.siteSettings.siteName;
          }
          if (content.header) {
            setHeaderConfig({
              topBarText: content.header.topBarText || '100% Organic & Fairtrade | Free Shipping',
              announcementEnabled: content.header.announcementEnabled ?? true
            });
          }
        }
      } catch (err) {
        console.error('Failed to load site settings');
      }
    };

    fetchCategories();
    fetchSettings();
  }, []);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingOrderId) return;
    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setTrackingResult(null);
      const order = await orderService.trackOrder(trackingOrderId);
      setTrackingResult(order);
    } catch (err: any) {
      setTrackingError(err.message || 'Tracking failed. Invalid ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.state?.openLogin) {
      setShowLogin(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const isHome = location.pathname === '/';

  // Styles for Eco-Luxury - Always visible navbar
  const headerClass = `fixed top-0 left-0 w-full z-[100] transition-all duration-500 flex flex-col bg-sand/95 backdrop-blur-md shadow-sm text-primary`;

  const linkClass = `text-sm font-medium tracking-wide transition-colors duration-300 font-sans text-primary hover:text-sage`;

  return (
    <>
      <header className={headerClass}>
        {headerConfig.announcementEnabled && (
          <div className="bg-sage text-white py-2 text-center text-[10px] md:text-xs font-medium tracking-widest uppercase transition-all">
            {headerConfig.topBarText}
          </div>
        )}
        <div className={`w-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between ${isScrolled || !isHome ? 'py-4' : 'py-6'}`}>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-primary"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/products" className={linkClass}>Shop</Link>
            {categories.filter(c => c !== 'All').slice(0, 3).map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} className={linkClass}>
                {cat}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-serif font-bold tracking-tight absolute left-1/2 -translate-x-1/2 text-primary flex items-center justify-center"
          >
            {siteSettings.logoUrl ? (
              <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-10 w-auto object-contain" />
            ) : (
              <span>{siteSettings.siteName}</span>
            )}
          </Link>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-primary hover:text-sage transition-colors duration-300"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setTrackingModalOpen(true)}
              className="hidden sm:block text-xs font-bold uppercase tracking-widest text-primary hover:text-sage transition-colors duration-300"
            >
              Track
            </button>

            {isLoggedIn ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center gap-2 text-primary hover:text-sage transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                {/* Simple Dropdown on Hover could go here, keeping it clean for now */}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden sm:block text-sm font-medium text-primary hover:text-sage transition-colors"
              >
                Login
              </button>
            )}

            <button
              onClick={onCartOpen}
              className="relative group flex items-center gap-2 text-primary hover:text-sage transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-sage text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Modal - Google-like Professional Design */}
        {searchOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
              {/* Search Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Search Products</h2>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Google-like Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search for products..."
                      className="w-full pl-12 pr-4 py-4 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <button type="submit" className="sr-only">Search</button>
                </form>
              </div>

              {/* Quick Links/Suggestions */}
              <div className="p-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Bedding', 'Towels', 'Organic Cotton', 'Linen Sheets'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/products?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[150] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-sand z-[160] lg:hidden transform transition-transform duration-500 ease-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-8 px-10">
          <div className="flex items-center justify-between mb-16">
            <span className="text-xl font-serif font-bold text-primary">{siteSettings.siteName}</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
              <X className="h-6 w-6 text-primary" />
            </button>
          </div>

          <nav className="flex flex-col space-y-8">
            <Link to="/" className="text-2xl font-serif text-primary hover:text-sage transition-colors">Home</Link>
            <Link to="/products" className="text-2xl font-serif text-primary hover:text-sage transition-colors">Shop All</Link>
            {categories.filter(c => c !== 'All').map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="text-2xl font-serif text-primary hover:text-sage transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-primary/10 space-y-6">
            {!isLoggedIn && (
              <button onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }} className="text-lg font-sans text-primary block">
                Login / Register
              </button>
            )}
            {isLoggedIn && (
              <div className="flex flex-col gap-4">
                <Link to="/profile" className="text-lg font-sans text-primary">My Account</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-lg font-sans text-red-500 text-left">Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Auth & Tracking Modals - styling simplified/aligned */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}

      {/* Tracking Modal (Simplified styling) */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-sand w-full max-w-md rounded-lg p-8 shadow-2xl relative">
            <button onClick={() => setTrackingModalOpen(false)} className="absolute top-4 right-4 text-primary/50 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">Track Your Order</h3>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <input
                type="text"
                value={trackingOrderId}
                onChange={e => setTrackingOrderId(e.target.value)}
                placeholder="Order ID"
                className="w-full bg-white p-3 rounded-md border border-primary/20 outline-none focus:border-sage"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full bg-primary text-sand py-3 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-sage transition-colors"
              >
                {trackingLoading ? 'Checking...' : 'Track'}
              </button>
            </form>
            {trackingError && <p className="mt-4 text-red-500 text-sm text-center">{trackingError}</p>}
            {trackingResult && (
              <div className="mt-6 pt-6 border-t border-primary/10">
                <p className="font-bold text-primary mb-2">Status: <span className="text-sage">{trackingResult.status}</span></p>
                <p className="text-sm text-primary/70">Total: ${trackingResult.totalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
