import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { adService, Ad } from '../../services/adService';

const AdBanner: React.FC = () => {
    const [bannerAd, setBannerAd] = useState<Ad | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const ads = await adService.getActiveAds();
                const banner = ads.find(ad => ad.type === 'banner');
                if (banner) setBannerAd(banner);
            } catch (err) {
                console.error('Failed to load banner transmission');
            }
        };
        fetchBanner();
    }, []);

    if (!bannerAd) return null;

    return (
        <section className="max-w-[1800px] mx-auto px-6 lg:px-12 my-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-slate-950 rounded-[3.5rem] overflow-hidden relative group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-12 lg:p-24 flex flex-col justify-center relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8">Signal Promotion</span>
                        <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 group-hover:text-indigo-400 transition-colors">
                            {bannerAd.title}
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 max-w-md">
                            {bannerAd.description}
                        </p>
                        <div>
                            <a
                                href={bannerAd.link}
                                className="inline-flex items-center gap-6 bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 group"
                            >
                                <span>Access Index</span>
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="relative h-96 lg:h-auto overflow-hidden">
                        <img
                            src={bannerAd.image.url}
                            alt={bannerAd.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[4000ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent lg:block hidden" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdBanner;
