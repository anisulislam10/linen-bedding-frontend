
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin, Package } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const orderNumber = Math.floor(Math.random() * 900000000) + 100000000;
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-full mb-10">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-500 mb-12">
        Thank you for your order. We've sent a confirmation email to your inbox with all the details.
      </p>

      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 mb-12 text-left">
        <div className="flex justify-between items-center pb-8 border-b border-gray-50 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Order Number</p>
            <p className="font-black text-xl text-gray-900">#LUM-{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated Delivery</p>
            <p className="font-black text-xl text-emerald-600">3-5 Business Days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Shipping Address</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                John Doe<br />
                123 Modern Street, Suite 4B<br />
                San Francisco, CA 94101
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Shipping Method</h4>
              <p className="text-sm text-gray-500">
                Premium Priority Ground<br />
                (Fully Insured)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
        <Link 
          to="/products" 
          className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl shadow-gray-200"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>Continue Shopping</span>
        </Link>
        <Link 
          to="/profile" 
          className="bg-white border-2 border-gray-100 text-gray-900 px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all"
        >
          <span>Track Order</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
