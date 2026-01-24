
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, Settings, ChevronRight, LogOut, Shield } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, logout, isLoggedIn, login } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-center">Sign in to manage your orders, addresses, and wishlist.</p>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); login('john@example.com'); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input type="email" placeholder="email@example.com" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 p-4 rounded-xl outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 p-4 rounded-xl outline-none transition-all" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all">
              Sign In
            </button>
            <p className="text-center text-xs text-gray-400">Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer">Register now</span></p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="md:w-80">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-col items-center text-center mb-10">
              <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-indigo-50 mb-4" />
              <h3 className="font-black text-xl text-gray-900">{user?.name}</h3>
              <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'orders', icon: Package, label: 'My Orders' },
                { id: 'addresses', icon: MapPin, label: 'Addresses' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[600px]">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-10">Recent Orders</h2>
                <div className="space-y-6">
                  {[
                    { id: 'LUM-192837', date: 'Oct 12, 2023', total: 129.50, status: 'Delivered' },
                    { id: 'LUM-847291', date: 'Sep 24, 2023', total: 54.00, status: 'Processing' }
                  ].map(order => (
                    <div key={order.id} className="p-6 border border-gray-50 rounded-3xl hover:border-indigo-100 transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center"><Package className="h-6 w-6 text-gray-400" /></div>
                          <div>
                            <h5 className="font-black text-gray-900">{order.id}</h5>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 mb-1">${order.total.toFixed(2)}</p>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {order.status}
                            </span>
                          </div>
                          <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-10">Saved Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border-2 border-indigo-100 bg-indigo-50/20 rounded-[2rem] relative">
                    <div className="absolute top-6 right-6 px-2 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded">Default</div>
                    <h5 className="font-bold text-gray-900 mb-4">Home</h5>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      John Doe<br />
                      123 Modern Street, Apt 4B<br />
                      San Francisco, CA 94101<br />
                      United States
                    </p>
                    <button className="mt-6 text-sm font-bold text-indigo-600 hover:underline">Edit Address</button>
                  </div>
                  <button className="p-8 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center space-y-3 hover:border-indigo-400 hover:bg-indigo-50/10 transition-all text-gray-400 hover:text-indigo-600">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl font-light">+</div>
                    <span className="font-bold">Add New Address</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'orders' && activeTab !== 'addresses' && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Settings className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
                <p className="text-gray-400">Settings functionality is being updated. Check back soon!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
