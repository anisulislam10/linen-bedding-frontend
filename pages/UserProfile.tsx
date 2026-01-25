import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Package, MapPin, Settings, ChevronRight, LogOut, Shield, Plus, Edit2, Trash2, X, Lock, Camera, CheckCircle2, ArrowRight, Heart } from 'lucide-react';
import { Order, Address, Product } from '../types';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { wishlistService } from '../services/wishlistService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { user, logout, isLoggedIn, login, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // Profile Settings State
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      setProfileFormData({
        name: user?.name || '',
        phone: user?.phone || '',
      });
    }
  }, [isLoggedIn, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, addressesData, wishlistData] = await Promise.all([
        orderService.getMyOrders(),
        userService.getAddresses(),
        wishlistService.getWishlist()
      ]);
      setOrders(ordersData);
      setAddresses(addressesData);
      setWishlist(wishlistData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync with matrix');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, addressFormData);
      } else {
        await userService.addAddress(addressFormData);
      }
      setIsAddressModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert('Protocol failed: ' + err.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Terminate this delivery vector?')) {
      try {
        await userService.deleteAddress(id);
        fetchData();
      } catch (err: any) {
        alert('Deletion failed');
      }
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Password mismatch');
      return;
    }
    try {
      setSecurityLoading(true);
      setSecuritySuccess(false);
      await userService.changePassword(securityData.currentPassword, securityData.newPassword);
      setSecuritySuccess(true);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      alert(err.message || 'Cipher update failed');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const fd = new FormData();
      fd.append('name', profileFormData.name);
      fd.append('phone', profileFormData.phone);
      if (profileImage) fd.append('avatar', profileImage);

      const updated = await userService.updateProfile(fd);
      // In a real app we might need to sync the AuthContext
      alert('Identity protocols updated');
    } catch (err: any) {
      alert('Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      setLoginError(null);
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err.message || 'Encryption check failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center uppercase tracking-tighter">Terminal Access</h2>
          <p className="text-gray-400 mb-8 text-center text-xs font-bold uppercase tracking-widest leading-relaxed">Sign in to authorize access to your transaction ledger and delivery coordinates.</p>
          <form className="space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-black uppercase text-center border border-red-100">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Identity ID</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                required
                disabled={loginLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Access Cipher</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm font-bold"
                required
                disabled={loginLoading}
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-black transition-all disabled:opacity-50"
            >
              {loginLoading ? 'Initiating...' : 'Authorize Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-80">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative group">
                <img src={user?.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-indigo-50 mb-6 object-cover shadow-xl" />
                <button className="absolute bottom-6 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all text-indigo-600 hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">{user?.name}</h3>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{user?.role} // lvl.1</p>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'orders', icon: Package, label: 'Order Ledger' },
                { id: 'wishlist', icon: Heart, label: 'Wishlist' },
                { id: 'addresses', icon: MapPin, label: 'Coordinates' },
                { id: 'security', icon: Shield, label: 'Encryption' },
                { id: 'settings', icon: Settings, label: 'Preferences' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-4 p-5 rounded-2xl text-rose-500 hover:bg-rose-50 font-black text-[11px] uppercase tracking-widest mt-6"
              >
                <LogOut className="h-5 w-5" />
                <span>Terminate Session</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm min-h-[650px] relative overflow-hidden">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase">Transaction Record</h2>
                    <div className="space-y-8">
                      {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem]">
                          <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Matrix empty. No transactions recorded.</p>
                        </div>
                      ) : (
                        orders.map(order => (
                          <div key={order._id} className="p-8 border border-gray-100 rounded-[2.5rem] bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-50/20 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50">
                              <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600">
                                  <Package className="h-8 w-8" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-black text-[11px] text-gray-400 uppercase tracking-widest mb-1">Transaction Link</h5>
                                  <p className="font-mono text-sm text-gray-900 break-all uppercase selection:bg-indigo-100">{order._id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Total Allocation</p>
                                  <p className="text-xl font-black text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Status Protocol</p>
                                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg inline-block ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                    order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h6 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 ml-1">Ordered Artifacts</h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {order.items.map((item: any, idx: number) => (
                                  <Link
                                    key={idx}
                                    to={`/products/${item.product?._id || item.product}`}
                                    className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-indigo-50 transition-all group/item"
                                  >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                      <img
                                        src={item.product?.images?.[0]?.url || item.product?.image || '/placeholder.png'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] font-black text-gray-900 uppercase truncate group-hover/item:text-indigo-600">{item.product?.name || 'Unknown Artifact'}</p>
                                      <p className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:text-indigo-600 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                              <span>Registration: {new Date(order.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-2">
                                Tracking: <span className="text-gray-900 font-mono">{order.trackingNumber || 'PENDING'}</span>
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-12">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Delivery Vectors</h2>
                      <button
                        onClick={() => { setEditingAddress(null); setAddressFormData({ fullName: '', phoneNumber: '', streetAddress: '', city: '', state: '', postalCode: '', country: 'USA', isDefault: false }); setIsAddressModalOpen(true); }}
                        className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Vector</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {addresses.map(address => (
                        <div key={address._id} className={`p-10 border-2 rounded-[2.5rem] relative transition-all hover:shadow-lg ${address.isDefault ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-50 bg-white'}`}>
                          {address.isDefault && (
                            <div className="absolute top-8 right-8 px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">Primary</div>
                          )}
                          <div className="flex items-center space-x-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${address.isDefault ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <MapPin className="w-5 h-5" />
                            </div>
                            <h5 className="font-black text-gray-900 text-sm uppercase tracking-tight">Location Matrix</h5>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            <span className="text-gray-900 font-bold">{address.fullName}</span><br />
                            {address.streetAddress}<br />
                            {address.city}, {address.state} {address.postalCode}<br />
                            <span className="uppercase tracking-widest text-[10px] text-gray-400">{address.country}</span>
                          </p>
                          <div className="mt-8 flex items-center space-x-4">
                            <button
                              onClick={() => { setEditingAddress(address); setAddressFormData(address as any); setIsAddressModalOpen(true); }}
                              className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Adjust</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="flex items-center space-x-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors bg-rose-50 px-4 py-2 rounded-xl"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Purge</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )

                }

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase">Wishlist Index</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {wishlist.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2.5rem]">
                          <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your wishlist is currently void.</p>
                          <Link to="/products" className="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Explore Artifacts</Link>
                        </div>
                      ) : (
                        wishlist.map(product => (
                          <div key={product._id} className="group p-6 border border-gray-100 rounded-[2.5rem] bg-white hover:border-indigo-100 transition-all flex items-center space-x-6">
                            <Link to={`/products/${product._id}`} className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img
                                src={product.images?.[0]?.url || (product as any).image}
                                alt={product.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/products/${product._id}`}>
                                <h4 className="font-black text-sm text-gray-900 uppercase truncate group-hover:text-indigo-600 transition-colors mb-1">{product.name}</h4>
                              </Link>
                              <p className="font-black text-indigo-600 text-sm mb-4">${product.price.toFixed(2)}</p>
                              <button
                                onClick={async () => {
                                  try {
                                    await wishlistService.toggleWishlist(product._id);
                                    setWishlist(wishlist.filter(item => item._id !== product._id));
                                    await refreshUser();  // Sync user data
                                    toast.success('Removed from wishlist');
                                  } catch (err) {
                                    toast.error('Failed to update wishlist');
                                  }
                                }}
                                className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 flex items-center space-x-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Terminate Entry</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase">Cipher Protocols</h2>
                    <form onSubmit={handleSecuritySubmit} className="space-y-8">
                      {securitySuccess && (
                        <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center space-x-4 border border-emerald-100 animate-in fade-in zoom-in duration-300">
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Access cipher successfully rotated</span>
                        </div>
                      )}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Current Cipher</label>
                          <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                              required
                              type="password"
                              value={securityData.currentPassword}
                              onChange={e => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                              placeholder="Enter existing pattern"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Pattern</label>
                            <input
                              required
                              type="password"
                              value={securityData.newPassword}
                              onChange={e => setSecurityData({ ...securityData, newPassword: e.target.value })}
                              placeholder="New cipher"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Pattern</label>
                            <input
                              required
                              type="password"
                              value={securityData.confirmPassword}
                              onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                              placeholder="Repeat pattern"
                              className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={securityLoading}
                        className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                      >
                        {securityLoading ? 'Syncing...' : 'Commit Cipher Update'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase">Identity Index</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Designation (Full Name)</label>
                          <input
                            type="text"
                            value={profileFormData.name}
                            onChange={e => setProfileFormData({ ...profileFormData, name: e.target.value })}
                            placeholder="Full identity"
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Signal Channel (Phone)</label>
                          <input
                            type="text"
                            value={profileFormData.phone}
                            onChange={e => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                            placeholder="+1234567890"
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-5 rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Avatar Uplink</label>
                          <input
                            type="file"
                            onChange={e => setProfileImage(e.target.files ? e.target.files[0] : null)}
                            className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 p-4 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-2xl disabled:opacity-50"
                      >
                        {profileLoading ? 'Updating Index...' : 'Execute Protocol Update'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                {editingAddress ? 'Modify Vector' : 'Define Vector'}
              </h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddressSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recipient</label>
                  <input
                    required
                    type="text"
                    value={addressFormData.fullName}
                    onChange={e => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    placeholder="Full name"
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Channel</label>
                  <input
                    required
                    type="tel"
                    value={addressFormData.phoneNumber}
                    onChange={e => setAddressFormData({ ...addressFormData, phoneNumber: e.target.value })}
                    placeholder="Phone number"
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Coordinates</label>
                <input
                  required
                  type="text"
                  value={addressFormData.streetAddress}
                  onChange={e => setAddressFormData({ ...addressFormData, streetAddress: e.target.value })}
                  placeholder="123 Alpha Base"
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sector (City)</label>
                  <input
                    required
                    type="text"
                    value={addressFormData.city}
                    onChange={e => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Region (State)</label>
                  <input
                    required
                    type="text"
                    value={addressFormData.state}
                    onChange={e => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Index Code</label>
                  <input
                    required
                    type="text"
                    value={addressFormData.postalCode}
                    onChange={e => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                    className="w-full p-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-5 bg-gray-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressFormData.isDefault}
                  onChange={e => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-[10px] font-black uppercase text-gray-500 tracking-widest cursor-pointer select-none">Set as primary delivery vector</label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all mt-6"
              >
                {editingAddress ? 'Update Protocol' : 'Execute Inscription'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
