
import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';
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
    <footer className="bg-primary text-sand pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
              {siteSettings?.siteName || 'Avenly by Huma'}
            </Link>
            <p className="text-sand/70 text-sm font-sans leading-relaxed max-w-xs">
              {footer?.description || 'Curating sustainable luxury for the modern home. Mindfully crafted, ethically sourced.'}
            </p>
            <div className="flex space-x-5">
              {footer?.socialLinks?.facebook && (
                <a href={footer.socialLinks.facebook} className="text-sand/60 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.twitter && (
                <a href={footer.socialLinks.twitter} className="text-sand/60 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.instagram && (
                <a href={footer.socialLinks.instagram} className="text-sand/60 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footer?.socialLinks?.github && (
                <a href={footer.socialLinks.github} className="text-sand/60 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-6 text-sage">Collections</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Shop All</Link></li>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sand/70 hover:text-white text-sm font-sans transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-6 text-sage">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping-returns" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/track-order" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Track Order</Link></li>
              <li><Link to="/faq" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-6 text-sage">Newsletter</h4>
            <p className="text-sand/70 text-sm font-sans mb-6">
              {footer?.newsletterText || 'Join our community for eco-conscious living tips and exclusive offers.'}
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-sm text-sand placeholder:text-sand/30 focus:border-sage outline-none transition-colors"
              />
              <button className="bg-sage text-white py-3 px-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-stone hover:text-primary transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sand/40 font-sans">
          <p>{footer?.copyrightText || `© ${new Date().getFullYear()} Avenly by Huma. All Rights Reserved.`}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
