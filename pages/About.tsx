import React from 'react';
import { Leaf, Heart, Users, Award } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2457&auto=format&fit=crop"
                    alt="About Yumeko"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                        <h1 className="text-5xl md:text-7xl font-serif mb-4">Read Our Story</h1>
                        <p className="text-xl md:text-2xl tracking-wide">Sustainable Luxury Since 2020</p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8">
                        Sleep Sustainably, Dream Beautifully
                    </h2>
                    <p className="text-lg text-primary/70 leading-relaxed">
                        We believe luxury and sustainability should go hand in hand. Founded in 2020,
                        Yumeko was born from a simple idea: create beautiful, eco-friendly bedding that
                        doesn't compromise on quality or ethics. Every product we make is a testament to
                        our commitment to the planet and the people who inhabit it.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-16 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-serif text-primary mb-3">Sustainability</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                100% organic materials, zero-waste production, and carbon-neutral shipping
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-serif text-primary mb-3">Quality</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Premium fabrics that last for years, becoming softer with every wash
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-serif text-primary mb-3">Ethics</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Fair Trade partnerships ensuring dignity and living wages for all workers
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-sage" />
                            </div>
                            <h3 className="text-xl font-serif text-primary mb-3">Transparency</h3>
                            <p className="text-primary/60 text-sm leading-relaxed">
                                Full supply chain visibility - we know where every thread comes from
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif text-primary mb-6">How We Started</h2>
                            <p className="text-primary/70 leading-relaxed mb-4">
                                Our founder, inspired by a journey through European linen fields, realized that
                                the textile industry could be reimagined. Traditional luxury bedding was either
                                prohibitively expensive or environmentally destructive. There had to be a better way.
                            </p>
                            <p className="text-primary/70 leading-relaxed">
                                After two years of research, connecting with organic farmers, and developing relationships
                                with Fair Trade certified manufacturers, Yumeko was born. We launched with a single product:
                                our signature organic linen duvet cover. The response was overwhelming.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-serif text-primary mb-6">Our Commitment</h2>
                            <p className="text-primary/70 leading-relaxed mb-4">
                                Today, we're proud to be one of the leading sustainable bedding brands. But we're not
                                stopping here. We continuously invest in greener production methods, support regenerative
                                agriculture, and work towards a fully circular economy.
                            </p>
                            <p className="text-primary/70 leading-relaxed">
                                Every purchase supports organic farming practices, reduces carbon emissions, and provides
                                fair wages to textile workers. When you choose Yumeko, you're not just investing in better
                                sleep—you're investing in a better future.
                            </p>
                        </div>

                        {/* Impact Stats */}
                        <div className="bg-sage/10 p-8 md:p-12 rounded-lg">
                            <h3 className="text-2xl font-serif text-primary mb-8 text-center">Our Impact So Far</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <div className="text-4xl font-serif text-sage mb-2">50,000+</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Happy Customers</p>
                                </div>
                                <div>
                                    <div className="text-4xl font-serif text-sage mb-2">100%</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Organic Materials</p>
                                </div>
                                <div>
                                    <div className="text-4xl font-serif text-sage mb-2">Carbon Neutral</div>
                                    <p className="text-primary/60 text-sm uppercase tracking-wider">Since Day One</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-white">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-serif mb-6">
                        Join Our Sustainable Sleep Movement
                    </h2>
                    <p className="text-white/80 mb-8 leading-relaxed">
                        Discover our collection of eco-luxury bedding and experience the difference
                        that conscious choices can make.
                    </p>
                    <a
                        href="/#/products"
                        className="inline-block bg-white text-primary px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sand transition-colors"
                    >
                        Shop Our Collection
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
