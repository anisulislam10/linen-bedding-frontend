import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Tag,
    LogOut,
    ChevronLeft,
    MessageSquare,
    Megaphone,
    Heart,
    MessageCircle,
    RotateCcw,
    CreditCard,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();

    const navItems = [
        { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { title: 'Products', path: '/admin/products', icon: Package },
        { title: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { title: 'Return Requests', path: '/admin/returns', icon: RotateCcw },
        { title: 'Users', path: '/admin/users', icon: Users },
        { title: 'Categories', path: '/admin/categories', icon: Tag },
        { title: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
        { title: 'Testimonials', path: '/admin/testimonials', icon: MessageCircle },
        { title: 'Settings', path: '/admin/settings', icon: Settings },
        { title: 'Wishlist', path: '/admin/wishlist', icon: Heart },
        { title: 'Ad Management', path: '/admin/ads', icon: Megaphone },
        // { title: 'Stock Inventory', path: '/admin/inventory', icon: Package },

    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
                    Avenly by Huma<span className="text-indigo-500">.</span> Admin
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
