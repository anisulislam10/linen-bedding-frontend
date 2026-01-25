
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

// Removed static CATEGORIES literal

const Header: React.FC<{ onCartOpen: () => void }> = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // New State for Features
  const [categories, setCategories] = useState<string[]>(['All']);
  const [siteSettings, setSiteSettings] = useState<{ siteName: string; logoUrl: string }>({ siteName: 'Lumina.', logoUrl: '' });
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
        // Assuming API returns objects { _id, name, ... } or strings
        // Checking productService return type... it returns any[].
        // Let's assume Backend sends objects. We need names.
        // Wait, productController.getCategories returns Category objects. 
        // We need to map them to strings or use them as objects.
        // For simplicity to match existing UI, we'll map to names.
        const catNames = ['All', ...cats.map((c: any) => c.name)];
        setCategories(catNames);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };

    const fetchSettings = async () => {
      try {
        const content = await contentService.getContent('home_page');
        if (content && content.siteSettings) {
          setSiteSettings({
            siteName: content.siteSettings.siteName || 'Lumina.',
            logoUrl: content.siteSettings.logoUrl || ''
          });
          // Update document title and description if needed, or handle in a top-level component
          if (content.siteSettings.siteName) document.title = content.siteSettings.siteName;
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
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.state?.openLogin) {
      setShowLogin(true);
      // Clear state so it doesn't reopen on refresh/nav
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ${isScrolled
          ? 'glass-header py-4 md:py-5 border-b border-gray-100 shadow-sm'
          : 'bg-transparent py-6 md:py-10'
          }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`lg:hidden p-2 -ml-2 transition-all duration-500 ${!isScrolled && isHome ? 'text-white' : 'text-black'
              }`}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden lg:flex items-center space-x-12">
            <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${!isScrolled && isHome ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
              Home
            </Link>
            <Link to="/products" className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${!isScrolled && isHome ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
              All Products
            </Link>
            {categories.filter(c => c !== 'All').slice(0, 4).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${!isScrolled && isHome ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            className={`text-xl md:text-2xl font-black tracking-tighter uppercase absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${!isScrolled && isHome ? 'text-white' : 'text-black'
              } flex items-center justify-center`}
          >
            {siteSettings.logoUrl ? (
              <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <>{siteSettings.siteName.replace('.', '')}<span className="text-indigo-600">.</span></>
            )}
          </Link>

          <div className="flex items-center space-x-4 md:space-x-8">
            <button
              onClick={() => setSearchOpen(true)}
              className={`transition-all duration-500 ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setTrackingModalOpen(true)}
              className={`transition-all duration-500 hidden sm:block text-xs font-black uppercase tracking-widest ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              Track Order
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`transition-all duration-500 hidden sm:flex items-center gap-2 ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs font-semibold">{user?.name}</span>
                </button>

                {showUserDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-indigo-600 font-bold hover:bg-indigo-50 transition"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/profile?tab=orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          setShowUserDropdown(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`transition-all duration-500 hidden sm:block text-xs font-semibold ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  Login
                </button>
              </div>
            )}

            <button
              onClick={onCartOpen}
              className={`relative group flex items-center gap-2 md:gap-4 transition-all duration-700 ${!isScrolled && isHome ? 'text-white' : 'text-black'
                }`}
            >
              <div className="relative">
                <ShoppingCart className={`h-5 w-5 transition-colors duration-500 ${!isScrolled && isHome ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block">Bag</span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="fixed inset-0 bg-white/98 backdrop-blur-3xl z-[110] flex items-center justify-center p-6 lg:p-12 animate-up">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-8 right-8 md:top-12 md:right-12 p-4 md:p-5 hover:bg-gray-50 rounded-full transition-all"
            >
              <ArrowRight className="h-6 w-6 md:h-8 md:w-8 rotate-45 text-black" />
            </button>
            <div className="w-full max-w-5xl">
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.8em] text-indigo-600 mb-8 md:mb-12 block text-center">Master Index Search</span>
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search catalog..."
                  className="w-full text-4xl md:text-6xl lg:text-9xl font-light tracking-tighter text-center border-none outline-none bg-transparent placeholder:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-4 md:gap-6">
                  {categories.slice(1, 6).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSearchQuery(cat)}
                      className="px-6 py-2 md:px-8 md:py-3 border border-gray-100 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] lg:hidden transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[160] lg:hidden transform transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="text-xl font-black uppercase tracking-tighter">
              Lumina<span className="text-indigo-600">.</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            <Link to="/" className="text-2xl font-light tracking-tighter uppercase flex items-center justify-between group">
              <span>Home</span>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link to="/products" className="text-2xl font-light tracking-tighter uppercase flex items-center justify-between group">
              <span>All Artifacts</span>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
            </Link>
            {categories.filter(c => c !== 'All').map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="text-2xl font-light tracking-tighter uppercase flex items-center justify-between group"
              >
                <span>{cat}</span>
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-50 space-y-8">
            <Link to="/profile" className="flex items-center space-x-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              <User className="h-4 w-4" />
              <span>{isLoggedIn ? user?.name : 'Member Login'}</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Auth Modals */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      {/* Tracking Modal */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setTrackingModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-all">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8">Locate Order</h3>

            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Order Identification</label>
                <input
                  type="text"
                  value={trackingOrderId}
                  onChange={e => setTrackingOrderId(e.target.value)}
                  placeholder="Order ID - 24-characters"
                  className="w-full bg-gray-50 p-4 rounded-xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50"
              >
                {trackingLoading ? 'Scanning...' : 'Track Status'}
              </button>
            </form>

            {trackingError && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center text-xs font-black uppercase tracking-widest border border-red-100">
                {trackingError}
              </div>
            )}

            {trackingResult && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-4 space-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Order Identification</span>
                  <span className="text-gray-900 font-mono text-[10px] break-all uppercase">{trackingResult._id}</span>
                </div>

                <div className="space-y-4 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                  {trackingResult.items?.map((item: any, idx: number) => (
                    <Link
                      key={idx}
                      to={`/products/${item.product?._id || item.product}`}
                      onClick={() => setTrackingModalOpen(false)}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 -m-2 rounded-xl transition-all group/item"
                    >
                      <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-900 uppercase truncate group-hover/item:text-indigo-600 transition-colors">{item.product?.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity} • ${item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Status Protocol</span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${trackingResult.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {trackingResult.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Order Amount</span>
                  <span className="text-gray-900 font-black">${trackingResult.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
