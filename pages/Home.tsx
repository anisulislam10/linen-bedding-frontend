
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
const normalizeProduct = (product: Product): Product => ({
  ...product,
  id: product._id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
});

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Sports'];


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
    <div className="hero-blade relative h-[70vh] md:h-full w-full md:w-auto shrink-0 md:shrink flex-1 snap-center group overflow-hidden border-r border-white/10 last:border-0">
      <div className="absolute inset-0">
        <img
          src={normalizedProduct.image}
          alt={normalizedProduct.name}
          className="w-full h-full object-cover grayscale-[0.3] brightness-[0.5] md:brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-[0.8] transition-all duration-[2000ms] animate-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 p-8 md:p-12 lg:p-20 flex flex-col justify-end z-10">
        <div className="overflow-hidden mb-2 md:mb-4">
          <span className="inline-block text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] md:translate-y-full group-hover:translate-y-0 transition-transform duration-700">
            Series // {index + 1}
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-8xl font-light text-white leading-[0.9] tracking-tighter mb-4 md:mb-10 md:transition-transform duration-1000 group-hover:-translate-y-4 uppercase">
          {category}
        </h2>

        <div className="md:opacity-0 group-hover:opacity-100 md:translate-y-12 group-hover:translate-y-0 transition-all duration-1000 delay-150">
          <p className="text-gray-300 text-xs md:text-sm max-w-sm mb-6 md:mb-10 font-light leading-relaxed hidden sm:block">
            {normalizedProduct.description.split('.')[0]}.
          </p>
          <Link
            to={`/products/${normalizedProduct.slug || normalizedProduct.id}`}
            className="inline-flex items-center space-x-4 md:space-x-6 bg-white text-black px-6 py-3 md:px-10 md:py-5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
          >
            <span>Acquire Object</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
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
          productService.getProducts({ limit: 100 }), // Get more to ensure we have enough
          productService.getCategories(),
          contentService.getContent('home_page')
        ]);

        setProducts(productsData.products);
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

        // Extract hero products (those marked isHero, or just first 3 if none)
        // Since isHero was just added, likely none have it true yet.
        // We will default to showing "Featured" or just random ones if no isHero.
        const heroes = productsData.products.filter((p: any) => p.isHero);
        setHeroProducts(heroes.length > 0 ? heroes : productsData.products.slice(0, 3));

        // Set categories
        setCategories(['All', ...categoriesData.map((c: any) => c.name)]);

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
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(cmsContent.flashSale.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(['00', '00', '00']);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        // If days > 0, show Days/Hours/Minutes? Or just Hours (total)? 
        // User design has 3 boxes. Let's do H/M/S for urgency, or D/H/M.
        // Let's do Hours (total) if < 100 hours, else D/H/M.
        // Simple approach: Total Hours, Minutes, Seconds.
        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft([
          totalHours.toString().padStart(2, '0'),
          minutes.toString().padStart(2, '0'),
          seconds.toString().padStart(2, '0')
        ]);
      }
    }, 1000);
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
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
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
      <section className="relative h-auto md:h-screen w-full flex flex-row bg-black overflow-x-auto snap-x snap-mandatory no-scrollbar md:overflow-hidden pt-16 md:pt-0">
        {heroCategories.map((cat, i) => (
          <HeroBlade key={cat} category={cat} index={i} products={products} />
        ))}

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none hidden md:flex">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.8em]">Explore Ledger</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="relative -mt-6 md:-mt-10 z-30 px-4 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            {displayCategories.map(cat => {
              const Icon = categoryIcons[cat] || Layers;
              return (
                <Link
                  key={cat}
                  to={cat === 'All' ? '/products' : `/products?category=${cat}`}
                  className="flex flex-col items-center min-w-[80px] md:min-w-[100px] group transition-all"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black text-center">
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
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
                <span className="text-indigo-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                  {cmsContent?.flashSale?.subtitle || 'Limited Availability'}
                </span>
              </div>
              <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-tight uppercase">
                {cmsContent?.flashSale?.title ? (
                  <>
                    {cmsContent.flashSale.title.split(' ')[0]} <span className="font-extrabold">{cmsContent.flashSale.title.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  <>Flash <span className="font-extrabold">Artifacts</span></>
                )}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-4">
                <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Ends In:</span>
                <div className="flex gap-2">
                  {timeLeft.map((n, i) => (
                    <div key={i} className="bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/products" className="group flex items-center space-x-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                <span>View All</span>
                <MoveRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {(cmsContent?.flashSale?.products && cmsContent.flashSale.products.length > 0)
              ? cmsContent.flashSale.products.map(normalizeProduct).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))
              : normalizedProducts.slice((cmsContent?.latestAdditions?.count || 6), (cmsContent?.latestAdditions?.count || 6) + 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

        </section>
      )}

      <AdBanner />

      {/* CURATED GRID */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 pb-24 md:pb-32">
        <div className="bg-gray-900 rounded-3xl md:rounded-[3rem] p-8 md:p-24 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-40">
            {/* Show CMS image if available, else random product, else fallback */}
            <img
              src={cmsContent?.collectiveIndex?.image || (products.length > 0 ? (products.find(p => p.featured)?.image || products[Math.floor(Math.random() * products.length)]?.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000")}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]"
              alt="Collective Index"
            />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 md:mb-6 block">
              {cmsContent?.collectiveIndex?.title || 'The Collective Index'}
            </span>
            <h3 className="text-3xl md:text-7xl font-light tracking-tighter leading-none mb-6 md:mb-10 text-white">
              {cmsContent?.collectiveIndex?.heading || (
                <>Artifacts <br /> <span className="font-extrabold uppercase italic">of Refinement</span></>
              )}
            </h3>
            <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed mb-8 md:mb-12">
              {cmsContent?.collectiveIndex?.description || "Explore our curated ledger of professional-grade essentials. Each piece is verified for origin, quality, and aesthetic longevity."}
            </p>
            <Link to="/products" className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all inline-block">
              {cmsContent?.collectiveIndex?.buttonText || 'Browse Collective'}
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST CATALOG ADDITIONS */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-32">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-12 flex items-center gap-6">
          Latest Catalog Additions <div className="h-px flex-1 bg-gray-100"></div>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {normalizedProducts.slice(0, (cmsContent?.latestAdditions?.count || 6)).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </section>

      {/* TRUST INDEX */}
      <section className="bg-gray-50 py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          <div className="group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-luxury mb-6 md:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <Truck className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">Express Logistics</h4>
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">Secured transit routes across 40+ territories with real-time biometric tracking.</p>
          </div>
          <div className="group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-luxury mb-6 md:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">Origin Verified</h4>
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">Direct manufacturer partnerships ensuring every artifact in our catalog is 100% genuine.</p>
          </div>
          <div className="group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-luxury mb-6 md:mb-8 group-hover:bg-black group-hover:text-white transition-all">
              <Headphones className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-3 md:mb-4">Global Concierge</h4>
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">Our elite support collective is available 24/7 to facilitate your acquisition journey.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
