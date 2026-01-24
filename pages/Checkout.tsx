
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, subtotal, tax, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      navigate('/order-confirmation');
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-12">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Form */}
        <div className="lg:col-span-7 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Contact Info */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                  <input required type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-xl font-bold text-gray-900">Shipping Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</label>
                  <input required type="text" placeholder="123 Modern St" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">City</label>
                  <input required type="text" placeholder="San Francisco" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">State</label>
                    <input required type="text" placeholder="CA" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">ZIP</label>
                    <input required type="text" placeholder="94101" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              </div>
              <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    <span>Credit or Debit Card</span>
                  </h4>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Card Number</label>
                    <div className="relative">
                      <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Expiry Date</label>
                      <input required type="text" placeholder="MM / YY" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">CVC</label>
                      <input required type="text" placeholder="123" className="w-full bg-white border border-gray-100 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <button 
              disabled={isProcessing}
              type="submit"
              className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-4 hover:bg-black transition-all shadow-2xl disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="h-6 w-6" />
                  <span>Pay ${total.toFixed(2)}</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Payments are encrypted and secure</span>
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-500/5">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h3>
            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto scrollbar-hide">
              {cart.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h5>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900 mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className="text-gray-900 font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Estimated Tax</span>
                <span className="text-gray-900 font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-10 p-4 bg-emerald-50 rounded-2xl flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                You're eligible for our 100% Satisfaction Guarantee. Returns are free for 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
