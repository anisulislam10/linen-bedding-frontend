
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, Heart, Share2, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <button className="text-sm font-bold text-indigo-600 hover:underline">
                {product.reviewsCount} verified reviews
              </button>
            </div>
          </div>

          <p className="text-4xl font-black text-gray-900 mb-8">${product.price.toFixed(2)}</p>
          
          <p className="text-gray-500 leading-relaxed mb-10 text-lg">
            {product.description} Experience the perfect blend of performance and style. This limited edition item is crafted from premium materials to ensure durability and aesthetic appeal.
          </p>

          <div className="space-y-8 pb-10 border-b border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-gray-900 p-2 font-bold">-</button>
                <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-gray-900 p-2 font-bold">+</button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add to Cart</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex-1 flex items-center justify-center space-x-2 border-2 border-gray-100 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" />
                <span>Add to Wishlist</span>
              </button>
              <button className="p-3 border-2 border-gray-100 rounded-2xl text-gray-400 hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-indigo-600 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">Free Delivery</h5>
                <p className="text-xs text-gray-400 mt-1">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-indigo-600 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">2 Year Warranty</h5>
                <p className="text-xs text-gray-400 mt-1">On all electronics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-indigo-600 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm">Easy Returns</h5>
                <p className="text-xs text-gray-400 mt-1">30 days period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 pt-20">
        <div className="flex space-x-12 mb-10 border-b border-gray-100">
          {['Description', 'Specifications', 'Reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab.toLowerCase() ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="max-w-4xl leading-relaxed text-gray-500 text-lg">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <p>Designed for the ultimate user experience, this product combines cutting-edge technology with high-quality materials. Every detail has been meticulously considered to ensure maximum performance and longevity.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Premium build quality with aerospace-grade materials.</li>
                <li>Innovative design that prioritizes both form and function.</li>
                <li>Seamless integration with your existing ecosystem.</li>
                <li>Extended battery life and rapid charging capabilities.</li>
              </ul>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                ['Model', 'LUM-2024-PX'],
                ['Material', 'Recycled Aluminum & Glass'],
                ['Weight', '450g'],
                ['Dimensions', '240 x 180 x 45 mm'],
                ['Battery Life', 'Up to 24 hours'],
                ['Connectivity', 'USB-C, Bluetooth 5.2']
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-50">
                  <span className="font-bold text-gray-900">{key}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {[1, 2].map(r => (
                <div key={r} className="bg-gray-50 p-8 rounded-3xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">JD</div>
                      <div>
                        <h6 className="font-bold text-gray-900 text-sm">Jane Doe</h6>
                        <span className="text-xs text-gray-400">Verified Purchaser • 2 days ago</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Absolutely amazing quality! It exceeded my expectations in every way. The shipping was incredibly fast too. Highly recommend!</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
