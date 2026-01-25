import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/cart/StripePaymentForm';
import { Address } from '../types';
import { userService } from '../services/userService';

// Load Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC = () => {
  const { cart, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Form states for manual entry fallback
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await userService.getAddresses();
        setAddresses(data);
        const defaultAddr = data.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      } catch (err) {
        console.error('Failed to load identity coordinates');
      }
    };
    fetchAddresses();
  }, []);

  const preparePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      let finalAddress = shippingAddress;
      if (selectedAddressId) {
        const addr = addresses.find(a => a._id === selectedAddressId);
        if (addr) {
          finalAddress = `${addr.fullName}, ${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
        }
      }

      if (!finalAddress) throw new Error('Delivery vector not defined');

      // 1. Create order
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: finalAddress,
        paymentMethod: 'Stripe' as const,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      const order = await orderService.createOrder(orderData);

      // 2. Create Payment Intent
      const { clientSecret: secret } = await paymentService.createPaymentIntent(total, order._id);
      setClientSecret(secret);

      // Store order info in session to handle post-payment
      sessionStorage.setItem('pendingOrderId', order._id);
    } catch (err: any) {
      setError(err.message || 'Initialization failed');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const orderId = sessionStorage.getItem('pendingOrderId');
      if (!orderId) throw new Error('Order identification lost');

      // Update order to paid
      await orderService.updateOrderToPaid(orderId, {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: email
      });

      sessionStorage.removeItem('pendingOrderId');
      clearCart();
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err: any) {
      setError(err.message || 'Finalization failed');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <h1 className="text-4xl font-black text-gray-900 mb-12 uppercase tracking-tighter">Authorization & Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Form */}
        <div className="lg:col-span-7 space-y-12">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-6 rounded-[2rem] text-xs font-black uppercase tracking-widest border border-rose-100 flex items-center space-x-4 animate-in slide-in-from-top-4 duration-300">
              <ShieldCheck className="h-6 w-6" />
              <span>{error}</span>
            </div>
          )}

          {!clientSecret ? (
            <form onSubmit={preparePayment} className="space-y-12">
              {/* Contact Info */}
              <section>
                <div className="flex items-center space-x-4 mb-8">
                  <span className="bg-gray-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">01</span>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Identity Verification</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Communication Link</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-white border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Signal Channel</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <div className="flex items-center space-x-4 mb-8">
                  <span className="bg-gray-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">02</span>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Delivery Coordinates</h3>
                </div>

                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {addresses.map(addr => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-6 border-2 rounded-[2rem] text-left transition-all ${selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-50 hover:border-gray-200'}`}
                      >
                        <p className="font-black text-gray-900 text-sm mb-2">{addr.fullName}</p>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          {addr.streetAddress}, {addr.city}
                        </p>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAddressId('')}
                      className={`p-6 border-2 border-dashed rounded-[2rem] text-center transition-all ${!selectedAddressId ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-50'}`}
                    >
                      <span className="font-black text-xs uppercase tracking-widest text-gray-400">Custom Vector</span>
                    </button>
                  </div>
                ) : null}

                {!selectedAddressId && (
                  <div className="space-y-3 animate-in fade-in duration-500">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Manual Coordinate Entry</label>
                    <input
                      required
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="St, City, Region, Index, Country"
                      className="w-full bg-white border border-gray-100 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all shadow-sm"
                    />
                  </div>
                )}
              </section>

              <button
                disabled={isProcessing}
                type="submit"
                className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center space-x-4 hover:bg-black transition-all shadow-2xl shadow-indigo-100 disabled:opacity-70 group"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                    <span className="uppercase tracking-[0.2em] text-sm">Initializing Protocol...</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                    <span className="uppercase tracking-[0.2em] text-sm">Proceed to Secure Payment</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center space-x-4 mb-8">
                <span className="bg-gray-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">03</span>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Financial Commitment</h3>
              </div>

              <StripePaymentForm
                total={total}
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={(msg) => setError(msg)}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />

              <button
                onClick={() => {
                  setClientSecret(null);
                  setIsProcessing(false);
                }}
                className="w-full mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
                disabled={isProcessing}
              >
                ← Return to Phase 01/02
              </button>
            </section>
          )}

          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center space-x-3">
            <Lock className="h-4 w-4" />
            <span>End-to-End Encryption Active</span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-indigo-100/20">
            <h3 className="text-2xl font-black text-gray-900 mb-10 uppercase tracking-tight">Order Ledger</h3>
            <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
              {cart.map(item => {
                if (!item.product) return null;
                const productImage = item.product.images?.[0]?.url || item.product.image || item.image;
                return (
                  <div key={item.id} className="flex space-x-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-inner">
                      <img src={productImage} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-black text-gray-900 text-sm mb-1 uppercase tracking-tight">{item.name}</h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                      <p className="text-sm font-black text-gray-900 mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-5 pt-8 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Basis</span>
                <span className="text-gray-900 font-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logistics</span>
                <span className="text-gray-900 font-black">{shipping === 0 ? 'CLEARED' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Regulatory Tax</span>
                <span className="text-gray-900 font-black">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Total Allocation</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] flex items-start space-x-4 shadow-xl">
              <CheckCircle2 className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest">
                Protected by 100% satisfaction protocol. returns available for 30 cycles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
