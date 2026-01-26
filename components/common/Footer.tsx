
import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Github, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';

const Footer: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, cats] = await Promise.all([
          contentService.getContent('home_page'),
          productService.getCategories()
        ]);
        setCmsContent(content);
        setCategories(cats.map((c: any) => c.name).slice(0, 4));
      } catch (err) {
        console.error('Failed to load footer data');
      }
    };
    fetchData();
  }, []);

  const footer = cmsContent?.footer;
  const siteSettings = cmsContent?.siteSettings;

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
              {siteSettings?.siteName?.replace('.', '') || 'Avenly by Huma'}<span className="text-indigo-600">.</span>
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-[1.8] max-w-xs">
              {footer?.description || 'Curating premium essentials for your modern lifestyle. Quality meets aesthetic in every piece we offer.'}
            </p>
            <div className="flex space-x-6">
              {footer?.socialLinks?.facebook && (
                <a href={footer.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-black transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.twitter && (
                <a href={footer.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-black transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.instagram && (
                <a href={footer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-black transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.github && (
                <a href={footer.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-black transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Collective Index</h4>
            <ul className="space-y-5">
              <li><Link to="/products" className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">All Artifacts</Link></li>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Client Service</h4>
            <ul className="space-y-5">
              <li><Link to="#" className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Shipping Protocol</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Returns Ledger</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Order Tracking</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Contact Terminal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-10">Intelligence Link</h4>
            <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8">
              {footer?.newsletterText || 'Subscribe to receive the latest updates on new arrivals and curated collections.'}
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-black transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                Connect
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
          <p>{footer?.copyrightText || `© ${new Date().getFullYear()} Avenly by Huma Artifacts. Recorded Rights.`}</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link to="#" className="hover:text-black transition-colors">Privacy Lexicon</Link>
            <Link to="#" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
