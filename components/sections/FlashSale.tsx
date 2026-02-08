import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { Product } from '../../types';
import { productService } from '../../services/productService';

const FlashSale: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const fetchFlashSaleProducts = async () => {
            try {
                // Fetch products with discount > 0, sorted by biggest discount
                const data = await productService.getProducts({
                    limit: 4,
                    sort: '-discount',
                    'discount[gt]': 0
                });

                if (data.products) {
                    setProducts(data.products.map(p => ({
                        ...p,
                        id: (p as any)._id || p.id,
                        image: (p as any).images?.[0]?.url || (p as any).image || '',
                        category: typeof p.category === 'string' ? p.category : (p as any).category?.name || 'All',
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch flash sale products', err);
            }
        };

        fetchFlashSaleProducts();

        // Randomize initial timer for demo effect
        setTimeLeft({
            hours: Math.floor(Math.random() * 12) + 12,
            minutes: Math.floor(Math.random() * 60),
            seconds: Math.floor(Math.random() * 60)
        });

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    seconds = 59;
                    if (minutes > 0) minutes--;
                    else {
                        minutes = 59;
                        if (hours > 0) hours--;
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (products.length === 0) return null;

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <section className="py-20 px-6 bg-primary text-sand overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-sage/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-sage p-3 rounded-full animate-pulse">
                            <Zap className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Flash Sale</h2>
                            <p className="text-sand/60 font-sans text-sm tracking-wide uppercase">Limited Time Offers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {[
                                { label: 'Hrs', value: timeLeft.hours },
                                { label: 'Min', value: timeLeft.minutes },
                                { label: 'Sec', value: timeLeft.seconds }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold font-mono">
                                        {formatTime(item.value)}
                                    </div>
                                    <span className="text-[10px] uppercase tracking-tighter mt-1 text-sand/40">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/products" className="hidden md:flex items-center gap-2 text-sand/80 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1">
                        View All Offers <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {products.map((product) => (
                        <div key={product.id} className="relative group">
                            <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-lg">
                                Save {product.discount}%
                            </div>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </motion.div>

                <div className="mt-12 text-center md:hidden">
                    <Link to="/products" className="bg-sand text-primary px-8 py-3 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-sage hover:text-white transition-all">
                        View All Offers
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FlashSale;
