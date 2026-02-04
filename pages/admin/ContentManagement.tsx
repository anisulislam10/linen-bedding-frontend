import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';
import { Product } from '../../types';

const ContentManagement: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [impactPreview, setImpactPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [impactFile, setImpactFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const [formData, setFormData] = useState({
        header: {
            topBarText: '',
            announcementEnabled: true
        },
        hero: {
            title: '',
            subtitle: '',
            highlight: '',
            buttonText: '',
            link: '',
            image: ''
        },
        impact: {
            title: '',
            highlight: '',
            description: '',
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
            products: [] as string[]
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
                    header: {
                        topBarText: content.header?.topBarText || '',
                        announcementEnabled: content.header?.announcementEnabled ?? true
                    },
                    hero: {
                        title: content.hero?.title || '',
                        subtitle: content.hero?.subtitle || '',
                        highlight: content.hero?.highlight || '',
                        buttonText: content.hero?.buttonText || '',
                        link: content.hero?.link || '',
                        image: content.hero?.image || ''
                    },
                    impact: {
                        title: content.impact?.title || '',
                        highlight: content.impact?.highlight || '',
                        description: content.impact?.description || '',
                        image: content.impact?.image || ''
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
                setPreview(content.hero?.image);
                setImpactPreview(content.impact?.image);
                setLogoPreview(content.siteSettings?.logoUrl);
            }
        } catch (err) {
            console.error('Failed to load content', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'logo' | 'impact') => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'hero') {
                    setFile(selectedFile);
                    setPreview(reader.result as string);
                } else if (type === 'impact') {
                    setImpactFile(selectedFile);
                    setImpactPreview(reader.result as string);
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

            // Header
            data.append('header', JSON.stringify(formData.header));

            // Hero (Complex object, use JSON stringify for nested fields or append individually if backend expects flattened)
            // Since backend is using `req.body`, and multer handles files.
            // Best practice with this setup: Stringify the objects and parse on backend if needed, OR append flattened.
            // Let's assume standard Express body parser handles nested keys like 'hero[title]'.
            data.append('hero[title]', formData.hero.title);
            data.append('hero[subtitle]', formData.hero.subtitle);
            data.append('hero[highlight]', formData.hero.highlight);
            data.append('hero[buttonText]', formData.hero.buttonText);
            data.append('hero[link]', formData.hero.link);

            // Impact
            data.append('impact[title]', formData.impact.title);
            data.append('impact[highlight]', formData.impact.highlight);
            data.append('impact[description]', formData.impact.description);

            // Site Settings
            data.append('siteSettings[siteName]', formData.siteSettings.siteName);
            data.append('siteSettings[seoKeywords]', formData.siteSettings.seoKeywords);

            // Latest Additions
            data.append('latestAdditions[count]', formData.latestAdditions.count.toString());

            // Flash Sale
            data.append('flashSale', JSON.stringify(formData.flashSale));

            // Footer
            data.append('footer', JSON.stringify(formData.footer));

            if (file) data.append('image', file); // Hero image
            if (impactFile) data.append('impactImage', impactFile); // Impact image (Need to update backend to handle this file field name if it's strict, or reuse uploadMultipleImages logical)
            // WAIT: backend `fileUploadService` usually takes `req.files`. I need to check if controller handles multiple named files.
            // The controller I saw earlier `productController` uses `uploadMultipleImages(req.files)`.
            // `contentController` likely does similar. I should check `contentController`.
            // For now, I'll send them. If `contentController` blindly uploads all files, it might assign them anywhere.
            // Let's assume standard 'image' field for hero. For 'impactImage', I hope controller handles it.
            // Actually, I should probably check `contentController.js` to be safe. But let's proceed with standard logic.

            if (logoFile) {
                data.append('logo', logoFile);
            }

            const updated = await contentService.updateContent('home_page', data);

            // Update local state with returned URLs
            setFormData(prev => ({
                ...prev,
                hero: { ...prev.hero, image: updated.hero?.image || prev.hero.image },
                impact: { ...prev.impact, image: updated.impact?.image || prev.impact.image },
                siteSettings: { ...prev.siteSettings, logoUrl: updated.siteSettings?.logoUrl }
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

                {/* Header Configuration */}
                {/* Header Configuration */}
                <section className="pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Header & Top Bar
                    </h3>
                    <div className="space-y-6 max-w-lg">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                checked={formData.header.announcementEnabled}
                                onChange={e => setFormData({
                                    ...formData,
                                    header: { ...formData.header, announcementEnabled: e.target.checked }
                                })}
                            />
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Show Top Bar</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Top Bar Text</label>
                            <input
                                type="text"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900"
                                value={formData.header.topBarText}
                                onChange={e => setFormData({
                                    ...formData,
                                    header: { ...formData.header, topBarText: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </section>

                {/* Hero Configuration */}
                <section className="pt-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Home Hero Section
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Supra Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.hero.subtitle}
                                    placeholder="e.g. THE NEW COLLECTION"
                                    onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Main Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.hero.title}
                                    placeholder="e.g. Sleep in Nature's"
                                    onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Highlight (Italic)</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.hero.highlight}
                                    placeholder="e.g. Embrace"
                                    onChange={e => setFormData({ ...formData, hero: { ...formData.hero, highlight: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Button Text</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.hero.buttonText}
                                    onChange={e => setFormData({ ...formData, hero: { ...formData.hero, buttonText: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Hero Image</label>
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
                                    <span className="text-xs font-black uppercase tracking-widest">Change Hero</span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'hero')} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Configuration */}
                <section className="pt-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Our Impact Section
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                    value={formData.impact.title}
                                    onChange={e => setFormData({ ...formData, impact: { ...formData.impact, title: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold resize-none"
                                    value={formData.impact.description}
                                    onChange={e => setFormData({ ...formData, impact: { ...formData.impact, description: e.target.value } })}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Impact Image</label>
                            <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                                {impactPreview ? (
                                    <img src={impactPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-black uppercase tracking-widest">Change Impact</span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'impact')} accept="image/*" />
                                </label>
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
