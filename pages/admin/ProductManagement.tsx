import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import ProductModal from '../../components/admin/ProductModal';

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts({ limit: 100 });
            setProducts(data.products);
        } catch (err: any) {
            setError(err.message || 'Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (p: Product | null = null) => {
        setSelectedProduct(p);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveSuccess = () => {
        fetchProducts(); // Re-fetch products to update the list
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to decommission this artifact?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (err: any) {
                alert('Action failed: ' + err.message);
            }
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Inventory Ledger</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage and refine your product collective.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>Inscribe New Object</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by ID or Name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Artifact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Series</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={p.images?.[0]?.url || p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 flex items-center gap-2">
                                                    {p.name}
                                                    {p.isHero && (
                                                        <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Hero</span>
                                                    )}
                                                </h4>
                                                <span className="text-[10px] font-mono text-slate-400">#{p._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                            {typeof p.category === 'string' ? p.category : p.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 font-black text-slate-900 text-sm">
                                        ${p.price.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-sm font-bold text-slate-600">{p.stock} Units</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(p)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <ProductModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default ProductManagement;
