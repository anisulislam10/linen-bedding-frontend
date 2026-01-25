import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const ContentManagement: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const [formData, setFormData] = useState({
        collectiveIndex: {
            title: '',
            description: '',
            buttonText: '',
            image: ''
        },
        siteSettings: {
            siteName: '',
            seoKeywords: '',
            logoUrl: ''
        },
        latestAdditions: {
            count: 6
        },
        flashSale: {
            enabled: true,
            endTime: '',
            title: 'Flash Artifacts',
            subtitle: 'Limited Availability',
            products: [] as string[] // Product IDs
        },
        footer: {
            description: '',
            socialLinks: {
                facebook: '',
                twitter: '',
                instagram: '',
                github: ''
            },
            newsletterText: '',
            copyrightText: ''
        }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const [content, productsData] = await Promise.all([
                contentService.getContent('home_page'),
                productService.getProducts({ limit: 100 })
            ]);
            setAllProducts(productsData.products);

            if (content) {
                setFormData({
                    collectiveIndex: {
                        title: content.collectiveIndex?.title || '',
                        description: content.collectiveIndex?.description || '',
                        buttonText: content.collectiveIndex?.buttonText || '',
                        image: content.collectiveIndex?.image || ''
                    },
                    siteSettings: {
                        siteName: content.siteSettings?.siteName || '',
                        seoKeywords: content.siteSettings?.seoKeywords || '',
                        logoUrl: content.siteSettings?.logoUrl || ''
                    },
                    latestAdditions: {
                        count: content.latestAdditions?.count || 6
                    },
                    flashSale: {
                        enabled: content.flashSale?.enabled ?? true,
                        endTime: content.flashSale?.endTime ? new Date(content.flashSale.endTime).toISOString().slice(0, 16) : '',
                        title: content.flashSale?.title || 'Flash Artifacts',
                        subtitle: content.flashSale?.subtitle || 'Limited Availability',
                        products: content.flashSale?.products?.map((p: any) => typeof p === 'string' ? p : p._id) || []
                    },
                    footer: {
                        description: content.footer?.description || '',
                        socialLinks: {
                            facebook: content.footer?.socialLinks?.facebook || '',
                            twitter: content.footer?.socialLinks?.twitter || '',
                            instagram: content.footer?.socialLinks?.instagram || '',
                            github: content.footer?.socialLinks?.github || ''
                        },
                        newsletterText: content.footer?.newsletterText || '',
                        copyrightText: content.footer?.copyrightText || ''
                    }
                });
                setPreview(content.collectiveIndex?.image);
                setLogoPreview(content.siteSettings?.logoUrl);
            }
        } catch (err) {
            console.error('Failed to load content', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'logo') => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'image') {
                    setFile(selectedFile);
                    setPreview(reader.result as string);
                } else {
                    setLogoFile(selectedFile);
                    setLogoPreview(reader.result as string);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            // Collective Index
            data.append('collectiveIndex[title]', formData.collectiveIndex.title);
            data.append('collectiveIndex[description]', formData.collectiveIndex.description);
            data.append('collectiveIndex[buttonText]', formData.collectiveIndex.buttonText);

            // Site Settings
            data.append('siteSettings[siteName]', formData.siteSettings.siteName);
            data.append('siteSettings[seoKeywords]', formData.siteSettings.seoKeywords);

            // Latest Additions
            data.append('latestAdditions[count]', formData.latestAdditions.count.toString());

            // Flash Sale (Stringified JSON)
            data.append('flashSale', JSON.stringify(formData.flashSale));

            // Footer (Stringified JSON)
            data.append('footer', JSON.stringify(formData.footer));

            if (file) {
                data.append('image', file);
            }
            if (logoFile) {
                data.append('logo', logoFile);
            }

            const updated = await contentService.updateContent('home_page', data);
            setFormData(prev => ({
                ...prev,
                collectiveIndex: {
                    ...prev.collectiveIndex,
                    image: updated.collectiveIndex.image
                },
                siteSettings: {
                    ...prev.siteSettings,
                    logoUrl: updated.siteSettings?.logoUrl
                }
            }));
            alert('Content updated successfully');
        } catch (err: any) {
            alert('Failed to update content: ' + err.message);
        } finally {
            setSaving(false);
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
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">CMS Console</h1>
                <p className="text-slate-400 text-sm font-medium">Manage dynamic content blocks.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-16 divide-y divide-slate-100">
                {/* Site Identity Section */}
                <section className="pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Site Identity & SEO
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Site Name</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                                    value={formData.siteSettings.siteName}
                                    onChange={e => setFormData({
                                        ...formData,
                                        siteSettings: { ...formData.siteSettings, siteName: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SEO Keywords</label>
                                <textarea
                                    rows={3}
                                    placeholder="luxury, bedding, artifacts..."
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                    value={formData.siteSettings.seoKeywords}
                                    onChange={e => setFormData({
                                        ...formData,
                                        siteSettings: { ...formData.siteSettings, seoKeywords: e.target.value }
                                    })}
                                />
                                <p className="text-[10px] text-slate-400 mt-2">Comma separated keywords for search engines.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Site Logo</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-xs font-bold text-slate-300">No Logo</span>
                                    )}
                                </div>
                                <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-all flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Logo</span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Catalog Configuration */}
                <section className="pt-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Catalog Configuration
                    </h3>
                    <div className="max-w-md">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Latest Additions Count</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="4"
                                max="20"
                                step="2"
                                className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                value={formData.latestAdditions.count}
                                onChange={e => setFormData({
                                    ...formData,
                                    latestAdditions: { ...formData.latestAdditions, count: parseInt(e.target.value) }
                                })}
                            />
                            <span className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-900 border border-slate-100">
                                {formData.latestAdditions.count}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Controls how many recent products are shown on the homepage.</p>
                    </div>
                </section>

                {/* Flash Artifacts Configuration */}
                <section className="pt-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Flash Artifacts (Sale)
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                    checked={formData.flashSale.enabled}
                                    onChange={e => setFormData({
                                        ...formData,
                                        flashSale: { ...formData.flashSale, enabled: e.target.checked }
                                    })}
                                />
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Enable Flash Section</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">End Time (Countdown)</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                    value={formData.flashSale.endTime}
                                    onChange={e => setFormData({
                                        ...formData,
                                        flashSale: { ...formData.flashSale, endTime: e.target.value }
                                    })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Section Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.flashSale.title}
                                    onChange={e => setFormData({
                                        ...formData,
                                        flashSale: { ...formData.flashSale, title: e.target.value }
                                    })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Select Products ({formData.flashSale.products.length})</label>
                            <div className="bg-slate-50 rounded-2xl p-4 h-80 overflow-y-auto space-y-2 border border-slate-100">
                                {allProducts.map(product => (
                                    <label key={product._id} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors border border-slate-100">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-indigo-600 rounded"
                                            checked={formData.flashSale.products.includes(product._id)}
                                            onChange={e => {
                                                const id = product._id;
                                                const current = formData.flashSale.products;
                                                const newProducts = e.target.checked
                                                    ? [...current, id]
                                                    : current.filter(pid => pid !== id);
                                                setFormData({
                                                    ...formData,
                                                    flashSale: { ...formData.flashSale, products: newProducts }
                                                });
                                            }}
                                        />
                                        <img src={product.images?.[0]?.url} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-200" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">${product.price}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-right">Selected products will appear in Flash section.</p>
                        </div>
                    </div>
                </section>

                {/* Collective Index Section */}
                <section className="pt-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Collective Index Configuration
                    </h3>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Section Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                                        value={formData.collectiveIndex.title}
                                        onChange={e => setFormData({
                                            ...formData,
                                            collectiveIndex: { ...formData.collectiveIndex, title: e.target.value }
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description Text</label>
                                    <textarea
                                        rows={4}
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        value={formData.collectiveIndex.description}
                                        onChange={e => setFormData({
                                            ...formData,
                                            collectiveIndex: { ...formData.collectiveIndex, description: e.target.value }
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Button Label</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={formData.collectiveIndex.buttonText}
                                        onChange={e => setFormData({
                                            ...formData,
                                            collectiveIndex: { ...formData.collectiveIndex, buttonText: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Background Imagery</label>
                                <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-black uppercase tracking-widest">Change Asset</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium text-center">Recommended: 2000x2500px, WebP/JPG</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Configuration */}
                <section className="pt-8 pb-12">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Footer Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Footer Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold resize-none"
                                    value={formData.footer.description}
                                    onChange={e => setFormData({
                                        ...formData,
                                        footer: { ...formData.footer, description: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Newsletter Subtext</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.footer.newsletterText}
                                    onChange={e => setFormData({
                                        ...formData,
                                        footer: { ...formData.footer, newsletterText: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Copyright Line</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.footer.copyrightText}
                                    onChange={e => setFormData({
                                        ...formData,
                                        footer: { ...formData.footer, copyrightText: e.target.value }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Social Links</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['facebook', 'twitter', 'instagram', 'github'].map(platform => (
                                    <div key={platform}>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{platform}</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold"
                                            value={(formData.footer.socialLinks as any)[platform]}
                                            onChange={e => setFormData({
                                                ...formData,
                                                footer: {
                                                    ...formData.footer,
                                                    socialLinks: { ...formData.footer.socialLinks, [platform]: e.target.value }
                                                }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-8 border-t border-slate-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Publish Updates</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContentManagement;
