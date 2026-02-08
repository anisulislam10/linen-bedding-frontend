import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';
import { Product } from '../../types';

interface HeroSlide {
    title: string;
    subtitle: string;
    highlight: string;
    description: string;
    buttonText: string;
    link: string;
    image: string;
}

const ContentManagement: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Legacy Single Hero Previews
    const [preview, setPreview] = useState<string | null>(null);
    const [impactPreview, setImpactPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // File States
    const [file, setFile] = useState<File | null>(null);
    const [impactFile, setImpactFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Hero Slides States
    const [slidePreviews, setSlidePreviews] = useState<(string | null)[]>([]);
    const [slideFiles, setSlideFiles] = useState<(File | null)[]>([]);

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
        heroSlides: [] as HeroSlide[],
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
                const fetchedSlides = content.heroSlides || [];
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
                    heroSlides: fetchedSlides,
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
                setSlidePreviews(fetchedSlides.map((s: any) => s.image || null));
                setSlideFiles(new Array(fetchedSlides.length).fill(null));
            }
        } catch (err) {
            console.error('Failed to load content', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'logo' | 'impact' | 'slide', index?: number) => {
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
                } else if (type === 'logo') {
                    setLogoFile(selectedFile);
                    setLogoPreview(reader.result as string);
                } else if (type === 'slide' && index !== undefined) {
                    const newFiles = [...slideFiles];
                    newFiles[index] = selectedFile;
                    setSlideFiles(newFiles);

                    const newPreviews = [...slidePreviews];
                    newPreviews[index] = reader.result as string;
                    setSlidePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const addSlide = () => {
        setFormData(prev => ({
            ...prev,
            heroSlides: [...prev.heroSlides, {
                title: '',
                subtitle: '',
                highlight: '',
                description: '',
                buttonText: 'View More',
                link: '/products',
                image: ''
            }]
        }));
        setSlidePreviews(prev => [...prev, null]);
        setSlideFiles(prev => [...prev, null]);
    };

    const removeSlide = (index: number) => {
        setFormData(prev => ({
            ...prev,
            heroSlides: prev.heroSlides.filter((_, i) => i !== index)
        }));
        setSlidePreviews(prev => prev.filter((_, i) => i !== index));
        setSlideFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...formData.heroSlides];
        const newPreviews = [...slidePreviews];
        const newFiles = [...slideFiles];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newSlides.length) {
            [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
            [newPreviews[index], newPreviews[targetIndex]] = [newPreviews[targetIndex], newPreviews[index]];
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];

            setFormData(prev => ({ ...prev, heroSlides: newSlides }));
            setSlidePreviews(newPreviews);
            setSlideFiles(newFiles);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();

            data.append('header', JSON.stringify(formData.header));
            data.append('hero', JSON.stringify(formData.hero));
            data.append('heroSlides', JSON.stringify(formData.heroSlides));
            data.append('impact', JSON.stringify(formData.impact));
            data.append('siteSettings', JSON.stringify(formData.siteSettings));
            data.append('latestAdditions', JSON.stringify(formData.latestAdditions));
            data.append('flashSale', JSON.stringify(formData.flashSale));
            data.append('footer', JSON.stringify(formData.footer));

            if (file) data.append('image', file);
            if (impactFile) data.append('impactImage', impactFile);
            if (logoFile) data.append('logo', logoFile);

            // Append slide images with dynamic keys: slideImage0, slideImage1...
            slideFiles.forEach((f, i) => {
                if (f) data.append(`slideImage${i}`, f);
            });

            const updated = await contentService.updateContent('home_page', data);

            // Fetch again to ensure sync
            fetchContent();
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
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">CMS Console</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage dynamic content blocks.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Publish Changes</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-12">

                {/* 1. Hero Slides Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1 h-3 bg-indigo-500"></div>
                            Hero Slider Builder
                        </h3>
                        <button
                            type="button"
                            onClick={addSlide}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase transition-all hover:bg-indigo-600"
                        >
                            <Plus className="w-4 h-4" /> Add Slide
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.heroSlides.map((slide, index) => (
                            <div key={index} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative group transition-all hover:shadow-md">
                                {/* Slide Controls */}
                                <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(index, 'down')}
                                        disabled={index === formData.heroSlides.length - 1}
                                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeSlide(index)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slide Image</label>
                                        <div className="aspect-[4/5] bg-slate-200/50 rounded-2xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                                            {slidePreviews[index] ? (
                                                <img src={slidePreviews[index]!} alt="Slide" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                    <ImageIcon className="w-10 h-10" />
                                                </div>
                                            )}
                                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                <Upload className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'slide', index)} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Inputs */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Supra Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
                                                    value={slide.subtitle}
                                                    onChange={e => {
                                                        const newSlides = [...formData.heroSlides];
                                                        newSlides[index].subtitle = e.target.value;
                                                        setFormData({ ...formData, heroSlides: newSlides });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highlight (Italic)</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
                                                    value={slide.highlight}
                                                    onChange={e => {
                                                        const newSlides = [...formData.heroSlides];
                                                        newSlides[index].highlight = e.target.value;
                                                        setFormData({ ...formData, heroSlides: newSlides });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Head</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-white border border-slate-100 rounded-xl text-base font-black tracking-tight"
                                                value={slide.title}
                                                onChange={e => {
                                                    const newSlides = [...formData.heroSlides];
                                                    newSlides[index].title = e.target.value;
                                                    setFormData({ ...formData, heroSlides: newSlides });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-medium resize-none"
                                                rows={2}
                                                value={slide.description}
                                                onChange={e => {
                                                    const newSlides = [...formData.heroSlides];
                                                    newSlides[index].description = e.target.value;
                                                    setFormData({ ...formData, heroSlides: newSlides });
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Button text</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
                                                    value={slide.buttonText}
                                                    onChange={e => {
                                                        const newSlides = [...formData.heroSlides];
                                                        newSlides[index].buttonText = e.target.value;
                                                        setFormData({ ...formData, heroSlides: newSlides });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold lowercase"
                                                    value={slide.link}
                                                    onChange={e => {
                                                        const newSlides = [...formData.heroSlides];
                                                        newSlides[index].link = e.target.value;
                                                        setFormData({ ...formData, heroSlides: newSlides });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {formData.heroSlides.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">No slides configured</p>
                                <button type="button" onClick={addSlide} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">+ Create first slide</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-0.5 bg-slate-50 w-full"></div>

                {/* 2. Impact Section */}
                <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Our Impact Block
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Impact Title</label>
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
                                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium resize-none"
                                    rows={5}
                                    value={formData.impact.description}
                                    onChange={e => setFormData({ ...formData, impact: { ...formData.impact, description: e.target.value } })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Impact Image</label>
                            <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                                {impactPreview ? (
                                    <img src={impactPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-center">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-black uppercase tracking-widest px-4">Change Story Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'impact')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Section (Collapsed for focus) */}
                <section className="pt-8 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <div className="w-1 h-3 bg-indigo-500"></div>
                        Basics & Footer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Site Name</label>
                            <input
                                type="text"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                value={formData.siteSettings.siteName}
                                onChange={e => setFormData({ ...formData, siteSettings: { ...formData.siteSettings, siteName: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Copyright Line</label>
                            <input
                                type="text"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold"
                                value={formData.footer.copyrightText}
                                onChange={e => setFormData({ ...formData, footer: { ...formData.footer, copyrightText: e.target.value } })}
                            />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default ContentManagement;

