
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
import { PRODUCTS, CATEGORIES } from '../constants';

const HeroBlade: React.FC<{ category: string; index: number }> = ({ category, index }) => {
  const categoryProducts = useMemo(() => 
    PRODUCTS.filter(p => p.category === category)
  , [category]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % categoryProducts.length);
    }, 6000 + (index * 1500));
    return () => clearInterval(timer);
  }, [categoryProducts.length, index]);

  const product = categoryProducts[currentIdx] || PRODUCTS[0];

  return (
    <div className="hero-blade relative h-[70vh] md:h-full w-full md:w-auto shrink-0 md:shrink flex-1 snap-center group overflow-hidden border-r border-white/10 last:border-0">
      <div className="absolute inset-0">
        <img 
          src={product.image} 
          alt={product.name} 
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
            {product.description.split('.')[0]}.
          </p>
          <Link 
            to={`/products/${product.id}`} 
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
  const heroCategories = useMemo(() => {
    const pool = ['Electronics', 'Clothing', 'Home', 'Sports'];
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const categoryIcons: Record<string, any> = {
    'Electronics': Smartphone,
    'Clothing': Shirt,
    'Home': HomeIcon,
    'Books': Book,
    'Sports': Trophy,
    'All': Layers
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative h-auto md:h-screen w-full flex flex-row bg-black overflow-x-auto snap-x snap-mandatory no-scrollbar md:overflow-hidden pt-16 md:pt-0">
        {heroCategories.map((cat, i) => (
          <HeroBlade key={cat} category={cat} index={i} />
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
            {CATEGORIES.map(cat => {
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
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
              <span className="text-indigo-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Limited Availability</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-tight uppercase">
              Flash <span className="font-extrabold">Artifacts</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-4">
               <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Ends In:</span>
               <div className="flex gap-2">
                 {['12', '45', '00'].map((n, i) => (
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
          {PRODUCTS.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CURATED GRID */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-12 pb-24 md:pb-32">
        <div className="bg-gray-900 rounded-3xl md:rounded-[3rem] p-8 md:p-24 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 md:mb-6 block">The Collective Index</span>
            <h3 className="text-3xl md:text-7xl font-light tracking-tighter leading-none mb-6 md:mb-10 text-white">
              Artifacts <br/> <span className="font-extrabold uppercase italic">of Refinement</span>
            </h3>
            <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed mb-8 md:mb-12">
              Explore our curated ledger of professional-grade essentials. Each piece is verified for origin, quality, and aesthetic longevity.
            </p>
            <Link to="/products" className="bg-white text-black px-8 py-4 md:px-12 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all inline-block">
              Browse Collective
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
          {PRODUCTS.slice(6, 12).map(product => (
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
