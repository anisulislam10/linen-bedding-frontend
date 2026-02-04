import React, { useEffect, useState } from 'react';
import { testimonialService, Testimonial } from '../../services/testimonialService';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await testimonialService.getTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error('Failed to load testimonials:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-sand/30">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-sand/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-primary/70 max-w-2xl mx-auto">
                        Discover why thousands choose us for sustainable luxury
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial._id}
                            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-16 h-16 text-sage" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current text-muted-gold" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-primary/80 mb-6 italic leading-relaxed relative z-10">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                {testimonial.avatar && (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <h4 className="font-serif font-semibold text-primary">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-primary/60">
                                        {testimonial.role}
                                        {testimonial.company && `, ${testimonial.company}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
