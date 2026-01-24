
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lumina
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Curating premium essentials for your modern lifestyle. Quality meets aesthetic in every piece we offer.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-500 hover:text-indigo-600 text-sm">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="text-gray-500 hover:text-indigo-600 text-sm">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="text-gray-500 hover:text-indigo-600 text-sm">Clothing</Link></li>
              <li><Link to="/products?category=Home" className="text-gray-500 hover:text-indigo-600 text-sm">Home & Decor</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-gray-500 hover:text-indigo-600 text-sm">Shipping Policy</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-indigo-600 text-sm">Returns & Exchanges</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-indigo-600 text-sm">FAQs</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-indigo-600 text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Join Our Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="email@example.com"
                className="bg-gray-50 border border-gray-200 rounded-l-lg py-2 px-4 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2024 Lumina E-Commerce. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-600">Terms of Service</Link>
            <Link to="#" className="hover:text-gray-600">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
