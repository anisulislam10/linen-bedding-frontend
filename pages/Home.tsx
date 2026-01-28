import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck,
  Headphones,
  MoveRight,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Book,
  Trophy,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';
import { contentService } from '../services/contentService';
import AdBanner from '../components/common/AdBanner';

// Helper function to normalize product for backward compatibility
const normalizeProduct = (product: any): Product => ({
  ...product,
  id: product._id || product.id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || product.reviewsCount || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
});

const HeroBlade: React.FC<{ category: string; index: number; products: Product[] }> = ({ category, index, products }) => {
  const categoryProducts = useMemo(() =>
    products.filter(p => {
      const prodCategory = typeof p.category === 'string' ? p.category : p.category?.name;
      return prodCategory === category;
    })
    , [category, products]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (categoryProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % categoryProducts.length);
    }, 6000 + (index * 1500));
    return () => clearInterval(timer);
  }, [categoryProducts.length, index]);

  const product = categoryProducts[currentIdx] || products[0];
  if (!product) return null;

  const normalizedProduct = normalizeProduct(product);

  return (
    <div className="hero-blade relative h-[60vh] xs:h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] 2xl:h-[90vh] w-full flex-1 snap-center group overflow-hidden border-r border-white/10 last:border-0">
      <div className="absolute inset-0">
        <img
          src={normalizedProduct.image}
          alt={normalizedProduct.name}
          className="w-full h-full object-cover grayscale-[0.3] brightness-[0.5] md:brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-[0.8] transition-all duration-[2000ms] animate-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 flex flex-col justify-end z-10">
        <div className="overflow-hidden mb-1 xs:mb-2 sm:mb-3 md:mb-4">
          <span className="inline-block text-indigo-400 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] xs:tracking-[0.5em] sm:tracking-[0.6em] md:translate-y-full group-hover:translate-y-0 transition-transform duration-700">
            Series // {index + 1}
          </span>
        </div>

        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light text-white leading-[0.9] tracking-tighter mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10 md:transition-transform duration-1000 group-hover:-translate-y-2 md:group-hover:-translate-y-4 uppercase">
          {category}
        </h2>

        <div className="md:opacity-0 group-hover:opacity-100 md:translate-y-8 lg:translate-y-12 group-hover:translate-y-0 transition-all duration-1000 delay-150">
          <p className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 hidden xs:block">
            {normalizedProduct.description?.split('.')[0] || 'Premium quality product.'}.
          </p>
          <Link
            to={`/products/${normalizedProduct.slug || normalizedProduct.id}`}
            className="inline-flex items-center space-x-2 xs:space-x-3 sm:space-x-4 bg-white text-black px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-bold text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-lg xs:shadow-xl sm:shadow-2xl"
          >
            <span>Acquire Object</span>
            <ArrowRight className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Type guard to check if data has products property
const isPaginatedResponse = (data: any): data is { products: Product[]; pagination: any } => {
  return data && typeof data === 'object' && 'products' in data && 'pagination' in data;
};

// Helper function to extract products from response
const extractProducts = (data: any): Product[] => {
  if (Array.isArray(data)) {
    return data;
  } else if (isPaginatedResponse(data)) {
    return data.products;
  } else if (data && typeof data === 'object' && 'products' in data) {
    return data.products;
  }
  return [];
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Fetch products and categories in parallel
        const [productsData, categoriesData, contentData] = await Promise.all([
          productService.getProducts({ limit: 100 }),
          productService.getCategories(),
          contentService.getContent('home_page')
        ]);

        // Extract products from response
        const extractedProducts = extractProducts(productsData);
        setProducts(extractedProducts);
        setCmsContent(contentData);

        if (contentData?.siteSettings?.seoKeywords) {
          let meta = document.querySelector('meta[name="keywords"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'keywords');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', contentData.siteSettings.seoKeywords);
        }

        // Extract hero products
        const heroes = extractedProducts.filter((p: any) => p.isHero);
        setHeroProducts(heroes.length > 0 ? heroes : extractedProducts.slice(0, 3));

        // Set categories
        if (Array.isArray(categoriesData)) {
          const categoryNames = categoriesData.map((c: any) => c.name || c);
          setCategories(['All', ...categoryNames]);
        } else {
          setCategories(['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Sports']);
        }

      } catch (err: any) {
        console.error('Failed to fetch content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState(['00', '00', '00']);

  useEffect(() => {
    if (!cmsContent?.flashSale?.endTime) return;
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(cmsContent.flashSale.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(['00', '00', '00']);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft([
          hours.toString().padStart(2, '0'),
          minutes.toString().padStart(2, '0'),
          seconds.toString().padStart(2, '0')
        ]);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cmsContent]);

  // Use simple categories for hero blades
  const heroCategories = useMemo(() => {
    if (categories.length <= 1) return ['Electronics', 'Clothing', 'Home'];
    return categories.filter(c => c !== 'All').slice(0, 3);
  }, [categories]);

  // Use dynamic categories for the quick links
  const displayCategories = useMemo(() => {
    return categories.length > 1 ? categories : ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
  }, [categories]);

  const categoryIcons: Record<string, any> = {
    'Electronics': Smartphone,
    'Clothing': Shirt,
    'Home': HomeIcon,
    'Books': Book,
    'Sports': Trophy,
    'All': Layers
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 border-3 xs:border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 xs:mb-4"></div>
          <p className="text-gray-600 text-sm xs:text-base">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-sm xs:text-base mb-3 xs:mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 xs:px-5 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm xs:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const normalizedProducts = products.map(normalizeProduct);

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col xs:flex-row bg-black overflow-x-auto xs:snap-x xs:snap-mandatory no-scrollbar pt-16 xs:pt-0">
        <div className="flex xs:hidden flex-col">
          {heroCategories.map((cat, i) => (
            <HeroBlade key={cat} category={cat} index={i} products={products} />
          ))}
        </div>
        <div className="hidden xs:flex">
          {heroCategories.map((cat, i) => (
            <HeroBlade key={cat} category={cat} index={i} products={products} />
          ))}
        </div>

        <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 xs:gap-3 sm:gap-4 pointer-events-none hidden xs:flex">
          <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.6em] xs:tracking-[0.7em] sm:tracking-[0.8em]">Explore Ledger</span>
          <div className="w-[1px] h-8 xs:h-10 sm:h-12 md:h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="relative -mt-4 xs:-mt-6 sm:-mt-8 md:-mt-10 z-30 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl xs:rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-lg xs:shadow-xl sm:shadow-2xl border border-gray-100 flex items-center justify-between gap-2 xs:gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-3 xs:py-4">
            {displayCategories.map(cat => {
              const Icon = categoryIcons[cat] || Layers;
              return (
                <Link
                  key={cat}
                  to={cat === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                  className="flex flex-col items-center min-w-[60px] xs:min-w-[70px] sm:min-w-[80px] md:min-w-[90px] lg:min-w-[100px] group transition-all px-1"
                >
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center mb-1 xs:mb-2 sm:mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs xs:shadow-sm">
                    <Icon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider xs:tracking-widest text-gray-500 group-hover:text-black text-center break-words max-w-[60px] xs:max-w-[70px]">
                    {cat}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLASH DEALS */}
      {(cmsContent?.flashSale?.enabled !== false) && (
        <section className="max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 gap-4 xs:gap-6 sm:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3 sm:mb-4">
                <Zap className="h-4 w-4 xs:h-5 xs:w-5 text-indigo-600 fill-indigo-600" />
                <span className="text-indigo-600 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em]">
                  {cmsContent?.flashSale?.subtitle || 'Limited Availability'}
                </span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-tight uppercase">
                {cmsContent?.flashSale?.title ? (
                  <>
                    {cmsContent.flashSale.title.split(' ')[0]} <span className="font-extrabold">{cmsContent.flashSale.title.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <>Flash <span className="font-extrabold">Artifacts</span></>
                )}
              </h2>
            </div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-gray-300 uppercase tracking-wider xs:tracking-widest whitespace-nowrap">Ends In:</span>
                <div className="flex gap-1 xs:gap-2">
                  {timeLeft.map((n, i) => (
                    <div key={i} className="bg-black text-white w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-md xs:rounded-lg flex items-center justify-center font-bold text-[10px] xs:text-xs sm:text-sm">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/products" className="group flex items-center space-x-2 xs:space-x-3 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-wider xs:tracking-widest text-gray-400 hover:text-black transition-colors">
                <span>View All</span>
                <MoveRight className="h-3 w-3 xs:h-4 xs:w-4 group-hover:translate-x-1 xs:group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {cmsContent?.flashSale?.products && cmsContent.flashSale.products.length > 0
              ? cmsContent.flashSale.products.map(normalizeProduct).map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : normalizedProducts
                  .slice(0, 6)
                  .map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      {/* AD BANNER */}
      <AdBanner />

      {/* CURATED GRID */}
      <section className="max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-12 xs:pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="bg-gray-900 rounded-xl xs:rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] lg:rounded-[3rem] p-4 xs:p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-24 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-40">
            <img
              src={cmsContent?.collectiveIndex?.image || (products.length > 0 ? (products.find(p => p.featured)?.image || products[Math.floor(Math.random() * products.length)]?.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000")}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]"
              alt="Collective Index"
            />
          </div>
          <div className="relative z-10 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <span className="text-indigo-400 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] xs:tracking-[0.5em] mb-2 xs:mb-3 sm:mb-4 md:mb-6 block">
              {cmsContent?.collectiveIndex?.title || 'The Collective Index'}
            </span>
            <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light tracking-tighter leading-none mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 text-white">
              {cmsContent?.collectiveIndex?.heading || (
                <>Artifacts <br /> <span className="font-extrabold uppercase italic">of Refinement</span></>
              )}
            </h3>
            <p className="text-gray-400 text-xs xs:text-sm sm:text-base md:text-lg font-light leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
              {cmsContent?.collectiveIndex?.description || "Explore our curated ledger of professional-grade essentials. Each piece is verified for origin, quality, and aesthetic longevity."}
            </p>
            <Link 
              to="/products" 
              className="bg-white text-black px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-black text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider xs:tracking-widest hover:bg-indigo-600 hover:text-white transition-all inline-block"
            >
              {cmsContent?.collectiveIndex?.buttonText || 'Browse Collective'}
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST CATALOG ADDITIONS */}
      <section className="max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-12 xs:pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter mb-6 xs:mb-8 sm:mb-10 md:mb-12 flex items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          Latest Catalog Additions 
          <div className="h-px flex-1 bg-gray-100 hidden xs:block"></div>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {normalizedProducts
            .slice(0, cmsContent?.latestAdditions?.count || 8)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* TRUST INDEX */}
      <section className="bg-gray-50 py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xs:gap-10 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
          <div className="group">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center shadow-luxury mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <Truck className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-base xs:text-lg sm:text-xl font-bold uppercase tracking-tight mb-1 xs:mb-2 sm:mb-3 md:mb-4">Express Logistics</h4>
            <p className="text-gray-500 text-xs xs:text-sm sm:text-base font-light leading-relaxed">
              Secured transit routes across 40+ territories with real-time biometric tracking.
            </p>
          </div>
          <div className="group">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center shadow-luxury mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <ShieldCheck className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-base xs:text-lg sm:text-xl font-bold uppercase tracking-tight mb-1 xs:mb-2 sm:mb-3 md:mb-4">Origin Verified</h4>
            <p className="text-gray-500 text-xs xs:text-sm sm:text-base font-light leading-relaxed">
              Direct manufacturer partnerships ensuring every artifact in our catalog is 100% genuine.
            </p>
          </div>
          <div className="group md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center shadow-luxury mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <Headphones className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="text-base xs:text-lg sm:text-xl font-bold uppercase tracking-tight mb-1 xs:mb-2 sm:mb-3 md:mb-4">Global Concierge</h4>
            <p className="text-gray-500 text-xs xs:text-sm sm:text-base font-light leading-relaxed">
              Our elite support collective is available 24/7 to facilitate your acquisition journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;