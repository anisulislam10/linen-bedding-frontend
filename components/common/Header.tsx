
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, ArrowRight, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../constants';

const Header: React.FC<{ onCartOpen: () => void }> = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { totalItems } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ${
          isScrolled 
            ? 'glass-header py-4 md:py-5 border-b border-gray-100 shadow-sm' 
            : 'bg-transparent py-6 md:py-10'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className={`lg:hidden p-2 -ml-2 transition-all duration-500 ${
              !isScrolled && isHome ? 'text-white' : 'text-black'
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden lg:flex items-center space-x-12">
            {[
              { label: 'Collections', path: '/products' },
              { label: 'Artifacts', path: '/products' },
              { label: 'Origin', path: '/products' }
            ].map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
                  !isScrolled && isHome ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link 
            to="/" 
            className={`text-xl md:text-2xl font-black tracking-tighter uppercase absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${
              !isScrolled && isHome ? 'text-white' : 'text-black'
            }`}
          >
            Lumina<span className="text-indigo-600">.</span>
          </Link>

          <div className="flex items-center space-x-4 md:space-x-8">
            <button 
              onClick={() => setSearchOpen(true)}
              className={`transition-all duration-500 ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              <Search className="h-5 w-5" />
            </button>
            
            <Link 
              to="/profile"
              className={`transition-all duration-500 hidden sm:block ${!isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              <User className="h-5 w-5" />
            </Link>

            <button 
              onClick={onCartOpen}
              className={`relative group flex items-center gap-2 md:gap-4 transition-all duration-700 ${
                !isScrolled && isHome ? 'text-white' : 'text-black'
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
                  {CATEGORIES.slice(1, 6).map(cat => (
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
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] lg:hidden transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <aside 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[160] lg:hidden transform transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
            {[
              { label: 'Home', path: '/' },
              { label: 'New Arrivals', path: '/products' },
              { label: 'Electronics', path: '/products?category=Electronics' },
              { label: 'Clothing', path: '/products?category=Clothing' },
              { label: 'Home Decor', path: '/products?category=Home' },
              { label: 'Sports', path: '/products?category=Sports' }
            ].map((item) => (
              <Link 
                key={item.label}
                to={item.path}
                className="text-2xl font-light tracking-tighter uppercase flex items-center justify-between group"
              >
                <span>{item.label}</span>
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
    </>
  );
};

export default Header;
