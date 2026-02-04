
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Leaf, Award, Recycle } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { Product } from '../types';
import { productService } from '../services/productService';
import { contentService } from '../services/contentService';
import Testimonials from '../components/sections/Testimonials';

const normalizeProduct = (product: any): Product => ({
  ...product,
  id: product._id || product.id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || product.reviewsCount || 0,
  category: typeof product.category === 'string' ? product.category : product.category?.name || 'All',
});

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, contentData] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          productService.getCategories(),
          contentService.getContent('home_page')
        ]);

        // Handle Products
        let prods = [];
        if (productsData.products) prods = productsData.products;
        else if (Array.isArray(productsData)) prods = productsData;

        // Handle Categories
        let cats = [];
        if (Array.isArray(categoriesData)) {
          cats = categoriesData;
        } else if ((categoriesData as any)?.categories && Array.isArray((categoriesData as any).categories)) {
          cats = (categoriesData as any).categories;
        }

        setProducts(prods.map(normalizeProduct));
        setCategories(cats);
        setCmsContent(contentData);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-sand flex items-center justify-center text-primary font-serif">Loading...</div>;

  const hero = cmsContent?.hero || {};
  const impact = cmsContent?.impact || {};
  const usps = cmsContent?.usps || [
    { icon: 'leaf', text: '100% Organic & Fairtrade' },
    { icon: 'recycle', text: 'Sustainable Materials' },
    { icon: 'star', text: 'Rated 4.8/5 by our customers' }
  ];

  return (
    <div className="bg-sand text-primary">
      {/* 1. USP Bar (Top of Home) */}
      <div className="bg-sage/10 py-3 border-b border-sage/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-xs md:text-sm font-sans tracking-wide text-primary/80">
          {usps.map((usp: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              {idx === 0 && <Leaf className="h-4 w-4" />}
              {idx === 1 && <Recycle className="h-4 w-4" />}
              {idx === 2 && <Star className="h-4 w-4" />}
              <span>{usp.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src={hero.image || "https://images.unsplash.com/photo-1595521624992-48a59d495e6d?q=80&w=2487&auto=format&fit=crop"}
          alt="Luxury Bedding"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center p-6">
          <span className="text-white text-sm md:text-base uppercase tracking-[0.2em] mb-4">
            {hero.subtitle || 'The New Collection'}
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-serif font-medium mb-8">
            {hero.title || "Sleep in Nature's"} <br /> <span className="italic">{hero.highlight || "Embrace"}</span>
          </h1>
          <Link
            to={hero.link || "/products"}
            className="bg-white text-primary px-8 py-3 md:px-10 md:py-4 rounded-sm text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-sage hover:text-white transition-colors"
          >
            {hero.buttonText || 'Shop Collection'}
          </Link>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Our Collections</h2>
          <p className="text-primary/60 max-w-lg mx-auto font-sans">
            Discover our range of sustainable essentials, crafted with care for you and the planet.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <Link key={cat._id || idx} to={`/products?category=${cat.name || cat}`} className="group block text-center">
              <div className="aspect-[4/5] bg-stone/20 overflow-hidden mb-4 relative rounded-md shadow-sm group-hover:shadow-lg transition-all duration-300">
                <img
                  src={cat.image?.url || cat.image || `https://images.unsplash.com/photo-1522771753035-0a15395037be?q=80&w=1000&auto=format&fit=crop`}
                  onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1522771753035-0a15395037be?q=80&w=1000')}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-serif font-medium group-hover:text-sage transition-colors">{cat.name || cat}</h3>
            </Link>
          ))}
          {categories.length === 0 && (
            ['Bedding', 'Bath', 'Robes', 'Accessories'].map((cat, idx) => (
              <Link key={idx} to="/products" className="group block text-center">
                <div className="aspect-[4/5] bg-stone/20 overflow-hidden mb-4 rounded-sm">
                  <div className="w-full h-full bg-gray-200" />
                </div>
                <h3 className="text-lg font-serif font-medium group-hover:text-sage transition-colors">{cat}</h3>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 4. Bestsellers / Favorites */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sage text-xs uppercase tracking-widest font-bold block mb-2">Most Loved</span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium">Bestsellers</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm border-b border-transparent hover:border-primary pb-0.5">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/products" className="btn-primary inline-flex">View All</Link>
          </div>
        </div>
      </section>

      {/* 5. Our Impact / Story */}
      <section className="py-24 px-6 bg-sage/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[4/5] order-2 md:order-1">
            <img
              src={impact.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2000"}
              alt="Sustainable Cotton"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 text-sage mb-4">
              <Award className="h-5 w-5" />
              <span className="text-xs uppercase tracking-widest font-bold">Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 leading-tight">
              {impact.title || "Change the World"} <br /> <span className="italic text-primary/70">{impact.highlight || "While You Sleep"}</span>
            </h2>
            <p className="text-primary/70 font-sans leading-relaxed mb-8">
              {impact.description || "We believe that luxury shouldn't cost the earth. That's why every product is crafted from 100% organic, Fairtrade certified materials. We work directly with farmers and artisans to ensure ethical production and exceptional quality."}
            </p>
            <div className="grid grid-cols-3 gap-8 mb-8 border-t border-primary/10 pt-8">
              <div>
                <h4 className="font-serif text-2xl mb-1">100%</h4>
                <p className="text-xs text-primary/60 uppercase tracking-wider">Organic</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-1">0%</h4>
                <p className="text-xs text-primary/60 uppercase tracking-wider">Plastics</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-1">Fair</h4>
                <p className="text-xs text-primary/60 uppercase tracking-wider">Trade</p>
              </div>
            </div>
            <Link to="/about" className="inline-block border-b border-primary pb-1 hover:text-sage hover:border-sage transition-colors text-sm uppercase tracking-widest font-bold">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* 6. Newsletter / CTA (Handled by Footer but added extra callout) */}
      <section className="py-24 px-6 text-center bg-sand">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-medium mb-4">Join the Collective</h2>
          <p className="text-primary/60 mb-8">Sign up for early access to new collections and sustainable living tips.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email address" className="flex-1 bg-white border border-transparent px-4 py-3 text-sm focus:border-sage outline-none" />
            <button className="bg-primary text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-sage transition-colors">Sign Up</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;