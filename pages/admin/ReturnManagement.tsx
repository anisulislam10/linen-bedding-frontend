// Return Management Component
import React, { useState, useEffect } from 'react';
import {
    RotateCcw,
    Search,
    Filter,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    AlertCircle,
    User,
    Package,
    ArrowUpRight,
    X,
    MessageSquare,
    DollarSign
} from 'lucide-react';
import { returnService, ReturnRequest } from '../../services/returnService';
import toast from 'react-hot-toast';

const ReturnManagement: React.FC = () => {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const data = await returnService.getAllReturns();
            setReturns(data);
        } catch (err: any) {
            toast.error('Failed to fetch return requests');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedReturn || !newStatus) return;

        try {
            setUpdateLoading(true);
            await returnService.updateReturnStatus(selectedReturn._id, newStatus, adminNotes);
            toast.success('Return status updated');
            setIsStatusModalOpen(false);
            setAdminNotes('');
            fetchReturns();
        } catch (err: any) {
            toast.error('Failed to update status');
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredReturns = returns.filter(ret => {
        const matchesSearch =
            ret._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.order?._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || ret.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Processing': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock className="w-3 h-3" /> };
            case 'Approved': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle2 className="w-3 h-3" /> };
            case 'Returned': return { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <RefreshCcw className="w-3 h-3" /> };
            case 'Refunded': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <DollarSign className="w-3 h-3" /> };
            case 'Rejected': return { bg: 'bg-rose-100', text: 'text-rose-700', icon: <XCircle className="w-3 h-3" /> };
            default: return { bg: 'bg-slate-100', text: 'text-slate-700', icon: <AlertCircle className="w-3 h-3" /> };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Return Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Process and manage customer return requests</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex">
                        {['All', 'Processing', 'Approved', 'Refunded'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: returns.length, icon: RotateCcw, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Pending Process', value: returns.filter(r => r.status === 'Processing').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Approved', value: returns.filter(r => r.status === 'Approved').length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Completed', value: returns.filter(r => r.status === 'Refunded').length, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-[1.25rem] flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, Customer Name, or Order ID..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                </button>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Return ID</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Info</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-8 py-6"><div className="h-12 bg-slate-50 rounded-xl w-full"></div></td>
                                </tr>
                            ))
                        ) : filteredReturns.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <RotateCcw className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No return requests detected</p>
                                </td>
                            </tr>
                        ) : (
                            filteredReturns.map((ret) => {
                                const status = getStatusStyles(ret.status);
                                return (
                                    <tr key={ret._id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <p className="font-mono text-xs font-bold text-slate-600 uppercase">#{ret._id.slice(-8)}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-bold">{new Date(ret.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{ret.user?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{ret.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-mono font-bold text-indigo-600">ORD-{ret.order?._id?.slice(-6).toUpperCase()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Items: {ret.order?.items?.length || 0}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <MessageSquare className="w-4 h-4 text-slate-300 mt-0.5" />
                                                <p className="text-xs text-slate-600 font-medium line-clamp-2">{ret.reason}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                                                {status.icon}
                                                {ret.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => {
                                                    setSelectedReturn(ret);
                                                    setNewStatus(ret.status);
                                                    setAdminNotes(ret.adminNotes || '');
                                                    setIsStatusModalOpen(true);
                                                }}
                                                className="p-2 hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl transition-all"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Status Modal */}
            {isStatusModalOpen && selectedReturn && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Update Return</h2>
                            <button onClick={() => setIsStatusModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            {/* Summary */}
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                                    <p className="text-lg font-black text-slate-900">{selectedReturn.status}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Status Protocol</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Processing', 'Approved', 'Returned', 'Refunded', 'Rejected'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setNewStatus(status)}
                                            className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center border-2 ${newStatus === status
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Resolution Inscription</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this return..."
                                    rows={4}
                                    className="w-full p-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner resize-none"
                                />
                            </div>

                            <button
                                onClick={handleUpdateStatus}
                                disabled={updateLoading}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-50"
                            >
                                {updateLoading ? 'Transmitting Updates...' : 'Execute Status Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnManagement;
