import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    X,
    Tag
} from 'lucide-react';
import { productService } from '../../services/productService';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentCategory: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await productService.getCategories();
            setCategories(data);
        } catch (err: any) {
            console.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cat: any = null) => {
        if (cat) {
            setSelectedCategory(cat);
            setFormData({
                name: cat.name,
                slug: cat.slug || '',
                description: cat.description || '',
                parentCategory: cat.parentCategory?._id || cat.parentCategory || ''
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                parentCategory: ''
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedData = {
                ...formData,
                parentCategory: formData.parentCategory === '' ? null : formData.parentCategory
            };

            if (selectedCategory) {
                await productService.updateCategory(selectedCategory._id, sanitizedData);
            } else {
                await productService.createCategory(sanitizedData);
            }
            setModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            alert('Action failed: ' + err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this classification?')) {
            try {
                await productService.deleteCategory(id);
                setCategories(prev => prev.filter(c => c._id !== id));
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Classification Matrix</h1>
                    <p className="text-slate-400 text-sm font-medium">Define the taxonomy of your artifact collection.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Classification</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Categories List */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Depth</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                                    <Tag className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                                                    <p className="text-xs text-slate-400 line-clamp-1">{c.description || 'No definition set'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {c.parentCategory ? (
                                                <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">
                                                    Sub / {typeof c.parentCategory === 'string' ? 'Parent' : c.parentCategory.name}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase tracking-widest">
                                                    Root Index
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-4 font-mono text-[10px] text-slate-400">
                                            {c.slug || c._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(c)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c._id)}
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

                {/* Info / Tips */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-fit">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Taxonomy Rules</h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black">1</div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Root categories define the main navigational pillars of the marketplace.</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black">2</div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Nested classifications appear as sub-filters in the artifact collective.</p>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black">3</div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Slugs must be unique and are used for SEO-optimized URL routing.</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                                {selectedCategory ? 'Modify Index' : 'New Classification'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Master Electronics"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Identifier (Slug)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. master-electronics"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Index</label>
                                <select
                                    value={formData.parentCategory}
                                    onChange={e => setFormData({ ...formData, parentCategory: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    <option value="">None (Root Category)</option>
                                    {categories.filter(c => c._id !== selectedCategory?._id).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Definition</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief category summary..."
                                    rows={3}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all mt-4"
                            >
                                {selectedCategory ? 'Commit Changes' : 'Execute Inscription'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
