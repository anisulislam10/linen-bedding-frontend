import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { adminService, AdminStats } from '../../services/adminService';
import { analyticsService } from '../../services/analyticsService';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, analyticsData] = await Promise.all([
                adminService.getDashboardStats(),
                analyticsService.getAnalytics('daily', parseInt(period))
            ]);
            setStats(statsData);
            setAnalytics(analyticsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-96 bg-slate-200 rounded-2xl"></div>
            </div>
        );
    }

    if (error || !stats || !analytics) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Error Accessing Data</h3>
                <p>{error || 'Unable to load dashboard'}</p>
            </div>
        );
    }

    // Format daily data for charts
    const formattedDailyData = analytics.dailyData.map((item: any) => ({
        date: `${item._id.month}/${item._id.day}`,
        revenue: item.revenue,
        orders: item.orders
    }));

    // Format category data for pie chart
    const categoryData = analytics.categoryStats.map((item: any) => ({
        name: item._id,
        value: item.revenue
    }));

    // Format top products
    const topProductsChart = analytics.topProducts.slice(0, 5).map((item: any) => ({
        name: item.product.name.substring(0, 20),
        revenue: item.totalRevenue,
        quantity: item.totalQuantity
    }));

    const statCards = [
        {
            label: 'Total Revenue',
            value: `$${stats.stats.totalRevenue.toLocaleString()}`,
            growth: analytics.growth.revenue,
            icon: DollarSign,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            label: 'Total Orders',
            value: stats.stats.totalOrders.toString(),
            growth: analytics.growth.orders,
            icon: ShoppingBag,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        },
        {
            label: 'Total Customers',
            value: stats.stats.totalUsers.toString(),
            growth: '+12.5',
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Products',
            value: stats.stats.totalProducts.toString(),
            growth: '+5.2',
            icon: Package,
            color: 'bg-amber-500',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase mb-2">Analytics Dashboard</h1>
                    <p className="text-slate-500 font-medium">Comprehensive business metrics and insights</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.color} p-3 rounded-2xl text-white`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center space-x-1 ${parseFloat(card.growth) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {parseFloat(card.growth) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                <span className="text-sm font-bold">{Math.abs(parseFloat(card.growth))}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {card.label}
                            </p>
                            <h4 className="text-3xl font-bold text-slate-900 tracking-tighter">
                                {card.value}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Over Time */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-6">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={formattedDailyData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Over Time */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-6">Order Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={formattedDailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales by Category */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-6">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => entry.name}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-6">Top Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProductsChart} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 uppercase tracking-tight">Recent Orders</h3>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-4 font-mono text-[10px] text-slate-400">
                                        {order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-4 font-bold text-slate-700 text-sm">
                                        {order.user?.name || 'Guest'}
                                    </td>
                                    <td className="px-8 py-4 font-bold text-slate-900 text-sm">
                                        ${order.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
