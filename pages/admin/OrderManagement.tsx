import React, { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    ExternalLink,
    ChevronRight,
    Loader2,
    Calendar
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load order ledger');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await orderService.updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: status as any } : o));
        } catch (err: any) {
            alert('Action failed: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Logistic Registry</h1>
                    <p className="text-slate-400 text-sm font-medium">Monitor and facilitate global deliveries.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Trace order by ID or User..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracing ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consignee</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Flow Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((o) => (
                                <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4 font-mono text-[10px] text-indigo-600 font-black">
                                        #{o._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-2 text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{new Date(o.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-sm">{o.user?.name || 'Guest'}</span>
                                            <span className="text-[10px] text-slate-400">{o.user?.email || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 font-black text-slate-900 text-sm">
                                        ${o.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center justify-end">
                                            <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
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

export default OrderManagement;
